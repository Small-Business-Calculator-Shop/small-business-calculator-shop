# PDF implementation — revised

The previous PDF renderer converted each page to JPEG. That produced a valid PDF but **no searchable or selectable text**, and could make small financial figures blurry. It was not appropriate as the final professional report engine.

This build uses an embedded, licensed subset of DejaVu Sans and a PDF Type0/CIDFontType2 font with ToUnicode mappings. The PDF is produced locally, without a cloud service or browser print dialog. Text is drawn as PDF text objects, so supported glyphs can be selected and searched. The subset covers Latin, Greek, Cyrillic and common currency/punctuation characters, **not every Unicode character or emoji**. Unsupported characters cause an explicit error; they are not silently replaced.

The report content still uses a plain text-oriented layout. Sophisticated financial tables, branding and graphs need separate visual QA. The PDF has not passed real-device acceptance testing. The font license is bundled in docs/DEJAVU-FONT-LICENSE.txt.

Required QA: check report generation in iPad Safari, iPhone Safari, Android Chrome, Windows Edge/Chrome, macOS Safari; open files in native viewers; verify selectable/searchable text, figures, line wraps, long reports, accents, non-Latin characters, and offline availability. Verify the application is installed/cached before disconnecting.
