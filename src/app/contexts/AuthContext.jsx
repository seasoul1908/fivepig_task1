import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('fivepigs_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
    // Get users from localStorage
    const usersData = localStorage.getItem('fivepigs_users');
    const users = usersData ? JSON.parse(usersData) : [];

    // Admin account
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

    // Check customer accounts
    const foundUser = users.find((u) => u.email === email && u.password === password);
    if (foundUser) {
      const loggedInUser = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: 'customer'
      };
      setUser(loggedInUser);
      localStorage.setItem('fivepigs_user', JSON.stringify(loggedInUser));
      return true;
    }

    return false;
  };

  const register = (email, password, name) => {
    const usersData = localStorage.getItem('fivepigs_users');
    const users = usersData ? JSON.parse(usersData) : [];

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: 'customer'
    };

    users.push(newUser);
    localStorage.setItem('fivepigs_users', JSON.stringify(users));

    const loggedInUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: 'customer'
    };
    setUser(loggedInUser);
    localStorage.setItem('fivepigs_user', JSON.stringify(loggedInUser));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fivepigs_user');
  };

  const resetPassword = (email, newPassword) => {
    try {
      // Admin account cannot reset password via this method
      if (email === 'admin@fivepigs.com') {
        return false;
      }

      const usersData = localStorage.getItem('fivepigs_users');
      const users = usersData ? JSON.parse(usersData) : [];

      const userIndex = users.findIndex((u) => u.email === email);
      if (userIndex === -1) {
        return false;
      }

      users[userIndex].password = newPassword;
      localStorage.setItem('fivepigs_users', JSON.stringify(users));
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateProfile = (updatedData) => {
    try {
      if (!user) return false;

      // Admin account
      if (user.role === 'admin') {
        const updatedUser = {
          ...user,
          name: updatedData.name
        };
        setUser(updatedUser);
        localStorage.setItem('fivepigs_user', JSON.stringify(updatedUser));
        return true;
      }

      // Customer account
      const usersData = localStorage.getItem('fivepigs_users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Check if new email already exists (if email changed)
      if (updatedData.email !== user.email) {
        const emailExists = users.some(
          (u) => u.email === updatedData.email && u.id !== user.id
        );
        if (emailExists) {
          return false;
        }
      }

      const userIndex = users.findIndex((u) => u.id === user.id);
      if (userIndex === -1) {
        return false;
      }

      users[userIndex] = {
        ...users[userIndex],
        name: updatedData.name,
        email: updatedData.email
      };
      localStorage.setItem('fivepigs_users', JSON.stringify(users));

      const updatedUser = {
        ...user,
        name: updatedData.name,
        email: updatedData.email
      };
      setUser(updatedUser);
      localStorage.setItem('fivepigs_user', JSON.stringify(updatedUser));

      return true;
    } catch (error) {
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
