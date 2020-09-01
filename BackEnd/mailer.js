const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const config = require('config');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly','https://mail.google.com/',
'https://www.googleapis.com/auth/gmail.modify',
'https://www.googleapis.com/auth/gmail.compose',
'https://www.googleapis.com/auth/gmail.send',];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';



class Mailer{
  constructor(){
    this.sendMailUtil=this.sendMailUtil.bind(this);
  }

  mail(mailId, line, bookName){
    this.mailId=mailId; this.line=line; this.bookName=bookName;
      authorizeToken(this.sendMailUtil);
    
  }


  sendMailUtil(auth){
    console.log(this);
    const gmail = google.gmail({version: 'v1', auth});
    const subject = 'Daily Book Lines';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      'From:<chhabra99yogesh@gmail.com>',
      `To: <${this.mailId}>`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      `Today's Favourite Line reminder:<br>`,
      `${this.line}<br> from the book: ${this.bookName}`,
    ];
    const message = messageParts.join('\n');
  
    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  
    gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    }).then(res=>console.log("success",res.data))
    .catch((e)=>console.log(e));
    }
}



/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function authorizeToken(callback) {
  client_id=config.get('client_id');
  client_secret=config.get('client_secret');
  redirect_uris="urn:ietf:wg:oauth:2.0:oob";
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret,redirect_uris);

    token={
      "access_token":config.get('access_token'),
      "refresh_token":config.get('refresh_token'),
      "scope":"https://mail.google.com/ https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose",
      "token_type":"Bearer",
      "expiry_date":1598950439057}
    oAuth2Client.setCredentials(token);
    callback(oAuth2Client);
  
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}

function test(){
mailer=new Mailer()
mailer.mail("yasharora707@gmail.com","Hey There","The Book")
}

module.exports.Mailer=Mailer;