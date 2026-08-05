"""
messages.py
─────────────────────────
Central Kurdish (Sorani) user-facing error strings. Kept separate from
routing/logic so wording can be reviewed and tweaked by a Kurdish speaker
without touching application code, and so the API layer never leaks
internal exception text to the browser.
"""

UNSUPPORTED_TYPE = "تکایە تەنها فایلێکی .docx باربکە."
EMPTY_FILE = "فایلەکە بەتاڵە یان بە دروستی بارنەکراوە."
TOO_LARGE = "قەبارەی فایلەکە زۆر گەورەیە. تکایە بەڵگەنامەیەکی بچووکتر باربکە."
CORRUPTED_FILE = "ناتوانرێت فایلەکە بکرێتەوە. دڵنیابەرەوە کە بەڵگەنامەیەکی Word دروستە."
DB_UNAVAILABLE = "لە ئێستادا ناتوانین بگەینە داتابەیسی هەڵەچن. تکایە دواتر هەوڵبدەرەوە."
PROCESSING_FAILED = "هەڵەیەک ڕوویدا لە کاتی چاککردنی بەڵگەنامەکەدا. تکایە دواتر هەوڵبدەرەوە."
UNEXPECTED_ERROR = "هەڵەیەکی چاوەڕواننەکراو ڕوویدا. تکایە دواتر هەوڵبدەرەوە."
