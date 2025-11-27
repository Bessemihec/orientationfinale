import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/UserOrientationScore.css';
import userAvatar from '../images/user.jpg';

// Custom pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxVisiblePages = 3;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <button 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1}
        className="pagination-button first-last"
        title="First Page"
      >
        &laquo;
      </button>
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
        disabled={currentPage === 1}
        className="pagination-button prev-next"
        title="Previous Page"
      >
        &lsaquo;
      </button>
      
      {startPage > 1 && (
        <span className="pagination-ellipsis">...</span>
      )}
      
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`pagination-button ${currentPage === number ? 'active' : ''}`}
        >
          {number}
        </button>
      ))}
      
      {endPage < totalPages && (
        <span className="pagination-ellipsis">...</span>
      )}
      
      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
        disabled={currentPage === totalPages}
        className="pagination-button prev-next"
        title="Next Page"
      >
        &rsaquo;
      </button>
      <button 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages}
        className="pagination-button first-last"
        title="Last Page"
      >
        &raquo;
      </button>
      
      <span className="pagination-info">
        Page {currentPage} sur {totalPages}
      </span>
    </div>
  );
};

const cleanDegreeString = (str) => {
  let cleaned = str.replace(/االجازة/g, 'الإجازة');
  cleaned = cleaned.replace(/\n/g, ' ');
  return cleaned.replace(/\s+/g, ' ').trim();
};

const formatKey = (key) => {
  const formatted = key.replace(/_/g, ' ');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const shouldDisplayField = (key) => {
  const excludedFields = ['id', 'bac_type', 'degree',"region", 'last_year_score'];
  return !excludedFields.includes(key);
};

const UserOrientationScore = () => {
  const { t, i18n } = useTranslation();

  // All original state variables
  const [bacType, setBacType] = useState('');
  const [mg, setMg] = useState(null);
  const [fg, setFg] = useState(null);
  const [username, setusername] = useState(null);
  const [userVille, setUserVille] = useState('');
  const [userNotes, setUserNotes] = useState({});
  const [degrees, setDegrees] = useState([]);
  const [filteredDegrees, setFilteredDegrees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [orientations, setOrientations] = useState([]);
  const [loading, setLoading] = useState({
    profile: false,
    degrees: false,
    orientations: false,
    calculation: {}, // Pour gérer le loading par orientation
    accessCheck: true // Nouvel état pour la vérification d'accès
  });
  const [error, setError] = useState(null);
  const [calculatedScores, setCalculatedScores] = useState({});
  const [noBacTypeMessage, setNoBacTypeMessage] = useState('');
  const [degreeMap, setDegreeMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Changé à 4 items par page
  const [showPage, setShowPage] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [accessCheckComplete, setAccessCheckComplete] = useState(false); // Nouvel état

  // Helper functions for translation
  const getDisplayName = (degreeKey) => {
    const degreeData = degreeMap[degreeKey];
    if (!degreeData) return degreeKey;

    switch (i18n.language) {
      case 'fr': return degreeData.fr || degreeKey;
      case 'en': return degreeData.en || degreeKey;
      default: return degreeData.ar || degreeKey;
    }
  };

  const translateField = (field, value) => {
    if (!value || value === '-') return '-';

    const translationKey = `db.${field}.${value}`;
    const translation = t(translationKey, { defaultValue: value });

    return translation;
  };

  // Clean threshold values
  const cleanThresholdValue = (value) => {
    if (value === null || value === undefined) return '-';
    const strValue = String(value).trim();
    return strValue === '' || strValue === '-' ? '-' : value;
  };

  // Load user profile
  useEffect(() => {
    setLoading(prev => ({ ...prev, profile: true, accessCheck: true }));
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
        setLoading(prev => ({ ...prev, profile: false, accessCheck: false }));
        setAccessCheckComplete(true);
      });
  }, [t]);

  // Load degrees with translation mapping
  useEffect(() => {
    if (bacType && showPage) {
      setLoading(prev => ({ ...prev, degrees: true }));
      fetch('http://127.0.0.1:8000/api/orientations/degrees/all/')
        .then(res => res.json())
        .then(data => {
          const mapping = {};
          const cleanedDegrees = data.map(deg => {
            const normalized = cleanDegreeString(deg);
            mapping[normalized] = {
              original: deg,
              fr: t(`db.degrees.${normalized}`, { lng: 'fr', defaultValue: normalized }),
              en: t(`db.degrees.${normalized}`, { lng: 'en', defaultValue: normalized }),
              ar: normalized
            };
            return normalized;
          });

          setDegrees(cleanedDegrees);
          setFilteredDegrees(cleanedDegrees);
          setDegreeMap(mapping);
        })
        .catch(err => {
          console.error('Error:', err);
          setError(t('errors.loadDegrees'));
        })
        .finally(() => setLoading(prev => ({ ...prev, degrees: false })));
    }
  }, [bacType, t, showPage]);

  // Reset to first page when orientations change
  useEffect(() => {
    setCurrentPage(1);
  }, [orientations]);

  // Load orientations
  useEffect(() => {
    if (selectedDegree && bacType && showPage) {
      setLoading(prev => ({ ...prev, orientations: true }));
      setNoBacTypeMessage('');

      const originalDegree = degreeMap[selectedDegree]?.original || selectedDegree;

      fetch(`http://127.0.0.1:8000/api/orientations/degree/${encodeURIComponent(originalDegree)}/`)
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter(o => o.bac_type === bacType);
          if (filtered.length === 0) {
           setNoBacTypeMessage(`${t('orientation.noBacTypeMessage')} (${t(`bacType.${bacType}`, {defaultValue: bacType})})`);

          }
          setOrientations(filtered);
        })
        .catch(err => {
          console.error('Error:', err);
          setError(t('errors.loadOrientations'));
        })
        .finally(() => setLoading(prev => ({ ...prev, orientations: false })));
    }
  }, [selectedDegree, bacType, t, degreeMap, showPage]);

  // Filter degrees
  useEffect(() => {
    if (searchTerm && showPage) {
      const filtered = degrees.filter(degree => {
        const degreeData = degreeMap[degree] || {};
        return (
          degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (degreeData.fr && degreeData.fr.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (degreeData.en && degreeData.en.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
      setFilteredDegrees(filtered);
    } else {
      setFilteredDegrees(degrees);
    }
  }, [searchTerm, degrees, degreeMap, showPage]);

  // Calculate score
  const calculateScore = (formula) => {
    if (!formula || !userNotes) return null;

    try {
      let expression = formula.toString()
        .replace(/\s/g, '')
        .replace(/Max\(/g, 'Math.max(')
      .replace(/(\d+)([A-Za-zÀ-ÿ]+)/g, '$1*$2')
      .replace(/Ang/gi, 'ANG')
      .replace(/Info/gi, 'INFO')
      .replace(/\bA\b/g, 'A')
      .replace(/\bF\b/g, 'F')
      .replace(/\bM\b/g, 'M');

    Object.entries(userNotes).forEach(([key, value]) => {
      const val = value || 0;
      expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), val);
    });

    if (/[a-zA-ZÀ-ÿ]/.test(expression.replace(/Math\.max\(/g, ''))) {
      console.warn('Unrecognized variables:', expression.match(/[a-zA-ZÀ-ÿ]+/g));
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

const translateBac = (bacType) => {
  return t(`bacType.${bacType}`, { defaultValue: bacType });
};

// Handle calculation
const handleCalculate = async (orientationId, formula, lastYearScore, orientationRegion, geographicPreference) => {
  setLoading(prev => ({ 
    ...prev, 
    calculation: { ...prev.calculation, [orientationId]: true } 
  }));

  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 800));

  const cleanedLastYearScore = cleanThresholdValue(lastYearScore);
  const score = calculateScore(formula);
  
  // Vérifier si le bonus s'applique
  const shouldApplyBonus = geographicPreference === 'نعم' && userVille === orientationRegion;
  const scoreWithBonus = shouldApplyBonus && score !== null ? (score * 1.07).toFixed(2) : t('orientation.noBonus');

  setCalculatedScores(prev => ({
    ...prev,
    [orientationId]: {
      score: score !== null ? score : t('errors.calculationError'),
      lastYearScore: cleanedLastYearScore,
      scoreWithBonus: scoreWithBonus,
      shouldApplyBonus: shouldApplyBonus
    }
  }));

  setLoading(prev => ({ 
    ...prev, 
    calculation: { ...prev.calculation, [orientationId]: false } 
  }));
};

// Determine status
const getStatus = (currentScore, lastYearScore, withBonus = false, shouldApplyBonus = false) => {
  if (!currentScore || currentScore === t('errors.calculationError')) return null;

  // Si c'est avec bonus mais que le bonus ne s'applique pas
  if (withBonus && !shouldApplyBonus) {
    return { text: t('status.noBonusApplied'), className: 'status-no-bonus' };
  }

  const cleanedThreshold = String(lastYearScore).trim();
  const scoreToCompare = withBonus ? currentScore * 1.07 : currentScore;

  if (cleanedThreshold === '-' || cleanedThreshold === '' || cleanedThreshold === null) {
    return { text: t('status.accepted'), className: 'status-accepted' };
  }

  if (cleanedThreshold === '0') {
    return { text: t('status.accepted'), className: 'status-accepted' };
  }

  const current = parseFloat(scoreToCompare);
  const threshold = parseFloat(cleanedThreshold);

  if (isNaN(current) || isNaN(threshold)) {
    return null;
  }

  return current >= threshold - 5
    ? { text: t('status.accepted'), className: 'status-accepted' }
    : { text: t('status.rejected'), className: 'status-rejected' };
};

// Fonction pour gérer le hover sur les cellules
const handleCellHover = (event, content) => {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  
  setHoveredCell({
    content: content?.toString() || '',
    position: {
      top: rect.top - 10,
      left: rect.left + rect.width / 2
    }
  });
};

const handleCellLeave = () => {
  setHoveredCell(null);
};

// Afficher le loader pendant la vérification d'accès
if (!accessCheckComplete) {
  return (
    <div className="orientation-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
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
    <div className="orientation-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="access-denied">
        <h2>{t('orientation.accessDenied')}</h2>
        <p>{t('orientation.adminOrNotConnected')}</p>
      </div>
    </div>
  );
}

return (
  <div className="orientation-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
    {/* Top section - Réduit en hauteur */}
    <div className="top-section">
      {/* User profile - Réduit */}
      <div className="user-profile-section compact">
        <div className="avatar">
          <img src={userAvatar} alt={t('profile.avatarAlt')} />
        </div>
        <div className="user-name">{username}</div>
        <div className="user-info">
          <div className="user-info-item">
            <div className="user-info-value" style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {fg !== null ? fg.toFixed(2) : '-'}
            </div>
            <div className="user-info-label" style={{ marginTop: '3px', fontSize: '13px' }}>
              {bacType ? translateBac(bacType) : t('profile.bacNotSpecified')}
            </div>
          </div>
        </div>
      </div>

      {/* Search section - Réduit */}
      <div className="content-section compact">
        <h1 className="section-title compact-title">{t('orientation.title')}</h1>

        <div className="search-container compact-search">
          <div className="search-row compact-row">
            <div className="search-label compact-label">{t('orientation.searchLabel')}</div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('orientation.searchPlaceholder')}
              className="search-input compact-input"
            />
          </div>

          <div className="search-row compact-row">
            <div className="search-label compact-label">{t('orientation.selectLabel')}</div>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="degree-select compact-select"
              disabled={loading.orientations}
            >
              <option value="">{t('orientation.selectDefault')}</option>
              {filteredDegrees.map((degree, index) => (
                <option key={index} value={degree}>
                  {getDisplayName(degree)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>

    {/* Table section */}
    <div className="table-section">
      {noBacTypeMessage && (
        <div className="bac-type-error">
          {noBacTypeMessage}
        </div>
      )}

      {orientations.length > 0 && (
        <div className="results-container">
          <h3 className="compact-results-title">
            {t('orientation.resultsFor')} "{getDisplayName(selectedDegree)}"
            <span className="results-count"> ({orientations.length} résultats)</span>
          </h3>

          <div className="table-responsive">
            <table className="orientations-table">
              <thead>
                <tr>
                  {orientations[0] && Object.keys(orientations[0])
                    .filter(shouldDisplayField)
                    .map((key, index) => (
                      <th key={index}>
                        <span>{t(`table.${key}`, { defaultValue: formatKey(key) })}</span>
                      </th>
                    ))}
                   <th><span>{t('orientation.calculate')}</span></th>
                  <th><span>{t('orientation.score')}</span></th>
                  <th><span>{t('orientation.scoreWithBonus')}</span></th>
                  <th><span>{t('orientation.threshold')}</span></th>
                  <th><span>{t('orientation.status')}</span></th>
                  <th><span>{t('orientation.statusWithBonus')}</span></th>
                </tr>
              </thead>
              <tbody>
                {orientations
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((orientation, index) => {
                  const scoreData = calculatedScores[orientation.id] || {};
                  const status = getStatus(scoreData.score, orientation.last_year_score, false, scoreData.shouldApplyBonus);
                  const statusWithBonus = getStatus(scoreData.score, orientation.last_year_score, true, scoreData.shouldApplyBonus);
                  const isCalculating = loading.calculation[orientation.id];

                  return (
                    <tr key={index}>
                      {Object.entries(orientation)
                        .filter(([key]) => shouldDisplayField(key))
                        .map(([key, value]) => {
                          let displayValue;
                          
                          if (key === 'category') {
                            displayValue = translateField('categories', value);
                          } else if (key === 'institution') {
                            displayValue = translateField('institutions', value);
                          } else if (key === 'specialties') {
                            displayValue = translateField('specialties', value);
                          } else if (key === 'gender') {
                            displayValue = translateField('genders', value);
                          } else if (key === 'matiere_principale') {
                            displayValue = translateField('mainSubjects', value);
                          } else if (key === 'test') {
                            displayValue = translateField('answers', value);
                          } else if (key === 'geographic_preference') {
                            displayValue = translateField('geographic_preference', value);
                          } else if (key === 'region') {
                            displayValue = translateField('regions', value);
                          } else {
                            displayValue = value !== null ? value.toString() : 'N/A';
                          }
                          
                          return (
                            <td 
                              key={key}
                              onMouseEnter={(e) => handleCellHover(e, displayValue)}
                              onMouseLeave={handleCellLeave}
                              className="table-cell"
                            >
                              <span className="cell-content">{displayValue}</span>
                            </td>
                          );
                        })}
                      <td>
                        <button
                          onClick={() => handleCalculate(
                            orientation.id, 
                            orientation.calculation_format, 
                            orientation.last_year_score,
                            orientation.region,
                            orientation.geographic_preference
                          )}
                          className="calculate-btn"
                          disabled={isCalculating}
                        >
                          {isCalculating ? (
                            <div className="loading-spinner-small"></div>
                          ) : (
                            t('buttons.calculate')
                          )}
                        </button>
                      </td>
                      
                      {/* Colonne Score avec tooltip */}
                      <td className='scoreuser'>
                        <span 
                          className="cell-content"
                          onMouseEnter={(e) => handleCellHover(e, scoreData.score || '-')}
                          onMouseLeave={handleCellLeave}
                        >
                          {isCalculating ? (
                            <div className="loading-spinner-small"></div>
                          ) : (
                            scoreData.score || '-'
                          )}
                        </span>
                      </td>
                      
                      {/* Colonne Score +7% avec tooltip */}
                      <td className='scorewithbonus'>
                        <span 
                          className="cell-content"
                          onMouseEnter={(e) => handleCellHover(e, scoreData.scoreWithBonus || '-')}
                          onMouseLeave={handleCellLeave}
                        >
                          {isCalculating ? (
                            <div className="loading-spinner-small"></div>
                          ) : (
                            scoreData.scoreWithBonus || '-'
                          )}
                        </span>
                      </td>
                      
                      {/* Colonne Seuil avec tooltip */}
                      <td>
                        <span 
                          className="cell-content"
                          onMouseEnter={(e) => handleCellHover(e, orientation.last_year_score || '-')}
                          onMouseLeave={handleCellLeave}
                        >
                          {orientation.last_year_score || '-'}
                        </span>
                      </td>
                      
                      {/* Colonne Statut avec tooltip */}
                      <td className={status?.className || (scoreData.score ? '' : 'not-calculated')}>
                        <span 
                          className="cell-content"
                          onMouseEnter={(e) => handleCellHover(e, status?.text || (scoreData.score ? '-' : t('status.notCalculated')))}
                          onMouseLeave={handleCellLeave}
                        >
                          {isCalculating ? (
                            <div className="loading-spinner-small"></div>
                          ) : (
                            status?.text || (scoreData.score ? '-' : t('status.notCalculated'))
                          )}
                        </span>
                      </td>
                      
                      {/* Colonne Statut avec bonus avec tooltip */}
                      <td className={statusWithBonus?.className || (scoreData.score ? '' : 'not-calculated')}>
                        <span 
                          className="cell-content"
                          onMouseEnter={(e) => handleCellHover(e, statusWithBonus?.text || (scoreData.score ? '-' : t('status.notCalculated')))}
                          onMouseLeave={handleCellLeave}
                        >
                          {isCalculating ? (
                            <div className="loading-spinner-small"></div>
                          ) : (
                            statusWithBonus?.text || (scoreData.score ? '-' : t('status.notCalculated'))
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Tooltip pour le contenu complet */}
            {hoveredCell && (
              <div 
                className="table-tooltip"
                style={{
                  top: `${hoveredCell.position.top}px`,
                  left: `${hoveredCell.position.left}px`
                }}
              >
                {hoveredCell.content}
              </div>
            )}

            {orientations.length > itemsPerPage && (
              <div className="pagination-wrapper">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(orientations.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default UserOrientationScore;