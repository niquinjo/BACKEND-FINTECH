import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "O nome da transação é obrigatório" }),
    value: z.coerce.number({ message: "O valor é obrigatório" }).int({ message: "O valor deve ser um número inteiro (em centavos)" }).positive({ message: "O valor deve ser maior que zero" }),
    description: z.string().min(1, { message: "A descrição é obrigatória" }),
    category_id: z.string().min(1, { message: "A categoria é obrigatória" }),
    type: z.enum(["ENTRADA", "SAIDA"], { message: "O tipo da transação é obrigatório" })
  })
})

export const listTransactionSchema = z.object({
  query: z.object({
    disable: z
      .union([z.literal('true'), z.literal('false')])
      .optional()
      .transform((value) => value === 'true')
  })
})



export const listTransactionsByCategorySchema = z.object({
  query: z.object({
    category_id: z.string({ message: "O ID da categoria é obrigatório" }).uuid({ message: "ID de categoria inválido" }),
  })
});

export const deleteTransactionSchema = z.object({
  query: z.object({
    transaction_id: z.string({ message: "O ID da transação é obrigatório" })
      .uuid({ message: "ID de transação inválido" })
  })
});