//20May2019 - Script written to automate sending reminder emails to the individual that's presenting this week. - Roger Tu
//24May2021 - Added additional functionalities to message group slack channel - Andrew Su and Roger Tu
//24Jun2024 - Updated slack message to be able to tag more than 1 user - Roger Tu

// Calculates the difference between Date 1 and Date 2. Where Date 1 should be larger than Date 2 to be positive.
function daysLeft(date1, date2) {
    var ONE_DAY = 1000 * 60 * 60 * 24
    var date1 = new Date(date1)
    var date2 = new Date(date2)
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()
    return Math.round((date1_ms-date2_ms)/ONE_DAY)
}

// Translates emails to slack-id tags
function translateEmails(emails) {
  var userSlackDict = {
    'name@domain.edu':'<@SLACKID>',             // Person
    };
  return userSlackDict[emails];
}

// Sends email to the presenter that falls within 7 days of Monday (Trigger Day)
function sendEmails() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Upcoming'); // Selects sheet 'Upcoming'
  var startRow = 2; // Start at second row because the first row contains the data labels
  var numRows = sheet.getLastRow() - 1; // Put in here the number of rows you want to process

  // Fetch the range of cells BA2:C[n]
  // Column A = Presentation Day,  Column B = First Name Last Name, Column C = Email Address
  var dataRange = sheet.getRange(startRow, 1, numRows, 3)

  var days = 7;
  
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  
  for (i in data) {
    var row = data[i];
    var presentingDate = row[0]; //Current Week's Presenter day
    var presenterName = row[1];  //Current Week Presenter
    var presenterEmail = row[2]; //Current Week Emails
    var diffDate = daysLeft(presentingDate, new Date()); //new Date() calls current Day
    var emailAddresses = row[2].concat(",whoever_you_want_to_notify_email_went_out@gmail.com"); // 3rd column of selected data
    var message = " Hey " + presenterName + ",\n \n This is an automated reminder that you are presenting this Friday. \n\n Always, \n ReminderBot"; // Assemble the body text
    var subject = "Lab Meeting - Scheduled Presenter";
    var presenterSlackArray = presenterEmail.split(',');                // Split emails by commas
    var presenterSlackArray = presenterSlackArray.map(translateEmails); // remap the emails to slack-ids
        // Logger.log(presenterSlackArray.join(', ')) // print statements

    if (diffDate < days && diffDate >=0){
      // Email the presenter
      MailApp.sendEmail(emailAddresses, subject, message);
      
      // Slack Notification to lab
      var payload = {
        "blocks":[
          {
            "type":"section",
            "text":{
              "type": "mrkdwn",
              "text":"Looking forward to *"+presenterSlackArray.join(', ')+"'s* group meeting presentation on *"+Utilities.formatDate(row[0], "PDT","EEEE, M/dd") +"*! :tada:"
            }
          }, // if you want to add sections to your slack message
//          {
//            "type":"section",
//            "fields":[
//              {
//                "type":"mrkdwn",
//                "text":"*Topic:*\n"+presentingTopic//add Topic column
//              },
//              {
//                "type":"mrkdwn",
//                "text":"*Presenter:*:\n"+presenterName //add name
//              },
//            ]
//          },
          {
            "type":"section",
            "fields":[
              {
                "type":"mrkdwn",
                "text":"*When:* "+Utilities.formatDate(row[0], "America/Los_Angeles","EEEE, M/dd, hh:mm z")
              },
              {
                "type":"mrkdwn",
                "text":"*Join Us:* <https://domain.zoom.us/j/12345678 |Meeting Link>"
              }
            ]
          }
        ]
      }
//      var payload = {
//        'text': "Hey lab! This is a friendly reminder that "+userSlackDict[row[2]]+" will be presenting this "+Utilities.formatDate(row[0], "PDT","EEEE, M/dd") + ".  Looking forward to the presentation! :tada:"
//      };
      var options = {
        'method' : 'post',
        'contentType': 'application/json',
        'payload' : JSON.stringify(payload)
      };
      // Test Channel hook
      // UrlFetchApp.fetch('https://hooks.slack.com/services/some_test_webhook', options);
      // Lab Channel hook
      UrlFetchApp.fetch('https://hooks.slack.com/services/your_lab_channel', options);
    }
  }
}
