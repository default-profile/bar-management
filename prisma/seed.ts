import { type CounterProduct, PrismaClient } from '@prisma/client';
import products from './products.json';

const prisma = new PrismaClient();

const savedProducts = await prisma.product.createManyAndReturn({ data: products });

const counterStocks = savedProducts.map<Omit<CounterProduct, 'id'>>((product) => ({
	productId: product.id,
	name: product.name,
	quantity: product.quantity,
	price: product.price,
	date: new Date(),
	ob: 0,
	received: 0,
	total: 0,
	cb: 0,
	sell: 0,
	amount: 0,
}));

await prisma.counterProduct.createMany({ data: counterStocks });
