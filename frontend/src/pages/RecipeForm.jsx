import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Plus, Trash, ArrowLeft, Loader2, Save, Image as ImageIcon, Sparkles, PlusCircle } from "lucide-react";
import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function RecipeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // ==================================================
  // State Form Data & Foto
  // ==================================================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  
  // Photo States
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // ==================================================
  // Function untuk Menyimpan Kategori Default (Seeding)
  // ==================================================
  const seedDefaultCategories = async () => {
    const defaults = [
      { name: "Main Course", description: "Hidangan utama makan siang atau malam" },
      { name: "Dessert", description: "Makanan penutup manis dan lezat" },
      { name: "Beverage", description: "Minuman hangat atau segar" },
      { name: "Healthy", description: "Makanan sehat rendah kalori" },
      { name: "Budget Meal", description: "Bahan murah dan hemat dompet" },
      { name: "Quick & Easy", description: "Memasak kilat di bawah 20 menit" }
    ];

    try {
      // Seed secara paralel
      await Promise.all(
        defaults.map(cat => api.post("/categories", cat).catch(() => {}))
      );
      // Fetch ulang
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch {
      // Abaikan
    }
  };

  // ==================================================
  // Function untuk Mengambil Seluruh Kategori Masakan
  // ==================================================
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
      // Jika database categories kosong, seed otomatis atau arahkan
      if (res.data.length === 0) {
        await seedDefaultCategories();
      }
    } catch {
      toast.error("Gagal mengambil data kategori");
    }
  };

  // ==================================================
  // Function untuk Mengambil Detail Resep Masakan
  // ==================================================
  const fetchRecipeDetails = async () => {
    try {
      const res = await api.get(`/recipes/${id}`);
      const recipe = res.data;
      
      setTitle(recipe.title);
      setDescription(recipe.description || "");
      setCategoryId(recipe.categoryId ? recipe.categoryId.toString() : "");
      setExistingPhotos(recipe.photos || []);

      // Parse ingredients (split by newlines or parse JSON array)
      if (recipe.ingredients) {
        try {
          if (recipe.ingredients.startsWith("[")) {
            setIngredients(JSON.parse(recipe.ingredients));
          } else {
            setIngredients(recipe.ingredients.split("\n").filter(i => i.trim() !== ""));
          }
        } catch {
          setIngredients(recipe.ingredients.split("\n").filter(i => i.trim() !== ""));
        }
      }

      // Parse instructions
      if (recipe.instructions) {
        try {
          if (recipe.instructions.startsWith("[")) {
            setInstructions(JSON.parse(recipe.instructions));
          } else {
            setInstructions(recipe.instructions.split("\n").filter(i => i.trim() !== ""));
          }
        } catch {
          setInstructions(recipe.instructions.split("\n").filter(i => i.trim() !== ""));
        }
      }
    } catch {
      toast.error("Gagal memuat detail resep");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // Effect untuk memuat kategori & detail resep saat edit
  // ==================================================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
    if (isEditMode) {
      fetchRecipeDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ==================================================
  // Handler List Bahan Masakan secara Dinamis
  // ==================================================
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredientField = (index) => {
    if (ingredients.length === 1) {
      setIngredients([""]);
      return;
    }
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const addInstructionField = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstructionField = (index) => {
    if (instructions.length === 1) {
      setInstructions([""]);
      return;
    }
    const updated = instructions.filter((_, i) => i !== index);
    setInstructions(updated);
  };

  // ==================================================
  // Handler untuk Unggah Foto Resep Masakan
  // ==================================================
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validasi jumlah file
    if (files.length + selectedPhotos.length > 5) {
      toast.error("Maksimal 5 foto resep!");
      return;
    }

    const validFiles = [];
    const previews = [];

    files.forEach(file => {
      if (file.size > 3 * 1024 * 1024) {
        toast.error(`File ${file.name} terlalu besar! Maksimal 3MB`);
        return;
      }
      validFiles.push(file);
      previews.push({
        name: file.name,
        url: URL.createObjectURL(file)
      });
    });

    setSelectedPhotos([...selectedPhotos, ...validFiles]);
    setPhotoPreviews([...photoPreviews, ...previews]);
  };

  const removeSelectedPhoto = (index) => {
    const updatedFiles = selectedPhotos.filter((_, i) => i !== index);
    const updatedPreviews = photoPreviews.filter((_, i) => i !== index);
    setSelectedPhotos(updatedFiles);
    setPhotoPreviews(updatedPreviews);
  };

  // ==================================================
  // Function untuk Submit Resep - (POST /recipes atau PUT /recipes/:id)
  // ==================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi minimal field
    if (!title.trim()) {
      toast.error("Judul resep tidak boleh kosong!");
      return;
    }

    // Filter baris kosong
    const cleanedIngredients = ingredients.filter(i => i.trim() !== "");
    const cleanedInstructions = instructions.filter(i => i.trim() !== "");

    if (cleanedIngredients.length === 0) {
      toast.error("Harap tambahkan minimal 1 bahan!");
      return;
    }
    if (cleanedInstructions.length === 0) {
      toast.error("Harap tambahkan minimal 1 langkah instruksi!");
      return;
    }

    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("categoryId", categoryId);
      
      // Kirim sebagai string newline agar kompatibel dengan database backend
      formData.append("ingredients", cleanedIngredients.join("\n"));
      formData.append("instructions", cleanedInstructions.join("\n"));

      // Tambahkan foto resep
      selectedPhotos.forEach(photo => {
        formData.append("photos", photo);
      });

      if (isEditMode) {
        await api.put(`/recipes/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Resep berhasil diperbarui!");
      } else {
        await api.post("/recipes", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Resep baru berhasil dibuat!");
      }
      
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan resep");
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // Helper untuk URL Foto saat ini (Mode Edit)
  // ==================================================
  const getExistingPhotoUrl = (filename) => {
    return `http://localhost:5000/uploads/${filename}`;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-nomi-orange" />
        <p className="text-nomi-brown/60 text-sm font-medium">Memuat data resep...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ================================================== */}
      {/* Judul Halaman & Tombol Kembali */}
      {/* ================================================== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-nomi-brown/10 bg-white/60 text-nomi-brown/70 hover:bg-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-nomi-brown font-heading">
              {isEditMode ? "Edit Resep" : "Tambah Resep Baru"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isEditMode ? "Modifikasi detail resep masakan Anda." : "Bagikan resep kreasi Anda dengan langkah sederhana."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
        {/* Kolom Kiri: Informasi Utama & Foto Resep */}
        <div className="space-y-6 md:col-span-1">
          <Card className="border-nomi-brown/10 bg-white/70 backdrop-blur shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base text-nomi-brown flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-nomi-orange" /> Info Utama
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <Label htmlFor="title" className="text-xs font-semibold text-nomi-brown">Judul Resep</Label>
                <Input
                  id="title"
                  placeholder="Contoh: Nasi Goreng Gila Pedas"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="rounded-xl border-nomi-brown/10 bg-white/50 h-10"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <Label htmlFor="category" className="text-xs font-semibold text-nomi-brown">Kategori</Label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-nomi-brown/10 bg-white/50 px-3 py-2 text-sm text-nomi-brown focus:border-nomi-orange focus:outline-none focus:ring-1 focus:ring-nomi-orange h-10"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs font-semibold text-nomi-brown">Deskripsi Singkat</Label>
                <textarea
                  id="description"
                  placeholder="Ceritakan sedikit tentang keunikan masakan ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-nomi-brown/10 bg-white/50 px-3 py-2 text-sm text-nomi-brown focus:border-nomi-orange focus:outline-none focus:ring-1 focus:ring-nomi-orange"
                />
              </div>
            </CardContent>
          </Card>

          {/* Widget Unggah Foto Resep */}
          <Card className="border-nomi-brown/10 bg-white/70 backdrop-blur shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base text-nomi-brown flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-nomi-teal" /> Foto Masakan (Maks 5)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Photos Warning (Edit Mode) */}
              {isEditMode && existingPhotos.length > 0 && (
                <div className="rounded-lg bg-nomi-orange/5 border border-nomi-orange/10 p-2 text-[10px] leading-relaxed text-nomi-orange font-medium">
                  Mengunggah foto baru akan menggantikan foto lama resep ini.
                </div>
              )}

              {/* File Input */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-nomi-brown/20 rounded-xl cursor-pointer bg-white/30 hover:bg-white/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <Plus className="h-6 w-6 text-nomi-brown/50 mb-1" />
                    <p className="text-xs font-semibold text-nomi-brown/70">Pilih Foto Masakan</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG atau JPEG (Maks 3MB)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Previews (New uploads) */}
              {photoPreviews.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-nomi-teal">Foto Baru Siap Upload</p>
                  <div className="grid grid-cols-5 gap-2">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-nomi-teal/30">
                        <img
                          src={preview.url}
                          alt="preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedPhoto(index)}
                          className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 transition-colors"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Photos list (if edit and no new photos selected) */}
              {isEditMode && existingPhotos.length > 0 && selectedPhotos.length === 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-nomi-brown/60">Foto Saat Ini</p>
                  <div className="grid grid-cols-5 gap-2">
                    {existingPhotos.map((photo) => (
                      <div key={photo.id} className="aspect-square rounded-lg overflow-hidden border border-nomi-brown/10">
                        <img
                          src={getExistingPhotoUrl(photo.url)}
                          alt="existing"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Detail Bahan & Langkah Pembuatan */}
        <div className="space-y-6 md:col-span-2">
          {/* Form Input Bahan-Bahan */}
          <Card className="border-nomi-brown/10 bg-white/70 backdrop-blur shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-heading text-base text-nomi-brown">
                Bahan-Bahan
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredientField}
                className="h-8 rounded-lg border-nomi-orange text-nomi-orange hover:bg-nomi-orange/5 cursor-pointer text-xs font-semibold gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Tambah Bahan
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-nomi-brown/50 w-5 text-right">{index + 1}.</span>
                  <Input
                    placeholder="Contoh: 3 siung Bawang Putih, cincang halus"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    required
                    className="flex-1 rounded-xl border-nomi-brown/10 bg-white/50 h-9.5"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredientField(index)}
                    className="text-nomi-brown/40 hover:text-red-500 p-1.5 transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Form Input Langkah Pembuatan */}
          <Card className="border-nomi-brown/10 bg-white/70 backdrop-blur shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-heading text-base text-nomi-brown">
                Langkah Pembuatan
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addInstructionField}
                className="h-8 rounded-lg border-nomi-orange text-nomi-orange hover:bg-nomi-orange/5 cursor-pointer text-xs font-semibold gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Tambah Langkah
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <span className="text-xs font-bold text-nomi-brown/50 w-5 pt-3.5 text-right">{index + 1}.</span>
                  <textarea
                    placeholder={`Contoh: Panaskan minyak, lalu tumis bawang putih hingga harum...`}
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    required
                    rows={2}
                    className="flex-1 rounded-xl border border-nomi-brown/10 bg-white/50 px-3 py-2 text-sm text-nomi-brown focus:border-nomi-orange focus:outline-none focus:ring-1 focus:ring-nomi-orange resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeInstructionField(index)}
                    className="text-nomi-brown/40 hover:text-red-500 p-1.5 mt-2 transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tombol Simpan / Batal Form */}
          <div className="flex justify-end gap-3 pt-2">
            <Link to="/dashboard">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl border border-nomi-brown/10 hover:bg-nomi-brown/5 text-nomi-brown font-medium px-5 h-11"
              >
                Batal
              </Button>
            </Link>
            
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-nomi-orange hover:bg-nomi-orange/90 text-white font-medium px-6 h-11 shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditMode ? "Simpan Perubahan" : "Simpan Resep"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
