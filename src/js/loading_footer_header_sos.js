async function loadComponent(id, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Không load được ${path}`);
    document.getElementById(id).innerHTML = await res.text();
  } catch (err) {
    console.error(err);
  }
}

// Load header & footer
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('header', '/src/components/header.html');
  loadComponent('footer', '/src/components/footer.html');
});