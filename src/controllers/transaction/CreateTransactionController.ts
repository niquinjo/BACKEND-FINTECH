import { Request, Response } from "express";
import { CreateTransactionService } from "../../services/transaction/CreateTransactionService";

class CreateTransactionController {
  async handle(req: Request, res: Response) {

    const { name, value, description, category_id, type, date } = req.body;
    const user_id = req.user_id;

    const createTransaction = new CreateTransactionService();

    const transaction = await createTransaction.execute({
      name,
      value,
      description,
      category_id,
      type,
      user_id,
      date
    });

    res.json(transaction)

  }
}

export { CreateTransactionController }