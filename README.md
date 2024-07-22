# slack_reminders
A script for sending email and slack reminders via google appscript on sheets.

## Getting Started
1. Create your google sheet rotation schedule
2. Create a slack bot [webhook](https://api.slack.com/messaging/webhooks)
3. Go to Extensions in your google sheet and select "Apps Script" > "Create a new project"
4. In the editor, copy paste code in "whosPresenting" into your project
5. Read code and edit relevant information
   * email to slack-id dictionary
   * message
   * test-webhook/actual-webhook for slack 
6. Setup triggers under triggers.
   * choose sendEmails() or whatever you decided to name your function
   * pick your trigger. I use weekly time-based events.
