import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";

export class EnquiryController {
  /**
   * Processes solutions request submissions and emails details to harik2021a@gmail.com.
   */
  static async submitEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, phone, purpose, message, solutionTitle, productName, brand } = req.body;

      if (!name || !email) {
        res.status(400).json({ error: "Missing required contact details (name and email are required)." });
        return;
      }

      const formattedPhone = phone || "Not Provided";
      const formattedPurpose = purpose || "Product Technical Enquiry";
      const formattedSolution = productName ? `${productName} (${brand || "Equipment"})` : (solutionTitle || "General Safety Solutions");
      const formattedMessage = message || "Customer requested technical specifications and pricing for this product.";

      // Always print details to console for tracking
      console.log(`\n==================================================`);
      console.log(`[TECHNICAL ENQUIRY RECEIVED]`);
      console.log(`Customer: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Phone: ${formattedPhone}`);
      console.log(`Purpose: ${formattedPurpose}`);
      console.log(`Product/Solution: ${formattedSolution}`);
      console.log(`Message: ${formattedMessage}`);
      console.log(`==================================================\n`);

      // Check if EMAIL_USER and EMAIL_PASS are configured
      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_PASS;

      if (!emailUser || !emailPass) {
        console.warn("[SMTP Warning] EMAIL_USER or EMAIL_PASS environment variables are missing.");
        res.status(500).json({
          error: "Email delivery failed: Backend SMTP credentials (EMAIL_USER & EMAIL_PASS) are not configured in environment variables."
        });
        return;
      }

      // Setup transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const mailOptions = {
        from: `"Eastwind Technical Enquiry" <${emailUser}>`,
        to: "harik2021a@gmail.com",
        subject: `Eastwind Product Enquiry: ${formattedSolution}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <h2 style="color: #ea580c; text-align: center; text-transform: uppercase; margin-bottom: 20px;">Eastwind Technical Product Enquiry</h2>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">You have received a new technical product enquiry from the Eastwind web portal.</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 25px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #64748b; width: 140px;">Customer Name:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Email Address:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 600;"><a href="mailto:${email}" style="color: #ea580c; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Phone Number:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${formattedPhone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Target Product:</td>
                  <td style="padding: 8px 0; color: #ea580c; font-weight: bold;">${formattedSolution}</td>
                </tr>
              </table>
            </div>
            
            <div style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
              <h3 style="font-size: 13px; font-weight: bold; color: #475569; margin-bottom: 8px;">Technical Scope & Requirements:</h3>
              <p style="background-color: #f8fafc; border-left: 4px solid #ea580c; padding: 15px; margin: 0; font-size: 13px; color: #334155; line-height: 1.6; border-radius: 0 8px 8px 0; white-space: pre-wrap;">${formattedMessage}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0 20px 0;" />
            <p style="color: #94a3b8; font-size: 11px; text-align: center;">This enquiry email was generated automatically by Eastwind Energy Arabia.</p>
          </div>
        `,
      };

      // Send Mail and handle result explicitly
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[SMTP Success] Email sent to harik2021a@gmail.com (Message ID: ${info.messageId})`);
        res.json({
          success: true,
          message: "Enquiry submitted successfully and emailed to harik2021a@gmail.com."
        });
      } catch (mailError: any) {
        console.error("[SMTP Error] Failed to dispatch email:", mailError);
        res.status(500).json({
          error: `Email transmission failed: ${mailError.message || "SMTP authentication or connection error."}`
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
