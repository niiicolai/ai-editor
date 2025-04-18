import { useGetProjects } from "../../hooks/useProject";
import { ProjectType } from "../../types/projectType";
import { useState } from "react";
import { Link } from "react-router-dom";

function ProjectIndexView() {
    const limit = 10;
    const [page, setPage] = useState(1);
    const { data: projects, isLoading, error } = useGetProjects(page, limit);

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
                    <p className="text-lg">Error loading projects</p>
                    <p className="text-sm mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        View and manage your projects
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects?.projects.map((project: ProjectType) => (
                        <Link
                            key={project._id}
                            to={`/project/${project._id}`}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {project.title}
                                    </h2>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <span className="mr-2">📅</span>
                                        {project.created_at}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-2">👤</span>
                                        {project.user || 'Unknown'}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {projects && projects.total > limit && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 text-sm text-gray-700">
                                Page {page} of {Math.ceil(projects.total / limit)}
                            </span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= Math.ceil(projects.total / limit)}
                                className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}

                {/* Empty State */}
                {projects?.projects.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <span className="text-2xl">📁</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No projects found
                        </h3>
                        <p className="text-sm text-gray-500">
                            Create your first project to get started
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectIndexView;
