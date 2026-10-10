(function () {
  "use strict";

  var DIR = { ckb: "rtl", en: "ltr", ar: "rtl" };
  var STORAGE_KEY = "ranew_lang";

  var translations = {
    /* ============== کوردی (Central Kurdish / Sorani) ============== */
    ckb: {
      "meta.title": "دامەزراوەی ڕەنێو | بۆ پەروەردە و ڕۆشنبیری",
      "meta.description": "دامەزراوەی ڕەنێو، ڕێکخراوێکی ناحکومی و ناقازانجخوازە لە هەولێر، کار لەسەر بواری پەروەردە و ڕۆشنبیری دەکات؛ بە وتاری هەفتانە، بەرنامەی پەروەردەیی و چالاکی کۆمەڵایەتی.",

      "aria.facebook": "فەیسبووک",
      "aria.navToggle": "کردنەوەی لیستە",
      "aria.backToTop": "گەڕانەوە بۆ سەرەوە",

      "brand.logoAlt": "لۆگۆی دامەزراوەی ڕەنێو",

      "nav.home": "سەرەکی",
      "nav.about": "لەبارە",
      "nav.programs": "بوارەکانی کار",
      "nav.values": "ئامانج",
      "nav.publications": "بڵاوکراوەکان",
      "nav.team": "تیمەکەمان",
      "nav.contact": "پەیوەندی",
      "header.followBtn": "شوێنمان بکەوە",

      "publications.meta.title": "بڵاوکراوەکان | دامەزراوەی ڕەنێو",
      "publications.meta.description": "بڵاوکراوە و چاپەمەنییەکانی دامەزراوەی ڕەنێو.",
      "team.meta.title": "تیمەکەمان | دامەزراوەی ڕەنێو",
      "team.meta.description": "ئەندامانی تیمی دامەزراوەی ڕەنێو.",

      "publications.title": "بڵاوکراوەکانمان",
      "publications.intro": "کتێب کاریگەرترین رێکارە بۆ پەروەردەکردن و پێگەیاندن؛ دامەزراوەی ڕەنێو کۆبیری سەرەکی لەسەر کتێبە و بایەخی تایبەت دەدات بە ئاڕاستەکردنی هزر لە ڕێگەی چاپەمەنی و بڵاوکراوەکان.",
      "publications.sub": "هەندێک لە کتێبە بڵاوکراوەکانی دامەزراوە.",
      "publications.p1.category": "کۆمەڵایەتی",
      "publications.p1.title": "خێزان لە ئیسلامدا",
      "publications.p1.desc": "ئەم کتێبە باسی چەمکی فراوانی خێزان دەکات لە ئیسلامدا، کە باری سروشتی و بناغە و بونیادی کۆمەڵگەیە. پاشان باس لە کۆسپ و ڕێگرە هەڵوەشێنەرەوەکانی دەکات لە ڕۆژگاری ئێستادا، لە نێوانیاندا بابەتەکانی فێمینیزم و جێندەر، لە پشت ئەوانیشەوە هاوڕەگەزبازی و کاریگەرییان لەسەر خێزان دەخاتە ڕوو. لەم بەرهەمەدا کۆمەڵێک باسی دیکەی هەستیار توێژراونەتەوە، وەک بارە تایبەتەکانی خێزان لە ئیسلامدا؛ چەندژنی (فرەژنی) و هاوسەرگیریی میسیار.",
      "publications.p2.category": "ڕۆشنبیری",
      "publications.p2.title": "هاوسەنگی: نە بەزایەدان، نە تێپەڕاندن",
      "publications.p2.desc": "ئەم کتێبە باسی یەکێک لە دروشمە هەرە بنەڕەتییەکانی ئیسلام دەکات کە هاوسەنگییە. بە بڕوای نووسەر، بەزۆری مرۆڤایەتی یان تووشی بەزایەدان و کەمتەرخەمی و کورتھێنان دەبن، یان تووشی سنووربەزاندن و زێدەڕۆیی و تێنووسانی زۆر دەبن. لەم سۆنگەیەوە، پێویستیی ئەم کتێبە لە هەر کاتێکی دیکەدا زیاترە.",
      "publications.p3.category": "پەروەردەیی",
      "publications.p3.title": "بەرەو دۆستایەتی و هاوکاریی نێوان مسوڵمانان",
      "publications.p3.desc": "ئەم کتێبە باسی پێویستی و گرنگیی دۆستایەتی و ئاشتی و هاوکاریی نێوان تاکەکانی کۆمەڵگە دەکات، بەتایبەت ئەو کەسانەی کە ناسنامەی باوەڕیان هاوبەشە (مسوڵمانن)، لەبەر ئەوەی بەر لە هەموو شتێک بیروباوەڕیان ئەوە لەسەریان پێویست دەکات. ئەم کتێبە باسی چەند دەرد و نەخۆشییەکیش دەکات کە بوونەتە هۆی پەرتەوازەیی و لێکدوورکەوتنەوەی مسوڵمانان لە نێوان خۆیاندا و لە ئەنجامدا بێهێزبوونیان باس دەکات.",
      "publications.p4.category": "ڕۆشنبیری",
      "publications.p4.title": "هیچ ئایەتێکی مەنسووخ لە قوڕئاندا نییە",
      "publications.p4.desc": "ئەم کتێبە لێکۆڵینەوەیەکی پشوودرێژانەیە لە بابەتێکی هەستیار کە جێی ڕاجیاییە لە نێوان لێکۆڵەرانی قورئان؛ بابەتی نەسخ، واتە هەڵوەشاندنەوەی ئایەتێکی قورئان یاخود حوکمێکی قورئان بەهۆی ئایەتێکی دیکەوە. نووسەر لەم کتێبەدا لەڕێی چەند لێکۆڵینەوە و بەڵگەیەکی زانستیی قورئانەوە ئەوە دەسەلمێنێت کە هیچ ئایەتێکی قورئان نەسخ نەکراوە و نەسخ لە قورئاندا بوونی نییە.",
      "publications.p5.category": "پەروەردەیی",
      "publications.p5.title": "طريق الصلاح والسير إلى الله",
      "publications.p5.desc": "إن َّ تزكية النفس والتي اخترت لها في هذا الكتاب عنوان: «طريق الصلاح والسير إلى الله» ، بَحْر لا ساحل له، وذلك لارتباطها من جانب بالروح التي هي سر من أسرار الله تعالى، وبعد دخولها في الجسد تسمى النفس، ويقع عليها المدح والقدح بحسب ما تحملة من الفضائل والرذائل. وكذلك لها ارتباط - من جانب آخر - بالله ال الذي ليس كمثله شيء. وحاولت في هذا الكتاب - الذي هو عصارة ما وصلت إليه من فهوم وخبرات في هذا المجال - تسليط أضواء كثيرة ومتعددة على تزكية النفس، في عشرة فصول بمختلف نواحيها، وآمل أن يستوعب الفراء الكرام مضمون ما كتبته في هذا الموضوع الحساس العميق المترامي الأطراف، وأن يُتَّحِفوني بملاحظاتهم المخلصة، إذْ لَمْ تُصْمَن لنا العِصْمَةُ في غير كتاب الله وسنة رسول الله.",
      "publications.p6.category": "پەروەردەیی",
      "publications.p6.title": "ڕوونکردنەوە و هەڵسەنگاندنی حیکمەتەکانی 'ابن عطاء الله السكندري'",
      "publications.p6.desc": "ڕوونکردنەوە و هەڵسەنگاندنێکی پشوودرێژانەیە بۆ حیکمەتەکانی ئەحمەد کوڕی عەتائوڵڵای سەکنندەری. لە بنەڕەتدا سی و سێ (٣٣) دەرس بوون و لە خوولێکدا پێشکەش کراون. شایەنی باسیشە ئەو حیکمەتانە لەمێژە زانایانی بواری تەزکیە و تەسەووف بە ڕوونکردنەوە و لێکدانەوەیانەوە سەرقاڵن و شەرحی زۆریان کراون، کەم و زۆریش سوودم لە بەشێک لەو کتێب و بەرهەمانە وەرگرتووە. ڕەنگە ئیمتیاز و جیاوازیی سەرەکیی ئەم بەرهەمە ئەوە بێت بەپێچەوانەی سەرجەم شەرحەکانی دیکەوە، وێڕای ڕوونکردنەوە و لێکدانەوە، هەڵسەنگاندنم بۆ ژمارەیەکی زۆر لە حیکمەتەکان کردووە.",
      "publications.p7.category": "پەروەردەیی",
      "publications.p7.title": "چاوبەخۆداگێڕانەوە",
      "publications.p7.desc": "ئەم کتێبە وەک لە ناونیشانەکەشیەوە دیارە چاو بەخۆداگێڕانەوەیەکی گشتگیر و هەمەلایەنەیە بۆ کۆی بوار و لایەنەکانی دینداریی مسوڵمانانمان. هەوڵم داوە لە سەرجەم بوارەکانی تێڕوانین و بوونناسی و ئیمان و عەقیدە و خواپەرستی و تەزکییە و تەقوا و ڕەوشت و ئاکار و کاروباری کەسێتی و کۆمەڵایەتی و سیاسیدا، نوختە بخەمە سەر پیت و بە شێوەیەکی بەڵگەیی هاوسەنگانەی دوور لە کورتھێنان و تێپەڕاندن، نەخشەڕێ و هێڵە گشتییەکانی موسڵمانێتییەکی ڕاست و ساغ بخەمە ڕوو.",

      "promo.eyebrow": "بڵاوکراوەی تازە",
      "promo.title": "کتێبی \"هاوسەنگی\"",
      "promo.desc": "یەکێک لە کتێبە تازەکانمان، سەبارەت بە بونیادنانی هۆشیاری کۆمەڵایەتی. لە بەشی بڵاوکراوەکاندا ببینە.",
      "promo.cta": "بینینی هەموو بڵاوکراوەکان",

      "team.title": "ئەندامانی تیمەکەمان",
      "team.sub": "لێرەدا ئەزموون و داهێنان یەک دەگرن؛ تیمی کارگێڕیی ڕەنێو بەوپەڕی دڵسۆزی و بەرپرسیارێتییەوە، کار بۆ گەیاندنی پەیامی ڕەنێو بە هەموو کایەکانی کۆمەڵگە دەکەن.",
      "team.m1.initials": "ئ.م",
      "team.m1.name": "موحەممەد جەمیل",
      "team.m1.role": "سەرپەرشتی بەشی میدیا و ڕاگەیاندن",
      "team.m2.initials": "س.ئ",
      "team.m2.name": "قاسم سەلام",
      "team.m2.role": "سەرپەرشتی بەشی کتێب و چاپ",
      "team.m3.initials": "ک.ڕ",
      "team.m3.name": "شادی عەلی باپیر",
      "team.m3.role": "دامەزرێنەر و بەڕێوەبەری جێبەجێکار",
      "team.m4.initials": "ڕ.ع",
      "team.m4.name": "نەهرۆ عەلی",
      "team.m4.role": "سەرپەرشتی بەشی پەروەردە و پێگەیاندن",
      "team.m5.initials": "هـ.ک",
      "team.m5.name": "عەبدوڕەحمان جەمال",
      "team.m5.role": "سەرپەرشتی بەشی کارگێڕی و دارایی",
      "team.m6.initials": "ش.ع",
      "team.m6.name": "ئاسۆ عەلی",
      "team.m6.role": "سەرپەرشتی بەشی سلێمانی",
      "team.m7.initials": "د.س",
      "team.m7.name": "ئەلەند کاوە",
      "team.m7.role": "تەکنەلۆجیا",
      "team.m8.initials": "ل.ف",
      "team.m8.name": "بڕیار حوسێن",
      "team.m8.role": "ڕێنووس و دیزاین",
      "team.m9.initials": "ئـ.ج",
      "team.m9.name": "ئەمین جەوهەر",
      "team.m9.role": "ڤیدیۆگراف، ئیدیتەر",
      "team.m10.initials": "ب.ت",
      "team.m10.name": "ئارام موحەممەد",
      "team.m10.role": "سەرپەرشتی بەشی ڕاپەڕین",

      "hero.eyebrow": "ڕێکخراوێکی ناحکومی و ناقازانجخواز · هەولێر",
      "hero.title1": "دامەزراوەی ڕەنێو",
      "hero.title2": "بۆ پەروەردە و ڕۆشنبیری",
      "hero.lead": "پەروەردە و پێگەیاندن دوو پایەی بنەڕەتیی زیندوومانەوە و پێشکەوتنی هەر کۆمەڵگەیەکن، ڕەنێو خزمەتکردن بەم دوو کایە گرنگەی وەک ئەرک و بەرپرسیارێتیی سەرەکی گرتووەتە ئەستۆ. کار دەکەین بۆ بەرزکردنەوەی ئاستی پەروەردە و ڕۆشنبیری لە ڕێگەی بڵاوکراوەی جۆراوجۆر، میدیایەکی هەمەلایەنی بینراو و بیستراو و پڕۆژەی پەروەردەیی پێشەنگ؛ بە ئامانجی بنیاتنانی تاکێکی ئاگادار، بەرپرسیار و کاریگەر.",
      "hero.ctaContact": "پەیوەندیمان پێوە بکە",
      "hero.ctaFacebook": "بینینی پەیجی فەیسبووک",
      "hero.badgeAlt": "نیشانی دامەزراوەی ڕەنێو",

      "stats.followers": "شوێنکەوتووی فەیسبووک",
      "stats.areas": "بواری سەرەکی چالاکی",
      "stats.talks": "وتاری هەفتانە ساڵانە",
      "stats.nonprofit": "ناقازانجخواز و خزمەتگوزاری",

      "about.eyebrow": "لەبارەی ئێمە",
      "about.title": "ڕەنێو دامەزراوەیەکی قازانجنەویستی ناحکومییە، کار لەسەر ڕەهەندەکانی پەروەردە و ڕۆشنبیری دەکات",
      "about.p1": "ڕەنێو هەوڵ دەدات کۆمەڵگەیەک بنیات بنێت کە تاکەکانی خاوەن عەقڵێکی هۆشیار و دڵێکی بێدار و ئاکارجوان و ڕەوشتپەسندن، بۆ پەروەردگاریان فەرمانبەری ڕاستن و لەگەڵ یەکدا چاکەکار و دڵسۆزن.",
      "about.p2": "کارەکانمان بەشێوەیەکی سەرەکی لەسەر تۆڕی کۆمەڵایەتی فەیسبووک بڵاو دەکرێنەوە، جگە لە بوارەکانی کاری ڕاستەوخۆ لە بنکەمان لە هەولێر، گوڵان 2، بەرامبەر ماجیدی مۆڵ.",
      "about.check1": "ڕاستی — ڕاستی لە تێگەیشتنی دروستدا بەرجەستە دەبێت.",
      "about.check2": "ڕەسەنایەتی — پابەندبوونە بە بەها باڵاکان و ئاکارە پەسندەکانەوە.",
      "about.check3": "هاوسەنگی — هزرێکە نە تێدەپەڕێنێت و نە کورت هەڵدەهێنێت.",
      "about.cta": "بۆ زانیاریی زیاتر",

      "programs.eyebrow": "بوارەکانی کار",
      "programs.title": "بوارەکانی کار",
      "programs.sub": "سێ بواری سەرەکیی تەواوکەر بۆ خزمەتکردنی دین و ژینی کۆمەڵگە.",
      "programs.card1.title": "کتێب و چاپەمەنی",
      "programs.card1.desc": "دەوڵەمەندکردنی ئاستی ڕۆشنبیری و زانیاریی، لە ڕێگەی چاپکردن و بڵاوکردنەوەی کتێب و بڵاوکراوە، ئەنجامدانی توێژینەوەی زانستی و ڕاپرسی.",
      "programs.card2.title": "پەروەردە و پێگەیاندن",
      "programs.card2.desc": "پێگەیاندنی تاک و بەهێزکردنی لایەنی پەروەردە، لە ڕێگەی ئامادەکردنی پەیڕەو و پڕۆگرامی پەروەردەیی، چالاکی مەیدانی لە خول و ڕاهێنان، کۆڕ و کۆڕبەند و سیمینار.",
      "programs.card3.title": "میدیا و ڕاگەیاندن",
      "programs.card3.desc": "گەیاندنی پەیامی ڕۆشنبیری و پەروەردەیی بە شێوەیەکی فراوان، لە ڕێگەی بەرهەمهێنانی نێوەڕۆکی میدیای بینراو و بیستراو.",

      "values.eyebrow": "ئامانجی ئێمە",
      "values.title": "ئەو بەهایانەی ڕێنماییمان دەکەن",
      "values.v1.title": "ڕاستی",
      "values.v1.desc": "وردبینی لە تێگەیشتنی دروست و ڕاستگۆیی لە گەیاندنی پەیامدا.",
      "values.v2.title": "ڕەسەنایەتی",
      "values.v2.desc": "پاراستنی شوناس و پابەندبوونی هەمیشەیی بە بەها و ئاکارە باڵاکانەوە.",
      "values.v3.title": "هاوسەنگی",
      "values.v3.desc": "پەیڕەوکردنی هزرێکی میانجی؛ دوور لە تێپەڕاندن و کورتهێنان.",
      "values.v4.title": "پاراستنی کەلتوور",
      "values.v4.desc": "پاراستن و پەرەپێدانی ڕۆشنبیری کۆمەڵگە.",

      "contact.eyebrow": "پەیوەندی",
      "contact.title": "پەیوەندیمان پێوە بکە",
      "contact.address.label": "ناونیشان",
      "contact.address.value": "هەولێر، گوڵان 2، بەرامبەر ماجیدی مۆڵ",
      "contact.phone.label": "ژمارەی مۆبایل",
      "contact.email.label": "ئیمێڵ",
      "contact.facebook.label": "فەیسبووک",
      "contact.donate.label": "بەخشین",
      "contact.donate.desc": "دەتوانیت لە ڕێگەی ناردنی باڵانس یان پارە بۆ ئەم ژمارەیە پاڵپشتیمان بکەیت",
      "contact.mapTitle": "شوێنی دامەزراوەی ڕەنێو لەسەر نەخشە",

      "footer.tagline": "بۆ پەروەردە و ڕۆشنبیری",
      "footer.copyright": "دامەزراوەی ڕەنێو. هەموو مافێک پارێزراوە."
    },

    /* ============== English ============== */
    en: {
      "meta.title": "Ranew Foundation | For Education & Culture",
      "meta.description": "Ranew Foundation is a non-governmental, non-profit organization based in Erbil, working in education and culture through weekly talks, educational programs, and community activities.",

      "aria.facebook": "Facebook",
      "aria.navToggle": "Open menu",
      "aria.backToTop": "Back to top",

      "brand.logoAlt": "Ranew Foundation logo",

      "nav.home": "Home",
      "nav.about": "About",
      "nav.programs": "Activities",
      "nav.values": "Values",
      "nav.publications": "Publications",
      "nav.team": "Our Team",
      "nav.contact": "Contact",
      "header.followBtn": "Follow Us",

      "publications.meta.title": "Publications | Ranew Foundation",
      "publications.meta.description": "Publications and printed materials from Ranew Foundation.",
      "team.meta.title": "Our Team | Ranew Foundation",
      "team.meta.description": "Meet the team behind Ranew Foundation.",

      "publications.title": "Our Publications",
      "publications.intro": "The book is the most effective means of education and personal development; the book stands at the centre of Ranew Foundation's focus, and it gives particular attention to shaping thought through print and publications.",
      "publications.sub": "A selection of the foundation's published books.",
      "publications.p1.category": "Social",
      "publications.p1.title": "The Family in Islam",
      "publications.p1.desc": "This book explores the broad concept of family in Islam as a natural condition and the foundation of society's structure. It then examines the obstacles and destructive challenges facing the family today, including debates around feminism and gender, and behind them, the impact of homosexuality on the family. The book also explores several other sensitive topics, such as Islam's specific rulings on the family, including polygamy and misyar marriage.",
      "publications.p2.category": "Culture",
      "publications.p2.title": "\"Hawsangi\": Neither Negligence Nor Excess",
      "publications.p2.desc": "This book discusses balance (\"hawsangi\"), one of the most fundamental principles of Islam. In the author's view, most of humanity falls either into negligence, carelessness, and falling short, or into transgression, excess, and overreach. From this standpoint, the need for this book is greater now than ever.",
      "publications.p3.category": "Education",
      "publications.p3.title": "Towards Friendship and Cooperation Among Muslims",
      "publications.p3.desc": "This book addresses the necessity and importance of friendship, peace, and cooperation among members of society — particularly those who share a common faith identity (Muslims), since their beliefs require this of them above all else. It also discusses several afflictions that have caused division and estrangement among Muslims, and, consequently, their weakness.",
      "publications.p4.category": "Culture",
      "publications.p4.title": "There Is No Abrogated Verse in the Quran",
      "publications.p4.desc": "This book is an in-depth study of a sensitive topic much debated among scholars of the Quran: abrogation (naskh) — the idea that a verse or ruling of the Quran can be annulled by another verse. Through several studies and scientific Quranic evidence, the author demonstrates that no verse of the Quran has ever been abrogated, and that abrogation does not exist in the Quran.",
      "publications.p5.category": "Education",
      "publications.p5.title": "Tariq al-Salah wa al-Sayr ila Allah",
      "publications.p5.desc": "Purifying the soul — for which I chose the title \"Tariq al-Salah wa al-Sayr ila Allah\" (The Path of Righteousness and Journeying to God) — is a boundless sea, since the soul is connected, on one hand, to the spirit, which is one of God's secrets; once it enters the body it is called the soul (nafs), and it is praised or blamed according to the virtues and vices it carries. It is also connected, on another hand, to God, who has no likeness. In this book — the distillation of what I have come to understand and experience in this field — I have tried to shed considerable and varied light on the purification of the soul across ten chapters covering its many aspects. I hope that gracious readers will grasp what I have written on this deep, wide-ranging, and sensitive subject, and that they will honor me with their sincere remarks, for infallibility is guaranteed to none of us except through the Book of God and the Sunnah of His Messenger.",
      "publications.p6.category": "Education",
      "publications.p6.title": "Commentary and Evaluation of the Aphorisms of Ibn Ata'illah al-Sakandari",
      "publications.p6.desc": "An in-depth commentary and evaluation of the aphorisms of Ahmad ibn Ata'illah al-Sakandari. Originally delivered as thirty-three (33) lessons over a course. These aphorisms have long occupied scholars of spiritual purification (tazkiyah) and Sufism, who have explained and interpreted them extensively, and I too have benefited, to varying degrees, from some of those works. Perhaps the main distinction of this work, unlike all other commentaries, is that alongside the explanation and interpretation, I have also offered my own evaluation of a large number of the aphorisms.",
      "publications.p7.category": "Education",
      "publications.p7.title": "Self-Reflection",
      "publications.p7.desc": "As its title suggests, this book is a comprehensive, all-round self-reflection covering every area and aspect of our Muslim religiosity. I have tried, across all fields of outlook, being, faith, creed, worship, purification, piety, ethics, conduct, and personal, social, and political affairs, to place a finger on the pulse, and to lay out — through balanced, evidence-based reasoning far from negligence or excess — a clear roadmap and the general guidelines of sound, authentic Muslim practice.",

      "promo.eyebrow": "New Publication",
      "promo.title": "\"Hawsangi\" Book",
      "promo.desc": "One of our newest books, on building social awareness. Check it out in the Publications section.",
      "promo.cta": "View All Publications",

      "team.title": "Meet Our Team",
      "team.sub": "Here experience and innovation come together; the administrative team of Ranew works with the utmost dedication and responsibility to carry Ranew's message to every sphere of society.",
      "team.m1.initials": "M.J",
      "team.m1.name": "Mohammed Jamil",
      "team.m1.role": "Media & Communications Supervisor",
      "team.m2.initials": "Q.S",
      "team.m2.name": "Qasim Salam",
      "team.m2.role": "Books & Publishing Supervisor",
      "team.m3.initials": "S.B",
      "team.m3.name": "Shadi Ali Bapir",
      "team.m3.role": "Founder & Executive Director",
      "team.m4.initials": "N.A",
      "team.m4.name": "Nahro Ali",
      "team.m4.role": "Education & Training Supervisor",
      "team.m5.initials": "A.J",
      "team.m5.name": "Abdulrahman Jamal",
      "team.m5.role": "Administration & Finance Supervisor",
      "team.m6.initials": "A.A",
      "team.m6.name": "Aso Ali",
      "team.m6.role": "Sulaymaniyah Branch Supervisor",
      "team.m7.initials": "A.K",
      "team.m7.name": "Aland Kawa",
      "team.m7.role": "Technology",
      "team.m8.initials": "B.H",
      "team.m8.name": "Bryar Hussein",
      "team.m8.role": "Writing & Design",
      "team.m9.initials": "A.J",
      "team.m9.name": "Amin Jawhar",
      "team.m9.role": "Videographer, Editor",
      "team.m10.initials": "A.M",
      "team.m10.name": "Aram Mohammed",
      "team.m10.role": "Outreach Supervisor",

      "hero.eyebrow": "Non-Governmental, Non-Profit Organization · Erbil",
      "hero.title1": "Ranew Foundation",
      "hero.title2": "For Education & Culture",
      "hero.lead": "Education and personal development are two fundamental pillars of the vitality and progress of any society, and Ranew Foundation has taken the service of these two vital fields upon itself as its core duty and responsibility. We work to raise the level of education and culture through a wide range of publications, comprehensive visual and audio media, and pioneering educational projects — with the goal of building an individual who is aware, responsible, and impactful.",
      "hero.ctaContact": "Contact Us",
      "hero.ctaFacebook": "Visit Our Facebook Page",
      "hero.badgeAlt": "Ranew Foundation emblem",

      "stats.followers": "Facebook Followers",
      "stats.areas": "Core Activity Areas",
      "stats.talks": "Weekly Talks a Year",
      "stats.nonprofit": "Non-Profit & Community Service",

      "about.eyebrow": "About Us",
      "about.title": "A Non-Governmental Organization Serving Education & Culture",
      "about.p1": "Ranew Foundation (a non-governmental, non-profit organization) was established in Erbil with the goal of strengthening education and culture within society. Through weekly talks, educational activities, and cultural programs, we strive to contribute to the development of aware individuals and a strong community.",
      "about.p2": "Our work is shared primarily through our Facebook page, alongside in-person activities at our center in Erbil, Gulan 2, opposite Majidi Mall.",
      "about.check1": "Friday Talks — held every week",
      "about.check2": "Educational and cultural programs for all ages",
      "about.check3": "Non-profit community service",
      "about.cta": "Learn More",

      "programs.eyebrow": "Areas of Work",
      "programs.title": "Areas of Work",
      "programs.sub": "Three core, complementary areas serving the faith and life of the community.",
      "programs.card1.title": "Books & Publications",
      "programs.card1.desc": "Enriching the level of knowledge and culture, through printing and publishing books and printed material, and conducting scientific research and surveys.",
      "programs.card2.title": "Education & Development",
      "programs.card2.desc": "Nurturing the individual and strengthening the educational side, through preparing curricula and educational programmes, and field activities in courses and training, conferences and seminars.",
      "programs.card3.title": "Media & Communication",
      "programs.card3.desc": "Delivering a cultural and educational message on a wide scale, through producing visual and audio media content.",

      "values.eyebrow": "Our Values",
      "values.title": "The Values That Guide Us",
      "values.v1.title": "Truth",
      "values.v1.desc": "Precision in sound understanding, and honesty in conveying the message.",
      "values.v2.title": "Authenticity",
      "values.v2.desc": "Preserving our identity and an enduring commitment to lofty values and noble ethics.",
      "values.v3.title": "Balance",
      "values.v3.desc": "Following a middle path of thought — free from excess and from falling short.",
      "values.v4.title": "Preserving Culture",
      "values.v4.desc": "Protecting and developing our community's culture.",

      "contact.eyebrow": "Contact",
      "contact.title": "Get In Touch",
      "contact.address.label": "Address",
      "contact.address.value": "Erbil, Gulan 2, opposite Majidi Mall",
      "contact.phone.label": "Phone Number",
      "contact.email.label": "Email",
      "contact.facebook.label": "Facebook",
      "contact.donate.label": "Donate",
      "contact.donate.desc": "You can support us by sending a transfer to this phone number",
      "contact.mapTitle": "Map of Ranew Foundation's location",

      "footer.tagline": "For Education & Culture",
      "footer.copyright": "Ranew Foundation. All rights reserved."
    },

    /* ============== العربية ============== */
    ar: {
      "meta.title": "مؤسسة رانيو | للتربية والثقافة",
      "meta.description": "مؤسسة رانيو منظمة غير حكومية وغير ربحية مقرها أربيل، تعمل في مجال التربية والثقافة من خلال محاضرات أسبوعية وبرامج تعليمية وأنشطة مجتمعية.",

      "aria.facebook": "فيسبوك",
      "aria.navToggle": "فتح القائمة",
      "aria.backToTop": "العودة إلى الأعلى",

      "brand.logoAlt": "شعار مؤسسة رانيو",

      "nav.home": "الرئيسية",
      "nav.about": "من نحن",
      "nav.programs": "أنشطتنا",
      "nav.values": "قيمنا",
      "nav.publications": "المنشورات",
      "nav.team": "فريقنا",
      "nav.contact": "تواصل معنا",
      "header.followBtn": "تابعنا",

      "publications.meta.title": "المنشورات | مؤسسة رانيو",
      "publications.meta.description": "منشورات ومطبوعات مؤسسة رانيو.",
      "team.meta.title": "فريقنا | مؤسسة رانيو",
      "team.meta.description": "تعرف على فريق مؤسسة رانيو.",

      "publications.title": "منشوراتنا",
      "publications.intro": "الكتاب أنجع وسيلة للتربية والتنشئة؛ والكتاب هو محور تركيز مؤسسة رانيو الأساسي، وهي تولي عنايةً خاصة بتوجيه الفكر من خلال المطبوعات والإصدارات.",
      "publications.sub": "مجموعة مختارة من كتب المؤسسة المنشورة.",
      "publications.p1.category": "اجتماعي",
      "publications.p1.title": "الأسرة في الإسلام",
      "publications.p1.desc": "يتناول هذا الكتاب المفهوم الواسع للأسرة في الإسلام بوصفها الحالة الفطرية وأساس بنية المجتمع. ثم يتحدث عن العقبات والتحديات الهدّامة التي تواجهها في عصرنا الحالي، ومنها قضايا النسوية والجندر، وما وراءها من تأثير المثلية الجنسية على الأسرة. كما يتناول الكتاب عددًا من الموضوعات الحساسة الأخرى، مثل الأحكام الخاصة بالأسرة في الإسلام؛ كتعدد الزوجات وزواج المسيار.",
      "publications.p2.category": "ثقافي",
      "publications.p2.title": "\"هاوسەنگی\": لا تفريط ولا إفراط",
      "publications.p2.desc": "يتناول هذا الكتاب أحد أهم الشعارات الأساسية في الإسلام، وهو التوازن (هاوسەنگی). ويرى الكاتب أن أغلب البشر إمّا يقعون في التفريط والتهاون والتقصير، أو يقعون في تجاوز الحدود والإفراط والغلوّ. ومن هذا المنطلق، فإن الحاجة إلى هذا الكتاب أكبر من أي وقت مضى.",
      "publications.p3.category": "تربوي",
      "publications.p3.title": "نحو الأخوة والتعاون بين المسلمين",
      "publications.p3.desc": "يتناول هذا الكتاب ضرورة وأهمية الأخوة والسلام والتعاون بين أفراد المجتمع، وخاصة من تجمعهم هوية عقدية مشتركة (المسلمون)، إذ تقتضي عقيدتهم ذلك قبل كل شيء. كما يتناول الكتاب عددًا من الأدواء التي تسبّبت في تفرّق المسلمين وتباعدهم فيما بينهم، وما نتج عن ذلك من ضعفهم.",
      "publications.p4.category": "ثقافي",
      "publications.p4.title": "لا توجد آية منسوخة في القرآن",
      "publications.p4.desc": "هذا الكتاب دراسة معمّقة لموضوع حسّاس يثير جدلًا واسعًا بين الباحثين في القرآن؛ وهو موضوع النسخ، أي إبطال آية من آيات القرآن أو حكم من أحكامه بآية أخرى. ويُثبت المؤلف في هذا الكتاب، من خلال عدد من الدراسات والأدلة القرآنية العلمية، أنه لم تُنسخ أي آية من آيات القرآن، وأن النسخ لا وجود له في القرآن.",
      "publications.p5.category": "تربوي",
      "publications.p5.title": "طريق الصلاح والسير إلى الله",
      "publications.p5.desc": "إن َّ تزكية النفس والتي اخترت لها في هذا الكتاب عنوان: «طريق الصلاح والسير إلى الله» ، بَحْر لا ساحل له، وذلك لارتباطها من جانب بالروح التي هي سر من أسرار الله تعالى، وبعد دخولها في الجسد تسمى النفس، ويقع عليها المدح والقدح بحسب ما تحملة من الفضائل والرذائل. وكذلك لها ارتباط - من جانب آخر - بالله الذي ليس كمثله شيء. وحاولت في هذا الكتاب - الذي هو عصارة ما وصلت إليه من فهوم وخبرات في هذا المجال - تسليط أضواء كثيرة ومتعددة على تزكية النفس، في عشرة فصول بمختلف نواحيها، وآمل أن يستوعب القراء الكرام مضمون ما كتبته في هذا الموضوع الحساس العميق المترامي الأطراف، وأن يُتَّحِفوني بملاحظاتهم المخلصة، إذْ لَمْ تُصْمَن لنا العِصْمَةُ في غير كتاب الله وسنة رسول الله.",
      "publications.p6.category": "تربوي",
      "publications.p6.title": "شرح وتقييم حكم ابن عطاء الله السكندري",
      "publications.p6.desc": "شرح وتقييم معمّق لحكم أحمد بن عطاء الله السكندري. قُدِّمت أصلًا في ثلاثة وثلاثين (33) درسًا ضمن دورة واحدة. وتجدر الإشارة إلى أن هذه الحكم قد شغلت منذ زمن طويل علماء التزكية والتصوف، فشرحوها وفسّروها بشكل مستفيض، وقد استفدت أنا أيضًا بقدر ما من بعض تلك الكتب والأعمال. ولعلّ الميزة الأساسية لهذا العمل، خلافًا لسائر الشروح الأخرى، هي أنني إلى جانب الشرح والتفسير، قدّمت تقييمي الخاص لعدد كبير من هذه الحكم.",
      "publications.p7.category": "تربوي",
      "publications.p7.title": "محاسبة النفس",
      "publications.p7.desc": "هذا الكتاب، كما يتضح من عنوانه، هو محاسبة شاملة ومتعددة الجوانب لكل مجالات وأبعاد تديّننا كمسلمين. حاولت في جميع مجالات النظرة والوجود والإيمان والعقيدة والعبادة والتزكية والتقوى والأخلاق والسلوك، وشؤون الفرد والمجتمع والسياسة، أن أضع النقاط على الحروف، وأن أرسم – بأسلوب موضوعي متوازن بعيد عن التقصير والإفراط – خارطة طريق والخطوط العامة لتديّن إسلامي صحيح وسليم.",

      "promo.eyebrow": "منشور جديد",
      "promo.title": "كتاب \"هاوسەنگی\"",
      "promo.desc": "أحد أحدث كتبنا، يتناول بناء الوعي المجتمعي. شاهده في قسم المنشورات.",
      "promo.cta": "عرض جميع المنشورات",

      "team.title": "تعرف على فريقنا",
      "team.sub": "هنا تلتقي الخبرة بالإبداع؛ يعمل الفريق الإداري في مؤسسة رانيو بأقصى درجات الإخلاص والمسؤولية لإيصال رسالة رانيو إلى جميع مجالات المجتمع.",
      "team.m1.initials": "م.ج",
      "team.m1.name": "محمد جميل",
      "team.m1.role": "مشرف قسم الإعلام والتواصل",
      "team.m2.initials": "ق.س",
      "team.m2.name": "قاسم سلام",
      "team.m2.role": "مشرف قسم الكتب والنشر",
      "team.m3.initials": "ش.ب",
      "team.m3.name": "شادي علي بابير",
      "team.m3.role": "المؤسس والمدير التنفيذي",
      "team.m4.initials": "ن.ع",
      "team.m4.name": "نهرو علي",
      "team.m4.role": "مشرف قسم التربية والتأهيل",
      "team.m5.initials": "ع.ج",
      "team.m5.name": "عبدالرحمن جمال",
      "team.m5.role": "مشرف القسم الإداري والمالي",
      "team.m6.initials": "آ.ع",
      "team.m6.name": "آسو علي",
      "team.m6.role": "مشرف فرع السليمانية",
      "team.m7.initials": "أ.ك",
      "team.m7.name": "ألند كاوة",
      "team.m7.role": "التكنولوجيا",
      "team.m8.initials": "ب.ح",
      "team.m8.name": "بريار حسين",
      "team.m8.role": "الكتابة والتصميم",
      "team.m9.initials": "أ.ج",
      "team.m9.name": "أمين جوهر",
      "team.m9.role": "مصور فيديو، محرر",
      "team.m10.initials": "آ.م",
      "team.m10.name": "آرام محمد",
      "team.m10.role": "مشرف قسم التوعية",

      "hero.eyebrow": "منظمة غير حكومية وغير ربحية · أربيل",
      "hero.title1": "مؤسسة رانيو",
      "hero.title2": "للتربية والثقافة",
      "hero.lead": "التربية والتنشئة ركيزتان أساسيتان لبقاء أي مجتمع وتقدّمه، وقد أخذت مؤسسة رانيو على عاتقها خدمة هذين المجالين المهمّين، بوصف ذلك مهمتها ومسؤوليتها الأساسية. نعمل على رفع مستوى التربية والثقافة من خلال إصدارات متنوعة، وإعلام مرئي ومسموع شامل، ومشاريع تربوية رائدة؛ بهدف بناء فرد واعٍ ومسؤول ومؤثّر.",
      "hero.ctaContact": "تواصل معنا",
      "hero.ctaFacebook": "زيارة صفحتنا على فيسبوك",
      "hero.badgeAlt": "شعار مؤسسة رانيو",

      "stats.followers": "متابع على فيسبوك",
      "stats.areas": "مجالات عمل رئيسية",
      "stats.talks": "محاضرة أسبوعية سنويًا",
      "stats.nonprofit": "غير ربحية وخدمية",

      "about.eyebrow": "من نحن",
      "about.title": "منظمة غير حكومية في خدمة التربية والثقافة",
      "about.p1": "تأسست مؤسسة رانيو (منظمة غير حكومية وغير ربحية) في مدينة أربيل، بهدف تعزيز التربية والثقافة داخل المجتمع. ومن خلال المحاضرات والندوات الأسبوعية، والأنشطة التعليمية، والبرامج الثقافية، نسعى للمساهمة في بناء فرد واعٍ ومجتمع قوي.",
      "about.p2": "تُنشر أعمالنا بشكل رئيسي عبر صفحتنا على فيسبوك، إلى جانب الأنشطة المباشرة في مقرنا في أربيل، گولان 2، مقابل مجمع ماجدي مول.",
      "about.check1": "محاضرة الجمعة — أسبوعيًا بشكل مستمر",
      "about.check2": "برامج تعليمية وثقافية لجميع الأعمار",
      "about.check3": "خدمة مجتمعية غير ربحية",
      "about.cta": "لمزيد من المعلومات",

      "programs.eyebrow": "مجالات العمل",
      "programs.title": "مجالات العمل",
      "programs.sub": "ثلاثة مجالات رئيسية متكاملة لخدمة دين المجتمع وحياته.",
      "programs.card1.title": "الكتب والمطبوعات",
      "programs.card1.desc": "إثراء المستوى الثقافي والمعرفي، من خلال طباعة ونشر الكتب والمطبوعات، وإجراء البحوث العلمية والاستطلاعات.",
      "programs.card2.title": "التربية والتنشئة",
      "programs.card2.desc": "بناء الفرد وتقوية الجانب التربوي، من خلال إعداد المناهج والبرامج التربوية، والأنشطة الميدانية من دورات وتدريبات وندوات ومؤتمرات.",
      "programs.card3.title": "الإعلام والاتصال",
      "programs.card3.desc": "إيصال الرسالة الثقافية والتربوية على نطاق واسع، من خلال إنتاج محتوى إعلامي مرئي ومسموع.",

      "values.eyebrow": "قيمنا",
      "values.title": "القيم التي توجّهنا",
      "values.v1.title": "الصدق",
      "values.v1.desc": "الدقة في الفهم الصحيح والصدق في إيصال الرسالة.",
      "values.v2.title": "الأصالة",
      "values.v2.desc": "الحفاظ على الهوية والالتزام الدائم بالقيم والأخلاق السامية.",
      "values.v3.title": "التوازن",
      "values.v3.desc": "اتّباع فكر وسطي؛ بعيدًا عن الإفراط والتفريط.",
      "values.v4.title": "الحفاظ على الثقافة",
      "values.v4.desc": "الحفاظ على ثقافة المجتمع وتطويرها.",

      "contact.eyebrow": "تواصل معنا",
      "contact.title": "تواصل معنا",
      "contact.address.label": "العنوان",
      "contact.address.value": "أربيل، گولان 2، مقابل مجمع ماجدي مول",
      "contact.phone.label": "رقم الهاتف",
      "contact.email.label": "البريد الإلكتروني",
      "contact.facebook.label": "فيسبوك",
      "contact.donate.label": "التبرع",
      "contact.donate.desc": "يمكنك دعمنا عبر إرسال تحويل إلى رقم الهاتف هذا",
      "contact.mapTitle": "خريطة موقع مؤسسة رانيو",

      "footer.tagline": "للتربية والثقافة",
      "footer.copyright": "مؤسسة رانيو. جميع الحقوق محفوظة."
    }
  };

  function applyLanguage(lang) {
    if (!translations[lang]) lang = "ckb";
    var dict = translations[lang];

    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", DIR[lang]);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var spec = el.getAttribute("data-i18n-attr");
      spec.split(";").forEach(function (pair) {
        var parts = pair.split(":");
        var attr = parts[0];
        var key = parts[1];
        if (attr && key && dict[key] !== undefined) el.setAttribute(attr, dict[key]);
      });
    });

    var page = document.body.getAttribute("data-page");
    var titleKey = page ? page + ".meta.title" : "meta.title";
    var descKey = page ? page + ".meta.description" : "meta.description";
    if (dict[titleKey]) document.title = dict[titleKey];
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict[descKey]) metaDesc.setAttribute("content", dict[descKey]);

    document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  var switchBtns = document.querySelectorAll(".lang-switch__btn");
  switchBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLanguage(btn.getAttribute("data-lang"));
    });
  });

  var savedLang = "ckb";
  try { savedLang = localStorage.getItem(STORAGE_KEY) || "ckb"; } catch (e) {}
  applyLanguage(savedLang);
})();
