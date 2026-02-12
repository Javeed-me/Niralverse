/**
 * Bug Hunt Backend - Google Apps Script
 * 
 * Columns: 1:Timestamp, 2:Name, 3:Gmail, 4:Team Name, 5:College Name, 
 *          6:Language Chosen, 7:Problem 1 Answer, 8:Problem 2 Answer, 9:Problem 3 Answer
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // 10 second lock to handle concurrency safely

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    
    if (action === 'signup') {
      var rowData = [
        new Date(),
        data.name,
        data.gmail,
        data.teamName,
        data.collegeName,
        '', // Language Chosen
        '', // Prob 1
        '', // Prob 2
        ''  // Prob 3
      ];
      sheet.appendRow(rowData);
      var rowId = sheet.getLastRow();
      
      return createJsonResponse({ result: 'success', rowId: rowId });
    } 
    
    if (action === 'update') {
      var gmail = data.gmail;
      var rows = sheet.getDataRange().getValues();
      var rowIdx = -1;
      
      // Look up row by Gmail (Column 3)
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][2] === gmail) {
          rowIdx = i + 1;
          break;
        }
      }
      
      var column = -1;
      if (data.type === 'language') column = 6;
      else if (data.type === 'answer') {
        column = 7 + parseInt(data.problemIndex);
      }
      
      if (column !== -1 && rowIdx !== -1) {
        sheet.getRange(rowIdx, column).setValue(data.value);
        return createJsonResponse({ result: 'success' });
      }
    }

    return createJsonResponse({ result: 'error', message: 'Invalid action or parameters' });

  } catch (error) {
    return createJsonResponse({ result: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
