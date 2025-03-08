import { auth } from '$lib/server/auth';
import type { Actions } from './$types';

export const ssr = false;

export const actions: Actions = {
	addUser: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return Response.json({ message: 'Unauthorized' }, { status: 401 });
		if (session.user.role !== 'admin') Response.json({ message: 'Forbidden' }, { status: 403 });

		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');

		const newSession = await auth.api.signUpEmail({
			body: { name: String(name), email: String(email), password: generatePassword(8) },
		});

		if (newSession) return { success: true };
		else return { success: false, message: 'Something went wrong' };
	},
};

function generatePassword(length: number) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
	let password = '';
	for (let i = 0; i < length; i++) {
		password += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return password;
}
