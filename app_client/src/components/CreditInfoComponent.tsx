import { useGetUserCreditLeft } from "../hooks/useUser";

function CreditInfoComponent() {
  const { data: userCreditLeft, isLoading, error } = useGetUserCreditLeft();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-lg">Error loading credit info</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center p-3 bg-white rounded-lg shadow w-full">
      <div className="text-2xl font-bold text-indigo-600">
        {userCreditLeft?.credit}
      </div>
      <div className="text-xs text-gray-500">Available</div>
    </div>
  );
}

export default CreditInfoComponent;
