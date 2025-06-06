import { Computer, FolderArchive } from "lucide-react";
import { hierarchySettingsActions } from "../../features/hierarchySettings";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setResponsiveActive } from "../../features/userAgentSession";

function ResponsiveOptionsComponent() {
  const { responsiveActive: hierarchActive } = useSelector(
    (state: RootState) => state.hierarchySettings
  );
  const { responsiveActive: agentActive } = useSelector(
    (state: RootState) => state.userAgentSession
  );
  const dispatch = useDispatch();

  const toggleHierarchyResponsive = () => {
    dispatch(
      hierarchySettingsActions.setHierarchyResponsiveActive(!hierarchActive)
    );
    if (agentActive) dispatch(setResponsiveActive(false));
  };

  const toggleAgentResponsive = () => {
    dispatch(setResponsiveActive(!agentActive));
    if (hierarchActive)
      dispatch(hierarchySettingsActions.setHierarchyResponsiveActive(false));
  };

  return (
    <>
      <button
        title="Assistant"
        onClick={() => toggleAgentResponsive()}
        className={`lg:hidden inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed ${
          agentActive ? "highlight-color" : ""
        }`}
      >
        <Computer className="h-3 w-3" />
      </button>
      <button
        title="Explorer"
        onClick={() => toggleHierarchyResponsive()}
        className={`lg:hidden inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed ${
          hierarchActive ? "highlight-color" : ""
        }`}
      >
        <FolderArchive className="h-3 w-3" />
      </button>
    </>
  );
}

export default ResponsiveOptionsComponent;
