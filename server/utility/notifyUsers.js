const nodemailer = require("nodemailer");

const notifyUsers = async (recipients, document) => {
  try {
    // Log recipients for debugging
    console.log("Recipients:", recipients);

    recipients.forEach((recipient) => {
      if (!recipient.userId) {
        console.warn(`Invalid recipient without userId:`, recipient);
      } else {
        console.log(
          `In-app notification sent to user ${recipient.userId} for document ${document._id}`
        );
      }
    });

    // Send email notifications
    await sendEmailNotifications(recipients, document);
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

const sendEmailNotifications = async (recipients, document) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mrayush2000@gmail.com",
      pass: "qmye dlnj jpkj vatv", // Replace with your App Password
    },
  });

  for (const recipient of recipients) {
    if (!recipient.email) {
      console.warn(`Recipient ${recipient.userId} has no email.`);
      continue; // Skip invalid recipients
    }

    const mailOptions = {
      from: "mrayush2000@gmail.com",
      to: recipient.email,
      subject: `New Document: ${document.title}`,
      text: `Hello,\n\nYou have received a new document titled "${document.title}". Please review and acknowledge it by the due date.\n\nThanks,\nYour HR Team`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email notification sent to ${recipient.email}`);
    } catch (error) {
      console.error(
        `Error sending email to ${recipient.email}:`,
        error.message
      );
    }
  }
};

module.exports = notifyUsers;
