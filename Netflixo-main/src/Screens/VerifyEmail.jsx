import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link');
                return;
            }

            try {
                const { data } = await axios.get(
                    `http://localhost:5001/api/users/verify-email/${token}`
                );

                setStatus('success');
                setMessage(data.message || 'Email verified successfully!');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setStatus('error');
                setMessage(
                    error.response?.data?.message ||
                    'Verification failed. The link may be invalid or expired.'
                );
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <Layout>
            <div className="container mx-auto px-2 my-24 flex-colo">
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-dry border border-border rounded-lg p-8">
                        {/* Status Icon */}
                        <div className="flex-colo mb-6">
                            {status === 'verifying' && (
                                <FaSpinner className="text-6xl text-subMain animate-spin" />
                            )}
                            {status === 'success' && (
                                <FaCheckCircle className="text-6xl text-green-500" />
                            )}
                            {status === 'error' && (
                                <FaTimesCircle className="text-6xl text-red-500" />
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-center mb-4">
                            {status === 'verifying' && 'Verifying Email...'}
                            {status === 'success' && 'Email Verified!'}
                            {status === 'error' && 'Verification Failed'}
                        </h1>

                        {/* Message */}
                        <p className="text-center text-text mb-6">{message}</p>

                        {/* Actions */}
                        <div className="flex flex-col gap-4">
                            {status === 'success' && (
                                <>
                                    <p className="text-center text-sm text-gray-400">
                                        Redirecting to login in 3 seconds...
                                    </p>
                                    <Link
                                        to="/login"
                                        className="w-full py-3 bg-subMain text-white rounded font-medium hover:bg-opacity-80 transitions text-center"
                                    >
                                        Go to Login Now
                                    </Link>
                                </>
                            )}

                            {status === 'error' && (
                                <>
                                    <Link
                                        to="/register"
                                        className="w-full py-3 bg-subMain text-white rounded font-medium hover:bg-opacity-80 transitions text-center"
                                    >
                                        Register Again
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="w-full py-3 bg-transparent border border-subMain text-white rounded font-medium hover:bg-subMain transitions text-center"
                                    >
                                        Back to Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default VerifyEmail;
