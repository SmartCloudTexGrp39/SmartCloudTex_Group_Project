export const API_URL = 'http://localhost:8000';

export async function fetchFiles() {
  try {
    const response = await fetch(`${API_URL}/files/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Failed to fetch files: ', response.statusText);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
}
