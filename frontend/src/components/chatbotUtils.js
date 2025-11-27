import { 
    ignoreWords, 
    orientationIgnoreWords, 
    requestPatterns, 
    interactionPatterns, 
    exactCommands,
    mainMatches,
    shortWords,
    arabicArticles,
    arabicParticles
} from './chatbotKeywords';

// Fonction de normalisation pour l'arabe
export const normalizeWord = (word) => {
    if (!word) return '';

    let normalized = word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\u0600-\u06FF]/g, '')
        .trim();

    if (/[\u0600-\u06FF]/.test(normalized)) {
        if (normalized.length > 3) {
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

// Fonction de détection du type de requête - CORRIGÉE
export const detectRequestType = (message) => {
    const msg = message.toLowerCase().trim();
    
    // 1. Vérifier d'abord les commandes exactes
    const normalizedMsg = msg.toLowerCase().trim();
    
    if (exactCommands.specialty.includes(normalizedMsg)) {
        return 'specialties-list';
    }
    
    if (exactCommands.region.includes(normalizedMsg)) {
        return 'regions-list';
    }
    
    if (exactCommands.university.includes(normalizedMsg)) {
        return 'institutions-list';
    }
    
    // 2. Vérifier les patterns complets
    const hasOrientationPattern = requestPatterns.orientation.some(pattern => msg.includes(pattern));
    const hasDataPattern = requestPatterns.data.some(pattern => msg.includes(pattern));
    
    // CORRECTION: Détection améliorée des listes
    const hasListPattern = requestPatterns.list.some(pattern => msg.includes(pattern)) || 
                         normalizedMsg.startsWith('what ') ||
                         normalizedMsg.startsWith('list ') ||
                         normalizedMsg.includes('قائمة') ||
                         normalizedMsg.includes('لائحة');

    // 3. Vérifier les mots-clés spécifiques - CORRECTION: Priorité aux données
    const hasDataKeywords = requestPatterns.dataKeywords.some(keyword => 
        msg.includes(keyword)
    );
    
    const hasOrientationKeywords = requestPatterns.orientationKeywords.some(keyword => 
        msg.includes(keyword)
    );

    const hasRegionKeywords = requestPatterns.regionKeywords.some(keyword => msg.includes(keyword));
    const hasInstitutionKeywords = requestPatterns.institutionKeywords.some(keyword => msg.includes(keyword));
    const hasSpecialtyKeywords = requestPatterns.specialtyKeywords.some(keyword => msg.includes(keyword));

    // Logique de décision - CORRIGÉE
    // 1. D'abord les données personnelles
    if (hasDataPattern || hasDataKeywords) {
        return 'data';
    }
    
    // 2. Ensuite les listes
    if (hasListPattern) {
        if (hasRegionKeywords || msg.includes('منطقة') || msg.includes('region')) {
            return 'regions-list';
        }
        if (hasSpecialtyKeywords || msg.includes('تخصص') || msg.includes('specialty')) {
            return 'specialties-list';
        }
        if (hasInstitutionKeywords || msg.includes('مؤسسة') || msg.includes('institution')) {
            return 'institutions-list';
        }
        // Par défaut pour les listes sans précision
        return 'specialties-list';
    }
    
    // 3. Orientation générale
    if (hasOrientationPattern || hasOrientationKeywords) {
        return 'orientation';
    }
    
    // 4. Détection spécifique par mots-clés
    if (hasRegionKeywords) return 'regions-list';
    
    if (hasInstitutionKeywords) return 'institutions-list';
    
    if (hasSpecialtyKeywords) return 'specialties-list';
    
    return 'general';
};

// Fonction d'extraction des mots-clés de spécialité - CORRIGÉE
export const extractSpecialtyKeyword = (message) => {
    const requestType = detectRequestType(message);
    const msg = message.toLowerCase().trim();

    // Détection des interactions
    if (interactionPatterns.thanks.some(pattern => msg.includes(pattern))) {
        return {
            specialtyKeyword: 'thanks',
            normalizedKeyword: 'thanks',
            isThanks: true
        };
    }

    if (interactionPatterns.greetings.some(pattern => msg.includes(pattern))) {
        return {
            specialtyKeyword: 'bonjour',
            normalizedKeyword: 'bonjour',
            isGreeting: true
        };
    }

    if (interactionPatterns.topRequests.some(pattern => msg.includes(pattern))) {
        return {
            specialtyKeyword: 'top',
            normalizedKeyword: 'top',
            isTopRequest: true
        };
    }

    // Si c'est une requête de données ou listes
    if (requestType === 'data' || requestType.includes('-list')) {
        return {
            specialtyKeyword: requestType,
            normalizedKeyword: requestType,
            isDataRequest: requestType === 'data',
            isListRequest: requestType.includes('-list'),
            requestType: requestType
        };
    }

    // Nettoyage pour la recherche de spécialités
    let cleaned = msg
        .replace(/[.,!?;:]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    // Nettoyage spécial pour l'arabe
    let arabicCleaned = cleaned;
    arabicParticles.forEach(particle => {
        arabicCleaned = arabicCleaned.replace(new RegExp(`\\b${particle}`, 'g'), '');
    });
    arabicCleaned = arabicCleaned.replace(/\s+/g, ' ').trim();

    const finalCleaned = /[\u0600-\u06FF]/.test(cleaned) ? arabicCleaned : cleaned;

    // Filtrage intelligent des mots pour l'orientation - CORRIGÉ
    const orientationWords = finalCleaned.split(' ')
        .filter(word => {
            const minLength = /[\u0600-\u06FF]/.test(word) ? 2 : 3;
            
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

// Fonction de recherche de spécialités correspondantes - CORRIGÉE
export const findMatchingSpecialties = (keyword, normalizedKeyword, specialties, getDisplayName, normalizeWord) => {
    if (!specialties.length) return [];

    // CORRECTION: Recherche améliorée avec les nouvelles spécialités
    const matches = specialties.filter(spec => {
        const specName = spec.toLowerCase();
        const displayName = getDisplayName(spec).toLowerCase();

        const normalizedSpec = normalizeWord(specName);
        const normalizedDisplay = normalizeWord(displayName);

        // Vérifier les correspondances principales
        if (mainMatches[normalizedKeyword]) {
            const targetWords = mainMatches[normalizedKeyword].targets;
            return targetWords.some(target =>
                specName.includes(target) ||
                displayName.includes(target) ||
                normalizedSpec.includes(normalizeWord(target)) ||
                normalizedDisplay.includes(normalizeWord(target))
            );
        }

        // Vérifier les mots courts
        if (normalizedKeyword.length < 2) return false;

        // Recherche directe
        const keywordInSpec = specName.includes(keyword) || normalizedSpec.includes(normalizedKeyword);
        const keywordInDisplay = displayName.includes(keyword) || normalizedDisplay.includes(normalizedKeyword);

        const minLengthForShortWords = /[\u0600-\u06FF]/.test(normalizedKeyword) ? 2 : 3;

        if (normalizedKeyword.length <= minLengthForShortWords) {
            if (!shortWords.includes(normalizedKeyword)) {
                return false;
            }
        }

        return keywordInSpec || keywordInDisplay;
    });

    return matches.slice(0, 8); // Augmenté à 8 résultats
};

// Fonction pour nettoyer les valeurs de seuil
export const cleanThresholdValue = (value) => {
    if (value === null || value === undefined) return '-';
    const strValue = String(value).trim();
    return strValue === '' || strValue === '-' ? '-' : parseFloat(value);
};

// Fonction pour extraire les spécialités individuelles - CORRIGÉE
export const extractIndividualSpecialties = (specialtiesData) => {
    const individualSpecialties = new Set();

    if (Array.isArray(specialtiesData) && specialtiesData.length > 0) {
        if (typeof specialtiesData[0] === 'string') {
            specialtiesData.forEach(specialty => {
                const lines = specialty.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 2 && 
                           !line.toLowerCase().includes('spécialité') &&
                           !line.toLowerCase().includes('specialty'));
                
                lines.forEach(line => {
                    if (line && line.length > 2) {
                        individualSpecialties.add(line);
                    }
                });
            });
        } else if (typeof specialtiesData[0] === 'object') {
            // Si c'est un tableau d'objets
            specialtiesData.forEach(item => {
                if (item.specialties) {
                    const lines = item.specialties.split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 2);
                    
                    lines.forEach(line => {
                        if (line && line.length > 2) {
                            individualSpecialties.add(line);
                        }
                    });
                }
            });
        }
    } else if (typeof specialtiesData === 'object' && specialtiesData !== null) {
        Object.values(specialtiesData).forEach(value => {
            if (value && typeof value === 'string') {
                const lines = value.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 2);
                
                lines.forEach(line => {
                    if (line && line.length > 2) {
                        individualSpecialties.add(line);
                    }
                });
            }
        });
    }

    return Array.from(individualSpecialties).sort((a, b) => a.localeCompare(b));
};

// Fonction pour rechercher les institutions - CORRIGÉE
export const searchInstitutions = async (keyword) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/orientations/');
        const data = await response.json();
        const institutions = [...new Set(data.map(item => item.institution))].filter(Boolean);
        
        const normalizedKeyword = keyword.toLowerCase();
        return institutions.filter(inst => 
            inst.toLowerCase().includes(normalizedKeyword) ||
            inst.toLowerCase().replace(/\s/g, '').includes(normalizedKeyword.replace(/\s/g, ''))
        );
    } catch (error) {
        console.error('Error searching institutions:', error);
        return [];
    }
};

// Fonction pour obtenir les orientations d'une institution - CORRIGÉE
export const getOrientationsByInstitution = async (institutionName, bacType, translateInstitution, translateBacType, t) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/orientations/institution/${encodeURIComponent(institutionName)}/`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const orientationsData = await response.json();
        const filteredOrientations = orientationsData.filter(o => o.bac_type === bacType);

        const currentLang = document.documentElement.lang || 'fr';
        const isArabic = currentLang === 'ar';
        const isEnglish = currentLang === 'en';

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
            responseText += `${index + 1}. ${specialtyName}\n`;
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

// Fonction de réponse intelligente locale - CORRIGÉE
export const getLocalIntelligentResponse = (question, userData, t, translateBacType) => {
    const isArabic = t('lang') === 'ar';
    const isEnglish = t('lang') === 'en';

    const translatedBacType = translateBacType(userData.bac_type);

    if (isArabic) {
        return `مرحباً! أنا هنا لمساعدتك في توجيهك الجامعي. 

📊 **ملفك الشخصي:**
• **نوع البكالوريا:** ${translatedBacType}
• **المعدل العام:** ${userData.mg}
• **مدينتك:** ${userData.ville || 'غير محددة'}

💡 **يمكنني مساعدتك في:**
• استكشاف التخصصات المناسبة لمعدلك
• عرض قوائم المؤسسات والتخصصات  
• تقديم نصائح توجيهية مخصصة

🎯 **جرب أن تسألني:**
• "ما هي أفضل التخصصات لي؟"
• "أريد دراسة الطب" أو "أحب الهندسة"
• "عرض قائمة التخصصات"
• "المؤسسات في ${userData.ville || 'منطقتك'}"`;
    } else if (isEnglish) {
        return `Hello! I'm here to help you with your university orientation.

📊 **Your Profile:**
• **Baccalaureate Type:** ${translatedBacType}
• **General Average:** ${userData.mg}
• **Your City:** ${userData.ville || 'Not specified'}

💡 **I can help you with:**
• Exploring specialties suitable for your average
• Displaying lists of institutions and specialties
• Providing personalized orientation advice

🎯 **Try asking me:**
• "What are the best specialties for me?"
• "I want to study medicine" or "I like engineering"
• "Show list of specialties"
• "Institutions in ${userData.ville || 'your region'}"`;
    } else {
        return `Bonjour ! Je suis là pour vous aider dans votre orientation universitaire.

📊 **Votre profil :**
• **Type de bac :** ${translatedBacType}
• **Moyenne générale :** ${userData.mg}
• **Votre ville :** ${userData.ville || 'Non spécifiée'}

💡 **Je peux vous aider à :**
• Explorer les spécialités adaptées à votre moyenne
• Afficher des listes d'établissements et de spécialités
• Donner des conseils d'orientation personnalisés

🎯 **Essayez de me demander :**
• "Quelles sont les meilleures spécialités pour moi ?"
• "Je veux étudier la médecine" ou "J'aime l'ingénierie"
• "Afficher la liste des spécialités"
• "Institutions à ${userData.ville || 'votre région'}"`;
    }
};