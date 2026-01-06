import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const TaskCard = ({ task, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editData, setEditData] = useState({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
    });

    const handleUpdate = async () => {
        await onUpdate(task._id, editData);
        setIsEditing(false);
    };

    const confirmDelete = () => {
        onDelete(task._id);
        setShowDeleteModal(false);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (isEditing) {
        return (
            <div className="card animate-fade-in">
                <div className="space-y-4">
                    <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="input-field"
                        placeholder="Task title"
                    />
                    <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="input-field resize-none"
                        rows="2"
                        placeholder="Description"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            value={editData.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            className="input-field"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select
                            value={editData.priority}
                            onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                            className="input-field"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleUpdate} className="btn-primary flex-1">
                            Save
                        </button>
                        <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="card group hover:border-blue-200 transition-all duration-200">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex-1">{task.title}</h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                            title="Edit task"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                            title="Delete task"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {task.description && (
                    <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">{task.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`badge badge-${task.status}`}>
                        {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                    <span className={`badge badge-${task.priority}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                </div>

                {task.attachments && task.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {task.attachments.map((att, index) => (
                            <a
                                key={index}
                                href={att}
                                download={`attachment-${index}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-12 h-12 rounded bg-slate-100 border border-slate-200 hover:border-blue-400 dark:bg-slate-700 dark:border-slate-600 dark:hover:border-blue-400 bg-cover bg-center"
                                style={{ backgroundImage: att.startsWith('data:image') ? `url(${att})` : 'none' }}
                                title="Download Attachment"
                            >
                                {!att.startsWith('data:image') && (
                                    <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                    </div>
                                )}
                            </a>
                        ))}
                    </div>
                )}

                <div className="text-xs text-slate-500 dark:text-slate-400">
                    Created: {formatDate(task.createdAt)}
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
            />
        </>
    );
};

export default TaskCard;
