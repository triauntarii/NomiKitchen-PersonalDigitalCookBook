# 🍳 Nomi Kitchen - Personal Digital Cookbook

> **Sistem Manajemen Resep Masakan Pribadi Berbasis Web menggunakan Node.js, Express, Prisma, MySQL, React.js, Tailwind CSS, dan shadcn/ui.**

---

## 📖 Informasi Proyek

| Keterangan          | Informasi                        |
| ------------------- | -------------------------------- |
| **👨‍💻 Nama**        | Tria Untari Sasmito               |
| **🔢 NIM**         | 24110400015                       |
| **📚 Mata Kuliah**  | Wadv1 - Web Advanced Development |
| **👥 Jenis Project** | Project UAS Individu            |

---

## 📌 Deskripsi Proyek

**Nomi Kitchen** merupakan aplikasi web buku resep masakan digital pribadi yang memungkinkan pengguna untuk:

* menyimpan dan mengelola koleksi resep masakan pribadi secara terpusat,
* mencatat bahan-bahan dan langkah-langkah pembuatan secara terstruktur,
* mengunggah beberapa foto hasil masakan untuk setiap resep,
* menyaring dan mencari resep berdasarkan nama atau kategori masakan secara instan,
* menandai resep-resep andalan ke dalam kategori **Favorit**, serta
* memasak dengan panduan langkah demi langkah secara terfokus melalui **Mode Memasak Interaktif**.

Aplikasi ini dibangun dengan arsitektur Fullstack modern menggunakan **Node.js + Express.js** di sisi backend, **React.js + Tailwind CSS** di sisi frontend, **Prisma ORM** sebagai jembatan data, serta **MySQL** sebagai basis data relasional.

---

## ✨ Fitur Utama

* 🔑 **Autentikasi & Manajemen Profil**
  Registrasi akun koki baru dan masuk aman menggunakan **JWT Authentication**. Pengguna juga dapat memperbarui nama, email, kata sandi, serta mengunggah foto profil koki mereka.

* 📝 **Manajemen Resep Lengkap (CRUD)**
  Membuat, melihat, mengubah, dan menghapus resep masakan pribadi. Setiap resep mendukung input bahan dinamis, instruksi pembuatan, pemilihan kategori, serta pengunggahan hingga 5 foto hasil masakan.

* ⚡ **Mode Memasak Interaktif**
  Panduan memasak layar penuh (*fullscreen focus mode*) yang menampilkan instruksi langkah demi langkah, dilengkapi checkbox penanda selesai dan indikator progres memasak secara real-time.

* 🔍 **Pencarian & Sliding Pills Kategori**
  Mencari resep berdasarkan kata kunci judul/deskripsi, menyaring resep berdasarkan kategori masakan default, dan melihat kumpulan resep favorit koki dengan cepat.

---

## 🛠️ Teknologi yang Digunakan

| Backend / ORM | Frontend / Styling | Database | Authentication |
| ------------- | ------------------ | -------- | -------------- |
| Node.js       | React.js (Vite)    | MySQL    | JWT            |
| Express.js    | Tailwind CSS v4    | Prisma 5 | Bearer Token   |
| JavaScript    | shadcn/ui (BaseUI) |          |                |

---

## 📋 Prasyarat

Pastikan perangkat telah terpasang:

* Node.js (v18 atau lebih baru)
* npm (v9 atau lebih baru)
* MySQL Server

---

# 🚀 Panduan Instalasi & Menjalankan Project

## 1️⃣ Konfigurasi Backend & Database

Masuk ke folder **backend**:

```bash
cd backend
```

Salin file konfigurasi `.env` dari template yang disediakan, kemudian ubah isi file `.env` tersebut dengan kredensial database MySQL Anda:

```env
DATABASE_URL="mysql://root:password_mysql_kamu@localhost:3306/nomi_kitchen"
JWT_SECRET="masukkan_kode_rahasia_jwt_bebas_di_sini"
PORT=5000
```

Install seluruh dependencies backend:

```bash
npm install
```

Jalankan migrasi Prisma untuk membuat struktur tabel database di MySQL:

```bash
npx prisma migrate dev --name init
```

---

## 2️⃣ Konfigurasi & Instalasi Frontend

Masuk ke folder **frontend**:

```bash
cd ../frontend
```

Install seluruh dependencies frontend:

```bash
npm install
```

---

## 3️⃣ Menjalankan Aplikasi

### Menjalankan API Backend
Di dalam folder **backend**, jalankan perintah development server:

```bash
npm run dev
```

Server backend akan aktif di:
```text
http://localhost:5000
```

### Menjalankan Frontend React
Di dalam folder **frontend**, jalankan perintah development server Vite:

```bash
npm run dev
```

Aplikasi frontend akan aktif di:
```text
http://localhost:5173
```

---

# 🎮 Cara Menggunakan Aplikasi

1. Buka browser dan akses halaman frontend (`http://localhost:5173`).
2. Daftarkan akun baru di halaman **Daftar Akun**, setelah berhasil Anda akan otomatis diarahkan ke halaman **Login**.
3. Masuk dengan akun yang telah didaftarkan.
4. Klik **Profil** di pojok kanan atas untuk melengkapi data diri Anda serta mengunggah foto profil baru.
5. Klik **Tulis Resep Pertamamu** atau tombol tambah di kanan untuk menambahkan resep masakan kreasi Anda.
6. Beri tanda bintang/hati (Favorit) pada resep masakan Anda agar masuk ke daftar resep unggulan.
7. Pilih salah satu resep, klik **Lihat Detail**, kemudian tekan tombol **Mulai Memasak** untuk membuka panduan langkah demi langkah secara fullscreen.