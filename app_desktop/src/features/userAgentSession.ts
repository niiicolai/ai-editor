import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAgentSessionMessageType } from "../types/userAgentSessionMessageType";
import { UserAgentSessionOperationType } from "../types/userAgentSessionOperationType";

interface UserAgentSession {
  sessionTitle: string | null;
  sessionId: string | null;
  operation: UserAgentSessionOperationType | null;
  messages: UserAgentSessionMessageType[];
}

const userAgentSessionSlice = createSlice({
  name: "user_agent_session",
  initialState: {
    sessionTitle: null,
    sessionId: null,
    operation: null,
    messages: [],
  } as UserAgentSession,
  reducers: {
    setSessionTitle: (state: any, action: PayloadAction<string | null>) => {
      state.sessionTitle = action.payload;
    },
    setSessionId: (state: any, action: PayloadAction<string | null>) => {
      state.sessionId = action.payload;
    },
    setOperation: (
      state: any,
      action: PayloadAction<UserAgentSessionOperationType | null>
    ) => {
      state.operation = action.payload;
    },
    addMessage: (
      state: any,
      action: PayloadAction<UserAgentSessionMessageType>
    ) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state: any) => {
      state.messages = [];
    },
    setMessages: (
      state: any,
      action: PayloadAction<UserAgentSessionMessageType[]>
    ) => {
      state.messages = action.payload;
    },
  },
});

export const {
  setSessionId,
  setSessionTitle,
  addMessage,
  clearMessages,
  setOperation,
  setMessages,
} = userAgentSessionSlice.actions;
export default userAgentSessionSlice.reducer;
