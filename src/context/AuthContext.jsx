
import { useState } from 'react';
import AuthContext from './AuthContext.js';

const PROFILES_KEY = 'demoProfiles';
const CURRENT_USER_KEY = 'demoUser';

const demoUsers = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin',
  },
  {
    email: 'user@example.com',
    password: 'user123',
    name: 'Normal User',
    role: 'user',
  },
];

// Get saved profiles for both accounts.
function getSavedProfiles() {
  try {
    return JSON.parse(
      localStorage.getItem(PROFILES_KEY)
    ) || {};
  } catch {
    return {};
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(CURRENT_USER_KEY)
      ) || null;
    } catch {
      return null;
    }
  });

  // Login using the original demo credentials.
  function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    const foundUser = demoUsers.find(
      (item) =>
        item.email === normalizedEmail &&
        item.password === password
    );

    if (!foundUser) {
      return false;
    }

    const profiles = getSavedProfiles();
    const savedProfile = profiles[foundUser.role];

    const loggedInUser = {
      name: savedProfile?.name || foundUser.name,
      email: savedProfile?.email || foundUser.email,
      role: foundUser.role,
    };

    try {
      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(loggedInUser)
      );

      setUser(loggedInUser);
      return true;
    } catch {
      return false;
    }
  }

  // Update the current user's profile.
  function updateProfile({ name, email }) {
    if (!user || !name?.trim() || !email?.trim()) {
      return false;
    }

    const updatedUser = {
      ...user,
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };

    try {
      const profiles = getSavedProfiles();

      // Keep Admin and Normal User profiles separate.
      profiles[user.role] = {
        name: updatedUser.name,
        email: updatedUser.email,
      };

      localStorage.setItem(
        PROFILES_KEY,
        JSON.stringify(profiles)
      );

      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);
      return true;
    } catch {
      return false;
    }
  }

  // Logout only clears the current session.
  function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  }

  const authValue = {
    user,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}
