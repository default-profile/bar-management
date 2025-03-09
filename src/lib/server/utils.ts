import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: env.PRIVATE_NODEMAILER_GMAIL,
		pass: env.PRIVATE_NODEMAILER_PASSWORD,
	},
});

export function sendOtp(email: string, otp: string) {
	const mailOptions = {
		from: env.PRIVATE_NODEMAILER_GMAIL,
		to: email,
		subject: 'OTP for bar management',
		text: `Your otp is ${otp}`,
	};

	return transporter.sendMail(mailOptions);
}
