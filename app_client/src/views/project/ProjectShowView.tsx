import { useGetProject, useGetProjects } from "../../hooks/useProject";
import { ProjectType } from "../../types/projectType";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

function ProjectShowView() {
    const { _id } = useParams();
    const { data: project, isLoading, error } = useGetProject(_id as string);

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
                    <p className="text-lg">Error loading project</p>
                    <p className="text-sm mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            
        </div>
    );
}

export default ProjectShowView;
