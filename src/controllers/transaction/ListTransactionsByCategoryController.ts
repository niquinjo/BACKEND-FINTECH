import { Request, Response } from 'express';
import { ListTransactionsByCategoryService } from '../../services/transaction/ListTransactionsByCategoryService';

class ListTransactionsByCategoryController {
  async handle(req: Request, res: Response) {
    const category_id = req.query.category_id as string;
    const user_id = req.user_id;

    const listTransactionsByCategoryService = new ListTransactionsByCategoryService();
    const transactions = await listTransactionsByCategoryService.execute({
      category_id: category_id as string,
      user_id: user_id as string,
    });

    return res.json(transactions);
  }
}

export { ListTransactionsByCategoryController };
