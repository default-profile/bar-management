import { type Prisma, PrismaClient } from '@prisma/client';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from 'better-auth';
import products from './products.json';

console.log('Initializing database...');
const prisma = new PrismaClient();

console.log('Initializing auth...');
export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
});

console.log('Getting products...');
const savedProducts = await prisma.product.createManyAndReturn({ data: products });

console.log('Creating counter stocks...');
const counterStocks = savedProducts.map<Prisma.CounterStockUncheckedCreateInput>((product) => ({
	productId: product.id,
	name: product.name,
	quantity: product.quantity,
	price: product.price,
	pricePack: product.pricePack,
	date: new Date(),
	received: 0,
	ob: 0,
	cb: 0,
}));

console.log('Saving counter stocks to database...');
await prisma.counterStock.createMany({ data: counterStocks });

console.log('Creating admin account...');
const session = await auth.api.signUpEmail({
	body: {
		name: 'Default',
		email: 'defaultprofile.dp@gmail.com',
		password: generatePassword(8),
	},
});

if (session) await prisma.user.update({ where: { id: session.user.id }, data: { role: 'admin' } });
else console.log('Failed to create admin account');

console.log('Creating user account...');
await auth.api.signUpEmail({
	body: {
		name: 'Demo',
		email: 'demo@gmail.com',
		password: generatePassword(8),
	},
});

console.log('Done!');
function generatePassword(length: number) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
	let password = '';
	for (let i = 0; i < length; i++) {
		password += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return password;
}
