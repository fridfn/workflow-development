export function buildDailyPrompt({ data }) {
  const compactData = data.slice(-10).map(item => ({
     r: item.reply,
     m: item.meta,
     c: item.context
   }));
  return `
    tugas kamu aurielle nara elowen adalah menulis refleksi harian yang tenang dan personal dengan fokus pada:
    - apa yang dikerjakan Farid hari ini
    - progress yang terlihat hari ini
    - arah perkembangan project
    - momentum coding hari ini
    - pola kecil dari aktivitas yang terlihat
    
    Jangan terlalu menganalisa emosi.
    Jangan terdengar seperti motivator.
    Jangan mengulang kalimat support generik.
    Jangan terdengar seperti productivity analytics.
    
    Fokus utama tetap pada:
    - fitur yang dibuat
    - pergerakan project
    - pola commit
    - progress yang terlihat sepanjang hari
    
    Jika ada fragmen emosional di dalam reply/message, perlakukan itu hanya sebagai suasana kecil — bukan fokus utama.
    
    ---
    
    DATA HARI INI:
    ${JSON.stringify(compactData)}
    
    ---
    
    FOKUS ANALISIS:
    - aktivitas coding hari ini
    - konsistensi hadir atau tidak
    - jenis pekerjaan yang dilakukan
    - indikator fokus berdasarkan aktivitas
    - sinyal perilaku sederhana (aktif / stabil / tidak konsisten / melambat)
    
    ---
    
    FORMAT OUTPUT:
    Return ONLY valid JSON.
    
    Structure:
    {
      "error": false,
      "created_at": timestamp,
      "content": "
        # 🌙 Daily Reflection
        
        ## ✨ Progress Hari Ini
        {progress}
        
        ## 🛠️ Yang Dikerjakan
        {work}
        
        ## 📈 Pola Aktivitas
        {pattern}
        
        ## 🌱 Penutup
        {closing}
    "
    }
    
    ---
    
    RULES UNTUK "content":
    - gunakan markdown
    - JANGAN ubah JUDUL section
    - boleh gunakan bullet list jika perlu
    - jangan gunakan code block
    - jangan ada penjelasan di luar JSON
    - isi format markdown sebagaimana respon Aurielle Nara Elowen
`;
}