class RegisterView {
    constructor() {
        this.container = document.querySelector('#mainContent');
        this.presenter = null;
    }

    setPresenter(presenter) {
        this.presenter = presenter;
    }

    render() {
        this.container.innerHTML = `
        <section class="auth-section">
            <div class="auth-wrapper">
                <div class="auth-card sleek">
                    
                    <div class="auth-header">
                        <h2 class="auth-title">Daftar Akun</h2>
                        <p class="auth-subtitle">Mulai berbagi cerita Anda</p>
                    </div>

                    <form id="registerForm" class="auth-form">

                        <div class="form-group">
                            <label>Nama</label>
                            <input type="text" id="name" placeholder="Nama lengkap" required>
                        </div>

                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="email" placeholder="Email aktif" required>
                        </div>

                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="password" placeholder="Minimal 8 karakter" minlength="8" required>
                        </div>

                        <button type="submit" id="registerButton" class="auth-button">
                            <span class="btn-text">Daftar</span>
                            <div class="loader"></div>
                        </button>
                    </form>

                    <div class="auth-footer">
                        <p>Sudah punya akun?
                            <a href="#/masuk" class="link-login" data-link>Masuk</a>
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <div id="alertContainer"></div>
        `;

        this._injectStyles();
        this._initListeners();
    }

    _injectStyles() {
        if (document.getElementById("registerStyles")) return;

        const s = document.createElement("style");
        s.id = "registerStyles";
        s.textContent = `

        /* --- WRAPPER --- */
        .auth-section {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 60px 20px;
        }

        .auth-wrapper {
            width: 100%;
            max-width: 420px;
        }

        /* --- CARD STYLE (Apple/Google clean) --- */
        .auth-card.sleek {
            background: #fff;
            border-radius: 18px;
            padding: 32px;
            box-shadow: 0 8px 28px rgba(0,0,0,0.08);
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* --- HEADER --- */
        .auth-title {
            margin: 0;
            font-size: 26px;
            font-weight: 600;
            color: #111;
            text-align: center;
        }

        .auth-subtitle {
            margin-top: 8px;
            text-align: center;
            color: #666;
            font-size: 15px;
        }

        /* --- FORM INPUT --- */
        .form-group {
            margin-top: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 6px;
            color: #444;
            font-size: 14px;
            font-weight: 500;
        }

        .form-group input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 10px;
            border: 1px solid #d0d0d0;
            background: #fafafa;
            font-size: 15px;
            transition: all .2s ease;
        }

        .form-group input:focus {
            border-color: #007aff;
            background: #fff;
            outline: none;
            box-shadow: 0 0 0 4px rgba(0,122,255,0.12);
        }

        /* --- BUTTON --- */
        .auth-button {
            width: 100%;
            margin-top: 28px;
            padding: 12px;
            border: none;
            background: #007aff;
            color: #fff;
            font-size: 16px;
            border-radius: 10px;
            cursor: pointer;
            position: relative;
            transition: 0.2s ease;
            font-weight: 600;
        }

        .auth-button:active {
            transform: scale(.97);
        }

        .auth-button.disabled,
        .auth-button.btn-loading {
            pointer-events: none;
            opacity: .7;
        }

        /* --- LOADING INDICATOR --- */
        .loader {
            display: none;
            width: 18px;
            height: 18px;
            border: 3px solid rgba(255,255,255,.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .auth-button.btn-loading .btn-text {
            visibility: hidden;
        }

        .auth-button.btn-loading .loader {
            display: block;
        }

        /* --- FOOTER --- */
        .auth-footer {
            text-align: center;
            margin-top: 24px;
            color: #555;
        }

        .auth-footer .link-login {
            color: #007aff;
            font-weight: 600;
            text-decoration: none;
        }

        .auth-footer .link-login:hover {
            text-decoration: underline;
        }

        /* --- ALERT --- */
        .alert {
            position: fixed;
            top: 90px;
            left: 50%;
            transform: translateX(-50%);
            padding: 14px 22px;
            border-radius: 10px;
            color: #fff;
            z-index: 9999;
            box-shadow: 0 6px 18px rgba(0,0,0,0.18);
            font-size: 15px;
            transition: .4s ease;
        }

        .alert-success { background: #34c759; }
        .alert-danger { background: #ff3b30; }

        `;
        document.head.appendChild(s);
    }

    _initListeners() {
        const form = document.querySelector("#registerForm");

        const newForm = form.cloneNode(true);
        form.replaceWith(newForm);

        newForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = newForm.querySelector("#name").value.trim();
            const email = newForm.querySelector("#email").value.trim();
            const password = newForm.querySelector("#password").value.trim();

            if (this.presenter) {
                this.presenter.onRegisterSubmit(name, email, password);
            }
        });

        setTimeout(() => {
            const loginLink = document.querySelector('.link-login');
            if (loginLink && this.presenter) {
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.presenter.navigateToLogin();
                });
            }
        }, 100);
    }

    showLoading(isLoading) {
        const btn = document.getElementById("registerButton");
        if (!btn) return;

        if (isLoading) {
            btn.classList.add("btn-loading");
        } else {
            btn.classList.remove("btn-loading");
        }
    }

    showAlert(message, type = "danger") {
        const container = document.getElementById("alertContainer");
        if (!container) return;

        const old = document.querySelector(".alert");
        if (old) old.remove();

        const div = document.createElement("div");
        div.className = `alert alert-${type}`;
        div.textContent = message;

        container.appendChild(div);

        setTimeout(() => {
            div.style.opacity = "0";
            setTimeout(() => div.remove(), 400);
        }, 2500);
    }

    showSuccess(message) {
        this.showLoading(false);
        this.showAlert(message, "success");
    }

    scheduleNavigation(callback, delay = 1000) {
        setTimeout(callback, delay);
    }
}

window.RegisterView = RegisterView;
console.log("RegisterView loaded");
