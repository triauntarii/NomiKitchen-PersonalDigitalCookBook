import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit3, Trash2, Heart, Play, X, ChevronLeft, ChevronRight, Check, Loader2, Sparkles } from "lucide-react";
import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import nomiSadImg from "@/assets/Nomi_Sad.png";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  
  // ==================================================
  // State untuk Galeri & Checklist Interaktif
  // ==================================================
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ==================================================
  // Function untuk Mengambil Detail Resep Masakan
  // ==================================================
  const fetchRecipeDetails = async () => {
    try {
      const res = await api.get(`/recipes/${id}`);
      setRecipe(res.data);
      setFavorite(res.data.isFavorite);

      // Parse ingredients
      if (res.data.ingredients) {
        try {
          if (res.data.ingredients.startsWith("[")) {
            setIngredients(JSON.parse(res.data.ingredients));
          } else {
            setIngredients(res.data.ingredients.split("\n").filter(i => i.trim() !== ""));
          }
        } catch {
          setIngredients(res.data.ingredients.split("\n").filter(i => i.trim() !== ""));
        }
      }

      // Parse instructions
      if (res.data.instructions) {
        try {
          if (res.data.instructions.startsWith("[")) {
            setInstructions(JSON.parse(res.data.instructions));
          } else {
            setInstructions(res.data.instructions.split("\n").filter(i => i.trim() !== ""));
          }
        } catch {
          setInstructions(res.data.instructions.split("\n").filter(i => i.trim() !== ""));
        }
      }
    } catch {
      toast.error("Resep tidak ditemukan!");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // Effect untuk memuat detail resep berdasarkan ID
  // ==================================================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecipeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ==================================================
  // Function untuk Mengubah Status Favorit
  // ==================================================
  const toggleFavorite = async () => {
    try {
      const res = await api.patch(`/recipes/${id}/favorite`);
      setFavorite(res.data.isFavorite);
      toast.success(res.data.isFavorite ? "Resep ditambahkan ke favorit!" : "Resep dihapus dari favorit!");
    } catch {
      toast.error("Gagal mengubah status favorit");
    }
  };

  // ==================================================
  // Function untuk Menampilkan Modal Hapus Resep
  // ==================================================
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // ==================================================
  // Function untuk Menghapus Resep - (DELETE /recipes/:id)
  // ==================================================
  const confirmDelete = async () => {
    try {
      setShowDeleteConfirm(false);
      await api.delete(`/recipes/${id}`);
      toast.success("Resep berhasil dihapus!");
      navigate("/dashboard");
    } catch {
      toast.error("Gagal menghapus resep");
    }
  };

  // ==================================================
  // Handler untuk Checklist Bahan & Langkah
  // ==================================================
  const toggleIngredientCheck = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleStepComplete = (index) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // ==================================================
  // Helper untuk URL Foto dari Backend
  // ==================================================
  const getPhotoUrl = (filename) => {
    return `http://localhost:5000/uploads/${filename}`;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-nomi-orange" />
        <p className="text-nomi-brown/60 text-sm font-medium">Memuat resep lezat...</p>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ================================================== */}
      {/* Bar Navigasi Kembali & Kontrol Aksi (Edit/Hapus) */}
      {/* ================================================== */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-nomi-brown/10 bg-white/60 text-nomi-brown/70 hover:bg-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-2">
          {/* Favorite heart toggle button */}
          <Button
            onClick={toggleFavorite}
            variant="outline"
            size="sm"
            className={`h-9 w-9 p-0 rounded-lg cursor-pointer transition-all ${
              favorite
                ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                : "border-nomi-brown/10 bg-white/60 text-nomi-brown/60 hover:text-red-500 hover:bg-white"
            }`}
          >
            <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
          </Button>

          {/* Edit Button */}
          <Link to={`/recipes/${recipe.id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-nomi-brown/10 bg-white/60 text-nomi-brown/80 hover:bg-white cursor-pointer gap-1.5 text-xs font-semibold"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>

          {/* Delete Button */}
          <Button
            onClick={handleDeleteClick}
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-red-200 bg-red-50/50 text-red-600 hover:bg-red-50 cursor-pointer gap-1.5 text-xs font-semibold"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus
          </Button>
        </div>
      </div>

      {/* ================================================== */}
      {/* Grid Konten Detail Resep */}
      {/* ================================================== */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Kolom Kiri: Galeri Foto & Informasi Metadata */}
        <div className="space-y-6 md:col-span-1">
          {/* Galeri Gambar Slider */}
          <Card className="border-nomi-brown/10 bg-white/70 backdrop-blur shadow-sm overflow-hidden">
            <div className="aspect-4/3 w-full bg-nomi-orange/5 relative overflow-hidden flex items-center justify-center border-b border-nomi-brown/5">
              {recipe.photos && recipe.photos.length > 0 ? (
                <img
                  src={getPhotoUrl(recipe.photos[activePhotoIndex].url)}
                  alt={recipe.title}
                  className="h-full w-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-nomi-orange/30">
                  <Play className="h-12 w-12 stroke-[1.25] mb-2 rotate-90" />
                  <span className="text-xs font-semibold text-nomi-brown/40">Nomi Kitchen Recipe</span>
                </div>
              )}

              {/* Tag Category overlay */}
              {recipe.category && (
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-nomi-teal hover:bg-nomi-teal text-white border-none py-1 px-2.5 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                    {recipe.category.name}
                  </Badge>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {recipe.photos && recipe.photos.length > 1 && (
              <div className="p-3 bg-white/40 border-t border-nomi-brown/5 flex gap-2 overflow-x-auto">
                {recipe.photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setActivePhotoIndex(index)}
                    className={`shrink-0 h-12 w-12 rounded-lg overflow-hidden border-2 transition-all ${
                      index === activePhotoIndex
                        ? "border-nomi-orange scale-95"
                        : "border-transparent hover:border-nomi-brown/20"
                    }`}
                  >
                    <img
                      src={getPhotoUrl(photo.url)}
                      alt="Thumbnail"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Info Card */}
          <Card className="border-nomi-brown/10 bg-white/70 backdrop-blur shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-nomi-brown font-heading leading-tight">
                  {recipe.title}
                </h1>
                {recipe.createdAt && (
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">
                    Dibuat pada {new Date(recipe.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                )}
              </div>

              {recipe.description && (
                <div className="border-t border-nomi-brown/5 pt-4">
                  <p className="text-sm text-nomi-brown/80 leading-relaxed italic">
                    "{recipe.description}"
                  </p>
                </div>
              )}

              {/* Cooking Mode Call-To-Action */}
              <div className="pt-2">
                <Button
                  onClick={() => {
                    setCurrentStepIndex(0);
                    setCookingMode(true);
                  }}
                  className="w-full h-11 rounded-xl bg-nomi-orange hover:bg-nomi-orange/90 text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Mulai Memasak
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Bahan-Bahan & Langkah Pembuatan */}
        <div className="md:col-span-2 space-y-6">
          {/* Checklist Bahan-Bahan */}
          <Card className="border-nomi-brown/10 bg-white/70 backdrop-blur shadow-sm">
            <CardHeader className="pb-3 border-b border-nomi-brown/5 flex flex-row justify-between items-center">
              <CardTitle className="font-heading text-lg text-nomi-brown flex items-center gap-2">
                Bahan-Bahan
              </CardTitle>
              <span className="text-xs text-muted-foreground font-medium">
                {Object.values(checkedIngredients).filter(Boolean).length} / {ingredients.length} disiapkan
              </span>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {ingredients.map((ingredient, index) => {
                const isChecked = checkedIngredients[index];
                return (
                  <div
                    key={index}
                    onClick={() => toggleIngredientCheck(index)}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <div className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors ${
                      isChecked
                        ? "bg-nomi-teal border-nomi-teal text-white"
                        : "border-nomi-brown/20 bg-white/50 group-hover:border-nomi-teal/40"
                    }`}>
                      {isChecked && <Check className="h-3 w-3 stroke-3" />}
                    </div>
                    <span className={`text-sm text-nomi-brown/85 transition-all ${
                      isChecked ? "line-through text-muted-foreground font-normal" : "font-medium"
                    }`}>
                      {ingredient}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Checklist Langkah Pembuatan */}
          <Card className="border-nomi-brown/10 bg-white/70 backdrop-blur shadow-sm">
            <CardHeader className="pb-3 border-b border-nomi-brown/5 flex flex-row justify-between items-center">
              <CardTitle className="font-heading text-lg text-nomi-brown">
                Langkah Pembuatan
              </CardTitle>
              <span className="text-xs text-muted-foreground font-medium">
                {Object.values(completedSteps).filter(Boolean).length} / {instructions.length} langkah selesai
              </span>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              {instructions.map((step, index) => {
                const isCompleted = completedSteps[index];
                return (
                  <div
                    key={index}
                    onClick={() => toggleStepComplete(index)}
                    className="flex gap-4 items-start cursor-pointer group pb-4 border-b border-nomi-brown/5 last:border-0 last:pb-0"
                  >
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                      isCompleted
                        ? "bg-nomi-teal text-white"
                        : "bg-nomi-orange/10 text-nomi-orange group-hover:bg-nomi-orange/20"
                    }`}>
                      {isCompleted ? <Check className="h-3 w-3 stroke-3" /> : index + 1}
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className={`text-sm leading-relaxed text-nomi-brown/85 transition-all ${
                        isCompleted ? "line-through text-muted-foreground font-normal" : "font-medium"
                      }`}>
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================== */}
      {/* Mode Memasak Interaktif Fullscreen */}
      {/* ================================================== */}
      {cookingMode && (
        <div className="fixed inset-0 z-100 flex flex-col bg-nomi-cream text-nomi-brown p-6 md:p-12 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-nomi-brown/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-nomi-orange text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-nomi-brown leading-tight">
                  Mode Memasak: {recipe.title}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide font-semibold">
                  Membantumu memasak selangkah demi selangkah
                </p>
              </div>
            </div>

            <Button
              onClick={() => setCookingMode(false)}
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 rounded-lg border-nomi-brown/10 bg-white/60 hover:bg-white cursor-pointer"
              title="Keluar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Central focused step */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full py-8 space-y-8">
            {/* Step badge */}
            <Badge className="bg-nomi-orange hover:bg-nomi-orange text-white border-none py-1.5 px-4 rounded-xl text-sm font-bold uppercase tracking-wider">
              Langkah {currentStepIndex + 1} dari {instructions.length}
            </Badge>

            {/* Big Instruction Text */}
            <div className="text-center px-4 md:px-8">
              <p className="text-2xl md:text-3.5xl font-bold font-heading text-nomi-brown leading-relaxed tracking-tight max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {instructions[currentStepIndex]}
              </p>
            </div>

            {/* Checkbox to mark complete */}
            <div
              onClick={() => toggleStepComplete(currentStepIndex)}
              className="flex items-center gap-3 cursor-pointer select-none bg-white/65 hover:bg-white border border-nomi-brown/10 px-5 py-3 rounded-2xl transition-all shadow-sm"
            >
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                completedSteps[currentStepIndex]
                  ? "bg-nomi-teal border-nomi-teal text-white"
                  : "border-nomi-brown/25 bg-white/50"
              }`}>
                {completedSteps[currentStepIndex] && <Check className="h-4 w-4 stroke-3" />}
              </div>
              <span className="text-sm font-bold text-nomi-brown/80">Tandai langkah ini selesai</span>
            </div>
          </div>

          {/* Progress and Navigation controls */}
          <div className="border-t border-nomi-brown/10 pt-6 max-w-3xl mx-auto w-full space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-nomi-brown/10 overflow-hidden">
                <div
                  className="h-full bg-nomi-teal rounded-full transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / instructions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center gap-4">
              <Button
                disabled={currentStepIndex === 0}
                onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                variant="outline"
                className="h-12 rounded-xl flex-1 border-nomi-brown/15 bg-white/60 text-nomi-brown font-semibold hover:bg-white cursor-pointer gap-2 disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
                Sebelumnya
              </Button>

              {currentStepIndex < instructions.length - 1 ? (
                <Button
                  onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                  className="h-12 rounded-xl flex-1 bg-nomi-teal hover:bg-nomi-teal/90 text-white font-semibold shadow-md cursor-pointer gap-2"
                >
                  Selanjutnya
                  <ChevronRight className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    toast.success("Selamat! Anda menyelesaikan seluruh instruksi.");
                    setCookingMode(false);
                  }}
                  className="h-12 rounded-xl flex-1 bg-nomi-orange hover:bg-nomi-orange/90 text-white font-semibold shadow-md cursor-pointer gap-2"
                >
                  Selesai Memasak
                  <Check className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* Modal Konfirmasi Hapus Resep */}
      {/* ================================================== */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-nomi-brown/10 bg-nomi-cream p-6 shadow-xl text-center space-y-6 flex flex-col items-center">
            <img src={nomiSadImg} alt="Nomi Sad" className="h-28 w-auto object-contain" />
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-bold text-nomi-brown">Hapus Resep Ini?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Apakah kamu benar-benar yakin ingin menghapus resep "{recipe.title}"? Resep yang hilang tidak bisa dikembalikan lho.
              </p>
            </div>
            <div className="flex gap-3 w-full pt-2">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1 rounded-xl border-nomi-brown/15 bg-white/60 text-nomi-brown font-semibold hover:bg-white cursor-pointer h-10.5 text-xs"
              >
                Batal
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md cursor-pointer h-10.5 text-xs"
              >
                Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
