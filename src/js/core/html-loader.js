import { fetchWithTimeout } from './fetch-timeout.js';
import { redirect404 } from './error-handler.js';

export function loadHTML(selector, file, callback) {
  fetchWithTimeout(file, 6000)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} – ${file}`);
      }
      return res.text();
    })
    .then(html => {
      const target = document.querySelector(selector);
      if (!target) {
        throw new Error(`Không tìm thấy selector: ${selector}`);
      }

      target.innerHTML = html;
      if (typeof callback === 'function') callback();
    })
    .catch(err => {
      redirect404(err.message);
    });
}