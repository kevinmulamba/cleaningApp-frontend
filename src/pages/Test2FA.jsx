import React, { useState } from 'react';

const Test2FA = () => {
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.requires2FA) {
        setUserId(data.userId);
        setStep('verify');
        setMessage('📩 Code 2FA envoyé à votre email');
      } else if (data.token) {
        setMessage('✅ Connecté sans 2FA : ' + data.token);
      } else {
        setMessage(data.message || 'Erreur de connexion');
      }
    } catch (err) {
      console.error(err);
      setMessage('Erreur serveur');
    }
  };

  const handleVerify = async () => {
    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code })
      });
      const data = await res.json();

      if (data.token) {
        setMessage('✅ 2FA validé. Token : ' + data.token);
        console.log('Token reçu :', data.token);
      } else {
        setMessage(data.message || 'Code incorrect');
      }
    } catch (err) {
      console.error(err);
      setMessage('Erreur lors de la vérification');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">🔐 Test Login avec 2FA</h1>

      {step === 'login' && (
        <div className="space-y-4 w-full max-w-md">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Se connecter
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Code 2FA"
            className="w-full px-4 py-2 border rounded"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={handleVerify}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Vérifier le code
          </button>
        </div>
      )}

      {message && <p className="mt-6 text-center">{message}</p>}
    </div>
  );
};

export default Test2FA;

