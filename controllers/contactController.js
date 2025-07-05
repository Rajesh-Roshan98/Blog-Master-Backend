const Contact = require('../model/contactModel');
const sendContactEmail = require('../utils/sendContact');

const createContact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    await sendContactEmail(name, email, message); // <-- Sends Email

    res.status(201).json({
      message: 'Contact message submitted successfully & email sent.',
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      error: error.message || 'Server error',
    });
  }
};

module.exports = { createContact };
