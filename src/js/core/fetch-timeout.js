// ===============================
// FETCH WITH TIMEOUT
// ===============================

/**
 * Fetch có timeout để tránh treo trang
 * @param {string | URL} url
 * @param {number} timeout
 */
export function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Fetch timeout: ${url}`)),
        timeout
      )
    )
  ]);
}