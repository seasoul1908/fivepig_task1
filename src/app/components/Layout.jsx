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
            <p>Thời trang hiện đại cho giới trẻ</p>
          </div>

          <div>
            <h3>Liên hệ</h3>
            <p>Email: support@fivepigs.com</p>
            <p>Hotline: 1900-xxxx</p>
          </div>

          <div>
            <h3>Chính sách</h3>
            <p>Chính sách đổi trả</p>
            <p>Chính sách bảo mật</p>
          </div>
        </div>

        <div className="container footer__bottom">
          © 2026 FivePigs Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
}