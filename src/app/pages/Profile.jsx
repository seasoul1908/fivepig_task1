import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

// Local json-server users API URL
const API_URL = "http://localhost:9999/users";

export function Profile() {
  const { user, updateProfile, logout, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
    });
  }, [user, navigate]);

  // Changed to an async function to handle the asynchronous profile update API
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    // Added await here because updateProfile connects to json-server
    const success = await updateProfile({
      name: formData.name,
      email: formData.email,
    });

    if (success) {
      toast.success("Account information updated successfully!");
      setIsEditing(false);
    } else {
      toast.error("Email already exists in the system");
    }
  };

  // Changed to an async function to fetch and update password data in database.json
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (user.role === "admin") {
      // Validate hardcoded admin password
      if (passwordData.currentPassword !== "admin123") {
        toast.error("Current password is incorrect");
        return;
      }
    } else {
      try {
        // Fetch the user's latest data from the database using their ID
        const response = await fetch(`${API_URL}/${user.id}`);
        if (!response.ok) {
          toast.error("User account not found in the database");
          return;
        }
        const dbUser = await response.json();

        // Verify the current password (cast to String to prevent type casting issues)
        if (String(dbUser.password) !== String(passwordData.currentPassword)) {
          toast.error("Current password is incorrect");
          return;
        }
      } catch (error) {
        console.error("Error verifying current password:", error);
        toast.error("Server connection failed. Please try again.");
        return;
      }
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Password confirmation does not match");
      return;
    }

    // Update password in the database for customers using the context function
    if (user.role === "customer") {
      const success = await resetPassword(user.email, passwordData.newPassword);
      if (!success) {
        toast.error("Something went wrong while updating your password");
        return;
      }
    }

    toast.success("Password changed successfully! Please log in again");
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 1500);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Personal Information
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your information and password
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          {/* Profile Information Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Account Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Full name
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <User className="w-5 h-5 text-gray-400" />
                    <span>{user.name}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Role
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {user.role === "admin" ? "Admin" : "Customer"}
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                    disabled={user.role === "admin"}
                  />
                  {user.role === "admin" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Admin email cannot be changed
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || "",
                        email: user.email || "",
                      });
                    }}
                    className="px-6 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Change Password
              </h2>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Change Password
                </button>
              )}
            </div>

            {!isChangingPassword ? (
              <div className="flex-1 flex flex-col justify-center items-center text-gray-600">
                <Lock className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-center text-sm">
                  Click "Change Password" to update your password
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="px-6 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Account Stats */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Account Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Account ID</p>
              <p className="text-lg font-semibold text-blue-900 mt-1">
                {user.id}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">
                Account Type
              </p>
              <p className="text-lg font-semibold text-green-900 mt-1 capitalize">
                {user.role === "admin" ? "Admin" : "Customer"}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Status</p>
              <p className="text-lg font-semibold text-purple-900 mt-1">
                Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}