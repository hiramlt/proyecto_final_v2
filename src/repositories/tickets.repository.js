import TicketDTO from '../dto/ticket.dto.js';

export default class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async create(data) {
        let ticket = await this.dao.create(data);
        if (ticket) {
            ticket = new TicketDTO(ticket);
        }
        return ticket;
    }
}
