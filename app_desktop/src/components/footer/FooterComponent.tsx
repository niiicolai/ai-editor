import CreditInfoComponent from "./CreditInfoComponent";
import TabSizeOptionsComponent from "./TabSizeOptionsComponent";
import LanguageOptionsComponent from "./LanguageOptionsComponent";
import FolderOptionComponent from "./FolderOptionComponent";
import ThemeOptionComponent from "./ThemeOptionComponent";
import IndexingComponent from "./IndexingComponent";

function FooterComponent() {

  return (
    <footer className="px-3 py-1 border-color border-t main-bgg w-full overflow-hidden truncate">
      <div className="flex flex-row justify-between items-center gap-3">
        <div>
          <CreditInfoComponent />
        </div>
        
        <div className="flex flex-row justify-start items-center gap-3 text-xs highlight-color">
          <IndexingComponent />
          <FolderOptionComponent />
          <TabSizeOptionsComponent />
          <LanguageOptionsComponent />
          <ThemeOptionComponent />
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;
