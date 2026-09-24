# Usage

- Open any email in **Gmail\Outlook (web)**.
- The extension analyzes the subject, body text, and links, then shows:
  - **Green banner** if score < 50
  - **Red banner** if score ≥ 50
  - **Confidence %** and a short advice line
- Click the extension icon to open the **Popup**:
  - See the subject and score
  - Quick link to Google’s phishing report help
  - Button to open **Settings**

## Settings
- **Font size** (normal/large) & **Bold text** affect the in‑Gmail banner.
- **Enable external API checks** (optional):
  - Requires your API keys for **VirusTotal** and/or **PhishTank** (HIBP shown but not typically used for URLs).
  - External checks can increase the risk score when a URL is flagged.

## Notes
- Scoring is heuristic and intentionally conservative. Always verify sensitive requests via trusted channels.
- Gmail’s DOM changes occasionally; if the subject/body aren’t detected, update selectors inside `content.js`.
