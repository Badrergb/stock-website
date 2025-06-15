function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  // Simple login validation (not secure for production)
  if (user === "admin" && pass === "1234") {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("stockSection").style.display = "block";
  } else {
    alert("Invalid username or password");
  }
}

function handleStock(action) {
  const count = parseInt(document.getElementById("countInput").value);
  const design = document.getElementById("designDropdown").value;
  const yards = document.getElementById("yardsDropdown").value;

  if (isNaN(count) || count <= 0) {
    alert("Enter a valid count");
    return;
  }

  const message = `${action === "purchase" ? "Added" : "Removed"} ${count} of ${design} - ${yards} Yards`;
  alert(message);

  // Optionally send data to Google Sheets via Apps Script
  // sendToGoogleSheets(count, design, yards, action);
}
