import { GmailService } from "./src/services/gmail_service.js";

GmailService.authorize()
    .then(() => {
        console.log('Gmail Authorized');
        process.exit(0);
    })
    .catch(console.error);