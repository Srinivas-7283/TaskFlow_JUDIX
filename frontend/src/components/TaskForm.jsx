import { useState } from 'react';

const TaskForm = ({ onSubmit, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status || 'pending',
        priority: initialData?.priority || 'medium',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                    Task Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter task title"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field resize-none"
                    rows="3"
                    placeholder="Enter task description (optional)"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
                        Priority
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Attachments (Max 2MB)
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => {
                        const files = Array.from(e.target.files);
                        Promise.all(files.map(file => {
                            return new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result);
                                reader.onerror = reject;
                                reader.readAsDataURL(file);
                            });
                        })).then(results => {
                            setFormData(prev => ({ ...prev, attachments: results }));
                        });
                    }}
                    className="input-field"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                    {initialData ? 'Update Task' : 'Create Task'}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn-secondary flex-1">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default TaskForm;
