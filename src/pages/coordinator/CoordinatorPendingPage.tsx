import React from 'react';
import { ShieldAlert, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onNavigate: (path: string) => void;
}

export const CoordinatorPendingPage: React.FC<Props> = ({ onNavigate }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#DDF3F0] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-[#006D8F]/20 text-center space-y-6">
        
        <div className="w-20 h-20 bg-[#006D8F]/10 rounded-full flex items-center justify-center mx-auto">
          {user?.coordinator_status === 'rejected' || user?.coordinator_status === 'suspended' ? (
             <ShieldAlert className="w-10 h-10 text-red-500" />
          ) : (
             <Clock className="w-10 h-10 text-[#006D8F]" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#064E52]">
            {user?.coordinator_status === 'rejected' ? 'Request Rejected' : 
             user?.coordinator_status === 'suspended' ? 'Account Suspended' : 'Approval Pending'}
          </h1>
          <p className="text-sm text-[#4A6B6D]">
            {user?.coordinator_status === 'rejected' 
              ? 'Your request for coordinator access has been rejected by the administrator. Please contact the secretariat for more information.'
              : user?.coordinator_status === 'suspended'
              ? 'Your coordinator access has been suspended by the administrator.'
              : 'Your coordinator access request has been submitted successfully. Your account will remain restricted until an administrator reviews and approves your request.'}
          </p>
        </div>

        <div className="bg-[#DDF3F0]/50 rounded-xl p-4 text-left border border-[#20B2AA]/20 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#4A6B6D] font-medium">Applicant Name</span>
            <span className="text-[#064E52] font-bold">{user?.full_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#4A6B6D] font-medium">Email Address</span>
            <span className="text-[#064E52] font-bold">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#4A6B6D] font-medium">Current Status</span>
            <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${
               user?.coordinator_status === 'rejected' || user?.coordinator_status === 'suspended'
                 ? 'bg-red-100 text-red-700 border border-red-200'
                 : 'bg-amber-100 text-amber-700 border border-amber-200'
            }`}>
              {user?.coordinator_status || 'Pending'}
            </span>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#064E52] hover:bg-[#043B3E] text-white font-bold text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          
          <button
            onClick={() => onNavigate('/')}
            className="w-full py-3 rounded-xl border border-[#064E52]/20 text-[#064E52] font-bold text-sm hover:bg-[#DDF3F0] transition-colors"
          >
            Return to Homepage
          </button>
        </div>

      </div>
    </div>
  );
};
