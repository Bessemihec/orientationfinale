// Mots à ignorer pour l'extraction des spécialités
export const ignoreWords = [
    'le', 'la', 'les', 'du', 'de', 'des', 'un', 'une', 'au', 'aux', 'à', 'd\'',
    'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'me', 'te', 'se',
    'lui', 'leur', 'y', 'en', 'ce', 'cet', 'cette', 'ces',
    'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'nos',
    'votre', 'vos', 'leur', 'leurs',
    'suis', 'es', 'est', 'sommes', 'êtes', 'sont', 'ai', 'as', 'a', 'avons', 'avez', 'ont',
    'serai', 'seras', 'sera', 'serons', 'serez', 'seront', 'étais', 'était', 'étions',
    'étiez', 'étaient', 'avoir', 'être', 'faire', 'aller', 'pouvoir', 'vouloir', 'devoir',
    'savoir', 'voir', 'dire', 'venir', 'prendre', 'donner', 'mettre', 'parler',
    'veux', 'voudrais', 'aimerais', 'souhaite', 'préfère', 'cherche', 'recherche',
    'intéresse', 'intéressé', 'intéressée', "interesse",'intéréssé','intéresse','intersse','aime', 'adore', 'déteste', 'préfère',
    'sujet', 'domaine', 'spécialité', 'filière', 'branche', 'secteur', 'carrière', 'métier',"beaucoupe",
    'profession', 'orientation', 'étude', 'études','j\'aime','de',"lire","par","suivre",
    'étudier', 'apprendre', 'travailler', 'devenir', 'faire', 'exercer', 'pratiquer',"beaucoup",
    'the', 'a', 'an', 'some', 'any', 'this', 'that', 'these', 'those','consulter',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers',
    'ours', 'theirs',"wanna","follow",
    'am', 'is', 'are', 'was', 'were', 'be', 'being', 'been', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'can', 'could', 'should', 'may', 'might',
    'must', 'shall',
    'want', 'would', 'like', 'wish', 'prefer', 'seek', 'search', 'look',
    'interested', 'interest', 'love', 'hate', 'enjoy',
    'subject', 'field', 'specialty', 'branch', 'sector', 'career', 'job',
    'profession', 'orientation', 'study', 'studies',
    'study', 'learn', 'work', 'become', 'do', 'practice', 'exercise',
    'ال', 'بال', 'لل', 'ولل', 'فال', 'كال', 'ب', 'ل', 'ك', 'و', 'ف', 'س', 'أ',
    'أنا', 'أنت', 'أنتِ', 'هو', 'هي', 'نحن', 'أنتم', 'أنتن', 'هم', 'هن',
    'لي', 'لك', 'له', 'لها', 'لنا', 'لكم', 'لهم',
    'ي', 'ك', 'ه', 'ها', 'نا', 'كم', 'هم', 'اريد',
    'أكون', 'تكون', 'يكون', 'نكون', 'تكونوا', 'يكونوا',
    'أملك', 'تملك', 'يملك', 'نملك', 'تملكوا', 'يملكوا',
    'أفعل', 'تفعل', 'يفعل', 'نفعل', 'تفعلوا', 'يفعلوا',
    'أذهب', 'تذهب', 'يذهب', 'نذهب', 'تذهبوا', 'يذهبوا',
    'أستطيع', 'تستطيع', 'يستطيع', 'نستطيع', 'تستطيعوا', 'يستطيعوا',
    'أريد', 'تريد', 'يريد', 'نريد', 'تريدوا', 'يريدوا',
    'أعرف', 'تعرف', 'يعرف', 'نعرف', 'تعرفوا', 'يعرفوا',
    'أرى', 'ترى', 'يرى', 'نرى', 'تروا', 'يروا',
    'أرغب', 'ترغب', 'يرغب', 'نرغب', 'ترغبوا', 'يرغبوا',
    'أتمنى', 'تتمنى', 'يتمنى', 'نتمنى', 'تتمنوا', 'يتمنوا',
    'أحب', 'تحب', 'يحب', 'نحب', 'تحبوا', 'يحبوا',
    'أفضل', 'تفضل', 'يفضل', 'نفضل', 'تفضلوا', 'يفضلوا',
    'أبحث', 'تبحث', 'يبحث', 'نبحث', 'تبحثوا', 'يبحثوا',
    'مهتم', 'مهتمة', 'مهتمون', 'مهتمات', 'ارغب',"في",
    'مجال', 'تخصص', 'فرع', 'مهنة', 'وظيفة', 'حرفة', 'مسار',
    'توجيه', 'دراسة', 'دراسات',"commencer"
];

// Mots à ignorer pour l'orientation
export const orientationIgnoreWords = [
    'je', 'veux', 'étudier', 'faire', 'devenir', 'souhaite', 'aime', 'préfère', 'voudrais',
    'أريد', 'دراسة', 'أن', 'أصبح', 'أحب', 'أتوجه', 'أفضل', 'أود',
    'i', 'want', 'to', 'study', 'become', 'like', 'prefer', 'would'
];

// Patterns pour la détection des types de requêtes - CORRIGÉS
export const requestPatterns = {
    orientation: [
        'je veux étudier', 'je veux la spécialité', 'je veux faire', 
        'j\'aime étudier', 'je souhaite étudier', 'je veux devenir',
        'je veux m\'orienter', 'je veux apprendre', 'je souhaite devenir',
        'je préfère', 'je voudrais', 'je désire',
        'أريد دراسة', 'أريد التخصص', 'أريد أن أصبح', 'أحب دراسة',
        'أتوجه نحو', 'أرغب في دراسة', 'أتمنى دراسة', 'أحلم بأن أصبح',
        'أفضل دراسة', 'أود دراسة',
        'i want to study', 'i want the specialty', 'i want to become',
        'i like to study', 'i wish to study', 'i prefer to study',
        'i would like to study', 'i love to study'
    ],

    data: [
        // Français - Noms
        'données', 'informations', 'détails', 'notes', 'moyennes',
        'résultats', 'scores', 'évaluations', 'bulletins', 'relevés',
        'espagnol', 'allemand', 'espagnole', 'allemande', 'espagnol/allemand',
        'espagnol ou allemand', 'langue espagnole', 'langue allemande',
        'italien', 'italienne', 'langue italienne',
        
        // Arabe - أسماء
        'بيانات', 'معلومات', 'تفاصيل', 'درجات', 'معدلات',
        'نتائج', 'تقارير', 'كشوف', 'سجلات', 'تقارير دراسية',
        'إسباني', 'ألماني', 'لغة إسبانية', 'لغة ألمانية',
        'إيطالي', 'لغة إيطالية',
        
        // Anglais - Nouns
        'data', 'information', 'details', 'grades', 'averages',
        'results', 'scores', 'evaluations', 'reports', 'records',
        'spanish', 'german', 'spanish/german', 'spanish or german',
        'spanish language', 'german language', 'italian'
    ],

    list: [
        // Français - Noms
        'liste', 'list', 'la liste', 'les listes', 'tous', 'toutes', 'list',
        'quelles', 'quels', 'spécialités', 'formations', 'filières',
        'domaines', 'cours', 'programmes', 'études', 'branches',
        'sections', 'départements', 'matières', 'options', 'parcours',
        'voies', 'séries', 'universités', 'écoles', 'facultés',
        'instituts', 'lycées', 'centres', 'académies',
        
        // Arabe - أسماء
        'قائمة', 'لائحة', 'قوائم', 'لوائح', 'الكل', 'الكل',
        'ما', 'أي', 'تخصصات', 'تكوينات', 'فروع', 'مجالات', 'دورات',
        'برامج', 'دراسات', 'تخصصات', 'أقسام', 'مواد', 'خيارات',
        'مسارات', 'طرق', 'سلاسل', 'جامعات', 'مدارس', 'كليات',
        'معاهد', 'ثانويات', 'مراكز', 'أكاديميات',
        
        // Anglais - Nouns
        'list', 'all', 'any', 'every', 'which', 'what',
        'specialties', 'specializations', 'majors', 'programs',
        'courses', 'fields', 'degrees', 'studies', 'departments',
        'subjects', 'options', 'tracks', 'paths', 'streams',
        'universities', 'schools', 'colleges', 'institutes',
        'faculties', 'academies', 'institutions'
    ],

    dataKeywords: [
        'allemand', 'allemande', 'ألماني', 'ألمانية', 'german',
        'espagnol', 'espagnole', 'إسباني', 'إسبانية', 'spanish',
        'italien', 'italienne', 'إيطالي', 'إيطالية', 'italian',
        'note', 'notes', 'grade', 'grades', 'moyenne', 'moyennes', 'score',
        'درجة', 'درجات', 'علامة', 'علامات', 'معدل', 'نتيجة',
        'mg', 'fg', 'email', 'bac', 'ville', 'username',
        'بريد', 'ايميل', 'بكالوريا', 'مدينة', 'اسم المستخدم',
        'arabe', 'français', 'anglais', 'math', 'رياضيات', 'فيزياء',
        'عربية', 'فرنسية', 'انجليزية', 'رياضيات', 'تاريخ', 'جغرافيا'
    ],

    orientationKeywords: [
        // Français - Noms
        'orientation', 'spécialité', 'formation', 'étude', 'carrière',
        'métier', 'profession', 'domaine', 'branche', 'filière',
        'parcours', 'voie', 'secteur', 'spécialisation', 'expertise',
        
        // Arabe - أسماء
        'توجيه', 'تخصص', 'تكوين', 'دراسة', 'مهنة',
        'وظيفة', 'ميدان', 'فرع', 'مسار', 'مجال',
        'تخصص دقيق', 'خبرة', 'شهادة', 'شعب', 'مسالك',
        
        // Anglais - Nouns
        'orientation', 'specialty', 'training', 'study', 'career',
        'profession', 'field', 'branch', 'pathway', 'sector',
        'specialization', 'expertise', 'degree', 'major', 'stream'
    ],

    regionKeywords: [
        // Français
        'région', 'region', 'ville', 'city', 'département', 'pays', 'localité',
        'mon région', 'ma région', 'ma ville', 'mon pays', 'ma localité',
        'les régions', 'les villes', 'les départements', 'les pays',
        'liste des régions', 'liste des villes', 'toutes les régions',
        'toutes les villes', 'où puis-je étudier', 'où trouver',
        'par région', 'par ville', 'par localité',
        'filtre par région', 'filtre par ville',
        'afficher les régions', 'afficher les villes',
        
        // Arabe
        'محافظة', 'ولاية', 'منطقة', 'مدينة', 'بلاد', 'دولة', 'مكان',
        'منطقتي', 'مدينتي', 'بلدي', 'دولتي', 'مكاني',
        'المحافظات', 'الولايات', 'المناطق', 'المدن', 'الأماكن',
        'قائمة المناطق', 'قائمة المدن', 'جميع المناطق', 'جميع المدن',
        'أين يمكنني الدراسة', 'أين أجد', 'أين توجد',
        'حسب المنطقة', 'حسب المدينة', 'حسب المحافظة',
        'تصفية حسب المنطقة', 'تصفية حسب المدينة',
        'عرض المناطق', 'عرض المدن',
        
        // English
        'region', 'city', 'state', 'country', 'location', 'area', 'place',
        'my region', 'my city', 'my country', 'my location',
        'regions', 'cities', 'states', 'countries', 'locations',
        'list of regions', 'list of cities', 'all regions', 'all cities',
        'where can I study', 'where to find', 'available locations',
        'by region', 'by city', 'by location',
        'filter by region', 'filter by city',
        'show regions', 'show cities', 'display regions', 'display cities'
    ],

    institutionKeywords: [
        // Français - Noms
        'institution', 'établissement', 'université', 'école', 'faculté',
        'lycée', 'centre', 'institut', 'académie', 'campus',
        'centre de formation', 'grande école', 'école supérieure',
        'établissement scolaire', 'centre universitaire', 'cité universitaire',
        
        // Arabe - أسماء
        'مؤسسة', 'جامعة', 'معهد', 'كلية', 'مدرسة',
        'ثانوية', 'مركز', 'أكاديمية', 'حرم جامعي', 'مدينة جامعية',
        'مركز تكوين', 'معهد عالي', 'مدرسة عليا', 'مؤسسة تعليمية',
        
        // Anglais - Nouns
        'institution', 'university', 'school', 'college', 'faculty',
        'high school', 'institute', 'academy', 'campus', 'center',
        'training center', 'higher education', 'educational institution',
        'university center', 'academic institution', 'learning center'
    ],

    specialtyKeywords: [
        'spécialités', 'formations', 'filières', 'domaines', 'cours',
        'programmes', 'études', 'branches', 'sections', 'départements',
        'matières', 'options', 'parcours', 'voies', 'séries',
        'liste des spécialités', 'liste des formations', 'toutes les spécialités',
        'quelles sont les spécialités', 'quelles sont les formations',
        'quelles sont les filières', 'choisir une spécialité',
        'trouver une formation', 'meilleures spécialités',
        'تخصصات', 'تكوينات', 'فروع', 'تخصص', 'تكوين', 'فرع',
        'شعب', 'شعبة', 'مسالك', 'مسلك', 'شهادات', 'شهادة',
        'ما هي التخصصات', 'ما هي التكوينات', 'ما هي الفروع',
        'قائمة التخصصات', 'قائمة التكوينات', 'قائمة الفروع',
        'جميع التخصصات', 'جميع التكوينات', 'جميع الفروع',
        'اختيار تخصص', 'البحث عن تكوين', 'أفضل التخصصات',
        'specialties', 'specializations', 'majors', 'programs', 'courses',
        'fields', 'degrees', 'studies', 'departments', 'subjects',
        'options', 'tracks', 'paths', 'streams',
        'list of specialties', 'list of programs', 'all specialties',
        'what are the specialties', 'what are the programs',
        'what are the fields', 'choose a specialty',
        'find a program', 'best specialties', 'available programs'
    ]
};

// Patterns pour les remerciements et salutations
export const interactionPatterns = {
    thanks: [
        'merci', 'thanks', 'thank you', 'شكرا', 'شكر', 'شكراً', 'شكرًا',
        'bravo', 'good job', 'excellent', 'ممتاز', 'super', 'génial',
        'parfait', 'awesome', 'perfect', 'great', 'رائع', 'احسنت',
        'جميل', 'بطلة', 'شكرا جزيلا'
    ],

    greetings: [
        'bonjour', 'salut', 'hello', 'مرحبا', 'اهلا', 'السلام',
        'hi', 'hey', 'صباح الخير', 'مساء الخير', 'مرحباً', 'أهلاً'
    ],

    topRequests: [
        'top', 'meilleur', 'conseille', 'recommande', 'أفضل', 'ينصح',
        'best', 'recommend', 'advise', 'أفضّل', 'ينصحني'
    ]
};

// Commandes exactes pour les listes
export const exactCommands = {
    specialty: [
        'degree list',
        'list des spécialités',
        'spécialités',
        'spécialités list',
        'list spécialités',
        'liste des spécialités',
        'liste spécialités',
        'specialties',
        'specialties list',
        'list specialties',
        'list of specialties',
        'list of specialty',
        'list specialty',
        'قائمة الاختصاصات',
        'لائحة التخصصات',
        'التخصصات',
        'الاختصاصات',
        'قائمة التخصصات',
        'لائحة الاختصاصات'
    ],

    region: [
        'list des régions',
        'region list',
        'list regions',
        'list of regions',
        'liste des régions',
        'régions',
        'regions',
        'قائمة المناطق',
        'لائحة المناطق',
        'المناطق',
        'قائمة الجهات',
        'لائحة الجهات',
        'الجهات'
    ],

    university: [
        'list des universités',
        'university list',
        'list universities',
        'list of universities',
        'liste des universités',
        'universités',
        'universities',
        'facultés',
        'faculties',
        'قائمة الجامعات',
        'لائحة الجامعات',
        'الجامعات',
        'قائمة المؤسسات',
        'لائحة المؤسسات',
        'المؤسسات',
        'الكليات',
        'المعاهد',
        'قائمة الكليات',
        'لائحة الكليات',
        'قائمة المعاهد',
        'لائحة المعاهد'
    ]
};

// Correspondances principales pour les spécialités - CORRIGÉES avec nouvelles spécialités
export const mainMatches = {
    'medecine': { targets: ['médecine', 'médecin', 'medical', 'طب', 'طبي'] },
    'médecine': { targets: ['médecine', 'médecin', 'medical', 'طب', 'طبي'] },
    'medicine': { targets: ['médecine', 'médecin', 'medical', 'طب', 'طبي'] },
    'طب': { targets: ['médecine', 'médecin', 'medical', 'طب', 'طبي'] },
    'طبي': { targets: ['médecine', 'médecin', 'medical', 'طب', 'طبي'] },
    
    // CORRECTION: "أحب المعلوماتية" remplacé par "أحب الهندسة"
    'informatique': { targets: ['informatique', 'computer', 'programmation', 'معلوماتية', 'حاسوب'] },
    'computer': { targets: ['informatique', 'computer', 'programmation', 'معلوماتية', 'حاسوب'] },
    'معلوماتية': { targets: ['informatique', 'computer', 'programmation', 'معلوماتية', 'حاسوب'] },
    'حاسوب': { targets: ['informatique', 'computer', 'programmation', 'معلوماتية', 'حاسوب'] },
    
    // NOUVELLES SPÉCIALITÉS AJOUTÉES
    'gestion': { targets: ['gestion', 'management', 'administratif', 'إدارة', 'تصرف'] },
    'management': { targets: ['gestion', 'management', 'administratif', 'إدارة', 'تصرف'] },
    'musique': { targets: ['musique', 'music', 'فنون موسيقية', 'موسيقى'] },
    'business': { targets: ['business', 'affaires', 'أعمال', 'تجارة'] },
    'marketing': { targets: ['marketing', 'تسويق', 'mercatique'] },
    'finance': { targets: ['finance', 'finances', 'مالية', 'تمويل'] },
    'construction': { targets: ['construction', 'bâtiment', 'بناء', 'عمران'] },
    'droit': { targets: ['droit', 'law', 'juridique', 'قانون', 'شرعي'] },
    'physique': { targets: ['physique', 'physics', 'فيزياء'] },
    'transport': { targets: ['transport', 'logistique', 'نقل', 'مواصلات'] },
    
    'economie': { targets: ['économie', 'economic', 'finance', 'اقتصاد', 'مالية'] },
    'économie': { targets: ['économie', 'economic', 'finance', 'اقتصاد', 'مالية'] },
    'اقتصاد': { targets: ['économie', 'economic', 'finance', 'اقتصاد', 'مالية'] },
    'مالية': { targets: ['économie', 'economic', 'finance', 'اقتصاد', 'مالية'] },
    
    'commerce': { targets: ['commerce', 'business', 'marketing', 'تجارة', 'تسويق'] },
    'تجارة': { targets: ['commerce', 'business', 'marketing', 'تجارة', 'تسويق'] },
    'تسويق': { targets: ['commerce', 'business', 'marketing', 'تجارة', 'تسويق'] },
    
    'ingénieur': { targets: ['ingénieur', 'engineering', 'génie', 'هندسة', 'مهندس'] },
    'engineering': { targets: ['ingénieur', 'engineering', 'génie', 'هندسة', 'مهندس'] },
    'هندسة': { targets: ['ingénieur', 'engineering', 'génie', 'هندسة', 'مهندس'] },
    'مهندس': { targets: ['ingénieur', 'engineering', 'génie', 'هندسة', 'مهندس'] },
    
    'biologie': { targets: ['biologie', 'biology', 'أحياء', 'بيولوجيا'] },
    'biology': { targets: ['biologie', 'biology', 'أحياء', 'بيولوجيا'] },
    'أحياء': { targets: ['biologie', 'biology', 'أحياء', 'بيولوجيا'] },
    'بيولوجيا': { targets: ['biologie', 'biology', 'أحياء', 'بيولوجيا'] },
    
    'francais': { targets: ['français', 'langue française', 'فرنسية', 'لغة فرنسية'] },
    'français': { targets: ['français', 'langue française', 'فرنسية', 'لغة فرنسية'] },
    'فرنسية': { targets: ['français', 'langue française', 'فرنسية', 'لغة فرنسية'] },
    
    'anglais': { targets: ['anglais', 'english', 'انجليزية', 'لغة انجليزية'] },
    'english': { targets: ['anglais', 'english', 'انجليزية', 'لغة انجليزية'] },
    'انجليزية': { targets: ['anglais', 'english', 'انجليزية', 'لغة انجليزية'] },
    
    'dessin': { targets: ['dessin', 'drawing', 'art', 'رسم', 'فن'] },
    'drawing': { targets: ['dessin', 'drawing', 'art', 'رسم', 'فن'] },
    'رسم': { targets: ['dessin', 'drawing', 'art', 'رسم', 'فن'] },
    'فن': { targets: ['dessin', 'drawing', 'art', 'رسم', 'فن'] },
    'art': { targets: ['dessin', 'drawing', 'art', 'رسم', 'فن'] },
    
    'philosophie': { targets: ['philosophie', 'philosophy', 'فلسفة', 'philo'] },
    'philosophy': { targets: ['philosophie', 'philosophy', 'فلسفة', 'philo'] },
    'فلسفة': { targets: ['philosophie', 'philosophy', 'فلسفة', 'philo'] },
    
    'histoire': { targets: ['histoire', 'history', 'تاريخ', 'historique'] },
    'history': { targets: ['histoire', 'history', 'تاريخ', 'historique'] },
    'تاريخ': { targets: ['histoire', 'history', 'تاريخ', 'historique'] },
    
    'géographie': { targets: ['géographie', 'geography', 'جغرافيا', 'géographique'] },
    'geography': { targets: ['géographie', 'geography', 'جغرافيا', 'géographique'] },
    'جغرافيا': { targets: ['géographie', 'geography', 'جغرافيا', 'géographique'] },
};

// Mots courts autorisés pour la recherche
export const shortWords = [
    'res', 'com', 'info', 'med', 'eco', 'droit', 'law', 'art', 
    'رسم', 'فن', 'طب', 'philo', 'histoire', 'géographie',
    // Nouveaux mots courts
    'ges', 'man', 'bus', 'mar', 'fin', 'con', 'phy', 'tra'
];

// Articles arabes à supprimer
export const arabicArticles = ['ال', 'بال', 'لل', 'ولل', 'فال', 'كال'];
export const arabicParticles = ['ال', 'بال', 'لل', 'ولل', 'فال', 'كال', 'ب', 'ل', 'ك', 'و', 'ف', 'س', 'أ'];