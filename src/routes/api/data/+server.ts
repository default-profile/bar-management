import XLSX from 'xlsx';
import JSZip from 'jszip';
import { auth } from '$lib/server/auth';
import prisma from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import { toCompleteCounterStock } from '$lib/utils';

export async function GET({ request }: RequestEvent) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return Response.json({ message: 'Unauthorized' }, { status: 401 });
	if (session.user.role !== 'admin') Response.json({ message: 'Forbidden' }, { status: 403 });

	const counterStocks = await prisma.counterStock.findMany();
	const completeCounterStocks = counterStocks.map(toCompleteCounterStock);

	const zip = new JSZip();
	// Note: `Map.groupBy(completeCounterStocks, ({ date }) => date)` is not working
	for (const [date, dateGroup] of Map.groupBy(completeCounterStocks, ({ date }) => date.toISOString().split('T')[0])) {
		const workbook = XLSX.utils.book_new();
		for (const [quantity, quantityGroup] of Map.groupBy(dateGroup, ({ quantity }) => quantity)) {
			const data =
				quantity < 750
					? quantityGroup.map((stock) => ({
							Name: stock.name,
							'O.B': stock.ob,
							Received: stock.received,
							Total: stock.total,
							'C.B': stock.cb,
							Sell: stock.sell,
							Amount: stock.amount,
						}))
					: quantityGroup.map((stock) => ({
							Name: stock.name,
							'O.B (Bottle)': stock.ob,
							'O.B (Pack)': stock.obPack,
							Received: stock.received,
							'Total (Bottle)': stock.total,
							'Total (Pack)': stock.totalPack,
							'C.B (Bottle)': stock.cb,
							'C.B (Pack)': stock.cbPack,
							'Sell (Bottle)': stock.sell,
							'Sell (Pack)': stock.sellPack,
							Amount: stock.amount,
						}));

			const worksheet = XLSX.utils.json_to_sheet(data);
			XLSX.utils.book_append_sheet(workbook, worksheet, quantity + 'ML');
		}

		const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
		zip.file(`${date}.xlsx`, buffer);
	}

	const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
	return new Response(zipBuffer, {
		headers: {
			'Content-Type': 'application/zip',
			'Content-Disposition': 'attachment; filename="data.zip"',
		},
	});
}
