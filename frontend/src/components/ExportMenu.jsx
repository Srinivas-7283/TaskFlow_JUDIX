import { useState } from 'react';
import api from '../utils/api';
import { saveAs } from 'file-saver';

const ExportMenu = () => {
    const [loading, setLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const handleExport = async (format) => {
        setLoading(true);
        try {
            if (format === 'csv') {
                const response = await api.get('/export/tasks/csv', { responseType: 'blob' });
                saveAs(response.data, 'tasks.csv');
            } else if (format === 'json') {
                const response = await api.get('/export/tasks/json', { responseType: 'blob' });
                saveAs(response.data, 'tasks.json');
            } else if (format === 'pdf') {
                const response = await api.get('/export/tasks/pdf', { responseType: 'blob' });
                saveAs(response.data, 'tasks.pdf');
            }
            setShowMenu(false);
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export tasks');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="btn-secondary flex items-center gap-2"
                disabled={loading}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {loading ? 'Exporting...' : 'Export'}
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-10 animate-fade-in">
                    <div className="py-2">
                        <button
                            onClick={() => handleExport('csv')}
                            className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export as CSV
                        </button>
                        <button
                            onClick={() => handleExport('json')}
                            className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Export as JSON
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Export as PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExportMenu;
