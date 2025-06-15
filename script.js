const scriptURL = "https://script.google.com/macros/s/AKfycby3j570uLHPOqLTf1UOG2r9QrNYEOZrek2jClaZ6BRjmQGT41GLxEzda7qeikK1zEk1/exec";

window.onload = () => {
  fetch(`${scriptURL}?action=getStockOptions`)
    .then(res => res.json())
    .then(data => {
      const designSel = document.getElementById("designs");
      const yardSel = document.getElementById("yards");

      designSel.innerHTML = "";
      data.designs.forEach(d => {
        const opt = document.createElement("option");
        opt.value = opt.text = d;
        designSel.appendChild(opt);
      });

      yardSel.innerHTML = "";
      data.yards.forEach(y => {
        const opt = document.createElement("option");
        opt.value = opt.text = y;
        yardSel.appendChild(opt);
      });
    });
};

function updateStock(action) {
  const count = parseInt(document.getElementById("count").value);
  const design = document.getElementById("designs").value;
  const yards = document.getElementById("yards").value;
  const result = document.getElementById("result");

  if (!count || !design || !yards) {
    result.innerText = "❌ Please fill in all fields.";
    return;
  }

  fetch(`${scriptURL}?action=updateStock&count=${count}&design=${design}&yards=${yards}&actionType=${action}`)
    .then(res => res.text())
    .then(msg => {
      result.innerText = msg;
    });
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}
