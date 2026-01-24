# Panduan Mengupload Perubahan ke GitHub

Berikut adalah langkah-langkah dasar untuk mengupdate website anda di GitHub dan Vercel.

## 1. Cek Status File
Sebelum memulai, cek file apa saja yang berubah.
```bash
git status
```
*File yang berwarna merah bearti belum siap di-upload.*

## 2. Siapkan File (Staging)
Tandai semua perubahan untuk disimpan.
```bash
git add .
```

## 3. Simpan Perubahan (Commit)
Beri catatan tentang apa yang anda ubah.
```bash
git commit -m "tulis pesan perbaikan anda disini"
```
*Contoh: `git commit -m "perbaikan layout mobile"`*

## 4. Upload ke GitHub (Push)
Kirim perubahan ke server GitHub. Vercel akan otomatis mendeteksi ini dan melakukan deploy ulang.
```bash
git push origin main
```

---

## ⚠️ Jika Gagal / Error (Rejected)
Jika muncul pesan error `! [rejected]` atau `fetch first`, itu tandanya ada perubahan di GitHub yang belum ada di komputer anda (biasanya karena edit file langsung di website GitHub atau merge otomatis).

**Solusi:**
1. **Ambil perubahan terbaru (Pull):**
   ```bash
   git pull origin main
   ```
   *Jika diminta pesan merge (layar jadi aneh), ketik `:q` lalu Enter, atau tekan `CTRL+X`.*

2. **Coba Push lagi:**
   ```bash
   git push origin main
   ```
