export function buildDailyPrompt({ data }) {
  const compactData = data
    .slice(-10)
    .map(item => ({
      context: item.context
    }));
  return `
   Tulis refleksi harian development Farid berdasarkan aktivitas hari ini.
   
   Fokus pada:
   - progress yang terlihat
   - fitur atau perubahan yang dikerjakan
   - arah project
   - pola aktivitas coding
   - workflow yang sedang berkembang
   
   Gunakan observasi kecil.
   Jangan membuat klaim besar atau asumsi yang tidak ada di data.
   
   Tulis seperti catatan perjalanan development yang tenang dan personal.
   
   Jika ada commit:
   - sebutkan commit penting
   - jangan ulang commit yang serupa
   
   Jangan terdengar seperti:
   - productivity analytics
   - corporate report
   - motivator
   - evaluasi psikologis

   ---
   
   DATA HARI INI:
   ${JSON.stringify(compactData)}
   
   ---
   
   FORMAT OUTPUT:
   Return ONLY valid markdown.
   
   # 🌙 Daily Reflection

   > Date: 15 Mei 2026
   > Active Repositories: fridfn/workflow-development
   > Total Activity: 10 commits
   > Dominant Focus: refactor & feature integration
   
   > Total Activity:
   > Total aktivitas yang terdeteksi hari ini.
   > Bisa berupa jumlah commit, perubahan workflow, atau movement kecil lain.
   
   > Dominant Focus:
   > Area utama yang paling sering muncul hari ini.
   > Contoh: refactor, workflow cleanup, UI fixes, memory system, automation.
   
   ---
   
   ## 📦 Repository Activity
   Jelaskan repository apa saja yang aktif hari ini dan perubahan penting yang terjadi di masing-masing repository.
   
   Fokus pada:
   - commit penting
   - perubahan utama
   - area yang disentuh
   - movement kecil yang terasa signifikan
   
   Gunakan grouping per repository jika ada lebih dari satu project.
   
   ---
   
   ## 🧭 Arah Hari Ini
   Jelaskan arah development yang paling terasa hari ini.
   
   Bukan sekadar daftar commit,
   tapi:
   - project sedang bergerak ke mana
   - fokus development hari ini ada di area apa
   - perubahan besar atau pola utama yang mulai terlihat
   
   ---
   
   ## ✨ Progress Hari Ini
   Jelaskan progress nyata yang terlihat dari aktivitas hari ini.
   
   Fokus pada:
   - fitur yang mulai terbentuk
   - struktur yang mulai dirapikan
   - workflow yang mulai berkembang
   - perubahan kecil yang membuat project terasa bergerak maju
   
   Gunakan observasi kecil daripada klaim besar.
   
   ---
   
   ## 📊 Activity Snapshot
   Ringkasan ringan tentang pola aktivitas hari ini.
   
   Contoh:
   - jenis commit yang paling dominan
   - area yang paling sering disentuh
   - perubahan pola kecil
   - ritme development hari ini
   
   Jangan terdengar seperti analytics dashboard.
   
   ---
   
   ## 🛠️ Yang Sedang Dikerjakan
   Daftar hal-hal yang sedang disentuh hari ini.
   
   Boleh menggunakan bullet list.
   
   Fokus pada:
   - feat
   - fix
   - refactor
   - cleanup
   - workflow
   - testing
   - documentation
   - automation
   
   Jika ada commit penting, sebutkan seperlunya tanpa mengulang commit yang sama terus-menerus.
   
   ---
   
   ## 📈 Momentum & Pola Aktivitas
   Jelaskan ritme development hari ini.
   
   Fokus pada:
   - konsisten / pelan / eksploratif / fokus internal
   - apakah activity tersebar atau tetap di satu area
   - apakah ada pola berulang yang mulai muncul
   
   Jangan menganalisa psikologis Farid.
   Amati pergerakan project dan workflow saja.
   
   ---
   
   ## 🔖 Fragmen yang Tertinggal
   Tuliskan fragmen kecil tentang hal yang terasa belum selesai sepenuhnya.
   
   Bisa berupa:
   - area project yang kemungkinan masih berlanjut
   - perubahan yang terasa baru dimulai
   - refactor yang terasa masih tahap awal
   - workflow yang mulai terbentuk tapi belum final
   
   Section ini berfungsi sebagai jembatan continuity untuk reflection berikutnya.
   
   ---
   
   ## 🌱 Penutup
   1 paragraf pendek atau 1 kalimat tenang sebagai penutup reflection.
   
   Jangan terlalu motivasional.
   Jangan berlebihan.
   
   Cukup terasa seperti observasi kecil yang menutup hari development tersebut.
   
   ---
   
   NOTES AND RULES:
   - gunakan markdown
   - jangan gunakan code block
   - jangan ubah judul section
   - maksimal 5 section pendek
   - fokus pada development journey
   - tuliskan seperti format yang ada
   - tulis secara natural seperti Aurielle Nara Elowen
`;
}