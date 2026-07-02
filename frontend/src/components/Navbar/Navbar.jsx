import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDecodedToken, isAuthenticated } from "../../utils/api";
import styles from "./Navbar.module.css";

export function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = isAuthenticated();
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const decoded = getDecodedToken();
        setIsAdmin(decoded?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);

    return () =>
      document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem("token");

      setIsLoggedIn(false);
      setIsAdmin(false);

      navigate("/");
    }
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <Link
          to="/"
          className={styles.logo}
          style={{ textDecoration: "none" }}
        >
          AJ <span className={styles.logoText}>Rental</span>
        </Link>

        <nav className={styles.nav}>
          <ul className={styles.navLinks}>
            <li>
              <Link to="/" className={styles.navLink}>
                Home
              </Link>
            </li>

            <li>
              <Link to="/catalog" className={styles.navLink}>
                Katalog
              </Link>
            </li>

            {isLoggedIn && !isAdmin && (
              <li>
                <Link to="/history" className={styles.navLink}>
                  Riwayat
                </Link>
              </li>
            )}
          </ul>

          <div className={styles.authButtons}>
            {!isLoggedIn ? (
              <>
                <Link to="/login" className={styles.btnLogin}>
                  Login
                </Link>

                <Link to="/register" className={styles.btnRegister}>
                  Register
                </Link>
              </>
            ) : isAdmin ? (
              <div
                className={styles.adminDropdown}
                ref={dropdownRef}
              >
                <button
                  className={styles.btnLogin}
                  onClick={() =>
                    setShowDropdown(!showDropdown)
                  }
                >
                  Admin ▼
                </button>

                {showDropdown && (
                  <div className={styles.dropdownMenu}>
                    <Link
                      to="/admin"
                      className={styles.dropdownItem}
                      onClick={() => setShowDropdown(false)}
                    >
                      Dashboard Admin
                    </Link>

                    <button
                      className={styles.dropdownLogout}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/profile"
                  className={styles.btnLogin}
                >
                  Profil
                </Link>

                <button
                  onClick={handleLogout}
                  className={styles.btnRegister}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;