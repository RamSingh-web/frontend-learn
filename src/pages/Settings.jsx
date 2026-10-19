
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';

const SETTINGS_KEY = 'myAdminSettings';

const defaultPreferences = {
  notifications: true,
};

function getPreferences() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      return {
        ...defaultPreferences,
        ...parsed,
      };
    }
  } catch (error) {
    console.error('Unable to load settings:', error);
  }

  return defaultPreferences;
}

export default function Settings() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [preferences, setPreferences] = useState(getPreferences);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Keep profile fields in sync with the logged-in user.
  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user?.name, user?.email]);

  function handlePreferenceChange(event) {
    const { name, checked } = event.target;

    const updatedPreferences = {
      ...preferences,
      [name]: checked,
    };

    setPreferences(updatedPreferences);
    setMessage('');
    setMessageType('');

    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(updatedPreferences)
      );
    } catch (error) {
      console.error('Unable to save preferences:', error);
      setMessage('Unable to save preferences.');
      setMessageType('error');
    }
  }

  function handleSave(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName || !normalizedEmail) {
      setMessage('Please enter your name and email address.');
      setMessageType('error');
      return;
    }

    if (!user || typeof updateProfile !== 'function') {
      setMessage('Unable to update profile. Please check authentication.');
      setMessageType('error');
      return;
    }

    const success = updateProfile({
      name: trimmedName,
      email: normalizedEmail,
    });

    if (success) {
      setName(trimmedName);
      setEmail(normalizedEmail);
      setMessage('Settings saved successfully!');
      setMessageType('success');
    } else {
      setMessage('Unable to update profile. Please try again.');
      setMessageType('error');
    }
  }

  return (
    <div className="settings-page">
      {/* Page heading */}
      <div className="settings-heading">
        <h1 className="dashboard-title">Settings</h1>
        <p className="welcome-msg">
          Manage your account preferences and settings.
        </p>
      </div>

      {/* Profile settings */}
      <section className="settings-card">
        <div className="settings-section-heading">
          <h2>Profile Settings</h2>
          <p>Update your personal information.</p>
        </div>

        <form onSubmit={handleSave}>
          <div className="settings-form-group">
            <label htmlFor="settings-name">Full Name</label>
            <input
              id="settings-name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setMessage('');
              }}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="settings-form-group">
            <label htmlFor="settings-email">Email Address</label>
            <input
              id="settings-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setMessage('');
              }}
              placeholder="Enter your email address"
              required
            />
          </div>

          <button
            type="submit"
            className="settings-save-button"
          >
            Save Changes
          </button>

          {message && (
            <p
              className={`settings-message ${messageType}`}
              role="status"
            >
              {message}
            </p>
          )}
        </form>
      </section>

      {/* Notification settings */}
      <section className="settings-card">
        <div className="settings-section-heading">
          <h2>Notifications</h2>
          <p>Choose how you want to receive updates.</p>
        </div>

        <label className="settings-option">
          <span className="settings-option-text">
            <strong>Email Notifications</strong>
            <small>
              Receive updates about orders and activities.
            </small>
          </span>

          <input
            type="checkbox"
            name="notifications"
            checked={preferences.notifications}
            onChange={handlePreferenceChange}
          />
        </label>
      </section>

    </div>
  );
}
