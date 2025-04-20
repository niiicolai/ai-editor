import { useGetCreditInfo } from "../../../hooks/useUserProduct"

function CreditInfoComponent() {
    const { data: creditInfo, isLoading, error } = useGetCreditInfo();

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
        <div>
            <div className="flex mb-1 items-center justify-between">
                <div className="mr-1">
                    <span className="text-xs font-semibold inline-block main-text">
                        Credits Used
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-xs font-semibold inline-block main-text">
                        {creditInfo?.totalUsedCredits} / {creditInfo?.totalMaxCredits}
                    </span>
                </div>
            </div>
            <div className="hidden h-2 text-xs flex rounded bg-indigo-200">
                <div
                    style={{ width: `${((creditInfo?.totalUsedCredits || 0) / (creditInfo?.totalMaxCredits || 1)) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
                ></div>
            </div>
        </div>
    )
}

export default CreditInfoComponent;
