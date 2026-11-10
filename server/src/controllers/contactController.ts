import { Request, Response } from 'express';
import { ContactInquiry } from '../models/ContactInquiry.js';

export const submitInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, category, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({ message: 'Name, email, subject, and message are required.' });
      return;
    }

    const inquiry = await ContactInquiry.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      category: category || 'General Inquiry',
      message: message.trim(),
      status: 'new',
    });

    res.status(201).json({
      message: 'Thank you for reaching out. Your inquiry has been received and logged.',
      inquiry,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to submit contact inquiry.' });
  }
};
