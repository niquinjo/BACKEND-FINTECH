import prismaClient from '../../prisma';

class ListTransactionService {
  async execute(user_id: string, disable: boolean) {
    const transactions = await prismaClient.transaction.findMany({
      where: {
        user_id,
        disable
      },
      select: {
        id: true,
        name: true,
        value: true,
        description: true,
        type: true,
        disable: true,
        category_id: true,
        createdAt: true,
        updatedAt: true,
        category: {
        select: {
          name: true
        }
      },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return transactions;
  }
}

export { ListTransactionService };
