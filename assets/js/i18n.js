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
      "about.p2": "کارەکانمان بەشێوەیەکی سەرەکی لەسەر تۆڕی کۆمەڵایەتی فەیسبووک بڵاو دەکرێنەوە، جگە لە بوارەکانی کاری ڕاستەوخۆ لە بنکەمان لە هەولێر، گوڵان 2، بەرامبەر ماجیدی مۆڵ.",
      "about.check1": "ڕاستی — ڕاستی لە تێگەیشتنی دروستدا بەرجەستە دەبێت.",
      "about.check2": "ڕەسەنایەتی — پابەندبوونە بە بەها باڵاکان و ئاکارە پەسندەکانەوە.",
      "about.check3": "هاوسەنگی — هزرێکە کە نە تێدەپەڕێنێت و نە کورت هەڵدەهێنێت.",
      "about.cta": "بۆ زانیاریی زیاتر",

      "programs.eyebrow": "بوارەکانی کارمان",
      "programs.title": "بوارەکانی کارمان",
      "programs.sub": "سێ بواری سەرەکی، بۆ گەیشتن بە ئامانجی دامەزراوە لە خزمەتکردنی کۆمەڵگا.",
      "programs.card1.title": "وتاری هەینی",
      "programs.card1.desc": "وتار و ئاخاوتنی هەفتانە کە ڕوانگەیەکی ڕۆشنبیری و ئەخلاقی بۆ کۆمەڵگا فراهەم دەکات و بەردەوام بڵاو دەکرێتەوە.",
      "programs.card2.title": "بەرنامەی پەروەردەیی",
      "programs.card2.desc": "چالاکی فێرکاری کە ئاستی زانیاری و ئاگاداری کۆمەڵگا بەرز دەکاتەوە، بۆ گەنجان و بچووک و گەورە.",
      "programs.card3.title": "چالاکی ڕۆشنبیری",
      "programs.card3.desc": "پرۆگرام و بۆنەی ڕۆشنبیری کە کەلتوور و بەهاکانی کۆمەڵگا دەپارێزێت و پەرەی پێ دەدات.",

      "values.eyebrow": "ئامانجی ئێمە",
      "values.title": "ئەو بەهایانەی ڕێنماییمان دەکەن",
      "values.v1.title": "ڕاستگۆیی",
      "values.v1.desc": "شەفافیەت و ئەمانەت لە هەموو بوارەکانی کارمان.",
      "values.v2.title": "خزمەتی کۆمەڵگا",
      "values.v2.desc": "کۆمەڵگا لە ناوەڕاستی هەموو بەرنامەیەکماندایە.",
      "values.v3.title": "فێربوونی بەردەوام",
      "values.v3.desc": "پاڵنەرمان بۆ زانیاری و پەروەردەی بەردەوامە.",
      "values.v4.title": "پاراستنی کەلتوور",
      "values.v4.desc": "پاراستن و پەرەپێدانی ڕۆشنبیری کۆمەڵگا.",

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
      "nav.contact": "تواصل معنا",
      "header.followBtn": "تابعنا",

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
