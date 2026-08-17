import { Router } from 'express';
import { CreateUserController } from './controllers/user/CreateUserController';
import { validateSchema } from './middlewares/validateSchema';
import { createUserSchema, authUserSchema } from './schemas/userSchema';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { isAuthenticated } from './middlewares/isAuthenticatd';
import { CreateCategoryController } from './controllers/category/CreateCategoryController';
import { ListCategoryController } from './controllers/category/ListCategoryController';
import { createCategorySchema } from './schemas/categorySchema';
import { CreateTransactionController } from './controllers/transaction/CreateTransactionController';
import { ListTransactionController } from './controllers/transaction/ListTransactionController';
import { ListTransactionsByCategoryController } from './controllers/transaction/ListTransactionsByCategoryController';
import { createTransactionSchema, deleteTransactionSchema, listTransactionSchema, listTransactionsByCategorySchema } from './schemas/transactionSchema';
import { DeleteTransactionController } from './controllers/transaction/DeleteTransactionController';
import { SummaryTransactionController } from './controllers/transaction/SummaryTransactionController';
import { AuthGoogleController } from './controllers/user/AuthGoogleController';
import { FilterTransactionController } from './controllers/transaction/FilterTransactionController';
import { AiController } from './controllers/ia/AiController';

const router = Router();

//ROTAS USERS----------------------

//Rota para criar um usuário
router.post("/users", validateSchema(createUserSchema), new CreateUserController().handle);

//Rota para fazer login/sign in com o Google
router.post("/session/google", new AuthGoogleController().handle);


//Rota para fazer login
router.post("/session", validateSchema(authUserSchema), new AuthUserController().handle)

//Rota para pegar os detalhes do user
router.get("/me", isAuthenticated, new DetailUserController().handle)


//ROTA CATEGORY--------------------

//Rota criar categoria
router.post("/category", isAuthenticated, validateSchema(createCategorySchema), new CreateCategoryController().handle)

//Rota listar categorias do usuário autenticado
router.get("/category", isAuthenticated, new ListCategoryController().handle)

//Rotas para transações
router.post("/transaction", isAuthenticated, validateSchema(createTransactionSchema), new CreateTransactionController().handle)
router.get("/transaction", isAuthenticated, validateSchema(listTransactionSchema), new ListTransactionController().handle)
router.get("/category/transaction", isAuthenticated, validateSchema(listTransactionsByCategorySchema), new ListTransactionsByCategoryController().handle)
router.delete("/transaction", isAuthenticated, validateSchema(deleteTransactionSchema), new DeleteTransactionController().handle
);
router.get("/transaction/summary", isAuthenticated, new SummaryTransactionController().handle);
router.get('/transactions/filter', isAuthenticated, new FilterTransactionController().handle);


//ROTA IA--------------------
router.post("/ia/ask", isAuthenticated, new AiController().handle);

export { router };

//ARQUITETURA EM CAMADA (ROUTES-CONTROLLERS-SERVUCE)
//CONTROLLER CHAMA UMA SERVICE, ELA FAZ TODA A LOGICA E DEVOLVE PARA O CONTROLLER.