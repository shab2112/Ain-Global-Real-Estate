import { driveData } from '../data/driveMockData';
import { DriveProject } from '../types';

/**
 * NOTE: This is a placeholder service to simulate fetching data from a structured
 * Google Drive account. A real implementation would use the Google Drive API
 * via a secure backend server.
 */

const apiDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Simulates fetching the list of all project folders from Google Drive.
 * @returns A promise that resolves with an array of project overviews.
 */
export const getDriveProjects = async (): Promise<Omit<DriveProject, 'assets'>[]> => {
  await apiDelay(400); // Simulate network latency
  console.log("SIMULATING: Fetched all project folders from Google Drive.");
  return driveData.map(p => ({ id: p.id, name: p.name, developer: p.developer }));
};

/**
 * Simulates fetching all assets for a specific project from its folder in Google Drive.
 * @param projectId The ID of the project to fetch assets for.
 * @returns A promise that resolves with the full project data including all assets.
 */
export const getProjectAssets = async (projectId: string): Promise<DriveProject | undefined> => {
    await apiDelay(600); // Simulate network latency
    console.log(`SIMULATING: Fetched assets for project ${projectId} from Google Drive.`);
    return driveData.find(p => p.id === projectId);
};


/**
 * Simulates uploading an image file to Google Drive.
 * @param imageDataUrl The base64 data URL of the image to upload.
 * @returns A promise that resolves with a mock file ID.
 */
export const saveToGoogleDrive = async (imageDataUrl: string): Promise<string> => {
  console.log("SIMULATING: Uploading card to Google Drive...");
  
  // In a real scenario, you would make an API call to your backend here.
  // The backend would then use the Google Drive API to upload the file.
  
  return new Promise(resolve => {
    setTimeout(() => {
      const mockFileId = `drive_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      console.log(`SIMULATION SUCCESS: File saved with mock Google Drive ID: ${mockFileId}`);
      // The content of imageDataUrl is intentionally not logged to keep the console clean.
      resolve(mockFileId);
    }, 1000); // Simulate network latency
  });
};