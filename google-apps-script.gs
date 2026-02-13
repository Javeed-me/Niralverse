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
    var normalizedGmail = data.gmail ? data.gmail.toLowerCase().trim() : "";
    
    if (!action) return createJsonResponse({ result: 'error', message: 'No action provided' });

    if (action === 'signup') {
      var rows = sheet.getDataRange().getValues();
      for (var i = rows.length - 1; i >= 1; i--) {
        if (rows[i][2] && rows[i][2].toString().toLowerCase().trim() === normalizedGmail) {
          return createJsonResponse({ result: 'error', message: 'Email already used: ' + normalizedGmail });
        }
      }

      var rowData = [new Date(), data.name, data.gmail.trim(), data.teamName, data.collegeName, '', '', '', ''];
      sheet.appendRow(rowData);
      return createJsonResponse({ result: 'success' });
    } 
    
    if (action === 'sync' || action === 'update') {
      var rows = sheet.getDataRange().getValues();
      var rowIdx = -1;
      
      for (var i = rows.length - 1; i >= 1; i--) {
        if (rows[i][2] && rows[i][2].toString().toLowerCase().trim() === normalizedGmail) {
          rowIdx = i + 1;
          break;
        }
      }
      
      if (rowIdx === -1) {
        return createJsonResponse({ result: 'error', message: 'Gmail not found in sheet: ' + normalizedGmail });
      }

      var updates = 0;
      // Update Language
      if (data.language) {
        sheet.getRange(rowIdx, 6).setValue(data.language.toUpperCase());
        updates++;
      }

      // Update Answers (Consolidated array)
      if (data.results && Array.isArray(data.results)) {
        for (var idx = 0; idx < data.results.length; idx++) {
          if (data.results[idx]) {
            sheet.getRange(rowIdx, 7 + idx).setValue(data.results[idx].toString());
            updates++;
          }
        }
      }

      // Backwards compatibility for single answer update
      if (data.type === 'answer' && data.problemIndex !== undefined && data.value) {
         sheet.getRange(rowIdx, 7 + parseInt(data.problemIndex)).setValue(data.value.toString());
         updates++;
      }
      
      return createJsonResponse({ result: 'success', updates: updates });
    }

    return createJsonResponse({ result: 'error', message: 'Invalid action: ' + action });

  } catch (error) {
    return createJsonResponse({ result: 'error', message: 'Server Side Error: ' + error.toString() });
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
