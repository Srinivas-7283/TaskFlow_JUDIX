import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTasks();
    }, [searchQuery, statusFilter, priorityFilter]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (statusFilter) params.append('status', statusFilter);
            if (priorityFilter) params.append('priority', priorityFilter);

            const response = await api.get(`/tasks?${params.toString()}`);
            setTasks(response.data.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch tasks');
            console.error('Fetch tasks error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            const response = await api.post('/tasks', taskData);
            setTasks([response.data.data, ...tasks]);
            setShowTaskForm(false);
            setError('');
        } catch (error) {
            setError('Failed to create task');
            console.error('Create task error:', error);
        }
    };

    const handleUpdateTask = async (taskId, taskData) => {
        try {
            const response = await api.put(`/tasks/${taskId}`, taskData);
            setTasks(tasks.map((task) => (task._id === taskId ? response.data.data : task)));
            setError('');
        } catch (error) {
            setError('Failed to update task');
            console.error('Update task error:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter((task) => task._id !== taskId));
            setError('');
        } catch (error) {
            setError('Failed to delete task');
            console.error('Delete task error:', error);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const taskStats = {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === 'pending').length,
        inProgress: tasks.filter((t) => t.status === 'in-progress').length,
        completed: tasks.filter((t) => t.status === 'completed').length,
    };

    return (
        <div className="min-h-screen pb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">TaskFlow</h1>
                            <p className="text-blue-100 mt-1">Welcome back, {user?.name}!</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <button
                                onClick={handleLogout}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* User Profile Card */}
                <div className="glass-card mb-8 animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{user?.name}</h2>
                            <p className="text-slate-600 dark:text-slate-300">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 dark:text-blue-300 text-sm font-medium">Total Tasks</p>
                                <p className="text-3xl font-bold text-blue-700 dark:text-blue-200">{taskStats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-600 dark:text-yellow-300 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-200">{taskStats.pending}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-indigo-600 dark:text-indigo-300 text-sm font-medium">In Progress</p>
                                <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-200">{taskStats.inProgress}</p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 dark:text-green-300 text-sm font-medium">Completed</p>
                                <p className="text-3xl font-bold text-green-700 dark:text-green-200">{taskStats.completed}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Task Management Section */}
                <div className="glass-card">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Tasks</h2>
                        <button
                            onClick={() => setShowTaskForm(!showTaskForm)}
                            className="btn-primary"
                        >
                            {showTaskForm ? 'Cancel' : '+ New Task'}
                        </button>
                    </div>

                    {/* Task Form */}
                    {showTaskForm && (
                        <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg animate-slide-up border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Create New Task</h3>
                            <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowTaskForm(false)} />
                        </div>
                    )}

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tasks..."
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="input-field"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priority</label>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="input-field"
                            >
                                <option value="">All Priorities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Task List */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-slate-500 text-lg">No tasks found</p>
                            <p className="text-slate-400 text-sm mt-1">Create your first task to get started!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onUpdate={handleUpdateTask}
                                    onDelete={handleDeleteTask}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
