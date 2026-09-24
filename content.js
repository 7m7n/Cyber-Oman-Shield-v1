/**
 * Cyber OMAN Shield 2040 – content.js
 * - Runs only on Gmail or Outlook 
 * - Observes when an email thread is open and injects a risk banner
 * - Performs lightweight heuristics and (optionally) asks background for external checks
 */

const STATE = {
  lastAnalysis: null,
  bannerEl: null
};

const DEFAULT_SETTINGS = {
  fontSize: "normal",
  boldText: false,
  apiChecks: false,
  theme: "light"
};

const ADVICE = [
  "Do not click suspicious links.",
  "Verify the sender's address carefully.",
  "Avoid downloading unexpected attachments.",
  "Hover over links to inspect the real URL.",
  "When in doubt, report and confirm via another channel.",
"Never enter login credentials after following an email link.",
"Look for generic greetings instead of your actual name.",
"Inspect spelling mistakes and poor grammar in official messages.",
"Confirm requests for sensitive data through a trusted secondary channel.",
"Beware of unexpected password reset notifications you never requested.",
"Double-check the exact domain name hiding behind a display name."
];

function randAdvice() {
  return ADVICE[Math.floor(Math.random() * ADVICE.length)];
}

function analyzeEmailLocally(subject, bodyText, links) {
  const text = `${subject} \n ${bodyText}`.toLowerCase();
  const suspiciousWords = [
    "urgent", "verify", "password", "reset", "account", "login",
    "invoice", "gift", "bitcoin", "payment", "bank", "limited time",
    "confirm", "suspend", "unusual activity", "prize", "lottery" , "free" 
    "click"

  ];

  let score = 0;
  suspiciousWords.forEach(w => { if (text.includes(w)) score += 7; });

  for (const url of links) {
    try {
      const u = new URL(url);
      const host = u.hostname;
      if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) score += 20;
      const brandWords = ["google", "microsoft", "apple", "amazon", "paypal", "facebook", "instagram", "bank"];
      for (const b of brandWords) {
        if (text.includes(b) && !host.includes(b)) { score += 10; break; }
      }
      const badTLDs = [".ru", ".cn", ".tk", ".top", ".xyz"];
      if (badTLDs.some(t => host.endsWith(t))) score += 8;
    } catch (_) { }
  }

  score = Math.max(0, Math.min(100, score));
  return score;
}

function extractCurrentEmail() {
  const main = document.querySelector('div[role="main"]');
  if (!main) return null;

  const subjectNode = main.querySelector('h2[role="heading"], h1[role="heading"]');
  const subject = subjectNode ? subjectNode.textContent.trim() : document.title.replace(/ - .*Gmail.*/i, "").trim();

  const bodyNodes = main.querySelectorAll('div[role="listitem"] div[dir="ltr"], div[role="region"] div[dir="ltr"], div.a3s');
  let bodyText = "";
  bodyNodes.forEach(n => { bodyText += "\n" + n.innerText; });

  const linkHrefs = Array.from(main.querySelectorAll('a[href]')).map(a => a.href);

  return { subject, bodyText: bodyText.trim(), links: linkHrefs };
}

function renderBanner(score) {
  const main = document.querySelector('div[role="main"]');
  if (!main) return;

  if (STATE.bannerEl) STATE.bannerEl.remove();

  const banner = document.createElement('div');
  banner.className = 'gpg-banner ' + (score >= 50 ? 'risky' : 'safe');

  const label = score >= 50
    ? `⚠️ Warning: This email may be phishing (`
    : `✅ This email appears safe (`;

  const advice = document.createElement('div');
  advice.className = 'gpg-advice';
  advice.textContent = randAdvice();

  banner.innerHTML = `
    <div class="gpg-score">${label}${score}% confidence)</div>
  `;
  banner.appendChild(advice);

  chrome.storage.sync.get(DEFAULT_SETTINGS, (cfg) => {
    if (cfg.fontSize === 'large') banner.style.fontSize = '1.05rem';
    if (cfg.boldText) banner.style.fontWeight = '700';
  });

  main.prepend(banner);
  STATE.bannerEl = banner;
}

async function maybeExternalChecks(data, baseScore) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (cfg) => {
      if (!cfg.apiChecks) return resolve(baseScore);
      chrome.runtime.sendMessage({ type: 'API_CHECKS', urls: data.links }, (resp) => {
        if (!resp || !resp.ok) return resolve(baseScore);
        let delta = 0;
        if (resp.virustotalFlagged) delta += 20;
        if (resp.phishtankFlagged) delta += 15;
        if (resp.hibpFlagged) delta += 5;
        const merged = Math.max(0, Math.min(100, baseScore + delta));
        resolve(merged);
      });
    });
  });
}

function analyzeAndDisplay() {
  const data = extractCurrentEmail();
  if (!data) return;

  const localScore = analyzeEmailLocally(data.subject, data.bodyText, data.links);

  maybeExternalChecks(data, localScore).then(finalScore => {
    STATE.lastAnalysis = { ...data, score: finalScore, ts: Date.now() };
    renderBanner(finalScore);
  });
}

const observer = new MutationObserver(() => {
  clearTimeout(observer.__t);
  observer.__t = setTimeout(analyzeAndDisplay, 400);
});
observer.observe(document.documentElement, { subtree: true, childList: true });

analyzeAndDisplay();

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === 'GET_LAST_RESULT') {
    sendResponse({ ok: true, result: STATE.lastAnalysis });
    return true;
  }
});
