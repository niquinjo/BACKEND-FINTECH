// src/controllers/ai.controller.ts
import { Request, Response } from "express";
import { AiService } from "../../services/ia/AiService";
import { ListTransactionService } from "../../services/transaction/ListTransactionService";
import { SummaryTransactionService } from "../../services/transaction/SummaryTransactionService";

export class AiController {
  private aiService = new AiService(); // Instancia direto aqui


  // Transformando em Arrow Function (`= async (...) =>`)

  handle = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id;
      const { message } = req.body;
      const disableParam = req.query.disable;

      const disable = disableParam === 'true' ? true : disableParam === 'false' ? false : false;

      const listTransactionService = new ListTransactionService();
      const transactions = await listTransactionService.execute(user_id, disable);

      const summaryTransactionService = new SummaryTransactionService();
      const summary = await summaryTransactionService.execute({ user_id });

      const answer = await this.aiService.fetchAgentAnalysis(message, transactions, summary);


      //e aqui retornamos a resposta do agente de IA para o front-end
      return res.status(200).json({ success: true, answer });

    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
