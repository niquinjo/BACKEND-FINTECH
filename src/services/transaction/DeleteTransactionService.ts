import prismaClient from "../../prisma/index";

interface TransactionProps {
  transaction_id: string;
  user_id: string;
}

class DeleteTransactionService {

  async execute({ transaction_id, user_id }: TransactionProps) {

    const transactionExists = await prismaClient.transaction.findFirst({
      where: {
        id: transaction_id,
        user_id: user_id
      }
    });

    if (!transactionExists) {
      throw new Error("Transação não encontrada ou você não tem permissão para excluí-la.");
    }

    try {
      // 2. Só então fazemos o Soft Delete
      await prismaClient.transaction.update({
        where: {
          id: transaction_id
        },
        data: {
          disable: true,
        }
      });

      return { message: "Transação desativada com sucesso!" };

    } catch (err) {
      throw new Error("Erro ao desativar a transação: ");
    }


  }

}

export { DeleteTransactionService };