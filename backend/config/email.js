import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
    // For development: use Ethereal Email (fake SMTP service)
    // For production: use Gmail, SendGrid, AWS SES, etc.

    if (process.env.NODE_ENV === 'production') {
        // Production email configuration
        return nodemailer.createTransporter({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    } else {
        // Development: Gmail configuration (requires app password)
        // Or use Ethereal for testing
        return nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASSWORD || 'your-app-password',
            },
        });
    }
};

export default createTransporter;
