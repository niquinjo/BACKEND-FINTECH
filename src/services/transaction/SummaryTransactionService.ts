import prismaClient from "../../prisma";

interface SummaryProps {
  user_id: string;
  startDate?: string;
  endDate?: string;
  month?: string;
  year?: string;
}

class SummaryTransactionService {
  async execute({ user_id, startDate, endDate, month, year }: SummaryProps) {
    let finalStartDate = startDate ? new Date(startDate) : undefined;
    let finalEndDate = endDate ? new Date(endDate) : undefined;


    if (month && year) {
      const numMonth = Number(month);
      const numYear = Number(year);

      // Primeiro segundo do mês
      finalStartDate = new Date(numYear, numMonth - 1, 1, 0, 0, 0, 0);

      // Último segundo do mês
      finalEndDate = new Date(numYear, numMonth, 0, 23, 59, 59, 999);
    }

    if (finalEndDate) {
      finalEndDate.setHours(23, 59, 59, 999);
    }

    const dateFilter = finalStartDate && finalEndDate ? {
      gte: finalStartDate,
      lte: finalEndDate
    } : undefined;


    const somatorioEntradas = await prismaClient.transaction.aggregate({
      where: {
        user_id,
        type: "ENTRADA",
        disable: false,
        date: dateFilter
      },
      _sum: {
        value: true
      }
    });


    const somatorioSaidas = await prismaClient.transaction.aggregate({
      where: {
        user_id,
        type: "SAIDA",
        disable: false,
        date: dateFilter
      },
      _sum: {
        value: true
      }
    });

    console.log({
      month,
      year,
      finalStartDate,
      finalEndDate,
    });
    const entradas = somatorioEntradas._sum.value || 0;
    const saidas = somatorioSaidas._sum.value || 0;
    const saldo = entradas - saidas;

    return {
      entradas,
      saidas,
      saldo
    };
  }
}

export { SummaryTransactionService };