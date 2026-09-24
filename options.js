const DEFAULTS = {
  fontSize: 'normal',
  boldText: false,
  apiChecks: false,
  vtApiKey: '',
  phishTankAppKey: '',
  hibpApiKey: '',
  theme: 'light'
};

function load() {
  chrome.storage.sync.get(DEFAULTS, (cfg) => {
    document.getElementById('fontSize').value = cfg.fontSize;
    document.getElementById('boldText').checked = cfg.boldText;
    document.getElementById('apiChecks').checked = cfg.apiChecks;
    document.getElementById('vtApiKey').value = cfg.vtApiKey;
    document.getElementById('phishTankAppKey').value = cfg.phishTankAppKey;
    document.getElementById('hibpApiKey').value = cfg.hibpApiKey;
    document.getElementById('theme').value = cfg.theme;
  });
}

function save() {
  const cfg = {
    fontSize: document.getElementById('fontSize').value,
    boldText: document.getElementById('boldText').checked,
    apiChecks: document.getElementById('apiChecks').checked,
    vtApiKey: document.getElementById('vtApiKey').value.trim(),
    phishTankAppKey: document.getElementById('phishTankAppKey').value.trim(),
    hibpApiKey: document.getElementById('hibpApiKey').value.trim(),
    theme: document.getElementById('theme').value
  };
  chrome.storage.sync.set(cfg, () => {
    const s = document.getElementById('status');
    s.textContent = 'Saved';
    setTimeout(() => s.textContent = '', 1200);
  });
}

document.getElementById('save').addEventListener('click', save);
load();
