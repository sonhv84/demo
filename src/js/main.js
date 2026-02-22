import { loadHTML } from './core/html-loader.js';
import { initSearchPlaceholder } from './ui/search-placeholder.js';
import { initGlobalErrorHandler } from './core/error-handler.js';     

// HEADER / FOOTER
loadHTML('#header', '/src/components/header.html', initSearchPlaceholder);
loadHTML('#footer', '/src/components/footer.html');

// GLOBAL ERROR
initGlobalErrorHandler();