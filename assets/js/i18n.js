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
      "publications.sub": "هەندێک لە کتێبە بڵاوکراوەکانی دامەزراوە.",
      "publications.p1.category": "کۆمەڵایەتی",
      "publications.p1.title": "خێزان لە ئیسلامدا",
      "publications.p1.desc": "ئەم کتێبە باسی چەمکی فراوانی خێزان دەکات لە ئیسلامدا، کە باری سروشتی و بناغە و بونیادی کۆمەڵگەیە. پاشان باس لە کۆسپ و ڕێگرە هەڵوەشێنەرەوەکانی دەکات لە ڕۆژگاری ئێستادا، لە نێوانیاندا بابەتەکانی فێمینیزم و جێندەر، لە پشت ئەوانیشەوە هاوڕەگەزبازی و کاریگەرییان لەسەر خێزان دەخاتە ڕوو. لەم بەرهەمەدا کۆمەڵێک باسی دیکەی هەستیار توێژراونەتەوە، وەک بارە تایبەتەکانی خێزان لە ئیسلامدا؛ چەندژنی (فرەژنی) و هاوسەرگیریی میسیار.",
      "publications.p2.category": "ڕۆشنبیری",
      "publications.p2.title": "هاوسەنگی: نە بەزایەدان، نە تێپەڕاندن",
      "publications.p2.desc": "ئەم کتێبە باسی یەکێک لە دروشمە هەرە بنەڕەتییەکانیئیسلام دەکات کە هاوسەنگییە. بە بڕوای نووسەر، بەزۆری مرۆڤایەتی یان تووشی بەزایەدان و کەمتەرخەمی و کورتھێنان دەبن، یان تووشی سنووربەزاندن و زێدەڕۆیی و تێنووسانی زۆر دەبن. لەم سۆنگەیەوە، پێویستیی ئەم کتێبە لە هەر کاتێکی دیکەدا زیاترە.",
      "publications.p3.category": "پەروەردەیی",
      "publications.p3.title": "بەرەو دۆستایەتی و هاوکاریی نێوان مسوڵمانان",
      "publications.p3.desc": "ئەم کتێبە باسی پێویستی و گرنگیی دۆستایەتی و ئاشتی و هاوکاریی نێوان تاکەکانی کۆمەڵگەیە، بەتایبەت ئەو کەسانەی کە ناسنامەی باوەڕیان هاوبەشە (مسوڵمانن)، لەبەر ئەوەی بەر لە هەموو شتێک بیروباوەڕیان ئەوە لەسەریان پێویست دەکات. ئەم کتێبە باسی چەند دەرد و نەخۆشییەکیش دەکات کە بوونەتە هۆی پەرتەوازەیی و لێکدوورکەوتنەوەی مسوڵمانان لە نێوان خۆیاندا و لە ئەنجامدا بێهێزبوونیان باس دەکات.",
      "publications.p4.category": "بڵاوکراوە",
      "publications.p4.title": "هیچ ئایەتێکی مەنسووخ لە قوڕئاندا نییە",
      "publications.p4.desc": "ئەم کتێبە لێکۆڵینەوەیەکی پشوودرێژانەیە لە بابەتێکی هەستیار کە جێی ڕاجیاییە لە نێوان لێکۆڵەرانی قورئان؛ بابەتی نەسخ، واتە هەڵوەشاندنەوەی ئایەتێکی قورئان یاخود حوکمێکی قورئان بەهۆی ئایەتێکی دیکەوە. نووسەر لەم کتێبەدا لەڕێی چەند لێکۆڵینەوە و بەڵگەیەکی زانستیی قورئانەوە ئەوە دەسەلمێنێت کە هیچ ئایەتێکی قورئان نەسخ نەکراوە و نەسخ لە قورئاندا بوونی نییە.",
      "publications.p5.category": "بڵاوکراوە",
      "publications.p5.title": "طريق الصلاح والسير إلى الله",
      "publications.p5.desc": "إن َّ تزكية النفس والتي اخترت لها في هذا الكتاب عنوان: «طريق الصلاح والسير إلى الله» ، بَحْر لا ساحل له، وذلك لارتباطها من جانب بالروح التي هي سر من أسرار الله تعالى، وبعد دخولها في الجسد تسمى النفس، ويقع عليها المدح والقدح بحسب ما تحملة من الفضائل والرذائل. وكذلك لها ارتباط - من جانب آخر - بالله ال الذي ليس كمثله شيء. وحاولت في هذا الكتاب - الذي هو عصارة ما وصلت إليه من فهوم وخبرات في هذا المجال - تسليط أضواء كثيرة ومتعددة على تزكية النفس، في عشرة فصول بمختلف نواحيها، وآمل أن يستوعب الفراء الكرام مضمون ما كتبته في هذا الموضوع الحساس العميق المترامي الأطراف، وأن يُتَّحِفوني بملاحظاتهم المخلصة، إذْ لَمْ تُصْمَن لنا العِصْمَةُ في غير كتاب الله وسنة رسول الله.",
      "publications.p6.category": "بڵاوکراوە",
      "publications.p6.title": "ڕوونکردنەوە و هەڵسەنگاندنی حیکمەتەکانی 'ابن عطاء الله السكندري'",
      "publications.p6.desc": "ڕوونکردنەوە و هەڵسەنگاندنێکی پشوودرێژانەیە بۆ حیکمەتەکانی ئەحمەد کوڕی عەتائوڵڵای سەکنندەری. لە بنەڕەتدا سی و سێ (٣٣) دەرس بوون و لە خوولێکدا پێشکەش کراون. شایەنی باسیشە ئەو حیکمەتانە لەمێژە زانایانی بواری تەزکیە و تەسەووف بە ڕوونکردنەوە و لێکدانەوەیانەوە سەرقاڵن و شەرحی زۆریان کراون، کەم و زۆریش سوودم لە بەشێک لەو کتێب و بەرهەمانە وەرگرتووە. ڕەنگە ئیمتیاز و جیاوازیی سەرەکیی ئەم بەرهەمە ئەوە بێت بەپێچەوانەی سەرجەم شەرحەکانی دیکەوە، وێڕای ڕوونکردنەوە و لێکدانەوە، هەڵسەنگاندنم بۆ ژمارەیەکی زۆر لە حیکمەتەکان کردووە.",
      "publications.p7.category": "بڵاوکراوە",
      "publications.p7.title": "چاوبەخۆداگێڕانەوە",
      "publications.p7.desc": "ئەم کتێبە وەک لە ناونیشانەکەشیەوە دیارە چاو بەخۆداگێڕانەوەیەکی گشتگیر و هەمەلایەنەیە بۆ کۆی بوار و لایەنەکانی دینداریی مسوڵمانانمان. هەوڵم داوە لە سەرجەم بوارەکانی تێڕوانین و بوونناسی و ئیمان و عەقیدە و خواپەرستی و تەزکییە و تەقوا و ڕەوشت و ئاکار و کاروباری کەسێتی و کۆمەڵایەتی و سیاسیدا، نوختە بخەمە سەر پیت و بە شێوەیەکی بەڵگەیی هاوسەنگانەی دوور لە کورتھێنان و تێپەڕاندن، نەخشەڕێ و هێڵە گشتییەکانی موسڵمانێتییەکی ڕاست و ساغ بخەمە ڕوو.",

      "team.title": "ئەندامانی تیمەکەمان",
      "team.sub": "ئەو کەسانەی بە پەرۆشەوە کار لەسەر ئامانجەکانی دامەزراوە دەکەن.",
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
      "team.m5.name": "عەبدولڕەحمان جەمال",
      "team.m5.role": "سەرپەرشتی بەشی کارگێڕی و دارایی",
      "team.m6.initials": "ش.ع",
      "team.m6.name": "ئاسۆ عەلی",
      "team.m6.role": "سەرپەرشتیاری بەشی سلێمانی",
      "team.m7.initials": "د.س",
      "team.m7.name": "ئەلەند کاوە",
      "team.m7.role": "تەکنەلۆجیا",
      "team.m8.initials": "ل.ف",
      "team.m8.name": "بڕیار حوسێن",
      "team.m8.role": "ڕێنووس و هەڵەچنین",
      "team.m9.initials": "ئـ.ج",
      "team.m9.name": "ئەمین جەوهەر",
      "team.m9.role": "ڤیدیۆگراف، ئیدیتەر",
      "team.m10.initials": "ب.ت",
      "team.m10.name": "ئارام موحەممەد",
      "team.m10.role": "سەرپەرشتی بەشی ڕاپەڕین",

      "hero.eyebrow": "ڕێکخراوێکی ناحکومی و ناقازانجخواز · هەولێر",
      "hero.title1": "دامەزراوەی ڕەنێو",
      "hero.title2": "بۆ پەروەردە و ڕۆشنبیری",
      "hero.lead": "کار لەسەر پەرەپێدانی ئاستی پەروەردە و ڕۆشنبیری لە کۆمەڵگە دەکەین، لە ڕێگەی وتاری هەفتانە، بەرنامەی فێرکاری و چالاکی کۆمەڵایەتی، بە ئامانجی بونیادنانی کۆمەڵگەیەکی ئاگادار و بەرپرسیار.",
      "hero.ctaContact": "پەیوەندیمان پێوە بکە",
      "hero.ctaFacebook": "بینینی پەیجی فەیسبووک",
      "hero.badgeAlt": "نیشانی دامەزراوەی ڕەنێو",

      "stats.followers": "شوێنکەوتووی فەیسبووک",
      "stats.areas": "بواری سەرەکی چالاکی",
      "stats.talks": "وتاری هەفتانە ساڵانە",
      "stats.nonprofit": "ناقازانجخواز و خزمەتگوزاری",

      "about.eyebrow": "لەبارەی ئێمە",
      "about.title": "ڕەنێو دەمەزراوەیەکی قازانجنەویستی ناحکومییە، کار لەسەر ڕەهەندەکانی پەروەردە و ڕۆشنبیری دەکات",
      "about.p1": "ڕەنێو هەوڵ دەدات کە کۆمەڵگەیەک بنیات بنێت کە تاکەکانی خاوەن عەقڵێکی هۆشیار و دڵێکی بێدار و ئاکارجوان و ڕەوشتپەسندن، بۆ پەروەردگاریان فەرمانبەری ڕاستن و لەگەڵ یەکدا چاکەکار و دڵسۆزن.",
      "about.p2": "کارەکانمان بەشێوەیەکی سەرەکی لەسەر تۆڕی کۆمەڵایەتی فەیسبووک بڵاو دەکرێنەوە، جگە لە بوارەکانی کاری ڕاستەوخۆ لە بنکەمان لە هەولێر، گوڵان 2، بەرامبەر ماجیدی مۆڵ.",
      "about.check1": "ڕاستی — ڕاستی لە تێگەیشتنی دروستدا بەرجەستە دەبێت.",
      "about.check2": "ڕەسەنایەتی — پابەندبوونە بە بەها باڵاکان و ئاکارە پەسندەکانەوە.",
      "about.check3": "هاوسەنگی — هزرێکە کە نە تێدەپەڕێنێت و نە کورت هەڵدەهێنێت.",
      "about.cta": "بۆ زانیاریی زیاتر",

      "programs.eyebrow": "بوارەکانی کارمان",
      "programs.title": "بوارەکانی کارمان",
      "programs.sub": "سێ بواری سەرەکی، بۆ گەیشتن بە ئامانجی دامەزراوە لە خزمەتکردنی کۆمەڵگە.",
      "programs.card1.title": "وتاری هەینی",
      "programs.card1.desc": "وتار و ئاخاوتنی هەفتانە کە ڕوانگەیەکی ڕۆشنبیری و ئەخلاقی بۆ کۆمەڵگە فراهەم دەکات و بەردەوام بڵاو دەکرێتەوە.",
      "programs.card2.title": "بەرنامەی پەروەردەیی",
      "programs.card2.desc": "چالاکی فێرکاری کە ئاستی زانیاری و ئاگاداری کۆمەڵگە بەرز دەکاتەوە، بۆ گەنجان و بچووک و گەورە.",
      "programs.card3.title": "چالاکی ڕۆشنبیری",
      "programs.card3.desc": "پرۆگرام و بۆنەی ڕۆشنبیری کە کەلتوور و بەهاکانی کۆمەڵگە دەپارێزێت و پەرەی پێ دەدات.",

      "values.eyebrow": "ئامانجی ئێمە",
      "values.title": "ئەو بەهایانەی ڕێنماییمان دەکەن",
      "values.v1.title": "ڕاستگۆیی",
      "values.v1.desc": "شەفافیەت و ئەمانەت لە هەموو بوارەکانی کارمان.",
      "values.v2.title": "خزمەتی کۆمەڵگە",
      "values.v2.desc": "کۆمەڵگە لە ناوەڕاستی هەموو بەرنامەیەکماندایە.",
      "values.v3.title": "فێربوونی بەردەوام",
      "values.v3.desc": "پاڵنەرمان بۆ زانیاری و پەروەردەی بەردەوامە.",
      "values.v4.title": "پاراستنی کەلتوور",
      "values.v4.desc": "پاراستن و پەرەپێدانی ڕۆشنبیری کۆمەڵگە.",

      "contact.eyebrow": "پەیوەندی",
      "contact.title": "پەیوەندیمان پێوە بکە",
      "contact.sub": "خۆشحاڵ دەبین ببیستین لێت، یان بیانیت لە هەر یەکێک لە بوارەکانی کارماندا.",
      "contact.address.label": "ناونیشان",
      "contact.address.value": "هەولێر، گوڵان 2، بەرامبەر ماجیدی مۆڵ",
      "contact.phone.label": "ژمارەی مۆبایل",
      "contact.email.label": "ئیمەیل",
      "contact.facebook.label": "فەیسبووک",
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
      "publications.sub": "A selection of the foundation's published books.",
      "publications.p1.category": "Social",
      "publications.p1.title": "Guide to Social Awareness",
      "publications.p1.desc": "A book exploring the foundations of social awareness and individual responsibility within the community.",
      "publications.p2.category": "Culture",
      "publications.p2.title": "Friday Talks Collection",
      "publications.p2.desc": "A curated collection of the foundation's best weekly talks, gathered into a single volume.",
      "publications.p3.category": "Education",
      "publications.p3.title": "The Path of Education",
      "publications.p3.desc": "A book on effective approaches to upbringing and education at home and in school.",
      "publications.p4.category": "Publication",
      "publications.p4.title": "Book Title",
      "publications.p4.desc": "Description coming soon.",
      "publications.p5.category": "Publication",
      "publications.p5.title": "Book Title",
      "publications.p5.desc": "Description coming soon.",
      "publications.p6.category": "Publication",
      "publications.p6.title": "Book Title",
      "publications.p6.desc": "Description coming soon.",
      "publications.p7.category": "Publication",
      "publications.p7.title": "Book Title",
      "publications.p7.desc": "Description coming soon.",

      "team.title": "Meet Our Team",
      "team.sub": "The people working with passion toward the foundation's mission.",
      "team.m1.initials": "A.M",
      "team.m1.name": "Aras Mohammed",
      "team.m1.role": "Founder & General Director",
      "team.m2.initials": "S.A",
      "team.m2.name": "Sara Ahmed",
      "team.m2.role": "Programs Manager",
      "team.m3.initials": "K.R",
      "team.m3.name": "Karwan Rashid",
      "team.m3.role": "Media & Communications Manager",
      "team.m4.initials": "R.A",
      "team.m4.name": "Rojin Ali",
      "team.m4.role": "Activities Coordinator",
      "team.m5.initials": "H.K",
      "team.m5.name": "Hemin Karim",
      "team.m5.role": "Finance Supervisor",
      "team.m6.initials": "S.O",
      "team.m6.name": "Shna Osman",
      "team.m6.role": "HR Manager",
      "team.m7.initials": "D.S",
      "team.m7.name": "Didar Salar",
      "team.m7.role": "Projects Coordinator",
      "team.m8.initials": "L.F",
      "team.m8.name": "Lana Faraj",
      "team.m8.role": "IT Manager",
      "team.m9.initials": "A.J",
      "team.m9.name": "Awat Jalal",
      "team.m9.role": "Volunteer Coordinator",
      "team.m10.initials": "B.T",
      "team.m10.name": "Bayan Tawfiq",
      "team.m10.role": "Public Relations Officer",

      "hero.eyebrow": "Non-Governmental, Non-Profit Organization · Erbil",
      "hero.title1": "Ranew Foundation",
      "hero.title2": "For Education & Culture",
      "hero.lead": "We work to advance education and cultural awareness in society through weekly talks, educational programs, and community activities — with the goal of building an informed, responsible community.",
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

      "programs.eyebrow": "Our Activities",
      "programs.title": "Our Areas of Work",
      "programs.sub": "Three core areas that drive our mission of serving the community.",
      "programs.card1.title": "Friday Talks",
      "programs.card1.desc": "Weekly talks and lectures that offer a cultural and ethical perspective to the community, published regularly.",
      "programs.card2.title": "Educational Programs",
      "programs.card2.desc": "Educational activities that raise the community's level of knowledge and awareness, for young and old alike.",
      "programs.card3.title": "Cultural Activities",
      "programs.card3.desc": "Cultural programs and events that preserve and develop the community's culture and values.",

      "values.eyebrow": "Our Values",
      "values.title": "The Values That Guide Us",
      "values.v1.title": "Integrity",
      "values.v1.desc": "Transparency and trustworthiness in everything we do.",
      "values.v2.title": "Community Service",
      "values.v2.desc": "The community is at the heart of every program we run.",
      "values.v3.title": "Continuous Learning",
      "values.v3.desc": "We are driven by a commitment to ongoing knowledge and education.",
      "values.v4.title": "Preserving Culture",
      "values.v4.desc": "Protecting and developing our community's culture.",

      "contact.eyebrow": "Contact",
      "contact.title": "Get In Touch",
      "contact.sub": "We'd love to hear from you, or see you at one of our activities.",
      "contact.address.label": "Address",
      "contact.address.value": "Erbil, Gulan 2, opposite Majidi Mall",
      "contact.phone.label": "Phone Number",
      "contact.email.label": "Email",
      "contact.facebook.label": "Facebook",
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
      "publications.sub": "مجموعة مختارة من كتب المؤسسة المنشورة.",
      "publications.p1.category": "اجتماعي",
      "publications.p1.title": "دليل الوعي المجتمعي",
      "publications.p1.desc": "كتاب يستعرض أسس الوعي المجتمعي والمسؤولية الفردية تجاه المجتمع.",
      "publications.p2.category": "ثقافي",
      "publications.p2.title": "مجموعة محاضرات الجمعة",
      "publications.p2.desc": "مجموعة مختارة من أفضل المحاضرات الأسبوعية للمؤسسة، جُمعت في كتاب واحد.",
      "publications.p3.category": "تربوي",
      "publications.p3.title": "طريق التربية",
      "publications.p3.desc": "كتاب حول الأساليب الناجحة للتربية في المنزل والمدرسة.",
      "publications.p4.category": "منشور",
      "publications.p4.title": "عنوان الكتاب",
      "publications.p4.desc": "سيتم إضافة التفاصيل قريبًا.",
      "publications.p5.category": "منشور",
      "publications.p5.title": "عنوان الكتاب",
      "publications.p5.desc": "سيتم إضافة التفاصيل قريبًا.",
      "publications.p6.category": "منشور",
      "publications.p6.title": "عنوان الكتاب",
      "publications.p6.desc": "سيتم إضافة التفاصيل قريبًا.",
      "publications.p7.category": "منشور",
      "publications.p7.title": "عنوان الكتاب",
      "publications.p7.desc": "سيتم إضافة التفاصيل قريبًا.",

      "team.title": "تعرف على فريقنا",
      "team.sub": "الأشخاص الذين يعملون بشغف لتحقيق أهداف المؤسسة.",
      "team.m1.initials": "آ.م",
      "team.m1.name": "آراس محمد",
      "team.m1.role": "المؤسس والمدير العام",
      "team.m2.initials": "س.أ",
      "team.m2.name": "سارة أحمد",
      "team.m2.role": "مديرة البرامج",
      "team.m3.initials": "ك.ر",
      "team.m3.name": "كاروان رشيد",
      "team.m3.role": "مدير الإعلام والتواصل",
      "team.m4.initials": "ر.ع",
      "team.m4.name": "روژین علي",
      "team.m4.role": "منسقة الأنشطة",
      "team.m5.initials": "هـ.ك",
      "team.m5.name": "هيمن كريم",
      "team.m5.role": "المشرف المالي",
      "team.m6.initials": "ش.ع",
      "team.m6.name": "شنه عثمان",
      "team.m6.role": "مديرة الموارد البشرية",
      "team.m7.initials": "د.س",
      "team.m7.name": "ديدار سالار",
      "team.m7.role": "منسق المشاريع",
      "team.m8.initials": "ل.ف",
      "team.m8.name": "لانه فرج",
      "team.m8.role": "مدير تقنية المعلومات",
      "team.m9.initials": "أ.ج",
      "team.m9.name": "أوات جلال",
      "team.m9.role": "منسقة المتطوعين",
      "team.m10.initials": "ب.ت",
      "team.m10.name": "بيان توفيق",
      "team.m10.role": "مسؤولة العلاقات العامة",

      "hero.eyebrow": "منظمة غير حكومية وغير ربحية · أربيل",
      "hero.title1": "مؤسسة رانيو",
      "hero.title2": "للتربية والثقافة",
      "hero.lead": "نعمل على تطوير مستوى التربية والثقافة في المجتمع من خلال المحاضرات الأسبوعية والبرامج التعليمية والأنشطة المجتمعية، بهدف بناء مجتمع واعٍ ومسؤول.",
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

      "programs.eyebrow": "أنشطتنا",
      "programs.title": "مجالات عملنا",
      "programs.sub": "ثلاثة مجالات رئيسية لتحقيق أهداف المؤسسة في خدمة المجتمع.",
      "programs.card1.title": "محاضرة الجمعة",
      "programs.card1.desc": "محاضرات وندوات أسبوعية تقدّم رؤية ثقافية وأخلاقية للمجتمع، تُنشر بشكل مستمر.",
      "programs.card2.title": "برامج تعليمية",
      "programs.card2.desc": "أنشطة تعليمية ترفع من مستوى المعرفة والوعي في المجتمع، للشباب والصغار والكبار.",
      "programs.card3.title": "أنشطة ثقافية",
      "programs.card3.desc": "برامج وفعاليات ثقافية تحافظ على قيم وثقافة المجتمع وتطورها.",

      "values.eyebrow": "قيمنا",
      "values.title": "القيم التي توجّهنا",
      "values.v1.title": "الصدق",
      "values.v1.desc": "الشفافية والأمانة في جميع أنشطتنا.",
      "values.v2.title": "خدمة المجتمع",
      "values.v2.desc": "المجتمع هو محور كل برنامج نقوم به.",
      "values.v3.title": "التعلّم المستمر",
      "values.v3.desc": "دافعنا هو المعرفة والتعليم المستمر.",
      "values.v4.title": "الحفاظ على الثقافة",
      "values.v4.desc": "الحفاظ على ثقافة المجتمع وتطويرها.",

      "contact.eyebrow": "تواصل معنا",
      "contact.title": "تواصل معنا",
      "contact.sub": "يسعدنا أن نسمع منك، أو أن نراك في إحدى أنشطتنا.",
      "contact.address.label": "العنوان",
      "contact.address.value": "أربيل، گولان 2، مقابل مجمع ماجدي مول",
      "contact.phone.label": "رقم الهاتف",
      "contact.email.label": "البريد الإلكتروني",
      "contact.facebook.label": "فيسبوك",
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
