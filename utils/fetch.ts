/**
 * A custom error class to handle API-specific errors.
 * It includes the status code and the message from the backend.
 */
export class APIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
  }
}

/**
 * Performs a GET request, automatically including the JWT.
 */
export async function get<T>(url: string, token: string | null): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (response.status === 204) {
      return null as T;
    }

    const data = await response.json().catch(() => {
      throw new APIError(
        `Failed to parse JSON response from ${url}`,
        response.status
      );
    });

    if (!response.ok) {
      const errorMessage = (data && data.message) || response.statusText;
      throw new APIError(errorMessage, response.status);
    }

    return data as T;
  } catch (error: any) {
    // If it's a network error or a different type, re-throw a generic error
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error(error.message);
  }
}

/**
 * Performs a POST request, automatically including the JWT.
 */
export async function post<T>(
  url: string,
  body: any,
  token: string | null
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  const responseData = await response.json().catch(() => {
    throw new APIError(
      `Failed to parse JSON response from ${url}`,
      response.status
    );
  });

  if (!response.ok) {
    const errorMessage =
      (responseData && responseData.message) || response.statusText;
    throw new APIError(errorMessage, response.status);
  }
  return responseData as T;
}

/**
 * Performs a PATCH request, automatically including the JWT.
 */
export async function patch<T>(
  url: string,
  data: any,
  token: string | null
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(data),
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        (responseData && responseData.message) || response.statusText;
      throw new APIError(errorMessage, response.status);
    }
    return responseData as T;
  } catch (error: any) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error(error.message);
  }
}
