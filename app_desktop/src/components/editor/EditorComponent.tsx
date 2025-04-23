import EditorCodeComponent from "./EditorCodeComponent";
import EditorBarComponent from "./EditorBarComponent";
import EditorTabsComponent from "./EditorTabsComponent";
import EditorSearchComponent from "./EditorSearchComponent";

function EditorComponent() {
  return (
    <>
      <EditorTabsComponent />
      <EditorCodeComponent />
      <EditorSearchComponent />
      <EditorBarComponent />
    </>
  );
}

export default EditorComponent;
