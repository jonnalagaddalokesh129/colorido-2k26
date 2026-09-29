import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CheckCircle2, 
  Sparkles, 
  User, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  Building, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  QrCode, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Check,
  Clock,
  ExternalLink,
  Lock,
  RefreshCw,
  Wallet,
  LogIn,
  UserPlus,
  MapPin,
  FileCheck
} from 'lucide-react';
import { store } from '../lib/store';
import { EventItem, Registration, TeamMember } from '../types/database';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { checkEventClash } from '../lib/clashDetector';
import { ClashWarningModal } from '../components/events/ClashWarningModal';
import { DigitalPassModal } from '../components/dashboard/DigitalPassModal';

interface Props {
  preselectedEventId?: string;
  onNavigate: (path: string) => void;
  onViewSchedule: () => void;
}

export const RegistrationPage: React.FC<Props> = ({
  preselectedEventId,
  onNavigate,
  onViewSchedule
}) => {
  const { user, login, register, switchDemoUser } = useAuth();
  const { showToast } = useToast();
  const events = store.getEvents();

  // Selected Event State
  const [selectedEventId, setSelectedEventId] = useState<string>(preselectedEventId || events[0]?.event_id || '');
  
  // Timing Confirmation State
  const [timingConfirmed, setTimingConfirmed] = useState(false);

  // Guest Inline Auth State (if guest arrives)
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authCollege, setAuthCollege] = useState('');
  const [authDept, setAuthDept] = useState('Computer Science');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Participant Form Details (populated from logged-in user)
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [dob, setDob] = useState('2004-05-15');
  const [college, setCollege] = useState(user?.college || '');
  const [department, setDepartment] = useState(user?.department || 'Computer Science');
  const [year, setYear] = useState(user?.year || '3rd Year');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [state, setState] = useState(user?.state || 'Maharashtra');

  // Team Info (for team events)
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<Partial<TeamMember>[]>([
    { member_name: '', college: '', roll_number: '', role: 'member' }
  ]);

  // Payment Gateway State
  const [paymentMethod, setPaymentMethod] = useState<'upi_apps' | 'upi_qr' | 'upi_id' | 'card'>('upi_apps');
  const [upiVpaInput, setUpiVpaInput] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentPaid, setPaymentPaid] = useState(false);
  const [paymentTransactionId, setPaymentTransactionId] = useState<string>('');
  const [paymentUpiApp, setPaymentUpiApp] = useState<string>('');
  const [qrTimeLeft, setQrTimeLeft] = useState(600); // 10 minutes countdown

  // Emergency contact & T&C
  const [emergencyName, setEmergencyName] = useState('Parent / Guardian');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98210 99887');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredItem, setRegisteredItem] = useState<Registration | null>(null);
  const [passModalOpen, setPassModalOpen] = useState(false);

  // Clash Warning Modal
  const [clashModalOpen, setClashModalOpen] = useState(false);
  const [clashingEvent, setClashingEvent] = useState<EventItem | null>(null);
  const [clashAcknowledged, setClashAcknowledged] = useState(false);

  // Sync user profile when auth state changes
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setCollege(user.college || '');
      setDepartment(user.department || 'Computer Science');
      setYear(user.year || '3rd Year');
      setCity(user.city || 'Mumbai');
      setState(user.state || 'Maharashtra');
    }
  }, [user]);

  // Sync selected event if passed as prop
  useEffect(() => {
    if (preselectedEventId) {
      setSelectedEventId(preselectedEventId);
    }
  }, [preselectedEventId]);

  // Reset payment and clash acknowledgment on event change
  useEffect(() => {
    setPaymentPaid(false);
    setPaymentTransactionId('');
    setPaymentUpiApp('');
    setQrTimeLeft(600);
    setClashAcknowledged(false);
    setTimingConfirmed(false);
  }, [selectedEventId]);

  // QR Timer Countdown
  useEffect(() => {
    if (paymentMethod === 'upi_qr' && !paymentPaid && qrTimeLeft > 0) {
      const timer = setInterval(() => {
        setQrTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentMethod, paymentPaid, qrTimeLeft]);

  const currentEvent = events.find(e => e.event_id === selectedEventId) || events[0];
  const isTeam = currentEvent?.participation_type === 'team';

  // Check user's registrations for clash & duplicate
  const userRegs = store.getRegistrationsByUser(user?.id || 'guest');
  const alreadyRegistered = userRegs.find(r => r.event_id === selectedEventId);
  const clashInfo = checkEventClash(selectedEventId, userRegs);

  // Format date helper
  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to verify clash before starting payment
  const verifyClashBeforePayment = (): boolean => {
    if (alreadyRegistered) {
      showToast(`You have already registered for this event (ID: ${alreadyRegistered.registration_id}). No duplicate payment needed.`, 'warning');
      return false;
    }
    const clash = checkEventClash(selectedEventId, userRegs);
    if (clash.hasClash && clash.conflictingEvent && !clashAcknowledged) {
      setClashingEvent(clash.conflictingEvent);
      setClashModalOpen(true);
      showToast('⚠️ Please review and acknowledge schedule conflict before proceeding to payment.', 'warning', 5000);
      return false;
    }
    return true;
  };

  // Inline Quick Auth Handler for Guests
  const handleQuickAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      showToast('Please enter your official college email.', 'error');
      return;
    }

    setIsAuthLoading(true);

    if (authMode === 'login') {
      const res = await login(authEmail, authPassword || 'password123');
      setIsAuthLoading(false);
      if (!res.success) {
        showToast(res.message || 'Login failed. Please verify credentials.', 'error');
      } else {
        showToast('Authenticated! You can now review timings and complete your event registration.', 'success');
      }
    } else {
      if (!authName.trim() || !authCollege.trim()) {
        showToast('Please enter your full name and college name to register.', 'error');
        setIsAuthLoading(false);
        return;
      }
      const res = await register({
        full_name: authName,
        email: authEmail,
        phone: authPhone,
        college: authCollege,
        department: authDept,
        year: '3rd Year',
        gender: 'Male',
        city: 'Mumbai',
        state: 'Maharashtra'
      });
      setIsAuthLoading(false);
      if (!res.success) {
        showToast(res.message || 'Registration failed', 'error');
      } else {
        showToast('Account registered! You can now verify event timings and proceed with payment.', 'success');
      }
    }
  };

  // Add team member row
  const addTeamMember = () => {
    if (currentEvent && teamMembers.length + 1 >= currentEvent.team_size_max) {
      showToast(`Maximum team size for this event is ${currentEvent.team_size_max} members.`, 'warning');
      return;
    }
    setTeamMembers(prev => [...prev, { member_name: '', college: college || '', roll_number: '', role: 'member' }]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: string, val: string) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  // Payment Handlers
  const handleSimulateUpiPayment = (appName: string) => {
    if (!verifyClashBeforePayment()) return;

    setIsProcessingPayment(true);
    const utr = `UPI-${Date.now().toString().slice(-8)}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Attempt deep link if on mobile device
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      const upiUrl = `upi://pay?pa=colorido2026@sbi&pn=COLORIDO_2K26&am=${currentEvent.registration_fee}&cu=INR&tn=REG_${currentEvent.event_id}`;
      try {
        window.location.href = upiUrl;
      } catch (e) {
        // fallback
      }
    }

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentPaid(true);
      setPaymentTransactionId(utr);
      setPaymentUpiApp(appName);
      showToast(`Payment of ₹${currentEvent.registration_fee} verified via ${appName}! UTR: ${utr}`, 'success', 6000);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch (err) {}
    }, 1200);
  };

  const handleVerifyQrPayment = () => {
    if (!verifyClashBeforePayment()) return;

    setIsProcessingPayment(true);
    const utr = `UPI-QR-${Date.now().toString().slice(-8)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentPaid(true);
      setPaymentTransactionId(utr);
      setPaymentUpiApp('UPI Dynamic QR');
      showToast(`QR payment of ₹${currentEvent.registration_fee} verified! UTR: ${utr}`, 'success', 6000);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch (err) {}
    }, 1200);
  };

  const handleVpaPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyClashBeforePayment()) return;

    if (!upiVpaInput.trim() || !upiVpaInput.includes('@')) {
      showToast('Please enter a valid UPI ID (e.g., student@oksbi or phone@paytm)', 'error');
      return;
    }
    setIsProcessingPayment(true);
    const utr = `UPI-VPA-${Date.now().toString().slice(-8)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentPaid(true);
      setPaymentTransactionId(utr);
      setPaymentUpiApp(`UPI: ${upiVpaInput}`);
      showToast(`Payment of ₹${currentEvent.registration_fee} approved from ${upiVpaInput}! UTR: ${utr}`, 'success', 6000);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch (err) {}
    }, 1400);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('Please register an account or log in first before completing event registration.', 'error');
      return;
    }

    if (alreadyRegistered) {
      showToast(`You have already registered for this event (Registration ID: ${alreadyRegistered.registration_id}).`, 'warning');
      return;
    }

    if (!termsAccepted) {
      showToast('Please accept the tournament terms and festival rules to proceed.', 'error');
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim() || !college.trim()) {
      showToast('Please enter all required personal details (Name, Email, Phone, College).', 'error');
      return;
    }

    if (phone.replace(/\D/g, '').length !== 10) {
      showToast('Please enter a valid 10-digit phone number.', 'error');
      return;
    }

    if (isTeam && !teamName.trim()) {
      showToast('Please specify your registered Team Name.', 'error');
      return;
    }

    // Check Schedule Clash before proceeding
    const clash = checkEventClash(selectedEventId, userRegs);
    if (clash.hasClash && clash.conflictingEvent && !clashAcknowledged) {
      setClashingEvent(clash.conflictingEvent);
      setClashModalOpen(true);
      return;
    }

    // Check payment clearance
    if (currentEvent.registration_fee > 0 && !paymentPaid) {
      showToast(`Please complete the online payment of ₹${currentEvent.registration_fee} via UPI before submitting.`, 'warning');
      const el = document.getElementById('payment-gateway-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    executeRegistration();
  };

  const executeRegistration = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      // Generate Unique Registration ID: e.g. COL26-CUL-001245 or COL26-SPT-002381
      const prefix = currentEvent.category === 'cultural' ? 'CUL' : 'SPT';
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const registrationId = `COL26-${prefix}-${randomSuffix}`;

      const totalTeamSize = isTeam ? teamMembers.length + 1 : 1;

      const newRegistration: Registration = {
        id: `reg_${Date.now()}`,
        registration_id: registrationId,
        event_id: currentEvent.event_id,
        user_id: user?.id || 'guest',
        participant_name: fullName,
        participant_email: email,
        participant_phone: phone,
        participant_college: college,
        participation_type: currentEvent.participation_type,
        team_name: isTeam ? teamName : undefined,
        team_size: totalTeamSize,
        emergency_contact_name: emergencyName,
        emergency_contact_phone: emergencyPhone,
        status: 'confirmed',
        qr_code_data: `COL26:${registrationId}:${currentEvent.event_id}:${fullName}`,
        created_at: new Date().toISOString(),
        payment_status: currentEvent.registration_fee === 0 ? 'free' : 'paid',
        payment_amount: currentEvent.registration_fee,
        payment_method: currentEvent.registration_fee === 0 ? 'free' : 'upi',
        payment_transaction_id: currentEvent.registration_fee === 0 ? undefined : (paymentTransactionId || `UPI-${Date.now().toString().slice(-8)}`),
        payment_upi_app: currentEvent.registration_fee === 0 ? 'Free Entry (Sponsored)' : (paymentUpiApp || 'UPI Online'),
        paid_at: new Date().toISOString()
      };

      store.addRegistration(newRegistration);
      setRegisteredItem(newRegistration);
      setIsSubmitting(false);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      showToast(`You're officially registered! 🎉 Registration ID: ${registrationId}`, 'success', 6000);
    }, 600);
  };

  // SUCCESS SCREEN
  if (registeredItem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-[#12172F] border-2 border-emerald-500/50 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              Registration Successful 🎉
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              You are Officially Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Your official credentials, fixture timing confirmation, and payment verification have been recorded in the COLORIDO 2K26 tournament database.
            </p>
          </div>

          {/* Confirmation Summary Card */}
          <div className="bg-[#1A2142] p-6 rounded-2xl border border-white/10 text-left max-w-md mx-auto space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400">Registration ID:</span>
              <span className="font-mono font-bold text-fuchsia-400 text-sm">{registeredItem.registration_id}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400">Participant / Leader:</span>
              <span className="font-bold text-white">{registeredItem.participant_name}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400">Institution:</span>
              <span className="font-medium text-slate-200 truncate max-w-[200px]">{registeredItem.participant_college}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400">Event:</span>
              <span className="font-bold text-white">{currentEvent.event_name}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400">Scheduled Date & Timing:</span>
              <span className="font-medium text-slate-200">
                {formatEventDate(currentEvent.event_date)} ({currentEvent.start_time.slice(0, 5)} - {currentEvent.end_time.slice(0, 5)})
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400">Venue:</span>
              <span className="font-bold text-emerald-400">{currentEvent.venue}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400">Payment Status:</span>
              <span className={`font-bold px-2.5 py-0.5 rounded text-[11px] ${
                registeredItem.payment_status === 'free'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {registeredItem.payment_status === 'free' ? 'FREE ENTRY' : `PAID & VERIFIED (₹${registeredItem.payment_amount})`}
              </span>
            </div>
            {registeredItem.payment_transaction_id && (
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-slate-400">UTR / Ref:</span>
                <span className="font-mono text-emerald-300 font-bold">{registeredItem.payment_transaction_id}</span>
              </div>
            )}
            {registeredItem.payment_upi_app && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Payment Channel:</span>
                <span className="text-slate-200 font-medium">{registeredItem.payment_upi_app}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <button
              onClick={() => setPassModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>VIEW DIGITAL QR PASS</span>
            </button>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="px-6 py-3 rounded-xl bg-[#1A2142] hover:bg-[#222B55] border border-white/10 text-white font-bold text-xs"
            >
              GO TO MY DASHBOARD
            </button>
          </div>
        </div>

        {/* Digital Pass Modal */}
        <DigitalPassModal
          registration={registeredItem}
          isOpen={passModalOpen}
          onClose={() => setPassModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Registration Gateway</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Event Registration Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Participate in COLORIDO 2K26 championship fixtures. Authenticate your student profile, verify schedule timings, and settle payment to receive your official Digital QR Pass.
        </p>
      </div>

      {/* ── STEP 0: GUEST AUTHENTICATION GATE (IF NOT LOGGED IN) ── */}
      {!user ? (
        <div className="bg-[#12172F] border-2 border-fuchsia-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in duration-300">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-400 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-black text-white">Participant Account Required</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    STEP 1 OF REGISTRATION
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  To join championship events, verify fixture timings, and obtain a valid Digital QR Pass, you must register or log in first.
                </p>
              </div>
            </div>

            {/* Switch between Register / Login */}
            <div className="flex bg-[#1A2142] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'register'
                    ? 'bg-fuchsia-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Existing Login
              </button>
            </div>
          </div>

          {/* Inline Quick Auth Form */}
          <form onSubmit={handleQuickAuthSubmit} className="space-y-4 max-w-2xl mx-auto">
            {authMode === 'register' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-fuchsia-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Official College Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    placeholder="e.g. aarav@college.edu"
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-fuchsia-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={authPhone}
                    onChange={e => setAuthPhone(e.target.value)}
                    placeholder="+91 98210 11223"
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-fuchsia-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    College / University *
                  </label>
                  <input
                    type="text"
                    required
                    value={authCollege}
                    onChange={e => setAuthCollege(e.target.value)}
                    placeholder="e.g. St. Xavier's College"
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-fuchsia-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Department / Stream
                  </label>
                  <input
                    type="text"
                    value={authDept}
                    onChange={e => setAuthDept(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-fuchsia-500/50"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Registered Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    placeholder="e.g. student@college.edu or aarav.sharma@xavier.edu"
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Password (Optional for Demo)
                  </label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-xl transition-all flex items-center justify-center space-x-2 ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
              }`}
            >
              {isAuthLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : authMode === 'register' ? (
                <UserPlus className="w-4 h-4" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>
                {isAuthLoading
                  ? 'Verifying Credentials...'
                  : authMode === 'register'
                  ? 'Register Account & Unlock Event Fixtures'
                  : 'Log In & Continue to Event Fixtures'}
              </span>
            </button>
          </form>

          {/* Quick Evaluator Demo Student Login */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">Quick Demo Access:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('participant');
                  showToast('Logged in as Aarav Sharma (Student Participant)!', 'success');
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 font-bold transition-all text-[11px]"
              >
                👤 Quick Login: Aarav Sharma (Student)
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-all text-[11px]"
              >
                Full Login Portal &rarr;
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── ACTIVE REGISTRATION FORM (UNLOCKED FOR LOGGED-IN USERS) ── */}
      <form onSubmit={handleSubmit} className={`space-y-8 ${!user ? 'opacity-40 pointer-events-none filter blur-[1px]' : ''}`}>
        
        {/* Authenticated Banner */}
        {user && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white flex items-center space-x-2">
                  <span>Registered Participant: {user.full_name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    VERIFIED
                  </span>
                </p>
                <p className="text-[11px] text-slate-300">
                  {user.college} • {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-emerald-400 font-semibold">Account Active</span>
            </div>
          </div>
        )}

        {/* STEP 1: EVENT SELECTION & TIMING VERIFICATION */}
        <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
            <div className="w-8 h-8 rounded-lg bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Event Discipline & Schedule Timing Verification</h2>
              <p className="text-xs text-slate-400">Select tournament fixture and verify scheduled timings to prevent timetable clashes</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Competition Event
              </label>
              <select
                value={selectedEventId}
                onChange={e => setSelectedEventId(e.target.value)}
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-fuchsia-500/50 cursor-pointer font-medium"
              >
                <optgroup label="🎭 CULTURAL EVENTS (10 Disciplines)">
                  {events.filter(e => e.category === 'cultural').map(evt => (
                    <option key={evt.event_id} value={evt.event_id}>
                      {evt.event_name} ({evt.sub_category.toUpperCase()} • ₹{evt.registration_fee})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🏆 SPORTS CHAMPIONSHIPS — BOYS">
                  {events.filter(e => e.category === 'sports' && e.sub_category === 'boys').map(evt => (
                    <option key={evt.event_id} value={evt.event_id}>
                      {evt.event_name} (₹{evt.registration_fee})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🏆 SPORTS CHAMPIONSHIPS — GIRLS">
                  {events.filter(e => e.category === 'sports' && e.sub_category === 'girls').map(evt => (
                    <option key={evt.event_id} value={evt.event_id}>
                      {evt.event_name} (₹{evt.registration_fee})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Detailed Event Timings & Venue Card */}
            {currentEvent && (
              <div className="p-5 rounded-2xl bg-[#1A2142] border border-white/10 space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="font-display font-extrabold text-white text-base block">{currentEvent.event_name}</span>
                    <span className="text-[11px] text-slate-400 capitalize">{currentEvent.category} • {currentEvent.sub_category}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-300 font-bold uppercase text-[10px] border border-fuchsia-500/30">
                    {currentEvent.participation_type === 'team'
                      ? `Team (${currentEvent.team_size_min}-${currentEvent.team_size_max} Members)`
                      : 'Solo / Individual'}
                  </span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">{currentEvent.description}</p>

                {/* Timetable & Venue Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-[#12172F] border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span>Fixture Date</span>
                    </span>
                    <p className="font-bold text-white text-xs">{formatEventDate(currentEvent.event_date)}</p>
                    <span className="text-[10px] text-slate-400">Festival Tournament Day</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#12172F] border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Competition Timings</span>
                    </span>
                    <p className="font-bold text-emerald-300 text-xs">
                      {currentEvent.start_time.slice(0, 5)} – {currentEvent.end_time.slice(0, 5)}
                    </p>
                    <span className="text-[10px] text-slate-400">Reporting 30 mins prior</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#12172F] border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Designated Venue</span>
                    </span>
                    <p className="font-bold text-indigo-300 text-xs truncate">{currentEvent.venue}</p>
                    <span className="text-[10px] text-slate-400">Main Festival Campus</span>
                  </div>
                </div>

                {/* Inline Duplicate Registration Alert */}
                {alreadyRegistered && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>You are already confirmed for this event! Reg ID: <strong className="text-white font-mono">{alreadyRegistered.registration_id}</strong>.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/pass/${alreadyRegistered.registration_id}`)}
                      className="px-3 py-1 bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-300 rounded-lg font-bold text-xs self-start sm:self-auto"
                    >
                      View Pass
                    </button>
                  </div>
                )}

                {/* Schedule Clash Status */}
                {clashInfo.hasClash && clashInfo.conflictingEvent ? (
                  <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="font-bold text-amber-300">Schedule Conflict Detected</span>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                        Timetable Overlap
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      This fixture clashes in timing with your registered event: <strong className="text-white">{clashInfo.conflictingEvent.event_name}</strong> ({clashInfo.conflictingEvent.start_time.slice(0, 5)} - {clashInfo.conflictingEvent.end_time.slice(0, 5)}).
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setClashingEvent(clashInfo.conflictingEvent || null);
                          setClashModalOpen(true);
                        }}
                        className="px-3 py-1 bg-amber-500/25 hover:bg-amber-500/35 text-amber-300 rounded-lg font-bold text-[11px]"
                      >
                        Inspect Clash Details & Acknowledge
                      </button>
                      <button
                        type="button"
                        onClick={onViewSchedule}
                        className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold"
                      >
                        Open Full Schedule & Fixtures &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span><strong>Timing Clearance:</strong> No timetable clash detected across your festival schedule.</span>
                    </div>
                    <button
                      type="button"
                      onClick={onViewSchedule}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-semibold"
                    >
                      View Schedule
                    </button>
                  </div>
                )}

                {/* Timing Confirmation Check */}
                <div className="pt-2 border-t border-white/10">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={timingConfirmed}
                      onChange={e => setTimingConfirmed(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-800 border-slate-700"
                    />
                    <span className="text-[11px] text-slate-300">
                      I have verified the fixture date ({formatEventDate(currentEvent.event_date)}) and competition timings ({currentEvent.start_time.slice(0, 5)} - {currentEvent.end_time.slice(0, 5)}) for this event.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STEP 2: PERSONAL & INSTITUTIONAL INFORMATION */}
        <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Personal & Institutional Credentials</h2>
              <p className="text-xs text-slate-400">Primary participant or contingent leader information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Official College Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. aarav.sharma@xavier.edu"
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit Mobile Number"
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Gender *
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* College */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                College / Institution Name *
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="e.g. St. Xavier's College, Mumbai"
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Department / Major
              </label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Year of Study
              </label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>
        </div>

        {/* STEP 3: TEAM MEMBERS (Only if team event) */}
        {isTeam && (
          <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Team Roster Configuration</h2>
                  <p className="text-xs text-slate-400">
                    Required size: {currentEvent.team_size_min} to {currentEvent.team_size_max} members
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addTeamMember}
                className="px-3 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Official Team / Crew Name *
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  placeholder="e.g. St. Xavier Ballers / Electric Rhythm Crew"
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-sky-500/50"
                />
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-400 block">
                  Team Members ({teamMembers.length + 1} / {currentEvent.team_size_max})
                </span>

                {/* Leader (Readonly Card) */}
                <div className="p-3 rounded-xl bg-[#1A2142] border border-sky-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold text-[10px] uppercase">
                      Leader
                    </span>
                    <span className="font-bold text-white">{fullName || 'Primary Participant'}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{college || 'Same College'}</span>
                </div>

                {/* Additional Members Rows */}
                {teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#1A2142] border border-white/5 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-300 text-[11px]">Member #{idx + 2}</span>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Member Full Name *"
                        required
                        value={member.member_name || ''}
                        onChange={e => updateTeamMember(idx, 'member_name', e.target.value)}
                        className="bg-[#12172F] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="College Roll / ID No."
                        value={member.roll_number || ''}
                        onChange={e => updateTeamMember(idx, 'roll_number', e.target.value)}
                        className="bg-[#12172F] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="College Name"
                        value={member.college || college}
                        onChange={e => updateTeamMember(idx, 'college', e.target.value)}
                        className="bg-[#12172F] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP: ONLINE UPI PAYMENT GATEWAY & PAYMENT STATUS */}
        <div id="payment-gateway-section" className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {isTeam ? 4 : 3}
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Online UPI Payment Gateway</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    256-BIT ENCRYPTED
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Instant registration fee settlement via UPI apps or dynamic QR</p>
              </div>
            </div>

            {/* Live Payment Status Pill */}
            <div>
              {currentEvent.registration_fee === 0 ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free Festival Entry</span>
                </span>
              ) : paymentPaid ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1.5 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Payment Verified (₹{currentEvent.registration_fee})</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Payment Pending: ₹{currentEvent.registration_fee}</span>
                </span>
              )}
            </div>
          </div>

          {/* Fee Breakdown Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#1A2142] p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Competition Fee</span>
              <p className="text-lg font-bold text-white">
                {currentEvent.registration_fee === 0 ? '₹0.00' : `₹${currentEvent.registration_fee}.00`}
              </p>
              <span className="text-[10px] text-slate-400">Official tournament entry</span>
            </div>
            <div className="bg-[#1A2142] p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform Gateway Fee</span>
              <p className="text-lg font-bold text-emerald-400">₹0.00</p>
              <span className="text-[10px] text-emerald-400/80">100% University Sponsored</span>
            </div>
            <div className="bg-[#1A2142] p-3.5 rounded-2xl border border-emerald-500/20 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Total Payable Amount</span>
              <p className="text-lg font-black text-festival-gold">
                {currentEvent.registration_fee === 0 ? 'FREE' : `₹${currentEvent.registration_fee}.00`}
              </p>
              <span className="text-[10px] text-slate-300">
                {currentEvent.registration_fee === 0 ? 'No charge for this discipline' : 'All taxes and entry clearance included'}
              </span>
            </div>
          </div>

          {/* Pre-payment Clash Warning Notification in Payment Section */}
          {clashInfo.hasClash && clashInfo.conflictingEvent && !clashAcknowledged && (
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-300">Schedule Conflict Alert</p>
                  <p className="text-[11px] text-slate-300">
                    This fixture clashes with your registered fixture <strong className="text-white">{clashInfo.conflictingEvent.event_name}</strong>. Please review and acknowledge before paying.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setClashingEvent(clashInfo.conflictingEvent || null);
                  setClashModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/25 hover:bg-amber-500/35 text-amber-300 font-bold text-xs self-start sm:self-auto transition-colors flex-shrink-0"
              >
                Review Clash & Acknowledge
              </button>
            </div>
          )}

          {currentEvent.registration_fee === 0 ? (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200 flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-sky-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-white">No Registration Fee Required</h4>
                <p className="text-[11px] text-sky-300 mt-0.5">
                  This discipline has been designated for open participation. Simply accept the tournament terms below to generate your official Digital QR pass.
                </p>
              </div>
            </div>
          ) : paymentPaid ? (
            /* PAID CONFIRMATION BANNER */
            <div className="p-6 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/40 text-xs text-white space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-300">UPI Payment Verified & Cleared</h4>
                    <p className="text-[11px] text-slate-300">Authorized online via {paymentUpiApp}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentPaid(false);
                    setPaymentTransactionId('');
                    showToast('Payment mode reset. You may choose another payment method.', 'info');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-slate-300 transition-colors"
                >
                  Change / Retry
                </button>
              </div>
              <div className="bg-black/30 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Amount Received</span>
                  <span className="font-bold text-white">₹{currentEvent.registration_fee}.00</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">UTR Reference</span>
                  <span className="font-mono font-bold text-emerald-400">{paymentTransactionId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Merchant VPA</span>
                  <span className="font-mono text-slate-300">colorido2026@sbi</span>
                </div>
              </div>
            </div>
          ) : (
            /* PAYMENT CHANNELS SELECTOR */
            <div className="space-y-5">
              {/* Payment Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_apps')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    paymentMethod === 'upi_apps'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI Apps (GPay / PhonePe / Paytm)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_qr')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    paymentMethod === 'upi_qr'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan Dynamic UPI QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_id')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    paymentMethod === 'upi_id'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>UPI ID / VPA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards / NetBanking</span>
                </button>
              </div>

              {/* TAB 1: UPI APPS */}
              {paymentMethod === 'upi_apps' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    Select your preferred UPI application to launch instant authorization of <strong>₹{currentEvent.registration_fee}</strong>:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Google Pay */}
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={() => handleSimulateUpiPayment('Google Pay')}
                      className="p-4 rounded-2xl bg-[#1A2142] hover:bg-[#202952] border border-white/10 hover:border-emerald-500/50 flex flex-col items-center justify-center space-y-2 group transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                        <span className="font-black text-sm tracking-tighter text-slate-900">
                          <span className="text-blue-500">G</span>
                          <span className="text-red-500">P</span>
                          <span className="text-yellow-500">a</span>
                          <span className="text-green-500">y</span>
                        </span>
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400">Google Pay</span>
                      <span className="text-[10px] text-slate-400">Fast UPI</span>
                    </button>

                    {/* PhonePe */}
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={() => handleSimulateUpiPayment('PhonePe')}
                      className="p-4 rounded-2xl bg-[#1A2142] hover:bg-[#202952] border border-white/10 hover:border-emerald-500/50 flex flex-col items-center justify-center space-y-2 group transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#5f259f] flex items-center justify-center text-white font-black text-base shadow">
                        पे
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400">PhonePe</span>
                      <span className="text-[10px] text-slate-400">Instant Pay</span>
                    </button>

                    {/* Paytm */}
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={() => handleSimulateUpiPayment('Paytm')}
                      className="p-4 rounded-2xl bg-[#1A2142] hover:bg-[#202952] border border-white/10 hover:border-emerald-500/50 flex flex-col items-center justify-center space-y-2 group transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#002e6e] flex items-center justify-center text-[#00baf2] font-black text-xs shadow">
                        Paytm
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400">Paytm UPI</span>
                      <span className="text-[10px] text-slate-400">Wallet & Bank</span>
                    </button>

                    {/* BHIM UPI */}
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={() => handleSimulateUpiPayment('BHIM UPI')}
                      className="p-4 rounded-2xl bg-[#1A2142] hover:bg-[#202952] border border-white/10 hover:border-emerald-500/50 flex flex-col items-center justify-center space-y-2 group transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-green-600 flex items-center justify-center text-white font-black text-xs shadow">
                        BHIM
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400">BHIM UPI</span>
                      <span className="text-[10px] text-slate-400">NPCI Official</span>
                    </button>
                  </div>

                  {isProcessingPayment && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 animate-pulse">
                      <p className="text-xs font-bold text-emerald-400">
                        Connecting to UPI Network & Requesting Authorization...
                      </p>
                      <p className="text-[11px] text-slate-300">
                        Please approve ₹{currentEvent.registration_fee} on your UPI application.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: DYNAMIC UPI QR */}
              {paymentMethod === 'upi_qr' && (
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#1A2142] p-6 rounded-2xl border border-white/10">
                  <div className="bg-white p-3.5 rounded-2xl shadow-xl flex flex-col items-center flex-shrink-0">
                    <QRCodeSVG
                      value={`upi://pay?pa=colorido2026@sbi&pn=COLORIDO2026&am=${currentEvent.registration_fee}&cu=INR&tn=REG_${currentEvent.event_id}`}
                      size={150}
                      level="H"
                    />
                    <div className="mt-2 text-center">
                      <span className="text-[10px] font-mono font-bold text-slate-800 block">UPI QR CODE</span>
                      <span className="text-[9px] text-slate-500">Scan with any UPI App</span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Payee:</span>
                      <span className="font-bold text-white">COLORIDO 2K26 OFFICIAL</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">UPI ID / VPA:</span>
                      <span className="font-mono text-emerald-400 font-bold">colorido2026@sbi</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Payable Amount:</span>
                      <span className="text-base font-black text-festival-gold">₹{currentEvent.registration_fee}.00</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <span className="text-slate-400">QR Valid For:</span>
                      <span className="font-mono text-amber-400 font-bold">
                        {Math.floor(qrTimeLeft / 60)}:{(qrTimeLeft % 60).toString().padStart(2, '0')} mins
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={handleVerifyQrPayment}
                      className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
                    >
                      {isProcessingPayment ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>I Have Completed Payment / Verify Now</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: UPI ID / VPA INPUT */}
              {paymentMethod === 'upi_id' && (
                <div className="bg-[#1A2142] p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Virtual Payment Address (UPI ID)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Enter your UPI ID (e.g., mobile@oksbi, username@paytm, name@ybl, id@icici)
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={upiVpaInput}
                      onChange={e => setUpiVpaInput(e.target.value)}
                      placeholder="e.g. participant@oksbi"
                      className="flex-1 bg-[#12172F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <button
                      type="button"
                      disabled={isProcessingPayment || !upiVpaInput.trim()}
                      onClick={handleVpaPayment}
                      className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg"
                    >
                      {isProcessingPayment ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                      <span>Request ₹{currentEvent.registration_fee}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-400">
                    <span className="text-slate-500">Quick suffixes:</span>
                    {['@oksbi', '@okhdfcbank', '@okaxis', '@paytm', '@ybl', '@ibl'].map(sfx => (
                      <button
                        key={sfx}
                        type="button"
                        onClick={() => {
                          const base = upiVpaInput.split('@')[0] || fullName.toLowerCase().replace(/\s+/g, '') || 'student';
                          setUpiVpaInput(`${base}${sfx}`);
                        }}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                      >
                        {sfx}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CARD / NETBANKING */}
              {paymentMethod === 'card' && (
                <div className="bg-[#1A2142] p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="•••• •••• •••• 4242"
                        className="w-full bg-[#12172F] border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        defaultValue={fullName}
                        className="w-full bg-[#12172F] border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-400 mb-1">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full bg-[#12172F] border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={3}
                          className="w-full bg-[#12172F] border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        disabled={isProcessingPayment}
                        onClick={() => handleSimulateUpiPayment('Debit/Credit Card')}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Pay ₹{currentEvent.registration_fee} Securely</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* STEP: EMERGENCY CONTACT & RULES ACCEPTANCE */}
        <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              {isTeam ? 5 : 4}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Emergency Contacts & Regulations</h2>
              <p className="text-xs text-slate-400">Campus safety protocol & tournament agreement</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Emergency Contact Person
              </label>
              <input
                type="text"
                required
                value={emergencyName}
                onChange={e => setEmergencyName(e.target.value)}
                placeholder="Parent / Department Faculty Advisor"
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                required
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                placeholder="+91 98210 99887"
                className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-fuchsia-600 focus:ring-0 bg-slate-800 border-slate-700"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I hereby declare that all provided student credentials are true. I agree to abide by the official regulations of COLORIDO 2K26, respect adjudicator decisions, and uphold the highest standards of inter-collegiate sportsmanship.
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !user}
            className="w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-2xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Confirming Registration & Verification...</span>
            ) : currentEvent.registration_fee > 0 && !paymentPaid ? (
              <>
                <Lock className="w-4 h-4 text-emerald-300" />
                <span>PAY ₹{currentEvent.registration_fee} & COMPLETE REGISTRATION</span>
              </>
            ) : (
              <>
                <span>COMPLETE REGISTRATION & GET PASS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Clash Warning Modal */}
      {clashingEvent && (
        <ClashWarningModal
          isOpen={clashModalOpen}
          onClose={() => setClashModalOpen(false)}
          targetEvent={currentEvent}
          conflictingEvent={clashingEvent}
          onViewSchedule={onViewSchedule}
          onProceedAnyway={() => {
            setClashAcknowledged(true);
            setClashModalOpen(false);
            showToast('Schedule clash acknowledged. You may now proceed with payment and pass confirmation.', 'info', 5000);
          }}
        />
      )}
    </div>
  );
};
