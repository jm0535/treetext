import { API_CONFIG, STORAGE_KEYS } from '@/utils/constants';
import { ApiError, ApiResponse } from '@/types';

/**
 * API Client for handling network requests
 */
class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  
  private constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }
  
  /**
   * Set authentication token
   */
  public setAuthToken(token: string | null): void {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }
  
  /**
   * Get authentication token
   */
  private getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }
  
  /**
   * Get request headers with auth token if available
   */
  private getHeaders(): HeadersInit {
    const headers = { ...this.defaultHeaders };
    const token = this.getAuthToken();
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }
  
  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const jsonResponse = await response.json() as ApiResponse<T>;
      
      if (!response.ok) {
        throw new ApiError(
          jsonResponse.error?.message || 'An unknown error occurred',
          response.status
        );
      }
      
      if (!jsonResponse.success) {
        throw new Error(jsonResponse.error?.message || 'Operation failed');
      }
      
      return jsonResponse.data as T;
    }
    
    if (!response.ok) {
      throw new ApiError(`HTTP error ${response.status}`, response.status);
    }
    
    return await response.json() as T;
  }
  
  /**
   * Make a GET request
   */
  public async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<T>(response);
  }
  
  /**
   * Make a POST request
   */
  public async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<T>(response);
  }
  
  /**
   * Make a PUT request
   */
  public async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<T>(response);
  }
  
  /**
   * Make a DELETE request
   */
  public async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<T>(response);
  }
}

export default ApiClient.getInstance();
