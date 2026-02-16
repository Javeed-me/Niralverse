/**
 * Bug Hunt Backend - Google Apps Script
 * 
 * Columns: 1:Timestamp, 2:Name, 3:Gmail, 4:Team Name, 5:College Name, 
 *          6:Language Chosen, 7:Problem 1 Answer, 8:Problem 2 Answer, 9:Problem 3 Answer, 10:Time Taken
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); 

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var normalizedGmail = data.gmail ? data.gmail.toLowerCase().trim() : "";
    
    // Get Headers to find columns dynamically
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var colMap = {};
    headers.forEach(function(h, i) {
      if (h) colMap[h.toString().toLowerCase().trim()] = i + 1;
    });

    if (!action) return createJsonResponse({ result: 'error', message: 'No action provided' });

    if (action === 'signup') {
      var gmailCol = colMap['gmail'] || 3;
      var rows = sheet.getDataRange().getValues();
      for (var i = rows.length - 1; i >= 1; i--) {
        if (rows[i][gmailCol-1] && rows[i][gmailCol-1].toString().toLowerCase().trim() === normalizedGmail) {
          return createJsonResponse({ result: 'error', message: 'Email already used: ' + normalizedGmail });
        }
      }

      // Default fallback order if headers aren't perfect
      var rowData = [new Date(), data.name, data.gmail.trim(), data.teamName, data.collegeName, '', '', '', '', ''];
      sheet.appendRow(rowData);
      return createJsonResponse({ result: 'success' });
    } 
    
    if (action === 'sync' || action === 'update') {
      var gmailCol = colMap['gmail'] || 3;
      var rows = sheet.getDataRange().getValues();
      var rowIdx = -1;
      
      for (var i = rows.length - 1; i >= 1; i--) {
        if (rows[i][gmailCol-1] && rows[i][gmailCol-1].toString().toLowerCase().trim() === normalizedGmail) {
          rowIdx = i + 1;
          break;
        }
      }
      
      if (rowIdx === -1) return createJsonResponse({ result: 'error', message: 'Gmail not found' });

      var updates = 0;
      // 1. Timestamp (Always Column 1 or found by "timestamp")
      var tsCol = colMap['timestamp'] || 1;
      sheet.getRange(rowIdx, tsCol).setValue(new Date());
      updates++;

      // 2. Language
      var langCol = colMap['language chosen'] || 6;
      if (data.language) {
        sheet.getRange(rowIdx, langCol).setValue(data.language.toUpperCase());
        updates++;
      }

      // 3. Answers (Problem 1, 2, 3)
      var p1Col = colMap['program 1'] || 7;
      if (data.results && Array.isArray(data.results)) {
        for (var idx = 0; idx < data.results.length; idx++) {
          if (data.results[idx]) {
            sheet.getRange(rowIdx, p1Col + idx).setValue(data.results[idx].toString());
            updates++;
          }
        }
      }

      // 4. Time Taken
      var ttCol = colMap['time taken'] || 10;
      if (data.timeTaken) {
         sheet.getRange(rowIdx, ttCol).setValue(data.timeTaken);
         updates++;
      }

      // 5. Total Duration
      var tdCol = colMap['total duration'] || 11;
      if (data.totalDuration) {
         sheet.getRange(rowIdx, tdCol).setValue(data.totalDuration);
         updates++;
      }

      // 6. Remaining Time
      var remCol = colMap['remaining'] || colMap['remaining time'];
      if (remCol && data.remainingTime) {
         sheet.getRange(rowIdx, remCol).setValue(data.remainingTime);
         updates++;
      }
      
      return createJsonResponse({ result: 'success', updates: updates });
    }

    return createJsonResponse({ result: 'error', message: 'Invalid action' });

  } catch (error) {
    return createJsonResponse({ result: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT);
}
