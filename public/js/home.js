document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login");
    const registerBtn = document.getElementById("register");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const closeButtons = document.querySelectorAll(".close-button");
    
    const usernameLoginInput = document.getElementById("login-username");
    const passwordLoginInput = document.getElementById("login-password");

    const fullnameRegisterInput = document.getElementById("fullname");
    const usernameRegisterInput = document.getElementById("register-username");
    const passwordRegisterInput = document.getElementById("register-password");
    const confirmPasswordRegisterInput = document.getElementById("confirm-password");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");

    const loginErrorMessage = document.getElementById("login-error-message");
    const registerErrorMessage = document.getElementById("register-error-message");

    const submitLoginButton = document.getElementById("submit-login-btn");
    const submitRegisterButton = document.getElementById("submit-register-btn");

    // Hiển thị form
    const showForm = (form) => {
        loginForm.classList.remove("show");
        registerForm.classList.remove("show");
        form.classList.add("show");
    };

    // Ẩn form
    const hideForm = () => {
        loginForm.classList.remove("show");
        registerForm.classList.remove("show");
    };

    // Mở form login
    loginBtn.addEventListener("click", (event) => {
        event.preventDefault();
        showForm(loginForm);
    });

    // Mở form register
    registerBtn.addEventListener("click", (event) => {
        event.preventDefault();
        showForm(registerForm);
    });

    // Đóng form khi nhấn nút đóng
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            hideForm();
            loginErrorMessage.textContent = "";
            registerErrorMessage.textContent = "";
        });
    });

    // Đóng form khi nhấn bên ngoài
    window.addEventListener("click", (event) => {
        if (event.target === loginForm || event.target === registerForm) {
            hideForm();
            loginErrorMessage.textContent = "";
            registerErrorMessage.textContent = "";
        }
    });

    // Chuyển từ đăng ký sang đăng nhập
    document.getElementById("login-btn").addEventListener("click", () => {
        showForm(loginForm);
        registerErrorMessage.textContent = "";
    });

    // Chuyển từ đăng nhập sang đăng ký
    document.getElementById("register-btn").addEventListener("click", () => {
        showForm(registerForm);
        loginErrorMessage.textContent = "";
    });

    // Xử lý đăng nhập
    submitLoginButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const username = usernameLoginInput.value.trim();
        const password = passwordLoginInput.value.trim();

        if (username === "" || password === "") {
            loginErrorMessage.textContent = "Vui lòng điền đầy đủ thông tin!";
            return;
        }

        // Gửi yêu cầu đăng nhập (giả lập)
        console.log("Đăng nhập với:", username, password);
    });

    // Xử lý đăng ký
    submitRegisterButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const fullname = fullnameRegisterInput.value.trim();
        const username = usernameRegisterInput.value.trim();
        const password = passwordRegisterInput.value.trim();
        const confirmPassword = confirmPasswordRegisterInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        // Kiểm tra thông tin hợp lệ
        if (!fullname || !username || !password || !confirmPassword || !email || !phone) {
            registerErrorMessage.textContent = "Vui lòng điền đầy đủ thông tin!";
            return;
        }

        if (password !== confirmPassword) {
            registerErrorMessage.textContent = "Mật khẩu không khớp!";
            return;
        }

        if (!/^\d{9,11}$/.test(phone)) {
            registerErrorMessage.textContent = "Số điện thoại không hợp lệ (phải từ 9-11 chữ số)!";
            return;
        }

        // Gửi yêu cầu đăng ký (giả lập)
        console.log("Đăng ký với:", fullname, username, password, email, phone);
    });
});
