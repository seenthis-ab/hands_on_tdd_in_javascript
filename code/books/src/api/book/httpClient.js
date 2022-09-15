export async function httpClient(url, options = {}) {
  const controller = new AbortController();
  const defaultOptions = {
    method: "GET",
    signal: controller.signal,
  };
  const { timeout, ...userOptions } = options;
  const httpClientOptions = { ...defaultOptions, ...userOptions };

  const resultPromise = fetch(url, httpClientOptions);

  const timeoutId = setTimeout(() => controller.abort(), timeout || 5000);

  return resultPromise.finally(() => clearTimeout(timeoutId));
}
