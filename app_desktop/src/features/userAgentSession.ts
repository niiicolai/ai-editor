import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAgentSessionMessageType } from "../types/userAgentSessionMessageType";
import { UserAgentSessionOperationType } from "../types/userAgentSessionOperationType";

interface UserAgentSession {
  sessionId: string | null;
  operation: UserAgentSessionOperationType | null;
  messages: UserAgentSessionMessageType[];
}

const userAgentSessionSlice = createSlice({
  name: "user_agent_session",
  initialState: {
    sessionId: null,
    operation: null,
    messages: [],
  } as UserAgentSession,
  reducers: {
    setSessionId: (state: any, action: PayloadAction<string | null>) => {
      state.sessionId = action.payload;
    },
    setOperation: (state: any, action: PayloadAction<UserAgentSessionOperationType | null>) => {
      state.operation = action.payload;
    },
    addMessage: (state: any, action: PayloadAction<UserAgentSessionMessageType>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state: any) => {
      state.messages = [];
    }
  },
});

export const { setSessionId, addMessage, clearMessages, setOperation } = userAgentSessionSlice.actions;
export default userAgentSessionSlice.reducer;
