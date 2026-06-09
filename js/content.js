// ============================================
//  KERDORÉ — Chargement du contenu Firebase
// ============================================

const DEFAULT = {
  stats: {
    habitants:  0,
    pib:        "0",
    superficie: "0"
  },
  home: {
    title:       "Démocratie de Kerdoré",
    subtitle:    "État souverain fondé sur l'honneur, la justice et la tradition",
    motto:       "Par l'honneur et la force",
    description: "Bienvenue sur le portail officiel de la Démocratie de Kerdoré. Ce site centralise toutes les informations officielles relatives à notre nation souveraine.",
    ticker:      "Bienvenue sur le portail officiel de Kerdoré · Consultez les derniers décrets et communiqués · Démocratie de Kerdoré"
  },
  gouvernement: {
    chef_titre: "Président de Kerdoré",
    chef_nom:   "À nommer",
    chef_bio:   "Le chef de l'État assure la direction générale de la Démocratie et représente Kerdoré dans ses relations internationales.",
    parlement:  "Le Conseil national est l'organe législatif de Kerdoré, composé de représentants désignés par le peuple souverain.",
    ministres: [
      { nom: "À nommer", portefeuille: "Premier Ministre" },
      { nom: "À nommer", portefeuille: "Affaires Étrangères" },
      { nom: "À nommer", portefeuille: "Intérieur & Sécurité" },
      { nom: "À nommer", portefeuille: "Finances" },
      { nom: "À nommer", portefeuille: "Culture & Patrimoine" },
      { nom: "À nommer", portefeuille: "Justice" }
    ]
  },
  histoire: {
    intro: "La Démocratie de Kerdoré est née de la volonté commune de ses fondateurs de créer une nation fondée sur des valeurs fortes et une identité culturelle distincte héritée d'une longue tradition.",
    timeline: [
      { annee: "Fondation", titre: "Naissance de Kerdoré", desc: "Proclamation solennelle de la Démocratie de Kerdoré par ses fondateurs réunis en assemblée constituante." },
      { annee: "Constitution", titre: "Charte Fondamentale", desc: "Rédaction et adoption de la constitution qui régit depuis la vie institutionnelle de l'État." },
      { annee: "Diplomatie", titre: "Premières Relations", desc: "Kerdoré établit ses premières relations diplomatiques et est reconnue par d'autres nations." }
    ]
  },
  constitution: {
    preambule: "Nous, citoyens de Kerdoré, attachés à nos valeurs fondatrices, à la mémoire de ceux qui ont bâti cette nation, et soucieux de l'avenir de nos descendants, adoptons solennellement la présente Constitution comme loi fondamentale de notre Démocratie.",
    articles: [
      { num: "Article I",   titre: "De la Démocratie",        texte: "Kerdoré est une Démocratie souveraine, indivisible et laïque. Sa devise est gravée dans ses armoiries. Son principe est le gouvernement du peuple, par le peuple et pour le peuple." },
      { num: "Article II",  titre: "De la Souveraineté",      texte: "La souveraineté nationale appartient au peuple de Kerdoré, qui l'exerce par ses représentants élus et, le cas échéant, par voie de référendum." },
      { num: "Article III", titre: "Des Droits Fondamentaux", texte: "Tout citoyen de Kerdoré est égal devant la loi, sans distinction d'origine ou de condition. Chacun jouit des libertés fondamentales reconnues par la présente Constitution." },
      { num: "Article IV",  titre: "Du Gouvernement",        texte: "Le pouvoir exécutif est exercé par le Chef de l'État, assisté du Gouvernement. Le pouvoir législatif est exercé par le Conseil national. Ces pouvoirs sont séparés et indépendants." },
      { num: "Article V",   titre: "De la Citoyenneté",      texte: "La citoyenneté kerdoreine s'acquiert par la naissance ou par naturalisation selon les conditions fixées par la loi. Elle confère des droits et des devoirs envers la Démocratie." }
    ]
  },
  diplomatie: {
    intro: "La Démocratie de Kerdoré s'engage dans des relations internationales fondées sur le respect mutuel, la non-ingérence dans les affaires intérieures et la coopération pacifique.",
    pays: [
      { nom: "À définir", statut: "neutral", notes: "Relations à établir" }
    ]
  },
  actualites: {
    articles: [
      {
        titre:   "Inauguration du portail officiel de Kerdoré",
        date:    "2024",
        auteur:  "Chancellerie d'État",
        contenu: "Le gouvernement de la Démocratie de Kerdoré est heureux d'annoncer l'ouverture officielle du portail d'État. Ce site centralise toutes les informations officielles relatives à notre nation souveraine : institutions, textes fondamentaux, actualités diplomatiques et procédures citoyennes."
      }
    ]
  },
  citoyennete: {
    intro:      "La citoyenneté kerdoreine est un lien sacré entre l'individu et la Démocratie. Elle confère des droits inaliénables et des devoirs envers la communauté nationale.",
    conditions: "Pour prétendre à la citoyenneté de Kerdoré, le candidat doit adhérer aux valeurs de la Démocratie, s'engager à respecter sa Constitution et ses lois, être parrainé par un citoyen en règle, et prêter serment devant les autorités compétentes.",
    procedure:  "Dépôt de candidature auprès de la Chancellerie\nExamen du dossier par le Conseil des Admissions\nEntretien de citoyenneté (si requis)\nPrestation de serment devant un officier d'État\nDélivrance du titre de citoyenneté"
  }
};

// Charge une section depuis Firebase (fallback sur DEFAULT)
async function loadContent(section) {
  try {
    const snap = await db.ref(`content/${section}`).once('value');
    const val  = snap.val();
    if (!val) return DEFAULT[section] || {};
    // Fusion avec les valeurs par défaut (pour les champs manquants)
    return { ...DEFAULT[section], ...val };
  } catch (e) {
    console.warn('[Kerdoré] Firebase indisponible, contenu par défaut utilisé.');
    return DEFAULT[section] || {};
  }
}

// Injecte un texte dans un élément si celui-ci existe
function setText(id, val) {
  const el = document.getElementById(id);
  if (el && val != null) { el.textContent = val; el.classList.add('loaded'); }
}
function setHTML(id, val) {
  const el = document.getElementById(id);
  if (el && val != null) { el.innerHTML = val; el.classList.add('loaded'); }
}
// Marque un élément data-dynamic comme chargé (sans modifier son contenu)
function markLoaded(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('loaded');
}

// Initiales pour les avatars
function initiales(nom) {
  return (nom || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}


// Signal page loader to hide after content is loaded
(function() {
  var _fired = false;
  var _orig = window.loadContent;
  if (typeof _orig === 'function') {
    window.loadContent = async function(section) {
      var result = await _orig(section);
      if (!_fired) {
        _fired = true;
        setTimeout(function() {
          document.dispatchEvent(new Event('kerdore:ready'));
        }, 200);
      }
      return result;
    };
  }
  // Also fire if no loadContent (e.g. login page)
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      document.dispatchEvent(new Event('kerdore:ready'));
    }, 400);
  });
})();
