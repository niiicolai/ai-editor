import { createSendEmailSaga } from "../send_email_saga.js";

const { addListeners } = createSendEmailSaga("send_email:payment_service");
export default async () => addListeners();
