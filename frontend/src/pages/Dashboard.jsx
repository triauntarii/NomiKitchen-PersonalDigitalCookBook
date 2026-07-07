import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, Plus, Sparkles, BookOpen, Loader2, ArrowRight } from "lucide-react";
import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import nomiHappyImg from "@/assets/Nomi_Happy.png";
import nomiSadImg from "@/assets/Nomi_Sad.png";

export default function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inisialisasi State & Filter ======================
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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
      await Promise.all(
        defaults.map(cat => api.post("/categories", cat).catch(() => {}))
      );
      const res = await api.get("/categories");
      return res.data;
    } catch {
      return [];
    }
  };

  // ==================================================
  // Function untuk Memuat Data Awal (Kategori & Resep)
  // ==================================================
  const fetchInitialData = async () => {
    try {
      const [catRes, recRes] = await Promise.all([
        api.get("/categories"),
        api.get("/recipes"),
      ]);

      let loadedCategories = catRes.data;
      
      // Jika database categories kosong, seed otomatis
      if (loadedCategories.length === 0) {
        loadedCategories = await seedDefaultCategories();
      }

      setCategories(loadedCategories);
      setRecipes(recRes.data);
    } catch {
      toast.error("Gagal memuat data awal");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // Function untuk Mencari Resep Masakan
  // ==================================================
  const handleSearch = async () => {
    try {
      const categoryParam = selectedCategory === "Semua" ? "" : selectedCategory;
      const res = await api.get(`/recipes/search?keyword=${searchQuery}&category=${categoryParam}`);
      setRecipes(res.data);
    } catch {
      toast.error("Pencarian resep gagal");
    }
  };

  // ==================================================
  // Effect untuk memuat data awal saat pertama kali mount
  // ==================================================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==================================================
  // Effect untuk memicu pencarian dengan debouncing
  // ==================================================
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300); // Tunda pencarian selama 300ms

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory]);

  // ==================================================
  // Function untuk Mengubah Status Favorit Resep
  // ==================================================
  const toggleFavorite = async (id, currentVal) => {
    try {
      await api.patch(`/recipes/${id}/favorite`);
      // Update local state
      setRecipes(prev =>
        prev.map(r => (r.id === id ? { ...r, isFavorite: !currentVal } : r))
      );
      toast.success(!currentVal ? "Resep ditambahkan ke favorit!" : "Resep dihapus dari favorit!");
    } catch {
      toast.error("Gagal mengubah status favorit");
    }
  };

  const getPhotoUrl = (filename) => {
    return `http://localhost:5000/uploads/${filename}`;
  };

  // ==================================================
  // Filter Resep Berdasarkan Pilihan Favorit (di Memory)
  // ==================================================
  const displayedRecipes = showFavoritesOnly
    ? recipes.filter(r => r.isFavorite)
    : recipes;

  return (
    <div className="space-y-8">
      {/* ==================================================
      Header Selamat Datang (Welcome Hero Card)
      ================================================== */}
      <div className="rounded-3xl bg-linear-to-br from-nomi-orange/15 via-nomi-mustard/10 to-nomi-teal/5 p-6 md:p-10 border border-nomi-orange/10 relative overflow-hidden md:pr-48">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 h-32 md:h-40 w-auto pointer-events-none hidden sm:block">
          <img src={nomiHappyImg} alt="Nomi Happy" className="h-full w-auto object-contain" />
        </div>
        <div className="max-w-2xl space-y-4">
          <Badge className="bg-nomi-orange/10 text-nomi-orange hover:bg-nomi-orange/15 border border-nomi-orange/20 px-3 py-1 text-xs font-semibold rounded-full gap-1">
            <Sparkles className="h-3.5 w-3.5 fill-current" />
            Nomi Kitchen Digital Cookbook
          </Badge>
          <h1 className="font-heading text-3xl md:text-4.5xl font-black text-nomi-brown leading-tight tracking-tight">
            Nom Nom Nom,<br />
            <span className="text-nomi-orange">Nomi</span> your cooking buddy!
          </h1>
          <p className="text-sm md:text-base text-nomi-brown/85 font-medium max-w-lg leading-relaxed">
            Simpan resep andalanmu, susun bahan dengan rapi, dan masak langkah demi langkah dengan mudah.
          </p>
        </div>
      </div>

      {/* ==================================================
      Bar Pencarian & Tombol Tambah Resep
      ================================================== */}
      <div className="flex items-center justify-between gap-3 w-full">
        {/* Input Pencarian */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-nomi-brown/40" />
          <Input
            placeholder="Cari resep berdasarkan judul atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 rounded-xl border-nomi-brown/10 bg-white/60 focus:bg-white w-full"
          />
        </div>

        {/* Tombol Tambah Resep (Muncul jika resep > 0) */}
        {recipes.length > 0 && (
          <Link to="/recipes/new">
            <Button className="h-11 rounded-xl bg-nomi-teal hover:bg-nomi-teal/90 text-white font-semibold text-xs px-4 flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap">
              <Plus className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Tambah Resep Baru</span>
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-wider font-extrabold text-nomi-brown/65">Mau masak apa hari ini?</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
          {/* Tombol Filter Resep Favorit */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
              showFavoritesOnly
                ? "bg-nomi-orange border-nomi-orange text-white shadow-sm"
                : "border-nomi-brown/10 bg-white/50 text-nomi-brown/85 hover:bg-white"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${showFavoritesOnly ? "fill-current" : ""}`} />
            Resep Favorit
          </button>

          <button
            onClick={() => setSelectedCategory("Semua")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === "Semua"
                ? "bg-nomi-brown border-nomi-brown text-white shadow-sm"
                : "border-nomi-brown/10 bg-white/50 text-nomi-brown/80 hover:bg-white"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === cat.name
                  ? "bg-nomi-brown border-nomi-brown text-white shadow-sm"
                  : "border-nomi-brown/10 bg-white/50 text-nomi-brown/80 hover:bg-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-nomi-orange" />
          <p className="text-xs text-nomi-brown/50 font-semibold">Mengambil daftar resep...</p>
        </div>
      ) : displayedRecipes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedRecipes.map((recipe) => (
            <Card key={recipe.id} className="border-nomi-brown/10 bg-white/70 backdrop-blur shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                {/* Recipe Card Image */}
                <div className="aspect-4/3 w-full bg-nomi-orange/5 relative overflow-hidden flex items-center justify-center border-b border-nomi-brown/5">
                  {recipe.photos && recipe.photos.length > 0 ? (
                    <img
                      src={getPhotoUrl(recipe.photos[0].url)}
                      alt={recipe.title}
                      className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-nomi-orange/20">
                      <BookOpen className="h-10 w-10 stroke-[1.25] mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-nomi-brown/30">Nomi Kitchen</span>
                    </div>
                  )}

                  {/* Inline Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(recipe.id, recipe.isFavorite);
                    }}
                    className={`absolute top-3 right-3 h-8 w-8 rounded-full border flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                      recipe.isFavorite
                        ? "bg-white border-red-100 text-red-500 hover:scale-105"
                        : "bg-white/70 border-nomi-brown/5 text-nomi-brown/40 hover:text-red-500 hover:bg-white"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${recipe.isFavorite ? "fill-current" : ""}`} />
                  </button>

                  {/* Category Badge overlay */}
                  {recipe.category && (
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-nomi-teal hover:bg-nomi-teal text-white border-none py-0.5 px-2 rounded-lg text-[9px] uppercase font-bold tracking-wider">
                        {recipe.category.name}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-4.5 space-y-2">
                  <h3 className="font-heading font-bold text-lg text-nomi-brown leading-tight tracking-tight line-clamp-1 group-hover:text-nomi-orange transition-colors">
                    {recipe.title}
                  </h3>
                  {recipe.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4.5 pb-4.5 pt-0 flex justify-end">
                <Link to={`/recipes/${recipe.id}`} className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full h-9 bg-nomi-orange/5 hover:bg-nomi-orange text-nomi-orange hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer group-hover:bg-nomi-orange group-hover:text-white"
                  >
                    Lihat Detail
                    <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/40 border border-dashed border-nomi-brown/15 rounded-3xl p-8 w-full space-y-4 flex flex-col items-center justify-center">
          {/* Tampilan Ketika Resep Kosong (Empty State) */}
          <img src={nomiSadImg} alt="Nomi Sad" className="h-24 w-auto object-contain" />
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold text-nomi-brown">
              {showFavoritesOnly ? "Belum Ada Resep Favorit" : "Aduh, resepnya masih kosong melompong!"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {showFavoritesOnly
                ? "Buka salah satu resepmu dan klik ikon hati untuk menandainya sebagai favorit agar muncul di sini ya."
                : "Kamu belum menyimpan resep masakan sama sekali. Ayo tuangkan ide memasakmu dan tulis resep pertamamu bersama Nomi!"}
            </p>
          </div>
          {!showFavoritesOnly && (
            <div className="pt-2">
              <Link to="/recipes/new">
                <Button className="h-11 rounded-xl bg-nomi-teal hover:bg-nomi-teal/90 text-white font-semibold text-xs shadow-md cursor-pointer gap-1.5 px-6">
                  <Plus className="h-4.5 w-4.5" />
                  Tulis Resep Pertamamu
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
