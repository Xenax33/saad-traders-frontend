'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useLoading } from '@/contexts/LoadingContext';
import { useMfa } from '@/hooks/useMfa';
import MfaVerification from '@/components/MfaVerification';
import ForcedMfaEnrollment from './forced-mfa-enrollment';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { saveTokens } from '@/lib/tokenManager';
import Cookies from 'js-cookie';

type LoginStep = 'password' | 'mfa' | 'forced-enrollment';

interface LoginResponse {
  requireMfaEnrollment?: boolean;
  mfaRequired?: boolean;
  userId?: string;
  email?: string;
  [key: string]: any;
}

export default function LoginPage() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const { login: mfaLogin } = useMfa();

  const [step, setStep] = useState<LoginStep>('password');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<{ userId: string; email: string } | null>(null);

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoginError('');
    setIsLoading(true);
    showLoading();

    try {
      const response = (await mfaLogin(formData.email, formData.password)) as LoginResponse;
      hideLoading();

      if (response?.requireMfaEnrollment) {
        setEnrollmentData({ userId: response.userId || '', email: formData.email });
        setStep('forced-enrollment');
        setIsLoading(false);
        return;
      }

      if (response?.mfaRequired) {
        setEnrollmentData({ userId: '', email: formData.email });
        setStep('mfa');
        setIsLoading(false);
        return;
      }

      // Successful login without MFA - redirect based on role
      const redirectPath = response?.user?.role === 'ADMIN' ? '/admin' : '/dashboard';
      toast.success('Login successful!');
      
      // Use window.location.href for reliable redirect in production
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 500);
    } catch (error: any) {
      console.error('Login failed:', error);
      hideLoading();
      setIsLoading(false);

      if (error?.response?.status === 403 && error?.response?.data?.requireMfaEnrollment) {
        setEnrollmentData({ userId: error.response.data.userId || '', email: formData.email });
        setStep('forced-enrollment');
        return;
      }

      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed. Please try again.';
      setLoginError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEnrollmentSuccess = () => {
    toast.success('MFA enrollment successful! Please login again.');
    setStep('password');
    setFormData({ email: '', password: '' });
    setEnrollmentData(null);
  };

  const handleMfaVerifySuccess = (accessToken?: string, refreshToken?: string, userData?: any) => {
    if (accessToken && refreshToken) {
      saveTokens(accessToken, refreshToken);
      
      // Save user data to cookies
      if (userData) {
        Cookies.set('user', JSON.stringify(userData), { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
    }
    
    // Determine redirect based on user role
    const redirectPath = userData?.role === 'ADMIN' ? '/admin' : '/dashboard';
    
    toast.success('Login successful!');
    window.location.href = redirectPath;
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-stone-50 flex items-center justify-center px-6 py-12 overflow-hidden -mt-21 pt-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-12 h-96 w-96 rounded-full bg-cyan-500/15 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.07),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(251,191,36,0.06),transparent_35%)]" />
      </div>

      <div className="relative z-10 grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="space-y-6">
          <Link href="/" className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-lg shadow-emerald-900/30 backdrop-blur transition hover:border-white/25 hover:bg-white/10">
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg shadow-emerald-900/40">
              <img src="/logos/company-logo.png" alt="Saad Traders" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/90">Saad Traders Portal</p>
              <p className="text-sm text-stone-100/80">FBR-compliant access</p>
            </div>
          </Link>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">Multi-step secure login</p>
            <h1 className="font-display text-4xl sm:text-5xl leading-tight text-white drop-shadow-[0_8px_24px_rgba(16,185,129,0.18)]">
              Defend every login<br />with layered verification.
            </h1>
            <p className="max-w-2xl text-lg text-stone-200/85">
              Password → TOTP/backup → Enrollment fallback. Built for teams who need certainty before entering sensitive dashboards.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[{
              label: 'Step 1',
              title: 'Credentials',
              desc: 'Email + password with adaptive checks.',
              active: step === 'password',
            }, {
              label: 'Step 2',
              title: 'MFA Verify',
              desc: '6-digit TOTP or backup code.',
              active: step === 'mfa',
            }, {
              label: 'Step 3',
              title: 'Forced Enrollment',
              desc: 'Provision QR + backup codes.',
              active: step === 'forced-enrollment',
            }].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border px-4 py-4 shadow-lg shadow-black/20 backdrop-blur transition ${item.active ? 'border-emerald-400/60 bg-emerald-400/10' : 'border-white/10 bg-white/5'}`}
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-200">{item.label}</p>
                <p className="mt-1 font-display text-xl text-white">{item.title}</p>
                <p className="mt-1 text-sm text-stone-200/80 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-stone-200/80">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]" />
                MFA available when required
              </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_0_4px_rgba(251,191,36,0.18)]" />
              Backup codes issued on enrollment
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_0_4px_rgba(125,211,252,0.18)]" />
              Challenge token for MFA
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-emerald-400/40 via-white/5 to-amber-300/30 blur-2xl opacity-60" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-white/5 p-8 shadow-2xl shadow-emerald-900/30 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Authenticated gateway</p>
                <p className="font-display text-2xl text-white">{step === 'password' ? 'Enter credentials' : step === 'mfa' ? 'Verify MFA' : 'Enroll MFA'}</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-stone-100/80">
                {step === 'password' ? 'Step 1 of 3' : step === 'mfa' ? 'Step 2 of 3' : 'Step 3 of 3'}
              </div>
            </div>

            {step === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-stone-100">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white shadow-inner shadow-black/20 outline-none transition focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/60 placeholder:text-stone-300/70"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-stone-100">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white shadow-inner shadow-black/20 outline-none transition focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/60 placeholder:text-stone-300/70"
                    placeholder="••••••••"
                  />
                </div>

                {loginError && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100 shadow-inner shadow-red-900/30">
                    <span className="mt-0.5 text-red-200">!</span>
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-stone-200/80">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-white/30 bg-white/10 text-emerald-400 focus:ring-emerald-400"
                    />
                    Remember me on this device
                  </label>
                  <Link href="/contact" className="font-semibold text-emerald-200 hover:text-emerald-100 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 px-4 py-3 text-base font-semibold text-white shadow-xl shadow-emerald-900/40 transition focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-60"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
                  <span className="flex items-center gap-2">
                    Sign in
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </form>
            )}

            {step === 'mfa' && enrollmentData && (
              <MfaVerification 
                onSuccess={handleMfaVerifySuccess}
                userEmail={enrollmentData.email}
              />
            )}

            {step === 'forced-enrollment' && enrollmentData && (
              <ForcedMfaEnrollment 
                userId={enrollmentData.userId}
                email={enrollmentData.email}
                onSuccess={handleEnrollmentSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}