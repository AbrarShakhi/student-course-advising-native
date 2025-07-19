export async function get<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.statusText}`);
  }
  return response.json();
}

export async function post<T>(url: string, data: any): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`POST ${url} failed: ${response.statusText}`);
  }
  return response.json();
}

export async function patch<T>(url: string, data: any): Promise<T> {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`PATCH ${url} failed: ${response.statusText}`);
  }
  return response.json();
}
