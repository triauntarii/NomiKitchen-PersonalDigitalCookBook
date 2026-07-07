import { useState, useEffect, useRef } from "react";
import { User, Mail, Lock, Calendar, BookOpen, Camera, Loader2, Save, Pencil } from "lucide-react";
import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function Profile() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recipeCount, setRecipeCount] = useState(0);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePic: "",
    createdAt: "",
  });

  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // ==================================================
  // Function untuk Fetch Profil & Statistik Resep
  // ==================================================
  const fetchProfileAndStats = async () => {
    try {
      const [profileRes, recipesRes] = await Promise.all([
        api.get("/profile"),
        api.get("/recipes"),
      ]);
      setProfile(profileRes.data);
      setRecipeCount(recipesRes.data.length);
    } catch {
      toast.error("Waduh, gagal memuat profilmu nih!");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // Effect untuk memuat data profil saat mounting
  // ==================================================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfileAndStats();
  }, []);

  // ==================================================
  // Function untuk Menangani Perubahan File Foto Profil
  // ==================================================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Fotonya kegedean! Maksimal 2MB ya");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // ==================================================
  // Function untuk Memperbarui Profil Koki (PUT /profile)
  // ==================================================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      if (password) {
        formData.append("password", password);
      }
      if (avatarFile) {
        formData.append("profilePic", avatarFile);
      }

      const res = await api.put("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profil berhasil diperbarui!");
      setPassword("");
      setAvatarFile(null);
      
      // 1. Update state lokal dan localStorage dengan data baru
      setProfile(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memperbarui profil koki");
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // Helper untuk mendapatkan inisial nama
  // ==================================================
  const getInitials = (name) => {
    if (!name) return "K";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // ==================================================
  // Helper untuk resolve URL foto profil dari backend
  // ==================================================
  const getAvatarUrl = (path) => {
    if (!path) return null;
    return `http://localhost:5000/uploads/${path}`;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-nomi-orange" />
        <p className="text-nomi-brown/65 text-sm font-semibold">Menyiapkan celemek memasakmu...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* ================================================== */}
      {/* Header Judul Halaman Ruang Masak */}
      {/* ================================================== */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nomi-brown font-heading">
          Ruang Masakku
        </h1>
        <p className="text-muted-foreground mt-1">
          Tempat rahasia buat ngatur identitas memasakmu dan lihat seberapa jago kamu di dapur!
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Kolom Kiri: Avatar & Info Singkat */}
        <div className="space-y-6 md:col-span-1">
          <Card className="border-nomi-brown/10 bg-white/70 backdrop-blur shadow-sm">
            <CardContent className="pt-6 text-center space-y-5">
              {/* Unggah Avatar Foto Profil */}
              <div className="relative mx-auto h-28 w-28 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="h-full w-full rounded-2xl overflow-hidden border border-nomi-brown/10 shadow relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="h-full w-full object-cover transition-all duration-300 group-hover:scale-108"
                    />
                  ) : profile.profilePic ? (
                    <img
                      src={getAvatarUrl(profile.profilePic)}
                      alt={profile.name}
                      className="h-full w-full object-cover transition-all duration-300 group-hover:scale-108"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-nomi-orange/10 text-3xl font-bold text-nomi-orange transition-all duration-300 group-hover:scale-108">
                      {getInitials(profile.name)}
                    </div>
                  )}
                  
                  {/* Overlay Hover Unggah */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="h-5 w-5" />
                  </div>
                </div>

                {/* Ikon Pensil Melayang */}
                <div className="absolute -bottom-1.5 -right-1.5 flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-nomi-teal text-white shadow-md border-2 border-white group-hover:bg-nomi-orange transition-colors duration-200">
                  <Pencil className="h-3.5 w-3.5" />
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-heading text-lg font-bold text-nomi-brown">
                  {profile.name}
                </h3>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
              </div>

              <div className="border-t border-nomi-brown/5 pt-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/40 border border-nomi-brown/5 shadow-2xs">
                  <div className="text-nomi-orange mb-1">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="text-lg font-bold text-nomi-brown">{recipeCount}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Resep</div>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/40 border border-nomi-brown/5 shadow-2xs">
                  <div className="text-nomi-teal mb-1">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="text-lg font-bold text-nomi-brown">
                    {new Date(profile.createdAt).getFullYear() || 2026}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Sejak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Form Ubah Data Diri */}
        <div className="md:col-span-2">
          <Card className="border-nomi-brown/10 bg-white/70 backdrop-blur shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-nomi-brown">Data Diri Koki</CardTitle>
              <CardDescription>Update info koki terhebat agar resepmu tetap aman sentosa.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-4">
                  {/* Input Nama Lengkap */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-nomi-brown font-medium">Nama Lengkap</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-nomi-brown/40" />
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        required
                        className="pl-10 h-10.5 rounded-xl border-nomi-brown/10 bg-white/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* ================================================== */}
                  {/* Input Email */}
                  {/* ================================================== */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-nomi-brown font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-nomi-brown/40" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        required
                        className="pl-10 h-10.5 rounded-xl border-nomi-brown/10 bg-white/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Input Kata Sandi Baru */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password" className="text-nomi-brown font-medium">Kata Sandi Baru</Label>
                      <span className="text-[11px] text-muted-foreground italic">Biarkan kosong jika tidak ingin diubah</span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-nomi-brown/40" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-10.5 rounded-xl border-nomi-brown/10 bg-white/50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-nomi-brown/5">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="h-11 px-6 rounded-xl bg-nomi-orange hover:bg-nomi-orange/90 text-white font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

