import { Link } from "react-router-dom";
import { XIcon, PlusIcon, SaveIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  setAutoEvaluation,
  setChunkMode,
  setEmbeddingModel,
  setSearchMode,
} from "../../features/rag";
import Scrollbar from "react-scrollbars-custom";
import { useState } from "react";

const ENV = import.meta.env.VITE_ENV || "development";

function RagIndexView() {
  const rag = useSelector((state: RootState) => state.rag);
  const [questions, setQuestions] = useState([...rag.autoEvaluation.questions]);
  const dispatch = useDispatch();
  const embeddingModels = [
    "all-MiniLM-L6-v2",
    "Salesforce/codet5p-110m-embedding",
  ];
  const chunkModes = ["custom_code", "language_model_augmentation"];
  const searchModes = ["vector_search"];

  const updateQuestion = (q: string, index: number) => {
    const newQuestions = [...questions];
    newQuestions[index] = q;
    setQuestions(newQuestions);
  }

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions.filter((_, i) => i !== index)];
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const saveQuestions = () => {
    dispatch(setAutoEvaluation({ questions }));
  };

  return (
    <Scrollbar className="flex min-h-screen main-bgg main-color">
      <div className="w-full p-6">
        <div className="secondary-bgg border border-color shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-color">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium main-color">
                RAG Settings
              </h3>
              <div className="flex justify-start items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md button-main"
                >
                  <XIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-start">
            <div className="flex justify-between items-center gap-3 p-3">
              <div>Embedding Model</div>
              <div>
                <select
                  defaultValue={rag.embeddingModel}
                  className="border-color border p-1 rounded-md w-64"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    dispatch(setEmbeddingModel(e.target.value))
                  }
                >
                  {embeddingModels.map((e: string) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center gap-3 p-3">
              <div>Chunk Mode</div>
              <div>
                <select
                  defaultValue={rag.chunkMode}
                  className="border-color border p-1 rounded-md w-64"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    dispatch(setChunkMode(e.target.value))
                  }
                >
                  {chunkModes.map((c: string) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={`flex justify-between items-center gap-3 p-3 ${ENV !== "production" ? "border-color border-b" : ""}`}>
              <div>Search Mode</div>
              <div>
                <select
                  defaultValue={rag.searchMode}
                  className="border-color border p-1 rounded-md w-64"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    dispatch(setSearchMode(e.target.value))
                  }
                >
                  {searchModes.map((c: string) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={`flex flex-col justify-between items-start gap-3 w-full p-3 ${ENV === "production" ? "hidden" : ""}`}>
              <div className="text-lg">Auto Evaluation Questions</div>
              <div className="w-full flex flex-col gap-1">
                {questions.map((q: string, index: number) => (
                  <div key={index} className="flex items-center gap-1">
                    <p className="w-10 text-center">{index + 1}</p>
                    <input
                      type="text"
                      placeholder="Question"
                      value={q}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(e.target.value, index)}
                      className="w-full border-color border p-1 rounded-md text-sm"
                    />
                    <button
                      onClick={() => removeQuestion(index)}
                      className="button-main border-color border px-2 py-1 rounded-md"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-1 py-3">
                  <button
                    onClick={() => saveQuestions()}
                    className="button-main border-color border px-2 py-2 rounded-md"
                  >
                    <SaveIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => addQuestion()} className="button-main border-color border px-2 py-2 rounded-md">
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Scrollbar>
  );
}

export default RagIndexView;
