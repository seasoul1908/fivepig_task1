import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="app">
      <Header />

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer__grid">
          <div>
            <h3>FivePigs Store</h3>
            <p>Modern fashion for the youth</p>
          </div>

          <div>
            <h3>Contact</h3>
            <p>Email: support@fivepigs.com</p>
            <p>Hotline: 1900-xxxx</p>
          </div>

          <div>
            <h3>Policies</h3>
            <p>Return Policy</p>
            <p>Privacy Policy</p>
          </div>
        </div>

        <div className="container footer__bottom">
          © 2026 FivePigs Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
}