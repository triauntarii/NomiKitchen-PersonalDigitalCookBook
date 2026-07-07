import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import nomiIcon from "@/assets/NomiKitchen_Icon.png";
import nomiMascot from "@/assets/Nomi_Mascot.png";

export default function AuthLayout({
  title,
  description,
  children,
  footer,
}) {
  const location = useLocation();
  const showBackButton = location.pathname === "/register";

  return (
    <div className="min-h-screen bg-nomi-cream text-nomi-brown flex flex-col font-sans">
      {/* ================================================== */}
      {/* Layout Tampilan Mobile (Lebar di Bawah lg Breakpoint) */}
      {/* ================================================== */}
      <div className="lg:hidden flex flex-col min-h-screen bg-nomi-cream">
        {/* Header Atas dengan Gradasi Linear Khas Nomi */}
        <div className="flex flex-col items-center justify-center pt-14 pb-8 relative shrink-0 bg-linear-to-br from-nomi-orange/15 via-nomi-mustard/10 to-nomi-teal/5 border-b border-nomi-orange/10">
          {/* Tombol Kembali (Hanya muncul di halaman registrasi) */}
          {showBackButton && (
            <Link
              to="/login"
              className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-nomi-brown shadow-md border border-nomi-brown/10 hover:bg-white transition-colors z-20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}

          <img
            src={nomiIcon}
            alt="Nomi Kitchen Logo"
            className="h-16 w-16 rounded-2xl object-cover shadow-md border border-nomi-orange/10 bg-white"
          />
          <h1 className="text-2.5xl font-heading font-black text-nomi-brown mt-3 tracking-tight">
            Nomi Kitchen
          </h1>
          <p className="text-[10px] text-nomi-orange font-bold uppercase tracking-wider mt-0.5">
            nomi your cooking buddy
          </p>
        </div>

        {/* Sektor Kartu Form Input (Melayang dari bawah) */}
        <div className="flex-1 bg-white rounded-t-[2.5rem] px-6 pt-8 pb-10 shadow-2xl flex flex-col justify-between -mt-6 relative z-10">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-nomi-brown leading-none">
                {title}
              </h2>
              <p className="mt-2.5 text-xs text-muted-foreground">
                {description}
              </p>
            </div>
            {children}
          </div>

          <div className="mt-8 text-center text-sm font-medium">
            {footer}
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Layout Tampilan Desktop (Lebar di Breakpoint lg Ke Atas) */}
      {/* ================================================== */}
      <div className="hidden lg:grid min-h-screen grid-cols-2 bg-linear-to-br from-nomi-orange/15 via-nomi-mustard/10 to-nomi-teal/5">
        {/* Kolom Kiri: Maskot Nomi & Slogan Brand (Latar Gradasi Khas) */}
        <div className="flex flex-col justify-between p-12 text-nomi-brown relative overflow-hidden border-r border-nomi-orange/10 bg-transparent">
          {/* Header Brand Logo */}
          <div className="flex items-center gap-3">
            <img
              src={nomiIcon}
              alt="Nomi Kitchen Logo"
              className="h-10 w-10 rounded-xl object-cover shadow border border-nomi-orange/10 bg-white"
            />
            <div>
              <h1 className="text-xl font-heading font-black text-nomi-brown tracking-tight leading-none">
                Nomi Kitchen
              </h1>
              <p className="text-[9px] text-nomi-orange font-bold uppercase tracking-wide mt-0.5 leading-none">
                nomi your cooking buddy
              </p>
            </div>
          </div>

          {/* Ilustrasi Maskot Centered Nomi */}
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="h-72 w-auto max-w-full drop-shadow-xl hover:scale-103 transition-transform duration-300">
              <img
                src={nomiMascot}
                alt="Nomi Mascot"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="text-center space-y-2 max-w-sm">
              <h2 className="text-3xl font-heading font-black text-nomi-brown">Mari Memasak!</h2>
              <p className="text-sm text-nomi-brown/95 leading-relaxed font-semibold">
                Temukan resep baru, catat kreasi masakanmu, dan rasakan asyiknya ditemani Nomi di dapur.
              </p>
            </div>
          </div>

          {/* Footer Hak Cipta */}
          <div className="text-xs text-nomi-brown/65">
            © 2026 Nomi Kitchen
          </div>
        </div>

        {/* Kolom Kanan: Container Form Masuk/Daftar */}
        <div className="flex items-center justify-center p-12 bg-transparent">
          <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-nomi-brown/5 shadow-md space-y-6">
            <div>
              <h2 className="text-2.5xl font-heading font-bold text-nomi-brown leading-tight">
                {title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
            {children}
            <div className="text-center text-xs text-muted-foreground pt-2">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}