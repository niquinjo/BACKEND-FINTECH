import prismaClient from '../../prisma';

interface ListTransactionsByCategoryProps {
  category_id: string;
  user_id: string;
}

class ListTransactionsByCategoryService {
  async execute({ category_id, user_id, }: ListTransactionsByCategoryProps) {

    const transactions = await prismaClient.transaction.findMany({
      where: {
        category_id,
        user_id: user_id,
        disable: false
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
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return transactions;
  }
}

export { ListTransactionsByCategoryService };
