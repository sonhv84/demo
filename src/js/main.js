/**
 * TOÀN BỘ LOGIC HỆ THỐNG - ĐIỆN LẠNH BÁCH KHOA
 */

// 1. Tự động xác định Base URL để tránh lỗi đường dẫn trên GitHub Pages
const BASE_URL = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');

// ==========================================
// 2. CORE: XỬ LÝ LỖI & LOAD NỘI DUNG
// ==========================================

function redirect404(reason) {
    console.error('[Hệ thống]', reason);
    if (location.pathname.includes('404.html')) return;
    sessionStorage.setItem('error_reason', reason);
    // window.location.replace(`${BASE_URL}/404.html`);
}

function initGlobalErrorHandler() {
    window.onerror = (msg) => redirect404(`JS Error: ${msg}`);
    window.addEventListener('unhandledrejection', e => redirect404(`Promise Error: ${e.reason}`));
}

async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (err) {
        clearTimeout(id);
        throw err;
    }
}

async function loadHTML(selector, file, callback) {
    try {
        const res = await fetchWithTimeout(file, 6000);
        if (!res.ok) throw new Error(`HTTP ${res.status} – ${file}`);
        const html = await res.text();
        const target = document.querySelector(selector);
        
        if (target) {
            target.innerHTML = html;
            if (typeof callback === 'function') callback();
            // Nếu load header thì phải gán sự kiện menu ngay
            if (selector === '#header' || selector === 'header') initMobileMenu();
        }
    } catch (err) {
        redirect404(err.message);
    }
}

// ==========================================
// 3. UI: MENU MOBILE & HIỆU ỨNG
// ==========================================

function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    /* =========================
       1. Toggle Menu chính
    ========================= */
    if (mobileToggle && navMenu) {
        mobileToggle.onclick = (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');

            // Khi mở menu → reset mega menu
            if (!navMenu.classList.contains('active')) {
                resetMegaMenu();
            }
        };
    }

    /* =========================
       2. Mega Menu (Accordion chuẩn)
    ========================= */
    const triggers = document.querySelectorAll('.mega-trigger');

    triggers.forEach(trigger => {
        trigger.onclick = function (e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();

                const megaMenu = this.nextElementSibling;
                const isOpen = megaMenu.classList.contains('show');

                // Đóng toàn bộ mega menu trước
                resetMegaMenu();

                // Nếu đang đóng → mở
                if (!isOpen) {
                    megaMenu.classList.add('show');
                    this.classList.add('open');
                }
            }
        };
    });

    /* =========================
       3. Click ngoài menu → đóng sạch
    ========================= */
    document.addEventListener('click', () => {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            resetMegaMenu();
        }
    });

    /* =========================
       Helper: Reset Mega Menu
    ========================= */
    function resetMegaMenu() {
        document.querySelectorAll('.mega-menu').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('.mega-trigger').forEach(t => t.classList.remove('open'));
    }
}

function initSearchPlaceholder() {
    const input = document.querySelector('.search-box input');
    if (!input) return;

    const services = ['Sửa điều hòa tại nhà', 'Bảo dưỡng điều hòa', 'Sửa tủ lạnh', 'Sửa máy giặt', 'Sửa tivi 4K'];
    let serviceIndex = 0, charIndex = 0, isDeleting = false, stopped = false;

    function typeEffect() {
        if (stopped) return;
        const text = services[serviceIndex];
        input.placeholder = 'Tìm kiếm: ' + (isDeleting ? text.slice(0, charIndex--) : text.slice(0, charIndex++));

        if (!isDeleting && charIndex > text.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1200);
        } else if (isDeleting && charIndex < 0) {
            isDeleting = false;
            serviceIndex = (serviceIndex + 1) % services.length;
            charIndex = 0;
            setTimeout(typeEffect, 500);
        } else {
            setTimeout(typeEffect, isDeleting ? 40 : 80);
        }
    }
    typeEffect();
    input.addEventListener('input', () => { stopped = true; input.placeholder = 'Nhập từ khóa tìm kiếm...'; });
}

function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    form.onsubmit = (e) => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        btn.disabled = true;
        setTimeout(() => {
            alert('Cảm ơn bạn! Yêu cầu đã được gửi đến Điện Lạnh Bách Khoa.');
            form.reset();
            btn.innerHTML = 'Gửi yêu cầu';
            btn.disabled = false;
        }, 2000);
    };
}

// ==========================================
// 4. CONTENT: LOAD MARKDOWN
// ==========================================

async function loadMarkdown(fileName) {
    const loadingEl = document.getElementById('loading');
    const contentEl = document.getElementById('main-content');
    if (!contentEl) return;

    try {
        const response = await fetch(`${BASE_URL}/dich-vu/data/sua-chua-${fileName}.md`);
        if (!response.ok) throw new Error(`Không tìm thấy nội dung: ${fileName}`);
        
        let markdownText = await response.text();
        markdownText = markdownText.replace(/## (.*) {#(.*)}/g, '## $1 <a id="$2"></a>');

        if (window.marked) {
            contentEl.innerHTML = marked.parse(markdownText);
        }

        if (loadingEl) loadingEl.style.display = 'none';
        contentEl.classList.remove('hidden');

        if (window.location.hash) {
            setTimeout(() => {
                const el = document.getElementById(window.location.hash.substring(1));
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    } catch (error) {
        if (loadingEl) loadingEl.innerHTML = `<div style="color: red;">Lỗi: ${error.message}</div>`;
    }
}

// ==========================================
// 5. RUN APP
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initGlobalErrorHandler();
    
    // Load Header & Footer
    loadHTML('#header', `${BASE_URL}/src/components/header.html`, initSearchPlaceholder);
    loadHTML('#footer', `${BASE_URL}/src/components/footer.html`);

    initContactForm();

    // Kiểm tra xem có cần load Markdown không (dành cho trang dịch vụ)
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    if (service) loadMarkdown(service);
});