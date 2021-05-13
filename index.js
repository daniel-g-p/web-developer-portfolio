const express = require("express");
const app = express();

const path = require("path");

const nodemailer = require("nodemailer");

const Joi = require("joi");

app.use(express.static("public"));

app.use(express.json());

app.get("/", (req, res) => {
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
            user: "danielgiustiniperez@gmail.com",
            pass: "WebDeveloperBootcamp2021"
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
        res.json({ status: "error" });
        console.log("Failed at input validation");
    } else {
        const mailOptions = {
            from: data.email,
            to: "danielgiustiniperez@gmail.com",
            subject: `${data.name}: ${data.subject}`,
            text: data.message + `\n\nEmail Address: ${data.email}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                console.log("Failed at email sending");
                res.json({ status: "error" });
            } else {
                res.json({ status: "success" });
            }
        })
    }
});

app.use((req, res) => {
    res.redirect("/");
});

app.listen(8080, () => {
    console.log("Port 8080: Open");
});