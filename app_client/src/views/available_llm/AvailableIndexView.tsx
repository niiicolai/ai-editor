import { useGetAvailableLlms } from "../../hooks/useAvailableLlm";
import { usePagination } from "../../hooks/usePagination";
import { AvailableLlmType } from "../../types/availableLlmType";
import { Link } from "react-router-dom";
import LayoutComponent from "../../components/LayoutComponent";

export default function AvailableIndexView() {
  const { page, limit, nextPage, prevPage } = usePagination();
  const { data, isLoading, error } = useGetAvailableLlms(page, limit);

  const renderItem = (llm: AvailableLlmType) => {
    return (
      <div key={llm._id}>
        <div className="font-mono text-sm px-4 py-3">
          <div className="mb-2 mt-2 flex justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">{llm.name}</h3>
            </div>
          </div>

          <div className="mb-1 grid grid-cols-2 w-full">
            <span className="text-gray-600">Cost/Input token:</span>
            <span className="text-right">
              ${llm.cost_per_input_token.toFixed(10)}
            </span>
          </div>
          <div className="mb-1 grid grid-cols-2 w-full">
            <span className="text-gray-600">Cost/Output token:</span>{" "}
            <span className="text-right">
              ${llm.cost_per_output_token.toFixed(10)}
            </span>
          </div>
          <div className="mb-1 grid grid-cols-2 w-full">
            <span className="text-gray-600">Fee/Input token:</span>{" "}
            <span className="text-right">
              ${llm.fee_per_input_token.toFixed(10)}
            </span>
          </div>
          <div className="mb-1 grid grid-cols-2 w-full">
            <span className="text-gray-600">Fee/Output token:</span>{" "}
            <span className="text-right">
              ${llm.fee_per_output_token.toFixed(10)}
            </span>
          </div>
        </div>

        <div className="h-2 bg-white border-t border-b border-dotted border-gray-300"></div>
      </div>
    );
  };

  return (
    <LayoutComponent
      pageName="models"
      slot={
        <div>
          <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Models
                  </h3>
                </div>
                <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cost Breakdown
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    The "Input Cost per Token" and "Output Cost per Token"
                    indicate the charges set by the language model provider.
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    The "Fee per Input Token" and "Fee per Output Token"
                    represent the service fees applied by this platform.
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    The "One Credit to USD" explains the conversion rate used to
                    calculate the cost in dollars for each credit spent. This
                    value is determined at the time of purchase and may vary
                    depending on market conditions or platform policies.
                  </p>
                </div>

                <div className="border-t border-gray-200">
                  <dl>
                    {isLoading && (
                      <div className="flex items-center justify-center text-xs">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                      </div>
                    )}
                    {error && (
                      <div className="text-red-500 text-center">
                        <p className="text-lg">Error loading models</p>
                        <p className="text-sm mt-2">Please try again later</p>
                      </div>
                    )}

                    <div className="bg-gray-50">
                      <div>
                        {data &&
                          data.llms.map((llm: AvailableLlmType) =>
                            renderItem(llm)
                          )}
                      </div>

                      {data?.llms.length === 0 && (
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="text-sm font-medium text-gray-900">
                            No models Found
                          </h3>
                        </div>
                      )}

                      <div className="flex justify-between px-4 py-3">
                        <button
                          onClick={prevPage}
                          disabled={page === 1}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => nextPage(data?.pages ?? 0)}
                          disabled={page >= (data?.pages ?? 0)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
