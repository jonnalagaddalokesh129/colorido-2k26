import React, { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, User, Building, Phone, ShieldCheck, UserCircle2 } from 'lucide-react';
import { useAuth, SocialProvider } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface Props {
  onNavigate: (path: string) => void;
  initialMode?: 'login' | 'register';
}

export const LoginPage: React.FC<Props> = ({ onNavigate, initialMode = 'login' }) => {
  const { login, register, switchDemoUser, loginWithProvider } = useAuth();
  const { showToast } = useToast();

  const [isRightPanelActive, setIsRightPanelActive] = useState<boolean>(initialMode === 'register');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [formVisible, setFormVisible] = useState<boolean>(true);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCollege, setRegCollege] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regAgreed, setRegAgreed] = useState(false);
  const [regRole, setRegRole] = useState<'participant' | 'coordinator'>('participant');
  const [regLoading, setRegLoading] = useState(false);

  // Load remembered email (and ONLY email) on initial mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('colorido_remembered_email');
    if (savedEmail) {
      setLoginEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const resetFormFields = () => {
    const savedEmail = localStorage.getItem('colorido_remembered_email');
    if (savedEmail) {
      setLoginEmail(savedEmail);
      setRememberMe(true);
    } else {
      setLoginEmail('');
      setRememberMe(false);
    }
    setLoginPassword(''); // Password is never stored or pre-filled
    setRegFullName('');
    setRegEmail('');
    setRegPhone('');
    setRegCollege('');
    setRegDepartment('');
    setRegPassword('');
    setRegConfirmPassword('');
    setRegAgreed(false);
  };

  useEffect(() => {
    const shouldBeRegister = initialMode === 'register';
    if (isRightPanelActive !== shouldBeRegister) {
      setFormVisible(false);
      setIsAnimating(true);
      setIsRightPanelActive(shouldBeRegister);
      resetFormFields();
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setFormVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [initialMode, isRightPanelActive]);

  const togglePanel = (toRegister: boolean) => {
    if (isRightPanelActive === toRegister || isAnimating) return;
    setFormVisible(false);
    setIsAnimating(true);
    setIsRightPanelActive(toRegister);
    resetFormFields();
    onNavigate(toRegister ? '/register-auth' : '/login');
    setTimeout(() => {
      setIsAnimating(false);
      setFormVisible(true);
    }, 1000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      showToast('Please enter your email', 'error');
      return;
    }
    if (!loginPassword) {
      showToast('Please enter your password', 'error');
      return;
    }

    // Remember or forget ONLY the email address
    if (rememberMe) {
      localStorage.setItem('colorido_remembered_email', loginEmail.trim());
    } else {
      localStorage.removeItem('colorido_remembered_email');
    }

    setLoginLoading(true);
    const res = await login(loginEmail, loginPassword);
    setLoginLoading(false);
    if (res.success && res.user) {
      if (res.user.role === 'admin') {
        onNavigate('/admin');
      } else if (res.user.role === 'coordinator') {
        if (res.user.coordinator_status === 'pending') {
          onNavigate('/coordinator-pending');
        } else if (res.user.coordinator_status === 'approved') {
          onNavigate('/coordinator');
        } else {
          onNavigate('/coordinator-pending'); // Show rejected/suspended state
        }
      } else {
        onNavigate('/dashboard');
      }
    } else {
      showToast(res.message || 'Login failed', 'error');
    }
  };

  const handleGoogleLogin = async () => handleSocialLogin('google');

  const handleSocialLogin = async (provider: SocialProvider) => {
    setSocialLoading(provider);
    const res = await loginWithProvider(provider);
    setSocialLoading(null);
    if (res.success && res.user) {
      onNavigate('/dashboard');
    }
    // Errors shown via toast inside loginWithProvider
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regCollege.trim()) {
      showToast('Please provide all mandatory details.', 'error');
      return;
    }
    if (regPhone && regPhone.length !== 10) {
      showToast('Please enter a valid 10-digit phone number.', 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (!regAgreed) {
      showToast('You must agree to the Terms & Conditions.', 'error');
      return;
    }

    setRegLoading(true);
    const res = await register({
      full_name: regFullName,
      email: regEmail,
      phone: regPhone,
      college: regCollege,
      department: regDepartment,
      role: regRole
    });
    setRegLoading(false);

    if (res.success && res.user) {
      if (res.user.role === 'coordinator') {
        onNavigate('/coordinator-pending');
      } else {
        onNavigate('/dashboard');
      }
    } else {
      showToast(res.message || 'Registration failed', 'error');
    }
  };

  const handleDemoLogin = (role: 'participant' | 'coordinator' | 'admin') => {
    switchDemoUser(role);
    if (role === 'admin') {
      onNavigate('/admin');
    } else {
      onNavigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#DDF3F0]">
      {/* Container with relative position and fixed height */}
      <div className="relative w-full max-w-4xl min-h-[580px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#006D8F]/20">

        {/* ── 1. SIGN UP (REGISTER) FORM CONTAINER ── */}
        <div
          className={`absolute top-0 h-full w-full md:w-1/2 left-0 transition-all duration-[1000ms] ease-in-out p-6 md:p-10 flex flex-col justify-center bg-white ${
            isRightPanelActive
              ? 'md:translate-x-full opacity-100 z-20'
              : 'opacity-0 z-1 pointer-events-none'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
        >
          <div className={`w-full max-w-sm mx-auto transition-all duration-500 ease-out ${
            formVisible && isRightPanelActive && !isAnimating
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}>
            <h2 className="text-3xl font-black text-[#064E52] text-center mb-6">Create Account</h2>

            <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-3.5">
              
              {/* Role Selection */}
              <div className="flex bg-[#F0FDF8] p-1 rounded-xl border border-[#20B2AA]/20 mb-4">
                <button
                  type="button"
                  onClick={() => setRegRole('participant')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    regRole === 'participant' ? 'bg-[#20B2AA] text-white shadow-md' : 'text-[#4A6B6D] hover:text-[#064E52]'
                  }`}
                >
                  <UserCircle2 className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('coordinator')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    regRole === 'coordinator' ? 'bg-[#006D8F] text-white shadow-md' : 'text-[#4A6B6D] hover:text-[#064E52]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Coordinator</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={e => setRegFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-transparent border-0 border-b-2 border-[#006D8F]/20 py-2 pr-8 text-[#064E52] placeholder:text-[#4A6B6D] focus:outline-none focus:border-[#20B2AA] transition-colors focus:ring-0 text-sm font-medium"
                />
                <User className="absolute right-2 top-2.5 w-4 h-4 text-[#006D8F]" />
              </div>

              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-transparent border-0 border-b-2 border-[#006D8F]/20 py-2 pr-8 text-[#064E52] placeholder:text-[#4A6B6D] focus:outline-none focus:border-[#20B2AA] transition-colors focus:ring-0 text-sm font-medium"
                />
                <Mail className="absolute right-2 top-2.5 w-4 h-4 text-[#006D8F]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={regCollege}
                    onChange={e => setRegCollege(e.target.value)}
                    placeholder="College"
                    className="w-full bg-transparent border-0 border-b-2 border-[#006D8F]/20 py-2 pr-8 text-[#064E52] placeholder:text-[#4A6B6D] focus:outline-none focus:border-[#20B2AA] transition-colors focus:ring-0 text-sm font-medium"
                  />
                  <Building className="absolute right-2 top-2.5 w-4 h-4 text-[#006D8F]" />
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    maxLength={10}
                    autoComplete="off"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Phone (10 digits)"
                    className="w-full bg-transparent border-0 border-b-2 border-[#006D8F]/20 py-2 pr-8 text-[#064E52] placeholder:text-[#4A6B6D] focus:outline-none focus:border-[#20B2AA] transition-colors focus:ring-0 text-sm font-medium"
                  />
                  <Phone className="absolute right-2 top-2.5 w-4 h-4 text-[#006D8F]" />
                </div>
              </div>

              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent border-0 border-b-2 border-[#006D8F]/20 py-2 pr-8 text-[#064E52] placeholder:text-[#4A6B6D] focus:outline-none focus:border-[#20B2AA] transition-colors focus:ring-0 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-2 top-2.5 text-[#4A6B6D] hover:text-[#20B2AA] transition-colors"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showRegConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full bg-transparent border-0 border-b-2 border-[#006D8F]/20 py-2 pr-8 text-[#064E52] placeholder:text-[#4A6B6D] focus:outline-none focus:border-[#20B2AA] transition-colors focus:ring-0 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  className="absolute right-2 top-2.5 text-[#4A6B6D] hover:text-[#20B2AA] transition-colors"
                >
                  {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center text-xs font-medium pt-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={regAgreed}
                    onChange={e => setRegAgreed(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#006D8F]/30 bg-transparent text-[#20B2AA] focus:ring-[#20B2AA]"
                  />
                  <span className="text-[#4A6B6D] group-hover:text-[#064E52] transition-colors">I agree to Terms &amp; Conditions</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 rounded-lg bg-[#20B2AA] hover:bg-[#1CA099] text-white font-bold text-sm shadow-lg shadow-[#20B2AA]/20 transition-all mt-2 cursor-pointer"
              >
                {regLoading ? 'Registering...' : 'REGISTER'}
              </button>

              <div className="md:hidden text-center text-xs text-festival-muted pt-2">
                Already have an account?{' '}
                <button type="button" onClick={() => togglePanel(false)} className="text-festival-emerald font-bold">
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>


        {/* ── 2. SIGN IN (LOGIN) FORM CONTAINER ── */}
        <div
          className={`absolute top-0 h-full w-full md:w-1/2 left-0 transition-all duration-[1000ms] ease-in-out p-6 md:p-12 flex flex-col justify-center bg-white ${
            isRightPanelActive
              ? 'md:translate-x-full opacity-0 z-1 pointer-events-none'
              : 'opacity-100 z-10'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
        >
          <div className={`w-full max-w-sm mx-auto transition-all duration-500 ease-out ${
            formVisible && !isRightPanelActive && !isAnimating
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}>
            <h2 className="text-3xl font-black text-[#064E52] text-center mb-8">Sign In</h2>

            <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-5">
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-transparent border-0 border-b-2 border-[#006D8F]/20 py-2 pr-8 text-[#064E52] placeholder:text-[#4A6B6D] focus:outline-none focus:border-[#20B2AA] transition-colors focus:ring-0 text-sm font-medium"
                />
                <Mail className="absolute right-2 top-2.5 w-4 h-4 text-[#006D8F]" />
              </div>

              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent border-0 border-b-2 border-[#006D8F]/20 py-2 pr-8 text-[#064E52] placeholder:text-[#4A6B6D] focus:outline-none focus:border-[#20B2AA] transition-colors focus:ring-0 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-2 top-2.5 text-[#4A6B6D] hover:text-[#20B2AA] transition-colors"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs font-medium pt-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#006D8F]/30 bg-transparent text-[#20B2AA] focus:ring-[#20B2AA]"
                  />
                  <span className="text-[#4A6B6D] group-hover:text-[#064E52] transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-[#006D8F] hover:text-[#20B2AA] font-bold transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-bold text-sm shadow-lg shadow-[#20B2AA]/25 transition-all mt-4 cursor-pointer"
              >
                {loginLoading ? 'Authenticating...' : 'SIGN IN'}
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-[#006D8F]/10"></div>
                <span className="px-3 text-[10px] text-[#4A6B6D] font-bold uppercase tracking-wider">OR</span>
                <div className="flex-1 border-t border-[#006D8F]/10"></div>
              </div>

              {/* ── Google full-width button ── */}
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={!!socialLoading}
                className="w-full py-2.5 rounded-xl bg-white border border-[#006D8F]/20 text-[#064E52] font-bold text-sm hover:bg-[#F8FDFB] hover:border-[#20B2AA]/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                <span>{socialLoading === 'google' ? 'Connecting…' : 'Continue with Google'}</span>
              </button>

              {/* ── Other Social Login Icons ── */}
              <div className="flex items-center justify-center gap-3 mt-1">
                <span className="text-[10px] text-[#4A6B6D] font-semibold uppercase tracking-wider">or continue via</span>

                {/* X / Twitter */}
                <button
                  type="button"
                  title="Continue with X (Twitter)"
                  disabled={!!socialLoading}
                  onClick={() => handleSocialLogin('twitter')}
                  className={`relative w-9 h-9 rounded-full bg-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md disabled:opacity-60 ${
                    socialLoading === 'twitter' ? 'animate-pulse' : ''
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L2.02 2.25h6.832l4.27 5.647zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  title="Continue with GitHub"
                  disabled={!!socialLoading}
                  onClick={() => handleSocialLogin('github')}
                  className={`relative w-9 h-9 rounded-full bg-[#24292e] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md disabled:opacity-60 ${
                    socialLoading === 'github' ? 'animate-pulse' : ''
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </button>

                {/* LinkedIn */}
                <button
                  type="button"
                  title="Continue with LinkedIn"
                  disabled={!!socialLoading}
                  onClick={() => handleSocialLogin('linkedin_oidc')}
                  className={`relative w-9 h-9 rounded-full bg-[#0077B5] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md disabled:opacity-60 ${
                    socialLoading === 'linkedin_oidc' ? 'animate-pulse' : ''
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>

                {/* Instagram — UI only (not an OAuth provider) */}
                <button
                  type="button"
                  title="Instagram (not available for login)"
                  onClick={() => showToast('Instagram login is not supported. Please use Google, GitHub, X, or LinkedIn.', 'info')}
                  className="relative w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md"
                  style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </button>
              </div>

              <div className="md:hidden text-center text-xs text-[#4A6B6D] pt-2">
                Don't have an account?{' '}
                <button type="button" onClick={() => togglePanel(true)} className="text-[#20B2AA] font-bold">
                  Sign Up
                </button>
              </div>
            </form>

            {/* Quick Access */}
            <div className="mt-8 pt-6 border-t border-[#006D8F]/15 text-center">
              <span className="text-[10px] uppercase tracking-widest text-[#4A6B6D] block mb-3 font-semibold">Evaluator Quick Access</span>
              <div className="flex justify-center gap-2.5">
                <button onClick={() => handleDemoLogin('participant')} className="text-xs px-3 py-1.5 rounded-lg bg-[#DDF3F0] hover:bg-[#20B2AA] hover:text-white text-[#006D8F] font-bold transition-colors">Student</button>
                <button onClick={() => handleDemoLogin('coordinator')} className="text-xs px-3 py-1.5 rounded-lg bg-[#DDF3F0] hover:bg-[#20B2AA] hover:text-white text-[#006D8F] font-bold transition-colors">Coordinator</button>
                <button onClick={() => handleDemoLogin('admin')} className="text-xs px-3 py-1.5 rounded-lg bg-[#DDF3F0] hover:bg-[#20B2AA] hover:text-white text-[#006D8F] font-bold transition-colors">Admin</button>
              </div>
            </div>
          </div>
        </div>


        {/* ── 3. OVERLAY CONTAINER (PARALLAX DOUBLE SLIDER) ── */}
        <div
          className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-[1000ms] ease-in-out z-30 ${
            isRightPanelActive
              ? '-translate-x-full rounded-r-[5rem]'
              : 'translate-x-0 rounded-l-[5rem]'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
        >
          <div
            className={`bg-gradient-to-br from-[#064E52] via-[#006D8F] to-[#20B2AA] relative -left-full h-full w-[200%] transition-transform duration-[1000ms] ease-in-out text-white flex ${
              isRightPanelActive ? 'translate-x-1/2' : 'translate-x-0'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
          >
            {/* OVERLAY LEFT PANEL (Show "Welcome Back!" when in Register mode) */}
            <div className="w-1/2 h-full flex flex-col items-center justify-center p-10 text-center space-y-4">
              <h2 className="text-3xl font-black text-white">Welcome Back!</h2>
              <p className="text-[#DDF3F0] text-sm font-medium max-w-xs leading-relaxed">
                To stay connected with COLORIDO 2K26, please log in with your existing profile credentials.
              </p>
              <button
                type="button"
                onClick={() => togglePanel(false)}
                disabled={isAnimating}
                className="mt-4 px-10 py-2.5 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-[#064E52] transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider text-xs"
              >
                SIGN IN
              </button>
            </div>

            {/* OVERLAY RIGHT PANEL (Show "Hello, Welcome!" when in Login mode) */}
            <div className="w-1/2 h-full flex flex-col items-center justify-center p-10 text-center space-y-4">
              <h2 className="text-3xl font-black text-white">Hello, Welcome!</h2>
              <p className="text-[#DDF3F0] text-sm font-medium max-w-xs leading-relaxed">
                Enter your student details and start your journey with COLORIDO 2K26 championship.
              </p>
              <button
                type="button"
                onClick={() => togglePanel(true)}
                disabled={isAnimating}
                className="mt-4 px-10 py-2.5 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-[#064E52] transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider text-xs"
              >
                SIGN UP
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
