import { ApiResponse } from "../../shared/types"
function isErrorResponse(response: ApiResponse<unknown>): response is { success: false; error: string } {
  return !response.success;
}
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...init })
  const json = (await res.json()) as ApiResponse<T>
  if (!res.ok || isErrorResponse(json) || json.data === undefined) {
    throw new Error(isErrorResponse(json) ? json.error : 'Request failed');
  }
  return json.data
}