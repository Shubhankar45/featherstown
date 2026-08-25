import Subscriber from "../models/Subscriber.js";
import nodemailer from "nodemailer";

export const addSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await Subscriber.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Already subscribed" });

    const sub = new Subscriber({ email });
    await sub.save();

    // OPTIONAL EMAIL SEND
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to FeatherTown 🐦",
      text: "Thanks for subscribing!",
    });

    res.status(201).json({ msg: "Subscribed successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};