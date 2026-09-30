import React, { useState, useEffect } from 'react';
import { X, User, Building, Phone, BookOpen, Calendar, ShieldCheck, Camera, Check } from 'lucide-react';
import { UserProfile } from '../../types/database';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onSave: (updates: Partial<UserProfile>) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setCollege(user.college || '');
      setDepartment(user.department || '');
      setYear(user.year || '3rd Year');
      setGender(user.gender || 'Prefer not to say');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      full_name: fullName.trim(),
      phone: phone.trim(),
      college: college.trim(),
      department: department.trim(),
      year,
      gender,
      avatar_url: avatarUrl.trim() || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || 'User')}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white border border-[#006D8F]/20 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-[#20B2AA]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#006D8F]/15 pb-4 mb-6 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#20B2AA]/15 text-[#064E52]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#064E52]">Edit Profile Details</h2>
              <p className="text-xs text-[#006D8F]">Update your personal and institutional credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#006D8F] hover:bg-[#DDF3F0] hover:text-[#064E52] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Avatar Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#064E52] flex items-center space-x-1.5">
              <Camera className="w-3.5 h-3.5 text-[#006D8F]" />
              <span>Profile Avatar</span>
            </label>

            <div className="flex items-center space-x-4">
              <img
                src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || 'User')}`}
                alt="Avatar preview"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#20B2AA] shadow-md bg-slate-100"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  placeholder="Paste image URL or pick preset below"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#DDF3F0]/40 border border-[#006D8F]/20 text-[#064E52] placeholder:text-[#4A6B6D] text-xs font-medium focus:outline-none focus:border-[#20B2AA]"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAvatarUrl(url)}
                      className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-all relative ${
                        avatarUrl === url ? 'border-[#20B2AA] scale-110 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      {avatarUrl === url && (
                        <div className="absolute inset-0 bg-[#20B2AA]/40 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#064E52]">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your complete full name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#006D8F]/20 text-[#064E52] text-xs font-medium focus:outline-none focus:border-[#20B2AA]"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#064E52]">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#006D8F]/20 text-[#064E52] text-xs font-medium focus:outline-none focus:border-[#20B2AA]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* College / Institution */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#064E52]">College / University</label>
              <input
                type="text"
                required
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="e.g. IIT Madras, Loyola College"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#006D8F]/20 text-[#064E52] text-xs font-medium focus:outline-none focus:border-[#20B2AA]"
              />
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#064E52]">Department / Major</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science, Visual Arts"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#006D8F]/20 text-[#064E52] text-xs font-medium focus:outline-none focus:border-[#20B2AA]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Academic Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#064E52]">Year of Study</label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#006D8F]/20 text-[#064E52] text-xs font-medium focus:outline-none focus:border-[#20B2AA]"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Post Graduate">Post Graduate (PG)</option>
                <option value="PhD / Scholar">PhD / Scholar</option>
                <option value="Faculty Coordinator">Faculty Coordinator</option>
              </select>
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#064E52]">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#006D8F]/20 text-[#064E52] text-xs font-medium focus:outline-none focus:border-[#20B2AA]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#006D8F]/15 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#DDF3F0] hover:bg-[#cbece7] text-[#064E52] font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-extrabold text-xs shadow-md shadow-[#20B2AA]/25 transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
