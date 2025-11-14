import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7c04b577`;

// Helper function to make API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token || publicAnonKey;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error(`API error on ${endpoint}:`, data);
    throw new Error(data.error || 'API call failed');
  }

  return data;
}

// Helper function to download files (blob)
export async function apiDownload(endpoint: string, filename: string) {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token || publicAnonKey;

    console.log(`[apiDownload] Requesting: ${API_URL}${endpoint}`);
    console.log(`[apiDownload] Auth token:`, token ? 'Present' : 'Missing');

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log(`[apiDownload] Response status: ${response.status}`);
    console.log(`[apiDownload] Response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = 'Gagal mengunduh file';
      try {
        const errorText = await response.text();
        console.error(`[apiDownload] Error response body:`, errorText);
        // Try to parse as JSON
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
      } catch (e) {
        console.error(`[apiDownload] Could not read error text:`, e);
      }
      throw new Error(`${errorMessage} (Status: ${response.status})`);
    }

    // Get filename from header if available
    const contentDisposition = response.headers.get('Content-Disposition');
    let finalFilename = filename;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        finalFilename = filenameMatch[1];
      }
    }
    console.log(`[apiDownload] Final filename: ${finalFilename}`);

    const blob = await response.blob();
    console.log(`[apiDownload] Blob size: ${blob.size} bytes`);
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    console.log(`[apiDownload] Download triggered successfully`);
  } catch (error) {
    console.error(`[apiDownload] Fatal error:`, error);
    throw error;
  }
}
