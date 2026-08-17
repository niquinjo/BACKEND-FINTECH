import { compare } from "bcryptjs";
import prismaClient from "../../prisma/index";
import { sign } from "jsonwebtoken";

interface AuthUserServiceProps {
  email: string;
  password: string;
}


class AuthUserService {
  async execute({ email, password }: AuthUserServiceProps) {
    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      }
    })

    if (!user || !user.password) {
      throw new Error("Email/senha incorretos")
    }

    //verificar se a senha bate com a do banco

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error("Email/senha incorretos")
    }

    //gerar token JWT
    const token = sign({
      name: user.name,
      email: user.email
    }, process.env.JWT_SECRET as string, {
      subject: user.id,
      expiresIn: "30d"
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token
    }
  }
}

export { AuthUserService }