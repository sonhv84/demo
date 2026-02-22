export function redirect404(reason) {
  console.error('[REDIRECT 404]', reason);

  if (location.pathname.includes('404.html')) return;

  sessionStorage.setItem('error_reason', reason);
  window.location.replace('/404.html');
}

export function initGlobalErrorHandler() {
  window.onerror = function (msg) {
    redirect404(`JS Error: ${msg}`);
  };

  window.addEventListener('unhandledrejection', e => {
    redirect404(`Promise Error: ${e.reason}`);
  });
}