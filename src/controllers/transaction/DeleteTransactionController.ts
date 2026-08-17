import { Request, Response } from "express";
import { DeleteTransactionService } from "../../services/transaction/DeleteTransactionService";


class DeleteTransactionController {
  async handle(req: Request, res: Response) {
    const transaction_id = req.query?.transaction_id as string;
    const user_id = req.user_id;

    const deleteTransaction = new DeleteTransactionService()

    const transaction = await deleteTransaction.execute({
      transaction_id: transaction_id,
      user_id
    });

    res.status(200).json(transaction)

  }
}

export { DeleteTransactionController }