import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure email transporter (example using Gmail)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendRegistrationConfirmation(email: string, firstName: string, requestId: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Registration Request Received - SentinelView',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Registration Request Received</h2>
          <p>Dear ${firstName},</p>
          <p>Your registration request has been successfully submitted to the SentinelView system.</p>
          <p><strong>Request ID:</strong> ${requestId}</p>
          <p>Your request is currently under review by our administration team. You will receive a notification once your account has been approved.</p>
          <p><strong>Estimated Processing Time:</strong> 3-5 business days</p>
          <p>If you have any questions, please contact your department administrator.</p>
          <br>
          <p>Best regards,<br>SentinelView Team</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✉️  Registration email sent to ${email}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      // Don't throw error - registration should succeed even if email fails
    }
  }

  async sendAccountApproval(email: string, firstName: string, username: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Account Approved - SentinelView',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Account Approved!</h2>
          <p>Dear ${firstName},</p>
          <p>Congratulations! Your SentinelView account has been approved.</p>
          <p><strong>Username:</strong> ${username}</p>
          <p>You can now log in to the system using your credentials.</p>
          <a href="http://localhost:5173/login" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Login Now</a>
          <br><br>
          <p>Best regards,<br>SentinelView Team</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✉️  Approval email sent to ${email}`);
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  }

  async sendAccountRejection(email: string, firstName: string, reason?: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Account Registration Update - SentinelView',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Registration Status Update</h2>
          <p>Dear ${firstName},</p>
          <p>We regret to inform you that your registration request has not been approved at this time.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>If you believe this is an error or would like to reapply, please contact your department administrator.</p>
          <br>
          <p>Best regards,<br>SentinelView Team</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✉️  Rejection email sent to ${email}`);
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  }

  async sendPasswordReset(email: string, firstName: string, resetToken: string): Promise<void> {
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - SentinelView',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Dear ${firstName},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
          <p style="margin-top: 20px;">This link will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <br>
          <p>Best regards,<br>SentinelView Team</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✉️  Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  }
}

export const emailService = new EmailService();