import { useGetPaymentTransactions } from "../../hooks/usePaymentTransaction";
import { useGetAuthTransactions } from "../../hooks/useAuthTransaction";
import { useGetAgentTransactions } from "../../hooks/useAgentTransaction";
import { useGetEmailTransactions } from "../../hooks/useEmailTransaction";
import { usePagination } from "../../hooks/usePagination";
import { useState } from "react";
import { TransactionType } from "../../types/transactionType";
import RestrictedComponent from "../../components/RestrictedComponent";
import RequireRoleComponent from "../../components/RequireRoleComponent";
import { Link } from "react-router-dom";

const states = ["pending", "completed", "error"];

export default function TransactionIndexView() {
  const [paymentTransactionState, setPaymentTransactionState] =
    useState("error");
  const [authTransactionState, setAuthTransactionState] = useState("error");
  const [agentTransactionState, setAgentTransactionState] = useState("error");
  const [emailTransactionState, setEmailTransactionState] = useState("error");
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
    page: pageEmail,
    limit: limitEmail,
    nextPage: nextPageEmail,
    prevPage: prevPageEmail,
  } = usePagination();
  const {
    data: paymentTransactions,
    isLoading: paymentTransactionsLoading,
    error: paymentTransactionsError,
  } = useGetPaymentTransactions(
    pagePayment,
    limitPayment,
    paymentTransactionState
  );
  const {
    data: authTransactions,
    isLoading: authTransactionsLoading,
    error: authTransactionsError,
  } = useGetAuthTransactions(pageAuth, limitAuth, authTransactionState);
  const {
    data: agentTransactions,
    isLoading: agentTransactionsLoading,
    error: agentTransactionsError,
  } = useGetAgentTransactions(pageAgent, limitAgent, agentTransactionState);
  const {
    data: emailTransactions,
    isLoading: emailTransactionsLoading,
    error: emailTransactionsError,
  } = useGetEmailTransactions(pageEmail, limitEmail, emailTransactionState);
  const isLoading = paymentTransactionsLoading || authTransactionsLoading || agentTransactionsLoading || emailTransactionsLoading;
  const error = paymentTransactionsError || authTransactionsError || agentTransactionsError || emailTransactionsError;

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

  const renderTransactionItem = (transaction: TransactionType) => {
    return (
      <div key={transaction._id} className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">
          Type: {transaction.type}
        </h3>
        <p className="mt-1 text-sm text-gray-500">State: {transaction.state}</p>
        <div className="flex gap-2">
          <small className="mt-1 text-xs text-gray-500">
            Created At: {new Date(transaction.created_at).toLocaleString()}
          </small>
          <small className="mt-1 text-xs text-gray-500">
            Updated At: {new Date(transaction.updated_at).toLocaleString()}
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
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Transaction Management
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
                            <p className="text-lg">
                              Error loading transactions
                            </p>
                            <p className="text-sm mt-2">
                              Please try again later
                            </p>
                          </div>
                        )}

                        <div className="bg-gray-50 px-4 py-5">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">
                              Payment Transactions
                            </h2>

                            <div className="flex gap-2">
                              {renderStateButtons(
                                paymentTransactionState,
                                setPaymentTransactionState
                              )}
                            </div>
                          </div>

                          <div>
                            {paymentTransactions &&
                              paymentTransactions.transactions.map(
                                (transaction: TransactionType) =>
                                  renderTransactionItem(transaction)
                              )}
                            {paymentTransactions?.transactions.length === 0 && (
                              <div className="p-4 border-b border-gray-200">
                                <h3 className="text-sm font-medium text-gray-900">
                                  No transactions Found
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
                                nextPagePayment(paymentTransactions?.pages ?? 0)
                              }
                              disabled={
                                pagePayment >= (paymentTransactions?.pages ?? 0)
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
                              Auth Transactions
                            </h2>

                            <div className="flex gap-2">
                              {renderStateButtons(
                                authTransactionState,
                                setAuthTransactionState
                              )}
                            </div>
                          </div>
                          <div>
                            {authTransactions &&
                              authTransactions.transactions.map(
                                (transaction: TransactionType) =>
                                  renderTransactionItem(transaction)
                              )}
                            {authTransactions?.transactions.length === 0 && (
                              <div className="p-4 border-b border-gray-200">
                                <h3 className="text-sm font-medium text-gray-900">
                                  No transactions Found
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
                              onClick={() =>
                                nextPageAuth(authTransactions?.pages ?? 0)
                              }
                              disabled={
                                pageAuth >= (authTransactions?.pages ?? 0)
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
                              Agent Transactions
                            </h2>

                            <div className="flex gap-2">
                              {renderStateButtons(
                                agentTransactionState,
                                setAgentTransactionState
                              )}
                            </div>
                          </div>
                          <div>
                            {agentTransactions &&
                              agentTransactions.transactions.map(
                                (transaction: TransactionType) =>
                                  renderTransactionItem(transaction)
                              )}
                            {agentTransactions?.transactions.length === 0 && (
                              <div className="p-4 border-b border-gray-200">
                                <h3 className="text-sm font-medium text-gray-900">
                                  No transactions Found
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
                              onClick={() =>
                                nextPageAgent(agentTransactions?.pages ?? 0)
                              }
                              disabled={
                                pageAgent >= (agentTransactions?.pages ?? 0)
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
                              Email Transactions
                            </h2>

                            <div className="flex gap-2">
                              {renderStateButtons(
                                emailTransactionState,
                                setEmailTransactionState
                              )}
                            </div>
                          </div>
                          <div>
                            {emailTransactions &&
                              emailTransactions.transactions.map(
                                (transaction: TransactionType) =>
                                  renderTransactionItem(transaction)
                              )}
                            {emailTransactions?.transactions.length === 0 && (
                              <div className="p-4 border-b border-gray-200">
                                <h3 className="text-sm font-medium text-gray-900">
                                  No transactions Found
                                </h3>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between mt-4">
                            <button
                              onClick={prevPageEmail}
                              disabled={pageEmail === 1}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() =>
                                nextPageEmail(emailTransactions?.pages ?? 0)
                              }
                              disabled={
                                pageEmail >= (emailTransactions?.pages ?? 0)
                              }
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
