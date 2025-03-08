import { auth } from '$lib/server/auth';
import prisma from '$lib/server/prisma';
import type { Actions } from './$types';

export const ssr = false;

export const actions: Actions = {
	addProduct: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return Response.json({ message: 'Unauthorized' }, { status: 401 });
		if (session.user.role !== 'admin') Response.json({ message: 'Forbidden' }, { status: 403 });

		const formData = await request.formData();
		const name = formData.get('name');
		const price = formData.get('price');
		const quantity = formData.get('quantity');

		await prisma.product.create({
			data: {
				name: String(name),
				price: Number(price),
				quantity: Number(quantity),
			},
		});
		return { success: true };
	},
};
