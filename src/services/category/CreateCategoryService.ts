import prismaClient from "../../prisma/index";


interface CreateCategoryProps {
  name: string;
  user_id: string;

}

class CreateCategoryService {
  async execute({ name, user_id }: CreateCategoryProps) {

    const nameLowerCase = name.toLowerCase();

    // Verifica se ESTE usuário já tem uma categoria com ESTE nome
    const categoryAlreadyExists = await prismaClient.category.findFirst({
      where: {
        name: nameLowerCase,
        user_id: user_id // Filtra pelo dono
      }
    });

    if (categoryAlreadyExists) {
      throw new Error("Você já possui uma categoria com este nome.");
    }

    try {

      const category = await prismaClient.category.create({
        data: {
          name: nameLowerCase,
          user_id: user_id
        },
        select: {
          id: true,
          name: true,
          createdAt: true
        }
      })

      return category;

    } catch (err) {
      throw new Error("Erro ao criar categoria: ");
    }

  }
}

export { CreateCategoryService }