import { Request, Response } from "express";
import { AuthGoogleService } from "../../services/user/AuthGoogleService";

class AuthGoogleController {
  async handle(req: Request, res: Response) {

    console.log(req.body);

    const { googleToken } = req.body;

    const authGoogle = new AuthGoogleService();
    const session = await authGoogle.execute({ googleToken });

    return res.json(session);
  }
}

export { AuthGoogleController };