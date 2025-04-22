import LayoutComponent from "../../components/LayoutComponent";
import { useGetOrderedDocPage } from "../../hooks/useDocPage";
import { DocOrderedPageType, DocPageType } from "../../types/docPagesType";
import { useState, useEffect } from "react";
import Markdown from "react-markdown";

function DocsIndexView() {
  const { data: orderedPages, isLoading, error } = useGetOrderedDocPage();
  const [activePage, setActivePage] = useState<DocPageType | null>(null);
  const [prevPage, setPrevPage] = useState<DocPageType | null>(null);
  const [nextPage, setNextPage] = useState<DocPageType | null>(null);

  // Flatten pages to a single list to simplify prev/next navigation
  const allPages = orderedPages?.data.flatMap(group => group.pages) ?? [];

  useEffect(() => {
    if (allPages.length > 0) {
      setActivePage(allPages[0]);
    }
  }, [orderedPages]);

  useEffect(() => {
    if (!activePage) return;

    const index = allPages.findIndex(page => page._id === activePage._id);

    setPrevPage(index > 0 ? allPages[index - 1] : null);
    setNextPage(index < allPages.length - 1 ? allPages[index + 1] : null);
  }, [activePage, allPages]);

  const handlePrevPage = () => {
    if (prevPage) {
      setActivePage(prevPage);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      setActivePage(nextPage);
    }
  };


  if (isLoading) {
    return (
      <LayoutComponent pageName="docs" slot={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      } />
    );
  }

  if (error) {
    return (
      <LayoutComponent pageName="docs" slot={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p className="text-lg">Error loading docs</p>
            <p className="text-sm mt-2">Please try again later</p>
          </div>
        </div>
      } />
    );
  }

  return (
    <LayoutComponent pageName="docs" slot={
      <div className="bg-white flex gap-3 p-6">
        <div className="border border-slate-800 rounded-md w-64">
          {orderedPages?.data.map((orderedCollection: DocOrderedPageType) => (
            <div className="p-3" key={orderedCollection.category_name}>
              <h3 className="font-bold text-lg">{orderedCollection.category_name}</h3>
              <ul>
                {orderedCollection?.pages.map((page: DocPageType) => (
                  <li>
                    <button onClick={() => setActivePage(page)}
                      className={`hover:underline cursor-pointer ${activePage?._id === page._id
                        ? 'font-bold text-blue-500 underline'
                        : ''
                        }`}>{page.name}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          {activePage && (
            <div>
              <h1 className="font-bold border-b text-3xl pb-3 text-blue-500 mb-3">
                {activePage?.name}
              </h1>
              <div className="flex gap-3 text-xs mb-3">
                <span>Created {new Date(activePage?.created_at).toLocaleString()}</span>
                <span>Last Modified {new Date(activePage?.updated_at).toLocaleString()}</span>
              </div>

              <Markdown>
                {activePage?.content}
              </Markdown>
            </div>
          )}
          {!activePage && (
            <div>
              <h1 className="font-bold border-b text-3xl pb-3 text-blue-500">
                Select a page
              </h1>
            </div>
          )}


          <div className="flex gap-1">
            {prevPage && (
              <button onClick={() => handlePrevPage()}
                className="flex flex-col items-start justify-start border px-12 py-3 rounded-md bg-slate-900 hover:bg-slate-600 text-slate-100 cursor-pointer">
                <span className="text-md text-gray-500">Previous Page</span>
                <span className="font-bold text-lg">{prevPage.category.name}: {prevPage.name}</span>
              </button>
            )}
            {nextPage && (
              <button onClick={() => handleNextPage()}
                className="flex flex-col items-start justify-start border px-12 py-3 rounded-md bg-slate-900 hover:bg-slate-600 text-slate-100 cursor-pointer">
                <span className="text-md text-gray-500">Next Page</span>
                <span className="font-bold text-lg">{nextPage.category.name}: {nextPage.name}</span>
              </button>
            )}
          </div>
        </div>


      </div>
    } />
  )
}

export default DocsIndexView;
