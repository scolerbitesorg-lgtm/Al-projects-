export interface HindiQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  options: string[];
  category: string;
  difficulty: 'सरल' | 'मध्यम' | 'कठिन';
}

export const HINDI_QUESTIONS_BANK: HindiQuestion[] = [
  {
    question: "भारत का राष्ट्रीय जलीय जीव (National Aquatic Animal) कौन सा है?",
    correct_answer: "गंगा नदी डॉल्फ़िन (Ganges River Dolphin)",
    incorrect_answers: ["नीली व्हेल", "घड़ियाल", "गोल्डन महाशीर"],
    options: ["नीली व्हेल", "गंगा नदी डॉल्फ़िन (Ganges River Dolphin)", "घड़ियाल", "गोल्डन महाशीर"],
    category: "पर्यावरण व जीव-जंतु",
    difficulty: "सरल"
  },
  {
    question: "सौरमंडल का सबसे गर्म ग्रह (Hottest Planet) कौन सा है?",
    correct_answer: "शुक्र (Venus)",
    incorrect_answers: ["बुध (Mercury)", "मंगल (Mars)", "बृहस्पति (Jupiter)"],
    options: ["बुध (Mercury)", "शुक्र (Venus)", "मंगल (Mars)", "बृहस्पति (Jupiter)"],
    category: "अंतरिक्ष व खगोल विज्ञान",
    difficulty: "सरल"
  },
  {
    question: "कंप्यूटर विज्ञान में 'CPU' का पूर्ण रूप (Full Form) क्या होता है?",
    correct_answer: "सेंट्रल प्रोसेसिंग यूनिट (Central Processing Unit)",
    incorrect_answers: ["सेंट्रल प्रोग्राम यूनिट", "कंप्यूटर पावर यूनिट", "कोर प्रोसेसिंग यूटिलिटी"],
    options: ["सेंट्रल प्रोग्राम यूनिट", "सेंट्रल प्रोसेसिंग यूनिट (Central Processing Unit)", "कंप्यूटर पावर यूनिट", "कोर प्रोसेसिंग यूटिलिटी"],
    category: "कंप्यूटर व प्रौद्योगिकी",
    difficulty: "सरल"
  },
  {
    question: "भारतीय संविधान का जनक (Father of Indian Constitution) किसे माना जाता है?",
    correct_answer: "डॉ. भीमराव अंबेडकर",
    incorrect_answers: ["महात्मा गांधी", "पंडित जवाहरलाल नेहरू", "सरदार वल्लभभाई पटेल"],
    options: ["महात्मा गांधी", "डॉ. भीमराव अंबेडकर", "पंडित जवाहरलाल नेहरू", "सरदार वल्लभभाई पटेल"],
    category: "भारतीय संविधान व इतिहास",
    difficulty: "सरल"
  },
  {
    question: "सूर्य के प्रकाश को पृथ्वी तक पहुँचने में लगभग कितना समय लगता है?",
    correct_answer: "8 मिनट 20 सेकंड",
    incorrect_answers: ["5 मिनट 10 सेकंड", "12 मिनट 30 सेकंड", "1 मिनट 15 सेकंड"],
    options: ["5 मिनट 10 सेकंड", "8 मिनट 20 सेकंड", "12 मिनट 30 सेकंड", "1 मिनट 15 सेकंड"],
    category: "भौतिक विज्ञान (Physics)",
    difficulty: "मध्यम"
  },
  {
    question: "विश्व की सबसे लम्बी नदी कौन सी है?",
    correct_answer: "नील नदी (Nile River)",
    incorrect_answers: ["अमेज़न नदी", "गंगा नदी", "यांग्त्से नदी"],
    options: ["अमेज़न नदी", "नील नदी (Nile River)", "गंगा नदी", "यांग्त्से नदी"],
    category: "भूगोल (Geography)",
    difficulty: "सरल"
  },
  {
    question: "नोबेल पुरस्कार जीतने वाले प्रथम भारतीय कौन थे?",
    correct_answer: "रवींद्रनाथ टैगोर (1913, साहित्य)",
    incorrect_answers: ["सी. वी. रमन", "मदर टेरेसा", "अमर्त्य सेन"],
    options: ["सी. वी. रमन", "रवींद्रनाथ टैगोर (1913, साहित्य)", "मदर टेरेसा", "अमर्त्य सेन"],
    category: "भारतीय इतिहास व संस्कृति",
    difficulty: "मध्यम"
  },
  {
    question: "मानव शरीर की सबसे बड़ी ग्रंथि (Largest Gland) कौन सी है?",
    correct_answer: "यकृत (Liver)",
    incorrect_answers: ["अग्न्याशय (Pancreas)", "थायरॉयड (Thyroid)", "पीयूष ग्रंथि (Pituitary)"],
    options: ["अग्न्याशय (Pancreas)", "यकृत (Liver)", "थायरॉयड (Thyroid)", "पीयूष ग्रंथि (Pituitary)"],
    category: "जीव विज्ञान (Biology)",
    difficulty: "सरल"
  },
  {
    question: "भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) का मुख्यालय किस शहर में स्थित है?",
    correct_answer: "बेंगलुरु (Bengaluru)",
    incorrect_answers: ["नई दिल्ली", "श्रीहरिकोटा", "तिरुवनंतपुरम"],
    options: ["नई दिल्ली", "बेंगलुरु (Bengaluru)", "श्रीहरिकोटा", "तिरुवनंतपुरम"],
    category: "विज्ञान व अनुसंधान",
    difficulty: "सरल"
  },
  {
    question: "क्षेत्रफल की दृष्टि से भारत का सबसे बड़ा राज्य कौन सा है?",
    correct_answer: "राजस्थान",
    incorrect_answers: ["मध्य प्रदेश", "उत्तर प्रदेश", "महाराष्ट्र"],
    options: ["मध्य प्रदेश", "राजस्थान", "उत्तर प्रदेश", "महाराष्ट्र"],
    category: "भारतीय भूगोल",
    difficulty: "सरल"
  },
  {
    question: "गुरुत्वाकर्षण (Gravity) के सार्वभौमिक नियम की खोज किस वैज्ञानिक ने की थी?",
    correct_answer: "सर आइजैक न्यूटन",
    incorrect_answers: ["अल्बर्ट आइंस्टीन", "गैलीलियो गैलीली", "निकोला टेस्ला"],
    options: ["अल्बर्ट आइंस्टीन", "सर आइजैक न्यूटन", "गैलीलियो गैलीली", "निकोला टेस्ला"],
    category: "भौतिक विज्ञान",
    difficulty: "सरल"
  },
  {
    question: "भारत में 'सिलिकॉन वैली' (Silicon Valley of India) के उपनाम से किसे जाना जाता है?",
    correct_answer: "बेंगलुरु",
    incorrect_answers: ["हैदराबाद", "पुणे", "गुरुग्राम"],
    options: ["हैदराबाद", "बेंगलुरु", "पुणे", "गुरुग्राम"],
    category: "प्रौद्योगिकी व व्यापार",
    difficulty: "सरल"
  },
  {
    question: "लाल रक्त कोशिकाओं (Red Blood Cells - RBC) का जीवनकाल लगभग कितने दिन होता है?",
    correct_answer: "120 दिन",
    incorrect_answers: ["30 दिन", "60 दिन", "365 दिन"],
    options: ["30 दिन", "60 दिन", "120 दिन", "365 दिन"],
    category: "मानव शरीर व स्वास्थ्य",
    difficulty: "मध्यम"
  },
  {
    question: "काजीरंगा राष्ट्रीय उद्यान (Kaziranga National Park) किस राज्य में स्थित है?",
    correct_answer: "असम",
    incorrect_answers: ["पश्चिम बंगाल", "मध्य प्रदेश", "उत्तराखंड"],
    options: ["पश्चिम बंगाल", "असम", "मध्य प्रदेश", "उत्तराखंड"],
    category: "पर्यावरण व वन्यजीव",
    difficulty: "सरल"
  },
  {
    question: "क्रिकेट विश्व कप का पहला संस्करण किस वर्ष में आयोजित हुआ था?",
    correct_answer: "1975",
    incorrect_answers: ["1979", "1983", "1971"],
    options: ["1971", "1975", "1979", "1983"],
    category: "खेल कूद (Sports)",
    difficulty: "मध्यम"
  },
  {
    question: "मानव रक्त का सामान्य pH मान (Normal pH Value) लगभग कितना होता है?",
    correct_answer: "7.4 (हल्का क्षारीय)",
    incorrect_answers: ["6.2 (अम्लीय)", "8.5 (अत्यधिक क्षारीय)", "7.0 (उदासीन)"],
    options: ["6.2 (अम्लीय)", "7.0 (उदासीन)", "7.4 (हल्का क्षारीय)", "8.5 (अत्यधिक क्षारीय)"],
    category: "रसायन विज्ञान (Chemistry)",
    difficulty: "मध्यम"
  },
  {
    question: "भारत का सर्वोच्च नागरिक पुरस्कार कौन सा है?",
    correct_answer: "भारत रत्न",
    incorrect_answers: ["पद्म विभूषण", "परमवीर चक्र", "अशोक चक्र"],
    options: ["पद्म विभूषण", "भारत रत्न", "परमवीर चक्र", "अशोक चक्र"],
    category: "भारतीय राष्ट्रीय पुरस्कार",
    difficulty: "सरल"
  },
  {
    question: "अंतरिक्ष में जाने वाले प्रथम भारतीय अंतरिक्ष यात्री कौन थे?",
    correct_answer: "विंग कमांडर राकेश शर्मा (1984)",
    incorrect_answers: ["कल्पना चावला", "सुनीता विलियम्स", "विक्रम साराभाई"],
    options: ["कल्पना चावला", "विंग कमांडर राकेश शर्मा (1984)", "सुनीता विलियम्स", "विक्रम साराभाई"],
    category: "अंतरिक्ष व खगोल विज्ञान",
    difficulty: "सरल"
  },
  {
    question: "कंप्यूटर में बाइनरी संख्या प्रणाली (Binary Number System) में कौन से दो अंक होते हैं?",
    correct_answer: "0 और 1",
    incorrect_answers: ["1 और 2", "0 और 9", "A और B"],
    options: ["1 और 2", "0 और 1", "0 और 9", "A और B"],
    category: "कंप्यूटर व आईटी",
    difficulty: "सरल"
  },
  {
    question: "विटामिन C का सबसे प्रचुर प्राकृतिक स्रोत कौन सा माना जाता है?",
    correct_answer: "आँवला (Indian Gooseberry)",
    incorrect_answers: ["सेब", "केला", "गाजर"],
    options: ["सेब", "आँवला (Indian Gooseberry)", "केला", "गाजर"],
    category: "स्वास्थ्य व पोषण",
    difficulty: "सरल"
  },
  {
    question: "भारत में राष्ट्रीय विज्ञान दिवस (National Science Day) किस वैज्ञानिक के उपलक्ष्य में 28 फरवरी को मनाया जाता है?",
    correct_answer: "सर सी. वी. रमन (रमन प्रभाव की खोज)",
    incorrect_answers: ["डॉ. होमी जहांगीर भाभा", "डॉ. एपीजे अब्दुल कलाम", "श्रीनिवास रामानुजन"],
    options: ["डॉ. होमी जहांगीर भाभा", "सर सी. वी. रमन (रमन प्रभाव की खोज)", "डॉ. एपीजे अब्दुल कलाम", "श्रीनिवास रामानुजन"],
    category: "भारतीय विज्ञान दिवस",
    difficulty: "मध्यम"
  },
  {
    question: "भारतीय संसद के दोनों सदनों में से 'उच्च सदन' (Upper House) किसे कहा जाता है?",
    correct_answer: "राज्यसभा",
    incorrect_answers: ["लोकसभा", "विधान परिषद", "केंद्रीय सचिवालय"],
    options: ["लोकसभा", "राज्यसभा", "विधान परिषद", "केंद्रीय सचिवालय"],
    category: "भारतीय राजव्यवस्था",
    difficulty: "सरल"
  }
];
