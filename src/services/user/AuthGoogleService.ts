import prismaClient from "../../prisma";
import { sign } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface AuthGoogleProps {
  googleToken: string;
}

class AuthGoogleService {
  async execute({ googleToken }: AuthGoogleProps) {


    console.log("TOKEN RECEBIDO?");
    console.log(!!googleToken);

    console.log("GOOGLE_CLIENT_ID:");
    console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);


    // valida o token recebido do frontend diretamente nos servidores do Google
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log("TOKEN VALIDADO")

    // 2. Extrai os dados que o Google garantiu serem verdadeiros
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Token do Google inválido ou sem e-mail.");
    }

    console.log(payload);

    const { email, name, picture } = payload;

    console.log("PROCURANDO USUARIO");


    console.log("ANTES DO FINDFIRST");

    // 3. Verifica se o usuário já existe no nosso banco

    let user;

    try {
      user = await prismaClient.user.findFirst({
        where: {
          email,
        },
      });

      console.log(user);

    } catch (err) {
      console.error(err);
    }



    console.log("DEPOIS DO FINDFIRST");

    console.log("USUARIO ENCONTRADO:", user);

    // 4. Se NÃO existe, nós o cadastramos na hora (sem senha)
    if (!user) {

      console.log("CRIANDO USUARIO");

      user = await prismaClient.user.create({
        data: {
          name: name || "Usuário do Google",
          email: email,
          avatarUrl: picture,
          // password fica vazio/null
        }
      });

      console.log("USUARIO CRIADO:", user);

    } else {
      user = await prismaClient.user.update({
        where: { id: user.id },
        data: { avatarUrl: picture }
      })
    }


    console.log("GERANDO JWT");


    // 5. Gera o NOSSO Token JWT (exatamente igual ao login normal)
    const token = sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "30d",
      }
    );

    console.log("JWT GERADO");

    // 6. Devolve as informações para o Front-end
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token: token,
    };
  }
}

export { AuthGoogleService };




