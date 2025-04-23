import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAgentSessionMessageType } from "../types/userAgentSessionMessageType";

interface UserAgentSession {
  sessionId: string | null;
  messages: UserAgentSessionMessageType[];
}

const userAgentSessionSlice = createSlice({
  name: "user_agent_session",
  initialState: {
    sessionId: null,
    messages: [],
  } as UserAgentSession,
  reducers: {
    setSessionId: (state: any, action: PayloadAction<string | null>) => {
      state.sessionId = action.payload;
    },
  },
});

export const { setSessionId } = userAgentSessionSlice.actions;
export default userAgentSessionSlice.reducer;
