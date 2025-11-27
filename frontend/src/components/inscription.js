import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/inscription.css";

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bac_type: "",
    session: "principale",
    mg: "",
    grades: {},
    option: "",
  });

  const [selectedOption, setSelectedOption] = useState("");

  const bacTypes = [
    "آداب",
    "رياضيات",
    "اقتصاد وتصرف",
    "علوم تجريبية",
    "العلوم التقنية",
    "علوم الإعلامية",
    "رياضة",
  ];

  const subjectLabels = {
    M: "Mathématiques",
    A: "Arabe",
    F: "Français",
    Ang: "Anglais",
    PH: "Philosophie",
    HG: "Histoire-Géo",
    SVT: "Sciences de la Vie et Terre",
    EP: "Éducation Physique",
    Ec: "Économie",
    Ge: "Gestion",
    Info: "Informatique",
    STI: "STI",
    Algo: "Algorithmique",
    TE: "Techniques Électroniques",
    IT: "Italien",
    All: "Allemand",
    ESP: "Espagnol",
    SP: "Sciences Physiques",
    Sp_sport: "Sport Spécial",
    SB:"Sciences Bio",
  };

  const baseSubjects = {

  "آداب": ["M", "A", "F", "Ang", "PH", "EP", "HG", "Info"],
  "رياضيات": ["M", "A", "F", "Ang", "PH", "EP", "SVT","SP", "Info"],
  "اقتصاد وتصرف": ["M", "A", "F", "Ang", "PH", "EP", "Ec", "Ge", "HG", "Info"],
  "علوم تجريبية": ["M", "A", "F", "Ang", "PH", "EP", "SVT", "SP", "Info"],
  "العلوم التقنية": ["M", "A", "F", "Ang", "PH", "EP", "SP", "Info", "TE"],
  "علوم الإعلامية": ["M", "A", "F", "Ang", "PH", "EP", "STI", "Algo","SP"], // pas de "Info"
  "رياضة": ["M", "A", "F", "Ang", "PH", "EP", "Sp_sport", "HG", "Info","SB"],

  };

  const optionSubjects = ["IT", "All", "ESP"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("grade_")) {
      const subjectCode = name.replace("grade_", "");
      setFormData((prev) => ({
        ...prev,
        grades: {
          ...prev.grades,
          [subjectCode]: parseFloat(value),
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleOptionChange = (e) => {
    const option = e.target.value;
    setSelectedOption(option);
    setFormData((prev) => ({
      ...prev,
      option,
      grades: {
        ...prev.grades,
        [option]: 0,
      },
    }));
  };

  const removeOption = () => {
    const updatedGrades = { ...formData.grades };
    delete updatedGrades[selectedOption];
    setSelectedOption("");
    setFormData({
      ...formData,
      option: "",
      grades: updatedGrades,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      bac_type: formData.bac_type,
      session: formData.session,
      mg: parseFloat(formData.mg),
      option: formData.option || "",
      ...formData.grades,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Inscription réussie !");
        navigate("/login");
      } else {
        alert("Erreur : " + JSON.stringify(data));
      }
    } catch (err) {
      alert("Erreur réseau");
    }
  };

  const selectedSubjects = formData.bac_type
    ? baseSubjects[formData.bac_type] || []
    : [];

  return (
    <div className="form-container">
      <h2 className="title">Inscription</h2>
      <form onSubmit={handleSubmit}>
        <label className="label">Nom d'utilisateur</label>
        <input name="username" className="input" onChange={handleChange} required />

        <label className="label">Email</label>
        <input name="email" type="email" className="input" onChange={handleChange} required />

        <label className="label">Mot de passe</label>
        <input name="password" type="password" className="input" onChange={handleChange} required />

        <label className="label">Type de bac</label>
        <select name="bac_type" className="select" onChange={handleChange} required>
          <option value="">-- Choisir --</option>
          {bacTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <label className="label">Session</label>
        <select name="session" className="select" onChange={handleChange}>
          <option value="principale">Principale</option>
          <option value="controle">Contrôle</option>
        </select>

        <label className="label">Moyenne Générale (MG)</label>
        <input
          name="mg"
          type="number"
          step="0.01"
          min="0"
          max="20"
          className="input"
          onChange={handleChange}
          required
        />

        <div className="notes-container">
          <h4 className="label">Notes</h4>
          {selectedSubjects.map((code) => (
            <div key={code}>
              <label className="label">{subjectLabels[code]} ({code})</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="20"
                name={`grade_${code}`}
                className="input"
                onChange={handleChange}
              />
            </div>
          ))}

          {selectedOption && (
            <div>
              <label className="label">{subjectLabels[selectedOption]} (Option)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="20"
                name={`grade_${selectedOption}`}
                className="input"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={removeOption}
                className="btn"
                style={{ marginTop: "10px", backgroundColor: "#e74c3c" }}
              >
                Supprimer Option
              </button>
            </div>
          )}

          {!selectedOption && (
            <>
              <label className="label">Choisir une option</label>
              <select className="select" onChange={handleOptionChange}>
                <option value="">-- Aucune --</option>
                {optionSubjects.map((opt) => (
                  <option key={opt} value={opt}>
                    {subjectLabels[opt]}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <button type="submit" className="btn">S'inscrire</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
