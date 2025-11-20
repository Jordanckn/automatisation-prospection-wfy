import React, { useState } from 'react';
import { Search, User, MapPin, Briefcase } from 'lucide-react';

const Form = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        url: '',
        name: '',
        profession: '',
        location: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="form-container">
            <h2>Nouvel Audit</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label><Search size={18} /> URL du site</label>
                    <input
                        type="url"
                        name="url"
                        placeholder="https://example.com"
                        required
                        value={formData.url}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label><User size={18} /> Nom du prospect</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Jean Dupont"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="row">
                    <div className="input-group half">
                        <label><Briefcase size={18} /> Profession</label>
                        <input
                            type="text"
                            name="profession"
                            placeholder="Avocat, Plombier..."
                            required
                            value={formData.profession}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group half">
                        <label><MapPin size={18} /> Localisation</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Paris, Lyon..."
                            required
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Analyse en cours...' : 'Lancer l\'audit'}
                </button>
            </form>
        </div>
    );
};

export default Form;
