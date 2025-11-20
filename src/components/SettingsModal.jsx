import React, { useState, useEffect } from 'react';
import { Settings, X, Save } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, onSave, initialKeys }) => {
    const [keys, setKeys] = useState({
        googlePageSpeedApiKey: '',
        openRouterApiKey: '',
        aiModel: 'tngtech/deepseek-r1t2-chimera:free'
    });

    useEffect(() => {
        if (isOpen) {
            setKeys(initialKeys);
        }
    }, [isOpen, initialKeys]);

    const handleChange = (e) => {
        setKeys({ ...keys, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(keys);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Configuration API</h3>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Clé API Google PageSpeed</label>
                        <input
                            type="text"
                            name="googlePageSpeedApiKey"
                            value={keys.googlePageSpeedApiKey}
                            onChange={handleChange}
                            placeholder="AIzaSy..."
                        />
                        <small>Nécessaire pour analyser le site.</small>
                    </div>

                    <div className="input-group">
                        <label>Clé API OpenRouter (IA)</label>
                        <input
                            type="password"
                            name="openRouterApiKey"
                            value={keys.openRouterApiKey}
                            onChange={handleChange}
                            placeholder="sk-or-..."
                        />
                        <small>Pour générer l'analyse textuelle intelligente.</small>
                    </div>

                    <div className="input-group">
                        <label>Modèle IA (OpenRouter)</label>
                        <input
                            type="text"
                            name="aiModel"
                            value={keys.aiModel}
                            onChange={handleChange}
                            placeholder="google/gemini-2.0-flash-001"
                        />
                        <small>Ex: google/gemini-2.0-flash-001, meta-llama/llama-3-8b-instruct:free</small>
                    </div>

                    <button type="submit" className="save-btn">
                        <Save size={18} /> Enregistrer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;
