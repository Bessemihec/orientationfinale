import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/profile.css';

function ProfilePage() {
  const { t, i18n } = useTranslation();
  const [etudiant, setEtudiant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [accessCheckComplete, setAccessCheckComplete] = useState(false);
  const [formData, setFormData] = useState({
    session: '',
    mg: '',
    mg_principale: '',
    mg_controle: '',
    fg: '',
    option: '',
    ville: '',
    bac_type: '',
    grades: {},
    principaleGrades: {},
    controleGrades: {}
  });

  // ✅ ÉTAT POUR SUIVRE LES MODIFICATIONS
  const [hasModifiedVille, setHasModifiedVille] = useState(false);
  const [hasModifiedBacType, setHasModifiedBacType] = useState(false);

  const pageDirection = i18n.language === 'ar' ? 'rtl' : 'ltr';

  const baseSubjects = {
    "آداب": ["M", "A", "F", "Ang", "PH", "EP", "HG", "Info"],
    "رياضيات": ["M", "A", "F", "Ang", "PH", "EP", "SVT", "SP", "Info"],
    "اقتصاد وتصرف": ["M", "A", "F", "Ang", "PH", "EP", "Ec", "Ge", "HG", "Info"],
    "علوم تجريبية": ["M", "A", "F", "Ang", "PH", "EP", "SVT", "SP", "Info"],
    "العلوم التقنية": ["M", "A", "F", "Ang", "PH", "EP", "SP", "Info", "TE"],
    "علوم الإعلامية": ["M", "A", "F", "Ang", "PH", "EP", "STI", "Algo", "SP"],
    "رياضة": ["M", "A", "F", "Ang", "PH", "EP", "Sp_sport", "HG", "Info", "SB"],
  };

  const optionSubjects = ["IT", "All", "ESP"];
  const excludedSubjectsForControle = ["PH", "EP", "IT", "All", "ESP"];

  // ✅ VILLES ET TYPES DE BAC
  const villes = [
    'تونس الكبرى', 'بنزرت', 'نابل', 'زغوان', 'باجة', 'جندوبة', 
    'الكاف', 'سليانة', 'سوسة', 'المنستير', 'المهدية', 'صفاقس', 
    'القيروان', 'القصرين', 'سيدي بوزيد', 'قفصة', 'توزر', 'قبلي', 
    'قابس', 'مدنين', 'تطاوين'
  ];

  const originalBacTypes = [
    'آداب', 'رياضيات', 'اقتصاد وتصرف', 'علوم تجريبية', 
    'العلوم التقنية', 'علوم الإعلامية', 'رياضة',
  ];

  const villeKeys = [
    'tunis', 'bizerte', 'nabeul', 'zaghouan', 'beja', 'jendouba', 
    'kef', 'siliana', 'sousse', 'monastir', 'mahdia', 'sfax', 
    'kairouan', 'kasserine', 'sidibouzid', 'gafsa', 'tozeur', 
    'kebili', 'gabes', 'medenine', 'tatouine'
  ];

  // ✅ FONCTION DE VALIDATION DES NOTES
  const validateGrade = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    
    // Limiter entre 0 et 20
    if (numValue < 0) return 0;
    if (numValue > 20) return 20;
    
    // Arrondir au 0.5 le plus proche
    return Math.round(numValue * 2) / 2;
  };

  useEffect(() => {
    const checkProfileCompletion = (etudiantData) => {
      const requiredFields = ['mg', 'session', 'bac_type'];
      return requiredFields.every(field => etudiantData[field] && etudiantData[field] !== '0');
    };

    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setShowPage(false);
        setAccessCheckComplete(true);
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          if (data.etudiant && (data.etudiant.username === "admin" || !data.etudiant.username)) {
            console.log('Admin user or not connected, hiding profile page');
            setShowPage(false);
          } else {
            setShowPage(true);
            setEtudiant(data.etudiant);
            updateFormData(data.etudiant);
            checkProfileCompletion(data.etudiant);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error(t('profile.loadError'));
        setShowPage(false);
      } finally {
        setLoading(false);
        setAccessCheckComplete(true);
      }
    };

    fetchProfile();
  }, [t]);

  const updateFormData = (etudiantData) => {
    let grades = {};
    let principaleGrades = {};
    let controleGrades = {};

    const subjects = [
      ...(baseSubjects[etudiantData.bac_type] || []),
      ...optionSubjects.filter(opt => etudiantData[opt] !== undefined)
    ];

    if (etudiantData.session === "controle") {
      subjects.forEach(sub => {
        if (excludedSubjectsForControle.includes(sub)) {
          grades[sub] = validateGrade(etudiantData[sub]) ?? 0;
        } else {
          principaleGrades[sub] = validateGrade(etudiantData[`${sub}_principale`]) ?? 0;
          controleGrades[sub] = validateGrade(etudiantData[`${sub}_controle`]) ?? 0;
          grades[sub] = validateGrade(etudiantData[sub]) ?? 0;
        }
      });
    } else {
      subjects.forEach(sub => {
        grades[sub] = validateGrade(etudiantData[sub]) ?? 0;
      });
    }

    setFormData({
      session: etudiantData.session || 'principale',
      mg: validateGrade(etudiantData.mg) ?? '',
      mg_principale: validateGrade(etudiantData.mg_principale) ?? '',
      mg_controle: validateGrade(etudiantData.mg_controle) ?? '',
      fg: etudiantData.fg ?? '',
      option: etudiantData.option || '',
      ville: etudiantData.ville || '',
      bac_type: etudiantData.bac_type || '',
      grades,
      principaleGrades,
      controleGrades
    });

    // ✅ VÉRIFIER SI DÉJÀ MODIFIÉ
    setHasModifiedVille(!!etudiantData.ville);
    setHasModifiedBacType(!!etudiantData.bac_type);
  };

  useEffect(() => {
    if (formData.session === 'controle') {
      const mgp = parseFloat(formData.mg_principale) || 0;
      const mgc = parseFloat(formData.mg_controle) || 0;
      const mgCalc = ((mgp * 2) + mgc) / 3;
      const mgRounded = Number(mgCalc.toFixed(2));
      if (mgRounded !== parseFloat(formData.mg)) {
        setFormData(prev => ({ ...prev, mg: mgRounded }));
      }
    }
  }, [formData.mg_principale, formData.mg_controle, formData.session]);

  // ✅ FONCTIONS DE TRADUCTION CORRECTES
  const getCityKey = (ville) => {
    const index = villes.indexOf(ville);
    return index !== -1 ? villeKeys[index] : ville;
  };

  const translateVille = (ville) => {
    if (!ville) return t('profile.notSpecified');
    const key = getCityKey(ville);
    return t(`cities.${key}`, { defaultValue: ville });
  };

  const translateBacType = (bacType) => {
    if (!bacType) return t('profile.notSpecified');
    // ✅ UTILISATION DIRECTE DE LA VALEUR COMME CLÉ
    return t(`bacType.${bacType}`, { defaultValue: bacType });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // ✅ VALIDATION DES NOTES
    if (name.startsWith('grade_') || name.startsWith('principal_') || name.startsWith('controle_') || 
        name === 'mg' || name === 'mg_principale' || name === 'mg_controle') {
      
      const validatedValue = validateGrade(value);
      
      if (name.startsWith('grade_')) {
        const subjectCode = name.replace('grade_', '');
        setFormData(prev => ({
          ...prev,
          grades: { ...prev.grades, [subjectCode]: validatedValue }
        }));
      } else if (name.startsWith('principal_')) {
        const subjectCode = name.replace('principal_', '');
        setFormData(prev => ({
          ...prev,
          principaleGrades: { ...prev.principaleGrades, [subjectCode]: validatedValue }
        }));
      } else if (name.startsWith('controle_')) {
        const subjectCode = name.replace('controle_', '');
        setFormData(prev => ({
          ...prev,
          controleGrades: { ...prev.controleGrades, [subjectCode]: validatedValue }
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: validatedValue }));
      }
    } else {
      // ✅ GESTION DES CHAMPS VILLE ET BAC_TYPE
      if (name === 'ville' && !hasModifiedVille) {
        setFormData(prev => ({ ...prev, [name]: value }));
      } else if (name === 'bac_type' && !hasModifiedBacType) {
        setFormData(prev => ({ ...prev, [name]: value }));
      } else if (name !== 'ville' && name !== 'bac_type') {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleOptionChange = (e) => {
    const option = e.target.value;
    if (!option) return;

    setFormData(prev => ({
      ...prev,
      option,
      grades: { ...prev.grades, [option]: prev.grades[option] || 0 },
      principaleGrades: { ...prev.principaleGrades, [option]: prev.principaleGrades[option] || 0 },
      controleGrades: { ...prev.controleGrades, [option]: prev.controleGrades[option] || 0 }
    }));
  };

  const removeOption = (opt) => {
    const { [opt]: removed, ...remainingGrades } = formData.grades;
    const { [opt]: removedP, ...remainingPrincipale } = formData.principaleGrades;
    const { [opt]: removedC, ...remainingControle } = formData.controleGrades;

    setFormData(prev => ({
      ...prev,
      option: prev.option === opt ? '' : prev.option,
      grades: remainingGrades,
      principaleGrades: remainingPrincipale,
      controleGrades: remainingControle,
    }));
  };

  const calculateFinalGrades = () => {
    const newGrades = { ...formData.grades };

    Object.keys(formData.principaleGrades).forEach(sub => {
      if (excludedSubjectsForControle.includes(sub)) {
        newGrades[sub] = validateGrade(formData.principaleGrades[sub]) ?? 0;
      } else {
        const p = parseFloat(formData.principaleGrades[sub]) || 0;
        const c = parseFloat(formData.controleGrades[sub]) || 0;
        const calc = ((p * 2) + c) / 3;
        newGrades[sub] = validateGrade(calc);
      }
    });

    setFormData(prev => ({
      ...prev,
      grades: newGrades,
    }));

    toast.success(t('profile.calculateSuccess'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      let payload = {
        session: formData.session,
        mg: parseFloat(formData.mg) || 0,
        mg_principale: parseFloat(formData.mg_principale) || 0,
        mg_controle: parseFloat(formData.mg_controle) || 0,
        fg: parseFloat(formData.fg) || 0,
        option: formData.option || '',
      };

      // ✅ INCLURE VILLE ET BAC_TYPE SEULEMENT SI MODIFIÉS
      if (!hasModifiedVille && formData.ville) {
        payload.ville = formData.ville;
      }
      if (!hasModifiedBacType && formData.bac_type) {
        payload.bac_type = formData.bac_type;
      }

      if (formData.session === "controle") {
        Object.entries(formData.principaleGrades).forEach(([key, val]) => {
          payload[`${key}_principale`] = validateGrade(val) ?? null;
        });
        Object.entries(formData.controleGrades).forEach(([key, val]) => {
          payload[`${key}_controle`] = validateGrade(val) ?? null;
        });
        Object.entries(formData.grades).forEach(([key, val]) => {
          payload[key] = validateGrade(val) ?? null;
        });
      } else {
        Object.entries(formData.grades).forEach(([key, val]) => {
          payload[key] = validateGrade(val) ?? null;
        });
      }

      const response = await fetch(`http://127.0.0.1:8000/api/etudiants/${etudiant.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setEtudiant(updatedData.etudiant);
        setEditMode(false);
        
        // ✅ METTRE À JOUR LES ÉTATS DE MODIFICATION
        if (formData.ville && !hasModifiedVille) {
          setHasModifiedVille(true);
        }
        if (formData.bac_type && !hasModifiedBacType) {
          setHasModifiedBacType(true);
        }
        
        toast.success(t('profile.updateSuccess'));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || t('profile.updateError'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || t('profile.networkError'));
    }
  };

  const getNoteClass = (note) => {
    const num = parseFloat(note);
    if (num >= 15) return 'high';
    if (num >= 10) return 'medium';
    return 'low';
  };

  const formatLabel = (code) => {
    const labels = {
      username: t('topics.username'),
      email: t('topics.email'),
      bac_type: t('topics.bacType'),
      ville: t('topics.city'),
      mg: t('topics.generalAverage'),
      fg: t('topics.fgScore'),
      session: t('topics.session'),
      A: t('topics.arabic'),
      PH: t('topics.philosophy'),
      HG: t('topics.historyGeo'),
      F: t('topics.french'),
      Ang: t('topics.english'),
      M: t('topics.math'),
      SP: t('topics.physics'),
      SVT: t('topics.svt'),
      Ec: t('topics.economy'),
      Ge: t('topics.management'),
      TE: t('topics.technique'),
      Algo: t('topics.algorithmics'),
      STI: t('topics.sti'),
      SB: t('topics.sb'),
      Sp_sport: t('topics.sportSpeciality'),
      EP: t('topics.pe'),
      Info: t('topics.computerScience'),
      IT: t('topics.italian'),
      All: t('topics.german'),
      ESP: t('topics.spanish')
    };
    return labels[code] || code;
  };

  // Afficher le loader pendant la vérification d'accès
  if (!accessCheckComplete) {
    return (
      <div className="profile-container" dir={pageDirection}>
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
      <div className="profile-container" dir={pageDirection}>
        <div className="access-denied">
          <h2>{t('orientation.accessDenied')}</h2>
          <p>{t('orientation.adminOrNotConnected')}</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="profile-container" dir={pageDirection}>{t('profile.loading')}</div>;
  if (!etudiant) return <div className="profile-container" dir={pageDirection}>{t('profile.notLoggedIn')}</div>;

  const selectedSubjects = etudiant.bac_type ? baseSubjects[etudiant.bac_type] || [] : [];

  return (
    <div className="profile-container" dir={pageDirection}>
      <div className="profile-header">
        <div className="profile-avatar">👤</div>
        <h2>{etudiant.username}</h2>
        <p>{t('profile.studentOf')} {translateBacType(etudiant.bac_type)}</p>
        
      </div>

      <div className="profile-body">
        <div className="profile-sidebar">
          <div className="section">
            <h3 className="section-title-profile">{t('profile.information')}</h3>

            {editMode ? (
              <div className="info-edit-form">
                <div className="info-item">
                  <span className="info-label">{t('profile.email')}:</span>
                  <span className="info-value">{etudiant.email}</span>
                </div>

                {/* ✅ CHAMP VILLE - MODIFIABLE UNE SEULE FOIS */}
                <div className="info-item">
                  <span className="info-label">{t('profile.city')}:</span>
                  {hasModifiedVille ? (
                    <span className="info-value" style={{color: '#666', fontStyle: 'italic'}}>
                      {translateVille(etudiant.ville)}
                      <br />
                      <small>({t('profile.cannotModify')})</small>
                    </span>
                  ) : (
                    <select
                      name="ville"
                      value={formData.ville || ''}
                      onChange={handleInputChange}
                      className="info-edit-input"
                    >
                      <option value="">-- {t('profile.selectCity')} --</option>
                      {villes.map((ville, index) => (
                        <option key={ville} value={ville}>
                          {translateVille(ville)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* ✅ CHAMP TYPE DE BAC - MODIFIABLE UNE SEULE FOIS */}
                <div className="info-item">
                  <span className="info-label">{t('profile.bacType')}:</span>
                  {hasModifiedBacType ? (
                    <span className="info-value" style={{color: '#666', fontStyle: 'italic'}}>
                      {translateBacType(etudiant.bac_type)}
                      <br />
                      <small>({t('profile.cannotModify')})</small>
                    </span>
                  ) : (
                    <select
                      name="bac_type"
                      value={formData.bac_type || ''}
                      onChange={handleInputChange}
                      className="info-edit-input"
                    >
                      <option value="">-- {t('profile.selectBacType')} --</option>
                      {originalBacTypes.map((type) => (
                        <option key={type} value={type}>
                          {translateBacType(type)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">{t('profile.session')}:</span>
                  <select
                    name="session"
                    value={formData.session}
                    onChange={handleInputChange}
                    className="info-edit-input"
                  >
                    <option value="principale">{t('profile.mainSession')}</option>
                    <option value="controle">{t('profile.controlSession')}</option>
                  </select>
                </div>

                {formData.session === 'controle' && (
                  <>
                    <div className="info-item">
                      <span className="info-label">{t('profile.mainAverage')}:</span>
                      <input
                        type="number"
                        name="mg_principale"
                        step="0.5"
                        min="0"
                        max="20"
                        value={formData.mg_principale}
                        onChange={handleInputChange}
                        className="info-edit-input"
                      />
                    </div>

                    <div className="info-item">
                      <span className="info-label">{t('profile.controlAverage')}:</span>
                      <input
                        type="number"
                        name="mg_controle"
                        step="0.5"
                        min="0"
                        max="20"
                        value={formData.mg_controle}
                        onChange={handleInputChange}
                        className="info-edit-input"
                      />
                    </div>
                  </>
                )}

                <div className="info-item">
                  <span className="info-label">{t('profile.generalAverage')}:</span>
                  <input
                    type="number"
                    name="mg"
                    step="0.01"
                    min="0"
                    max="20"
                    value={formData.mg}
                    readOnly={formData.session === 'controle'}
                    onChange={handleInputChange}
                    className="info-edit-input"
                  />
                </div>

                <div className="info-item">
                  <span className="info-label">{t('profile.fgScore')}:</span>
                   {etudiant.fg !== null && etudiant.fg !== undefined 
        ? parseFloat(etudiant.fg).toFixed(3) 
        : '0.000'}
                </div>
              </div>
            ) : (
              <>
                <div className="info-item">
                  <span className="info-label">{t('profile.email')}:</span>
                  <span className="info-value">{etudiant.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('profile.city')}:</span>
                  <span className="info-value">
                    {translateVille(etudiant.ville)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('profile.bacType')}:</span>
                  <span className="info-value">
                    {translateBacType(etudiant.bac_type)}
                  </span>
                </div>
               
                <div className="info-item">
                  <span className="info-label">{t('profile.session')}:</span>
                  <span className="info-value">{etudiant.session === 'controle' ? t('profile.controlSession') : t('profile.mainSession')}</span>
                </div>
                {etudiant.session === 'controle' && (
                  <>
                    <div className="info-item">
                      <span className="info-label">{t('profile.mainAverage')}:</span>
                      <span className="info-value">{etudiant.mg_principale}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">{t('profile.controlAverage')}:</span>
                      <span className="info-value">{etudiant.mg_controle}</span>
                    </div>
                  </>
                )}
                <div className="info-item">
                  <span className="info-label">{t('profile.generalAverage')}:</span>
                  <span className="info-value">{etudiant.mg}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('profile.fgScore')}:</span>
                 <span className="info-value">
      {etudiant.fg !== null && etudiant.fg !== undefined 
        ? parseFloat(etudiant.fg).toFixed(3) 
        : '0.000'} </span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setEditMode(!editMode)}
            className={`btn ${editMode ? 'btn-danger' : 'btn-primary'}`}
          >
            {editMode ? t('profile.cancel') : t('profile.editGrades')}
          </button>
        </div>

        <div className="profile-main">
          <div className="section">
            <h3 className="section-title-profile">{t('profile.myGrades')}</h3>

            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="notes-grid">
                  {formData.session === "controle" ? (
                    <>
                      {selectedSubjects.map(code => {
                        if (excludedSubjectsForControle.includes(code)) {
                          return (
                            <div key={code} className={`note-card ${getNoteClass(formData.grades[code])}`}>
                              <div className="note-subject">{formatLabel(code)}</div>
                              <input
                                type="number"
                                className="note-value"
                                name={`grade_${code}`}
                                step="0.5"
                                min="0"
                                max="20"
                                value={formData.grades[code] || ''}
                                onChange={handleInputChange}
                              />
                            </div>
                          );
                        }
                        return (
                          <div key={code} className="note-card controle-subject-card">
                            <div className="note-subject">{formatLabel(code)}</div>
                            <div className="grade-input-container">
                              <label>{t('profile.mainGrade')}</label>
                              <input
                                type="number"
                                className="note-value"
                                name={`principal_${code}`}
                                step="0.5"
                                min="0"
                                max="20"
                                value={formData.principaleGrades[code] || ''}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="grade-input-container">
                              <label>{t('profile.controlGrade')}</label>
                              <input
                                type="number"
                                className="note-value"
                                name={`controle_${code}`}
                                step="0.5"
                                min="0"
                                max="20"
                                value={formData.controleGrades[code] || ''}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="final-grade-display">
                              {t('profile.finalGrade')}: {formData.grades[code] ?? ''}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    selectedSubjects.map(code => (
                      <div key={code} className={`note-card ${getNoteClass(formData.grades[code])}`}>
                        <div className="note-subject">{formatLabel(code)}</div>
                        <input
                          type="number"
                          className="note-value"
                          name={`grade_${code}`}
                          step="0.5"
                          min="0"
                          max="20"
                          value={formData.grades[code] || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    ))
                  )}

                  {optionSubjects.map(opt => (
                    formData.grades[opt] !== undefined && (
                      <div key={opt} className={`note-card ${getNoteClass(formData.grades[opt])}`}>
                        <div className="note-subject">
                          {formatLabel(opt)} <span className="note-option">({t('profile.option')})</span>
                        </div>
                        {formData.session === "controle" && !excludedSubjectsForControle.includes(opt) ? (
                          <>
                            <div className="grade-input-container">
                              <label>{t('profile.mainGrade')}</label>
                              <input
                                type="number"
                                className="note-value"
                                name={`principal_${opt}`}
                                step="0.5"
                                min="0"
                                max="20"
                                value={formData.principaleGrades[opt] || ''}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="grade-input-container">
                              <label>{t('profile.controlGrade')}</label>
                              <input
                                type="number"
                                className="note-value"
                                name={`controle_${opt}`}
                                step="0.5"
                                min="0"
                                max="20"
                                value={formData.controleGrades[opt] || ''}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="final-grade-display">
                              {t('profile.finalGrade')}: {formData.grades[opt] ?? ''}
                            </div>
                          </>
                        ) : (
                          <input
                            type="number"
                            className="note-value"
                            name={`grade_${opt}`}
                            step="0.5"
                            min="0"
                            max="20"
                            value={formData.grades[opt] || ''}
                            onChange={handleInputChange}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeOption(opt)}
                          className="remove-option-btn"
                        >
                          {t('profile.removeOption')}
                        </button>
                      </div>
                    )
                  ))}

                  <div className="options-container">
                    <select
                      className="option-select"
                      value=""
                      onChange={handleOptionChange}
                    >
                      <option value="">-- {t('profile.addOption')} --</option>
                      {optionSubjects
                        .filter(opt => !Object.keys(formData.grades).includes(opt))
                        .map(opt => (
                          <option key={opt} value={opt}>
                            {formatLabel(opt)}
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  {formData.session === 'controle' && (
                    <button
                      type="button"
                      onClick={calculateFinalGrades}
                      className="btn btn-warning calculate-btn"
                    >
                      {t('profile.calculateGrades')}
                    </button>
                  )}

                  <button
                    type="submit"
                    className="btn btn-success save-btn"
                  >
                    {t('profile.saveChanges')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="notes-grid">
                {selectedSubjects.map(code => (
                  etudiant[code] !== undefined && (
                    <div key={code} className={`note-card ${getNoteClass(etudiant[code])}`}>
                      <div className="note-subject">{formatLabel(code)}</div>
                      <div className="note-value">{etudiant[code]}</div>
                    </div>
                  )
                ))}

                {optionSubjects.map(opt => (
                  etudiant[opt] !== undefined && (
                    <div key={opt} className={`note-card ${getNoteClass(etudiant[opt])}`}>
                      <div className="note-subject">
                        {formatLabel(opt)} <span className="note-option">({t('profile.option')})</span>
                      </div>
                      <div className="note-value">{etudiant[opt]}</div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={i18n.language === 'ar'} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default ProfilePage;