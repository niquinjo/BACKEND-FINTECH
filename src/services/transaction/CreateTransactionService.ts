import { TransactionType } from "../../generated/prisma";
import prismaClient from "../../prisma/index";

interface CreateTransactionProps {
  name: string;
  value: number;
  description: string;
  category_id: string;
  type: TransactionType;
  user_id: string;
  date: string;
}

class CreateTransactionService {
  async execute({ name, value, description, category_id, type, user_id, date }: CreateTransactionProps) {


    const categoryExists = await prismaClient.category.findFirst({
      where: {
        id: category_id,
        user_id: user_id // Se o ID for de outro usuário, o prisma não vai achar nada!
      }
    })

    if (!categoryExists) {
      throw new Error("Categoria não encontrada");
    }

    const transaction = await prismaClient.transaction.create({
      data: {
        name: name,
        value: value,
        description: description,
        category_id: category_id,
        type: type,
        user_id: user_id,
        date: new Date(date)
      },
      select: {
        id: true,
        name: true,
        value: true,
        description: true,
        category_id: true,
        type: true,
        createdAt: true,
      }
    })

    return transaction;
  }
}

export { CreateTransactionService };