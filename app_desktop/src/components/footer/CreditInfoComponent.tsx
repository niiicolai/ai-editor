import { useIsAuthorized, useGetUserCreditLeft } from "../../hooks/useUser";

function CreditInfoComponent() {
  const { data: isAuthorized } = useIsAuthorized();
  const { data: creditLeft, isLoading, error } = useGetUserCreditLeft();

  if (!isAuthorized) {
    return <></>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-xs">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center text-xs">
        <div className="text-red-500 text-center">
          <p className="text-lg">Error loading credit info</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-1 justify-start highlight-color">
        <span className="text-xs font-semibold inline-block" data-testid="editor-footer-credit-info">
          Credit Left:
        </span>
        <span className="text-xs font-semibold inline-block">
          {creditLeft?.credit}
        </span>
      </div>
    </div>
  );
}

export default CreditInfoComponent;
