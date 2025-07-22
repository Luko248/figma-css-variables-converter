/**
 * GitHub API service for pushing CSS variables to repository
 */
import { base64Encode } from './utils';
import { GITHUB_CONFIG, GITHUB_API_BASE } from './config';

/** Response structure for GitHub file API */
interface GitHubFileResponse {
  sha?: string;
  content?: string;
}

/** Standardized response format for GitHub operations */
interface GitHubApiResponse {
  success: boolean;
  message: string;
  sha?: string;
}

/**
 * Checks if a file exists in the GitHub repository
 * 
 * @param filePath - Path to the file in the repository
 * @returns File information if exists, null if not found
 */
export async function checkFileExists(filePath: string): Promise<GitHubFileResponse | null> {
  try {
    const url = `${GITHUB_API_BASE}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Figma-Variables-Plugin',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (response.status === 404) {
      return null; // File doesn't exist
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { sha: string; content: string };
    return {
      sha: data.sha,
      content: data.content
    };
  } catch (error) {
    console.error('Error checking file existence:', error);
    return null;
  }
}

/**
 * Pushes CSS content to GitHub repository
 * Creates new file or updates existing file with generated CSS variables
 * 
 * @param content - CSS content to push to repository
 * @returns Result object with success status and details
 */
export async function pushToGitHub(content: string): Promise<GitHubApiResponse> {
  try {
    console.log('🚀 Starting GitHub push...');
    
    // Check if file exists to get SHA for updates
    const existingFile = await checkFileExists(GITHUB_CONFIG.path);
    const isUpdate = existingFile !== null;
    
    console.log(`📁 File ${isUpdate ? 'exists' : 'does not exist'}, ${isUpdate ? 'updating' : 'creating'}...`);
    
    const url = `${GITHUB_API_BASE}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
    
    const requestBody = {
      message: `Update CSS variables from Figma - ${new Date().toISOString()}`,
      content: base64Encode(content),
      branch: GITHUB_CONFIG.branch,
      ...(isUpdate && existingFile?.sha ? { sha: existingFile.sha } : {})
    };

    console.log('📤 Sending request to GitHub API...');
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Figma-Variables-Plugin',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json() as { 
      message?: string; 
      content?: { sha: string }; 
    };
    
    if (!response.ok) {
      console.error('❌ GitHub API error:', {
        status: response.status,
        statusText: response.statusText,
        response: responseData,
        url: url,
        token: GITHUB_CONFIG.token ? `${GITHUB_CONFIG.token.substring(0, 10)}...` : 'NO TOKEN'
      });
      return {
        success: false,
        message: `GitHub API error: ${response.status} ${response.statusText} - ${responseData.message || 'Unknown error'}`
      };
    }

    console.log('✅ Successfully pushed to GitHub!');
    
    return {
      success: true,
      message: `Successfully ${isUpdate ? 'updated' : 'created'} ${GITHUB_CONFIG.path}`,
      sha: responseData.content?.sha
    };
    
  } catch (error) {
    console.error('❌ Error pushing to GitHub:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
