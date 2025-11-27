import React, { useState, useEffect } from 'react';
import '../css/ScoreCalculator.css';
import { useTranslation } from 'react-i18next';

import economyImg from '../images/economique.png';
import mathImg from '../images/racine.png';
import artsImg from '../images/lettre.png';
import experimentalImg from '../images/microscope.png';
import technicalImg from '../images/engrenage.png';
import computerImg from '../images/pc.png';
import sportImg from '../images/sport.png';

const ScoreCalculator = () => {
  const { t, i18n } = useTranslation();
  const [state, setState] = useState({
    selectedBac: null,
    notes: {},
    controleNotes: {},
    session: 'principale',
    score: null,
    degrees: [],
    selectedDegree: '',
    orientations: [],
    degreeMap: {},
    inputFocus: null,
    loading: false,
    error: null,
    degreeSearchTerm: '',
    emptyFields: []
  });

  const bacData = {
    formulas: {
      'arts': { MG: 4, A: 1.5, PH: 1.5, HG: 1, F: 1, Ang: 1 },
      'math': { MG: 4, M: 2, SP: 1.5, SVT: 0.5, F: 1, Ang: 1 },
      'economy': { MG: 4, Ec: 1.5, Ge: 1.5, M: 0.5, HG: 0.5, F: 1, Ang: 1 },
      'experimental': { MG: 4, M: 1, SP: 1.5, SVT: 1.5, F: 1, Ang: 1 },
      'technical': { MG: 4, TE: 1.5, M: 1.5, SP: 1, F: 1, Ang: 1 },
      'computer': { MG: 4, M: 1.5, Algo: 1.5, SP: 0.5, STI: 0.5, F: 1, Ang: 1 },
      'sport': { MG: 4, B: 1.5, pSport: 1.5, EP: 0.5, SP: 0.5, PH: 0.5, F: 1, Ang: 1 }
    },
    subjects: {
      'arts': ['MG', 'A', 'PH', 'HG', 'F', 'Ang'],
      'math': ['MG', 'M', 'SP', 'SVT', 'F', 'Ang'],
      'economy': ['MG', 'Ec', 'Ge', 'M', 'HG', 'F', 'Ang'],
      'experimental': ['MG', 'M', 'SP', 'SVT', 'F', 'Ang'],
      'technical': ['MG', 'TE', 'M', 'SP', 'F', 'Ang'],
      'computer': ['MG', 'M', 'Algo', 'SP', 'STI', 'F', 'Ang'],
      'sport': ['MG', 'B', 'pSport', 'EP', 'SP', 'PH', 'F', 'Ang']
    },
    excludedSubjectsForControle: ['PH'],
    icons: {
      'arts': artsImg,
      'math': mathImg,
      'economy': economyImg,
      'experimental': experimentalImg,
      'technical': technicalImg,
      'computer': computerImg,
      'sport': sportImg
    },
    dbNames: {
      'arts': 'آداب',
      'math': 'رياضيات',
      'economy': 'اقتصاد وتصرف',
      'experimental': 'علوم تجريبية',
      'technical': 'العلوم التقنية',
      'computer': 'علوم الإعلامية',
      'sport': 'رياضة'
    }
  };

  const subjectLabels = {
    MG: t('subjects.MG'),
    A: t('subjects.A'),
    PH: t('subjects.PH'),
    HG: t('subjects.HG'),
    F: t('subjects.F'),
    Ang: t('subjects.Ang'),
    M: t('subjects.M'),
    SP: t('subjects.SP'),
    SVT: t('subjects.SVT'),
    Ec: t('subjects.Ec'),
    Ge: t('subjects.Ge'),
    TE: t('subjects.TE'),
    Algo: t('subjects.Algo'),
    STI: t('subjects.STI'),
    B: t('subjects.B'),
    pSport: t('subjects.pSport'),
    EP: t('subjects.EP')
  };

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleNoteChange = (subject, value, isControle = false) => {
    const numValue = parseFloat(value);
    if ((numValue >= 0 && numValue <= 20) || value === '') {
      if (isControle) {
        updateState({
          controleNotes: { ...state.controleNotes, [subject]: value },
          emptyFields: state.emptyFields.filter(field => field !== `controle_${subject}`)
        });
      } else {
        updateState({
          notes: { ...state.notes, [subject]: value },
          emptyFields: state.emptyFields.filter(field => field !== subject)
        });
      }
    }
  };

  const calculateFinalGrade = (subject) => {
    if (state.session !== 'controle' || bacData.excludedSubjectsForControle.includes(subject)) {
      return null;
    }
    const principaleNote = parseFloat(state.notes[subject]) || 0;
    const controleNote = parseFloat(state.controleNotes[subject]) || 0;
    return ((principaleNote * 2) + controleNote) / 3;
  };

  const calculateScore = () => {
    const { selectedBac, notes, controleNotes, session } = state;
    const requiredSubjects = bacData.subjects[selectedBac];
    const excludedSubjects = bacData.excludedSubjectsForControle;

    let emptyFields = [];

    if (session === 'principale') {
      emptyFields = requiredSubjects.filter(subject =>
        !notes[subject] && notes[subject] !== 0
      );
    } else {
      emptyFields = requiredSubjects.flatMap(subject => {
        const fields = [];
        if (!notes[subject] && notes[subject] !== 0) {
          fields.push(subject);
        }
        if (!excludedSubjects.includes(subject) && (!controleNotes[subject] && controleNotes[subject] !== 0)) {
          fields.push(`controle_${subject}`);
        }
        return fields;
      });
    }

    if (emptyFields.length > 0) {
      updateState({
        error: t('errors.allFieldsRequired'),
        emptyFields
      });
      return;
    }

    const coeffs = bacData.formulas[selectedBac];
    let totalPoints = 0;
    let totalCoeff = 0;

    requiredSubjects.forEach(subject => {
      let note;
      if (session === 'controle' && !excludedSubjects.includes(subject)) {
        const principaleNote = parseFloat(notes[subject]) || 0;
        const controleNote = parseFloat(controleNotes[subject]) || 0;
        note = ((principaleNote * 2) + controleNote) / 3;
      } else {
        note = parseFloat(notes[subject]) || 0;
      }

      const coeff = coeffs[subject] || 0;
      totalPoints += note * coeff;
      totalCoeff += coeff;
    });

    updateState({
      score: totalCoeff > 0 ? totalPoints : 0,
      selectedDegree: '',
      orientations: [],
      degreeSearchTerm: '',
      error: null,
      emptyFields: []
    });
  };

  const handleSessionChange = (e) => {
    updateState({
      session: e.target.value,
      notes: {},
      controleNotes: {},
      score: null,
      selectedDegree: '',
      orientations: [],
      degreeSearchTerm: '',
      emptyFields: []
    });
  };

  const handleDegreeSearch = (term) => {
    updateState({
      degreeSearchTerm: term
    });
  };

  useEffect(() => {
    if (state.score !== null) {
      updateState({ loading: true, error: null });

      fetch('http://127.0.0.1:8000/api/orientations/degrees/all/')
        .then(res => {
          if (!res.ok) throw new Error(t('errors.networkError'));
          return res.json();
        })
        .then(data => {
          const mapping = {};
          const normalizedDegrees = data.map(deg => {
            const normalized = deg.replace(/\n/g, ' ').trim();
            mapping[normalized] = {
              original: deg,
              fr: t(`db.degrees.${normalized}`, { lng: 'fr', defaultValue: normalized }),
              en: t(`db.degrees.${normalized}`, { lng: 'en', defaultValue: normalized }),
              ar: normalized
            };
            return normalized;
          });

          updateState({
            degrees: normalizedDegrees,
            degreeMap: mapping,
            loading: false
          });
        })
        .catch(err => {
          updateState({
            error: err.message,
            loading: false
          });
        });
    }
  }, [state.score, t]);

  useEffect(() => {
    if (state.selectedDegree && state.degreeMap[state.selectedDegree]) {
      updateState({ loading: true, error: null });
      const originalDegree = state.degreeMap[state.selectedDegree].original;
      const arabicBacName = bacData.dbNames[state.selectedBac];

      fetch(`http://127.0.0.1:8000/api/orientations/degree/${encodeURIComponent(originalDegree)}/`)
        .then(res => {
          if (!res.ok) throw new Error(t('errors.networkError'));
          return res.json();
        })
        .then(data => {
          updateState({
            orientations: data.filter(o => o.bac_type === arabicBacName),
            loading: false
          });
        })
        .catch(err => {
          updateState({
            error: err.message,
            loading: false
          });
        });
    }
  }, [state.selectedDegree, state.selectedBac, t]);

  const BacSelection = () => (
    <div className="bac-selector-container">
      {Object.keys(bacData.formulas).map(bacKey => (
        <div
          key={bacKey}
          className="bac-circle"
          onClick={() => updateState({ selectedBac: bacKey })}
          title={t(`bac.${bacKey}`)}
        >
          <div className="bac-circle-icon">
            <img src={bacData.icons[bacKey]} alt={t(`bac.${bacKey}`)} className="bac-circle-img" />
          </div>
          <span className="bac-circle-text">{t(`bac.${bacKey}`)}</span>
        </div>
      ))}
    </div>
  );

  if (state.selectedBac === null) {
    return <BacSelection />;
  }

  const getDisplayName = (degreeKey) => {
    const degreeData = state.degreeMap[degreeKey];
    if (!degreeData) return degreeKey;

    switch (i18n.language) {
      case 'fr': return degreeData.fr || degreeKey;
      case 'en': return degreeData.en || degreeKey;
      default: return degreeData.ar || degreeKey;
    }
  };

  return (
    <div className="score-calculator-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="sc-header">
        <h1>{t('calculator.title')}</h1>
      </div>

      {state.error && (
        <div className="error-alert">
          {state.error}
          <button onClick={() => updateState({ error: null })}>
            {t('buttons.close')}
          </button>
        </div>
      )}

      <div className="sc-main-container">
        <div className="sc-form-section-wrapper">
          <div className="sc-form-section">
            <div className="sc-bac-selector">
              <label>
                {t('calculator.bacType')}:
                <select
                  value={state.selectedBac}
                  onChange={(e) => updateState({
                    selectedBac: e.target.value,
                    notes: {},
                    controleNotes: {},
                    session: 'principale',
                    score: null,
                    selectedDegree: '',
                    orientations: [],
                    degreeSearchTerm: '',
                    emptyFields: []
                  })}
                >
                  {Object.keys(bacData.formulas).map(bacKey => (
                    <option key={bacKey} value={bacKey}>
                      {t(`bac.${bacKey}`)}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="change-bac-btn"
                onClick={() => updateState({ selectedBac: null })}
              >
                {t('buttons.changeBac')}
              </button>
            </div>

            <div className="sc-session-selector">
              <label>
                {t('calculator.session')}:
                <select
                  value={state.session}
                  onChange={handleSessionChange}
                >
                  <option value="principale">{t('calculator.mainSession')}</option>
                  <option value="controle">{t('calculator.controlSession')}</option>
                </select>
              </label>
            </div>

            <div className="sc-notes-section">
              <h3>
                {state.session === 'principale'
                  ? t('calculator.mainSession')
                  : t('calculator.controlSession')}
              </h3>
              <p className="required-note">
                <span className="required-field">*</span> {t('calculator.allFieldsRequired')}
              </p>
              <div className="sc-notes-grid">
                {bacData.subjects[state.selectedBac]?.map(subject => (
                  <div key={subject}>
                    {state.session === 'controle' && !bacData.excludedSubjectsForControle.includes(subject) ? (
                      <div className="controle-subject-container">
                        <div className="sc-note-input">
                          <label>
                            <span>
                              {subjectLabels[subject] || subject} ({t('calculator.mainGrade')})
                              <span className="required-field">*</span>
                            </span>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.01"
                              value={state.notes[subject] || ''}
                              onChange={(e) => handleNoteChange(subject, e.target.value)}
                              className={state.emptyFields.includes(subject) ? 'input-error' : ''}
                              required
                            />
                            {state.emptyFields.includes(subject) && (
                              <span className="error-message">{t('errors.fieldRequired')}</span>
                            )}
                          </label>
                        </div>
                        <div className="sc-note-input">
                          <label>
                            <span>
                              {subjectLabels[subject] || subject} ({t('calculator.controlGrade')})
                              <span className="required-field">*</span>
                            </span>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.01"
                              value={state.controleNotes[subject] || ''}
                              onChange={(e) => handleNoteChange(subject, e.target.value, true)}
                              className={state.emptyFields.includes(`controle_${subject}`) ? 'input-error' : ''}
                              required
                            />
                            {state.emptyFields.includes(`controle_${subject}`) && (
                              <span className="error-message">{t('errors.fieldRequired')}</span>
                            )}
                          </label>
                        </div>
                        <div className="sc-note-result">
                          <label>
                            <span>{subjectLabels[subject] || subject} ({t('calculator.finalGrade')})</span>
                            <div className="final-grade-display">
                              {calculateFinalGrade(subject)?.toFixed(2) || '-'}
                            </div>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="sc-note-input">
                        <label>
                          <span>
                            {subjectLabels[subject] || subject}
                            <span className="required-field">*</span>
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.01"
                            value={state.notes[subject] || ''}
                            onChange={(e) => handleNoteChange(subject, e.target.value)}
                            onFocus={() => updateState({ inputFocus: subject })}
                            onBlur={() => updateState({ inputFocus: null })}
                            className={
                              `${state.inputFocus === subject ? 'sc-input-focused' : ''} 
                              ${state.emptyFields.includes(subject) ? 'input-error' : ''}`
                            }
                            required
                          />
                          {state.emptyFields.includes(subject) && (
                            <span className="error-message">{t('errors.fieldRequired')}</span>
                          )}
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="sc-calculate-btn"
              onClick={calculateScore}
              disabled={state.loading}
            >
              {state.loading ? t('buttons.calculating') : t('calculator.calculateBtn')}
            </button>

            {state.score !== null && (
              <div className="sc-score-display">
                <h3>
                  {t('calculator.scoreFG')}: <span>{state.score.toFixed(2)}</span>
                </h3>
                <h3>
                  {t('calculator.scoreFG7')}: <span>{(state.score * 1.07).toFixed(2)}</span>
                </h3>
                <p className="login-message">
                  {t('calculator.loginMessage')}{' '}
                  <a href="/auth" className="login-link">
                    {t('calculator.loginLink')}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="sc-results-section-wrapper">
          <div className="sc-results-section">
            {state.loading && <div className="loading-spinner">{t('loading')}</div>}

            {state.degrees?.length > 0 && (
              <>
                <div className="degree-search-container">
                  <input
                    type="text"
                    placeholder={t('degreeSearchPlaceholder')}
                    value={state.degreeSearchTerm}
                    onChange={(e) => handleDegreeSearch(e.target.value)}
                    className="degree-search-input"
                  />
                </div>
                <div className="sc-degree-selector">
                  <label>
                    {t('calculator.selectDegree')}:
                    <select
                      value={state.selectedDegree}
                      onChange={(e) => updateState({ selectedDegree: e.target.value })}
                      disabled={state.loading}
                    >
                      <option value="">-- {t('calculator.choose')} --</option>
                      {state.degrees
                        .filter(deg => {
                          if (!state.degreeSearchTerm) return true;
                          const searchTerm = state.degreeSearchTerm.toLowerCase();
                          const degreeData = state.degreeMap[deg];

                          return (
                            (degreeData.ar && degreeData.ar.toLowerCase().includes(searchTerm)) ||
                            (degreeData.fr && degreeData.fr.toLowerCase().includes(searchTerm)) ||
                            (degreeData.en && degreeData.en.toLowerCase().includes(searchTerm))
                          );
                        })
                        .map((deg, i) => (
                          <option key={i} value={deg}>
                            {getDisplayName(deg)}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
              </>
            )}

            {!state.loading && state.orientations.length === 0 && state.selectedDegree && (
              <div className="sc-no-results">{t('calculator.noResults')}</div>
            )}

            {!state.loading && state.orientations.length > 0 && (
              <div className="sc-orientations-table-container">
                <table className="sc-orientations-table">
                  <thead>
                    <tr>
                      <th>{t('table.category')}</th>
                      <th>{t('table.institution')}</th>
                      <th>{t('table.specialties')}</th>
                      <th>{t('table.code')}</th>
                      <th>{t('table.calculation')}</th>
                      <th>{t('table.lastYearScore')}</th>
                      <th>{t('table.gender')}</th>
                      <th>{t('table.mainSubjects')}</th>
                      <th>{t('table.test')}</th>
                      <th>{t('table.geographic_preference')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.orientations.map(orientation => (
                      <tr key={orientation.id}>
                        <td>{t(`db.categories.${orientation.category}`, { defaultValue: orientation.category })}</td>
                        <td>{t(`db.institutions.${orientation.institution}`, { defaultValue: orientation.institution })}</td>
                        <td>{t(`db.specialties.${orientation.specialties}`, { defaultValue: orientation.specialties })}</td>
                        <td>{orientation.code}</td>
                        <td>{orientation.calculation_format}</td>
                        <td>{orientation.last_year_score}</td>
                        <td>{t(`db.genders.${orientation.gender}`, { defaultValue: orientation.gender })}</td>
                        <td>
                          {orientation.matiere_principale && orientation.matiere_principale !== "-"
                            ? t(`db.mainSubjects.${orientation.matiere_principale}`, {
                              defaultValue: orientation.matiere_principale
                            })
                            : "-"}
                        </td>
                        <td>{t(`db.answers.${orientation.test}`, { defaultValue: orientation.test })}</td>
                        <td>{t(`db.geographic_preference.${orientation.geographic_preference}`, {
                          defaultValue: orientation.geographic_preference
                        })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCalculator;