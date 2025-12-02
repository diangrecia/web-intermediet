// src/scripts/components/footer.js - Dark Navy Premium Footer

class Footer {
  constructor() {
    this.render();
  }

  render() {
    const footerElement = document.querySelector("footer");

    if (!footerElement) return;

    footerElement.innerHTML = `
      <div class="footer-wrapper">

        <div class="footer-content">

          <!-- Brand -->
          <div class="footer-brand">
            <h2 class="footer-logo">Story<span>App</span></h2>
            <p class="footer-tagline">Share your moments. Simply and beautifully.</p>

            <div class="footer-social">
  <a href="https://github.com/diangrecia" target="_blank" rel="noopener">
    <i class="fab fa-github"></i>
  </a>

  <a href="https://www.linkedin.com/in/dian-grecia-634b6a34b/" target="_blank" rel="noopener">
    <i class="fab fa-linkedin"></i>
  </a>

  <a href="https://instagram.com/dian_grecia" target="_blank" rel="noopener">
    <i class="fab fa-instagram"></i>
  </a>

  <a href="mailto:diangrecia17@gmail.com">
    <i class="fas fa-envelope"></i>
  </a>
</div>

          </div>

          <!-- Contact -->
          <div class="footer-contact-box">
            <ul class="footer-contact">
              <li><i class="fas fa-envelope"></i> info@storyapp.com</li>
              <li><i class="fas fa-phone"></i> +62 815 7293 6549</li>
              <li><i class="fas fa-map-marker-alt"></i> Jakarta, Indonesia</li>
            </ul>
          </div>

        </div>

        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} StoryApp — Developed by Dian Grecia</p>
          <div class="bottom-links">
            <a href="#/privacy">Privacy</a>
            <a href="#/terms">Terms</a>
            <a href="#/about">About</a>
          </div>
        </div>

      </div>
    `;

    this.addStyles();
  }

  addStyles() {
    if (document.getElementById("darkNavyFooter")) return;

    const style = document.createElement("style");
    style.id = "darkNavyFooter";

    style.textContent = `

      /* ========= DARK NAVY PREMIUM FOOTER ========= */

      .footer-wrapper {
        padding: 4rem 0 3.2rem;
        background: #0a1a3a; /* navy dongker pekat */
        color: #e5eaf3; /* soft white */
        font-family: -apple-system, BlinkMacSystemFont, Inter, Roboto, "Segoe UI", sans-serif;
        border-top: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 2px 20px rgba(0,0,0,0.35) inset;
      }

      .footer-content {
        max-width: 1180px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 3rem;
      }

      /* Brand Logo */
      .footer-logo {
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: -0.6px;
        margin: 0;
        color: #ffffff;
      }

      .footer-logo span {
        color: #4da8ff; /* biru neon soft */
      }

      /* Tagline */
      .footer-tagline {
        margin-top: 0.4rem;
        color: #b9c3d9;
      }

      /* Social Icons */
      .footer-social {
        display: flex;
        gap: 1rem;
        margin-top: 1.3rem;
      }

      .footer-social a {
        font-size: 1.25rem;
        color: #c7d2e8;
        padding: 0.45rem;
        border-radius: 10px;
        transition: 0.25s ease;
      }

      .footer-social a:hover {
        color: #4da8ff;
        background: rgba(77,168,255,0.15);
      }

      /* Contact */
      .footer-contact li {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.7rem;
        color: #d5d9e3;
      }

      .footer-contact i {
        color: #4da8ff;
      }

      /* Bottom Section */
      .footer-bottom {
        max-width: 1180px;
        margin: 3rem auto 0;
        padding: 2rem 2rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid rgba(255,255,255,0.12);
        color: #b9c3d9;
      }

      .bottom-links {
        display: flex;
        gap: 1.6rem;
      }

      .bottom-links a {
        text-decoration: none;
        color: #c4cde0;
        transition: 0.25s ease;
      }

      .bottom-links a:hover {
        color: #4da8ff;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .footer-content {
          flex-direction: column;
          text-align: center;
          align-items: center;
        }

        .footer-bottom {
          flex-direction: column;
          text-align: center;
          gap: 1rem;
        }
      }

    `;

    document.head.appendChild(style);
  }
}

new Footer();
