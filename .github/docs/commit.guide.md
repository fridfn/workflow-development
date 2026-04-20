💜 Commit Convention Guide

📌 Overview

Repository ini menggunakan conventional commit style untuk menjaga konsistensi, readability, dan automation workflow.

Format commit:

<type>(optional-scope): <short description>

---

🧠 Commit Types

Type| Description
feat| Fitur baru
fix| Perbaikan bug
refactor| Perubahan kode tanpa mengubah behavior
chore| Task kecil / maintenance
docs| Perubahan dokumentasi
style| Formatting (tidak mengubah logic)
test| Menambahkan / mengubah test
update| Perubahan umum / fallback

---

📦 Scope (Optional)

Digunakan untuk menunjukkan bagian mana yang diubah:

Contoh:

- scripts
- workflows
- messages
- core
- telegram
- reaction
- message

---

✍️ Examples

🔹 Feature

feat(workflows): add daily cycle start automation

🔹 Bug Fix

fix(scripts): handle empty reaction response

🔹 Refactor

refactor(scripts): improve logging and structure in message generator

🔹 Documentation

docs: add commit convention guide

🔹 Style

style(scripts): format code and align sections

🔹 Chore

chore: update dependencies

---

💜 Special Rules

1. Gunakan lowercase

✅ refactor(scripts): improve flow
❌ REFACTOR(SCRIPTS): Improve Flow

---

2. Jangan pakai titik di akhir

✅ fix: handle null value
❌ fix: handle null value.

---

3. Gunakan kata kerja (imperative)

✅ add logging
✅ fix bug
❌ added logging
❌ fixing bug

---

4. Maksimal singkat & jelas

✅ refactor(scripts): simplify reaction logic
❌ refactor(scripts): i changed some logic to make it better and easier to read

---

🔥 Advanced (Project Specific)

🎯 Reaction Mapping (Auto System)

Commit type akan digunakan untuk:

- menentukan reaction message
- menentukan response system

Contoh:

feat → reaction.feat
fix → reaction.fix
refactor → reaction.refactor

Jika type tidak dikenali:

→ fallback ke "update"

---

💜 Recommended Flow

Saat commit:

1. Tentukan type
2. Tentukan scope (optional)
3. Tulis deskripsi singkat

Contoh:

refactor(scripts): add structured logging

---

😏 Tips

- Gunakan commit kecil & spesifik
- Jangan gabung banyak perubahan dalam satu commit
- Gunakan scope biar lebih jelas

---

💜 Final Note

Commit message bukan cuma catatan…
tapi bagian dari system komunikasi dalam project

Jaga tetap:

- jelas
- konsisten
- mudah dipahami