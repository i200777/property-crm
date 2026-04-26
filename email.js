import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendNewLeadEmail(lead) {
  try {
    await transporter.sendMail({
      from: `"Property CRM" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🏠 New Lead: ${lead.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <h2 style="color: #1a56db;">New Lead Created</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding:8px; font-weight:bold;">Name:</td><td style="padding:8px;">${lead.name}</td></tr>
            <tr style="background:#eef2ff;"><td style="padding:8px; font-weight:bold;">Email:</td><td style="padding:8px;">${lead.email || 'N/A'}</td></tr>
            <tr><td style="padding:8px; font-weight:bold;">Phone:</td><td style="padding:8px;">${lead.phone || 'N/A'}</td></tr>
            <tr style="background:#eef2ff;"><td style="padding:8px; font-weight:bold;">Property Interest:</td><td style="padding:8px;">${lead.propertyInterest}</td></tr>
            <tr><td style="padding:8px; font-weight:bold;">Budget:</td><td style="padding:8px;">PKR ${lead.budget?.toLocaleString()}</td></tr>
            <tr style="background:#eef2ff;"><td style="padding:8px; font-weight:bold;">Priority:</td><td style="padding:8px;">${lead.score}</td></tr>
            <tr><td style="padding:8px; font-weight:bold;">Source:</td><td style="padding:8px;">${lead.source}</td></tr>
          </table>
          <p style="color: #6b7280; margin-top: 20px;">Log in to your CRM to manage this lead.</p>
        </div>
      `,
    });
  } catch (e) {
    console.error('Email error:', e.message);
  }
}

export async function sendAssignmentEmail(lead, agentEmail, agentName) {
  try {
    await transporter.sendMail({
      from: `"Property CRM" <${process.env.EMAIL_USER}>`,
      to: agentEmail,
      subject: `📋 Lead Assigned to You: ${lead.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <h2 style="color: #1a56db;">Lead Assigned to You</h2>
          <p>Hi <strong>${agentName}</strong>, a new lead has been assigned to you.</p>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding:8px; font-weight:bold;">Name:</td><td style="padding:8px;">${lead.name}</td></tr>
            <tr style="background:#eef2ff;"><td style="padding:8px; font-weight:bold;">Phone:</td><td style="padding:8px;">${lead.phone || 'N/A'}</td></tr>
            <tr><td style="padding:8px; font-weight:bold;">Property Interest:</td><td style="padding:8px;">${lead.propertyInterest}</td></tr>
            <tr style="background:#eef2ff;"><td style="padding:8px; font-weight:bold;">Budget:</td><td style="padding:8px;">PKR ${lead.budget?.toLocaleString()}</td></tr>
            <tr><td style="padding:8px; font-weight:bold;">Priority:</td><td style="padding:8px;">${lead.score}</td></tr>
          </table>
          <p style="color: #6b7280; margin-top: 20px;">Please log in to your CRM dashboard to view and manage this lead.</p>
        </div>
      `,
    });
  } catch (e) {
    console.error('Assignment email error:', e.message);
  }
}