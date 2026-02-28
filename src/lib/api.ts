export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

type HttpMethod = "GET" | "POST" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  isFormData?: boolean;
}

export const getAuthToken = () => localStorage.getItem("auth_token") || "";

export const setAuthToken = (token: string) => {
  localStorage.setItem("auth_token", token);
};

export const clearAuthToken = () => {
  localStorage.removeItem("auth_token");
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = "GET", body, isFormData = false } = options;
  const token = getAuthToken();
  const normalizedPath = path.replace(/^\/+/, "");

  const headers: HeadersInit = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const requestInit: RequestInit = {
    method,
    headers,
    body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
  };

  const requestUrls = [new URL(normalizedPath, `${API_BASE_URL}/`).toString()];
  if (API_BASE_URL.includes("localhost")) {
    requestUrls.push(new URL(normalizedPath, `${API_BASE_URL.replace("localhost", "127.0.0.1")}/`).toString());
  }

  let response: Response | null = null;
  let lastError: unknown = null;
  for (const url of requestUrls) {
    try {
      response = await fetch(url, requestInit);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!response) {
    throw new Error(
      lastError instanceof Error
        ? `Unable to reach backend API. ${lastError.message}. Check backend server and VITE_API_BASE_URL.`
        : "Unable to reach backend API. Check backend server and VITE_API_BASE_URL."
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
};
