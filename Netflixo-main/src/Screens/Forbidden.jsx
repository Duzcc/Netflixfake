import React from "react";
import { Link } from "react-router-dom";
import { RiErrorWarningLine } from "react-icons/ri";
import Layout from "../Layout/Layout";

function Forbidden() {
    return (
        <Layout>
            <div className="container mx-auto px-2 my-24 flex-colo">
                <div className="w-full 2xl:w-2/5 gap-8 flex-colo p-8 sm:p-14 md:w-3/5 bg-dry rounded-lg border border-border text-center">
                    <RiErrorWarningLine className="text-subMain text-6xl" />

                    <h1 className="text-4xl font-bold">403 - Access Forbidden</h1>

                    <p className="text-border text-sm leading-6">
                        You don't have permission to access this page. This area is restricted to administrators only.
                    </p>

                    <div className="flex gap-4 flex-wrap justify-center">
                        <Link
                            to="/"
                            className="bg-subMain transitions hover:bg-main text-white py-3 px-6 rounded-lg"
                        >
                            Go to Home
                        </Link>

                        <Link
                            to="/profile"
                            className="bg-dry transitions hover:bg-gray-800 text-white py-3 px-6 rounded-lg border border-border"
                        >
                            Go to Profile
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Forbidden;
