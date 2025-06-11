import { useGetPaymentJobs } from "../../hooks/usePaymentJob";
import { useGetAuthJobs } from "../../hooks/useAuthJob";
import { useGetAgentJobs } from "../../hooks/useAgentJob";
import { usePagination } from "../../hooks/usePagination";
import { useState } from "react";
import { JobType } from "../../types/jobType";
import RestrictedComponent from "../../components/RestrictedComponent";
import RequireRoleComponent from "../../components/RequireRoleComponent";
import { Link } from "react-router-dom";

const states = ["pending", "completed", "error"];

export default function JobIndexView() {
  const [paymentJobState, setPaymentJobState] = useState("error");
  const [authJobState, setAuthJobState] = useState("error");
  const [agentJobState, setAgentJobState] = useState("error");
  const {
    page: pageAuth,
    limit: limitAuth,
    nextPage: nextPageAuth,
    prevPage: prevPageAuth,
  } = usePagination();
  const {
    page: pagePayment,
    limit: limitPayment,
    nextPage: nextPagePayment,
    prevPage: prevPagePayment,
  } = usePagination();
  const {
    page: pageAgent,
    limit: limitAgent,
    nextPage: nextPageAgent,
    prevPage: prevPageAgent,
  } = usePagination();
  const {
    data: paymentJobs,
    isLoading: paymentJobsLoading,
    error: paymentJobsError,
  } = useGetPaymentJobs(pagePayment, limitPayment, paymentJobState);
  const {
    data: authJobs,
    isLoading: authJobsLoading,
    error: authJobsError,
  } = useGetAuthJobs(pageAuth, limitAuth, authJobState);
  const {
    data: agentJobs,
    isLoading: agentJobsLoading,
    error: agentJobsError,
  } = useGetAgentJobs(pageAgent, limitAgent, agentJobState);
  const isLoading = paymentJobsLoading || authJobsLoading || agentJobsLoading;
  const error = paymentJobsError || authJobsError || agentJobsError;

  const renderStateButtons = (
    currentState: string,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return states.map((state) => (
      <button
        key={state}
        onClick={() => setState(state)}
        className={`px-4 py-2 border-1 border-black ${
          state === currentState
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {state.charAt(0).toUpperCase() + state.slice(1)}
      </button>
    ));
  };

  const renderJobItem = (job: JobType) => {
    return (
      <div key={job._id} className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Type: {job.type}</h3>
        <p className="mt-1 text-sm text-gray-500">State: {job.state}</p>
        <p className="mt-1 text-sm text-gray-500">Message: {job.message}</p>
        <div className="flex gap-2">
          <small className="mt-1 text-xs text-gray-500">
            Created At: {new Date(job.created_at).toLocaleString()}
          </small>
          <small className="mt-1 text-xs text-gray-500">
            Updated At: {new Date(job.updated_at).toLocaleString()}
          </small>
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
                      <h3 className="text-lg leading-6 font-medium text-gray-900" data-testid="job-title">
                        Job Management
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
                            <p className="text-lg">Error loading jobs</p>
                            <p className="text-sm mt-2">
                              Please try again later
                            </p>
                          </div>
                        )}

                        <div className="bg-gray-50 px-4 py-5">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">
                              Payment Jobs
                            </h2>

                            <div className="flex gap-2">
                              {renderStateButtons(
                                paymentJobState,
                                setPaymentJobState
                              )}
                            </div>
                          </div>

                          <div>
                            {paymentJobs &&
                              paymentJobs.jobs.map((job: JobType) =>
                                renderJobItem(job)
                              )}
                            {paymentJobs?.jobs.length === 0 && (
                              <div className="p-4 border-b border-gray-200">
                                <h3 className="text-sm font-medium text-gray-900">
                                  No Jobs Found
                                </h3>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between mt-4">
                            <button
                              onClick={prevPagePayment}
                              disabled={pagePayment === 1}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() =>
                                nextPagePayment(paymentJobs?.pages ?? 0)
                              }
                              disabled={
                                pagePayment >= (paymentJobs?.pages ?? 0)
                              }
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                              Next
                            </button>
                          </div>
                        </div>

                        <div className="bg-gray-30 px-4 py-5">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">
                              Auth Jobs
                            </h2>

                            <div className="flex gap-2">
                              {renderStateButtons(
                                authJobState,
                                setAuthJobState
                              )}
                            </div>
                          </div>
                          <div>
                            {authJobs &&
                              authJobs.jobs.map((job: JobType) =>
                                renderJobItem(job)
                              )}
                            {authJobs?.jobs.length === 0 && (
                              <div className="p-4 border-b border-gray-200">
                                <h3 className="text-sm font-medium text-gray-900">
                                  No Jobs Found
                                </h3>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between mt-4">
                            <button
                              onClick={prevPageAuth}
                              disabled={pageAuth === 1}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => nextPageAuth(authJobs?.pages ?? 0)}
                              disabled={pageAuth >= (authJobs?.pages ?? 0)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                              Next
                            </button>
                          </div>
                        </div>

                        <div className="bg-gray-30 px-4 py-5">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">
                              Agent Jobs
                            </h2>

                            <div className="flex gap-2">
                              {renderStateButtons(
                                agentJobState,
                                setAgentJobState
                              )}
                            </div>
                          </div>
                          <div>
                            {agentJobs &&
                              agentJobs.jobs.map((job: JobType) =>
                                renderJobItem(job)
                              )}
                            {agentJobs?.jobs.length === 0 && (
                              <div className="p-4 border-b border-gray-200">
                                <h3 className="text-sm font-medium text-gray-900">
                                  No Jobs Found
                                </h3>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between mt-4">
                            <button
                              onClick={prevPageAgent}
                              disabled={pageAgent === 1}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => nextPageAgent(agentJobs?.pages ?? 0)}
                              disabled={pageAgent >= (agentJobs?.pages ?? 0)}
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
