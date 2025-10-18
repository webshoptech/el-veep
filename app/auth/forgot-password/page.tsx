'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import LeftSideImage from '../components/LeftSideImage';
import GoogleSignInButton from '../components/GoogleSignInButton';
import toast from 'react-hot-toast';
import { resetPasswordLink } from '@/lib/api/auth/reset';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await resetPasswordLink({ email });
            toast.success('Password reset link sent! Check your inbox.');
            setEmail('');
        } catch (error) {
            console.error('❌ Reset failed:', error);
            toast.error('Unable to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 text-gray-800">
            {/* Left Side Image */}
            <LeftSideImage />

            {/* Right Side - Forgot Password Form */}
            <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 py-10">
                <div className="max-w-md w-full">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Forgot Password </h1>
                    <p className="text-gray-500 mb-6">
                        Enter your registered email and we’ll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email Address"
                            className="w-full border border-gray-300 rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-full transition disabled:opacity-60"
                        >
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-3 text-gray-500 text-sm">Or continue with</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    {/* Google Sign-In */}
                    <GoogleSignInButton />

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link href="/auth/login" className="text-green-600 font-medium hover:underline">
                            Go back to login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
