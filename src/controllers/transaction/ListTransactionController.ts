import { Request, Response } from 'express';
import { ListTransactionService } from '../../services/transaction/ListTransactionService';

class ListTransactionController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id;
    const disableParam = req.query.disable;

    const disable = disableParam === 'true' ? true : disableParam === 'false' ? false : false;

    const listTransactionService = new ListTransactionService();
    const transactions = await listTransactionService.execute(user_id, disable);

    return res.json(transactions);
  }
}

export { ListTransactionController };
