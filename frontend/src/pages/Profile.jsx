import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1 (212) 555-0123',
    homeAddress: user?.homeAddress || '14 Lewis Place, Suite 8, Brooklyn, NY 11218, USA',
    whatsapp: user?.whatsapp || '+1 (212) 555-0123',
    accountType: user?.accountType || 'Customer',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your personal information and account details.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#FF5C00] hover:bg-[#e55300] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-slate-900 text-white font-bold text-3xl flex items-center justify-center mx-auto">
              {profile.fullName.split(' ').map((n) => n.charAt(0).toUpperCase()).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{profile.fullName}</h3>
              <p className="text-xs text-slate-400 mt-1">{profile.accountType}</p>
            </div>
            <button
              onClick={logout}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>🔓</span> Logout
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#FF5C00]"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-800">{profile.fullName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#FF5C00]"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-800">{profile.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#FF5C00]"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-800">{profile.phone}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Type</label>
                {isEditing ? (
                  <select
                    name="accountType"
                    value={profile.accountType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#FF5C00]"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Business">Business</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-slate-800">{profile.accountType}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Address Information</h2>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Home Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="homeAddress"
                  value={profile.homeAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#FF5C00]"
                />
              ) : (
                <p className="text-sm font-medium text-slate-800">{profile.homeAddress}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="whatsapp"
                  value={profile.whatsapp}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#FF5C00]"
                />
              ) : (
                <p className="text-sm font-medium text-slate-800">{profile.whatsapp}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-[#FF5C00] hover:bg-[#e55300] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
