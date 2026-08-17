import prismaClient from "../../prisma/index";

interface GetMonthlyTransactionsParams {
  user_id: string;
  month: number;
  year: number;
}

class FilterTransactionService {

  async execute({ user_id, month, year }: GetMonthlyTransactionsParams) {
    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);

    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const transactions = await prismaClient.transaction.findMany({
      where: {
        user_id: user_id,
        disable: false,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc'
      }
    });

    return transactions;
  }
}

export { FilterTransactionService }