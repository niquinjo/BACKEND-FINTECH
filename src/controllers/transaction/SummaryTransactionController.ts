import { Request, Response } from 'express';
import { SummaryTransactionService } from '../../services/transaction/SummaryTransactionService';

class SummaryTransactionController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id;

    const month = req.query.month as string;
    const year = req.query.year as string;

    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    const summaryService = new SummaryTransactionService();
    const summary = await summaryService.execute({
      user_id, startDate, endDate, month, year
    });

    return res.json(summary);
  }
}

export { SummaryTransactionController };
