import express from 'express';
import {
    exportTasksToCSV,
    exportTasksToJSON,
    exportTasksToPDF,
    getTaskReport,
} from '../controllers/exportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

/**
 * @swagger
 * /api/export/tasks/csv:
 *   get:
 *     summary: Export tasks to CSV
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/tasks/csv', exportTasksToCSV);

/**
 * @swagger
 * /api/export/tasks/json:
 *   get:
 *     summary: Export tasks to JSON
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: JSON file download
 */
router.get('/tasks/json', exportTasksToJSON);

/**
 * @swagger
 * /api/export/tasks/pdf:
 *   get:
 *     summary: Export tasks to PDF
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF file download
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/tasks/pdf', exportTasksToPDF);

/**
 * @swagger
 * /api/export/report:
 *   get:
 *     summary: Get task analytics report
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics report
 */
router.get('/report', getTaskReport);

export default router;
