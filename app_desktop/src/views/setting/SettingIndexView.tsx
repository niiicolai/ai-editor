import { useState } from "react";
import { Link } from "react-router-dom";

function SettingIndexView() {

    return (
        <div className="flex min-h-screen main-bgg main-color p-6">
            <div className="w-full">
                <div className="secondary-bgg border border-color shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg leading-6 font-medium main-color">
                                Settings
                            </h3>
                            <div className="flex justify-start items-center gap-3">
                                <Link
                                    to="/"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md button-main"
                                >
                                    Close
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-color">
                        <dl>
                            <div className="main-bgg px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium main-color">
                                    Theme
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingIndexView;
