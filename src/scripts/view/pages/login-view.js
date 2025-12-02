class LoginView {
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
            <div class="auth-container">
              <div class="auth-card apple">
                <div class="auth-header">
                  <h2 class="auth-title">Masuk ke Akun Anda</h2>
                  <p class="auth-subtitle">Bagikan cerita dan jelajahi peta interaktif</p>
                </div>
                
                <form id="loginForm">
                  <div class="form-group">
                    <label for="email">Email</label>
                    <div class="input-wrapper">
                      <input type="email" id="email" name="email" required placeholder="Email Anda">
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="password">Password</label>
                    <div class="input-wrapper">
                      <input type="password" id="password" name="password" required placeholder="Password">
                    </div>
                  </div>
                  
                  <button type="submit" id="loginButton" class="btn-primary-apple">
                    <span class="button-text">Masuk</span>
                    <div class="loader-container">
                      <div class="loader"></div>
                    </div>
                  </button>
                </form>
                
                <div class="auth-footer">
                  <p>Belum punya akun? <a href="#/daftar" class="auth-link">Daftar Sekarang</a></p>
                </div>
              </div>
            </div>
          </section>

          <div id="alertContainer"></div>
        `;
        
        if (!document.getElementById('appleAuthStyles')) {
          this._addAuthStyles();
        }

        this._initListeners();
    }

    _addAuthStyles() {
        const style = document.createElement('style');
        style.id = 'appleAuthStyles';
        style.textContent = `
            :root {
              --apple-primary: #007aff;
              --apple-bg: #ffffff;
              --apple-border: #d2d2d7;
              --apple-muted: #6e6e73;
              --apple-dark: #1d1d1f;
            }

            .auth-section {
              padding: 4rem 1.5rem;
              display: flex;
              justify-content: center;
              background: #f5f5f7;
            }

            .auth-container {
              width: 100%;
              max-width: 420px;
            }

            .auth-card.apple {
              background: var(--apple-bg);
              border-radius: 22px;
              padding: 2.6rem;
              border: 1px solid rgba(0,0,0,0.04);
              box-shadow: 0 6px 20px rgba(0,0,0,0.06);
            }

            .auth-header {
              text-align: center;
              margin-bottom: 2rem;
            }

            .auth-title {
              font-size: 1.85rem;
              color: var(--apple-dark);
              font-weight: 600;
              margin-bottom: .3rem;
            }

            .auth-subtitle {
              font-size: 0.93rem;
              color: var(--apple-muted);
            }

            label {
              font-size: 0.88rem;
              color: var(--apple-dark);
              font-weight: 500;
            }

            .form-group {
              margin-bottom: 1.4rem;
            }

            .input-wrapper input {
              width: 100%;
              padding: 0.78rem 1rem;
              border-radius: 12px;
              border: 1px solid var(--apple-border);
              background: #fafafa;
              font-size: 0.95rem;
              transition: 0.25s;
            }

            .input-wrapper input:focus {
              background: #fff;
              border-color: var(--apple-primary);
              box-shadow: 0 0 0 4px rgba(0,122,255,0.18);
              outline: none;
            }

            .btn-primary-apple {
              width: 100%;
              padding: 0.88rem;
              margin-top: 0.5rem;
              border: none;
              border-radius: 14px;
              font-size: 1rem;
              font-weight: 600;
              color: #fff;
              background: linear-gradient(135deg, #007aff, #005ecb);
              cursor: pointer;
              transition: 0.25s;
              position: relative;
            }

            .btn-primary-apple:hover {
              transform: translateY(-1px);
              box-shadow: 0 6px 18px rgba(0,122,255,0.25);
            }

            .btn-loading .button-text {
              visibility: hidden;
            }

            .loader-container {
                display: none;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .btn-loading .loader-container {
                display: block;
            }

            .loader {
                border: 3px solid rgba(255,255,255,0.3);
                border-top: 3px solid #fff;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .auth-footer {
              text-align: center;
              margin-top: 1.6rem;
              font-size: 0.92rem;
            }

            .auth-link {
              color: var(--apple-primary);
              font-weight: 500;
              text-decoration: none;
            }

            .auth-link:hover {
              text-decoration: underline;
            }

            /* Alert Apple Style */
            .alert {
              position: fixed;
              top: 85px;
              left: 50%;
              transform: translateX(-50%);
              padding: 13px 22px;
              border-radius: 14px;
              font-size: 0.95rem;
              animation: fadeInDown 0.35s ease-out;
              box-shadow: 0 12px 30px rgba(0,0,0,0.12);
              z-index: 9999;
            }

            .alert-danger {
              background: #ff3b30;
              color: white;
            }

            .alert-success {
              background: #34c759;
              color: white;
            }

            @keyframes fadeInDown {
              from { opacity: 0; transform: translate(-50%, -15px); }
              to { opacity: 1; transform: translate(-50%, 0); }
            }
        `;
        document.head.appendChild(style);
    }

    _initListeners() {
        const loginForm = document.querySelector('#loginForm');
        if (loginForm) {
            const newLoginForm = loginForm.cloneNode(true);
            loginForm.parentNode.replaceChild(newLoginForm, loginForm);
            
            newLoginForm.addEventListener('submit', (event) => {
                event.preventDefault();
                
                if (this.presenter) {
                    const email = document.querySelector('#email').value;
                    const password = document.querySelector('#password').value;
                    this.presenter.onLoginSubmit(email, password);
                } else {
                    this.showAlert('Terjadi kesalahan sistem');
                }
            });
        }

        setTimeout(() => {
            const registerLink = document.querySelector('a[href="#/daftar"]');
            if (registerLink) {
                registerLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (this.presenter) {
                        this.presenter.navigateToRegister();
                    }
                });
            }
        }, 150);
    }

    validateForm(email, password) {
        if (!email || !password) {
            this.showAlert('Email dan password wajib diisi!');
            return false;
        }
        return true;
    }

    showLoading(isLoading) {
        const button = document.getElementById('loginButton');
        if (isLoading) {
            button.classList.add('btn-loading');
            button.disabled = true;
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
        }
    }

    showAlert(message) {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;

        const existing = document.querySelector('.alert');
        if (existing) existing.remove();

        const alert = document.createElement('div');
        alert.className = 'alert alert-danger';
        alert.innerHTML = `${message}`;
        
        alertContainer.appendChild(alert);

        setTimeout(() => {
          alert.style.opacity = 0;
          alert.style.transition = "opacity .4s";
          setTimeout(() => alert.remove(), 400);
        }, 2600);
    }

    showSuccess(message) {
        this.showLoading(false);

        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;

        const existing = document.querySelector('.alert');
        if (existing) existing.remove();

        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.innerHTML = `${message}`;
        
        alertContainer.appendChild(alert);

        setTimeout(() => {
          alert.style.opacity = 0;
          alert.style.transition = "opacity .4s";
          setTimeout(() => alert.remove(), 400);
        }, 1800);
    }

    scheduleNavigation(callback, delay = 1000) {
        setTimeout(callback, delay);
    }

    dispatchAuthChange() {
        window.dispatchEvent(new Event('authChanged'));
    }
}

window.LoginView = LoginView;
