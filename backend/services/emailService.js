import createTransporter from '../config/email.js';

// Send welcome email
export const sendWelcomeEmail = async (user) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Welcome to TaskFlow! 🎉',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to TaskFlow!</h1>
            </div>
            <div class="content">
              <h2>Hi ${user.name},</h2>
              <p>Thank you for joining TaskFlow! We're excited to have you on board.</p>
              <p>With TaskFlow, you can:</p>
              <ul>
                <li>✅ Create and manage tasks efficiently</li>
                <li>📊 Track your progress with visual dashboards</li>
                <li>🔍 Search and filter tasks easily</li>
                <li>📱 Access from any device</li>
              </ul>
              <p>Get started by creating your first task!</p>
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Happy task managing!</p>
              <p><strong>The TaskFlow Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2026 TaskFlow. All rights reserved.</p>
              <p>You received this email because you signed up for TaskFlow.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

// Send task reminder email
export const sendTaskReminderEmail = async (user, task) => {
    try {
        const transporter = createTransporter();

        const priorityColors = {
            low: '#64748b',
            medium: '#f59e0b',
            high: '#ef4444',
        };

        const mailOptions = {
            from: `"TaskFlow Reminders" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `⏰ Reminder: ${task.title}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .task-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${priorityColors[task.priority]}; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            .priority-${task.priority} { background: ${priorityColors[task.priority]}; color: white; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>⏰ Task Reminder</h2>
            </div>
            <div class="content">
              <p>Hi ${user.name},</p>
              <p>This is a reminder about your task:</p>
              <div class="task-card">
                <h3>${task.title}</h3>
                ${task.description ? `<p>${task.description}</p>` : ''}
                <p>
                  <span class="badge priority-${task.priority}">${task.priority.toUpperCase()} Priority</span>
                  <span class="badge">${task.status}</span>
                </p>
              </div>
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">View Task</a>
              <p>Keep up the great work!</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Task reminder email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending task reminder email:', error);
        return { success: false, error: error.message };
    }
};

// Send task completion email
export const sendTaskCompletionEmail = async (user, task) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `🎉 Task Completed: ${task.title}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .celebration { font-size: 48px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Congratulations! 🎉</h1>
            </div>
            <div class="content">
              <div class="celebration">🎊 ✨ 🎉</div>
              <h2>Hi ${user.name},</h2>
              <p>Great job! You've completed your task:</p>
              <h3>${task.title}</h3>
              ${task.description ? `<p><em>${task.description}</em></p>` : ''}
              <p>Keep up the excellent work! Every completed task brings you closer to your goals.</p>
              <p><strong>The TaskFlow Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Task completion email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending task completion email:', error);
        return { success: false, error: error.message };
    }
};

// Test email configuration
export const sendTestEmail = async (email) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'TaskFlow - Email Configuration Test',
            html: `
        <h2>Email Configuration Test</h2>
        <p>If you're reading this, your email configuration is working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Test email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending test email:', error);
        return { success: false, error: error.message };
    }
};
