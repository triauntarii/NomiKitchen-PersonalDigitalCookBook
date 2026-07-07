import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-nomi-cream text-nomi-brown flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Outlet />
      </main>
      <footer className="py-6 border-t border-nomi-brown/5 bg-nomi-cream text-center text-xs text-nomi-brown/50">
        <p>© 2026 Nomi Kitchen — Nom Nom Nom, Nomi your cooking buddy</p>
      </footer>
    </div>
  );
}
