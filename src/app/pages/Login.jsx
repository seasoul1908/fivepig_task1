import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

// TODO: replace figma asset with local file
import logoImage from '../../assets/fivepigslogo.png';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      const success = login(formData.email, formData.password);
      if (success) {
        toast.success("Đăng nhập thành công!");
        // Check if admin
        if (formData.email === "admin@fivepigs.com") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Email hoặc mật khẩu không đúng");
      }
    } else {
      if (!formData.name) {
        toast.error("Vui lòng nhập họ tên");
        return;
      }
      const success = register(
        formData.email,
        formData.password,
        formData.name,
      );
      if (success) {
        toast.success("Đăng ký thành công!");
        navigate("/");
      } else {
        toast.error("Email đã tồn tại");
      }
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
            className="h-16 w-16 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900">FivePigs Store</h2>
          <p className="text-gray-600 mt-2">
            {isLogin ? "Đăng nhập vào tài khoản" : "Tạo tài khoản mới"}
          </p>
        </div>

        {/* Demo Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-blue-800 mb-2">
            Tài khoản demo:
          </p>
          <p className="text-sm text-blue-700">
            <strong>Admin:</strong> admin@fivepigs.com / admin123
          </p>
          <p className="text-sm text-blue-700 mt-1">
            <strong>Hoặc</strong> đăng ký tài khoản mới
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              isLogin
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <LogIn className="w-4 h-4 inline mr-2" />
            Đăng nhập
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              !isLogin
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Đăng ký
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                required={!isLogin}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nguyễn Văn A"
              />
            </div>
          )}

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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Quên mật khẩu
          </Link>
          <br />
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
