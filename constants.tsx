
import { Language } from "./types";

export const getSystemInstruction = (lang: Language) => `أنت معلمة رياضيات ذكية متخصصة في شرح مناهج المرحلة الاعدادية في جمهورية مصر العربية.

${lang === 'ar' ? 
  `مهمتك الأساسية هي الشرح باللغة العربية (اللهجة المصرية البيضاء البسيطة المفهومة للطلاب).` : 
  `Your primary task is to explain in English (for Language Schools in Egypt), using simple and clear educational language.`}

منطق التعامل مع الصور:
1. إذا كانت الصورة تحتوي على صفحة بها عدة مسائل:
   - ابحثي أولاً عن أي علامة تمييز (دائرة حول مسألة، تظليل، تهشير، سهم، أو كتابة رقم مسألة محددة). إذا وجدتِ تمييزاً، قومي بحل هذه المسألة المحددة فقط.
   - إذا لم يوجد أي تمييز، قومي بحل جميع المسائل الموجودة في الصورة بالترتيب من الأعلى إلى الأسفل.
2. قدمي الحل دائماً بأسلوب تربوي مشجع.

مهمتك الأساسية:
- حل مسائل الرياضيات المدرسية.
- شرح الحل بأسلوب معلمة حقيقية ودودة داخل الفصل.
- تقديم الحل في أقسام منظمة بدقة.

التزم دائمًا بما يلي:
1. فهم الطالب: الطالب في المرحلة الاعدادية، لغته بسيطة، يحتاج تشجيع وتحفيز.
2. المنهج المصري: استخدم الطرق المعتمدة في كتب الوزارة المصرية حصراً.
3. أسلوب الشرح: جمل قصيرة، لغة سهلة، نبرة مشجعة.
4. تنظيم المخرجات: يجب أن يكون الرد بتنسيق JSON حصراً يحتوي على الحقول التالية:
   - understanding: (فهم المسألة) صياغة المعطيات والمطلوب (أو المسائل المطلوبة).
   - textSteps: (خطوات الحل النصي) مصفوفة من السلاسل النصية للحل.
   - audioScript: (الشرح الصوتي) نص مخصص للتحويل لصوت.
   - whiteboardSteps: (تعليمات الوايتبورد) مصفوفة من الأجسام {content: string, color: 'blue' | 'black' | 'green'}.
   - finalResult: (النتيجة النهائية) الإجابة النهائية مع كلمة تشجيعية.

قواعد صارمة:
- لا تظهر أي تفكير داخلي.
- لا تستخدم رموز جامعية.
- المعطيات في الوايتبورد تكون باللون الأزرق، الحسابات بالأسود، والنتيجة النهائية بالأخضر.
- الرد يجب أن يكون بالكامل بلغة الطالب المختارة (${lang === 'ar' ? 'العربية' : 'English'}).
`;

export const TRANSLATIONS = {
  ar: {
    title: "الأستاذة: معلمة الرياضيات",
    subtitle: "مساعدتكِ الذكية للمرحلة الإعدادية 🇪🇬",
    motto: '"الرياضيات ممتعة وسهلة معانا"',
    statusReady: "جاهزة للمساعدة",
    statusThinking: "تُفكر...",
    statusExplainingText: "تشرح الحل النصي...",
    statusExplainingBoard: "تشرح البورد...",
    modeText: "⌨️ كتابة أو لصق المسألة",
    modeVoice: "🎙️ تحدثي بصوتكِ",
    modeCamera: "📸 تصوير المسألة",
    placeholder: "اكتبي المسألة هنا أو الصقي صورة.. (يمكنك تمييز مسألة محددة بدائرة أو تظليل)",
    previewImage: "معاينة الصورة المرفقة:",
    solveBtn: "ابدئي الحل يا أستاذة ✍️",
    solving: "جاري التفكير والحل..",
    understandingHeader: "1️⃣ فهم المسألة",
    stepsHeader: "2️⃣ خطوات الحل النصي",
    whiteboardHeader: "3️⃣ شرح الأستاذة على الوايتبورد",
    whiteboardSub: "اضغط على زر البدء في السبورة لمشاهدة الخطوات.. ستبدأ المعلمة الشرح فور اكتمال الكتابة",
    finalHeader: "4️⃣ النتيجة النهائية",
    errorInput: "من فضلك اكتبي المسألة، أو الصقي صورة، أو التقطي صورة لها.",
    errorGeneral: "حدث خطأ أثناء محاولة حل المسألة. حاولي مرة أخرى.",
    toolsTitle: "أدوات هندسية",
    circle: "الدائرة",
    triangle: "المثلث",
    square: "المربع",
    algebra: "الجبر",
    pi: "النسبة التقريبية",
    whiteboardStart: "ابدأ شرح المعلمة على السبورة 👩‍🏫",
    whiteboardWriting: "المعلمة تكتب الآن...",
    whiteboardExplaining: "المعلمة تشرح الحل الآن...",
    whiteboardFooter: "الوايتبورد الذكية التفاعلية",
    whiteboardCurriculum: "المنهج المصري - شرح تفاعلي",
    dir: "rtl" as const
  },
  en: {
    title: "The Teacher: Math Assistant",
    subtitle: "Your Smart Assistant for Middle School 🇪🇬",
    motto: '"Math is fun and easy with us"',
    statusReady: "Ready to help",
    statusThinking: "Thinking...",
    statusExplainingText: "Explaining text solution...",
    statusExplainingBoard: "Explaining on board...",
    modeText: "⌨️ Type or Paste Problem",
    modeVoice: "🎙️ Speak Your Voice",
    modeCamera: "📸 Take a Photo",
    placeholder: "Type the problem or paste an image.. (You can circle or highlight a specific problem)",
    previewImage: "Attached image preview:",
    solveBtn: "Start Solving, Teacher ✍️",
    solving: "Thinking and Solving..",
    understandingHeader: "1️⃣ Understanding the Problem",
    stepsHeader: "2️⃣ Text Solution Steps",
    whiteboardHeader: "3️⃣ Teacher's Explanation on Whiteboard",
    whiteboardSub: "Click start on the board to see steps.. The teacher will explain once writing is complete",
    finalHeader: "4️⃣ Final Result",
    errorInput: "Please type the problem, paste an image, or take a photo.",
    errorGeneral: "An error occurred while solving. Please try again.",
    toolsTitle: "Geometry Tools",
    circle: "Circle",
    triangle: "Triangle",
    square: "Square",
    algebra: "Algebra",
    pi: "Pi (π)",
    whiteboardStart: "Start Teacher's Explanation 👩‍🏫",
    whiteboardWriting: "Teacher is writing...",
    whiteboardExplaining: "Teacher is explaining...",
    whiteboardFooter: "Interactive Smart Whiteboard",
    whiteboardCurriculum: "Egyptian Curriculum - Interactive",
    dir: "ltr" as const
  }
};

export const UI_COLORS = {
  blue: 'text-blue-600',
  black: 'text-gray-900',
  green: 'text-green-600'
};
