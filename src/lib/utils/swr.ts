export async function swrFetcher<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error("Request failed");
  }
  return (await response.json()) as T;
}
