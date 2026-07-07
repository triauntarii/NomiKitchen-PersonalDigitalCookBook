import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import nomiIcon from "@/assets/NomiKitchen_Icon.png";
import nomiSadImg from "@/assets/Nomi_Sad.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  // ==================================================
  // Effect untuk Sinkronisasi Data Profil Pengguna
  // ==================================================
  useEffect(() => {
    // 1. Ambil data profil terbaru dari backend
    api.get("/profile")
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        // 2. Gunakan data lokal di localStorage jika request gagal
      });
  }, [location.pathname]);

  const triggerLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // ==================================================
  // Helper untuk mendapatkan inisial nama
  // ==================================================
  const getInitials = (name) => {
    if (!name) return "N";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // ==================================================
  // Helper untuk resolve URL foto profil
  // ==================================================
  const getAvatarUrl = (path) => {
    if (!path) return null;
    return `http://localhost:5000/uploads/${path}`;
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-nomi-brown/10 bg-nomi-cream/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              {/* Logo Utama Aplikasi */}
              <Link to="/dashboard" className="flex shrink-0 items-center gap-2">
                <img src={nomiIcon} alt="Nomi Kitchen Logo" className="h-10 w-10 rounded-xl object-cover shadow-md" />
                <div className="flex flex-col">
                  <span className="font-heading text-xl font-bold tracking-tight text-nomi-brown">
                    Nomi Kitchen
                  </span>
                  <span className="hidden xs:inline text-[9.5px] italic text-nomi-orange font-medium -mt-1">
                    Nom Nom Nom, nomi your cooking buddy
                  </span>
                </div>
              </Link>
            </div>

            {/* Menu Profil & Tombol Keluar (Tampilan Desktop) */}
            <div className="hidden md:flex md:items-center md:gap-4">
              <Link
                to="/profile"
                className={`flex items-center gap-2 rounded-xl border border-nomi-brown/10 p-1.5 pr-3 transition-all hover:bg-white/40 ${
                  isActive("/profile") ? "bg-white/60 border-nomi-orange/40" : ""
                }`}
              >
                {user?.profilePic ? (
                  <img
                    src={getAvatarUrl(user.profilePic)}
                    alt={user.name}
                    className="h-7 w-7 rounded-lg object-cover border border-nomi-brown/5"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "";
                    }}
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-nomi-orange/15 text-xs font-semibold text-nomi-orange">
                    {getInitials(user?.name)}
                  </div>
                )}
                <span className="text-xs font-medium text-nomi-brown">
                  {user?.name || "Koki Nomi"}
                </span>
              </Link>

              <button
                onClick={triggerLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-nomi-brown/70 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                title="Keluar"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            {/* Tombol Menu Hamburger (Tampilan Mobile) */}
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-nomi-brown/75 hover:bg-nomi-brown/5 hover:text-nomi-brown transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Panel Menu Samping (Tampilan Mobile) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-nomi-brown/5 bg-nomi-cream px-2 py-3 space-y-1 shadow-inner">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                isActive("/profile")
                  ? "bg-nomi-orange/10 text-nomi-orange"
                  : "text-nomi-brown/85 hover:bg-nomi-brown/5"
              }`}
            >
              {user?.profilePic ? (
                <img
                  src={getAvatarUrl(user.profilePic)}
                  alt={user.name}
                  className="h-8 w-8 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-nomi-orange/10 text-sm font-semibold text-nomi-orange">
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none">
                  {user?.name}
                </span>
                <span className="text-xs text-nomi-brown/60 mt-1">
                  Kelola Profil
                </span>
              </div>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                triggerLogout();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-base font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              Keluar
            </button>
          </div>
        )}
      </nav>

      {/* Modal Dialog Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-nomi-brown/10 bg-nomi-cream p-6 shadow-xl text-center space-y-6 flex flex-col items-center">
            <img src={nomiSadImg} alt="Nomi Sad" className="h-28 w-auto object-contain" />
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-bold text-nomi-brown">Yakin Mau Pergi?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nomi bakal kangen sama kreasi masakanmu yang lezat. Tetap di sini saja yuk?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => setShowLogoutConfirm(false)}
                variant="outline"
                className="flex-1 rounded-xl border-nomi-brown/15 bg-white/60 text-nomi-brown font-semibold hover:bg-white cursor-pointer h-10.5 text-xs"
              >
                Batal (Tetap Masak)
              </Button>
              <Button
                onClick={confirmLogout}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md cursor-pointer h-10.5 text-xs"
              >
                Ya, Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
