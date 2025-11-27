import React, { useState } from 'react';

function CodeSearch() {
  const [code, setCode] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    setResults([]);
    if (!code.trim()) {
      setError('Please enter a code');
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orientations/code/${code.trim()}/`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to fetch data. Make sure your backend is running.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Search Orientations by Code</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code (e.g. 70571)"
        style={{ width: '200px', marginRight: 10 }}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {results.length === 0 && !error && <p>No results yet</p>}
        {results.map((item) => (
          <li key={item.id} style={{ marginTop: 10 }}>
            <b>Category:</b> {item.category} <br />
            <b>Degree:</b> {item.degree} <br />
            <b>Institution:</b> {item.institution} <br />
            <b>Specialties:</b> {item.specialties} <br />
            <b>Code:</b> {item.code} <br />
            <b>Bac Type:</b> {item.bac_type} <br />
            <b>Calculation Format:</b> {item.calculation_format} <br />
            <b>Last Year Score:</b> {item.last_year_score} <br />
            <b>Gender:</b> {item.gender} <br />
            <b>Matiere principal:</b> {item.matiere_principale} <br />
            <b>Test:</b> {item.test}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CodeSearch;
