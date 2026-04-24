import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      if (!fullName.trim()) { setError('Entrez votre nom complet.'); setLoading(false); return; }
      const { error } = await signUp(email, password, fullName);
      if (error) setError(error);
      else setSuccess('Compte créé ! Vérifiez votre email pour confirmer, puis connectez-vous.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EDF2FB] via-[#F7F4FC] to-[#FDF3EC]">
      <div className="w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/images/becomeus_logo.png" alt="BecomeUs" className="h-14 w-auto mx-auto mb-4 object-contain" />
          <p className="text-sm text-gray-500">
            {mode === 'login' ? 'Connectez-vous à votre espace' : 'Créez votre espace coach'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
                style={{
                  background: mode === m ? 'white' : 'transparent',
                  color: mode === m ? '#7A90B5' : '#9CA3AF',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}>
                {m === 'login' ? '🔑 Connexion' : '✨ Inscription'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Nom complet</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Marie Dupont"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A90B5]/30 focus:border-[#7A90B5] transition-all"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Adresse email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A90B5]/30 focus:border-[#7A90B5] transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A90B5]/30 focus:border-[#7A90B5] transition-all pr-11"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            {success && <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{success}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 flex items-center justify-center gap-2 mt-2"
              style={{ background: 'linear-gradient(135deg, #7A90B5, #9B85C4)' }}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-xs text-gray-400 mt-4">
              Pas encore de compte ?{' '}
              <button onClick={() => setMode('register')} className="text-[#7A90B5] font-semibold hover:underline">
                S'inscrire
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 BecomeUs · Management comme coaching sportif
        </p>
      </div>
    </div>
  );
}
