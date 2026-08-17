export class AiService {
  async fetchAgentAnalysis(
    userMessage: string,
    transactions: any[],
    summary: any
  ) {
    try {

      // =====================================================
      // PERÍODO DOS DADOS
      // =====================================================

      const datas = transactions
        .map(t => new Date(t.date))
        .filter(d => !isNaN(d.getTime()));

      const dataMaisAntiga = datas.length
        ? new Date(Math.min(...datas.map(d => d.getTime())))
        : null;

      const dataMaisRecente = datas.length
        ? new Date(Math.max(...datas.map(d => d.getTime())))
        : null;

      const periodoDosDados =
        dataMaisAntiga && dataMaisRecente
          ? `${dataMaisAntiga.toLocaleDateString("pt-BR")} até ${dataMaisRecente.toLocaleDateString("pt-BR")}`
          : "Período não informado";

      // =====================================================
      // CONTEXTO ENVIADO PARA A IA
      // =====================================================

      const aiContext = {
        periodo_dos_dados: periodoDosDados,

        saldo: summary.saldo,
        entradas: summary.entradas,
        saidas: summary.saidas,

        saldoFormatado:
          (summary.saldo / 100).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),

        entradasFormatadas:
          (summary.entradas / 100).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),

        saidasFormatadas:
          (summary.saidas / 100).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),

        quantidadeTransacoes: transactions.length,

        ultimasTransacoes: transactions
          .slice(0, 20)
          .map(t => ({
            nome: t.name,
            valor_reais: `R$ ${(t.value / 100).toLocaleString(
              "pt-BR",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`,
            tipo: t.type,
            categoria: t.category?.name ?? "Sem categoria",
            data: t.date
              ? new Date(t.date).toLocaleDateString("pt-BR")
              : "Data não informada",
          })),
      };

      // =====================================================
      // CHAMADA PARA O FASTAPI
      // =====================================================

      const response = await fetch(
        "http://127.0.0.1:8000/analysis",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userMessage,
            summary: aiContext,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `FastAPI retornou ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();

      return data;

    } catch (error) {

      console.error(
        "Erro ao processar a análise com a IA:",
        error
      );

      throw new Error(
        "Não foi possível processar a análise com a IA no momento."
      );
    }
  }
}