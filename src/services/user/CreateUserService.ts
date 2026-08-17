import prismaClient from "../../prisma/index";
import { hash } from "bcryptjs";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ email, name, password }: CreateUserProps) {

    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email: email
      }
    })

    if (userAlreadyExists) {
      throw new Error("Esse usuário já existe")
    }

    const passwordHash = await hash(password, 8);

    const user = await prismaClient.user.create({
      data: {
        name: name,
        email: email,
        password: passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true, 
      }
    })

    return user;
  }
}

export { CreateUserService }