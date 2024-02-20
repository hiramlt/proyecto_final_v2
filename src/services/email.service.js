import nodemailer from 'nodemailer';
import config from '../config/config.js';
import { createPasswRecoveryToken } from '../utils.js';

export default class EmailService {
    static #transport = nodemailer.createTransport({
        service: config.email_data.service,
        port: config.email_data.port,
        auth: {
            user: config.email_data.user,
            pass: config.email_data.password,
        }
    });

    static sendEmail(to, subject, html, attachments=[]) {
        return this.#transport.sendMail({
            from: config.email_data.user,
            to,
            subject,
            html,
            attachments
        })
    }

    static sendPasswordRecovery(user) {
        const token = createPasswRecoveryToken(user)

        const subject = 'Recuperación de contraseña'
        const link = `http://localhost:8080/set-password/${token}`
        const btn_style = 'background-color: #5E4EE1; color: white; padding: 0.5em; border-radius: 0.45em;'
        const html = `<div> 
        <h1> Hola ${user.name}, ¿olvidaste tu contraseña? </h1>
        <p> Haz click en el siguiente boton para cambiar tu contraseña </p>
        <a href="${link}"> <button style="${btn_style}"> Cambiar contraseña </button> </a>
        </div>`
        return this.sendEmail(user.email, subject, html)
    }
}