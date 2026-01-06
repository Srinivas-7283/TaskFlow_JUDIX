import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ThemeToggle from '../components/ThemeToggle';

// Draggable Task Card Component
const DraggableTaskCard = ({ task }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-3 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 cursor-move"
        >
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{task.title}</h3>
            {task.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{task.description}</p>
            )}
            <div className="flex gap-2">
                <span className={`badge badge-${task.priority}`}>
                    {task.priority.toUpperCase()}
                </span>
            </div>
        </div>
    );
};

// Kanban Column Component
const KanbanColumn = ({ status, tasks, title, color }) => {
    const taskIds = tasks.map((task) => task._id);

    return (
        <div className="flex-1 min-w-[300px]">
            <div className={`bg-gradient-to-r ${color} text-white p-4 rounded-t-lg`}>
                <h2 className="text-lg font-bold flex items-center justify-between">
                    {title}
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{tasks.length}</span>
                </h2>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-b-lg min-h-[500px]">
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <DraggableTaskCard key={task._id} task={task} />
                    ))}
                </SortableContext>
                {tasks.length === 0 && (
                    <div className="text-center py-12 text-slate-400 dark:text-slate-600">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p>No tasks</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const KanbanBoard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/tasks?limit=100');
            setTasks(response.data.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return;

        const activeTask = tasks.find((t) => t._id === active.id);
        const overTask = tasks.find((t) => t._id === over.id);

        if (!activeTask || !overTask) return;

        // If dropped on a different column (different status)
        if (activeTask.status !== overTask.status) {
            try {
                // Update task status
                await api.put(`/tasks/${activeTask._id}`, {
                    ...activeTask,
                    status: overTask.status,
                });

                // Update local state
                setTasks((tasks) =>
                    tasks.map((task) =>
                        task._id === activeTask._id ? { ...task, status: overTask.status } : task
                    )
                );
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }

        setActiveId(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const pendingTasks = tasks.filter((t) => t.status === 'pending');
    const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
    const completedTasks = tasks.filter((t) => t.status === 'completed');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Kanban Board</h1>
                            <p className="text-blue-100 mt-1">Drag and drop to organize your tasks</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <button
                                onClick={logout}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-medium transition-all duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <div className="flex gap-6 overflow-x-auto pb-4">
                        <KanbanColumn
                            status="pending"
                            tasks={pendingTasks}
                            title="📋 Pending"
                            color="from-yellow-500 to-orange-500"
                        />
                        <KanbanColumn
                            status="in-progress"
                            tasks={inProgressTasks}
                            title="⚡ In Progress"
                            color="from-blue-500 to-indigo-500"
                        />
                        <KanbanColumn
                            status="completed"
                            tasks={completedTasks}
                            title="✅ Completed"
                            color="from-green-500 to-emerald-500"
                        />
                    </div>

                    <DragOverlay>
                        {activeId ? (
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-4 opacity-90 rotate-3">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">Dragging...</p>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {/* Back to Dashboard Link */}
                <div className="mt-8 text-center">
                    <a
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
