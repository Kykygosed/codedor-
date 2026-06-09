
// ===== INIT NAVIGATION =====
injectNav('code-penal');

// ===== LOADER =====
document.addEventListener('kerdore:ready', () => {
  const l = document.getElementById('page-loader');
  if (l) { l.classList.add('hidden'); }
});

// ===== ÉTAT GLOBAL =====
let CP_DATA = null;
let showAbroges = true;

// ===== CHARGEMENT FIREBASE =====
async function loadCodePenal() {
  try {
    const snap = await db.ref('code_penal').once('value');
    CP_DATA = snap.val();
    if (!CP_DATA) {
      CP_DATA = getDefaultData();
    }
  } catch(e) {
    console.warn('Firebase indispo, données de démonstration.');
    CP_DATA = getDefaultData();
  }
  renderAll();
  document.dispatchEvent(new Event('kerdore:ready'));
}

function getDefaultData() {
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  return {
    meta: {
      date_vigueur: today,
      date_maj: today,
      preambule: "La présente codification réunit l'ensemble des dispositions pénales en vigueur dans la Démocratie de Kerdoré. Elle a pour objet de définir les infractions et d'établir les peines applicables, dans le respect de la Constitution et des droits fondamentaux de chaque citoyen."
    },
    livres: []
  };
}

// ===== RENDU =====
function renderAll() {
  if (!CP_DATA) return;
  const meta = CP_DATA.meta || {};
  const livres = CP_DATA.livres || [];

  // Méta
  const dv = meta.date_vigueur || '—';
  document.getElementById('cp-date-vigueur').textContent = dv.toUpperCase();
  document.getElementById('cp-meta-vigueur').textContent = dv;
  const dm = meta.date_maj || '—';
  document.getElementById('cp-date-maj').textContent = dm;
  document.getElementById('cp-meta-maj').textContent = dm;

  // Compte articles
  let nbArt = 0;
  (livres || []).forEach(l => {
    (l.titres || []).forEach(t => {
      (t.chapitres || []).forEach(c => { nbArt += (c.articles || []).length; });
    });
  });
  document.getElementById('cp-meta-nb-articles').textContent = nbArt;

  // Préambule
  if (meta.preambule) {
    const pb = document.getElementById('cp-preambule-block');
    pb.textContent = meta.preambule;
    pb.style.display = 'block';
    const shorts = meta.preambule.substring(0, 160);
    document.getElementById('cp-preambule-short').textContent = shorts + (meta.preambule.length > 160 ? '…' : '');
  }

  renderLivres(livres);
  renderTOC(livres);
}

function renderLivres(livres) {
  const container = document.getElementById('cp-livres-container');
  if (!livres || livres.length === 0) return;

  container.innerHTML = '';

  livres.forEach((livre, li) => {
    const livreEl = document.createElement('div');
    livreEl.className = 'cp-livre';
    livreEl.id = `livre-${li}`;

    // Calcul range articles du livre
    let arts = [];
    (livre.titres||[]).forEach(t => (t.chapitres||[]).forEach(c => arts = arts.concat(c.articles||[])));
    const range = arts.length > 0 ? `(Articles ${arts[0].num} à ${arts[arts.length-1].num})` : '';

    livreEl.innerHTML = `
      <div class="cp-livre-header" onclick="toggleLivre(${li})">
        <svg class="cp-livre-toggle open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" id="toggle-livre-${li}"><polyline points="9 18 15 12 9 6"/></svg>
        <span class="cp-livre-header-num">${livre.num || `Livre ${li+1}`}</span>
        <span class="cp-livre-header-title">${livre.titre || ''}</span>
        <span class="cp-livre-header-range">${range}</span>
      </div>
      <div class="cp-livre-body open" id="body-livre-${li}">
        ${renderTitresHTML(livre.titres || [], li)}
      </div>`;

    container.appendChild(livreEl);
  });
}

function renderTitresHTML(titres, li) {
  if (!titres.length) return '<p style="padding:1rem; color:var(--text-light); font-size:0.84rem;">Aucun titre dans ce livre.</p>';
  return titres.map((titre, ti) => {
    const arts = [];
    (titre.chapitres||[]).forEach(c => arts.push(...(c.articles||[])));
    const range = arts.length > 0 ? `Articles ${arts[0].num} à ${arts[arts.length-1].num}` : '';
    return `
    <div class="cp-titre" id="titre-${li}-${ti}">
      <div class="cp-titre-header" onclick="toggleTitre(${li},${ti})">
        <svg class="cp-titre-toggle open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" id="toggle-titre-${li}-${ti}"><polyline points="9 18 15 12 9 6"/></svg>
        <span class="cp-titre-header-num">${titre.num || `Titre ${ti+1}`}</span>
        <span class="cp-titre-header-title">${titre.titre || ''}</span>
        ${range ? `<span style="margin-left:auto; font-size:0.68rem; color:var(--text-light);">(${range})</span>` : ''}
      </div>
      <div class="cp-titre-body open" id="body-titre-${li}-${ti}">
        ${renderChapitresHTML(titre.chapitres || [], li, ti)}
      </div>
    </div>`;
  }).join('');
}

function renderChapitresHTML(chapitres, li, ti) {
  if (!chapitres.length) return '';
  return chapitres.map((chap, ci) => {
    const arts = chap.articles || [];
    const range = arts.length > 0 ? `Art. ${arts[0].num} à ${arts[arts.length-1].num}` : '';
    return `
    <div class="cp-chapitre" id="chap-${li}-${ti}-${ci}">
      <div class="cp-chapitre-header" onclick="toggleChap(${li},${ti},${ci})">
        <svg class="cp-chapitre-toggle open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" id="toggle-chap-${li}-${ti}-${ci}"><polyline points="9 18 15 12 9 6"/></svg>
        <span class="cp-chapitre-header-num">${chap.num || `Chapitre ${ci+1}`}</span>
        <span class="cp-chapitre-header-title">${chap.titre || ''}</span>
        ${range ? `<span class="cp-chapitre-header-range">(${range})</span>` : ''}
      </div>
      <div class="cp-chapitre-body open" id="body-chap-${li}-${ti}-${ci}">
        ${renderArticlesHTML(arts)}
      </div>
    </div>`;
  }).join('');
}

function renderArticlesHTML(articles) {
  if (!articles.length) return '';
  return articles.map(art => {
    const abroge = art.abroge === true;
    if (abroge && !showAbroges) return '';
    return `
    <div class="cp-article" id="art-${art.num}" data-abroge="${abroge}">
      <div class="cp-article-header">
        <a class="cp-article-num" href="#art-${art.num}">${art.num}</a>
        ${art.titre ? `<span class="cp-article-titre">${art.titre}</span>` : ''}
        <span class="cp-article-vigueur ${abroge ? 'vigueur-abroge' : 'vigueur-en'}">${abroge ? 'Abrogé' : 'En vigueur'}</span>
      </div>
      <p class="cp-article-text">${art.texte || ''}</p>
      ${art.peine ? `<div class="cp-article-peine">⚖ Peine : ${art.peine}</div>` : ''}
    </div>`;
  }).join('');
}

// ===== SOMMAIRE (TOC) =====
function renderTOC(livres) {
  const container = document.getElementById('toc-container');
  if (!livres || !livres.length) {
    container.innerHTML = '<div style="padding:1rem; font-size:0.8rem; color:var(--text-light);">Aucune structure définie.</div>';
    return;
  }
  container.innerHTML = livres.map((livre, li) => {
    let allArts = [];
    (livre.titres||[]).forEach(t => (t.chapitres||[]).forEach(c => allArts = allArts.concat(c.articles||[])));
    const range = allArts.length > 0 ? `${allArts[0].num} à ${allArts[allArts.length-1].num}` : '';
    return `
    <div class="toc-livre">
      <div class="toc-livre-header" onclick="tocToggleLivre(${li}, this)">
        <svg class="toc-toggle open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        <div>
          <div class="toc-livre-num">${livre.num || `Livre ${li+1}`}</div>
          <div class="toc-livre-title">${livre.titre || ''}</div>
          ${range ? `<div class="toc-livre-range">(${range})</div>` : ''}
        </div>
      </div>
      <div class="toc-titre-list open" id="toc-titres-${li}">
        ${(livre.titres||[]).map((titre, ti) => {
          const arts = [];
          (titre.chapitres||[]).forEach(c => arts.push(...(c.articles||[])));
          return `
          <div>
            <div class="toc-titre-header" onclick="tocToggleTitre(${li},${ti},this)">
              <svg class="toc-toggle open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              <div>
                <div class="toc-titre-num">${titre.num||`Titre ${ti+1}`}</div>
                <div class="toc-titre-label">${titre.titre||''}</div>
              </div>
            </div>
            <div class="toc-chapitre-list open" id="toc-chaps-${li}-${ti}">
              ${(titre.chapitres||[]).map((chap,ci) => {
                const as = chap.articles||[];
                return as.map(art => `
                <a class="toc-article-link" href="#art-${art.num}" onclick="highlightArticle('${art.num}')">
                  ${art.num}${art.titre ? ' — '+art.titre : ''}
                </a>`).join('');
              }).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}

// ===== TOGGLES STRUCTURE =====
function toggleLivre(li) {
  const body = document.getElementById(`body-livre-${li}`);
  const tog = document.getElementById(`toggle-livre-${li}`);
  body.classList.toggle('open');
  tog.classList.toggle('open');
}
function toggleTitre(li, ti) {
  const body = document.getElementById(`body-titre-${li}-${ti}`);
  const tog = document.getElementById(`toggle-titre-${li}-${ti}`);
  body.classList.toggle('open');
  tog.classList.toggle('open');
}
function toggleChap(li, ti, ci) {
  const body = document.getElementById(`body-chap-${li}-${ti}-${ci}`);
  const tog = document.getElementById(`toggle-chap-${li}-${ti}-${ci}`);
  body.classList.toggle('open');
  tog.classList.toggle('open');
}

function tocToggleLivre(li, el) {
  const list = document.getElementById(`toc-titres-${li}`);
  list.classList.toggle('open');
  el.querySelector('.toc-toggle').classList.toggle('open');
}
function tocToggleTitre(li, ti, el) {
  const list = document.getElementById(`toc-chaps-${li}-${ti}`);
  list.classList.toggle('open');
  el.querySelector('.toc-toggle').classList.toggle('open');
}

function toggleToc() {
  const btn = document.getElementById('toc-title');
  btn.classList.toggle('open');
  const all = document.querySelectorAll('.toc-titre-list, .toc-chapitre-list');
  const shouldOpen = btn.classList.contains('open');
  all.forEach(el => { shouldOpen ? el.classList.add('open') : el.classList.remove('open'); });
  btn.childNodes[0].textContent = shouldOpen ? 'Tout replier ' : 'Tout déplier ';
}

function highlightArticle(num) {
  document.querySelectorAll('.toc-article-link').forEach(a => a.classList.remove('active'));
  const link = document.querySelector(`.toc-article-link[href="#art-${num}"]`);
  if (link) link.classList.add('active');
}

// ===== MASQUER ABROGÉS =====
function toggleAbroges() {
  showAbroges = !showAbroges;
  const btn = document.getElementById('btn-masquer-abroges');
  btn.childNodes[btn.childNodes.length-1].textContent = showAbroges ? ' Masquer les articles abrogés' : ' Afficher les articles abrogés';
  document.querySelectorAll('[data-abroge="true"]').forEach(el => {
    el.style.display = showAbroges ? '' : 'none';
  });
}

// ===== RECHERCHE =====
function searchCode(q) {
  const viewSearch = document.getElementById('view-search');
  const viewCode   = document.getElementById('view-code');
  if (!q.trim()) {
    viewSearch.classList.remove('active');
    viewCode.classList.add('active');
    return;
  }
  viewSearch.classList.add('active');
  viewCode.classList.remove('active');

  const results = [];
  const term = q.toLowerCase();
  if (CP_DATA && CP_DATA.livres) {
    CP_DATA.livres.forEach(livre => {
      (livre.titres||[]).forEach(titre => {
        (titre.chapitres||[]).forEach(chap => {
          (chap.articles||[]).forEach(art => {
            const haystack = `${art.num} ${art.titre||''} ${art.texte||''}`.toLowerCase();
            if (haystack.includes(term)) results.push({ art, livre, titre, chap });
          });
        });
      });
    });
  }

  const count = document.getElementById('search-count');
  count.textContent = `${results.length} résultat${results.length > 1 ? 's' : ''} pour « ${q} »`;

  const list = document.getElementById('search-results-list');
  if (!results.length) {
    list.innerHTML = '<div class="cp-empty"><div class="cp-empty-icon">🔍</div><div class="cp-empty-title">Aucun résultat</div><p style="font-size:0.84rem;">Modifiez votre recherche.</p></div>';
    return;
  }

  list.innerHTML = results.map(({ art, livre, titre, chap }) => {
    const excerpt = (art.texte||'').substring(0, 180).replace(new RegExp(q, 'gi'), m => `<mark>${m}</mark>`);
    return `
    <div class="cp-search-result-item" onclick="location.hash='art-${art.num}'">
      <div class="cp-search-result-num">${art.num} — ${livre.titre||''} › ${titre.titre||''} › ${chap.titre||''}</div>
      <div class="cp-search-result-title">${(art.titre||'').replace(new RegExp(q, 'gi'), m => `<mark>${m}</mark>`) || art.num}</div>
      <div class="cp-search-result-excerpt">${excerpt}…</div>
    </div>`;
  }).join('');
}

// ===== TABS =====
function switchTab(tab, el) {
  document.querySelectorAll('.cp-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const preambule = document.getElementById('cp-preambule-block');
  const livres = document.getElementById('cp-livres-container');
  if (tab === 'preambule') {
    preambule.style.display = 'block'; livres.style.display = 'none';
  } else if (tab === 'texte') {
    preambule.style.display = 'none'; livres.style.display = 'block';
  } else {
    preambule.style.display = 'block'; livres.style.display = 'block';
  }
}

// ===== LANCEMENT =====
loadCodePenal();
