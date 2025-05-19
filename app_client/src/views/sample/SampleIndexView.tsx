import { useGetSamples } from "../../hooks/useSample";
import { usePagination } from "../../hooks/usePagination";
import { SampleType } from "../../types/sampleType";
import { Link } from "react-router-dom";
import RestrictedComponent from "../../components/RestrictedComponent";
import RequireRoleComponent from "../../components/RequireRoleComponent";

export default function SampleIndexView() {
  const { page, limit, nextPage, prevPage } = usePagination();
  const { data, isLoading, error } = useGetSamples(page, limit);

  const renderSampleItem = (sample: SampleType) => {
    return (
      <div key={sample._id} className="p-4 border-b border-gray-200">

        <div className="flex justify-between gap-2">
          <div className="flex flex-col gap-2 w-1/2">
          <div className="mt-1 text-sm text-gray-500 flex flex-col gap-1">
              <span className="font-bold">Event:</span>
              <span>{sample.event}</span>
            </div>
            <div className="mt-1 text-sm text-gray-500 flex flex-col gap-1 w-full h-12 overflow-hidden truncate">
              <span className="font-bold">Question:</span>
              <span>{sample.input_prompt}</span>
            </div>
            <div className="mt-1 text-sm text-gray-500 flex flex-col gap-1 w-full h-12 overflow-hidden truncate">
              <span className="font-bold">Answer:</span>
              <span>{sample.output_response}</span>
            </div>
            <div className="mt-1 text-sm text-gray-500 flex flex-col gap-1 w-full h-12 overflow-hidden truncate">
              <span className="font-bold">Retrieved Files:</span>
              <span>{JSON.stringify(sample.input_embedded_files)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-64">
            <div className="flex flex-col gap-1 mb-1 pb-1 border-b border-gray-300">
              <div className="mt-1 text-sm text-gray-500 w-full overflow-hidden truncate flex flex-col gap-1">
                <span className="font-bold">LLM:</span>
                <span>{sample.config.llm}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500 w-full overflow-hidden truncate flex flex-col gap-1">
                <span className="font-bold">Embedding Model:</span>
                <span>{sample.config.embedding_model}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500 w-full overflow-hidden truncate flex flex-col gap-1">
                <span className="font-bold">Chunking Strategy:</span>
                <span>{sample.config.chunking_strategy}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500 w-full overflow-hidden truncate flex flex-col gap-1">
                <span className="font-bold">Search Strategy:</span>
                <span>{sample.config.search_strategy}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 mb-1 pb-1 border-b border-gray-300">
              <div className="mt-1 text-sm text-gray-500 w-full overflow-hidden truncate flex justify-between gap-1">
                <span className="font-bold">Context Precision:</span>
                <span>{sample.metrics.context_precision.toFixed(2)}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500 w-full overflow-hidden truncate flex justify-between gap-1">
                <span className="font-bold">Response Relevancy:</span>
                <span>{sample.metrics.response_relevancy.toFixed(2)}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500 w-full overflow-hidden truncate flex justify-between gap-1">
                <span className="font-bold">Faithfulness:</span>
                <span>{sample.metrics.faithfulness.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <small className="mt-1 text-xs text-gray-500 flex justify-between gap-1">
                <span className="font-bold">Created At:</span>
                <span>{new Date(sample.created_at).toLocaleString()}</span>
              </small>
              <small className="mt-1 text-xs text-gray-500 flex justify-between gap-1">
                <span className="font-bold">Updated At:</span>
                <span>{new Date(sample.updated_at).toLocaleString()}</span>
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <RestrictedComponent
      slot={
        <RequireRoleComponent
          role="admin"
          slot={
            <div>
              <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        RAG Evaluation Management
                      </h3>

                      <Link
                        to="/user"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Back
                      </Link>
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
                            <p className="text-lg">Error loading samples</p>
                            <p className="text-sm mt-2">
                              Please try again later
                            </p>
                          </div>
                        )}

                        <div className="bg-gray-50 px-4 py-5">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">
                              Samples
                            </h2>
                          </div>

                          <div>
                            {data &&
                              data.samples.map((sample: SampleType) =>
                                renderSampleItem(sample)
                              )}
                            {data?.samples.length === 0 && (
                              <div className="p-4 border-b border-gray-200">
                                <h3 className="text-sm font-medium text-gray-900">
                                  No samples Found
                                </h3>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between mt-4">
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
      }
    />
  );
}
