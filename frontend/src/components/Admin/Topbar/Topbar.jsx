import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, MessageSquare, ChevronDown, Home, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./Topbar.module.css";

export function Topbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.search}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Cari kendaraan, pelanggan, transaksi..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn}>
          <MessageSquare size={20} />
          <span className={styles.badge}>3</span>
        </button>

        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.badge}>5</span>
        </button>

        {/* PROFILE */}
        <div className={styles.profileWrapper} ref={dropdownRef}>
          <div
            className={styles.profile}
            onClick={() => setOpen(!open)}
          >
            <div className={styles.avatar}>AD</div>

            <div className={styles.userInfo}>
              <span className={styles.userName}>Admin Utama</span>
              <span className={styles.userRole}>Super Admin</span>
            </div>

            <ChevronDown size={18} />
          </div>

          {open && (
            <div className={styles.dropdown}>

              <button onClick={() => navigate("/")}>
                <Home size={18} />
                Landing Page
              </button>

              <button onClick={() => navigate("/admin/profile")}>
                <User size={18} />
                Profile
              </button>

              <button onClick={() => navigate("/admin/settings")}>
                <Settings size={18} />
                Pengaturan
              </button>

              <hr />

              <button
                className={styles.logout}
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}