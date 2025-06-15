const form = document.getElementById('stockForm');
const message = document.getElementById('message');

// Replace this URL with your deployed Google Script URL
const scriptURL = "https://script.google.com/macros/s/PASTE-YOUR-DEPLOYMENT-URL-HERE/exec";

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    count: parseInt(document.getElementById('count').value),
    design: document.getElementById('design').value,
    yard: document.getElementById('yard').value,
    mode: document.getElementById('mode').value
  };

  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(res => {
    if (res.success) message.innerText = "Stock updated successfully!";
    else if (res.alert) message.innerText = "⚠️ " + res.alert;
    else message.innerText = "❌ " + res.error;
  })
  .catch(err => {
    message.innerText = "Something went wrong!";
    console.error(err);
  });
});
