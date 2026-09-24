# 🛡️ Cyber Oman Shield 2040 V1

A Chrome extension that scans Gmail in real time and warns you before you click a phishing email.

---

## ✨ Features

- **Real-time Gmail scanning**: analyzes the open email thread and injects a risk banner (Safe / Risky) directly inside Gmail
- **Local heuristic scoring**: flags suspicious keywords, IP-based links, brand-impersonation attempts, and risky top-level domains
- **Optional threat-intel checks**:VirusTotal and PhishTank lookups for links, if you provide your own API keys
- **Popup summary**: shows the subject, score, and a quick explanation for the current email
- **Customizable settings**: font size, bold text, theme, and API integration
- **Privacy-first by default**:all analysis runs locally in your browser; nothing is sent anywhere unless you explicitly enable external API checks

## 📁 Files

- `manifest.json`: Extension configuration, permissions, and background worker declaration (Manifest V3)
- `content.js`: Core script running inside Gmail and Outlook that scans open emails, calculates heuristic scores, and injects the risk banner
- `background.js`: Service worker handling optional threat-intel API calls (VirusTotal and PhishTank)
- `popup.html` / `popup.js`: Toolbar extension popup UI for viewing email analysis summary and reporting phishing
- `options.html` / `options.js`: Settings page for adjusting banner appearance, themes, and managing API keys
- `styles.css`: UI styling for the injected Gmail banner, popup window, and options page
- `docs/`: Directory containing project guides and documentation:
  - `INSTALLATION.md`: Detailed installation steps for Chrome and Microsoft Edge
  - `USAGE.md`: Comprehensive guide on feature usage, popup details, and options configuration
  - `PRIVACY_POLICY.md`: Starter privacy policy explaining local data processing and API privacy
  - `DEMO_SCRIPT.md`: Step-by-step walkthrough script and sample phishing email text for video demos

## 🚀 Installation

1. Download or clone this repository.
2. Open Chrome (or Edge) and go to `chrome://extensions` (Edge: `edge://extensions`).
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select this folder.
5. Pin the extension for quick access.
6. Open **Gmail**, open any email thread a green (safe) or red (risky) banner will appear at the top with a confidence score.

No login required. Threat-intel checks are optional and require your own API keys, added from the extension's **Settings** page.

##  Usage

- Open any email in Gmail (web).
- The extension analyzes the subject, body, and links, then shows:
  - ✅ **Green banner**: score below 50
  - ⚠️ **Red banner**: score 50 or above
- Click the extension icon to see the subject, score, and a link to report phishing to Google.

## 🔒 Privacy

- Runs **locally** in your browser by default  no data leaves your device.
- If you enable external API checks, only **link URLs** (never full email text) are sent to the provider(s) you configure.
- API keys are stored in your browser's extension storage. You can clear them anytime from Settings.
- We do not collect, store, or transmit any personal data to our own servers.

Full details: [`docs/PRIVACY_POLICY.md`](docs/PRIVACY_POLICY.md)

## ⚠️ Known Limitations (V1)

- Heuristic scoring only no machine learning model yet.
- Have I Been Pwned integration is present in settings but not yet functional for link checks.
- No caching rescans can repeat while an email stays open.

A major upgrade addressing these and adding new detection features is in progress for **V2 (2026)** stay tuned. ✅✅

## 📌 Disclaimer

This tool is for educational and authorized security-testing purposes as part of a graduation project. It is a heuristic aid, not a guarantee  always verify sensitive requests (payments, credentials, account changes) through a trusted channel.

## 👥 Credits

Developed by M.Alfahdi, A.Al Jabri, and S.Al Shuhoumi 
