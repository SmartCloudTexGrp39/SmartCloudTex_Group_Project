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

export async function register(username: string, email: string, role: string, password: string) {
  const payload = {
    username,
    email,
    role,
    password
  };

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Registration failed');
  }

  return await response.json();
}
export async function login(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed');
  }

  return await response.json();
}

export async function getProfile(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return await response.json();
}

export async function uploadFile(file: File, token: string, tags: string = '') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tags', tags);

  const response = await fetch(`${API_URL}/files/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Upload failed');
  }

  return await response.json();
}

export async function fetchMetrics() {
  try {
    const response = await fetch(`${API_URL}/files/metrics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Failed to fetch metrics: ', response.statusText);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return null;
  }
}

export async function fetchIntegrations() {
  try {
    const response = await fetch(`${API_URL}/files/integrations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return [];
  }
}

export async function disconnectIntegration(providerId: string) {
  const response = await fetch(`${API_URL}/files/integrations/disconnect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: providerId })
  });

  if (!response.ok) {
    throw new Error('Failed to disconnect');
  }

  return await response.json();
}

export async function downloadFile(fileId: string, filename: string) {
  const response = await fetch(`${API_URL}/files/download/${fileId}`);
  if (!response.ok) throw new Error("Download failed");
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function deleteFile(fileId: string, token: string) {
  const response = await fetch(`${API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "Delete failed");
  }
  return await response.json();
}

export async function shareFile(fileId: string) {
  const response = await fetch(`${API_URL}/files/share/${fileId}`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error("Share failed");
  return await response.json();
}

export async function searchFiles(query: string) {
  const response = await fetch(`${API_URL}/files/semantic-search?query=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Search failed");
  return await response.json();
}
