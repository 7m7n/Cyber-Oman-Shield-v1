/**
 * background.js – handles optional external API lookups
 * NOTE: You must bring your own API keys and observe each provider's.
 */

const KEYS_DEFAULT = {
  vtApiKey: "",
  phishTankAppKey: "",
  hibpApiKey: ""
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'API_CHECKS') {
    chrome.storage.sync.get({ apiChecks: false, ...KEYS_DEFAULT }, async (cfg) => {
      if (!cfg.apiChecks) return sendResponse({ ok: true });

      try {
        const urls = (msg.urls || []).slice(0, 10);
        let virustotalFlagged = false;
        let phishtankFlagged = false;
        let hibpFlagged = false;

        if (cfg.vtApiKey && urls.length) {
          for (const u of urls) {
            try {
              const res = await fetch(`https://www.virustotal.com/api/v3/urls`, {
                method: 'POST',
                headers: { 'x-apikey': cfg.vtApiKey, 'content-type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ url: u })
              });
              const data = await res.json();
              const id = data?.data?.id;
              if (id) {
                const rep = await fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, {
                  headers: { 'x-apikey': cfg.vtApiKey }
                });
                const repJson = await rep.json();
                const stats = repJson?.data?.attributes?.stats;
                const malicious = (stats?.malicious || 0) + (stats?.suspicious || 0);
                if (malicious > 0) { virustotalFlagged = true; break; }
              }
            } catch (_) { }
          }
        }

        if (cfg.phishTankAppKey && urls.length) {
          for (const u of urls) {
            try {
              const form = new FormData();
              form.append('url', u);
              form.append('app_key', cfg.phishTankAppKey);
              form.append('format', 'json');
              const res = await fetch('https://checkurl.phishtank.com/checkurl/', { method: 'POST', body: form });
              const j = await res.json();
              if (j?.results?.in_database && j?.results?.valid) { phishtankFlagged = true; break; }
            } catch (_) { }
          }
        }

        sendResponse({ ok: true, virustotalFlagged, phishtankFlagged, hibpFlagged });
      } catch (e) {
        sendResponse({ ok: false, error: String(e) });
      }
    });
    return true;
  }
});
