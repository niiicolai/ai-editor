import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Code } from "lucide-react";
import { useGetLanguage } from "../../hooks/useGetLanguage";
import DropdownComponent from "../utils/DropdownComponent";
import { setFile } from "../../features/editor";

function LanguageOptionsComponent() {
  const { file } = useSelector((state: RootState) => state.editor);
  const { getAllLanguages, getLanguageFromFile } = useGetLanguage();
  const languages = getAllLanguages();
  const dispatch = useDispatch();
  const handleSetLang = (lang: string) => {
    if (lang == "auto") {
        lang = getLanguageFromFile(file.name);
    }
    dispatch(
      setFile({
        ...file,
        language: lang,
      })
    );
  };

  return (
    <div className="flex justify-start items-center gap-1">
      <Code className="w-3.5 h-3.5 mt-0.5" />
      <DropdownComponent
        id="footer-language-drop-down"
        className="w-24 bottom-5"
        buttonText={file.language}
        slot={
          <>
            <button
              onClick={() => handleSetLang("auto")}
              className="button-main w-full text-xs text-left px-2 py-1"
            >
              auto
            </button>
            {languages.map((lang: string) => (
              <button
                key={lang}
                onClick={() => handleSetLang(lang)}
                className="button-main w-full text-xs text-left px-2 py-1"
              >
                {lang}
              </button>
            ))}
          </>
        }
      />
    </div>
  );
}

export default LanguageOptionsComponent;
