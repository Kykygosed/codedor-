function injectNav(active) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const isAdmin = window.location.pathname.includes('/admin/');
  const base = isAdmin ? '../' : '';

  nav.innerHTML = `
    <div class="nav-container">
      <a href="${base}index.html" class="nav-logo">
        <img src="${base}assets/drapeau.png" alt="Drapeau de Kerdoré" style="height:32px;width:auto;border-radius:2px;box-shadow:0 1px 3px rgba(0,0,0,0.2);" />
        <div class="nav-logo-text">
          <span class="nav-logo-title">KERDORÉ</span>
          <span class="nav-logo-sub">Portail Officiel de l'État</span>
        </div>
      </a>
      <div class="nav-divider"></div>
      <ul class="nav-links" id="nav-links-list">
        <li><a href="${base}index.html"        class="${active==='accueil'      ?'active':''}">À la une</a></li>
        <li><a href="${base}gouvernement.html"  class="${active==='gouvernement' ?'active':''}">Gouvernement</a></li>
        <li><a href="${base}histoire.html"      class="${active==='histoire'     ?'active':''}">Histoire</a></li>
        <li><a href="${base}constitution.html"  class="${active==='constitution' ?'active':''}">Constitution</a></li>
        <li><a href="${base}diplomatie.html"    class="${active==='diplomatie'   ?'active':''}">Diplomatie</a></li>
        <li><a href="${base}actualites.html"    class="${active==='actualites'   ?'active':''} nav-cta">Actualités</a></li>
        <li><a href="${base}citoyennete.html"   class="${active==='citoyennete'  ?'active':''}">Citoyenneté</a></li>
        <li><a href="${base}votes.html"          class="${active==='votes'        ?'active':''}">Votes</a></li>
        <li><a href="${base}contact.html"        class="${active==='contact'      ?'active':''}">Contact</a></li>
      </ul>
      <a href="${base}admin/login.html" class="admin-nav-btn">Espace Admin</a>
      <button class="hamburger" id="hamburger-btn" aria-label="Menu">☰</button>
    </div>`;

  document.getElementById('hamburger-btn').addEventListener('click', () => {
    document.getElementById('nav-links-list').classList.toggle('open');
  });
}

function initiales(nom) {
  if (!nom) return '?';
  return nom.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el && val) el.textContent = val;
}
