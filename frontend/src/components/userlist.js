import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/UserList.css';

function UserList() {
  const { t, i18n } = useTranslation();
  const [etudiants, setEtudiants] = useState([]);
  const [filteredEtudiants, setFilteredEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionFilter, setSessionFilter] = useState('all');
  const [bacTypeFilter, setBacTypeFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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
    filterEtudiants();
  }, [etudiants, sessionFilter, bacTypeFilter, cityFilter, searchTerm]);

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
            console.log('Admin user detected, showing user list');
            setShowPage(true);
            await fetchEtudiants();
          } else {
            console.log('Non-admin user, hiding user list');
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

  const fetchEtudiants = async () => {
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
        console.log('Réponse API:', data);
        
        if (data.etudiants && Array.isArray(data.etudiants)) {
          // FILTRE ADMIN: Exclure l'utilisateur admin
          const filteredAdmin = data.etudiants.filter(etudiant => 
            etudiant.email !== 'admin@gmail.com' && etudiant.username !== 'admin'
          );
          
          // Trier par ordre alphabétique du nom d'utilisateur
          const sortedData = [...filteredAdmin].sort((a, b) => {
            const normalize = (str) => {
              return (str || '').toLowerCase().normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\u0600-\u06FF]/g, '');
            };
            
            const usernameA = normalize(a.username);
            const usernameB = normalize(b.username);
            
            return usernameA.localeCompare(usernameB, i18n.language === 'ar' ? 'ar' : undefined, {
              sensitivity: 'base',
              ignorePunctuation: true,
              numeric: true
            });
          });
          setEtudiants(sortedData);
          console.log('Étudiants chargés (sans admin):', sortedData.length);
        } else {
          console.error('Format de réponse inattendu:', data);
        }
      } else {
        console.error('Erreur HTTP:', response.status);
        const errorText = await response.text();
        console.error('Détails erreur:', errorText);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };

  const filterEtudiants = () => {
    let filtered = etudiants;
    console.log('Filtrage - Étudiants totaux:', etudiants.length);

    // Filtrer par session
    if (sessionFilter !== 'all') {
      filtered = filtered.filter(etudiant => etudiant.session === sessionFilter);
      console.log('Après filtre session:', filtered.length);
    }

    // Filtrer par type de bac
    if (bacTypeFilter !== 'all') {
      filtered = filtered.filter(etudiant => etudiant.bac_type === bacTypeFilter);
      console.log('Après filtre bac:', filtered.length);
    }

    // Filtrer par ville
    if (cityFilter !== 'all') {
      filtered = filtered.filter(etudiant => etudiant.ville === cityFilter);
      console.log('Après filtre ville:', filtered.length);
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(etudiant => 
        etudiant.username.toLowerCase().includes(term) ||
        etudiant.email.toLowerCase().includes(term) ||
        (etudiant.ville && etudiant.ville.toLowerCase().includes(term))
      );
      console.log('Après filtre recherche:', filtered.length);
    }

    console.log('Étudiants filtrés finaux:', filtered.length);
    setFilteredEtudiants(filtered);
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

  const resetFilters = () => {
    setSessionFilter('all');
    setBacTypeFilter('all');
    setCityFilter('all');
    setSearchTerm('');
  };

  // Afficher le loader pendant la vérification d'accès
  if (!accessCheckComplete) {
    return (
      <div className="user-list-container" dir={pageDirection}>
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
      <div className="user-list-container" dir={pageDirection}>
        <div className="access-denied">
          <h2>{t('userList.accessDenied')}</h2>
          <p>{t('userList.adminOnly')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="user-list-container" dir={pageDirection}>{t('userList.loading')}</div>;
  }

  return (
    <div className="user-list-container" dir={pageDirection}>
      <div className="user-list-header">
        <h2>{t('userList.title')}</h2>
        <div className="user-count">
          {t('userList.totalUsers')}: {filteredEtudiants.length}
        </div>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder={t('userList.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>{t('userList.filterBySession')}:</label>
          <select 
            value={sessionFilter} 
            onChange={(e) => setSessionFilter(e.target.value)}
          >
            <option value="all">{t('userList.allSessions')}</option>
            <option value="principale">{t('userList.mainSession')}</option>
            <option value="controle">{t('userList.controlSession')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('userList.filterByBacType')}:</label>
          <select 
            value={bacTypeFilter} 
            onChange={(e) => setBacTypeFilter(e.target.value)}
          >
            <option value="all">{t('userList.allBacTypes')}</option>
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
          <label>{t('userList.filterByCity')}:</label>
          <select 
            value={cityFilter} 
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="all">{t('userList.allCities')}</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {t(`villes.${city}`)}
              </option>
            ))}
          </select>
        </div>

        <button onClick={resetFilters} className="reset-filters-btn">
          {t('userList.resetFilters')}
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>{t('userList.user')}</th>
              <th>{t('topics.email')}</th>
              <th>{t('topics.bacType')}</th>
              <th>{t('topics.city')}</th>
              <th>{t('topics.session')}</th>
              <th>{t('topics.generalAverage')}</th>
              <th>{t('topics.fgScore')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredEtudiants.length > 0 ? (
              filteredEtudiants.map(etudiant => (
                <tr key={etudiant.id}>
                  <td className="username">{etudiant.username || '-'}</td>
                  <td>{etudiant.email}</td>
                  <td>
                    <span 
                      className="bac-type-badge"
                      style={{ backgroundColor: getBacTypeColor(etudiant.bac_type) }}
                    >
                      {t(`bac.${etudiant.bac_type}`)}
                    </span>
                  </td>
                  <td>
                    <span className="city-text">
                      {etudiant.ville ? t(`villes.${etudiant.ville}`) : t('userList.noCity')}
                    </span>
                  </td>
                  <td>
                    {etudiant.session === 'controle' 
                      ? t('userList.controlSession') 
                      : t('userList.mainSession')
                    }
                  </td>
                  <td className="mg-value">{etudiant.mg ? Number(etudiant.mg).toFixed(2) : '0.000'}</td>
                  <td className="fg-value">{etudiant.fg ? Number(etudiant.fg).toFixed(3) : '0.000'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  {t('userList.noUsersFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;