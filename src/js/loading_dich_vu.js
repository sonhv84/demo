/**
 * Hàm loadMarkdown dùng chung cho toàn bộ website
 * @param {string} fileName - Tên file .md (không bao gồm đuôi file)
 */
async function loadMarkdown(fileName) {
    const loadingEl = document.getElementById('loading');
    const contentEl = document.getElementById('main-content');
    

    try {
        // 1. Fetch file nội dung từ thư mục assets
        const response = await fetch(`../../dich-vu/data/sua-chua-${fileName}.md`);
        if (!response.ok) throw new Error(`Không tìm thấy nội dung cho: ${fileName}`);
        
        let markdownText = await response.text();

        // 2. Xử lý Custom ID {#id} để tạo Anchor link cho Mục lục
        markdownText = markdownText.replace(/## (.*) {#(.*)}/g, '## $1 <a id="$2"></a>');

        // 3. Render Markdown thành HTML sử dụng thư viện Marked.js
        contentEl.innerHTML = marked.parse(markdownText);



        // 5. Hiển thị nội dung và ẩn trạng thái loading
        loadingEl.style.display = 'none';
        contentEl.classList.remove('hidden');

        // 6. Xử lý cuộn trang nếu URL có chứa Hash (#)
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            setTimeout(() => {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }

    } catch (error) {
        loadingEl.innerHTML = `<div style="color: red; padding: 20px;">Lỗi hệ thống: ${error.message}</div>`;
        console.error(error);
    }
}
