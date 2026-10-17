import React, { useState } from 'react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const [preferences, setPreferences] = useState({
    language: 'English',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    autoTrack: true,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <button
        type="button"
        role="switch"
        onClick={onChange}
        className={`relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors focus:outline-none ${
          checked ? 'bg-[#FF5C00]' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your application preferences and notification settings.</p>
        </div>
        <button
          onClick={() => console.log('Saving settings...', { notifications, preferences })}
          className="bg-[#FF5C00] hover:bg-[#e55300] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notification Preferences</h2>
            <ToggleSwitch
              checked={notifications.email}
              onChange={() => toggleNotification('email')}
              label="Email Notifications"
            />
            <ToggleSwitch
              checked={notifications.push}
              onChange={() => toggleNotification('push')}
              label="Push Notifications"
            />
            <ToggleSwitch
              checked={notifications.sms}
              onChange={() => toggleNotification('sms')}
              label="SMS Notifications"
            />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">App Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language</label>
                <select
                  name="language"
                  value={preferences.language}
                  onChange={handlePreferenceChange}
                  className="w-full px-3 py-2.5 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#FF5C00]"
                >
                  <option value="English">English</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Currency</label>
                <select
                  name="currency"
                  value={preferences.currency}
                  onChange={handlePreferenceChange}
                  className="w-full px-3 py-2.5 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#FF5C00]"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="BDT">BDT - Bangladeshi Taka</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Format</label>
                <select
                  name="dateFormat"
                  value={preferences.dateFormat}
                  onChange={handlePreferenceChange}
                  className="w-full px-3 py-2.5 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#FF5C00]"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <ToggleSwitch
                checked={preferences.autoTrack}
                onChange={() => setPreferences((prev) => ({ ...prev, autoTrack: !prev.autoTrack }))}
                label="Auto-Track Shipments"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Security</h2>
            <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-left px-3">
              Change Password
            </button>
            <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-left px-3">
              Two-Factor Authentication
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Danger Zone</h2>
            <button className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-xl transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
