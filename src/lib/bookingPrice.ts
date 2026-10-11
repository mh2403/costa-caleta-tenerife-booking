import { bookingFlowConfig } from '@/lib/bookingFlowConfig';

type BookingPrice = {
  total_price: number;
  deposit_amount: number;
  deposit_paid: boolean;
};

export const roundPrice = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;

export function getBookingDeposit(booking: BookingPrice) {
  return booking.deposit_paid
    ? Number(booking.deposit_amount)
    : roundPrice(Number(booking.total_price) * bookingFlowConfig.depositRatio);
}

export function parseBookingPrice(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const amount = Number(normalized);
  return amount > 0 && amount <= 99999999.99 ? roundPrice(amount) : null;
}
