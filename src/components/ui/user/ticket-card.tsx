'use client';

import { TicketDto } from '@/types/ticket';

interface Props {
  ticket: TicketDto;
}

const TicketCard = ({ ticket }: Props) => {
  const getBadgeProps = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { className: 'badge-success', text: 'Active' };
      case 'maturedwithdrawn':
        return { className: 'badge-info', text: 'Matured Withdrawn' };
      case 'earlywithdrawn':
        return { className: 'badge-warning', text: 'Early Withdrawn' };
      default:
        return { className: 'badge-neutral', text: status };
    }
  };

  const { className, text } = getBadgeProps(ticket.status);

  return (
    <div className="card bg-base-100 w-64 shadow-sm">
      <div className="card-body p-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Ticket #{ticket.id}</h2>
            <span
              className={`badge badge-sm ${className} text-white`}
              role="status"
              aria-label={text}
            >
              {text}
            </span>
          </div>
          <p className="text-xs">
            <strong>Method:</strong>{' '}
            <span className="badge badge-outline badge-xs">
              {ticket.method}
            </span>
          </p>
          <p className="text-xs">
            <strong>Opened:</strong>{' '}
            {new Date(ticket.openedAt).toLocaleString()}
          </p>
          <p className="text-xs">
            <strong>Closed:</strong>{' '}
            {ticket.closedAt
              ? new Date(ticket.closedAt).toLocaleString()
              : 'Not closed'}
          </p>
          <p className="text-xs">
            <strong>Plan:</strong> {ticket.plan.days} days
          </p>
          {ticket.ticketHistories.length > 0 && (
            <p className="text-xs">
              <strong>Latest History:</strong> Principal{' '}
              {ticket.ticketHistories[0].principal}, Interest{' '}
              {ticket.ticketHistories[0].interest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
