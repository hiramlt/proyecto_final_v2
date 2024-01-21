import UserDao from '../dao/users.dao.js';
import CartDao from '../dao/carts.dao.js';
import ProductDao from '../dao/products.dao.js';
import TicketDao from '../dao/tickets.dao.js';

import UsersRepository from './users.repository.js';
import CartsRepository from './carts.repository.js';
import ProductsRepository from './products.repository.js';
import TicketRepository from './tickets.repository.js';

export const usersRepository = new UsersRepository(UserDao);
export const cartsRepository = new CartsRepository(CartDao);
export const productsRepository = new ProductsRepository(ProductDao);
export const ticketRepository = new TicketRepository(TicketDao);
