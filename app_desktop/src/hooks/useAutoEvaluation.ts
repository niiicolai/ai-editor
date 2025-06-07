import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useRagSearch } from "./useRagSearch";
import { useRef } from "react";

export const useAutoEvaluation = () => {
  const { meta } = useSelector((state: RootState) => state.projectIndex);  
  const { sessionId } = useSelector((state: RootState) => state.userAgentSession);
  const { autoEvaluation, embeddingModel, chunkMode, searchMode } = useSelector((state: RootState) => state.rag);
  const { questions } = autoEvaluation;
  const activeRef = useRef(false);
  const questionNoRef = useRef(1);
  const ragSearch = useRagSearch();

  const execute = async (event:string, selectedLlm: string, sendMessage:(msg:string) => void) => {
    if (activeRef.current) {
      activeRef.current = false;
      questionNoRef.current = 1;
      return;
    }

    activeRef.current = true;
    questionNoRef.current = 1;
    
    let i = 0;
    for (const key in questions) {
      if (!activeRef.current) break;
      const content = questions[key];
      const embeddedFiles = await ragSearch.search([content]);

      console.log(`${i}:${content}`);
      
      sendMessage(
        JSON.stringify({
          event,
          data: {
            content,
            embeddedFiles,
            user_agent_session_id: sessionId,
            selected_llm: selectedLlm,
            ...(meta?._id && {
              projectIndexId: meta?._id,
            }),
            embeddingModel,
            chunkMode,
            searchMode,
          },
        })
      );

      questionNoRef.current = i + 1;
      i++;

      // Wait 6 seconds before sending the next question
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
    
    activeRef.current = false;
    questionNoRef.current = 1;
  };

  return { execute, questionNoRef, activeRef };
};
