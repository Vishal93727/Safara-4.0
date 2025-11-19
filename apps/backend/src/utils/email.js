// ===================================
// src/utils/email.js
// ===================================

import nodemailer from 'nodemailer';
import { logger } from './logger.js';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const templates = {
  'registration-confirmation': (data) => ({
    subject: 'Registration Confirmation - SentinelView Authority',
    html: `
      <h2>Registration Confirmation</h2>
      <p>Dear ${data.name},</p>
      <p>Thank you for registering with SentinelView Authority System.</p>
      <p><strong>Request ID:</strong> ${data.requestId}</p>
      <p><strong>Estimated Processing Time:</strong> ${data.estimatedProcessingTime}</p>
      <p>You will receive an email notification once your application is reviewed.</p>
      <br>
      <p>Best regards,<br>SentinelView Authority Team</p>
    `
  }),
  
  'account-approved': (data) => ({
    subject: 'Account Approved - SentinelView Authority',
    html: `
      <h2>Account Approved!</h2>
      <p>Dear ${data.name},</p>
      <p>Congratulations! Your account has been approved.</p>
      <p><strong>Username:</strong> ${data.username}</p>
      <p><strong>Role:</strong> ${data.role}</p>
      <p>You can now login to the system using your credentials.</p>
      <br>
      <p>Best regards,<br>SentinelView Authority Team</p>
    `
  }),
  
  'account-rejected': (data) => ({
    subject: 'Account Registration Update - SentinelView Authority',
    html: `
      <h2>Registration Update</h2>
      <p>Dear ${data.name},</p>
      <p>We regret to inform you that your registration application has been declined.</p>
      <p><strong>Reason:</strong> ${data.reason}</p>
      <p>If you have any questions, please contact our support team.</p>
      <br>
      <p>Best regards,<br>SentinelView Authority Team</p>
    `
  }),
  
  'password-reset': (data) => ({
    subject: 'Password Reset Request - SentinelView Authority',
    html: `
      <h2>Password Reset Request</h2>
      <p>Dear ${data.name},</p>
      <p>You have requested to reset your password. Click the link below to reset:</p>
      <p><a href="${data.resetURL}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>SentinelView Authority Team</p>
    `
  })
};

export const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    let emailContent = {};
    
    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else {
      emailContent = { subject, html, text };
    }

    const mailOptions = {
      from: `"SentinelView Authority" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject || subject,
      html: emailContent.html || html,
      text: emailContent.text || text
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}: ${info.messageId}`);
    return info;

  } catch (error) {
    logger.error('Email sending failed:', error);
    throw error;
  }
};