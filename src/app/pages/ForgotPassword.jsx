import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../../assets/5f9eebaa05a3972bdba63e8eb27e9beea907ac32.png';

// Database API URL
const API_URL = 'http://localhost:9999/users';

export function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter new password
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  // Changed to async function to make API calls
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Check if it is the hardcoded Admin account
      if (email === 'admin@fivepigs.com') {
        toast.success('Email verified! Please enter your new password.');
        setStep(2);
        return;
      }

      // 2. Fetch API to search for the user by email in database.json
      const response = await fetch(`${API_URL}?email=${email}`);
      const users = await response.json();

      // 3. If the returned array is empty -> User does not exist
      if (users.length === 0) {
        toast.error('No account found with this email address');
        return;
      }

      toast.success('Email verified! Please enter your new password.');
      setStep(2);
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error('Connection error to the server. Please try again.');
    }
  };

  // Changed to async function to wait for the resetPassword process
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must contain at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Password confirmation does not match');
      return;
    }

    // Added await here because resetPassword makes an API call to update the database
    const success = await resetPassword(email, newPassword);

    if (success) {
      toast.success('Password changed successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      toast.error('Something went wrong, please try again');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src={logoImage}
            alt="FivePigs Store"
            className="h-16 w-auto mx-auto mb-4 object-contain"
          />
          <h2 className="text-3xl font-bold text-gray-900">Forgot your password?</h2>
          <p className="text-gray-600 mt-2">
            {step === 1
              ? 'Enter email to reset password'
              : 'Please enter your new password'
            }
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Next
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800">
                  Verification email: <strong>{email}</strong>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter new password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm your password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Reset your password
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Back
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <Link to="/login" className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}