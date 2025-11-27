import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import '../css/OrientationDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function OrientationDashboard() {
  const { t, i18n } = useTranslation();
  const [orientations, setOrientations] = useState([]);
  const [filteredOrientations, setFilteredOrientations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bac_type: 'all',
    institution: 'all',
    category: 'all',
    specialties: 'all',
    degree: 'all',
    region: 'all',
    test: 'all',
    gender: 'all',
    geographic_preference: 'all'
  });
  const [showPage, setShowPage] = useState(false);
  const [accessCheckComplete, setAccessCheckComplete] = useState(false);

  const pageDirection = i18n.language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, orientations]);

  const checkUserAndFetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setShowPage(false);
        setAccessCheckComplete(true);
        setLoading(false);
        return;
      }

      // Check user profile first
      const profileResponse = await fetch('http://127.0.0.1:8000/api/profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.etudiant) {
          const { username } = profileData.etudiant;
          
          // Check if user is admin or not connected - don't show page
          if (username === "admin" || !username) {
            console.log('Admin user or not connected, hiding dashboard');
            setShowPage(false);
            setAccessCheckComplete(true);
            setLoading(false);
            return;
          }
          
          setShowPage(true);
          await fetchOrientations();
        }
      } else {
        setShowPage(false);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setShowPage(false);
    } finally {
      setLoading(false);
      setAccessCheckComplete(true);
    }
  };

  const fetchOrientations = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orientations/');
      if (response.ok) {
        const data = await response.json();
        setOrientations(data);
        setFilteredOrientations(data);
      }
    } catch (error) {
      console.error('Error fetching orientations:', error);
    }
  };

  const applyFilters = () => {
    let filtered = orientations;

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== 'all') {
        filtered = filtered.filter(orientation => orientation[key] === value);
      }
    });

    setFilteredOrientations(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      bac_type: 'all',
      institution: 'all',
      category: 'all',
      specialties: 'all',
      degree: 'all',
      region: 'all',
      test: 'all',
      gender: 'all',
      geographic_preference: 'all'
    });
  };

  // Use the correct translation approach based on your translation files
  const translateField = (field, value) => {
    if (!value || value === '-' || value === 'all') return value === 'all' ? t('orientationDashboard.all') : value;

    // Map field names to translation keys based on your actual translation structure
    let translationKey;
    switch (field) {
      case 'category':
        translationKey = `db.categories.${value}`;
        break;
      case 'institution':
        translationKey = `db.institutions.${value}`;
        break;
      case 'specialties':
        translationKey = `db.specialties.${value}`;
        break;
      case 'gender':
        translationKey = `db.genders.${value}`;
        break;
      case 'region':
        translationKey = `villes.${value}`;
        break;
      case 'test':
        translationKey = `db.answers.${value}`;
        break;
      case 'geographic_preference':
        translationKey = `db.geographic_preference.${value}`;
        break;
      case 'bac_type':
        translationKey = `bac.${value}`;
        break;
      case 'degree':
        translationKey = `db.degrees.${value}`;
        break;
      default:
        translationKey = `${field}.${value}`;
    }

    const translation = t(translationKey, { defaultValue: value });
    return translation;
  };

  // Get unique options for filters with translation
  const getUniqueOptions = (field) => {
    const uniqueValues = ['all', ...new Set(orientations.map(item => item[field]).filter(Boolean))];
    return uniqueValues.map(value => ({
      value,
      label: value === 'all' ? t('orientationDashboard.all') : translateField(field, value)
    }));
  };

  // Data processing functions with proper translation
  const getInstitutionDegreeCount = () => {
    const institutionDegrees = {};
    const institutionExamples = {};
    
    filteredOrientations.forEach(item => {
      if (item.institution && item.degree) {
        const institutionKey = item.institution;
        if (!institutionDegrees[institutionKey]) {
          institutionDegrees[institutionKey] = new Set();
          institutionExamples[institutionKey] = new Set();
        }
        institutionDegrees[institutionKey].add(item.degree);
        
        // Ajouter jusqu'à 3 exemples de diplômes
        if (institutionExamples[institutionKey].size < 3) {
          institutionExamples[institutionKey].add(translateField('degree', item.degree));
        }
      }
    });

    // Translate institution names for display
    const translatedResults = {};
    const examplesResults = {};
    Object.keys(institutionDegrees).forEach(institution => {
      const translatedInstitution = translateField('institution', institution);
      translatedResults[translatedInstitution] = institutionDegrees[institution].size;
      examplesResults[translatedInstitution] = Array.from(institutionExamples[institution]).join(', ');
    });

    return { count: translatedResults, examples: examplesResults };
  };

  const getRegionInstitutionCount = () => {
    const regionInstitutions = {};
    const regionExamples = {};
    
    filteredOrientations.forEach(item => {
      if (item.region && item.institution) {
        const regionKey = item.region;
        if (!regionInstitutions[regionKey]) {
          regionInstitutions[regionKey] = new Set();
          regionExamples[regionKey] = new Set();
        }
        regionInstitutions[regionKey].add(item.institution);
        
        // Ajouter jusqu'à 3 exemples d'institutions
        if (regionExamples[regionKey].size < 3) {
          regionExamples[regionKey].add(translateField('institution', item.institution));
        }
      }
    });

    // Translate region names for display
    const translatedResults = {};
    const examplesResults = {};
    Object.keys(regionInstitutions).forEach(region => {
      const translatedRegion = translateField('region', region);
      translatedResults[translatedRegion] = regionInstitutions[region].size;
      examplesResults[translatedRegion] = Array.from(regionExamples[region]).join(', ');
    });

    return { count: translatedResults, examples: examplesResults };
  };

  const getCategoryInstitutionCount = () => {
    const categoryInstitutions = {};
    const categoryExamples = {};
    
    filteredOrientations.forEach(item => {
      if (item.category && item.institution) {
        const categoryKey = item.category;
        if (!categoryInstitutions[categoryKey]) {
          categoryInstitutions[categoryKey] = new Set();
          categoryExamples[categoryKey] = new Set();
        }
        categoryInstitutions[categoryKey].add(item.institution);
        
        // Ajouter jusqu'à 3 exemples d'institutions
        if (categoryExamples[categoryKey].size < 3) {
          categoryExamples[categoryKey].add(translateField('institution', item.institution));
        }
      }
    });

    // Translate category names for display
    const translatedResults = {};
    const examplesResults = {};
    Object.keys(categoryInstitutions).forEach(category => {
      const translatedCategory = translateField('category', category);
      translatedResults[translatedCategory] = categoryInstitutions[category].size;
      examplesResults[translatedCategory] = Array.from(categoryExamples[category]).join(', ');
    });

    return { count: translatedResults, examples: examplesResults };
  };

  const getDegreeSpecialtyCount = () => {
    const degreeSpecialties = {};
    const degreeExamples = {};
    
    filteredOrientations.forEach(item => {
      if (item.degree && item.specialties) {
        const degreeKey = item.degree;
        
        // Skip if specialties is empty or just a dash
        if (!item.specialties || item.specialties === '-' || item.specialties === 'all') return;
        
        if (!degreeSpecialties[degreeKey]) {
          degreeSpecialties[degreeKey] = new Set();
          degreeExamples[degreeKey] = new Set();
        }
        
        // Handle specialties that might be comma-separated
        let specialtiesList = [];
        if (item.specialties.includes(',')) {
          specialtiesList = item.specialties.split(',').map(s => s.trim());
        } else {
          specialtiesList = [item.specialties];
        }
        
        // Add each specialty to the set
        specialtiesList.forEach(specialty => {
          // Skip empty specialties and duplicates
          if (specialty && specialty !== '-') {
            // Normalize the specialty name to avoid duplicates
            const normalizedSpecialty = specialty.toLowerCase().trim();
            
            // Only add if not already in the set
            if (!degreeSpecialties[degreeKey].has(normalizedSpecialty)) {
              degreeSpecialties[degreeKey].add(normalizedSpecialty);
              
              // Add up to 3 examples of specialties
              if (degreeExamples[degreeKey].size < 3) {
                degreeExamples[degreeKey].add(translateField('specialties', specialty));
              }
            }
          }
        });
      }
    });

    // Translate degree names for display
    const translatedResults = {};
    const examplesResults = {};
    Object.keys(degreeSpecialties).forEach(degree => {
      const translatedDegree = translateField('degree', degree);
      translatedResults[translatedDegree] = degreeSpecialties[degree].size;
      examplesResults[translatedDegree] = Array.from(degreeExamples[degree]).join(', ');
    });

    return { count: translatedResults, examples: examplesResults };
  };

  // Score statistics - FONCTION CORRIGÉE
  const getScoreStats = () => {
    // Extraire tous les scores valides du champ last_year_score
    const validScores = filteredOrientations
      .map(orientation => {
        const score = orientation.last_year_score;
        
        // Debug: afficher chaque score pour vérification
        console.log('Score brut:', score, 'Type:', typeof score);
        
        // Ignorer les valeurs nulles, vides ou non définies
        if (score === null || score === undefined || score === '' || score === '-' || score === '0') {
          return null;
        }
        
        // Convertir en nombre
        let numericScore;
        if (typeof score === 'string') {
          // Nettoyer la chaîne (supprimer les espaces, caractères spéciaux)
          const cleanedScore = score.trim().replace(/\s+/g, '').replace(/[^\d.,]/g, '');
          // Remplacer les virgules par des points pour le parsing
          const normalizedScore = cleanedScore.replace(',', '.');
          numericScore = parseFloat(normalizedScore);
        } else {
          numericScore = score;
        }
        
        // Vérifier si c'est un nombre valide et dans une plage raisonnable (10-200)
        const isValid = !isNaN(numericScore) && numericScore >= 20 && numericScore <= 200;
        
        if (isValid) {
          console.log('Score valide:', numericScore);
          return numericScore;
        } else {
          console.log('Score invalide ignoré:', numericScore);
          return null;
        }
      })
      .filter(score => score !== null);
    
    console.log('Tous les scores valides trouvés:', validScores);
    console.log('Nombre de scores valides:', validScores.length);
    
    // Si aucun score valide n'est trouvé, retourner des valeurs par défaut
    if (validScores.length === 0) {
      return {
        min: '0.00',
        max: '0.00',
        avg: '0.00'
      };
    }
    
    const min = Math.min(...validScores);
    const max = Math.max(...validScores);
    const avg = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;

    console.log('Statistiques calculées - Min:', min, 'Max:', max, 'Moyenne:', avg);

    return {
      min: min.toFixed(2),
      max: max.toFixed(2),
      avg: avg.toFixed(2)
    };
  };

  // Create chart data for bar charts
  const createChartData = (data, label, baseColor, limit = 10) => {
    // Convert data to array and sort by value in descending order
    const sortedData = Object.entries(data.count)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
    
    // Limit to specified number of items
    const limitedData = sortedData.slice(0, limit);
    
    // Generate colors using the app's primary color palette with variations
    const backgroundColors = limitedData.map((_, index) => {
      // Create a gradient of the base color
      const opacity = 0.6 + (index * 0.04); // Slight variation in opacity
      return baseColor.replace('0.6', opacity.toFixed(2));
    });
    
    return {
      labels: limitedData.map(item => item.label),
      datasets: [{
        label,
        data: limitedData.map(item => item.value),
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
        borderWidth: 1,
        barThickness: 30,
        maxBarThickness: 40,
        borderRadius: 4,
      }]
    };
  };

  // Create pie chart data
  const createPieChartData = (data, title, limit = 5) => {
    // Convert data to array, sort by value in descending order, and take top items
    const sortedData = Object.entries(data.count)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit); // Only take top items

    // Prepare the data for the chart
    return {
      labels: sortedData.map(item => item.label),
      datasets: [{
        label: title,
        data: sortedData.map(item => item.value),
        backgroundColor: [
          '#2596be',                  // Base blue
          '#4CAF50',                  // Green
          '#FFC107',                  // Amber
          '#9C27B0',                  // Purple
          '#F44336'                   // Red
        ].slice(0, sortedData.length),
        borderColor: '#fff',
        borderWidth: 1
      }],
      _originalData: data // Store original data for tooltips
    };
  };

  // Chart options for bar charts
  const chartOptions = (examplesData, limit = 10) => ({
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#08325f',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        callbacks: {
          afterLabel: (context) => {
            const label = context.label;
            const examples = examplesData && examplesData[label];
            return examples ? `${t('orientationDashboard.exemple')}: ${examples}` : '';
          },
          labelColor: function(context) {
            return {
              borderColor: 'white',
              backgroundColor: context.dataset.backgroundColor[context.dataIndex],
              borderWidth: 2,
              borderRadius: 2,
            };
          }
        }
      }
    },
  });

  // Chart options for pie/doughnut charts
  const pieChartOptions = (examplesData, limit = 5) => ({
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#08325f',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
          afterLabel: (context) => {
            const label = context.label;
            const examples = examplesData && examplesData[label];
            return examples ? `${t('orientationDashboard.exemple')}: ${examples}` : '';
          },
          labelColor: function(context) {
            return {
              borderColor: 'white',
              backgroundColor: context.dataset.backgroundColor[context.dataIndex],
              borderWidth: 2,
              borderRadius: 2,
            };
          }
        }
      }
    },
  });

  // Create exploded pie chart data (Doughnut with offset)
  const createExplodedPieChartData = (data, title, limit = 5) => {
    const pieData = createPieChartData(data, title, limit);
    
    // Add offset to create exploded effect
    return {
      ...pieData,
      datasets: pieData.datasets.map(dataset => ({
        ...dataset,
        offset: Array(dataset.data.length).fill(10) // Offset each slice by 10px
      }))
    };
  };

  // Get unique degrees count
  const uniqueDegreesCount = new Set(filteredOrientations.map(item => item.degree)).size;

  // Afficher le loader pendant la vérification d'accès
  if (!accessCheckComplete) {
    return (
      <div className="orientation-dashboard-container" dir={pageDirection}>
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
      <div className="orientation-dashboard-container" dir={pageDirection}>
        <div className="access-denied">
          <h2>{t('orientation.accessDenied')}</h2>
          <p>{t('orientation.adminOrNotConnected')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orientation-dashboard-container" dir={pageDirection}>
        <div className="loading-container">{t('orientationDashboard.loading')}</div>
      </div>
    );
  }

  const scoreStats = getScoreStats();

  return (
    <div className="orientation-dashboard-container" dir={pageDirection}>
      <div className="dashboard-header">
        <h1>{t('orientationDashboard.title')}</h1>
        <div className="stats-summary">
          <div className="stat-card">
            <h3>{t('orientationDashboard.totalPrograms')}</h3>
            <span className="stat-number">{uniqueDegreesCount}</span>
          </div>
          <div className="stat-card">
            <h3>{t('orientationDashboard.avgScore')}</h3>
            <span className="stat-number">{scoreStats.avg}</span>
          </div>
          <div className="stat-card">
            <h3>{t('orientationDashboard.uniqueInstitutions')}</h3>
            <span className="stat-number">{new Set(filteredOrientations.map(item => item.institution)).size}</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <h3>{t('orientationDashboard.filters')}</h3>
        <div className="filters-grid">
          {[
            { key: 'bac_type', label: t('orientationDashboard.bacType') },
            { key: 'institution', label: t('orientationDashboard.institution') },
            { key: 'category', label: t('orientationDashboard.category') },
            { key: 'specialties', label: t('orientationDashboard.specialty') },
            { key: 'degree', label: t('orientationDashboard.degree') },
            { key: 'region', label: t('orientationDashboard.region') },
            { key: 'test', label: t('orientationDashboard.test') },
            { key: 'gender', label: t('orientationDashboard.gender') },
            { key: 'geographic_preference', label: t('orientationDashboard.geographicPreference') }
          ].map(({ key, label }) => (
            <div key={key} className="filter-group">
              <label>{label}:</label>
              <select 
                value={filters[key]} 
                onChange={(e) => handleFilterChange(key, e.target.value)}
              >
                {getUniqueOptions(key).map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button onClick={resetFilters} className="reset-btn">
          {t('orientationDashboard.resetFilters')}
        </button>
      </div>

      {/* Charts Layout */}
      <div className="charts-layout">
        {/* Unique Diplômes par Institution */}
        <div className="full-width-chart">
          <div className="chart-card big-chart">
            <h3>{t('orientationDashboard.uniqueDegreesPerInstitution')} ({t('orientationDashboard.top10')})</h3>
            <Bar 
              data={createChartData(
                getInstitutionDegreeCount(), 
                t('orientationDashboard.uniqueDegrees'),
                'rgba(54, 162, 235, 0.6)',
                10
              )} 
              options={chartOptions(getInstitutionDegreeCount().examples, 10)} 
              height={150}
            />
          </div>
        </div>

        {/* Two columns layout for smaller charts */}
        <div className="two-columns">
          {/* Unique Institutions par Région */}
          <div className="chart-card small-chart">
            <h3>{t('orientationDashboard.uniqueInstitutionsPerRegion')} ({t('orientationDashboard.top5')})</h3>
            <Doughnut 
              data={createExplodedPieChartData(
                getRegionInstitutionCount(), 
                t('orientationDashboard.uniqueInstitutions'),
                5
              )} 
              options={pieChartOptions(getRegionInstitutionCount().examples, 5)} 
            />
          </div>

          {/* Unique Institutions par Catégorie */}
          <div className="chart-card small-chart">
            <h3>{t('orientationDashboard.uniqueInstitutionsPerCategory')} ({t('orientationDashboard.top5')})</h3>
            <Pie 
              data={createPieChartData(
                getCategoryInstitutionCount(), 
                t('orientationDashboard.uniqueInstitutions'),
                5
              )} 
              options={pieChartOptions(getCategoryInstitutionCount().examples, 5)} 
            />
          </div>
        </div>

        {/* Unique Spécialités par Diplôme */}
        <div className="full-width-chart">
          <div className="chart-card">
            <h3>{t('orientationDashboard.uniqueSpecialtiesPerDegree')} ({t('orientationDashboard.top10')})</h3>
            <Bar 
              data={createChartData(
                getDegreeSpecialtyCount(), 
                t('orientationDashboard.uniqueSpecialties'),
                'rgba(153, 102, 255, 0.6)',
                10
              )} 
              options={chartOptions(getDegreeSpecialtyCount().examples, 10)} 
              height={100}
            />
          </div>
        </div>

        {/* Score Statistics - BASÉ SUR last_year_score */}
        <div className="score-statistics">
          <h3>{t('orientationDashboard.scoreStatistics')}</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">{t('orientationDashboard.minScore')}</span>
              <span className="stat-value">{scoreStats.min}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t('orientationDashboard.maxScore')}</span>
              <span className="stat-value">{scoreStats.max}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t('orientationDashboard.avgScore')}</span>
              <span className="stat-value">{scoreStats.avg}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrientationDashboard;