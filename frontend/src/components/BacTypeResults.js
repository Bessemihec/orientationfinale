import React, { useState, useEffect } from 'react';

const bacTypesList = [
  'آداب',
  'رياضيات',
  'علوم تجريبية',
  'العلوم التقنية',
  'علوم الإعلامية',
  'اقتصاد وتصرف',
  'رياضة',
];

const bacColors = {
  آداب: '#f4a261',           
  رياضيات: '#2a9d8f',       
  'علوم تجريبية': '#e76f51', 
  'العلوم التقنية': '#264653',
  'علوم الإعلامية': '#e9c46a',
  'اقتصاد وتصرف':'#e5c43a',
  رياضة: '#8ab17d',
  default: '#ccc',
};

function BacTypeResults() {
  const [selectedBac, setSelectedBac] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les données à chaque changement de selectedBac
  useEffect(() => {
    if (!selectedBac) {
      setData([]);
      return;
    }

    setLoading(true);
    setError('');
    
    // encodeURIComponent pour bac_type en URL
    const bacEncoded = encodeURIComponent(selectedBac);

    fetch(`http://127.0.0.1:8000/api/orientations/bac/${bacEncoded}/`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => {
        setError('Erreur lors du chargement des données.');
        setData([]);
        console.error(err);
      })
      .finally(() => setLoading(false));

  }, [selectedBac]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Rechercher par type de Bac</h2>

      <select
        value={selectedBac}
        onChange={e => setSelectedBac(e.target.value)}
        style={{
          padding: '8px 12px',
          fontSize: '16px',
          marginBottom: '20px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          minWidth: '200px'
        }}
      >
        <option value="">-- Sélectionner un type de Bac --</option>
        {bacTypesList.map(bac => (
          <option key={bac} value={bac}>
            {bac}
          </option>
        ))}
      </select>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && data.length > 0 && (
        <div
          style={{
            backgroundColor: bacColors[selectedBac] || bacColors.default,
            padding: 15,
            borderRadius: 8,
            color: '#fff',
          }}
        >
          <h3>{selectedBac}</h3>
          <ul>
            {data.map(item => (
              <li key={item.id} style={{ marginBottom: 10 }}>
                <b>Catégorie:</b> {item.category} <br />
                <b>Diplôme:</b> {item.degree} <br />
                <b>Établissement:</b> {item.institution} <br />
                <b>Spécialités:</b> {item.specialties} <br />
                <b>Code:</b> {item.code} <br />
                <b>Format calcul:</b> {item.calculation_format} <br />
                <b>Score année dernière:</b> {item.last_year_score} <br />
                <b>Genre:</b> {item.gender} <br /> 
                <b>Matiere principal:</b> {item.matiere_principale} <br />
                 <b>Test:</b> {item.test}<br />
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && selectedBac && data.length === 0 && (
        <p>Aucun résultat trouvé pour ce type de Bac.</p>
      )}
    </div>
  );
}

export default BacTypeResults;
