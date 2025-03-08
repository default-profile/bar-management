import { type Prisma, PrismaClient } from '@prisma/client';
import { auth } from '../src/lib/server/auth';
import products from './products.json';

const prisma = new PrismaClient();

const savedProducts = await prisma.product.createManyAndReturn({ data: products });

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

await prisma.counterStock.createMany({ data: counterStocks });
const session = await auth.api.signUpEmail({
	body: {
		name: 'Default',
		email: 'defaultprofile.dp@gmail.com',
		password: 'Default@12345',
	},
});

if (session) await prisma.user.update({ where: { id: session.user.id }, data: { role: 'admin' } });
else console.log('Failed to create admin account');

await auth.api.signUpEmail({
	body: {
		name: 'Demo',
		email: 'demo@gmail.com',
		password: 'Demo@12345',
	},
});
