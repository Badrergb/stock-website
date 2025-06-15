function doGet(e) {
  const sheetName = e.parameter.sheet === 'history' ? 'StockHistory' : 'Stock';
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  const result = rows.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const stockSheet = ss.getSheetByName("Stock");
  const historySheet = ss.getSheetByName("StockHistory");

  const headers = stockSheet.getDataRange().getValues()[0];
  const data = stockSheet.getDataRange().getValues();

  const countCol = headers.indexOf("வ .எண்");
  const designCol = headers.indexOf("தரம்");
  const yardCol = headers.indexOf(payload.yard.trim());  // Example: "6 கெஜம்"
  const minStockCol = headers.indexOf("குறைந்தபட்ச பங்கு நிலை");

  let updated = false;

  for (let i = 1; i < data.length; i++) {
    if (data[i][countCol] == payload.count && data[i][designCol] == payload.design) {
      let current = Number(data[i][yardCol]) || 0;
      let newValue = payload.action === "purchase" ? current + payload.quantity : current - payload.quantity;

      stockSheet.getRange(i + 1, yardCol + 1).setValue(newValue);
      updated = true;

      // Log to StockHistory
      historySheet.appendRow([
        payload.username,
        payload.count,
        payload.design,
        payload.yard,
        payload.quantity,
        payload.action === "purchase" ? "வாங்கல்" : "விற்பனை",
        new Date()
      ]);

      // Check against minimum stock level
      const minStock = Number(data[i][minStockCol]) || 0;
      if (newValue < minStock) {
        return ContentService.createTextOutput(`⚠️ எச்சரிக்கை: ${payload.yard} கெஜம் பங்கு ${payload.design} குறைவாக உள்ளது. தயவுசெய்து புதுப்பிக்கவும்!`);
      } else {
        return ContentService.createTextOutput(`✅ பங்கு புதுப்பிக்கப்பட்டது: ${payload.yard} கெஜம் - தற்போது: ${newValue}`);
      }
    }
  }

  if (!updated) {
    return ContentService.createTextOutput(`❌ பங்கு கிடைக்கவில்லை: ${payload.count} - ${payload.design}`);
  }
}
