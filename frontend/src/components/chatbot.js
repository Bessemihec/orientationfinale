import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/Chatbot.css';
import chat from '../images/chatbot.png';

const Chatbot = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: t('chatbot.welcomeSpeciality'), sender: 'bot' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [matchingSpecialties, setMatchingSpecialties] = useState([]);
    const [isUserConnected, setIsUserConnected] = useState(false);
    const messagesEndRef = useRef(null);

    // États pour les données
    const [bacType, setBacType] = useState('');
    const [mg, setMg] = useState(null);
    const [userNotes, setUserNotes] = useState({});
    const [specialties, setSpecialties] = useState([]);
    const [specialtyMap, setSpecialtyMap] = useState({});
    const [userVille, setUserVille] = useState('');
    const [regions, setRegions] = useState([]);
    const [userUsername, setUserUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    
    // États pour la sélection des régions et facultés
    const [availableInstitutions, setAvailableInstitutions] = useState([]);
    const [isSelectingRegion, setIsSelectingRegion] = useState(false);
    const [isSelectingInstitution, setIsSelectingInstitution] = useState(false);

    // État pour le dropdown de guidance
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');

    // NOUVELLE FONCTION : Traduction dynamique des quick actions
    const getQuickActions = () => {
        const currentLang = i18n.language;
        
        return {
            'personal_data': {
                label: currentLang === 'ar' ? '📊 بياناتي الشخصية' : 
                       currentLang === 'en' ? '📊 My Personal Data' : '📊 Mes données personnelles',
                actions: [
                    { 
                        label: currentLang === 'ar' ? 'نوع الباكالوريا' : 
                               currentLang === 'en' ? 'Baccalaureate Type' : 'Type de Bac',
                        command: currentLang === 'ar' ? 'ما هو نوع الباكالوريا؟' :
                                currentLang === 'en' ? 'What is my baccalaureate type?' : 
                                'Quel est mon type de bac ?'
                    },
                    { 
                        label: currentLang === 'ar' ? 'المعدل العام' : 
                               currentLang === 'en' ? 'General Average' : 'Moyenne Générale',
                        command: currentLang === 'ar' ? 'ما هو معدلي؟' :
                                currentLang === 'en' ? 'What is my average?' : 
                                'Quelle est ma moyenne ?'
                    },
                    { 
                        label: currentLang === 'ar' ? 'درجة العربية' : 
                               currentLang === 'en' ? 'Arabic Grade' : 'Note d\'Arabe',
                        command: currentLang === 'ar' ? 'أعطني درجة العربية' :
                                currentLang === 'en' ? 'Give me my Arabic grade' : 
                                'Donne-moi ma note d\'arabe'
                    },
                    { 
                        label: currentLang === 'ar' ? 'درجة الفرنسية' : 
                               currentLang === 'en' ? 'French Grade' : 'Note de Français',
                        command: currentLang === 'ar' ? 'أعطني درجة الفرنسية' :
                                currentLang === 'en' ? 'Give me my French grade' : 
                                'Donne-moi ma note de français'
                    },
                    { 
                        label: currentLang === 'ar' ? 'درجة الرياضيات' : 
                               currentLang === 'en' ? 'Mathematics Grade' : 'Note de Mathématiques',
                        command: currentLang === 'ar' ? 'أعطني درجة الرياضيات' :
                                currentLang === 'en' ? 'Give me my Mathematics grade' : 
                                'Donne-moi ma note de mathématiques'
                    }
                ]
            },
            'orientation': {
                label: currentLang === 'ar' ? '🎯 التوجيه الجامعي' : 
                       currentLang === 'en' ? '🎯 University Orientation' : '🎯 Orientation Universitaire',
                actions: [
                   
                    { 
                        label: currentLang === 'ar' ? 'أريد دراسة الطب' : 
                               currentLang === 'en' ? 'I want to study Medicine' : 'Je veux étudier la Médecine',
                        command: currentLang === 'ar' ? 'أريد دراسة الطب' :
                                currentLang === 'en' ? 'I want to study medicine' : 
                                'Je veux étudier la médecine'
                    },
                    { 
                        label: currentLang === 'ar' ? 'أحب الإعلامية' : 
                               currentLang === 'en' ? 'I like informatics' : 'J\'aime l\'Informatique',
                        command: currentLang === 'ar' ? 'أحب الإعلامية' :
                                currentLang === 'en' ? 'I like informatics' : 
                                'J\'aime l\'informatique'
                    },
                    { 
                        label: currentLang === 'ar' ? 'تخصصات الهندسة' : 
                               currentLang === 'en' ? 'Engineering Specialties' : 'Spécialités d\'Ingénierie',
                        command: currentLang === 'ar' ? 'أريد دراسة الهندسة' :
                                currentLang === 'en' ? 'I want to study engineering' : 
                                'Je veux étudier l\'ingénierie'
                    },
                    { 
                        label: currentLang === 'ar' ? 'التخصصات التجارية' : 
                               currentLang === 'en' ? 'Business Specialties' : 'Spécialités Commerciales',
                        command: currentLang === 'ar' ? 'أريد دراسة التجارة' :
                                currentLang === 'en' ? 'I want to study business' : 
                                'Je veux étudier le commerce'
                    },
                    // NOUVEAUX SPÉCIALITÉS AJOUTÉES
                    { 
                        label: currentLang === 'ar' ? 'دراسة القانون' : 
                               currentLang === 'en' ? 'Study Law' : 'Étudier le Droit',
                        command: currentLang === 'ar' ? 'أريد دراسة القانون' :
                                currentLang === 'en' ? 'I want to study law' : 
                                'Je veux étudier le droit'
                    },
                    { 
                        label: currentLang === 'ar' ? 'دراسة المالية' : 
                               currentLang === 'en' ? 'Study Finance' : 'Étudier la Finance',
                        command: currentLang === 'ar' ? 'أريد دراسة المالية' :
                                currentLang === 'en' ? 'I want to study finance' : 
                                'Je veux étudier la finance'
                    },
                    { 
                        label: currentLang === 'ar' ? 'دراسة البناء' : 
                               currentLang === 'en' ? 'Study Construction' : 'Étudier la Construction',
                        command: currentLang === 'ar' ? 'أريد دراسة البناء' :
                                currentLang === 'en' ? 'I want to study construction' : 
                                'Je veux étudier la construction'
                    },
                    { 
                        label: currentLang === 'ar' ? 'دراسة الموسيقى' : 
                               currentLang === 'en' ? 'Study Music' : 'Étudier la Musique',
                        command: currentLang === 'ar' ? 'أريد دراسة الموسيقى' :
                                currentLang === 'en' ? 'I want to study music' : 
                                'Je veux étudier la musique'
                    },
                    { 
                        label: currentLang === 'ar' ? 'دراسة التسويق' : 
                               currentLang === 'en' ? 'Study Marketing' : 'Étudier le Marketing',
                        command: currentLang === 'ar' ? 'أريد دراسة التسويق' :
                                currentLang === 'en' ? 'I want to study marketing' : 
                                'Je veux étudier le marketing'
                    },
                    { 
                        label: currentLang === 'ar' ? 'دراسة الإدارة' : 
                               currentLang === 'en' ? 'Study Management' : 'Étudier la Gestion',
                        command: currentLang === 'ar' ? 'أريد دراسة الإدارة' :
                                currentLang === 'en' ? 'I want to study management' : 
                                'Je veux étudier la gestion'
                    }
                ]
            },
            'lists': {
                label: currentLang === 'ar' ? '🏛️ القوائم والمعلومات' : 
                       currentLang === 'en' ? '🏛️ Lists and Information' : '🏛️ Listes et Informations',
                actions: [
                    { 
                        label: currentLang === 'ar' ? 'قائمة جميع التخصصات' : 
                               currentLang === 'en' ? 'List of All Specialties' : 'Liste de toutes les spécialités',
                        command: currentLang === 'ar' ? 'قائمة التخصصات' :
                                currentLang === 'en' ? 'list of specialties' : 
                                'liste des spécialités'
                    },
                    { 
                        label: currentLang === 'ar' ? 'قائمة جميع المناطق' : 
                               currentLang === 'en' ? 'List of All Regions' : 'Liste de toutes les régions',
                        command: currentLang === 'ar' ? 'قائمة المناطق' :
                                currentLang === 'en' ? 'list of regions' : 
                                'liste des régions'
                    },
                    { 
                        label: currentLang === 'ar' ? 'المؤسسات في تونس' : 
                               currentLang === 'en' ? 'Institutions in Tunis' : 'Institutions à Tunis',
                        command: currentLang === 'ar' ? 'المؤسسات في تونس' :
                                currentLang === 'en' ? 'institutions in Tunis' : 
                                'institutions à Tunis'
                    },
                    { 
                        label: currentLang === 'ar' ? 'المؤسسات في صفاقس' : 
                               currentLang === 'en' ? 'Institutions in Sfax' : 'Institutions à Sfax',
                        command: currentLang === 'ar' ? 'المؤسسات في صفاقس' :
                                currentLang === 'en' ? 'institutions in Sfax' : 
                                'institutions à Sfax'
                    },
                    { 
                        label: currentLang === 'ar' ? 'المؤسسات في سوسة' : 
                               currentLang === 'en' ? 'Institutions in Sousse' : 'Institutions à Sousse',
                        command: currentLang === 'ar' ? 'المؤسسات في سوسة' :
                                currentLang === 'en' ? 'institutions in Sousse' : 
                                'institutions à Sousse'
                    },
                    // NOUVELLE ACTION : Liste des facultés dans ma région
                    { 
                        label: currentLang === 'ar' ? 'المؤسسات في منطقتي' : 
                               currentLang === 'en' ? 'Institutions in my region' : 'Institutions dans ma région',
                        command: currentLang === 'ar' ? 'المؤسسات في منطقتي' :
                                currentLang === 'en' ? 'institutions in my region' : 
                                'institutions dans ma région'
                    }
                ]
            },
            'help': {
                label: currentLang === 'ar' ? '❓ المساعدة' : 
                       currentLang === 'en' ? '❓ Help' : '❓ Aide',
                actions: [
                    { 
                        label: currentLang === 'ar' ? 'كيف استخدم المساعد؟' : 
                               currentLang === 'en' ? 'How to use the assistant?' : 'Comment utiliser l\'assistant ?',
                        command: currentLang === 'ar' ? 'مساعدة' :
                                currentLang === 'en' ? 'help' : 
                                'aide'
                    },
                    { 
                        label: currentLang === 'ar' ? 'ماذا يمكنني أن أسأل؟' : 
                               currentLang === 'en' ? 'What can I ask?' : 'Que puis-je demander ?',
                        command: currentLang === 'ar' ? 'ما هي الإمكانيات؟' :
                                currentLang === 'en' ? 'what can you do' : 
                                'que peux-tu faire'
                    }
                ]
            }
        };
    };

    // Mettre à jour les quickActions quand la langue change
    const [quickActions, setQuickActions] = useState(getQuickActions());

    useEffect(() => {
        setQuickActions(getQuickActions());
    }, [i18n.language]);

    // Fonction pour gérer la sélection d'une action rapide
    const handleQuickAction = (command) => {
        setInputMessage(command);
        setShowQuickActions(false);
        // Envoyer automatiquement le message après un court délai
        setTimeout(() => {
            handleSendMessage();
        }, 100);
    };

    // Fonction pour réinitialiser le dropdown
    const resetQuickActions = () => {
        setSelectedCategory('');
        setShowQuickActions(true);
    };

    // FONCTION CORRIGÉE : Détection du type de requête avec support multilingue étendu
    const detectRequestType = (message) => {
        const msg = message.toLowerCase().trim();
        
        // CORRECTION: Vérifier d'abord les requêtes de données personnelles en arabe et anglais
        const personalDataPatterns = [
            // Arabe - données personnelles
            'ما هو نوع الباكالوريا', 'ما هو معدلي', 'أعطني درجة', 'ما هو اسم المستخدم', 'ما هو بريدي',
            'نوع الباكالوريا', 'المعدل العام', 'درجة العربية', 'درجة الفرنسية', 'درجة الرياضيات',
            'اسم المستخدم', 'البريد الإلكتروني', 'المدينة', 'نتيجة التوجيه',
            
            // Anglais - personal data
            'what is my baccalaureate type', 'what is my average', 'give me my grade', 'what is my username',
            'what is my email', 'baccalaureate type', 'general average', 'arabic grade', 'french grade',
            'mathematics grade', 'username', 'email', 'city', 'orientation score',
            
            // Français - données personnelles
            'quel est mon type de bac', 'quelle est ma moyenne', 'donne-moi ma note', 'quel est mon nom d\'utilisateur',
            'quel est mon email', 'type de bac', 'moyenne générale', 'note d\'arabe', 'note de français',
            'note de mathématiques', 'nom d\'utilisateur', 'email', 'ville', 'score orientation'
        ];

        // Vérifier d'abord les requêtes de données personnelles
        if (personalDataPatterns.some(pattern => msg.includes(pattern))) {
            return 'data';
        }

        // CORRECTION SPÉCIFIQUE: Vérifier d'abord les requêtes "institutions dans ma région" 
        const myRegionInstitutionPatterns = [
            // Français
            'institutions dans ma région', 'institutions de ma région', 'établissements dans ma région',
            'facultés dans ma région', 'universités dans ma région',
            // Arabe
            'المؤسسات في منطقتي', 'الجامعات في منطقتي', 'الكليات في منطقتي',
            // Anglais
            'institutions in my region', 'universities in my region', 'faculties in my region'
        ];

        if (myRegionInstitutionPatterns.some(pattern => msg.includes(pattern))) {
            return 'institutions-my-region';
        }

        const orientationPatterns = [
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
        ];

        const dataPatterns = [
            // Français - Noms
            'données', 'informations', 'détails', 'notes', 'moyennes',
            'résultats', 'scores', 'évaluations', 'bulletins', 'relevés',
            'espagnol', 'allemand', 'espagnole', 'allemande', 'espagnol/allemand',
            'espagnol ou allemand', 'langue espagnole', 'langue allemande',
            
            // Arabe - أسماء
            'بيانات', 'معلومات', 'تفاصيل', 'درجات', 'معدلات',
            'نتائج', 'تقارير', 'كشوف', 'سجلات', 'تقارير دراسية',
            'إسباني', 'ألماني', 'لغة إسبانية', 'لغة ألمانية',
            
            // Anglais - Nouns
            'data', 'information', 'details', 'grades', 'averages',
            'results', 'scores', 'evaluations', 'reports', 'records',
            'spanish', 'german', 'spanish/german', 'spanish or german',
            'spanish language', 'german language'
        ];

        const listPatterns = [
            // Français - Noms
            'liste', 'list', 'la liste', 'les listes', 'tous', 'toutes', 'list',
            'quelles', 'quels', 'spécialités', 'formations', 'filières',
            'domaines', 'cours', 'programmes', 'études', 'branches',
            'sections', 'départements', 'matières', 'options', 'parcours',
            'voies', 'séries', 'universités', 'écoles', 'facultés',
            'instituts', 'lycées', 'centres', 'académies',
            'fac', 'univ', // NOUVEAUX MOTS-CLÉS AJOUTÉS
            'facultés', 'universités', 'écoles supérieures',
            
            // Arabe - أسماء
            'قائمة', 'لائحة', 'قوائم', 'لوائح', 'الكل', 'الكل',
            'ما', 'أي', 'تخصصات', 'تكوينات', 'فروع', 'مجالات', 'دورات',
            'برامج', 'دراسات', 'تخصصات', 'أقسام', 'مواد', 'خيارات',
            'مسارات', 'طرق', 'سلاسل', 'جامعات', 'مدارس', 'كليات',
            'معاهد', 'ثانويات', 'مراكز', 'أكاديميات',
            'كليات', 'جامعات', 'معاهد', // NOUVEAUX MOTS-CLÉS AJOUTÉS
            
            // Anglais - Nouns
            'list', 'all', 'any', 'every', 'which', 'what',
            'specialties', 'specializations', 'majors', 'programs',
            'courses', 'fields', 'degrees', 'studies', 'departments',
            'subjects', 'options', 'tracks', 'paths', 'streams',
            'universities', 'schools', 'colleges', 'institutes',
            'faculties', 'academies', 'institutions'
        ];

        const dataKeywords = [
            'allemand', 'allemande', 'ألماني', 'ألمانية', 'german',
            'espagnol', 'espagnole', 'إسباني', 'إسبانية', 'spanish',
            'italien', 'italienne', 'إيطالي', 'إيطالية', 'italian',
            'note', 'notes', 'grade', 'grades', 'moyenne', 'moyennes', 'score',
            'درجة', 'درجات', 'علامة', 'علامات', 'معدل', 'نتيجة',
            'mg', 'fg', 'email', 'bac', 'ville', 'username',
            'بريد', 'ايميل', 'بكالوريا', 'مدينة', 'اسم المستخدم','allemand'
        ];

        const orientationKeywords = [
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
        ];

        const regionKeywords = [
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
        ];

        const institutionKeywords = [
            // Français - Noms
            'institution', 'établissement', 'université', 'école', 'faculté',
            'lycée', 'centre', 'institut', 'académie', 'campus',
            'centre de formation', 'grande école', 'école supérieure',
            'établissement scolaire', 'centre universitaire', 'cité universitaire',
            'fac', 'univ', // NOUVEAUX MOTS-CLÉS AJOUTÉS
            'facultés', 'universités', 'écoles supérieures',
            
            // Arabe - أسماء
            'مؤسسة', 'جامعة', 'معهد', 'كلية', 'مدرسة',
            'ثانوية', 'مركز', 'أكاديمية', 'حرم جامعي', 'مدينة جامعية',
            'مركز تكوين', 'معهد عالي', 'مدرسة عليا', 'مؤسسة تعليمية',
            'كليات', 'جامعات', 'معاهد', // NOUVEAUX MOTS-CLÉS AJOUTÉS
            
            // Anglais - Nouns
            'institution', 'university', 'school', 'college', 'faculty',
            'high school', 'institute', 'academy', 'campus', 'center',
            'training center', 'higher education', 'educational institution',
            'university center', 'academic institution', 'learning center'
        ];

        const specialtyKeywords = [
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
        ];

        // DÉTECTION AMÉLIORÉE POUR LES REQUÊTES EN ARABE
        // Vérifier d'abord les commandes exactes en arabe
        const normalizedMsg = msg.toLowerCase().trim();
        
        // Commandes exactes pour les spécialités en arabe
        const arabicSpecialtyCommands = [
            'قائمة الاختصاصات', 'لائحة التخصصات', 'التخصصات', 'الاختصاصات',
            'قائمة التخصصات', 'لائحة الاختصاصات', 'درجات التخصصات'
        ];

        // Commandes exactes pour les régions en arabe
        const arabicRegionCommands = [
            'قائمة المناطق', 'لائحة المناطق', 'المناطق', 'قائمة الجهات',
            'لائحة الجهات', 'الجهات', 'المحافظات', 'الولايات'
        ];

        // Commandes exactes pour les institutions en arabe
        const arabicInstitutionCommands = [
            'قائمة الجامعات', 'لائحة الجامعات', 'الجامعات', 'قائمة المؤسسات',
            'لائحة المؤسسات', 'المؤسسات', 'الكليات', 'المعاهد',
            'قائمة الكليات', 'لائحة الكليات', 'قائمة المعاهد', 'لائحة المعاهد',
            'قائمة fac', 'لائحة fac', 'قائمة univ', 'لائحة univ'
        ];

        // Vérifier les commandes exactes en arabe d'abord
        if (arabicSpecialtyCommands.includes(normalizedMsg)) {
            return 'specialties-list';
        }
        
        if (arabicRegionCommands.includes(normalizedMsg)) {
            return 'regions-list';
        }
        
        if (arabicInstitutionCommands.includes(normalizedMsg)) {
            return 'institutions-list';
        }

        // 1. Vérifier d'abord les patterns complets
        const hasOrientationPattern = orientationPatterns.some(pattern => msg.includes(pattern));
        const hasDataPattern = dataPatterns.some(pattern => msg.includes(pattern));
        
        // Détection améliorée pour les listes
        const hasListPattern = listPatterns.some(pattern => {
            // Pour l'arabe, vérifier les mots-clés spécifiques
            if (/[\u0600-\u06FF]/.test(msg)) {
                const arabicListWords = ['قائمة', 'لائحة', 'قوائم', 'لوائح', 'الكل', 'جميع'];
                return arabicListWords.some(word => msg.includes(word));
            }
            return msg.includes(pattern) || normalizedMsg.startsWith('what ');
        });
        
        // Vérifier spécifiquement les requêtes de diplômes
        const hasDegreeKeywords = msg.includes('degree') || 
                                msg.includes('diplôme') || 
                                msg.includes('diploma') ||
                                msg.includes('شهادة') ||
                                msg.includes('شهادات');

        // 2. Vérifier les mots clés spécifiques - CORRECTION: données en premier
        const hasDataKeywords = dataKeywords.some(keyword => 
            msg.includes(keyword) && !hasOrientationPattern
        );
        
        const hasOrientationKeywords = orientationKeywords.some(keyword => 
            msg.includes(keyword) && !hasDataPattern
        );

        const hasRegionKeywords = regionKeywords.some(keyword => msg.includes(keyword));
        const hasInstitutionKeywords = institutionKeywords.some(keyword => msg.includes(keyword));
        
        // Amélioration de la détection des spécialités
        const hasSpecialtyKeywords = specialtyKeywords.some(keyword => 
            msg.includes(keyword) || 
            msg.includes('spécialités') || 
            msg.includes('تخصصات') || 
            msg.includes('specialties') ||
            msg.includes('formation') ||
            msg.includes('تكوين') ||
            msg.includes('اختصاصات') ||
            msg.includes('شعب دراسية') ||
            msg.includes('filières') ||
            msg.includes('domaines d\'études') ||
            msg.includes('قائمة الاختصاصات') ||
            msg.includes('لائحة التخصصات') ||
            msg.includes('جميع التخصصات') ||
            msg.includes('الاختصاصات المتوفرة')
        );
        
        // Détection spécifique pour les commandes exactes
        // Commandes pour les spécialités
        const isSpecialtyCommand = [
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
            'list specialty'
        ].includes(normalizedMsg);
        
        // Commandes pour les régions
        const isRegionCommand = [
            'list des régions',
            'region list',
            'list regions',
            'list of regions',
            'liste des régions',
            'régions',
            'regions'
        ].includes(normalizedMsg);
        
        // CORRECTION: Commandes pour les institutions - AJOUT DES COMMANDES MANQUANTES
        const isUniversityCommand = [
            'list des universités',
            'university list',
            'list universities',
            'list of universities',
            'liste des universités',
            'universités',
            'universities',
            'facultés',
            'faculties',
            'list des fac',
            'list fac',
            'liste des fac',
            'fac list',
            'list des univ',
            'univ list',
            'institutions list',
            'list institutions',
            'list of institutions',
            'institutions',
            'fac',
            'universités',
            // CORRECTION: Ajout des commandes françaises et anglaises manquantes
            'liste des institutions',
            'liste institutions',
            'liste des facultés',
            'liste des universités',
            'list of institutions',
            'list of faculties',
            'list of universities',
            'institutions list',
            'faculties list',
            'universities list'
        ].includes(normalizedMsg);

        // Logique de décision - CORRIGÉE: priorité aux données
        // Vérifier d'abord les commandes exactes
        if (isSpecialtyCommand) {
            return 'specialties-list';
        }
        
        if (isRegionCommand) {
            return 'regions-list';
        }
        
        if (isUniversityCommand) {
            return 'institutions-list';
        }
        
        // CORRECTION: Vérifier les données AVANT les régions et institutions
        if (hasDataPattern || hasDataKeywords) {
            return 'data';
        }
        
        // Ensuite vérifier les motifs généraux
        if (hasListPattern) {
            // Si la liste contient des mots-clés de diplômes, retourner les spécialités
            if (hasDegreeKeywords) {
                return 'specialties-list';
            }
            // Si la liste contient des mots-clés de régions, retourner les régions
            if (hasRegionKeywords) {
                return 'regions-list';
            }
            // Si la liste contient des mots-clés d'institutions, retourner les institutions
            if (hasInstitutionKeywords || msg.includes('fac') || msg.includes('univ')) {
                return 'institutions-list';
            }
            // Si la liste contient des mots-clés de spécialités, retourner les spécialités
            if (hasSpecialtyKeywords) {
                return 'specialties-list';
            }
            // Par défaut pour les autres listes
            return 'institutions-list';
        }
        
        // CORRECTION: Vérifier l'orientation avant les régions
        if (hasOrientationPattern || hasOrientationKeywords) {
            return 'orientation';
        }
        
        // Ensuite vérifier les régions
        if (hasRegionKeywords) return 'regions-list';
        
        // Puis les institutions
        if (hasInstitutionKeywords || 
            msg.includes('université') || 
            msg.includes('جامعة') || 
            msg.includes('university') ||
            msg.includes('école') ||
            msg.includes('مدرسة') ||
            msg.includes('school') ||
            msg.includes('faculté') ||
            msg.includes('كلية') ||
            msg.includes('faculty') ||
            msg.includes('institut') ||
            msg.includes('معهد') ||
            msg.includes('institute') ||
            msg.includes('fac') || // NOUVEAU
            msg.includes('univ')) { // NOUVEAU
            return 'institutions-list';
        }
        
        // Enfin les spécialités
        if (hasSpecialtyKeywords) {
            return 'specialties-list';
        }
        
        // Logique de fallback
        if (hasOrientationKeywords && hasDataKeywords) {
            return 'orientation';
        } else {
            return 'general';
        }
    };

    // Fonction de normalisation pour l'arabe
    const normalizeWord = (word) => {
        if (!word) return '';

        let normalized = word
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\u0600-\u06FF']/g, '') 
            .trim();

        if (/[\u0600-\u06FF]/.test(normalized)) {
            if (normalized.length > 3) {
                const arabicArticles = ['ال', 'بال', 'لل', 'ولل', 'فال', 'كال'];
                arabicArticles.forEach(article => {
                    if (normalized.startsWith(article)) {
                        normalized = normalized.substring(article.length);
                    }
                });
            }

            normalized = normalized
                .replace(/[أإآ]/g, 'ا')
                .replace(/[ة]/g, 'ه')
                .replace(/[ى]/g, 'ي')
                .replace(/[ؤ]/g, 'و')
                .replace(/[ئ]/g, 'ي');

        }

        return normalized;
    };

    // Fonction d'extraction des mots-clés
    const extractSpecialtyKeyword = (message) => {
    const requestType = detectRequestType(message);
    
    const msg = message.toLowerCase().trim();

    // CORRECTION CRITIQUE : Séparer les apostrophes collées
    let correctedMessage = msg
        .replace(/([a-z])'([a-z])/g, '$1 $2')  // "l'informatique" → "l informatique"
        .replace(/([a-z])’([a-z])/g, '$1 $2')  // "l’informatique" → "l informatique" 
        .replace(/([a-z])"([a-z])/g, '$1 $2'); // "l"informatique" → "l informatique"

    const workingMessage = correctedMessage !== msg ? correctedMessage : msg;

    // Détection des remerciements
    const thanksPatterns = [
        'merci', 'thanks', 'thank you', 'شكرا', 'شكر', 'شكراً', 'شكرًا',
        'bravo', 'good job', 'excellent', 'ممتاز', 'super', 'génial',
        'parfait', 'awesome', 'perfect', 'great', 'رائع', 'احسنت',
        'جميل', 'بطلة', 'شكرا جزيلا'
    ];

    if (thanksPatterns.some(pattern => workingMessage.includes(pattern))) {
        return {
            specialtyKeyword: 'thanks',
            normalizedKeyword: 'thanks',
            isThanks: true
        };
    }

    // Détection des salutations
    const greetingPatterns = [
        'bonjour', 'salut', 'hello', 'مرحبا', 'اهلا', 'السلام',
        'hi', 'hey', 'صباح الخير', 'مساء الخير', 'مرحباً', 'أهلاً'
    ];

    if (greetingPatterns.some(pattern => workingMessage.includes(pattern))) {
        return {
            specialtyKeyword: 'bonjour',
            normalizedKeyword: 'bonjour',
            isGreeting: true
        };
    }

    const topPatterns = [
        'top', 'meilleur', 'conseille', 'recommande', 'أفضل', 'ينصح',
        'best', 'recommend', 'advise', 'أفضّل', 'ينصحني'
    ];

    if (topPatterns.some(pattern => workingMessage.includes(pattern))) {
        return {
            specialtyKeyword: 'top',
            normalizedKeyword: 'top',
            isTopRequest: true
        };
    }

    // CORRECTION SPÉCIFIQUE: Détection des requêtes "institutions dans ma région"
    const myRegionInstitutionPatterns = [
        // Français
        'institutions dans ma région', 'institutions de ma région', 'établissements dans ma région',
        'facultés dans ma région', 'universités dans ma région',
        // Arabe
        'المؤسسات في منطقتي', 'الجامعات في منطقتي', 'الكليات في منطقتي',
        // Anglais
        'institutions in my region', 'universities in my region', 'faculties in my region'
    ];

    if (myRegionInstitutionPatterns.some(pattern => workingMessage.includes(pattern))) {
        return {
            specialtyKeyword: 'institutions-my-region',
            normalizedKeyword: 'institutions-my-region',
            isMyRegionInstitutionRequest: true,
            requestType: 'institutions-my-region'
        };
    }

    // Si c'est une requête de données ou listes, retourner directement
    if (requestType === 'data' || requestType.includes('-list')) {
        return {
            specialtyKeyword: requestType,
            normalizedKeyword: requestType,
            isDataRequest: requestType === 'data',
            isListRequest: requestType.includes('-list'),
            requestType: requestType
        };
    }

    // Nettoyage basique pour la recherche de spécialités
    let cleaned = workingMessage
        .replace(/[.,!?;:]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const ignoreWords = [
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
        'étudier',"etudier", 'apprendre', 'travailler', 'devenir', 'faire', 'exercer', 'pratiquer',"beaucoup",
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

    // Nettoyage spécial pour l'arabe
    let arabicCleaned = cleaned;
    const arabicParticles = ['ال', 'بال', 'لل', 'ولل', 'فال', 'كال', 'ب', 'ل', 'ك', 'و', 'ف', 'س', 'أ'];
    arabicParticles.forEach(particle => {
        arabicCleaned = arabicCleaned.replace(new RegExp(`\\b${particle}`, 'g'), '');
    });
    arabicCleaned = arabicCleaned.replace(/\s+/g, ' ').trim();

    const finalCleaned = /[\u0600-\u06FF]/.test(cleaned) ? arabicCleaned : cleaned;

    // Filtrage intelligent des mots pour l'orientation
    const orientationWords = finalCleaned.split(' ')
        .filter(word => {
            const minLength = /[\u0600-\u06FF]/.test(word) ? 2 : 3;
            
            const orientationIgnoreWords = [
                'je', 'veux', 'étudier', 'faire', 'devenir', 'souhaite', 'aime', 'préfère', 'voudrais',
                'أريد', 'دراسة', 'أن', 'أصبح', 'أحب', 'أتوجه', 'أفضل', 'أود',
                'i', 'want', 'to', 'study', 'become', 'like', 'prefer', 'would'
            ];
            
            return word.length >= minLength &&
                !orientationIgnoreWords.includes(word) &&
                !ignoreWords.includes(word) &&
                !word.match(/^(suis|es|est|sommes|êtes|sont|ai|as|a|avons|avez|ont|am|is|are|was|were)$/);
        });

    const specialtyKeyword = orientationWords[0] || finalCleaned;
    const normalizedKeyword = normalizeWord(specialtyKeyword);

    return {
        specialtyKeyword: specialtyKeyword,
        normalizedKeyword: normalizedKeyword,
        hasPreference: orientationWords.length > 0,
        originalMessage: message,
        requestType: requestType
    };
};
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Vérifier si l'utilisateur est connecté
    const checkUserConnection = () => {
        const token = localStorage.getItem('token');
        const isConnected = !!token;
        setIsUserConnected(isConnected);
        
        if (userUsername === 'admin') {
            return false;
        }
        
        return isConnected;
    };

    // Charger le profil utilisateur
    useEffect(() => {
        const fetchProfile = async () => {
            if (!checkUserConnection()) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:8000/api/profile/', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.etudiant) {
                        const { username, email, bac_type, mg, fg, ville, A, PH, HG, F, Ang, M, SP, Sp_sport, SVT, Ge, Ec, TE, Algo, STI, SB, EP, IT, ESP, All, Info } = data.etudiant;

                        setBacType(bac_type || '');
                        setMg(mg || null);
                        setUserVille(ville || '');
                        setUserUsername(username || '');
                        setUserEmail(email || '');
                        setUserNotes({
                            MG: mg, FG: fg, A, PH, HG, F, ANG: Ang, M, SP, INFO: Info,
                            Sp_sport, SVT, Ge, Ec, TE, Algo, STI, SB, EP, IT, ESP, All
                        });
                    }
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        };

        fetchProfile();
    }, []);

    // Fonction pour extraire les spécialités individuelles
    const extractIndividualSpecialties = (specialtiesData) => {
        const individualSpecialties = new Set();

        // Si les données sont déjà un tableau de chaînes, les utiliser directement
        if (Array.isArray(specialtiesData) && specialtiesData.length > 0 && typeof specialtiesData[0] === 'string') {
            specialtiesData.forEach(specialty => {
                // Nettoyer et diviser les spécialités séparées par des retours à la ligne
                const lines = specialty.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0 && !line.toLowerCase().includes('spécialité'));
                
                lines.forEach(line => {
                    if (line && line.length > 2) { // Éviter les chaînes trop courtes
                        individualSpecialties.add(line);
                    }
                });
            });
        } 
        // Si c'est un objet avec des propriétés, extraire les valeurs
        else if (typeof specialtiesData === 'object' && specialtiesData !== null) {
            Object.values(specialtiesData).forEach(value => {
                if (value && typeof value === 'string') {
                    const lines = value.split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0 && !line.toLowerCase().includes('spécialité'));
                    
                    lines.forEach(line => {
                        if (line && line.length > 2) {
                            individualSpecialties.add(line);
                        }
                    });
                }
            });
        }

        // Trier les spécialités par ordre alphabétique
        return Array.from(individualSpecialties).sort((a, b) => a.localeCompare(b));
    };

    // Charger les spécialités
    useEffect(() => {
        if (isUserConnected) {
            fetch('http://127.0.0.1:8000/api/orientations/specialties/all/')
                .then(res => res.json())
                .then(data => {
                    const individualSpecialties = extractIndividualSpecialties(data);
                    const mapping = {};
                    individualSpecialties.forEach(spec => {
                        mapping[spec] = {
                            original: spec,
                            normalized: spec
                        };
                    });

                    setSpecialties(individualSpecialties);
                    setSpecialtyMap(mapping);
                })
                .catch(err => {
                    console.error('Error loading specialties:', err);
                });
        }
    }, [isUserConnected]);

    // FONCTION AMÉLIORÉE : Charger les régions avec support multilingue
    useEffect(() => {
        if (isUserConnected) {
            fetch('http://127.0.0.1:8000/api/orientations/regions/all/')
                .then(res => res.json())
                .then(data => {
                    // S'assurer que les régions sont chargées correctement
                    if (Array.isArray(data) && data.length > 0) {
                        setRegions(data);
                    } else {
                        // Fallback si l'API ne retourne pas les données attendues
                        const fallbackRegions = [
                            'تونس الكبرى', 'بنزرت', 'نابل', 'زغوان', 'باجة', 'جندوبة', 
                            'الكاف', 'سليانة', 'سوسة', 'المنستير', 'المهدية', 'صفاقس', 
                            'القيروان', 'القصرين', 'سيدي بوزيد', 'قفصة', 'توزر', 'قبلي', 
                            'قابس', 'مدنين', 'تطاوين'
                        ];
                        setRegions(fallbackRegions);
                    }
                })
                .catch(err => {
                    console.error('Error loading regions:', err);
                    // Fallback en cas d'erreur
                    const fallbackRegions = [
                        'تونس الكبرى', 'بنزرت', 'نابل', 'زغوان', 'باجة', 'جندوبة', 
                        'الكاف', 'سليانة', 'سوسة', 'المنستير', 'المهدية', 'صفاقس', 
                        'القيروان', 'القصرين', 'سيدي بوزيد', 'قفصة', 'توزر', 'قبلي', 
                        'قابس', 'مدنين', 'تطاوين'
                    ];
                    setRegions(fallbackRegions);
                });
        }
    }, [isUserConnected]);

    const cleanThresholdValue = (value) => {
        if (value === null || value === undefined) return '-';
        const strValue = String(value).trim();
        return strValue === '' || strValue === '-' ? '-' : parseFloat(value);
    };

    const calculateScore = (formula) => {
        if (!formula || !userNotes) return null;

        try {
            let expression = formula.toString()
                .replace(/\s/g, '')
                .replace(/Max\(/g, 'Math.max(')
                .replace(/(\d+)([A-Za-zÀ-ÿ]+)/g, '$1*$2')
                .replace(/Ang/gi, 'ANG')
                .replace(/Info/gi, 'INFO')
                .replace(/All/gi, 'ALL')
                .replace(/\bA\b/g, 'A')
                .replace(/\bF\b/g, "F")
                .replace(/\bM\b/g, 'M');

            Object.entries(userNotes).forEach(([key, value]) => {
                const val = value || 0;
                expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), val);
            });

            try {
                const result = new Function(`return ${expression}`)();
                return parseFloat(result.toFixed(2));
            } catch (e) {
                console.error('Calculation error:', e, 'Expression:', expression);
                return null;
            }
        } catch (err) {
            console.error('Processing error:', err);
            return null;
        }
    };

    const getStatus = (currentScore, lastYearScore) => {
        if (!currentScore) return null;

        const cleanedThreshold = cleanThresholdValue(lastYearScore);
        const scoreToCompare = currentScore;

        if (cleanedThreshold === '-' || cleanedThreshold === '' || cleanedThreshold === null) {
            return { accepted: true };
        }

        if (cleanedThreshold === 0) {
            return { accepted: true };
        }

        const current = parseFloat(scoreToCompare);
        const threshold = parseFloat(cleanedThreshold);

        if (isNaN(current) || isNaN(threshold)) {
            return null;
        }

        const accepted = current >= threshold - 5;
        return { accepted: accepted };
    };

    // Fonction de traduction
    const getDisplayName = (specialtyKey) => {
        return t(`db.specialties.${specialtyKey}`, { defaultValue: specialtyKey });
    };

    // Fonction pour traduire le type de bac
    const translateBacType = (bacType) => {
        return t(`bacType.${bacType}`, { defaultValue: bacType });
    };

    // Fonction pour traduire les institutions
    const translateInstitution = (institution) => {
        return t(`db.institutions.${institution}`, { defaultValue: institution });
    };

    // Fonction pour traduire les champs
    const translateField = (field, value) => {
        if (!value || value === '-') return '-';

        if (field === 'specialties' && value.includes('\n')) {
            return value.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => t(`db.${field}.${line}`, { defaultValue: line }))
                .join(', ');
        }

        const translationKey = `db.${field}.${value}`;
        const translation = t(translationKey, { defaultValue: value });

        return translation;
    };

    // FONCTION AMÉLIORÉE : Recherche de spécialités avec les nouvelles spécialités
  const findMatchingSpecialties = (keyword, normalizedKeyword) => {
    if (!specialties.length) return [];

    const cleanKeyword = keyword.replace(/'/g, '');
    const cleanNormalized = normalizedKeyword.replace(/'/g, '');

    const mainMatches = {
        'medecine': { targets: ['médecine', 'médecin', 'الـطــب','medicine', 'طب', 'طبي', 'medecine'], exact: true },
        'médecine': { targets: ['médecine', 'médecin', 'الـطــب','medicine', 'طب', 'طبي'], exact: true },
        'medicine': { targets: ['médecine', 'médecin','الـطــب', 'medicine', 'طب', 'طبي'], exact: true },
         'الـطــب': { targets: ['طب', 'الطب', 'الـطــب', 'طـب', 'médecine', 'medicine'], exact: true },
        'طب': { targets: ['médecine', 'médecin', 'الـطــب','medicine', 'طب', 'طبي'], exact: true },
        'طبي': { targets: ['médecine', 'médecin', 'الـطــب','medicine', 'طب', 'طبي'], exact: true },
        'englais': { targets: ['anglais', 'english', 'انجليزية', 'لغة انجليزية', 'englais'], exact: false },
        'anglais': { targets: ['anglais', 'english', 'انجليزية', 'لغة انجليزية'], exact: false },
        'english': { targets: ['anglais', 'english', 'انجليزية', 'لغة انجليزية'], exact: false },
        'انجليزية': { targets: ['anglais', 'english', 'انجليزية', 'لغة انجليزية'], exact: false },
        'ingénierie': { targets: ['ingénierie', 'engineering', 'هندسة', 'مهندس'], exact: false },
        'engineering': { targets: ['ingénierie', 'engineering', 'هندسة', 'مهندس'], exact: false },
        'هندسة': { targets: ['ingénierie', 'engineering', 'هندسة', 'مهندس'], exact: false },
        'مهندس': { targets: ['ingénierie', 'engineering', 'هندسة', 'مهندس'], exact: false },
        'informatique': { targets: ['informatique', 'computer', 'programmation', 'معلوماتية', 'حاسوب', "l'informatique"], exact: false },
        "l'informatique": { targets: ['informatique', 'computer', 'programmation', 'معلوماتية', 'حاسوب', "l'informatique"], exact: false },
        'computer': { targets: ['informatique', 'computer', 'programmation', 'معلوماتية', 'حاسوب', "l'informatique"], exact: false },
        'معلوماتية': { targets: ['informatique', 'computer', 'programmation', 'معلوماتية', 'حاسوب', "l'informatique"], exact: false },
        'حاسوب': { targets: ['informatique', 'computer', 'programmation', 'معلوماتية', 'حاسوب', "l'informatique"], exact: false },
        'economie': { targets: ['économie', 'economic', 'finance', 'اقتصاد', 'مالية'], exact: false },
        'économie': { targets: ['économie', 'economic', 'finance', 'اقتصاد', 'مالية'], exact: false },
        'اقتصاد': { targets: ['économie', 'economic', 'finance', 'اقتصاد', 'مالية'], exact: false },
        'مالية': { targets: ['économie', 'economic', 'finance', 'اقتصاد', 'مالية'], exact: false },
        'droit': { targets: ['droit', 'law', 'juridique', 'قانون', 'شرعي'], exact: false },
        'law': { targets: ['droit', 'law', 'juridique', 'قانون', 'شرعي'], exact: false },
        'قانون': { targets: ['droit', 'law', 'juridique', 'قانون', 'شرعي'], exact: false },
        'شرعي': { targets: ['droit', 'law', 'juridique', 'قانون', 'شرعي'], exact: false },
        'commerce': { targets: ['commerce', 'business', 'marketing', 'تجارة', 'تسويق'], exact: false },
        'business': { targets: ['commerce', 'business', 'marketing', 'تجارة', 'تسويق'], exact: false },
        'تجارة': { targets: ['commerce', 'business', 'marketing', 'تجارة', 'تسويق'], exact: false },
        'تسويق': { targets: ['commerce', 'business', 'marketing', 'تجارة', 'تسويق'], exact: false },
        'biologie': { targets: ['biologie', 'biology', 'أحياء', 'بيولوجيا'], exact: false },
        'biology': { targets: ['biologie', 'biology', 'أحياء', 'بيولوجيا'], exact: false },
        'أحياء': { targets: ['biologie', 'biology', 'أحياء', 'بيولوجيا'], exact: false },
        'بيولوجيا': { targets: ['biologie', 'biology', 'أحياء', 'بيولوجيا'], exact: false },
        'francais': { targets: ['français', 'langue française', 'فرنسية', 'لغة فرنسية'], exact: false },
        'français': { targets: ['français', 'langue française', 'فرنسية', 'لغة فرنسية'], exact: false },
        'فرنسية': { targets: ['français', 'langue française', 'فرنسية', 'لغة فرنسية'], exact: false },
        'dessin': { targets: ['dessin', 'drawing', 'art', 'رسم', 'فن'], exact: false },
        'drawing': { targets: ['dessin', 'drawing', 'art', 'رسم', 'فن'], exact: false },
        'رسم': { targets: ['dessin', 'drawing', 'art', 'رسم', 'فن'], exact: false },
        'فن': { targets: ['dessin', 'drawing', 'art', 'رسم', 'فن'], exact: false },
        'art': { targets: ['dessin', 'drawing', 'art', 'رسم', 'فن'], exact: false },
        'philosophie': { targets: ['philosophie', 'philosophy', 'فلسفة', 'philo'], exact: false },
        'philosophy': { targets: ['philosophie', 'philosophy', 'فلسفة', 'philo'], exact: false },
        'فلسفة': { targets: ['philosophie', 'philosophy', 'فلسفة', 'philo'], exact: false },
        'histoire': { targets: ['histoire', 'history', 'تاريخ', 'historique'], exact: false },
        'history': { targets: ['histoire', 'history', 'تاريخ', 'historique'], exact: false },
        'تاريخ': { targets: ['histoire', 'history', 'تاريخ', 'historique'], exact: false },
        'géographie': { targets: ['géographie', 'geography', 'جغرافيا', 'géographique'], exact: false },
        'geography': { targets: ['géographie', 'geography', 'جغرافيا', 'géographique'], exact: false },
        'جغرافيا': { targets: ['géographie', 'geography', 'جغرافيا', 'géographique'], exact: false },
        'finance': { targets: ['finance', 'financial', 'مالية', 'تمويل'], exact: false },
        'construction': { targets: ['construction', 'بناء', 'إنشاء', 'batiment'], exact: false },
        'musique': { targets: ['musique', 'music', 'موسيقى', 'غناء'], exact: false },
        'marketing': { targets: ['marketing', 'تسويق', 'إعلان', 'publicité'], exact: false },
        'gestion': { targets: ['gestion', 'management', 'إدارة', 'تدبير'], exact: false },
    };

    const matches = specialties.filter(spec => {
        const specName = spec.toLowerCase();
        const displayName = getDisplayName(spec).toLowerCase();

        const cleanSpecName = specName.replace(/'/g, '');
        const cleanDisplayName = displayName.replace(/'/g, '');

        const normalizedSpec = normalizeWord(specName);
        const normalizedDisplay = normalizeWord(displayName);

        // Vérification avec mainMatches
        const matchConfig = mainMatches[normalizedKeyword] || mainMatches[cleanNormalized] || mainMatches[keyword] || mainMatches[cleanKeyword];
        
        if (matchConfig) {
            const targetWords = matchConfig.targets || [];
            const isExactMatch = matchConfig.exact;
            
            return targetWords.some(target => {
                const cleanTarget = target.replace(/'/g, '');
                const found = specName.includes(target) ||
                       cleanSpecName.includes(cleanTarget) ||
                       displayName.includes(target) ||
                       cleanDisplayName.includes(cleanTarget) ||
                       normalizedSpec.includes(normalizeWord(target)) ||
                       normalizedDisplay.includes(normalizeWord(target));
                
                // Pour les matches exacts, vérifier que c'est bien la spécialité principale
                if (isExactMatch && found) {
                    return specName === target || displayName === target || 
                           specName.includes(target) || displayName.includes(target);
                }
                
                return found;
            });
        }

        if (normalizedKeyword.length < 2) return false;

        const keywordInSpec = specName.includes(keyword) || 
                             cleanSpecName.includes(cleanKeyword) ||
                             normalizedSpec.includes(normalizedKeyword) ||
                             normalizedSpec.includes(cleanNormalized);

        const keywordInDisplay = displayName.includes(keyword) || 
                                cleanDisplayName.includes(cleanKeyword) ||
                                normalizedDisplay.includes(normalizedKeyword) ||
                                normalizedDisplay.includes(cleanNormalized);

        const minLengthForShortWords = /[\u0600-\u06FF]/.test(normalizedKeyword) ? 2 : 3;

        if (normalizedKeyword.length <= minLengthForShortWords) {
            const shortWords = ['res', 'com', 'info', 'med', 'eco', 'droit', 'law', 'art', 'رسم', 'فن', 'طب', 'philo', 'histoire', 'géographie', 'finance', 'music', 'build', 'market', 'manage'];
            if (!shortWords.includes(normalizedKeyword)) {
                return false;
            }
        }

        return keywordInSpec || keywordInDisplay;
    });

    // Tri intelligent basé sur la pertinence
    const sortedMatches = matches.sort((a, b) => {
        const aName = a.toLowerCase();
        const bName = b.toLowerCase();
        const displayA = getDisplayName(a).toLowerCase();
        const displayB = getDisplayName(b).toLowerCase();
        
        // Score de pertinence
        const getRelevanceScore = (name, display) => {
            let score = 0;
            
            // Correspondance exacte avec le keyword
            if (name === cleanKeyword || display === cleanKeyword) score += 100;
            if (name === normalizedKeyword || display === normalizedKeyword) score += 90;
            
            // Commence par le keyword
            if (name.startsWith(cleanKeyword) || display.startsWith(cleanKeyword)) score += 80;
            if (name.startsWith(normalizedKeyword) || display.startsWith(normalizedKeyword)) score += 70;
            
            // Contient le keyword
            if (name.includes(cleanKeyword) || display.includes(cleanKeyword)) score += 60;
            if (name.includes(normalizedKeyword) || display.includes(normalizedKeyword)) score += 50;
            
            return score;
        };

        const scoreA = getRelevanceScore(aName, displayA);
        const scoreB = getRelevanceScore(bName, displayB);

        return scoreB - scoreA; // Tri décroissant
    });

    return sortedMatches.slice(0, 6);
};

    // FONCTION AMÉLIORÉE : Extraction des données spécifiques avec support multilingue
    const extractSpecificData = async (message) => {
        if (!checkUserConnection()) {
            return t('chatbot.notConnected');
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8000/api/profile/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const userData = await response.json();
                const etudiant = userData.etudiant;
                
                return formatSpecificDataResponse(etudiant, message);
            } else {
                return t('chatbot.profileError');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            return t('chatbot.error');
        }
    };

    // FONCTION AMÉLIORÉE : Formatage des données spécifiques
    const formatSpecificDataResponse = (etudiant, message) => {
        const isArabic = i18n.language === 'ar';
        const isEnglish = i18n.language === 'en';
        const msg = message.toLowerCase();

        const requestedData = [];
        
        // Détection améliorée pour le type de bac
        if (msg.includes('bac') || msg.includes('باك') || msg.includes('baccalaureate') || 
            msg.includes('نوع الباكالوريا') || msg.includes('type de bac') || 
            msg.includes('bac type') || msg.includes('ما هو نوع الباكالوريا')) {
            requestedData.push({ 
                code: 'BAC_TYPE', 
                name: isArabic ? 'نوع الباكالوريا' : isEnglish ? 'Baccalaureate Type' : 'Type de Bac',
                value: translateBacType(etudiant.bac_type)
            });
        }
        
        // Notes de matières
        if (msg.includes('arabe') || msg.includes('عربية') || msg.includes('arabic') || msg.includes('عربي')) {
            requestedData.push({ 
                code: 'A', 
                name: isArabic ? 'العربية' : isEnglish ? 'Arabic' : 'Arabe',
                value: etudiant.A 
            });
        }
        if (msg.includes('français') || msg.includes('francais') || msg.includes('فرنسية') || msg.includes('french') || msg.includes('فرنسي')) {
            requestedData.push({ 
                code: 'F', 
                name: isArabic ? 'الفرنسية' : isEnglish ? 'French' : 'Français',
                value: etudiant.F 
            });
        }
        if (msg.includes('anglais') || msg.includes('انجليزية') || msg.includes('english') || msg.includes('انجليزي')) {
            requestedData.push({ 
                code: 'Ang', 
                name: isArabic ? 'الإنجليزية' : isEnglish ? 'English' : 'Anglais',
                value: etudiant.Ang 
            });
        }
        if (msg.includes('math') || msg.includes('رياضيات') || msg.includes('mathématiques') || msg.includes('رياضية')) {
            requestedData.push({ 
                code: 'M', 
                name: isArabic ? 'الرياضيات' : isEnglish ? 'Mathematics' : 'Mathématiques',
                value: etudiant.M 
            });
        }
        if (msg.includes('philosophie') || msg.includes('فلسفة') || msg.includes('philosophy') || msg.includes('philo')) {
            requestedData.push({ 
                code: 'PH', 
                name: isArabic ? 'الفلسفة' : isEnglish ? 'Philosophy' : 'Philosophie',
                value: etudiant.PH 
            });
        }
        if (msg.includes('histoire') || msg.includes('تاريخ') || msg.includes('history') || msg.includes('historique')) {
            requestedData.push({ 
                code: 'HG', 
                name: isArabic ? 'التاريخ' : isEnglish ? 'History' : 'Histoire',
                value: etudiant.HG 
            });
        }
        if (msg.includes('géographie') || msg.includes('جغرافيا') || msg.includes('geography') || msg.includes('géographique')) {
            requestedData.push({ 
                code: 'HG', 
                name: isArabic ? 'الجغرافيا' : isEnglish ? 'Geography' : 'Géographie',
                value: etudiant.HG 
            });
        }
        if (msg.includes('histoire-géo') || msg.includes('histoire géo') || msg.includes('تاريخ وجغرافيا') || msg.includes('history-geography')) {
            requestedData.push({ 
                code: 'HG', 
                name: isArabic ? 'التاريخ والجغرافيا' : isEnglish ? 'History and Geography' : 'Histoire-Géographie',
                value: etudiant.HG 
            });
        }
        if (msg.includes('économie') || msg.includes('economie') || msg.includes('اقتصاد') || msg.includes('economy')) {
            requestedData.push({ 
                code: 'Ec', 
                name: isArabic ? 'الاقتصاد' : isEnglish ? 'Economy' : 'Économie',
                value: etudiant.Ec 
            });
        }
        if (msg.includes('gestion') || msg.includes('تصرف') || msg.includes('management')) {
            requestedData.push({ 
                code: 'Ge', 
                name: isArabic ? 'التصرف' : isEnglish ? 'Management' : 'Gestion',
                value: etudiant.Ge 
            });
        }
        if (msg.includes('physique') || msg.includes('فيزياء') || msg.includes('physics')) {
            requestedData.push({ 
                code: 'SP', 
                name: isArabic ? 'الفيزياء' : isEnglish ? 'Physics' : 'Physique',
                value: etudiant.SP 
            });
        }
        if (msg.includes('svt') || msg.includes('أحياء') || msg.includes('biology')) {
            requestedData.push({ 
                code: 'SVT', 
                name: isArabic ? 'علوم الحياة والأرض' : isEnglish ? 'Life Sciences' : 'SVT',
                value: etudiant.SVT 
            });
        }
        if (msg.includes('informatique') || msg.includes('معلوماتية') || msg.includes('computer')) {
            requestedData.push({ 
                code: 'Info', 
                name: isArabic ? 'الإعلامية' : isEnglish ? 'Computer Science' : 'Informatique',
                value: etudiant.Info 
            });
        }

        // Handle Spanish grade requests with more variations
        if (msg.match(/espagnol|spanish|إسبان|لغة إسبانية|langue espagnole|espagnole?/i)) {
            const espGrade = etudiant.ESP || etudiant.espagnol;
            if (espGrade !== undefined && espGrade !== null && espGrade !== '') {
                requestedData.push({ 
                    code: 'ESP', 
                    name: isArabic ? 'اللغة الإسبانية' : isEnglish ? 'Spanish' : 'Espagnol',
                    value: espGrade,
                    isLanguage: true
                });
            } else if (msg.match(/note|grade|درجة|علامة|mark/i)) {
                // Only show missing grade message if specifically asking for grade
                return isArabic ? 
                    '⚠️ **لا توجد درجة مسجلة في اللغة الإسبانية**' :
                    isEnglish ?
                    '⚠️ **No grade recorded for Spanish**' :
                    '⚠️ **Aucune note enregistrée en espagnol**';
            }
        }

        // Handle German grade requests with more variations
        if (msg.match(/allemand|german|ألمان|لغة ألمانية|langue allemande|allemande?/i)) {
            const allGrade = etudiant.All;
            if (allGrade !== undefined && allGrade !== null && allGrade !== '') {
                requestedData.push({ 
                    code: 'All', 
                    name: isArabic ? 'اللغة الألمانية' : isEnglish ? 'German' : 'Allemand',
                    value: allGrade,
                    isLanguage: true
                });
            } else if (msg.match(/note|grade|درجة|علامة|mark/i)) {
                // Only show missing grade message if specifically asking for grade
                return isArabic ? 
                    '⚠️ **لا توجد درجة مسجلة في اللغة الألمانية**' :
                    isEnglish ?
                    '⚠️ **No grade recorded for German**' :
                    '⚠️ **Aucune note enregistrée en allemand**';
            }
        }

        // Handle Italian grade requests with more variations
        if (msg.match(/italien|italian|إيطال|لغة إيطالية|langue italienne|italienne?/i)) {
            const itGrade = etudiant.IT || etudiant.italien;
            if (itGrade !== undefined && itGrade !== null && itGrade !== '') {
                requestedData.push({ 
                    code: 'IT', 
                    name: isArabic ? 'اللغة الإيطالية' : isEnglish ? 'Italian' : 'Italien',
                    value: itGrade,
                    isLanguage: true
                });
            } else if (msg.match(/note|grade|درجة|علامة|mark/i)) {
                return isArabic ? 
                    '⚠️ **لا توجد درجة مسجلة في اللغة الإيطالية**' :
                    isEnglish ?
                    '⚠️ **No grade recorded for Italian**' :
                    '⚠️ **Aucune note enregistrée en italien**';
            }
        }

        // Handle Technical grade requests with more variations
        if (msg.match(/technique|technical|تقنية|تكنيك|technologique|techno|تكنولوجي/i)) {
            const teGrade = etudiant.TE || etudiant.technique;
            if (teGrade !== undefined && teGrade !== null && teGrade !== '') {
                requestedData.push({ 
                    code: 'TE', 
                    name: isArabic ? 'التقنية' : isEnglish ? 'Technical' : 'Technique',
                    value: teGrade,
                    isLanguage: false
                });
            } else if (msg.match(/note|grade|درجة|علامة|mark/i)) {
                return isArabic ? 
                    '⚠️ **لا توجد درجة مسجلة في المادة التقنية**' :
                    isEnglish ?
                    '⚠️ **No grade recorded for Technical subject**' :
                    '⚠️ **Aucune note enregistrée en technique**';
            }
        }

        if (msg.includes('username') || msg.includes('nom') || msg.includes('اسم') || msg.includes('اسم المستخدم') || msg.includes('pseudo')) {
            requestedData.push({ 
                code: 'USERNAME', 
                name: isArabic ? 'اسم المستخدم' : isEnglish ? 'Username' : 'Nom d\'utilisateur',
                value: etudiant.username 
            });
        }
        if (msg.includes('email') || msg.includes('بريد') || msg.includes('ايميل') || msg.includes('mail') || msg.includes('courriel')) {
            requestedData.push({ 
                code: 'EMAIL', 
                name: isArabic ? 'البريد الإلكتروني' : isEnglish ? 'Email' : 'Email',
                value: etudiant.email 
            });
        }

        // Données personnelles
        if (msg.includes('mg') || msg.includes('معدل') || msg.includes('moyenne') || msg.includes('average') || msg.includes('معدلي')) {
            requestedData.push({ 
                code: 'MG', 
                name: isArabic ? 'المعدل العام' : isEnglish ? 'General Average' : 'Moyenne Générale',
                value: etudiant.mg 
            });
        }
        if (msg.includes('fg') || msg.includes('توجيه') || msg.includes('orientation')) {
            requestedData.push({ 
                code: 'FG', 
                name: isArabic ? 'نتيجة التوجيه' : isEnglish ? 'Orientation Score' : 'Score Orientation',
                value: etudiant.fg 
            });
        }
        if (msg.includes('ville') || msg.includes('city') || msg.includes('مدينة')) {
            requestedData.push({ 
                code: 'VILLE', 
                name: isArabic ? 'المدينة' : isEnglish ? 'City' : 'Ville',
                value: etudiant.ville ? t(`villes.${etudiant.ville}`, { defaultValue: etudiant.ville }) : 'Non spécifiée'
            });
        }

        const availableData = requestedData.filter(item => 
            item.value !== undefined && item.value !== null && item.value !== ''
        );

        if (availableData.length === 0) {
            if (isArabic) {
                return `❌ **لم أتمكن من العثور على البيانات المطلوبة**

💡 *جرب طلباً أكثر تحديداً مثل:
• "أعطني درجة العربية"
• "ما هو معدلي؟" 
• "ما هو نوع الباكالوريا؟"
• "ما هو اسم المستخدم؟"
• "ما هو بريدي الإلكتروني؟"*`;
            } else if (isEnglish) {
                return `❌ **I couldn't find the requested data**

💡 *Try a more specific request like:
• "Give me my Arabic grade"
• "What's my average?"
• "What's my baccalaureate type?"
• "What's my username?"
• "What's my email?"*`;
            } else {
                return `❌ **Je n'ai pas pu trouver les données demandées**

💡 *Essayez une demande plus spécifique comme :
• "Donne-moi ma note d'arabe"
• "Quelle est ma moyenne ?"
• "Quel est mon type de bac ?"
• "Quel est mon nom d'utilisateur ?"
• "Quel est mon email ?"*`;
            }
        }

        let response = '';
        
        // Check if we're only showing language grades
        const onlyLanguages = availableData.length > 0 && availableData.every(item => item.isLanguage);
        
        if (onlyLanguages) {
            // Formatage spécial pour les notes de langues
            availableData.forEach(item => {
                if (isArabic) {
                    response += `📊 **${item.name}:** ${item.value}\n`;
                } else if (isEnglish) {
                    response += `📊 **${item.name}:** ${item.value}\n`;
                } else {
                    response += `📊 **${item.name}:** ${item.value}\n`;
                }
            });
            
            // Add a friendly message
            if (isArabic) {
                response += "\n💡 *يمكنك أيضاً السؤال عن المواد الأخرى مثل العربية، الفرنسية، الرياضيات، إلخ.*";
            } else if (isEnglish) {
                response += "\n💡 *You can also ask about other subjects like Arabic, French, Mathematics, etc.*";
            } else {
                response += "\n💡 *Vous pouvez également demander d'autres matières comme l'arabe, le français, les mathématiques, etc.*";
            }
        } else {
            // Standard formatting for all other data
            if (isArabic) {
                response = `📊 **البيانات المطلوبة**\n\n`;
                availableData.forEach(item => {
                    response += `• **${item.name}:** ${item.value}\n`;
                });
            } else if (isEnglish) {
                response = `📊 **Requested Data**\n\n`;
                availableData.forEach(item => {
                    response += `• **${item.name}:** ${item.value}\n`;
                });
            } else {
                response = `📊 **Données demandées**\n\n`;
                availableData.forEach(item => {
                    response += `• **${item.name}:** ${item.value}\n`;
                });
            }
        }

        return response;
    };

    // FONCTION AMÉLIORÉE : Lister les régions avec support multilingue
    const getRegionsList = async () => {
        try {
            if (regions.length === 0) {
                const response = await fetch('http://127.0.0.1:8000/api/orientations/regions/all/');
                const data = await response.json();
                setRegions(data);
            }

            const isArabic = i18n.language === 'ar';
            const isEnglish = i18n.language === 'en';

            let response = isArabic ? 
                `🏛️ **قائمة المناطق**\n\n` :
                isEnglish ?
                `🏛️ **List of Regions**\n\n` :
                `🏛️ **Liste des Régions**\n\n`;

            regions.slice(0, 20).forEach((region, index) => {
                const displayName = t(`villes.${region}`, { defaultValue: region });
                response += `${index + 1}. ${displayName}\n`;
            });

            if (regions.length > 20) {
                response += isArabic ? 
                    `\n... وأكثر (${regions.length} منطقة)` :
                    isEnglish ?
                    `\n... and more (${regions.length} regions)` :
                    `\n... et plus (${regions.length} régions)`;
            }

            return response;

        } catch (error) {
            console.error('Error fetching regions:', error);
            return t('chatbot.error');
        }
    };

    // FONCTION CORRIGÉE : Lister les institutions par région avec détection multilingue
    const getInstitutionsByRegion = async (regionName = null) => {
        try {
            let targetRegion = regionName;
            
            // CORRECTION: Si c'est une demande "institutions dans ma région", utiliser la ville de l'utilisateur
            if (!targetRegion || targetRegion.includes('منطقتي') || targetRegion.includes('ma région') || targetRegion.includes('my region')) {
                if (userVille) {
                    targetRegion = userVille;
                } else {
                    const isArabic = i18n.language === 'ar';
                    const isEnglish = i18n.language === 'en';
                    
                    return isArabic ? 
                        `❌ **لم أتمكن من تحديد مدينتك**\n\nيرجى تحديث ملفك الشخصي أو تحديد المنطقة يدوياً مثل:\n• "المؤسسات في تونس"` :
                        isEnglish ?
                        `❌ **I couldn't determine your city**\n\nPlease update your profile or specify the region manually like:\n• "Institutions in Tunis"` :
                        `❌ **Je n'ai pas pu déterminer votre ville**\n\nVeuillez mettre à jour votre profil ou spécifier la région manuellement comme :\n• "Institutions à Tunis"`;
                }
            }

            // Mapping des noms de régions en différentes langues
            const regionMapping = {
                // Arabe vers API
                'تونس': 'تونس الكبرى', 'تونس الكبرى': 'تونس الكبرى', 'tunis': 'تونس الكبرى',
                'بنزرت': 'بنزرت', 'bizerte': 'بنزرت',
                'نابل': 'نابل', 'nabeul': 'نابل',
                'زغوان': 'زغوان', 'zaghouan': 'زغوان',
                'باجة': 'باجة', 'beja': 'باجة',
                'جندوبة': 'جندوبة', 'jendouba': 'جندوبة',
                'الكاف': 'الكاف', 'kef': 'الكاف',
                'سليانة': 'سليانة', 'siliana': 'سليانة',
                'سوسة': 'سوسة', 'sousse': 'سوسة',
                'المنستير': 'المنستير', 'monastir': 'المنستير',
                'المهدية': 'المهدية', 'mahdia': 'المهدية',
                'صفاقس': 'صفاقس', 'sfax': 'صفاقس',
                'القيروان': 'القيروان', 'kairouan': 'القيروان',
                'القصرين': 'القصرين', 'kasserine': 'القصرين',
                'سيدي بوزيد': 'سيدي بوزيد', 'sidibouzid': 'سيدي بوزيد',
                'قفصة': 'قفصة', 'gafsa': 'قفصة',
                'توزر': 'توزر', 'tozeur': 'توزر',
                'قبلي': 'قبلي', 'kebili': 'قبلي',
                'قابس': 'قابس', 'gabes': 'قابس',
                'مدنين': 'مدنين', 'medenine': 'مدنين',
                'تطاوين': 'تطاوين', 'tatouine': 'تطاوين',
                // CORRECTION: Ajout des noms anglais et français
                'kasserine': 'القصرين', 'kairouan': 'القيروان', 'le kef': 'الكاف',
                'monastir': 'المنستير', 'mahdia': 'المهدية', 'béja': 'باجة',
                'bizerte': 'بنزرت', 'tataouine': 'تطاوين', 'tozeur': 'توزر',
                'tunis grand tunis': 'تونس الكبرى', 'jendouba': 'جندوبة',
                'zaghouan': 'زغوان', 'siliana': 'سليانة', 'sousse': 'سوسة',
                'sidi bouzid': 'سيدي بوزيد', 'sfax': 'صفاقس', 'gabès': 'قابس',
                'kébili': 'قبلي', 'gafsa': 'قفصة', 'médenine': 'مدنين',
                'nabeul': 'نابل'
            };

            // Normaliser le nom de la région
            const normalizedRegion = regionMapping[targetRegion.toLowerCase()] || targetRegion;

            const response = await fetch(`http://127.0.0.1:8000/api/orientations/region/${encodeURIComponent(normalizedRegion)}/`);
            
            if (!response.ok) {
                // Si la région n'est pas trouvée, afficher la liste des régions disponibles
                if (response.status === 404) {
                    const isArabic = i18n.language === 'ar';
                    const isEnglish = i18n.language === 'en';
                    
                    let errorMessage = isArabic ? 
                        `❌ **لم أتمكن العثور على المنطقة "${targetRegion}"**\n\n` :
                        isEnglish ?
                        `❌ **I couldn't find the region "${targetRegion}"**\n\n` :
                        `❌ **Je n'ai pas pu trouver la région "${targetRegion}"**\n\n`;
                    
                    errorMessage += await getRegionsList();
                    return errorMessage;
                }
                throw new Error(`API error: ${response.status}`);
            }

            const orientationsData = await response.json();

            const isArabic = i18n.language === 'ar';
            const isEnglish = i18n.language === 'en';

            if (orientationsData.length === 0) {
                return isArabic ? 
                    `❌ **لا توجد مؤسسات مسجلة في ${t(`villes.${normalizedRegion}`, { defaultValue: normalizedRegion })}**` :
                    isEnglish ?
                    `❌ **No institutions found in ${t(`villes.${normalizedRegion}`, { defaultValue: normalizedRegion })}**` :
                    `❌ **Aucune institution trouvée à ${t(`villes.${normalizedRegion}`, { defaultValue: normalizedRegion })}**`;
            }

            const uniqueInstitutions = [...new Set(orientationsData.map(orientation => orientation.institution))].filter(Boolean);

            let responseText = isArabic ? 
                `🏫 **المؤسسات في ${t(`villes.${normalizedRegion}`, { defaultValue: normalizedRegion })}**\n\n` :
                isEnglish ?
                `🏫 **Institutions in ${t(`villes.${normalizedRegion}`, { defaultValue: normalizedRegion })}**\n\n` :
                `🏫 **Institutions à ${t(`villes.${normalizedRegion}`, { defaultValue: normalizedRegion })}**\n\n`;

            uniqueInstitutions.slice(0, 15).forEach((institution, index) => {
                const displayName = translateInstitution(institution);
                responseText += `${index + 1}. ${displayName}\n`;
            });

            if (uniqueInstitutions.length > 15) {
                responseText += isArabic ? 
                    `\n... وأكثر (${uniqueInstitutions.length} مؤسسة)` :
                    isEnglish ?
                    `\n... and more (${uniqueInstitutions.length} institutions)` :
                    `\n... et plus (${uniqueInstitutions.length} institutions)`;
            }

            return responseText;

        } catch (error) {
            console.error('Error fetching institutions by region:', error);
            return t('chatbot.error');
        }
    };

    // FONCTION CORRIGÉE : Lister les institutions de la région de l'utilisateur
    const getInstitutionsInUserRegion = async () => {
        try {
            if (!userVille) {
                const isArabic = i18n.language === 'ar';
                const isEnglish = i18n.language === 'en';
                
                return isArabic ? 
                    `❌ **لم أتمكن من تحديد مدينتك**\n\nيرجى تحديث ملفك الشخصي أو تحديد المنطقة يدوياً مثل:\n• "المؤسسات في تونس"` :
                    isEnglish ?
                    `❌ **I couldn't determine your city**\n\nPlease update your profile or specify the region manually like:\n• "Institutions in Tunis"` :
                    `❌ **Je n'ai pas pu déterminer votre ville**\n\nVeuillez mettre à jour votre profil ou spécifier la région manuellement comme :\n• "Institutions à Tunis"`;
            }

            return await getInstitutionsByRegion(userVille);

        } catch (error) {
            console.error('Error fetching institutions in user region:', error);
            return t('chatbot.error');
        }
    };

    // FONCTION NOUVELLE : Obtenir toutes les institutions (sans région spécifique)
    const getAllInstitutions = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/orientations/');
            const data = await response.json();
            
            const uniqueInstitutions = [...new Set(data.map(orientation => orientation.institution))].filter(Boolean);

            const isArabic = i18n.language === 'ar';
            const isEnglish = i18n.language === 'en';

            if (uniqueInstitutions.length === 0) {
                return isArabic ? 
                    "❌ **لم يتم العثور على مؤسسات**" :
                    isEnglish ?
                    "❌ **No institutions found**" :
                    "❌ **Aucune institution trouvée**";
            }

            let responseText = isArabic ? 
                `🏫 **جميع المؤسسات المتاحة**\n\n` :
                isEnglish ?
                `🏫 **All Available Institutions**\n\n` :
                `🏫 **Toutes les Institutions Disponibles**\n\n`;

            uniqueInstitutions.slice(0, 20).forEach((institution, index) => {
                const displayName = translateInstitution(institution);
                responseText += `${index + 1}. ${displayName}\n`;
            });

            if (uniqueInstitutions.length > 20) {
                responseText += isArabic ? 
                    `\n... وأكثر (${uniqueInstitutions.length} مؤسسة)` :
                    isEnglish ?
                    `\n... and more (${uniqueInstitutions.length} institutions)` :
                    `\n... et plus (${uniqueInstitutions.length} institutions)`;
            }

            responseText += isArabic ? 
                `\n💡 **للبحث عن مؤسسات في منطقة معينة**، اكتب "المؤسسات في [اسم المنطقة]"` :
                isEnglish ?
                `\n💡 **To search for institutions in a specific region**, type "institutions in [region name]"` :
                `\n💡 **Pour rechercher des institutions dans une région spécifique**, tapez "institutions à [nom de la région]"`;

            return responseText;

        } catch (error) {
            console.error('Error fetching all institutions:', error);
            return t('chatbot.error');
        }
    };

    // Fonction pour lister les spécialités
    const getSpecialtiesList = async () => {
        try {
            // Toujours rafraîchir les spécialités depuis le serveur
            const apiResponse = await fetch('http://127.0.0.1:8000/api/orientations/specialties/all/');
            const data = await apiResponse.json();
            const individualSpecialties = extractIndividualSpecialties(data);
            setSpecialties(individualSpecialties);

            const isArabic = i18n.language === 'ar';
            const isEnglish = i18n.language === 'en';

            if (individualSpecialties.length === 0) {
                return isArabic ? 
                    "❌ **لم يتم العثور على تخصصات**" :
                    isEnglish ?
                    "❌ **No specialties found**" :
                    "❌ **Aucune spécialité trouvée**";
            }

            let responseText = isArabic ? 
                `🎓 **قائمة التخصصات المتاحة**\n\n` :
                isEnglish ?
                `🎓 **List of Available Specialties**\n\n` :
                `🎓 **Liste des Spécialités Disponibles**\n\n`;

            // Afficher les 20 premières spécialités
            individualSpecialties.slice(0, 20).forEach((specialty, index) => {
                const displayName = getDisplayName(specialty);
                responseText += `${index + 1}. ${displayName}\n`;
            });

            if (individualSpecialties.length > 20) {
                responseText += isArabic ? 
                    `\n... وأكثر (${individualSpecialties.length} تخصص)` :
                    isEnglish ?
                    `\n... and more (${individualSpecialties.length} specialties)` :
                    `\n... et plus (${individualSpecialties.length} spécialités)`;
            }

            responseText += isArabic ? 
                `\n💡 **للبحث عن تخصص معين**، اكتب اسم التخصص مثل "طب" أو "هندسة"` :
                isEnglish ?
                `\n💡 **To search for a specific specialty**, type the specialty name like "medicine" or "engineering"` :
                `\n💡 **Pour rechercher une spécialité spécifique**, tapez le nom de la spécialité comme "médecine" ou "ingénierie"`;

            return responseText;

        } catch (error) {
            console.error('Error fetching specialties:', error);
            return t('chatbot.error');
        }
    };

    // Fonction pour obtenir les orientations d'une faculté
    const getOrientationsByInstitution = async (institutionName) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/orientations/institution/${encodeURIComponent(institutionName)}/`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const orientationsData = await response.json();
            const filteredOrientations = orientationsData.filter(o => o.bac_type === bacType);

            const isArabic = i18n.language === 'ar';
            const isEnglish = i18n.language === 'en';

            if (filteredOrientations.length === 0) {
                return isArabic ? 
                    `❌ **لا توجد تخصصات متاحة في ${translateInstitution(institutionName)} لنوع الباكالوريا ${translateBacType(bacType)}**` :
                    isEnglish ?
                    `❌ **No specialties available at ${translateInstitution(institutionName)} for ${translateBacType(bacType)} baccalaureate**` :
                    `❌ **Aucune spécialité disponible à ${translateInstitution(institutionName)} pour le bac ${translateBacType(bacType)}**`;
            }

            let responseText = isArabic ? 
                `🎓 **التخصصات المتاحة في ${translateInstitution(institutionName)}**\n\n` :
                isEnglish ?
                `🎓 **Specialties available at ${translateInstitution(institutionName)}**\n\n` :
                `🎓 **Spécialités disponibles à ${translateInstitution(institutionName)}**\n\n`;

            filteredOrientations.slice(0, 10).forEach((orientation, index) => {
                const specialtyName = orientation.specialties ? orientation.specialties.split('\n')[0]?.trim() : 'Spécialité diverse';
                const displayName = getDisplayName(specialtyName);
                responseText += `${index + 1}. ${displayName}\n`;
            });

            if (filteredOrientations.length > 10) {
                responseText += isArabic ? 
                    `\n... وأكثر (${filteredOrientations.length} تخصص)` :
                    isEnglish ?
                    `\n... and more (${filteredOrientations.length} specialties)` :
                    `\n... et plus (${filteredOrientations.length} spécialités)`;
            }

            return responseText;

        } catch (error) {
            console.error('Error fetching orientations by institution:', error);
            return t('chatbot.error');
        }
    };

    // Fonction Gemini
    const callGemini = async (question, userData) => {
        try {
            const API_KEY = "AIzaSyBpE8-1xlQ5Fwd6eq5vgTe0pWerXxzhEzA";

            const isArabic = /[\u0600-\u06FF]/.test(question);
            const isEnglish = /^[a-zA-Z\s.,!?]+$/.test(question) && !question.includes('é') && !question.includes('è');

            const languageInstruction = isArabic ?
                "الرد باللغة العربية" :
                isEnglish ?
                    "Respond in English" :
                    "Réponds en français";

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Tu es un conseiller d'orientation universitaire en Tunisie expert.

PROFIL ÉTUDIANT:
- Bac: ${userData.bac_type}
- Moyenne: ${userData.mg}
- Ville: ${userData.ville}

QUESTION: ${question}

INSTRUCTIONS:
1. ${languageInstruction}
2. Si c'est une question d'orientation, propose des spécialités concrètes
3. Mentionne des établissements tunisiens si possible
4. Donne des conseils pratiques
5. Sois encourageant et professionnel
6. Réponds de manière naturelle et conversationnelle

Réponds maintenant :`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Réponse Gemini invalide');
            }

        } catch (error) {
            console.error('Erreur Gemini:', error);
            return getLocalIntelligentResponse(question, userData);
        }
    };

    // Fonction de secours locale
    const getLocalIntelligentResponse = (question, userData) => {
        const extracted = extractSpecialtyKeyword(question);
        const keyword = extracted.specialtyKeyword;

        const isArabic = i18n.language === 'ar';
        const isEnglish = i18n.language === 'en';

        const translatedBacType = translateBacType(userData.bac_type);

        if (isArabic) {
            return `مرحباً! أنا هنا لمساعدتك في توجيهك الجامعي. ماذا تريد أن تعرف؟

💡 **يمكنني مساعدتك في:**
• استكشاف التخصصات المناسبة لمعدلك ${userData.mg} ونوع البكالوريا ${translatedBacType}
• عرض قوائم المؤسسات والتخصصات
• تقديم نصائح توجيهية مخصصة

🎯 **جرب أن تسألني:**
• "ما هي أفضل التخصصات لي؟"
• "أريد دراسة الطب"
• "عرض قائمة التخصصات"
• "المؤسسات في ${userData.ville || 'منطقتك'}"`;
        } else if (isEnglish) {
            return `Hello! I'm here to help you with your university orientation. What would you like to know?

💡 **I can help you with:**
• Exploring specialties suitable for your average ${userData.mg} and ${translatedBacType} baccalaureate
• Displaying lists of institutions and specialties
• Providing personalized orientation advice

🎯 **Try asking me:**
• "What are the best specialties for me?"
• "I want to study medicine"
• "Show list of specialties"
• "Institutions in ${userData.ville || 'your region'}"`;
        } else {
            return `Bonjour ! Je suis là pour vous aider dans votre orientation universitaire. Que souhaitez-vous savoir ?

💡 **Je peux vous aider à :**
• Explorer les spécialités adaptées à votre moyenne ${userData.mg} et votre bac ${translatedBacType}
• Afficher des listes d'établissements et de spécialités
• Donner des conseils d'orientation personnalisés

🎯 **Essayez de me demander :**
• "Quelles sont les meilleures spécialités pour moi ?"
• "Je veux étudier la médecine"
• "Afficher la liste des spécialités"
`;
        }
    };

    // Fonction pour les remerciements
    const getThanksResponse = () => {
        return t('chatbot.thanks');
    };

    // Fonction d'aide
    const getHelpMessage = () => {
        const isArabic = i18n.language === 'ar';
        const isEnglish = i18n.language === 'en';

        if (isArabic) {
            return `🎓 **مرحباً بك في مساعد التوجيه الجامعي!**

💡 **إليك ما يمكنني مساعدتك فيه:**

📊 **بياناتك الشخصية:**
• "أعطني درجة العربية" - عرض درجة مادة محددة
• "ما هو معدلي؟" - عرض المعدل العام
• "ما هو نوع الباكالوريا؟" - عرض نوع الباكالوريا
• "ما هو اسم المستخدم؟" - عرض اسم المستخدم
• "ما هو بريدي الإلكتروني؟" - عرض البريد الإلكتروني

🎯 **التوجيه والإرشاد:**
• "أريد دراسة الطب" - البحث عن تخصص معين
• "أحب المعلوماتية" - استكشاف مجال معين
• "ما هي أفضل التخصصات لي؟" - توصيات مخصصة

🏛️ **القوائم والمعلومات:**
• "قائمة المحافظات" - عرض جميع المناطق
• "المؤسسات في تونس" - عرض مؤسسات منطقة معينة
• "قائمة التخصصات" - عرض جميع التخصصات المتاحة
• "جامعة تونس" - عرض تخصصات جامعة معينة

🔍 **نصائح للاستخدام:**
• كن محدداً في طلباتك
• استخدم الكلمات الرئيسية مثل "درجة"، "تخصص"، "مؤسسة"
• يمكنك طلب قوائم لاستكشاف الخيارات المتاحة

💬 **جرب الآن! اكتب أي طلب أعلاه...**`;
        } else if (isEnglish) {
            return `🎓 **Welcome to the University Orientation Assistant!**

💡 **Here's what I can help you with:**

📊 **Your Personal Data:**
• "Give me my Arabic grade" - Show a specific subject grade
• "What's my average?" - Show general average
• "What's my baccalaureate type?" - Show baccalaureate type
• "What's my username?" - Show username
• "What's my email?" - Show email

🎯 **Orientation and Guidance:**
• "I want to study medicine" - Search for a specific specialty
• "I like computer science" - Explore a specific field
• "What are the best specialties for me?" - Personalized recommendations

🏛️ **Lists and Information:**
• "List of regions" - Show all regions
• "Institutions in Tunis" - Show institutions in a specific region
• "List of specialties" - Show all available specialties
• "University of Tunis" - Show specialties of a specific university

🔍 **Usage Tips:**
• Be specific in your requests
• Use keywords like "grade", "specialty", "institution"
• You can request lists to explore available options

💬 **Try now! Type any request above...**`;
        } else {
            return `🎓 **Bienvenue dans l'Assistant d'Orientation Universitaire !**

💡 **Voici ce que je peux faire pour vous :**

📊 **Vos données personnelles :**
• "Donne-moi ma note d'arabe" - Afficher une note spécifique
• "Quelle est ma moyenne ?" - Afficher la moyenne générale
• "Quel est mon type de bac ?" - Afficher le type de baccalauréat
• "Quel est mon nom d'utilisateur ?" - Afficher le nom d'utilisateur
• "Quel est mon email ?" - Afficher l'email

🎯 **Orientation et conseils :**
• "Je veux étudier la médecine" - Rechercher une spécialité spécifique
• "J'aime l'informatique" - Explorer un domaine spécifique
• "Quelles sont les meilleures spécialités pour moi ?" - Recommandations personnalisées

🏛️ **Listes et informations :**
• "Liste des régions" - Afficher toutes les régions
• "Institutions à Tunis" - Afficher les institutions d'une région
• "Liste des spécialités" - Afficher toutes les spécialités disponibles
• "Université de Tunis" - Afficher les spécialités d'une université spécifique

🔍 **Conseils d'utilisation :**
• Soyez spécifique dans vos demandes
• Utilisez des mots-clés comme "note", "spécialité", "institution"
• Vous pouvez demander des listes pour explorer les options disponibles

💬 **Essayez maintenant ! Tapez n'importe quelle demande ci-dessus...**`;
        }
    };

    // FONCTION CORRIGÉE : Gestion principale des messages avec support multilingue étendu
    const handleSendMessage = async () => {
        if (inputMessage.trim() === '') return;

        if (userUsername === 'admin') {
            const adminMessage = {
                text: "🚫 **Ce chatbot est réservé aux étudiants connectés uniquement.**\n\nEn tant qu'administrateur, vous ne pouvez pas utiliser cette fonctionnalité.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, adminMessage]);
            setInputMessage('');
            return;
        }

        setSelectedSpecialty(null);
        setIsSelectingRegion(false);
        setIsSelectingInstitution(false);

        if (matchingSpecialties.length > 0) {
            const number = parseInt(inputMessage);
            if (number >= 1 && number <= matchingSpecialties.length) {
                const selected = matchingSpecialties[number - 1];
                setMatchingSpecialties([]);
                
                const userChoiceMessage = { text: `${t('chatbot.iChoose')} ${getDisplayName(selected)}`, sender: 'user' };
                setMessages(prev => [...prev, userChoiceMessage]);
                setInputMessage('');
                
                setLoading(true);
                try {
                    const botResponse = await getSpecialtyAnalysis(selected);
                    setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
                } catch (error) {
                    console.error('Error analyzing specialty:', error);
                    setMessages(prev => [...prev, {
                        text: `❌ ${t('chatbot.analysisError', { specialty: getDisplayName(selected) })}`,
                        sender: 'bot'
                    }]);
                } finally {
                    setLoading(false);
                }
                return;
            }
        }

        if (isSelectingRegion && regions.length > 0) {
            const number = parseInt(inputMessage);
            if (number >= 1 && number <= regions.length) {
                const selectedRegion = regions[number - 1];
                setIsSelectingRegion(false);
                
                const userChoiceMessage = { text: `${t('chatbot.iChooseRegion')} ${t(`villes.${selectedRegion}`, { defaultValue: selectedRegion })}`, sender: 'user' };
                setMessages(prev => [...prev, userChoiceMessage]);
                setInputMessage('');
                
                setLoading(true);
                try {
                    const botResponse = await getInstitutionsByRegion(selectedRegion);
                    setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
                } catch (error) {
                    console.error('Error fetching institutions:', error);
                    setMessages(prev => [...prev, { text: t('chatbot.error'), sender: 'bot' }]);
                } finally {
                    setLoading(false);
                }
                return;
            }
        }

        if (!checkUserConnection()) {
            const notConnectedMessage = {
                text: t('chatbot.notConnected'),
                sender: 'bot'
            };
            setMessages(prev => [...prev, notConnectedMessage]);
            setInputMessage('');
            return;
        }

        const helpKeywords = ['aide', 'help', 'مساعدة', 'comment utiliser', 'كيف استخدم', 'what can you do'];
        if (helpKeywords.some(keyword => inputMessage.toLowerCase().includes(keyword))) {
            const helpMessage = { text: getHelpMessage(), sender: 'bot' };
            setMessages(prev => [...prev, helpMessage]);
            setInputMessage('');
            return;
        }

        const userMessage = { text: inputMessage, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setLoading(true);

        try {
            let botResponse = '';

            // CORRECTION SPÉCIFIQUE : Détection prioritaire des requêtes arabes pour les institutions
            const arabicInstitutionPatterns = [
                /المؤسسات في ([\u0600-\u06FF\s]+)/,
                /الجامعات في ([\u0600-\u06FF\s]+)/,
                /الكليات في ([\u0600-\u06FF\s]+)/,
                /المعاهد في ([\u0600-\u06FF\s]+)/
            ];

            let regionName = null;
            
            // Vérifier D'ABORD les patterns arabes spécifiques pour les institutions
            for (const pattern of arabicInstitutionPatterns) {
                const match = inputMessage.match(pattern);
                if (match) {
                    regionName = match[1].trim();
                    break;
                }
            }

            // Si c'est une requête d'institutions en arabe, traiter directement
            if (regionName) {
                botResponse = await getInstitutionsByRegion(regionName);
                setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
                setLoading(false);
                return;
            }

            const extracted = extractSpecialtyKeyword(inputMessage);

            // CORRECTION SPÉCIFIQUE: Gestion des requêtes "institutions dans ma région"
            if (extracted.isMyRegionInstitutionRequest) {
                botResponse = await getInstitutionsInUserRegion();
                setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
                setLoading(false);
                return;
            }

            if (extracted.isThanks) {
                botResponse = getThanksResponse();
            }
            else if (extracted.isGreeting) {
                botResponse = t('chatbot.greeting');
            } else if (extracted.isTopRequest) {
                botResponse = await getSpecialtiesList();
            } else if (extracted.isDataRequest) {
                botResponse = await extractSpecificData(inputMessage);
            } else if (extracted.isListRequest) {
                switch (extracted.requestType) {
                    case 'regions-list':
                        if (regions.length > 0) {
                            setIsSelectingRegion(true);
                            botResponse = `🏛️ **${t('chatbot.chooseRegion')}**\n\n${regions.map((region, index) =>
                                `${index + 1}. ${t(`villes.${region}`, { defaultValue: region })}`
                            ).join('\n')}\n\n*${t('chatbot.chooseNumber')}*`;
                        } else {
                            botResponse = await getRegionsList();
                        }
                        break;
                    case 'institutions-list':
                        // CORRECTION AMÉLIORÉE : Détection spécifique pour les requêtes "institutions dans ma région"
                        const myRegionPatterns = [
                            'institutions dans ma région',
                            'institutions in my region',
                            'المؤسسات في منطقتي',
                            'institutions ma région',
                            'my region institutions'
                        ];

                        // CORRECTION: Vérifier d'abord si c'est une demande "dans ma région"
                        const isMyRegionRequest = myRegionPatterns.some(pattern => 
                            inputMessage.toLowerCase().includes(pattern)
                        );

                        if (isMyRegionRequest) {
                            botResponse = await getInstitutionsInUserRegion();
                        } else {
                            // CORRECTION: Si c'est une demande générale d'institutions sans région spécifique
                            const institutionGeneralPatterns = [
                                'liste des institutions',
                                'list of institutions', 
                                'liste institutions',
                                'institutions list',
                                'liste des facultés',
                                'list of faculties',
                                'liste des universités',
                                'list of universities',
                                'fac',
                                'facultés',
                                'universités'
                            ];

                            const isGeneralInstitutionRequest = institutionGeneralPatterns.some(pattern =>
                                inputMessage.toLowerCase().includes(pattern)
                            );

                            if (isGeneralInstitutionRequest) {
                                botResponse = await getAllInstitutions();
                            } else {
                                // Rechercher une région spécifique dans le message
                                const regionPatterns = [
                                    // Français
                                    /(?:à|dans|de|des)\s+([^,.!?]+)/i,
                                    /(?:institutions|établissements|facultés|universités)\s+(?:à|dans|de)\s+([^,.!?]+)/i,
                                    // Arabe
                                    /(?:في|ب|من)\s+([^,.!?]+)/i,
                                    /(?:مؤسسات|جامعات|كليات)\s+(?:في|ب)\s+([^,.!?]+)/i,
                                    // Anglais
                                    /(?:in|at|of)\s+([^,.!?]+)/i,
                                    /(?:institutions|universities|faculties)\s+(?:in|at)\s+([^,.!?]+)/i
                                ];

                                let regionNameGeneral = null;
                                for (const pattern of regionPatterns) {
                                    const match = inputMessage.match(pattern);
                                    if (match) {
                                        regionNameGeneral = match[1].trim();
                                        break;
                                    }
                                }

                                if (regionNameGeneral) {
                                    botResponse = await getInstitutionsByRegion(regionNameGeneral);
                                } else {
                                    // CORRECTION: Par défaut, afficher toutes les institutions
                                    botResponse = await getAllInstitutions();
                                }
                            }
                        }
                        break;
                    case 'specialties-list':
                        botResponse = await getSpecialtiesList();
                        break;
                    default:
                        botResponse = t('chatbot.noSpecialtyFound', { keyword: extracted.specialtyKeyword });
                }
            } else {
                const { specialtyKeyword, normalizedKeyword } = extracted;
                
                const institutionKeywords = [
                    'université', 'faculté', 'institut', 'école', 'جامعة', 'معهد', 'كلية',
                    'university', 'faculty', 'institute', 'school', 'fac', 'univ'
                ];

                const isInstitutionRequest = institutionKeywords.some(keyword => 
                    inputMessage.toLowerCase().includes(keyword)
                );

                if (isInstitutionRequest) {
                    const foundInstitutions = await searchInstitutions(specialtyKeyword);
                    if (foundInstitutions.length > 0) {
                        if (foundInstitutions.length === 1) {
                            botResponse = await getOrientationsByInstitution(foundInstitutions[0]);
                        } else {
                            setAvailableInstitutions(foundInstitutions);
                            setIsSelectingInstitution(true);
                            botResponse = `🏫 **${t('chatbot.matchingInstitutions')}**\n\n${foundInstitutions.map((inst, index) =>
                                `${index + 1}. ${translateInstitution(inst)}`
                            ).join('\n')}\n\n*${t('chatbot.chooseNumber')}*`;
                        }
                    } else {
                        const foundSpecialties = findMatchingSpecialties(specialtyKeyword, normalizedKeyword);
                        if (foundSpecialties.length > 0) {
                            if (foundSpecialties.length === 1) {
                                botResponse = await getSpecialtyAnalysis(foundSpecialties[0]);
                            } else {
                                setMatchingSpecialties(foundSpecialties);
                                botResponse = `🔍 **${t('chatbot.matchingSpecialties')}**\n\n${foundSpecialties.map((spec, index) =>
                                    `${index + 1}. ${getDisplayName(spec)}`
                                ).join('\n')}\n\n*${t('chatbot.chooseNumber')}*`;
                            }
                        } else {
                            const token = localStorage.getItem('token');
                            const userResponse = await fetch('http://127.0.0.1:8000/api/profile/', {
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            if (userResponse.ok) {
                                const userData = await userResponse.json();
                                const etudiant = userData.etudiant;
                                
                                botResponse = await callGemini(inputMessage, etudiant);
                            } else {
                                botResponse = t('chatbot.noSpecialtyFound', { keyword: specialtyKeyword });
                            }
                        }
                    }
                } else {
                    const foundSpecialties = findMatchingSpecialties(specialtyKeyword, normalizedKeyword);

                    if (foundSpecialties.length > 0) {
                        if (foundSpecialties.length === 1) {
                            botResponse = await getSpecialtyAnalysis(foundSpecialties[0]);
                        } else {
                            setMatchingSpecialties(foundSpecialties);
                            botResponse = `🔍 **${t('chatbot.matchingSpecialties')}**\n\n${foundSpecialties.map((spec, index) =>
                                `${index + 1}. ${getDisplayName(spec)}`
                            ).join('\n')}\n\n*${t('chatbot.chooseNumber')}*`;
                        }
                    } else {
                        const token = localStorage.getItem('token');
                        const userResponse = await fetch('http://127.0.0.1:8000/api/profile/', {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            const etudiant = userData.etudiant;
                            
                            if (extracted.requestType === 'orientation') {
                                botResponse = await callGemini(inputMessage, etudiant);
                            } else {
                                botResponse = t('chatbot.noSpecialtyFound', { keyword: specialtyKeyword });
                            }
                        } else {
                            botResponse = t('chatbot.noSpecialtyFound', { keyword: specialtyKeyword });
                        }
                    }
                }
            }

            setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);

        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, {
                text: t('chatbot.error'),
                sender: 'bot'
            }]);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour rechercher les institutions
    const searchInstitutions = async (keyword) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/orientations/');
            const data = await response.json();
            const institutions = [...new Set(data.map(item => item.institution))].filter(Boolean);
            
            return institutions.filter(inst => 
                inst.toLowerCase().includes(keyword.toLowerCase()) ||
                translateInstitution(inst).toLowerCase().includes(keyword.toLowerCase())
            );
        } catch (error) {
            console.error('Error searching institutions:', error);
            return [];
        }
    };

    // Analyser une spécialité spécifique
    const getSpecialtyAnalysis = async (specialty) => {
        if (!bacType) return t('chatbot.profileError');

        try {
            const originalSpecialty = specialtyMap[specialty]?.original || specialty;
            const response = await fetch(`http://127.0.0.1:8000/api/orientations/specialty/${encodeURIComponent(originalSpecialty)}/`);
            const orientationsData = await response.json();

            const filtered = orientationsData.filter(o => o.bac_type === bacType);

            if (filtered.length === 0) {
                const translatedBacType = translateBacType(bacType);
                return `❌ ${t('chatbot.noOrientationFound', { specialty: getDisplayName(specialty), bacType: translatedBacType })}`;
            }

            const scoredOrientations = filtered.map(orientation => {
                const shouldApplyBonus = orientation.geographic_preference === 'نعم' && userVille === orientation.region;
                const baseScore = calculateScore(orientation.calculation_format);
                const finalScore = shouldApplyBonus && baseScore !== null ? baseScore * 1.07 : baseScore;
                const status = getStatus(finalScore, orientation.last_year_score);

                return {
                    orientation,
                    finalScore: finalScore !== null ? parseFloat(finalScore.toFixed(2)) : null,
                    lastYearScore: cleanThresholdValue(orientation.last_year_score),
                    accepted: status?.accepted || false,
                    hasBonus: shouldApplyBonus && baseScore !== null,
                    institution: orientation.institution,
                    degree: orientation.degree
                };
            }).filter(o => o.finalScore !== null && o.accepted)
                .sort((a, b) => b.finalScore - a.finalScore)
                .slice(0, 4);

            if (scoredOrientations.length > 0) {
                let response = `🎓 **${getDisplayName(specialty)} - ${t('chatbot.bestOptions', { count: scoredOrientations.length })}**\n\n`;

                scoredOrientations.forEach((item, index) => {
                    const chance = item.finalScore >= (item.lastYearScore === '-' ? 10 : item.lastYearScore) ? '🟢 ' + t('chatbot.high') : '🟡 ' + t('chatbot.medium');

                    response += `**${index + 1}. ${translateInstitution(item.institution)}**\n`;
                    response += `   📜 ${translateField('degrees', item.degree)}\n`;
                    response += `   📊 ${t('chatbot.yourScore')}: ${item.finalScore}\n`;
                    response += `   🎯 ${t('chatbot.previousThreshold')}: ${item.lastYearScore}\n`;
                    if (item.hasBonus) response += `   🎁 ${t('chatbot.regionBonusApplied')}\n`;
                    response += `   ✅ ${t('chatbot.admissionChance')}: ${chance}\n\n`;
                });

                const translatedBacType = translateBacType(bacType);
                response += `*${t('chatbot.basedOnProfile', { bacType: translatedBacType, mg })}*`;
                return response;
            } else {
                return `❌ ${t('chatbot.noViableOption', { specialty: getDisplayName(specialty) })}`;
            }

        } catch (error) {
            console.error('Error analyzing specialty:', error);
            return `❌ ${t('chatbot.analysisError', { specialty: getDisplayName(specialty) })}`;
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleSendMessage();
        }
    };

    // Fonction pour réinitialiser la conversation
    const resetConversation = () => {
        setMessages([{ text: t('chatbot.welcomeSpeciality'), sender: 'bot' }]);
        setInputMessage('');
        setMatchingSpecialties([]);
        setIsSelectingRegion(false);
        setIsSelectingInstitution(false);
        resetQuickActions();
    };

    return (
        <>
            <div
                className="chatbot-icon"
                onClick={() => setIsOpen(!isOpen)}
            >
                <img src={chat} alt="Chatbot" className="chatbot-icon-image" />
                {!isOpen && messages.length > 1 && (
                    <span className="notification-dot"></span>
                )}
            </div>

            {isOpen && (
                <div className="chatbot-window" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="chatbot-header">
                        <h3>🎓 {t('chatbot.title')}</h3>
                        <div className="header-buttons">
                            <button
                                className="reset-btn"
                                onClick={resetConversation}
                                title={i18n.language === 'ar' ? 'بدء محادثة جديدة' : 
                                       i18n.language === 'en' ? 'Start new conversation' : 
                                       'Commencer une nouvelle conversation'}
                            >
                                🔄
                            </button>
                            <button
                                className="close-btn"
                                onClick={() => setIsOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.sender}`}
                            >
                                {message.text.split('\n').map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        ))}
                        {loading && (
                            <div className="message bot loading">
                                🔄 {t('chatbot.analyzing')}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Dropdown de guidance */}
                    {showQuickActions && (
                        <div className="quick-actions-panel">
                            <div className="quick-actions-header">
                                <h4>🚀 {i18n.language === 'ar' ? 'اختر ما تريد القيام به' : 
                                      i18n.language === 'en' ? 'Choose what you want to do' : 
                                      'Choisissez ce que vous voulez faire'}</h4>
                            </div>
                            
                            <div className="categories-grid">
                                {Object.entries(quickActions).map(([categoryKey, category]) => (
                                    <div key={categoryKey} className="category-section">
                                        <button
                                            className={`category-btn ${selectedCategory === categoryKey ? 'active' : ''}`}
                                            onClick={() => setSelectedCategory(selectedCategory === categoryKey ? '' : categoryKey)}
                                        >
                                            {category.label}
                                        </button>
                                        
                                        {selectedCategory === categoryKey && (
                                            <div className="actions-list">
                                                {category.actions.map((action, index) => (
                                                    <button
                                                        key={index}
                                                        className="action-btn"
                                                        onClick={() => handleQuickAction(action.command)}
                                                    >
                                                        {action.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="quick-actions-footer">
                                <button
                                    className="hide-actions-btn"
                                    onClick={() => setShowQuickActions(false)}
                                >
                                    {i18n.language === 'ar' ? 'إخفاء الأزرار' : 
                                     i18n.language === 'en' ? 'Hide buttons' : 
                                     'Masquer les boutons'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="chatbot-input-container">
                        {!showQuickActions && (
                            <button
                                className="show-actions-btn"
                                onClick={() => setShowQuickActions(true)}
                                title={i18n.language === 'ar' ? 'إظهار الأزرار السريعة' : 
                                       i18n.language === 'en' ? 'Show quick actions' : 
                                       'Afficher les actions rapides'}
                            >
                                ⚡
                            </button>
                        )}
                        
                        <div className="chatbot-input">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={
                                    matchingSpecialties.length > 0 ?
                                    t('chatbot.chooseNumberPlaceholder', { count: matchingSpecialties.length }) :
                                    isSelectingRegion ?
                                    t('chatbot.chooseRegionPlaceholder', { count: regions.length }) :
                                    isSelectingInstitution ?
                                    t('chatbot.chooseInstitutionPlaceholder', { count: availableInstitutions.length }) :
                                    t('chatbot.inputPlaceholder')
                                }
                                disabled={loading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={loading || inputMessage.trim() === ''}
                            >
                                {loading ? '...' : t('chatbot.send')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;