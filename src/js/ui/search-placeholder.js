// ===============================
// SEARCH PLACEHOLDER EFFECT
// ===============================

export function initSearchPlaceholder() {
  const input = document.querySelector('.search-box input');
  if (!input) return;

  const services = [
    'Sửa điều hòa tại nhà',
    'Bảo dưỡng & vệ sinh điều hòa',
    'Nạp gas điều hòa',
    'Sửa tủ lạnh',
    'Sửa máy giặt',
    'Sửa bình nóng lạnh',
    'Sửa tivi 4K, OLED',
    'Lắp đặt điều hòa'
  ];

  let serviceIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let stopped = false;

  function typeEffect() {
    if (stopped) return;

    const text = services[serviceIndex];

    if (!isDeleting) {
      input.placeholder = 'Tìm kiếm: ' + text.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === text.length) {
        setTimeout(() => (isDeleting = true), 1200);
      }
    } else {
      input.placeholder = 'Tìm kiếm: ' + text.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        serviceIndex = (serviceIndex + 1) % services.length;
      }
    }

    setTimeout(typeEffect, isDeleting ? 40 : 80);
  }

  typeEffect();

  // Người dùng nhập → dừng animation
  input.addEventListener('input', () => {
    stopped = true;
    input.placeholder = 'Nhập từ khóa tìm kiếm…';
  });
}