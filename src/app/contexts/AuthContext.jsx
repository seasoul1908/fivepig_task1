import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

// Default json-server URL (change the port if your server runs on a different one)
const API_URL = 'http://localhost:9999/users'; 

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Keep localStorage to persist login state upon page refresh
    const savedUser = localStorage.getItem('fivepigs_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    // Hardcoded Admin account
    if (email === 'admin@fivepigs.com' && password === 'admin123') {
      const adminUser = {
        id: 'admin',
        email: 'admin@fivepigs.com',
        name: 'Admin',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('fivepigs_user', JSON.stringify(adminUser));
      return true;
    }

    try {
      // Fetch user from json-server database
      const response = await fetch(`${API_URL}?email=${email}&password=${password}`);
      const users = await response.json();

      if (users.length > 0) {
        const loggedInUser = {
          id: users[0].id,
          email: users[0].email,
          name: users[0].name,
          role: 'customer'
        };
        setUser(loggedInUser);
        localStorage.setItem('fivepigs_user', JSON.stringify(loggedInUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  const register = async (email, password, name) => {
    try {
      // Check if email already exists in the database
      const checkResponse = await fetch(`${API_URL}?email=${email}`);
      const existingUsers = await checkResponse.json();
      
      if (existingUsers.length > 0) {
        return false; // Email is already registered
      }

      // Create new user object
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // Note: In production, passwords should be hashed
        name,
        role: 'customer'
      };

      // POST data to json-server to save it in database.json
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      const createdUser = await response.json();

      const loggedInUser = {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: 'customer'
      };
      
      setUser(loggedInUser);
      localStorage.setItem('fivepigs_user', JSON.stringify(loggedInUser));

      return true;
    } catch (error) {
      console.error("Error during registration:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fivepigs_user');
  };

  const resetPassword = async (email, newPassword) => {
    try {
      // Admin account cannot reset password via this method
      if (email === 'admin@fivepigs.com') {
        return false;
      }

      // Find user by email
      const response = await fetch(`${API_URL}?email=${email}`);
      const users = await response.json();

      if (users.length === 0) {
        return false;
      }

      const userId = users[0].id;

      // Update password via PATCH request
      await fetch(`${API_URL}/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      
      return true;
    } catch (error) {
      console.error("Error resetting password:", error);
      return false;
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      if (!user) return false;

      // Admin account updating name
      if (user.role === 'admin') {
        const updatedUser = {
          ...user,
          name: updatedData.name
        };
        setUser(updatedUser);
        localStorage.setItem('fivepigs_user', JSON.stringify(updatedUser));
        return true;
      }

      // Check if new email already exists (if user attempts to change email)
      if (updatedData.email !== user.email) {
        const checkResponse = await fetch(`${API_URL}?email=${updatedData.email}`);
        const existingUsers = await checkResponse.json();
        
        // If email exists and it doesn't belong to the current user
        if (existingUsers.length > 0 && existingUsers[0].id !== user.id) {
          return false;
        }
      }

      // Update user details via PATCH request
      await fetch(`${API_URL}/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedData.name,
          email: updatedData.email
        })
      });

      const updatedUser = {
        ...user,
        name: updatedData.name,
        email: updatedData.email
      };
      
      setUser(updatedUser);
      localStorage.setItem('fivepigs_user', JSON.stringify(updatedUser));

      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      resetPassword,
      updateProfile,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}