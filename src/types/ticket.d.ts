export interface TicketDto {
  id: number;
  openedAt: string;
  closedAt: string;
  status: 'active' | 'closed' | string;
  method: string;
  plan: {
    id: number;
    days: number;
  };
  ticketHistories: {
    issuedAt: string;
    maturedAt: string;
    principal: string;
    interest: string;
  }[];
}
