import { useGetSamples } from "../../hooks/useSample";
import { usePagination } from "../../hooks/usePagination";
import { SampleType } from "../../types/sampleType";
import { Link } from "react-router-dom";
import RestrictedComponent from "../../components/RestrictedComponent";
import RequireRoleComponent from "../../components/RequireRoleComponent";
import LineChartComponent from "../../components/LineChartComponent";

export default function SampleIndexView() {
  const { page, limit, nextPage, prevPage, setLimit } = usePagination();
  const { data, isLoading, error } = useGetSamples(page, limit);

  const downloadCSV = () => {
    if (!data || !data.samples || data.samples.length === 0) return;

    const headers = [
      "Question",
      "Answer",
      "Event",
      "LLM",
      "Embedding Model",
      "Chunking Strategy",
      "Search Strategy",
      "Context Precision",
      "Response Relevancy",
      "Faithfulness",
      "Created At",
      "Updated At",
    ];

    const rows = data.samples.map((sample: SampleType) => [
      `"${sample.input_prompt.replace(/"/g, '""')}"`,
      `"${sample.output_response.replace(/"/g, '""')}"`,
      `"${sample.event}"`,
      `"${sample.config.llm}"`,
      `"${sample.config.embedding_model}"`,
      `"${sample.config.chunking_strategy}"`,
      `"${sample.config.search_strategy}"`,
      sample.metrics.context_precision,
      sample.metrics.response_relevancy,
      sample.metrics.faithfulness,
      `"${new Date(sample.created_at).toISOString()}"`,
      `"${new Date(sample.updated_at).toISOString()}"`,
    ]);

    const csvContent =
      headers.join(",") + "\n" + rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "samples.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderSampleItem = (sample: SampleType) => {
    return (
      <div key={sample._id} className="p-4 border-b border-gray-200">
        <div className="flex justify-between gap-2">
          <div className="flex flex-col gap-2 w-1/2">
            <div className="mt-1 text-sm text-gray-500 flex flex-col gap-1 w-full">
              <span className="font-bold">Question:</span>
              <span className="p-3 border border-gray-300 rounded-md bg-white text-xs overflow-hidden">
                {sample.input_prompt.length > 159
                  ? sample.input_prompt.slice(0, 159) + "..."
                  : sample.input_prompt}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-500 flex flex-col gap-1 w-full">
              <span className="font-bold">Answer:</span>
              <span className="p-3 border border-gray-300 rounded-md bg-white text-xs overflow-hidden">
                {sample.output_response.length > 159
                  ? sample.output_response.slice(0, 159) + "..."
                  : sample.output_response}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-500 flex flex-col gap-1 w-full">
              <span className="font-bold">Retrieved Files:</span>
              <span className="flex flex-col gap-1">
                {sample.input_embedded_files &&
                  sample.input_embedded_files.map((embeddedFile: any) => (
                    <div
                      key={embeddedFile._id}
                      className="p-3 border border-gray-300 rounded-md bg-white text-xs overflow-hidden"
                    >
                      {JSON.stringify(embeddedFile).length > 110
                        ? JSON.stringify(embeddedFile).slice(0, 110) + "..."
                        : JSON.stringify(embeddedFile)}
                    </div>
                  ))}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-64">
            <div className="flex flex-col gap-1 pb-3 border-b border-gray-300">
              <div className="mt-1 text-sm text-gray-500 w-full overflow-hidden truncate flex justify-between gap-1">
                <span className="font-bold">Event:</span>
                <span>{sample.event}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 pb-3 border-b border-gray-300">
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

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-300">
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
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          RAG Evaluation Management
                        </h3>
                        <div className="flex flex-col items-start gap-1 mt-2">
                          <label
                            htmlFor="limit"
                            className="text-sm font-medium text-gray-700"
                          >
                            Limit
                          </label>
                          <input
                            id="limit"
                            type="number"
                            min={1}
                            className="block w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="Limit"
                            value={limit}
                            onChange={(e) =>
                              setLimit(parseInt(e.target.value || "10"))
                            }
                          />
                          <small>Max Limit: 100</small>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        {data && (
                          <div className="flex gap-1 text-xs text-center">
                            <div className="w-24 flex flex-col gap-3 p-3 border border-gray-300 bg-emerald-400 text-white rounded-md">
                              <div className="font-bold h-12 flex flex-col items-center justify-center">
                                Average Context Precision
                              </div>
                              <div>
                                {data.stats.average_context_precision.toFixed(
                                  2
                                )}
                              </div>
                            </div>

                            <div className="w-24 flex flex-col gap-3 p-3 border border-gray-300 bg-red-400 text-white rounded-md">
                              <div className="font-bold h-12 flex flex-col items-center justify-center">
                                Average Response Relevancy
                              </div>
                              <div>
                                {data.stats.average_response_relevancy.toFixed(
                                  2
                                )}
                              </div>
                            </div>
                            <div className="w-24 flex flex-col gap-3 p-3 border border-gray-300 bg-blue-400 text-white rounded-md">
                              <div className="font-bold h-12 flex flex-col items-center justify-center">
                                Average Faithfulness
                              </div>
                              <div>
                                {data.stats.average_faithfulness.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col gap-3">
                          <Link
                            to="/user"
                            className="inline-flex items-center px-4 py-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Back
                          </Link>
                          <button
                            onClick={() => downloadCSV()}
                            className="inline-flex items-center px-4 py-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Download CSV
                          </button>
                        </div>
                      </div>
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
                          <div className="flex justify-between items-start border-b border-gray-300 mb-3 pb-3">
                            <h2 className="text-lg font-medium text-gray-900">
                              Metrics over time
                            </h2>

                            {data && (
                              <LineChartComponent
                                y1Label="Context Precision"
                                y2Label="Response Relevancy"
                                y3Label="Faithfulness"
                                data={data.samples.map(
                                  (sample: SampleType, index: number) => {
                                    return {
                                      x: index,
                                      y1: sample.metrics.context_precision,
                                      y2: sample.metrics.response_relevancy,
                                      y3: sample.metrics.faithfulness,
                                      name:
                                        sample.input_prompt.slice(0, 30) +
                                        (sample.input_prompt.length > 30
                                          ? "..."
                                          : ""),
                                    };
                                  }
                                ).reverse()}
                              />
                            )}
                          </div>

                          <h2 className="text-lg font-medium text-gray-900">
                            Samples
                          </h2>

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
