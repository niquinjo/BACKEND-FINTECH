declare namespace Express {
  export interface Request {
    user_id: string;
  }
}


//aqui estamos estendendo a interface Request do Express para adicionar a propriedade user_id, que será usada para armazenar o ID do usuário autenticado. Isso é útil para acessar o ID do usuário em qualquer parte do código onde a requisição esteja disponível, como em controladores ou serviços.