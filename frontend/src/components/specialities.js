import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/speciality.css';

const cleanSpecialtyString = (str) => {
  if (!str) return '';
  let cleaned = str.replace(/االجازة/g, 'الإجازة');
  cleaned = cleaned.replace(/\n/g, ' ');
  return cleaned.replace(/\s+/g, ' ').trim();
};

const extractIndividualSpecialties = (specialtiesData) => {
  const individualSpecialties = new Set();
  
  specialtiesData.forEach(specialtyGroup => {
    const lines = specialtyGroup.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    lines.forEach(line => {
      individualSpecialties.add(line);
    });
  });
  
  return Array.from(individualSpecialties);
};

const UserOrientationSpecialty = () => {
  const { t, i18n } = useTranslation();
  
  const [bacType, setBacType] = useState('');
  const [mg, setMg] = useState(null);
  const [fg, setFg] = useState(null);
  const [username, setusername] = useState(null);
  const [userVille, setUserVille] = useState('');
  const [userNotes, setUserNotes] = useState({});
  const [specialties, setSpecialties] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [orientations, setOrientations] = useState([]);
  const [filteredOrientations, setFilteredOrientations] = useState([]);
  const [loading, setLoading] = useState({
    profile: false,
    specialties: false,
    orientations: false,
    calculating: false
  });
  const [error, setError] = useState(null);
  const [calculatedScores, setCalculatedScores] = useState({});
  const [noBacTypeMessage, setNoBacTypeMessage] = useState('');
  const [specialtyMap, setSpecialtyMap] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const [showPage, setShowPage] = useState(false);
  const [accessCheckComplete, setAccessCheckComplete] = useState(false); // Nouveau state pour le loader

  const getDisplayName = (specialtyKey) => {
    return t(`db.specialties.${specialtyKey}`, { defaultValue: specialtyKey });
  };

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

  const cleanThresholdValue = (value) => {
    if (value === null || value === undefined) return '-';
    const strValue = String(value).trim();
    return strValue === '' || strValue === '-' ? '-' : parseFloat(value);
  };

  // Load user profile
  useEffect(() => {
    setLoading(prev => ({ ...prev, profile: true }));
    fetch('http://127.0.0.1:8000/api/profile/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(t('errors.networkError'));
        return res.json();
      })
      .then(data => {
        if (data.etudiant) {
          const { username, bac_type, mg, fg, ville, A, PH, HG, F, Ang, M, SP, Sp_sport, SVT, Ge, Ec, TE, Algo, STI, SB, EP, IT, ESP, All, Info } = data.etudiant;
          
          // Check if user is admin or not connected - don't show page
          if (username === "admin" || !username) {
            console.log('Admin user or not connected, hiding page');
            setShowPage(false);
          } else {
            setShowPage(true);
            setBacType(bac_type || '');
            setusername(username || null);
            setMg(mg || null);
            setFg(fg || null);
            setUserVille(ville || '');
            setUserNotes({
              MG: mg, FG: fg, A, PH, HG, F, ANG: Ang, M, SP, INFO: Info,
              Sp_sport, SVT, Ge, Ec, TE, Algo, STI, SB, EP, IT, ESP, ALL: All
            });
          }
        } else {
          throw new Error(t('errors.incompleteProfile'));
        }
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setShowPage(false);
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, profile: false }));
        setAccessCheckComplete(true); // Marquer la vérification d'accès comme terminée
      });
  }, [t]);

  // Load specialties
  useEffect(() => {
    if (bacType && showPage) {
      setLoading(prev => ({ ...prev, specialties: true }));
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
          setFilteredSpecialties(individualSpecialties);
          setSpecialtyMap(mapping);
        })
        .catch(err => {
          console.error('Error:', err);
          setError(t('errors.loadSpecialties'));
        })
        .finally(() => setLoading(prev => ({ ...prev, specialties: false })));
    }
  }, [bacType, t, showPage]);

  // Calculate score function
  const calculateScore = (formula) => {
    if (!formula || !userNotes) return null;

    try {
      let expression = formula.toString()
        .replace(/\s/g, '')
        .replace(/Max\(/g, 'Math.max(')
        .replace(/(\d+)([A-Zaza-ÿ]+)/g, '$1*$2')
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

      if (/[a-za-ÿ]/.test(expression.replace(/Math\.max\(/g, ''))) {
        console.warn('Unrecognized variables:', expression.match(/[a-za-ÿ]+/g));
        return null;
      }

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

  // Determine status
  const getStatus = (currentScore, lastYearScore) => {
    if (!currentScore || currentScore === t('errors.calculationError')) return null;

    const cleanedThreshold = cleanThresholdValue(lastYearScore);
    const scoreToCompare = currentScore;
    
    if (cleanedThreshold === '-' || cleanedThreshold === '' || cleanedThreshold === null) {
      return { text: t('status.accepted'), className: 'status-accepted', accepted: true };
    }

    if (cleanedThreshold === 0) {
      return { text: t('status.accepted'), className: 'status-accepted', accepted: true };
    }

    const current = parseFloat(scoreToCompare);
    const threshold = parseFloat(cleanedThreshold);

    if (isNaN(current) || isNaN(threshold)) {
      return null;
    }

    const accepted = current >= threshold - 5;
    return {
      text: accepted ? t('status.accepted') : t('status.rejected'),
      className: accepted ? 'status-accepted' : 'status-rejected',
      accepted: accepted
    };
  };

  // Load orientations and calculate scores automatically
  useEffect(() => {
    if (selectedSpecialty && bacType && showPage) {
      setLoading(prev => ({ ...prev, orientations: true, calculating: true }));
      setNoBacTypeMessage('');
      
      const originalSpecialty = specialtyMap[selectedSpecialty]?.original || selectedSpecialty;
      
      if (!originalSpecialty) {
        console.error("No valid specialty found for API call");
        setError("Invalid specialty selection");
        setLoading(prev => ({ ...prev, orientations: false, calculating: false }));
        return;
      }
      
      fetch(`http://127.0.0.1:8000/api/orientations/specialty/${encodeURIComponent(originalSpecialty)}/`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`API error: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then(data => {
          const filtered = data.filter(o => o.bac_type === bacType);
          
          if (filtered.length === 0) {
              setNoBacTypeMessage(`${t('orientation.noBacTypeMessage')} (${t(`bac.${bacType}`)})`);
          }
          
          setOrientations(filtered);
          
          // Calculate scores for all orientations with bonus application
          const newCalculatedScores = {};
          filtered.forEach(orientation => {
            // Vérifier si le bonus s'applique
            const shouldApplyBonus = orientation.geographic_preference === 'نعم' && userVille === orientation.region;
            const baseScore = calculateScore(orientation.calculation_format);
            
            // Appliquer le bonus de 7% si les conditions sont remplies
            const finalScore = shouldApplyBonus && baseScore !== null ? baseScore * 1.07 : baseScore;
            const status = getStatus(finalScore, orientation.last_year_score);
            
            newCalculatedScores[orientation.id] = {
              baseScore: baseScore,
              finalScore: finalScore !== null ? parseFloat(finalScore.toFixed(2)) : null,
              lastYearScore: cleanThresholdValue(orientation.last_year_score),
              status: status,
              accepted: status?.accepted || false,
              shouldApplyBonus: shouldApplyBonus,
              hasBonus: shouldApplyBonus && baseScore !== null
            };
          });
          
          setCalculatedScores(newCalculatedScores);
          
          // Filter and sort orientations (only accepted, trié par seuil décroissant)
          const acceptedOrientations = filtered
            .filter(orientation => {
              const scoreData = newCalculatedScores[orientation.id] || {};
              return scoreData.accepted;
            })
            .sort((a, b) => {
              const thresholdA = parseFloat(cleanThresholdValue(a.last_year_score)) || 0;
              const thresholdB = parseFloat(cleanThresholdValue(b.last_year_score)) || 0;
              return thresholdB - thresholdA; // Ordre décroissant (seuil le plus élevé d'abord)
            });
          
          setFilteredOrientations(acceptedOrientations);
        })
        .catch(err => {
          console.error('Error loading orientations:', err);
          setError(t('errors.loadOrientations'));
        })
        .finally(() => setLoading(prev => ({ ...prev, orientations: false, calculating: false })));
    }
  }, [selectedSpecialty, bacType, t, specialtyMap, userVille, showPage]);

  // Filter specialties
  useEffect(() => {
    if (searchTerm && showPage) {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = specialties.filter(specialty => {
        if (specialty.toLowerCase().includes(searchTermLower)) return true;
        
        const translations = [
          t(`db.specialties.${specialty}`, { lng: 'ar', defaultValue: specialty }),
          t(`db.specialties.${specialty}`, { lng: 'fr', defaultValue: specialty }),
          t(`db.specialties.${specialty}`, { lng: 'en', defaultValue: specialty })
        ];
        
        return translations.some(translation => 
          translation.toLowerCase().includes(searchTermLower)
        );
      });
      setFilteredSpecialties(filtered);
    } else {
      setFilteredSpecialties(specialties);
    }
  }, [searchTerm, specialties, t, i18n.language, showPage]);

  const formatSpecialties = (specialtiesText) => {
    if (!specialtiesText) return 'N/A';
    
    return specialtiesText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index) => (
        <div key={index} className="specialty-item">
          {translateField('specialties', line)}
        </div>
      ));
  };

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === Math.ceil(filteredSpecialties.length / 4) - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.ceil(filteredSpecialties.length / 4) - 1 : prev - 1
    );
  };

  // Handle specialty selection from carousel
  const handleSpecialtySelect = (specialty) => {
    setSelectedSpecialty(specialty);
  };

  // Handle back to specialties
  const handleBackToSpecialties = () => {
    setSelectedSpecialty('');
    setSearchTerm('');
    setCurrentSlide(0);
  };

  // Effect to reset carousel when filteredSpecialties changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [filteredSpecialties]);

  // Effect to handle RTL direction for carousel
  useEffect(() => {
    if (carouselRef.current) {
      if (i18n.language === 'ar') {
        carouselRef.current.style.direction = 'rtl';
      } else {
        carouselRef.current.style.direction = 'ltr';
      }
    }
  }, [i18n.language]);

  // Afficher le loader pendant la vérification d'accès
  if (!accessCheckComplete) {
    return (
      <div className="orientation-specialty-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>{t('access.checkingPermissions')}</p>
        </div>
      </div>
    );
  }

  // Don't show page if user is admin or not connected
  if (!showPage) {
    return (
      <div className="orientation-specialty-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="access-denied">
          <h2>{t('orientation.accessDenied')}</h2>
          <p>{t('orientation.adminOrNotConnected')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orientation-specialty-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header section */}
      <div className="orientation-header">
        <h1 className="orientation-title">{t('orientation.specialtyTitle')}</h1>
      </div>

      {/* Search section - Only shown when no specialty is selected */}
      {!selectedSpecialty && (
        <div className="orientation-content-section">
          <div className="search-container">
            <div className="search-row">
              <div className="search-label">{t('orientation.searchSpecialtyLabel')}</div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('orientation.searchSpecialtyPlaceholder')}
                className="search-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Specialties Carousel section - Only shown when no specialty is selected */}
      {filteredSpecialties.length > 0 && !selectedSpecialty && (
        <div className="specialties-carousel-container">
          <h2 className="specialties-carousel-title">{t('orientation.availableSpecialties')}</h2>
          
          <div className="carousel-wrapper">
            <button className={`carousel-button prev ${i18n.language === 'ar' ? 'rtl' : ''}`} onClick={i18n.language === 'ar' ? nextSlide : prevSlide}>
              {i18n.language === 'ar' ? '→' : '←'}
            </button>
            
            <div className="specialties-carousel" ref={carouselRef}>
              <div 
                className="carousel-track" 
                style={{ 
                  transform: i18n.language === 'ar' 
                    ? `translateX(${currentSlide * 100}%)` 
                    : `translateX(-${currentSlide * 100}%)` 
                }}
              >
                {filteredSpecialties.map((specialty, index) => (
                  <div 
                    key={index} 
                    className="specialty-carousel-card"
                    onClick={() => handleSpecialtySelect(specialty)}
                  >
                    <div className="specialty-card-content">
                      <h3 className="specialty-card-title">{getDisplayName(specialty)}</h3>
                      <button className="learn-more-btn">
                        {t('orientation.learnMore')} {i18n.language === 'ar' ? '←' : '→'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button className={`carousel-button next ${i18n.language === 'ar' ? 'rtl' : ''}`} onClick={i18n.language === 'ar' ? prevSlide : nextSlide}>
              {i18n.language === 'ar' ? '←' : '→'}
            </button>
          </div>
        </div>
      )}

      {/* Career Advice section instead of Table section */}
      <div className="orientation-career-advice-section">
        {selectedSpecialty && (
          <div className="selected-specialty-header">
            <h2>
              {t('orientation.resultsForSpecialty')} "{getDisplayName(selectedSpecialty)}"
            </h2>
            <button 
              className="back-to-specialties"
              onClick={handleBackToSpecialties}
            >
              {i18n.language === 'ar' ? '→' : '←'} {t('orientation.backToSpecialties')}
            </button>
          </div>
        )}

        {noBacTypeMessage && (
          <div className="bac-type-error">
            {noBacTypeMessage}
          </div>
        )}

        {loading.calculating && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>{t('orientation.calculatingScores')}</p>
          </div>
        )}

        {filteredOrientations.length > 0 && (
          <div className="career-advice-container">
            <h3 className="advice-title">{t('orientation.careerAdvice')}</h3>
            <p className="advice-intro">
              {t('orientation.hereAreRecommendations')}
            </p>
            
            <div className="advice-cards">
              {filteredOrientations.map((orientation, index) => {
                const scoreData = calculatedScores[orientation.id] || {};
                const threshold = cleanThresholdValue(orientation.last_year_score);
                const hasBonus = scoreData.hasBonus;
                
                return (
                  <div key={index} className={`advice-card ${hasBonus ? 'with-bonus' : ''}`}>
                    <div className="advice-card-header">
                      <h4 className="institution-name">{translateField('institutions', orientation.institution)}</h4>
                      <span className="advice-rank">#{index + 1}</span>
                      {hasBonus && (
                        <span className="bonus-badge">+7%</span>
                      )}
                    </div>
                    
                    <div className="advice-card-content">
                      <div className="advice-detail">
                        <span className="detail-label">{t('table.Degree')}:</span>
                        <span className="detail-value">{translateField('degrees', orientation.degree)}</span>
                      </div>
                      
                      <div className="advice-detail">
                        <span className="detail-label">{t('orientation.specialties')}:</span>
                        <div className="detail-value">
                          {formatSpecialties(orientation.specialties)}
                        </div>
                      </div>
                      
                      <div className="advice-detail">
                        <span className="detail-label">{t('orientation.yourScore')}:</span>
                        <span className={`detail-value score ${hasBonus ? 'with-bonus' : ''}`}>
                          {scoreData.finalScore || '-'}
                          {hasBonus && (
                            <span className="bonus-indicator"> (avec bonus 7%)</span>
                          )}
                        </span>
                      </div>
                      
                      <div className="advice-detail">
                        <span className="detail-label">{t('orientation.lastYearThreshold')}:</span>
                        <span className="detail-value threshold">{threshold}</span>
                      </div>
                      
                      <div className="advice-confidence">
                        <div className="confidence-meter">
                          <div 
                            className="confidence-fill" 
                            style={{ 
                              width: `${Math.min(100, Math.max(0, ((scoreData.finalScore || 0) / (threshold === '-' ? 100 : threshold)) * 100))}%` 
                            }}
                          ></div>
                        </div>
                        <div className="confidence-label">
                          {t('orientation.highAdmissionChance')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="advice-summary">
              <h4>{t('orientation.summaryTitle')}</h4>
              <p>
                {t('orientation.youHave')} <strong>{filteredOrientations.length}</strong> {t('orientation.viableOptions')} 
                {t('orientation.inSpecialty')} <strong>{getDisplayName(selectedSpecialty)}</strong>. 
                {t('orientation.recommendFocusOn')} <strong>{translateField('institutions', filteredOrientations[0]?.institution)}</strong> 
                {t('orientation.asTopChoice')}
              </p>
            </div>
          </div>
        )}

        {!loading.calculating && filteredOrientations.length === 0 && orientations.length > 0 && (
          <div className="no-results">
            <div className="no-results-content">
              <h3>{t('orientation.noViableOptions')}</h3>
              <p>{t('orientation.considerAlternativeSpecialties')}</p>
              <button className="back-to-specialties-btn" onClick={handleBackToSpecialties}>
                {t('orientation.exploreOtherSpecialties')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrientationSpecialty;