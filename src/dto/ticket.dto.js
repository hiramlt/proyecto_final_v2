export default class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.code = ticket.code;
        this.purchase_datetime = ticket.createdAt;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
    }
}