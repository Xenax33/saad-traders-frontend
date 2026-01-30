'use client';

import React, { useState, useEffect } from 'react';
import { useMfa } from '@/hooks/useMfa';

interface MfaVerificationProps {
  onSuccess: (accessToken?: string, refreshToken?: string, userData?: any) => void;
  onError?: (message: string) => void;
  userEmail?: string;
}

type VerificationType = 'totp' | 'backup';

/**
 * MFA Verification Component
 * Handles TOTP code and backup code verification during login
 */
export default function MfaVerification({ onSuccess, onError }: MfaVerificationProps) {
  const { verifyMfa, loading, error } = useMfa();
  const [verificationType, setVerificationType] = useState<VerificationType>('totp');
  const [totpCode, setTotpCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [codeExpiry, setCodeExpiry] = useState(30);
  const [timerActive, setTimerActive] = useState(true);

  /**
   * Timer for TOTP code expiry (30 seconds)
   */
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setCodeExpiry((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  /**
   * Verify TOTP code
   */
  const handleVerifyTotp = async () => {
    if (!totpCode || totpCode.length !== 6) {
      onError?.('Please enter a valid 6-digit code');
      return;
    }

    const result = await verifyMfa(totpCode);
    if (result) {
      onSuccess(result.accessToken, result.refreshToken, result.user);
    } else if (error) {
      onError?.(error.message);
    }
  };

  /**
   * Verify backup code
   */
  const handleVerifyBackup = async () => {
    if (!backupCode || backupCode.trim().length === 0) {
      onError?.('Please enter a backup code');
      return;
    }

    const result = await verifyMfa(undefined, backupCode.trim());
    if (result) {
      onSuccess(result.accessToken, result.refreshToken, result.user);
    } else if (error) {
      onError?.(error.message);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationType === 'totp') {
      handleVerifyTotp();
    } else {
      handleVerifyBackup();
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/25">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-200">Step 2 · MFA</p>
            <p className="font-display text-xl text-white">Verify your identity</p>
            <p className="text-sm text-stone-200/80">Use your authenticator or a backup code. Challenge token is locked to this session.</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-stone-100/80">TOTP · 30s window</div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100 shadow-inner shadow-red-900/30">
          <span className="mt-0.5">!</span>
          <span>{error.message}</span>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-emerald-900/25">
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/20 p-1 text-sm text-stone-200/80">
          {([
            { key: 'totp', label: 'Authenticator' },
            { key: 'backup', label: 'Backup Code' },
          ] as { key: VerificationType; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setVerificationType(tab.key);
                setTotpCode('');
                setBackupCode('');
              }}
              className={`rounded-lg px-4 py-2 font-semibold transition ${verificationType === tab.key ? 'bg-emerald-500/20 text-white shadow-inner shadow-emerald-900/30' : 'hover:bg-white/5'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {verificationType === 'totp' ? (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-stone-100">6-digit code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-center text-2xl font-semibold tracking-[0.3em] text-white shadow-inner shadow-black/30 outline-none transition focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/60 placeholder:text-stone-400"
                value={totpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setTotpCode(value);
                }}
                autoFocus
                disabled={loading}
              />
              <div className="flex items-center justify-between text-xs text-stone-300/80">
                <span>Expires in {codeExpiry}s</span>
                <div className="relative h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-emerald-400"
                    style={{ width: `${(codeExpiry / 30) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-stone-300/80">Keep your authenticator open; codes rotate every 30 seconds.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-stone-100">Backup code</label>
              <input
                type="text"
                placeholder="A1B2C3D4"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-center text-lg font-mono tracking-[0.22em] text-white shadow-inner shadow-black/30 outline-none transition focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/60 placeholder:text-stone-400"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value)}
                autoFocus
                disabled={loading}
              />
              <p className="text-xs text-stone-300/80">Each backup code is single-use. After using one, it will be burned.</p>
            </div>
          )}

          <button
            type="submit"
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 px-4 py-3 text-base font-semibold text-white shadow-xl shadow-emerald-900/35 transition focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-60"
            disabled={
              loading ||
              (verificationType === 'totp' && totpCode.length !== 6) ||
              (verificationType === 'backup' && backupCode.trim().length === 0)
            }
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
            {loading && (
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
