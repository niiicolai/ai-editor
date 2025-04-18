import { useGetCreditInfo } from "../hooks/useUserProduct"

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
        <>
            <div className="space-y-4">
                {/* Progress Bar */}
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block text-indigo-600">
                                Credits Used
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-indigo-600">
                                {creditInfo?.totalUsedCredits} / {creditInfo?.totalMaxCredits}
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                        <div
                            style={{ width: `${((creditInfo?.totalUsedCredits || 0) / (creditInfo?.totalMaxCredits || 1)) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
                        ></div>
                    </div>
                </div>

                {/* Credit Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg shadow">
                        <div className="text-2xl font-bold text-indigo-600">
                            {creditInfo?.creditsLeft}
                        </div>
                        <div className="text-xs text-gray-500">
                            Available
                        </div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow">
                        <div className="text-2xl font-bold text-indigo-600">
                            {creditInfo?.totalMaxCredits}
                        </div>
                        <div className="text-xs text-gray-500">
                            Total
                        </div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow">
                        <div className="text-2xl font-bold text-indigo-600">
                            {creditInfo?.totalUsedCredits}
                        </div>
                        <div className="text-xs text-gray-500">
                            Used
                        </div>
                    </div>
                </div>

                {/* Usage Info */}
                <div className="text-xs text-gray-500 italic">
                    {!creditInfo?.creditsLeft ? (
                        <span className="text-red-500">You have used all your credits. Consider purchasing more to continue using our services.</span>
                    ) : (creditInfo.creditsLeft < ((creditInfo?.totalMaxCredits || 0) * 0.2)) ? (
                        <span className="text-yellow-500">You're running low on credits. Consider purchasing more soon.</span>
                    ) : (
                        <span>You have plenty of credits available for your needs.</span>
                    )}
                </div>
            </div>
        </>
    )
}

export default CreditInfoComponent;
