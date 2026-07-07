import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import api from "@/api/axiosInstance";

import AuthLayout from "@/components/auth/AuthLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==================================================
  // Function untuk Register - (POST /auth/register)
  // ==================================================
  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // 1. Kirim request register ke backend
      await api.post("/auth/register", formData);

      // 2. Tampilkan toast sukses dan arahkan ke login
      toast.success("Akun berhasil didaftarkan! Silakan masuk.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Terjadi kesalahan saat registrasi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      description="Buat akun dan mulai simpan resep favoritmu."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-semibold text-nomi-orange hover:underline"
          >
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label>Nama Lengkap</Label>

          <Input
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="h-11 rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>

          <Input
            name="email"
            type="email"
            placeholder="nama@email.com"
            value={formData.email}
            onChange={handleChange}
            className="h-11 rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>

          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="h-11 rounded-xl pr-12"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-nomi-teal hover:bg-nomi-teal/90"
        >
          {loading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
