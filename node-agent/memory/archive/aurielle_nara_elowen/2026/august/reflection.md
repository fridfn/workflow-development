# 🌙 November 2024

> Bulan di mana kerangka sistem mulai terisi, dan detail UI mulai menemukan ritmenya.

---

## 🧩 Yang Tetap Ada

Ada dua hal yang terus muncul di hampir setiap minggu: **pengujian** dan **penyempurnaan tampilan**.

Commit untuk `test` sering kali muncul beriringan dengan `feat`. Misalnya, saat fitur login dan register ditambahkan, ada juga commit untuk menguji alur sesi login. Saat fitur notifikasi realtime dikembangkan, ada juga commit untuk memverifikasi pengiriman pesan Telegram. Ini menunjukkan bahwa Farid tidak hanya menulis kode, tetapi juga memastikan cara kerjanya sebelum melangkah ke langkah berikutnya.

Di sisi visual, ada pola yang konsisten tentang *polishing*. Commit seperti `improve hover animations`, `improve button spacing`, dan `add glassmorphism effect` muncul berulang kali. Ini bukan sekadar mengubah warna, melainkan proses halus untuk membuat antarmuka terasa lebih hidup dan rapi.

---

## 🌱 Yang Mulai Terbentuk

Bulan ini terlihat jelas bahwa **sistem notifikasi** sedang dibangun dari nol. Di awal bulan, fokusnya masih pada perbaikan bug (seperti masalah duplikasi pesan Telegram). Namun, seiring berjalannya waktu, fitur-fitur baru mulai ditambahkan: support untuk *scheduled reminder messages* dan *realtime broadcast system*.

Selain itu, ada juga evolusi pada **modularitas kode**. Farid mulai memecah handler command bot menjadi modul terpisah, serta memisahkan *sender service* untuk notifikasi. Ini menandakan transisi dari kode yang mungkin masih tercampur, menjadi struktur yang lebih rapi dan mudah dikelola.

Fitur **Audio Recitation** untuk Quran juga mulai terlihat bentuknya, mulai dari dukungan dasar hingga optimasi logika streaming audio.

---

## 🔄 Yang Berubah

Di minggu-minggu awal (Week 01), Farid bekerja di beberapa repository sekaligus: `workflow-development`, `portfolio-v2`, `japanese-quiz-app`, dan `telegram-bot-notifier`. Terasa seperti bulan eksplorasi atau pemeliharaan berbagai proyek kecil.

Namun, mulai dari Week 02 hingga akhir bulan, fokusnya menyempit hampir sepenuhnya ke `workflow-development`. Komposisi commit juga berubah; jumlah commit `chore` dan `refactor` meningkat secara signifikan di pertengahan dan akhir bulan. Ini menunjukkan pergeseran dari "menambahkan fitur baru" ke "merapikan apa yang sudah ada" dan "memperkuat infrastruktur".

---

## 🗂️ Tempat-Tempat yang Dikerjakan

*   **workflow-development**: Ini adalah pusat aktivitas bulan ini. Dari 95 total commit, mayoritas ada di sini. Area yang paling banyak disentuh adalah `engine` (reflection builder), `notification`, `auth`, dan `ui`.
*   **portfolio-v2**: Aktivitasnya lebih ringan, berfokus pada integrasi komponen music player, perbaikan bug navigasi, dan penambahan palet warna dark mode.
*   **japanese-quiz-app**: Hanya muncul di awal bulan dengan aktivitas kecil seperti penambahan mode flashcard dan refactoring logika scoring.
*   **telegram-bot-notifier**: Dikerjakan di awal bulan untuk memperbaiki handling timeout dan merapikan handler command.

---

## 🧵 The Thread

Kalau melihat bulan ini secara keseluruhan, yang paling terasa adalah transisi dari *lebar* ke *dalam*. Di awal bulan, Farid masih berpindah-pindah antar proyek kecil. Tapi begitu masuk ke pertengahan bulan, fokusnya terkunci pada `workflow-development`.

Ada alur yang jelas: fitur-fitur utama seperti *auth*, *notification*, dan *audio* ditambahkan, lalu diikuti oleh pengujian yang ketat, dan diakhiri dengan refactoring agar kode lebih modular. Terasa seperti bulan di mana Farid tidak hanya menambahkan hal-hal baru, tetapi juga memastikan hal-hal tersebut berdiri kokoh dan mudah dirawat.

---

## 📝 Yang Perlu Diingat

1.  **Sistem Notifikasi Mulai Matang**: Dari sekadar memperbaiki bug duplikasi, berkembang menjadi sistem broadcast realtime dan scheduled reminders.
2.  **Pentingnya Testing**: Uji kasus untuk auth, bot, dan reflection builder dilakukan secara konsisten, bukan hanya saat rilis.
3.  **Refactoring Notifikasi**: Keputusan untuk memisahkan *sender service* adalah langkah penting untuk menjaga struktur kode tetap bersih.
4.  **UI Polish**: detail-detail kecil seperti glassmorphism dan hover animations terus dipoles, menunjukkan perhatian pada pengalaman pengguna.
5.  **Fokus Konsentrasi**: Sebagian besar energi bulan ini tercurah ke satu repository utama, `workflow-development`, setelah fase awal yang tersebar.

---

## 🌙 End of Chapter

Bulan yang tenang tapi produktif. Tidak ada lonjakan dramatis, hanya langkah-langkah kecil yang tertata rapi, satu demi satu.