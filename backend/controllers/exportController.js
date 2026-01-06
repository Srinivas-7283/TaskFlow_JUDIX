import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';
import Task from '../models/Task.js';

// @desc    Export tasks to CSV
// @route   GET /api/export/tasks/csv
// @access  Private
export const exportTasksToCSV = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

        const fields = ['title', 'description', 'status', 'priority', 'createdAt', 'updatedAt'];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(tasks);

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=tasks.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export CSV error:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting tasks to CSV',
            error: error.message,
        });
    }
};

// @desc    Export tasks to JSON
// @route   GET /api/export/tasks/json
// @access  Private
export const exportTasksToJSON = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.header('Content-Type', 'application/json');
        res.header('Content-Disposition', 'attachment; filename=tasks.json');
        res.json({
            exportDate: new Date().toISOString(),
            totalTasks: tasks.length,
            tasks: tasks,
        });
    } catch (error) {
        console.error('Export JSON error:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting tasks to JSON',
            error: error.message,
        });
    }
};

// @desc    Export tasks to PDF
// @route   GET /api/export/tasks/pdf
// @access  Private
export const exportTasksToPDF = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

        // Create PDF document
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers
        res.header('Content-Type', 'application/pdf');
        res.header('Content-Disposition', 'attachment; filename=tasks.pdf');

        // Pipe PDF to response
        doc.pipe(res);

        // Add title
        doc.fontSize(24).font('Helvetica-Bold').text('TaskFlow - My Tasks', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        // Add summary
        const stats = {
            total: tasks.length,
            pending: tasks.filter((t) => t.status === 'pending').length,
            inProgress: tasks.filter((t) => t.status === 'in-progress').length,
            completed: tasks.filter((t) => t.status === 'completed').length,
        };

        doc.fontSize(14).font('Helvetica-Bold').text('Summary');
        doc.fontSize(10).font('Helvetica');
        doc.text(`Total Tasks: ${stats.total}`);
        doc.text(`Pending: ${stats.pending}`);
        doc.text(`In Progress: ${stats.inProgress}`);
        doc.text(`Completed: ${stats.completed}`);
        doc.moveDown(2);

        // Add tasks
        doc.fontSize(14).font('Helvetica-Bold').text('Tasks');
        doc.moveDown();

        tasks.forEach((task, index) => {
            if (doc.y > 700) {
                doc.addPage();
            }

            doc.fontSize(12).font('Helvetica-Bold').text(`${index + 1}. ${task.title}`);
            doc.fontSize(10).font('Helvetica');

            if (task.description) {
                doc.text(`Description: ${task.description}`);
            }

            doc.text(`Status: ${task.status.toUpperCase()}`);
            doc.text(`Priority: ${task.priority.toUpperCase()}`);
            doc.text(`Created: ${new Date(task.createdAt).toLocaleDateString()}`);
            doc.moveDown();
        });

        // Finalize PDF
        doc.end();
    } catch (error) {
        console.error('Export PDF error:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting tasks to PDF',
            error: error.message,
        });
    }
};

// @desc    Get task analytics report
// @route   GET /api/export/report
// @access  Private
export const getTaskReport = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });

        const report = {
            totalTasks: tasks.length,
            byStatus: {
                pending: tasks.filter((t) => t.status === 'pending').length,
                inProgress: tasks.filter((t) => t.status === 'in-progress').length,
                completed: tasks.filter((t) => t.status === 'completed').length,
            },
            byPriority: {
                low: tasks.filter((t) => t.priority === 'low').length,
                medium: tasks.filter((t) => t.priority === 'medium').length,
                high: tasks.filter((t) => t.priority === 'high').length,
            },
            completionRate: tasks.length > 0
                ? ((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100).toFixed(2)
                : 0,
            recentTasks: tasks.slice(0, 5).map((t) => ({
                title: t.title,
                status: t.status,
                priority: t.priority,
                createdAt: t.createdAt,
            })),
        };

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating report',
            error: error.message,
        });
    }
};
