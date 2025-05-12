// controllers/contactController.js
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// GET all contact messages
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact messages', error });
  }
};

// GET a single contact message by ID
exports.getContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact message', error });
  }
};

exports.replyToContact = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Message not found' });
    }

    contact.reply = reply;
    await contact.save();

    // Send email (dummy example, set up a real mail server)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: contact.email,
      subject: `Reply to your message: ${contact.title}`,
      text: reply,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json({ message: 'Reply sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send reply' });
  }
};

// POST a new contact message
exports.addContact = async (req, res) => {
  const { name, email, title,phone, message } = req.body;

  try {
    const newContact = new Contact({
      name,
      email,
      title,
      phone,
      message,
    });

    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: 'Error adding contact message', error });
  }
};

// PUT (update) a contact message by ID
exports.updateContact = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const contact = await Contact.findByIdAndUpdate(id, updates, { new: true });
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(400).json({ message: 'Error updating contact message', error });
  }
};

// DELETE a contact message by ID
exports.deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.status(200).json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact message', error });
  }
};
