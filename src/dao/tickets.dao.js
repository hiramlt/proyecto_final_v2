import TicketModel from '../models/ticket.model.js';

export default class TicketsDao {
    static create(data) {
        return TicketModel.create(data);
    }
}