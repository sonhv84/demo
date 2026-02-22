// ===============================
// GLOBAL ERROR HANDLER
// ===============================

/**
 * Chuyển hướng sang trang 404
 * ⚠ KHÔNG dùng path tuyệt đối `/404.html`
 * vì GitHub Pages có base path theo repo
 */
export function redirect404(reason) {
  console.error('[REDIRECT 404]', reason);

  // Tránh redirect vòng lặp
  if (location.pathname.includes('404.html')) return;

  sessionStorage.setItem('error_reason', reason);

  // Dùng base URL động để chạy được cả local & GitHub Pages
  const base = import.meta.url.split('/src/')[0];
  window.location.replace(`${base}/404.html`);
}

/**
 * Bắt toàn bộ lỗi JS & Promise
 * Chỉ gọi 1 lần trong main.js
 */
export function initGlobalErrorHandler() {
  window.onerror = function (msg) {
    redirect404(`JS Error: ${msg}`);
  };

  window.addEventListener('unhandledrejection', e => {
    redirect404(`Promise Error: ${e.reason}`);
  });
}