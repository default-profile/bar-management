import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: env.PRIVATE_NODEMAILER_GMAIL,
		pass: env.PRIVATE_NODEMAILER_PASSWORD,
	},
});

export async function sendOtp(email: string, otp: string) {
	const mailOptions = {
		from: env.PRIVATE_NODEMAILER_GMAIL,
		to: email,
		subject: 'OTP for bar management',
		text: `Your otp is ${otp}`,
	};

	return new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) reject(error);
			else resolve(info);
		});
	});
}
