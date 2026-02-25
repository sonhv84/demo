// 1. Toggle Menu chính trên Mobile
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');

mobileToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// 2. Toggle Dịch vụ & Hướng dẫn (Accordion)
document.addEventListener('DOMContentLoaded', function() {
  const triggers = document.querySelectorAll('.mega-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      // Chỉ chạy trên Mobile
      if (window.innerWidth <= 992) {
        e.preventDefault(); 
        
        // Tìm menu con ngay sau thẻ a vừa click
        const megaMenu = this.nextElementSibling;
        
        // Đóng các menu khác (nếu muốn kiểu chuyên nghiệp)
        document.querySelectorAll('.mega-menu').forEach(menu => {
          if (menu !== megaMenu) {
            menu.classList.remove('show');
            menu.previousElementSibling.classList.remove('open');
          }
        });

        // Bật/tắt menu hiện tại
        megaMenu.classList.toggle('show');
        this.classList.toggle('open');
      }
    });
  });
});