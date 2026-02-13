'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/admin');
            }
        };
        checkSession();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                router.push('/admin'); // Redirect to dashboard
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light min-h-screen flex flex-col items-center justify-center p-6 selection:bg-accent-light/30 font-display">
            {/* Main Content Wrapper */}
            <div className="flex items-center justify-center p-6 w-full">
                {/* Login Card */}
                <div className="w-full max-w-[360px]">
                    {/* Header Text */}
                    <div className="text-center mb-10">
                        <h1 className="font-handwriting text-primary text-4xl font-light mb-2">
                            Admin Login
                        </h1>
                        <p className="text-primary/50 text-xs tracking-wider">
                            Sign in to access your dashboard and manage your content.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-600 text-xs p-3 rounded mb-6 text-center">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Username/Email Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-primary/40 text-[10px] font-bold uppercase tracking-[0.2em]">Email</label>
                            <input
                                className="w-full py-2 bg-transparent border-b border-primary/10 focus:border-primary outline-none transition-colors placeholder:text-primary/20 text-primary text-sm"
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-end">
                                <label className="text-primary/40 text-[10px] font-bold uppercase tracking-[0.2em]">Password</label>
                            </div>
                            <div className="relative">
                                <input
                                    className="w-full py-2 bg-transparent border-b border-primary/10 focus:border-primary outline-none transition-colors placeholder:text-primary/20 text-primary text-sm pr-10"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 bottom-2 text-primary/40 hover:text-primary transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} strokeWidth={1.5} />
                                    ) : (
                                        <Eye size={16} strokeWidth={1.5} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-[0.2em] py-4 rounded-sm transition-all active:scale-[0.99] mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                        </button>
                    </form>

                    {/* Back to Portfolio */}
                    <div className="mt-12 text-center">
                        <Link
                            href="/"
                            className="text-primary/30 hover:text-primary text-[10px] uppercase tracking-[0.2em] font-medium transition-colors"
                        >
                            <span>Back to Portfolio</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer Meta */}
            <footer className="p-8 text-center text-primary/40 text-[10px] uppercase tracking-[0.2em] font-medium">
                © 2026 - Portoasih
            </footer>
        </div>
    );
}
