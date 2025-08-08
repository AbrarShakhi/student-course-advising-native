export async function get<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `GET ${url} failed: ${data && data.message}|| ${response.statusText}`
    );
  }
  return data as T;
}

export async function post<T>(url: string, data: any): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const errorMessage =
      (responseData && responseData.message) || response.statusText;
    throw new Error(`POST ${url} failed: ${errorMessage}`);
  }
  return responseData as T;
}

export async function patch<T>(
  url: string,
  data: any,
  token: string | null
): Promise<T> {
  // A token is required for this protected route.
  if (!token) {
    throw new Error("Authentication token is missing for the request.");
  }
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // This correctly sends the token to the server.
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        (responseData && responseData.message) || response.statusText;
      throw new Error(`PATCH request failed: ${errorMessage}`);
    }
    return responseData as T;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
