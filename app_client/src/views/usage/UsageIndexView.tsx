import { useGetLlmUsages } from "../../hooks/useLlmUsage";
import { usePagination } from "../../hooks/usePagination";
import { LlmUsageType } from "../../types/llmUsageType";
import { Link } from "react-router-dom";
import RestrictedComponent from "../../components/RestrictedComponent";
import { useState } from "react";
import { UserAgentSessionMessageType } from "../../types/userAgentSessionMessageType";
import { useNavigate } from "react-router-dom";

export default function UsageIndexView() {
  const { page, limit, nextPage, prevPage } = usePagination();
  const { data, isLoading, error } = useGetLlmUsages(page, limit);
  const [inspectedUsage, setInspectedUsage] = useState<LlmUsageType | null>(
    null
  );
  const navigate = useNavigate();

  const renderItem = (usage: LlmUsageType) => {
    return (
      <div
        key={usage._id}
      >
        <div className="font-mono text-sm px-4 py-3">
        <div className="mb-2 mt-2 flex justify-between items-center gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              LLM Usage Receipt
            </h3>
            <span className="text-gray-600 text-xs">ID: {usage._id}</span>
          </div>
          <button
            className="border border-gray-300 text-xs w-24 shadow-md bg-white text-black p-3 rounded-md hover:bg-gray-300"
            onClick={() => {
              if (inspectedUsage?._id == usage._id) setInspectedUsage(null);
              else setInspectedUsage(usage);
            }}
          >
            {inspectedUsage?._id == usage._id ? "Hide Details" : "Show Details"}
          </button>
        </div>

        <div className="mb-1 grid grid-cols-2 w-full">
          <span className="text-gray-600">LLM Model:</span> 
          <span className="text-right">{usage.llm.name}</span>
        </div>
        <div className="mb-1 grid grid-cols-2 w-full">
          <span className="text-gray-600">Event:</span> 
          <span className="text-right">{usage.event}</span>
        </div>
        <div className="mb-1 grid grid-cols-2 w-full">
          <span className="text-gray-600">Input:</span>{" "}
          <span className="text-right">{usage.prompt_tokens} Tokens</span>
        </div>
        <div className="mb-1 grid grid-cols-2 w-full">
          <span className="text-gray-600">Output:</span>{" "}
          <span className="text-right">{usage.completion_tokens} Tokens</span>
        </div>
        <div className="mb-1 grid grid-cols-2 w-full">
          <span className="text-gray-600">Total:</span>{" "}
          <span className="text-right">{usage.total_tokens} Tokens</span>
        </div>

        <hr className="my-3 border-dotted border-gray-500" />

        <p className="uppercase mb-1 font-bold">Cost at purchase:</p>

        <div className="mb-1 grid grid-cols-2 w-full">
          <span className="text-gray-600">Cost/Input Token:</span>
          <span className="text-right">
            ${usage.cost_per_input_token_at_purchase.toFixed(10)}
          </span>
        </div>
        <div className="mb-1 grid grid-cols-2 w-full">
          <span className="text-gray-600">Cost/Output Token:</span>
          <span className="text-right">
            ${usage.cost_per_output_token_at_purchase.toFixed(10)}
          </span>
        </div>
        <div className="mb-1 grid grid-cols-2 w-full">
          <span className="text-gray-600">Fee/Input Token:</span>
          <span className="text-right">
            ${usage.fee_per_input_token_at_purchase.toFixed(10)}
          </span>
        </div>
        <div className="mb-1 grid grid-cols-2 w-full">
          <span className="text-gray-600">Fee/Output Token:</span>
          <span className="text-right">
            ${usage.fee_per_output_token_at_purchase.toFixed(10)}
          </span>
        </div>
        <div className="mb-1 grid grid-cols-2 w-full">
          <span className="text-gray-600">One Credit to USD:</span>
          <span className="text-right">
            ${usage.credit_to_dollars_at_purchase.toFixed(5)}
          </span>
        </div>

        <hr className="my-3 border-dotted border-gray-500" />

        <div className="mb-1 font-semibold text-gray-900 grid grid-cols-2 w-full">
          <span>Credit Cost:</span>
          <span className="text-right">{usage.credit_cost.toFixed(10)}</span>
        </div>
        <div className="mb-1 font-semibold text-gray-900 grid grid-cols-2 w-full">
          <span>Total USD:</span>
          <span className="text-right">
            ${usage.total_cost_in_dollars.toFixed(10)}
          </span>
        </div>

        <div className="text-xs text-gray-500 text-right mt-2 mb-1">
          <div>
            Purchase Date: {new Date(usage.created_at).toLocaleString()}
          </div>
        </div>

        <div className="text-xs text-gray-500 text-right mb-4">
          <div>— Receipt Generated Automatically —</div>
        </div>

        {inspectedUsage?._id == usage._id && (
          <>
            <div className="mb-1">
              <span className="text-gray-900 text-lg font-bold mb-3 block">
                Details:
              </span>
              <div>
                <span className="text-gray-600 font-bold mb-3 block">
                  Input and Output messages:
                </span>
                {usage.user_agent_session_messages.map(
                  (msg: UserAgentSessionMessageType) => (
                    <div className="p-1 border-t border-gray-300">
                      <div className="mb-1 grid grid-cols-2 w-full">
                        <span className="text-gray-600">ID:</span>
                        <span className="text-right">{msg._id}</span>
                      </div>
                      <div className="mb-1 grid grid-cols-2 w-full">
                        <span className="text-gray-600">Message:</span>
                        <span className="text-right">{msg.content}</span>
                      </div>
                      <div className="mb-1 grid grid-cols-2 w-full">
                        <span className="text-gray-600">Code:</span>
                        <span className="text-right">
                          {msg.code ? msg.code : "None"}
                        </span>
                      </div>
                      <div className="mb-1 grid grid-cols-2 w-full">
                        <span className="text-gray-600">Client Function:</span>
                        <span className="text-right">
                          {msg.clientFn
                            ? `${msg.clientFn.name}: ${msg.clientFn.args}`
                            : "None"}
                        </span>
                      </div>
                      <div className="mb-1 grid grid-cols-2 w-full">
                        <span className="text-gray-600">State:</span>
                        <span className="text-right">{msg.state}</span>
                      </div>
                      <div className="mb-1 grid grid-cols-2 w-full">
                        <span className="text-gray-600">Role:</span>
                        <span className="text-right">{msg.role}</span>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div>
                <span className="text-gray-600 font-bold mb-3 block">
                  Context messages
                </span>
                {usage.context_user_agent_session_messages.map(
                  (msg: UserAgentSessionMessageType) => (
                    <div className="p-1 border-t border-gray-300">
                      <div className="mb-1 grid grid-cols-2 w-full">
                        <span className="text-gray-600">ID:</span>
                        <span className="text-right">{msg._id}</span>
                      </div>
                      <div className="mb-1 grid grid-cols-2 w-full">
                        <span className="text-gray-600">Message:</span>
                        <span className="text-right">{msg.content}</span>
                      </div>
                      <div className="mb-1 grid grid-cols-2 w-full">
                        <span className="text-gray-600">Code:</span>
                        <span className="text-right">
                          {msg.code ? msg.code : "None"}
                        </span>
                      </div>
                      <div className="mb-1 grid grid-cols-2 w-full">
                        <span className="text-gray-600">Client Function:</span>
                        <span className="text-right">
                          {msg.clientFn
                            ? `${msg.clientFn.name}: ${msg.clientFn.args}`
                            : "None"}
                        </span>
                      </div>
                      <div className="mb-1 grid grid-cols-2 w-full">
                        <span className="text-gray-600">State:</span>
                        <span className="text-right">{msg.state}</span>
                      </div>
                      <div className="mb-1 grid grid-cols-2 w-full">
                        <span className="text-gray-600">Role:</span>
                        <span className="text-right">{msg.role}</span>
                      </div>
                    </div>
                  )
                )}
                {!usage?.context_user_agent_session_messages?.length && (
                    <div className="text-gray-500 text-xs">No messages</div>
                )}
              </div>
            </div>
          </>
        )}
        </div>
        <div className="h-2 bg-white border-t border-b border-dotted border-gray-300"></div>
      </div>
    );
    
  };

  return (
    <RestrictedComponent
      slot={
        <div>
          <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    LLM Usage
                  </h3>

                  <Link
                    to="/user"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back
                  </Link>
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
                <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Credit Calculations
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    The "Credit Cost" is calculated as: <br />
                    <code className="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">
                      One Credit to USD at Purchase / (Input Cost + Output Cost
                      + Input Fee + Output Fee)
                    </code>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Please note that the cost may vary over time due to changes
                    in service costs, platform fees, or adjustments in pricing
                    policies by the language model provider.
                  </p>
                  <button
                    onClick={() => navigate("/models")}
                    className="text-blue-500 cursor-pointer hover:underline text-sm mt-1"
                  >
                    Find Current Prices
                  </button>
                </div>
                <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Understand Details
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    'Input and Output messages' shows the specific interactions
                    between the user and the language model during the session.
                    These messages include the prompts sent by the user and the
                    responses generated by the model.
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    'Context messages' shows additional background information
                    or context that was used to guide the language model's
                    responses. These messages help provide a more comprehensive
                    understanding of the session.
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
                        <p className="text-lg">Error loading LLM usages</p>
                        <p className="text-sm mt-2">Please try again later</p>
                      </div>
                    )}

                    <div className="bg-gray-50">
                      <div>
                        {data &&
                          data.usages.map((usage: LlmUsageType) =>
                            renderItem(usage)
                          )}
                      </div>

                      {data?.usages.length === 0 && (
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="text-sm font-medium text-gray-900">
                            No LLM usage Found
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
