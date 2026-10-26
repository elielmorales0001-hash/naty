import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, ShieldCheck, ArrowRight, RefreshCw, X, KeyRound, Building2, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAdmin?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultAdmin = false }) => {
  const { sendOtp, verifyOtp, switchDemoUser, showToast } = useApp();

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState(defaultAdmin ? 'admin@autorepuestospro.com' : 'huancasnayri@gmail.com');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [lastGeneratedCode, setLastGeneratedCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (defaultAdmin) {
      setEmail('admin@autorepuestospro.com');
    }
  }, [defaultAdmin]);

  // Countdown timer when on code step
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'code' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendCode = (targetEmail?: string) => {
    const toEmail = (targetEmail || email).trim().toLowerCase();
    if (!toEmail || !toEmail.includes('@')) {
      setErrorMessage('Por favor ingrese un correo electrónico válido');
      return;
    }
    setErrorMessage('');
    setIsSending(true);

    setTimeout(() => {
      const generated = sendOtp(toEmail);
      setLastGeneratedCode(generated);
      setIsSending(false);
      setStep('code');
      setCountdown(60);
      setCodeDigits(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, 400);
  };

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...codeDigits];
    newDigits[index] = val.slice(-1);
    setCodeDigits(newDigits);

    // Auto move to next input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify when filled
    if (val && index === 5 && newDigits.every((d) => d !== '')) {
      const fullCode = newDigits.join('');
      attemptVerification(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      e.preventDefault();
      const digits = pasted.split('');
      setCodeDigits(digits);
      attemptVerification(pasted);
    }
  };

  const attemptVerification = (codeToVerify: string) => {
    const success = verifyOtp(email, codeToVerify);
    if (success) {
      showToast('¡Identidad verificada! Acceso autorizado a la plataforma.', 'success');
      onClose();
      setStep('email');
    } else {
      setErrorMessage('El código ingresado no es válido o ha expirado. Verifique e intente nuevamente.');
    }
  };

  const handleQuickPreset = (presetEmail: string) => {
    setEmail(presetEmail);
    handleSendCode(presetEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Official Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 p-1 rounded-full bg-slate-800 border-2 border-red-500/50 shadow-lg">
            <img
              src="/assets/aistudio/image_1399edb9.png"
              alt="AutoRepuestos Pro"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {step === 'email' ? 'Acceso Seguro para Talleres y Gestión' : 'Código de Verificación'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {step === 'email'
              ? 'Ingrese su correo institucional. Le enviaremos un código temporal de 6 dígitos.'
              : `Hemos generado un código de verificación para ${email}`}
          </p>
        </div>

        {step === 'email' ? (
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="taller@ejemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={() => handleSendCode()}
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-sm transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generando Código...
                  </>
                ) : (
                  <>
                    Enviar Código de Acceso
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Demo Access presets */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <span className="block text-xs font-medium text-slate-400 mb-2.5">
                Acceso Rápido de Prueba (1 Clic):
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickPreset('huancasnayri@gmail.com')}
                  className="w-full text-left p-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-lg flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-semibold text-slate-200 block">Taller Nayri Motors Pro</span>
                      <span className="text-slate-400">huancasnayri@gmail.com · Cliente Mayorista</span>
                    </div>
                  </div>
                  <span className="text-amber-400 font-mono text-[11px]">Entrar →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPreset('admin@autorepuestospro.com')}
                  className="w-full text-left p-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-lg flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="font-semibold text-slate-200 block">Administrador Central</span>
                      <span className="text-slate-400">admin@autorepuestospro.com · Gestión Total</span>
                    </div>
                  </div>
                  <span className="text-amber-400 font-mono text-[11px]">Entrar →</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Real Simulation Notice banner */}
            {lastGeneratedCode && (
              <div className="mb-5 p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-xl text-left">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 bg-amber-500/20 rounded-md text-amber-400 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-medium text-amber-200">
                      Simulación de Correo Enviado a <span className="font-semibold">{email}</span>
                    </p>
                    <p className="text-slate-300 mt-1">
                      Código generado:{' '}
                      <span className="font-mono font-bold text-amber-400 text-sm tracking-wider">
                        {lastGeneratedCode}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const digits = lastGeneratedCode.split('');
                        setCodeDigits(digits);
                        attemptVerification(lastGeneratedCode);
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[11px] hover:bg-amber-400 transition-colors cursor-pointer"
                    >
                      Autorrellenar y Verificar Directo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6-digit PIN input */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 text-center">
                Ingrese los 6 dígitos recibidos
              </label>
              <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
                {codeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-mono font-bold bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-2.5 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-300 text-center">
                {errorMessage}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 mb-5">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="hover:text-white transition-colors underline cursor-pointer"
              >
                Cambiar de correo
              </button>
              <div>
                {countdown > 0 ? (
                  <span>Reenviar en {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendCode()}
                    className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                  >
                    Reenviar código
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => attemptVerification(codeDigits.join(''))}
              disabled={codeDigits.some((d) => d === '')}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-sm transition-colors cursor-pointer shadow-sm disabled:opacity-40"
            >
              Verificar Código e Ingresar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
