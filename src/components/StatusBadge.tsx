import { ORDER_STATUS_LABEL } from '../utils/format';
import type { OrderStatus } from '../types';

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className="whitespace-nowrap rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium">{ORDER_STATUS_LABEL[status]}</span>;
}
