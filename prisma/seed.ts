import { type CounterStock, PrismaClient } from '@prisma/client';
import products from './products.json';

const prisma = new PrismaClient();

const savedProducts = await prisma.product.createManyAndReturn({ data: products });

const counterStocks = savedProducts.map<Omit<CounterStock, 'id'>>((product) => ({
	productId: product.id,
	name: product.name,
	quantity: product.quantity,
	price: product.price,
	date: new Date(),
	received: 0,
	ob: 0,
	cb: 0,
}));

await prisma.counterStock.createMany({ data: counterStocks });
