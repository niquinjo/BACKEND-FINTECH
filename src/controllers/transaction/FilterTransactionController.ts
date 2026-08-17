import { Request, Response } from "express";
import { FilterTransactionService } from "../../services/transaction/FilterTransactionService"; // Ajuste o caminho se precisar

/*
  ROTA PARA BUSCAR TRANSAÇÕES COM FILTRO DE DATA
  > PRECISO TER A DATA (month e year via query params)
  > PRECISO TER O ID DO USER (pegando do token via req.user_id)
*/

class FilterTransactionController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id;
    
    // Pegando os dados da URL (ex: /transactions/filter?month=8&year=2026)
    const month = req.query.month as string;
    const year = req.query.year as string;

    // 1. Validação básica de entrada
    if (!month || !year) {
      return res.status(400).json({ error: "Parâmetros 'month' e 'year' são obrigatórios!" });
    }

    // 2. Instancia o Service
    const filterTransaction = new FilterTransactionService();

    // 3. Executa o Service
    // Precisamos converter month e year para Number, pois do req.query eles vêm como String
    const transactions = await filterTransaction.execute({
      user_id,
      month: Number(month),
      year: Number(year)
    });

    // 4. Retorna o resultado para o frontend
    return res.json(transactions);
  }
}

export { FilterTransactionController };