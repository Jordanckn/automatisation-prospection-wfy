import React, { useState } from 'react';
import { Eye, Code, Copy, Check } from 'lucide-react';

const Report = ({ htmlContent }) => {
    const [activeTab, setActiveTab] = useState('preview');
    const [copied, setCopied] = useState(false);

    if (!htmlContent) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(htmlContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="report-container">
            <div className="report-header">
                <h3>Rapport Généré</h3>
                <div className="report-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        <Eye size={16} /> Aperçu Visuel
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
                        onClick={() => setActiveTab('code')}
                    >
                        <Code size={16} /> Code HTML
                    </button>
                </div>
            </div>

            <div className="report-content">
                {activeTab === 'preview' ? (
                    <div className="preview-frame">
                        <iframe
                            title="Report Preview"
                            srcDoc={htmlContent}
                            style={{ width: '100%', height: '600px', border: 'none', background: 'white' }}
                        />
                    </div>
                ) : (
                    <div className="code-view">
                        <div className="code-actions">
                            <button onClick={handleCopy} className="copy-btn">
                                {copied ? <><Check size={16} /> Copié !</> : <><Copy size={16} /> Copier le HTML</>}
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={htmlContent}
                            className="html-textarea"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Report;
