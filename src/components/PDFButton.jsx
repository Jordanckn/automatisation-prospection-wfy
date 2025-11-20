import React from 'react';
import html2pdf from 'html2pdf.js';
import { Download } from 'lucide-react';

const PDFButton = ({ htmlContent, fileName }) => {
    const handleExport = () => {
        const element = document.createElement('div');
        element.innerHTML = htmlContent;

        // Temporary append to body to ensure styles are computed (though html2pdf handles this usually, 
        // sometimes it needs to be in DOM for some font rendering, but usually not strictly required if passing string.
        // However, html2pdf takes an element or string. Passing the element is safer for complex layouts.)
        // For simplicity with the specific template, we can pass the string directly or a container.
        // Let's use the element approach but we don't necessarily need to append it to body if we use the right settings,
        // but appending and hiding is a safe bet for "rendering" before print if needed. 
        // Actually html2pdf works well with just the element not attached.

        const opt = {
            margin: 0,
            filename: fileName || 'audit-webfityou.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <button onClick={handleExport} className="pdf-btn">
            <Download size={18} /> Exporter en PDF
        </button>
    );
};

export default PDFButton;
