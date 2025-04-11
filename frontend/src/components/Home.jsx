import { useState, useEffect} from "react";
import { handleLogin, handleRegister} from "../api/auth"; 
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const request = useSelector((state) => state.auth.login?.currentUser);
  useEffect(() => {
      if (request) {
          navigate("/dashboard"); 
      }
  }, [request, navigate]);
  
  // Xử lý đăng nhập
  const login = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Vui lòng nhập tài khoản và mật khẩu!");
      return;
    }
    try {
      const newUser = {
        username: username,
        password: password,
      };
      handleLogin(newUser, dispatch, navigate, setError);
    } catch (error) {
      console.error("Login failed:", error.message);
      setError(error.message || "Đăng nhập thất bại!");
    }
  };

  // Xử lý đăng ký
  const register = (e) => {
    e.preventDefault();
    // Kiểm tra thông tin đăng ký
    setError("");
    setSuccessful(false);
    if (name.length < 2) {
      setError("Tên người dùng phải có ít nhất 6 ký tự!");
      return;
    }
    if (username.length < 6) {
      setError("Tài khoản phải có ít nhất 6 ký tự!");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (!name || !username || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }
    if (!agree) {
      setError("Vui lòng đồng ý với điều khoản sử dụng!");
      return;
    }
    try {
      const newUser = {
        name: name,
        username: username,
        password: password,
        email: email,
        phone: phone,
      }
      handleRegister(newUser, dispatch, navigate, setError);
      setSuccessful(true);
    } catch (error) {
      setError(error.message);
      console.error("Register failed:", error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* HEADER */}
      <nav className="bg-white text-blue-600 p-4 flex justify-between items-center shadow-md">
        <div className="text-4xl font-bold text-sky-500">
          <Link to="/">SFarm</Link>
        </div>
        <ul className="flex space-x-2 text-sky-700 font-semibold text-lg">
          <Link to="/" className="hover:text-gray-400">Trang chủ</Link>
          <span>|</span>
          <Link to="/" className="hover:text-gray-400">Giới thiệu</Link>
          <span>|</span>
          <Link to="/" className="hover:text-gray-400">Liên hệ</Link>
        </ul>
        <div className="flex space-x-4">
          <button onClick={() => {setIsLoginOpen(true); setError("");}} className="border border-sky-600 text-sky-600 px-4 py-2 rounded hover:bg-sky-600 hover:text-white">
            Đăng nhập
          </button>
          <button onClick={() => {setIsRegisterOpen(true); setError("");}} className="border border-sky-600 text-sky-600 px-4 py-2 rounded hover:bg-sky-600 hover:text-white">
            Đăng ký
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-xl font-bold text-blue-600">
            Chào mừng bạn đến với hệ thống giám sát bò thông minh!
          </h2>
          <p className="mt-2">Hệ thống giám sát bò thông minh giúp bạn quản lý đàn bò hiệu quả hơn.</p>
          <p className="mt-4">Đăng nhập để bắt đầu sử dụng!</p>
        </div>
      </main>

      {/* MODAL ĐĂNG NHẬP */}
      {isLoginOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >

            <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
              Đăng nhập
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                <span className="block text-sm">{error}</span>
              </div>
            )}

            <p className="text-center text-gray-600 mb-6">
              Vui lòng nhập tài khoản và mật khẩu để tiếp tục.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Nhập tài khoản"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Nhập mật khẩu"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={login}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
            >
              Đăng nhập
            </button>

            <div className="text-center mt-4 text-sm text-gray-600">
              Chưa có tài khoản?
              <button
                onClick={() => {
                  setIsLoginOpen(false);
                  setIsRegisterOpen(true);
                  setError("");
                }}
                className="text-blue-500 hover:underline ml-1"
              >
                Đăng ký
              </button>
            </div>

            <button
              onClick={() => {
                setIsLoginOpen(false);
                setError("");
              }}
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}


      {/* MODAL ĐĂNG KÝ */}
      {isRegisterOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setIsRegisterOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            <h2 className="text-xl font-bold text-center text-blue-600 mb-2">
              Đăng ký
            </h2>

            <p className="text-center text-gray-600 mb-4 text-sm">
              Vui lòng nhập thông tin có dấu <span className="text-red-500">*</span> để tạo tài khoản mới.
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm" role="alert">
                {error}
              </div>
            )}

            {!error && successful && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 text-sm" role="alert">
                Đăng ký thành công! Vui lòng đăng nhập.
              </div>
            )}
              {/* Tên người dùng */}
              <div>
                <label className="font-medium text-gray-700">
                  Tên người dùng <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Nhập tên người dùng"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tài khoản */}
              <div>
                <label className="font-medium text-gray-700">
                  Tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Nhập tài khoản của bạn có ít nhất 6 ký tự"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="font-medium text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Nhập mật khẩu của bạn có ít nhất 6 ký tự"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Nhập lại mật khẩu */}
              <div>
                <label className="font-medium text-gray-700">
                  Nhập lại mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-medium text-gray-700">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="font-medium text-gray-700">Số điện thoại</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="text"
                  placeholder="Số điện thoại"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Checkbox điều khoản */}
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-600">
                  Tôi đồng ý với{" "}
                  <Link to="/terms" className="text-blue-500 hover:underline">
                    điều khoản sử dụng
                  </Link>
                </label>
            </div>

            {/* Nút đăng ký */}
            <button
              onClick={register}
              disabled={!agree}
              className={`w-full mt-5 py-2 rounded-lg font-semibold transition duration-200 ${
                agree ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Đăng ký
            </button>
            {/* Chuyển sang đăng nhập */}
            <div className="text-center mt-3 text-sm text-gray-600">
              Đã có tài khoản?
              <button
                onClick={() => {
                  setIsRegisterOpen(false);
                  setIsLoginOpen(true);
                  setError("");
                }}
                className="text-blue-500 hover:underline ml-1"
              >
                Đăng nhập
              </button>
            </div>

            {/* Nút đóng */}
            <button
              onClick={() => {
                setIsRegisterOpen(false);
                setError("");
              }}
              className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white p-4 w-full text-center">
        <p>&copy; 2025 SFARM. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;