const express = require("express");
const app = express();

const path = require("path");

require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

app.use(express.static("public"));

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/projects", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "my_work.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.post("/", async(req, res) => {
    const data = req.body;
    const mailOptions = {
        from: data.email,
        to: "danielgiustiniperez@gmail.com",
        subject: `Message from ${data.name}: ${data.subject}`,
        text: data.message + `Email Address: ${data.email}`
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json({ status: "error" });
        } else {
            res.json({ status: "success" });
        };
    });
});

app.use((req, res) => {
    res.redirect("/");
});

app.listen(8080, () => {
    console.log("Port 8080: Open");
});