function getActiveTab() {
  return new Promise(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0]));
  });
}

async function init() {
  const tab = await getActiveTab();
  if (!tab?.id) return;

  chrome.tabs.sendMessage(tab.id, { type: 'GET_LAST_RESULT' }, (resp) => {
    const subjectEl = document.getElementById('subject');
    const scoreEl = document.getElementById('score');
    const explainEl = document.getElementById('explain');

    if (resp && resp.ok && resp.result) {
      const { subject, score } = resp.result;
      subjectEl.textContent = subject || '(No subject)';
      scoreEl.textContent = `${score}%`;
      explainEl.textContent = score >= 50
        ? 'Warning: content and links show phishing signals.'
        : 'No strong phishing indicators detected. Stay cautious.';
    } else {
      subjectEl.textContent = '(Open a message in Gmail)';
    }
  });

  document.getElementById('report').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://support.google.com/mail/answer/8253' });
  });

  document.getElementById('options').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

init();
