import { useState} from "react";
import { handleLogin, handleRegister} from "../api/auth"; 
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userRegister, setUserRegister] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
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
      handleLogin(newUser, dispatch, navigate);
    } catch (error) {
      console.error("Login failed:", error.message);
      setError(error.message || "Đăng nhập thất bại!");
    }
  };

  // Xử lý đăng ký
  const register = (e) => {
    e.preventDefault();
    if (!name || !username || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
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
      handleRegister(newUser, dispatch, navigate);
      setUserRegister(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white p-4 w-full text-center">
        <p>&copy; 2024 Afsmart. All rights reserved.</p>
      </footer>

      {/* MODAL ĐĂNG NHẬP */}
      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsLoginOpen(false)}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-blue-600 text-center">Đăng nhập</h2>
            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Tài khoản" className="w-full p-2 border rounded mt-3" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mật khẩu" className="w-full p-2 border rounded mt-3" />
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            <button onClick={login} className="w-full bg-blue-600 text-white p-2 rounded mt-3">Đăng nhập</button>
            <p className="text-center mt-3">Chưa có tài khoản? 
              <button onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); setError("");}} className="text-blue-500 ml-2">Đăng ký</button>
            </p>
            <button onClick={() => {setIsLoginOpen(false); setError("");}} className="w-full bg-red-500 text-white p-2 rounded mt-3">Đóng</button>
          </div>
        </div>
      )}

      {/* MODAL ĐĂNG KÝ */}
      {isRegisterOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsRegisterOpen(false)}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-blue-600 text-center">Đăng ký</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Tên người dùng" className="w-full p-2 border rounded mt-3" />
            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Tài khoản" className="w-full p-2 border rounded mt-3" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mật khẩu" className="w-full p-2 border rounded mt-3" />
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Nhập lại mật khẩu" className="w-full p-2 border rounded mt-3" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full p-2 border rounded mt-3" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" placeholder="Số điện thoại" className="w-full p-2 border rounded mt-3" />
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            <button onClick={register} className="w-full bg-blue-600 text-white p-2 rounded mt-3">Đăng ký</button>
            <p className="text-center mt-3">Đã có tài khoản? 
              <button onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); setError("");}} className="text-blue-500 ml-2">Đăng nhập</button>
            </p>
            <button onClick={() => {setIsRegisterOpen(false); setError("");}} className="w-full bg-red-500 text-white p-2 rounded mt-3">Đóng</button>
          </div>
        </div>
      )}

      {/* Thông báo đăng ký thành công */}
      {userRegister && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold text-blue-600">Đăng ký thành công!</h2>
            <button onClick={() => {setUserRegister(false); setError("");}} className="w-full bg-blue-600 text-white p-2 rounded mt-3">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;