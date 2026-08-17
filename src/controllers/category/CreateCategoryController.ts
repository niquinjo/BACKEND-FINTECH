import { Request, Response } from 'express';
import { CreateCategoryService } from '../../services/category/CreateCategoryService'

class CreateCategoryController {
  async handle(req: Request, res: Response) {
    const { name } = req.body;

    const user_id = req.user_id;

    const createCategory = new CreateCategoryService();

    const category = await createCategory.execute({ name, user_id });

    return res.status(201).json(category)

  }
}

export { CreateCategoryController }