export function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hiệu ứng loading hiện đại
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        btn.style.opacity = '0.7';
        btn.disabled = true;

        // Giả lập gửi dữ liệu
        setTimeout(() => {
            alert('Cảm ơn bạn! Yêu cầu đã được gửi đến Điện Lạnh Bách Khoa.');
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
            btn.disabled = false;
            form.reset();
        }, 2000);
    });
}