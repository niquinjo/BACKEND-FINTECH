import prismaClient from '../../prisma';

class ListCategoryService {
  async execute(user_id: string) {
    const categories = await prismaClient.category.findMany({
      where: {
        user_id
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        name: 'desc'
      }
    });

    return categories;
  }
}

export { ListCategoryService }
