// import nodemailer from "nodemailer";

// type EmailOptions = {
//     to: string;
//     subject: string;
//     text?: string;
//     html?: string;
// };

// export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.EMAIL,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });

//         const info = await transporter.sendMail({
//             from: `"HRMS App" <${process.env.EMAIL}>`,
//             to,
//             subject,
//             text,
//             html,
//         });

//         return info;
//     } catch (error) {
//         console.log("Email error:", error);
//         throw new Error("Email not sent");
//     }
// };

import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }: any) => {
    try {
        const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        const info = await transporter.sendMail({
            from: '"HRMS App" <no-reply@hrms.com>',
            to,
            subject,
            text,
            html,
        });

        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

        return info;
    } catch (error) {
        console.log("Email error:", error);
        throw new Error("Email not sent");
    }
};