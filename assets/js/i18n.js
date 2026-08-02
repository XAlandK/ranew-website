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
      "nav.about": "لەبارەی ئێمە",
      "nav.programs": "بوارەکانی کار",
      "nav.values": "ئامانجی ئێمە",
      "nav.contact": "پەیوەندی",
      "header.followBtn": "شوێنمان بکەوە",

      "hero.eyebrow": "ڕێکخراوێکی ناحکومی و ناقازانجخواز · هەولێر",
      "hero.title1": "دامەزراوەی ڕەنێو",
      "hero.title2": "بۆ پەروەردە و ڕۆشنبیری",
      "hero.lead": "کار لەسەر پەرەپێدانی ئاستی پەروەردە و ڕۆشنبیری لە کۆمەڵگا دەکەین، لە ڕێگەی وتاری هەفتانە، بەرنامەی فێرکاری و چالاکی کۆمەڵایەتی، بە ئامانجی بونیادنانی کۆمەڵگایەکی ئاگادار و بەرپرسیار.",
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
      "about.check1": "ڕاستی — ڕاستی لە تێگەیشتنی دروستدا بەرجەستە دەبێت.",
      "about.check2": "هاوسەنگی — هزرێکە کە نە تێدەپەڕێنێت و نە کورت هەڵدەهێنێت.",
      "about.check3": "ڕەسەنایەتی — پابەندبوونە بە بەها باڵاکان و ئاکارە پەسندەکانەوە.",
      "about.cta": "بۆ زانیاری زیاتر",

      "programs.eyebrow": "بوارەکانی کارمان",
      "programs.title": "بوارەکانی کارمان",
      "programs.sub": "سێ بواری سەرەکی، بۆ گەیشتن بە ئامانجی دامەزراوە لە خزمەتکردنی کۆمەڵگا.",
      "programs.card1.title": "کتێب و چاپەمەنی",
      "programs.card1.desc": "چاپکردن و بڵاوکردنەوەی کتێب و بڵاوکراوە، لەگەڵ ئەنجامدانی توێژینەوەی زانستی و ڕاپرسی، کە زانیاری و ڕۆشنبیری کۆمەڵگا دەوڵەمەند دەکات.",
      "programs.card2.title": "پەروەردە و پێگەیاندن",
      "programs.card2.desc": "ئامادەکردنی پەیڕەو و پڕۆگرامی پەروەردەیی، لەگەڵ چالاکی مەیدانی وەک ڕاهێنان، کۆڕ و کۆڕبەند و سیمینار، کە پێگەیاندنی تاک و بەهێزکردنی کۆمەڵگا دەخاتە ئامانج.",
      "programs.card3.title": "میدیا و ڕاگەیاندن",
      "programs.card3.desc": "بەرهەمهێنانی ناوەڕۆکی میدیای بینراو و بیستراو، کە پەیامێکی ڕۆشنبیری و پەروەردەیی بە شێوەیەکی فراوان دەگەیەنێت بە کۆمەڵگا.",

      "values.eyebrow": "ئامانجی ئێمە",
      "values.title": "ئەو بەهایانەی ڕێنماییمان دەکەن",
      "values.v1.title": "خزمەتکردنی گشتی",
      "values.v1.desc": "خزمەتکردنی گشتی بۆ کۆمەڵگا، بەبێ چاوەڕوانی قازانج.",
      "values.v2.title": "پەروەردەی بەردەوام",
      "values.v2.desc": "بەردەوامین لە پەروەردەکردن و بەرزکردنەوەی ئاستی زانیاری کۆمەڵگا.",
      "values.v3.title": "پاراستنی زمان",
      "values.v3.desc": "پاراستن و پەرەپێدانی زمان، وەک بنەمایەکی سەرەکی ناسنامەی کۆمەڵگا.",

      "contact.eyebrow": "پەیوەندی",
      "contact.title": "پەیوەندیمان پێوە بکە",
      "contact.sub": "خۆشحاڵ دەبین ببیستین لێت، یان بیانیت لە هەر یەکێک لە بوارەکانی کارماندا.",
      "contact.address.label": "ناونیشان",
      "contact.address.value": "هەولێر، گوڵان 2، بەرامبەر ماجیدی مۆڵ",
      "contact.phone.label": "ژمارەی مۆبایل",
      "contact.email.label": "ئیمەیل",
      "contact.facebook.label": "میدیای کۆمەڵایەتی",

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
      "nav.about": "About Us",
      "nav.programs": "Activities",
      "nav.values": "Our Values",
      "nav.contact": "Contact",
      "header.followBtn": "Follow Us",

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
      "about.check1": "Truth — truth is embodied in correct understanding.",
      "about.check2": "Balance — a mindset that neither goes to excess nor falls short.",
      "about.check3": "Authenticity — commitment to noble values and commendable conduct.",
      "about.cta": "Learn More",

      "programs.eyebrow": "Our Activities",
      "programs.title": "Our Areas of Work",
      "programs.sub": "Three core areas that drive our mission of serving the community.",
      "programs.card1.title": "Books & Publications",
      "programs.card1.desc": "Printing and publishing books and publications, alongside scientific research and surveys, that enrich the community's knowledge and culture.",
      "programs.card2.title": "Education & Training",
      "programs.card2.desc": "Preparing curricula and educational programs, along with field activities such as training, conferences, and seminars, aimed at developing individuals and strengthening the community.",
      "programs.card3.title": "Media & Broadcasting",
      "programs.card3.desc": "Producing audio-visual media content that carries a cultural and educational message broadly to the community.",

      "values.eyebrow": "Our Values",
      "values.title": "The Values That Guide Us",
      "values.v1.title": "Public Service",
      "values.v1.desc": "Serving the community at large, without expecting anything in return.",
      "values.v2.title": "Continuous Education",
      "values.v2.desc": "We are committed to ongoing education and raising community awareness.",
      "values.v3.title": "Language Preservation",
      "values.v3.desc": "Protecting and developing our language as a core part of our identity.",

      "contact.eyebrow": "Contact",
      "contact.title": "Get In Touch",
      "contact.sub": "We'd love to hear from you, or see you at one of our activities.",
      "contact.address.label": "Address",
      "contact.address.value": "Erbil, Gulan 2, opposite Majidi Mall",
      "contact.phone.label": "Phone Number",
      "contact.email.label": "Email",
      "contact.facebook.label": "Social Media",

      "footer.tagline": "For Education & Culture",
      "footer.copyright": "Ranew Foundation. All rights reserved."
    },

    /* ============== العربية ============== */
    ar: {
      "meta.title": "مؤسسة ڕەنێو | للتربية والثقافة",
      "meta.description": "مؤسسة ڕەنێو منظمة غير حكومية وغير ربحية مقرها أربيل، تعمل في مجال التربية والثقافة من خلال محاضرات أسبوعية وبرامج تعليمية وأنشطة مجتمعية.",

      "aria.facebook": "فيسبوك",
      "aria.navToggle": "فتح القائمة",
      "aria.backToTop": "العودة إلى الأعلى",

      "brand.logoAlt": "شعار مؤسسة ڕەنێو",

      "nav.home": "الرئيسية",
      "nav.about": "من نحن",
      "nav.programs": "أنشطتنا",
      "nav.values": "قيمنا",
      "nav.contact": "تواصل معنا",
      "header.followBtn": "تابعنا",

      "hero.eyebrow": "منظمة غير حكومية وغير ربحية · أربيل",
      "hero.title1": "مؤسسة ڕەنێو",
      "hero.title2": "للتربية والثقافة",
      "hero.lead": "نعمل على تطوير مستوى التربية والثقافة في المجتمع من خلال المحاضرات الأسبوعية والبرامج التعليمية والأنشطة المجتمعية، بهدف بناء مجتمع واعٍ ومسؤول.",
      "hero.ctaContact": "تواصل معنا",
      "hero.ctaFacebook": "زيارة صفحتنا على فيسبوك",
      "hero.badgeAlt": "شعار مؤسسة ڕەنێو",

      "stats.followers": "متابع على فيسبوك",
      "stats.areas": "مجالات عمل رئيسية",
      "stats.talks": "محاضرة أسبوعية سنويًا",
      "stats.nonprofit": "غير ربحية وخدمية",

      "about.eyebrow": "من نحن",
      "about.title": "منظمة غير حكومية في خدمة التربية والثقافة",
      "about.p1": "تأسست مؤسسة ڕەنێو (منظمة غير حكومية وغير ربحية) في مدينة أربيل، بهدف تعزيز التربية والثقافة داخل المجتمع. ومن خلال المحاضرات والندوات الأسبوعية، والأنشطة التعليمية، والبرامج الثقافية، نسعى للمساهمة في بناء فرد واعٍ ومجتمع قوي.",
      "about.check1": "الحقيقة — تتجسّد الحقيقة في الفهم الصحيح.",
      "about.check2": "التوازن — فكرٌ لا يُفرط ولا يقصّر.",
      "about.check3": "الأصالة — الالتزام بالقيم السامية والأخلاق الحميدة.",
      "about.cta": "لمزيد من المعلومات",

      "programs.eyebrow": "أنشطتنا",
      "programs.title": "مجالات عملنا",
      "programs.sub": "ثلاثة مجالات رئيسية لتحقيق أهداف المؤسسة في خدمة المجتمع.",
      "programs.card1.title": "الكتب والمطبوعات",
      "programs.card1.desc": "طباعة ونشر الكتب والمطبوعات، إلى جانب إجراء البحث العلمي والاستطلاعات، بما يُثري معرفة المجتمع وثقافته.",
      "programs.card2.title": "التعليم والتأهيل",
      "programs.card2.desc": "إعداد المناهج والبرامج التعليمية، إلى جانب الأنشطة الميدانية كالتدريب والمؤتمرات والندوات، بهدف تأهيل الأفراد وتقوية المجتمع.",
      "programs.card3.title": "الإعلام والبث",
      "programs.card3.desc": "إنتاج محتوى إعلامي مرئي ومسموع، يوصل رسالة ثقافية وتربوية على نطاق واسع للمجتمع.",

      "values.eyebrow": "قيمنا",
      "values.title": "القيم التي توجّهنا",
      "values.v1.title": "الخدمة العامة",
      "values.v1.desc": "خدمة المجتمع بشكل عام، دون انتظار مقابل.",
      "values.v2.title": "التعليم المستمر",
      "values.v2.desc": "نلتزم بالتعليم المستمر ورفع مستوى الوعي في المجتمع.",
      "values.v3.title": "الحفاظ على اللغة",
      "values.v3.desc": "الحفاظ على اللغة وتطويرها كجزء أساسي من هويتنا.",

      "contact.eyebrow": "تواصل معنا",
      "contact.title": "تواصل معنا",
      "contact.sub": "يسعدنا أن نسمع منك، أو أن نراك في إحدى أنشطتنا.",
      "contact.address.label": "العنوان",
      "contact.address.value": "أربيل، گولان 2، مقابل مجمع ماجدي مول",
      "contact.phone.label": "رقم الهاتف",
      "contact.email.label": "البريد الإلكتروني",
      "contact.facebook.label": "وسائل التواصل الاجتماعي",

      "footer.tagline": "للتربية والثقافة",
      "footer.copyright": "مؤسسة ڕەنێو. جميع الحقوق محفوظة."
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

    if (dict["meta.title"]) document.title = dict["meta.title"];
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict["meta.description"]) metaDesc.setAttribute("content", dict["meta.description"]);

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
