import { createSendEmailSaga } from "../send_email_saga.js";

const { addListeners } = createSendEmailSaga("user_credit_modification:agent_service");
export default async () => addListeners();
