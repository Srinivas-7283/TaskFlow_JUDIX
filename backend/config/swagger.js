import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Full-Stack Application API',
            version: '1.0.0',
            description: 'RESTful API for authentication and task management with JWT security',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format: Bearer <token>',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated user ID',
                        },
                        name: {
                            type: 'string',
                            description: 'User full name',
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                            example: 'john@example.com',
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'User password (hashed in database)',
                            example: 'SecurePass123!',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Task: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated task ID',
                        },
                        title: {
                            type: 'string',
                            description: 'Task title',
                            example: 'Complete project documentation',
                        },
                        description: {
                            type: 'string',
                            description: 'Task description',
                            example: 'Write comprehensive README and API docs',
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'in-progress', 'completed'],
                            default: 'pending',
                            description: 'Task status',
                        },
                        priority: {
                            type: 'string',
                            enum: ['low', 'medium', 'high'],
                            default: 'medium',
                            description: 'Task priority level',
                        },
                        user: {
                            type: 'string',
                            description: 'User ID who owns this task',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Error message description',
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                            },
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
