import { ticketRepository } from '../repositories/index.js';

export default class TicketsService {
    static create(data) {
        return ticketRepository.create(data);
    }
}