function sendTelegramNotification(botSecret, chatId, body) {
    var url = "https://api.telegram.org/bot" + botSecret + "/sendMessage";
    var payload = {
      chat_id: chatId,
      text: body,
      parse_mode: "HTML"
    };
  
  
    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    };
  
  
    UrlFetchApp.fetch(url, options);
  }
  
  
  function mySendMessage() {
    const BOT_SECRET = 'Your BOT_TOKEN';
    const CHAT_ID = 'Your CHAT_ID';
  
  
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("info"); //name of the sheet you want your bot to take information from 
    const range = sheet.getRange('A1:L11').getValues(); //data range
  
  
    // Maximum width for each column
    const maxColWidth = 15;
  
  
    // Create the table with borders
    let table = "<pre style='font-size:10px;'>"; // Smaller font size for better fit
    let borderTop = "+";
    let borderBottom = "+";
    let borderMid = "+";
  
  
    let colWidths = [];
  
  
    // Calculate column widths
    for (let j = 0; j < range[0].length; j++) {
      let maxLen = 0;
      for (let i = 0; i < range.length; i++) {
        let cellContent = range[i][j].toString();
        // Check if the cell content is a float number and round it
        if (!isNaN(cellContent) && cellContent.toString().indexOf('.') != -1) {
          cellContent = parseFloat(cellContent).toFixed(4);
        }
        // Check if the cell content is in the last 5 columns and convert to percentage
        if (j >= range[0].length - 5 && !isNaN(cellContent) && cellContent.trim() !== "") {
          cellContent = (parseFloat(cellContent) * 100).toFixed(2) + "%";
        }
        maxLen = Math.min(maxColWidth, Math.max(maxLen, cellContent.length));
        range[i][j] = cellContent; // Update the cell content with rounded/converted value
      }
      colWidths.push(maxLen);
    }
  
  
    // Create top border
    colWidths.forEach(width => {
      borderTop += "-".repeat(width + 2) + "+";
      borderBottom += "-".repeat(width + 2) + "+";
      borderMid += "-".repeat(width + 2) + "+";
    });
  
  
    table += borderTop + "\n";
    for (let i = 0; i < range.length; i++) {
      table += "|";
      for (let j = 0; j < range[i].length; j++) {
        let cellContent = range[i][j].toString();
        let truncatedContent = cellContent.length > maxColWidth ? cellContent.substring(0, maxColWidth - 1) + "…" : cellContent;
        let cell = truncatedContent.padEnd(colWidths[j], ' ');
        table += " " + cell + " |";
      }
      table += "\n";
      if (i === 0) table += borderMid + "\n"; // Add mid border after the header row
    }
    table += borderBottom + "</pre>";
  
  
    sendTelegramNotification(BOT_SECRET, CHAT_ID, table);
  }
  