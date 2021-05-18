const express = require("express");
const app = express();

require("dotenv").config();

const path = require("path");

const nodemailer = require("nodemailer");

const Joi = require("joi");

app.use(express.static("public"));

app.use(express.json());

app.get("/", (req, res) => {
    process.kill(process.pid, 'SIGTERM');
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/projects", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "projects.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.post("/", (req, res) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const data = req.body;
    console.log(data);
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        subject: Joi.string().required(),
        message: Joi.string().required()
    });
    const validatedData = schema.validate(data);
    console.log(validatedData);
    if (validatedData.error) {
        return res.json({ status: "error" });
    } else {
        const mailOptions = {
            from: data.email,
            to: process.env.EMAIL,
            subject: `${data.name}: ${data.subject}`,
            text: data.message + `\n\nEmail Address: ${data.email}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.json({ status: "error" });
            } else {
                return res.json({ status: "success" });
            }
        })
    }
    process.kill(process.pid, 'SIGTERM');
});

app.use((req, res) => {
    res.redirect("/");
    process.kill(process.pid, 'SIGTERM');
});

app.listen(8080, () => {
    console.log("Port 8080: Open");
});