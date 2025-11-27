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
import { Bar, Doughnut } from 'react-chartjs-2';
import '../css/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboardetudiant() {
  const { t, i18n } = useTranslation();
  const [etudiants, setEtudiants] = useState([]);
  const [filteredEtudiants, setFilteredEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bacTypeFilter, setBacTypeFilter] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [villeFilter, setVilleFilter] = useState('all');
  const [showPage, setShowPage] = useState(false);
  const [accessCheckComplete, setAccessCheckComplete] = useState(false);

  const pageDirection = i18n.language === 'ar' ? 'rtl' : 'ltr';

  // Liste des villes tunisiennes
  const cities = [
    'تونس الكبرى', 'بنزرت', 'نابل', 'زغوان', 'باجة', 'جندوبة',
    'الكاف', 'سليانة', 'سوسة', 'المنستير', 'المهدية', 'صفاقس',
    'القيروان', 'القصرين', 'سيدي بوزيد', 'قفصة', 'توزر', 'قبلي',
    'قابس', 'مدنين', 'تطاوين'
  ];

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [etudiants, bacTypeFilter, sessionFilter, villeFilter]);

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
          
          // Vérifier si l'utilisateur est admin - seulement admin peut voir cette page
          if (username === "admin") {
            console.log('Admin user detected, showing dashboard');
            setShowPage(true);
            await fetchAllEtudiants();
          } else {
            console.log('Non-admin user, hiding dashboard');
            setShowPage(false);
          }
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

  const fetchAllEtudiants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/etudiants/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Filtrer l'admin
        const filteredData = data.etudiants.filter(etudiant => 
          etudiant.email !== 'admin@gmail.com' && etudiant.username !== 'admin'
        );
        setEtudiants(filteredData);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const applyFilters = () => {
    let filtered = etudiants;

    if (bacTypeFilter !== 'all') {
      filtered = filtered.filter(etudiant => etudiant.bac_type === bacTypeFilter);
    }

    if (sessionFilter !== 'all') {
      filtered = filtered.filter(etudiant => etudiant.session === sessionFilter);
    }

    if (villeFilter !== 'all') {
      filtered = filtered.filter(etudiant => etudiant.ville === villeFilter);
    }

    // Trier par FG décroissant
    filtered.sort((a, b) => (b.fg || 0) - (a.fg || 0));
    setFilteredEtudiants(filtered);
  };

  const resetFilters = () => {
    setBacTypeFilter('all');
    setSessionFilter('all');
    setVilleFilter('all');
  };

  // Données pour les graphiques
  const getBacTypeDistribution = () => {
    const bacTypes = {
      'آداب': 0,
      'رياضيات': 0,
      'اقتصاد وتصرف': 0,
      'علوم تجريبية': 0,
      'العلوم التقنية': 0,
      'علوم الإعلامية': 0,
      'رياضة': 0
    };

    filteredEtudiants.forEach(etudiant => {
      if (etudiant.bac_type && bacTypes.hasOwnProperty(etudiant.bac_type)) {
        bacTypes[etudiant.bac_type]++;
      }
    });

    return bacTypes;
  };

  const getSessionDistribution = () => {
    const sessions = {
      'principale': 0,
      'controle': 0
    };

    filteredEtudiants.forEach(etudiant => {
      if (etudiant.session && sessions.hasOwnProperty(etudiant.session)) {
        sessions[etudiant.session]++;
      }
    });

    return sessions;
  };

  const getVilleDistribution = () => {
    const villes = {};
    
    filteredEtudiants.forEach(etudiant => {
      if (etudiant.ville) {
        villes[etudiant.ville] = (villes[etudiant.ville] || 0) + 1;
      }
    });

    return villes;
  };

  const getBacTypeColor = (bacType) => {
    const colors = {
      'آداب': '#4CAF50',
      'رياضيات': '#2196F3',
      'اقتصاد وتصرف': '#FF9800',
      'علوم تجريبية': '#E91E63',
      'العلوم التقنية': '#9C27B0',
      'علوم الإعلامية': '#607D8B',
      'رياضة': '#795548'
    };
    return colors[bacType] || '#757575';
  };

  const getInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : '??';
  };

  // Configuration des graphiques
  const bacTypeChartData = {
    labels: Object.keys(getBacTypeDistribution()).map(key => t(`bac.${key}`)),
    datasets: [
      {
        label: t('dashboard.studentsCount'),
        data: Object.values(getBacTypeDistribution()),
        backgroundColor: [
          '#4CAF50', '#2196F3', '#FF9800', '#E91E63', 
          '#9C27B0', '#607D8B', '#795548'
        ],
        borderWidth: 1,
      },
    ],
  };

  const sessionChartData = {
    labels: [t('dashboard.mainSession'), t('dashboard.controlSession')],
    datasets: [
      {
        data: Object.values(getSessionDistribution()),
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '',
      },
    },
  };

  // Afficher le loader pendant la vérification d'accès
  if (!accessCheckComplete) {
    return (
      <div className="dashboard-container" dir={pageDirection}>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>{t('access.checkingPermissions')}</p>
        </div>
      </div>
    );
  }

  // Ne pas afficher la page si l'utilisateur n'est pas admin
  if (!showPage) {
    return (
      <div className="dashboard-container" dir={pageDirection}>
        <div className="access-denied">
          <h2>{t('dashboard.accessDenied')}</h2>
          <p>{t('dashboard.adminOnly')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="dashboard-container" dir={pageDirection}>{t('dashboard.loading')}</div>;
  }

  return (
    <div className="dashboard-container" dir={pageDirection}>
      <div className="dashboard-header">
        <h1>{t('dashboard.title')}</h1>
        <div className="stats-summary">
          <div className="stat-card">
            <h3>{t('dashboard.totalStudents')}</h3>
            <span className="stat-number">{filteredEtudiants.length}</span>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <h3>{t('dashboard.filters')}</h3>
        <div className="filter-group">
          <label>{t('dashboard.filterByBacType')}:</label>
          <select 
            value={bacTypeFilter} 
            onChange={(e) => setBacTypeFilter(e.target.value)}
          >
            <option value="all">{t('dashboard.allBacTypes')}</option>
            <option value="آداب">{t('bac.آداب')}</option>
            <option value="رياضيات">{t('bac.رياضيات')}</option>
            <option value="اقتصاد وتصرف">{t('bac.اقتصاد وتصرف')}</option>
            <option value="علوم تجريبية">{t('bac.علوم تجريبية')}</option>
            <option value="العلوم التقنية">{t('bac.العلوم التقنية')}</option>
            <option value="علوم الإعلامية">{t('bac.علوم الإعلامية')}</option>
            <option value="رياضة">{t('bac.رياضة')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('dashboard.filterBySession')}:</label>
          <select 
            value={sessionFilter} 
            onChange={(e) => setSessionFilter(e.target.value)}
          >
            <option value="all">{t('dashboard.allSessions')}</option>
            <option value="principale">{t('dashboard.mainSession')}</option>
            <option value="controle">{t('dashboard.controlSession')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('dashboard.filterByCity')}:</label>
          <select 
            value={villeFilter} 
            onChange={(e) => setVilleFilter(e.target.value)}
          >
            <option value="all">{t('dashboard.allCities')}</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {t(`villes.${city}`)}
              </option>
            ))}
          </select>
        </div>

        <button onClick={resetFilters} className="reset-btn">
          {t('dashboard.resetFilters')}
        </button>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>{t('dashboard.bacTypeDistribution')}</h3>
          <Bar data={bacTypeChartData} options={chartOptions} />
        </div>

        <div className="chart-card">
          <h3>{t('dashboard.sessionDistribution')}</h3>
          <Doughnut data={sessionChartData} options={chartOptions} />
        </div>

        <div className="chart-card">
          <h3>{t('dashboard.topStudents')}</h3>
          <div className="students-list">
            {filteredEtudiants.slice(0, 10).map((etudiant, index) => (
              <div key={etudiant.id || index} className="student-item">
                <div className="student-avatar" style={{ backgroundColor: getBacTypeColor(etudiant.bac_type) }}>
                  {getInitials(etudiant.username)}
                </div>
                <div className="student-info">
                  <div className="student-name">{etudiant.username}</div>
                  <div className="student-details">
                    <span className="bac-type">{t(`bac.${etudiant.bac_type}`)}</span>
                    <span className="fg-score">{etudiant.fg || 0} FG</span>
                  </div>
                </div>
                <div className="student-rank">#{index + 1}</div>
              </div>
            ))}
            {filteredEtudiants.length === 0 && (
              <div className="no-students">{t('dashboard.noStudents')}</div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <h3>{t('dashboard.cityDistribution')}</h3>
          <div className="city-list">
            {Object.entries(getVilleDistribution()).map(([ville, count]) => (
              <div key={ville} className="city-item">
                <span className="city-name">{t(`villes.${ville}`)}</span>
                <span className="city-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboardetudiant;