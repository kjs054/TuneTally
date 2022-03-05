import * as mailgun from "mailgun-js";
const DOMAIN = 'mg.tunetally.com';
const mg = mailgun({apiKey: '7b3575049aa09d33ac9ea1db4ac7a21f-0f472795-68a27a7a', domain: DOMAIN});
import * as functions from 'firebase-functions';

const APP_NAME = 'Tunetally';

// Send an email to test@example.com

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.
  return sendWelcomeEmail(email, displayName);
});

async function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@tunetally.com>`,
    to: email,
    subject: `Welcome to ${APP_NAME} Beta!`,
    template: "welcome"
  };
  // The user subscribed to the newsletter.
  mg.messages().send(mailOptions)
    .then((result) => console.log('Done', result))
    .catch((error) => console.error('Error: ', error));
  return null;
}