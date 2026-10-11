import { act, cleanup, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useUpdateBookingPrice, type BookingDossier } from './useBookings';

const db = vi.hoisted(() => ({
  from: vi.fn(), update: vi.fn(), eq: vi.fn(), is: vi.fn(), select: vi.fn(), maybeSingle: vi.fn(),
}));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: db.from } }));

const booking = {
  id: 'test-booking', total_price: 4340, deposit_amount: 1302,
  deposit_paid: false, remaining_paid: false, payment_notes: 'Bestaande notitie',
  check_in: '2027-11-09', check_out: '2027-12-21',
} as BookingDossier;

function setup() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const invalidate = vi.spyOn(client, 'invalidateQueries');
  const result = renderHook(() => useUpdateBookingPrice(), {
    wrapper: ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>,
  });
  return { ...result, invalidate };
}

describe('saving an agreed booking price', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const method of ['from', 'update', 'eq', 'is', 'select'] as const) db[method].mockReturnValue(db);
    db.maybeSingle.mockResolvedValue({ data: { id: booking.id }, error: null });
  });
  afterEach(cleanup);

  it('updates the total and deposit together, preserving existing notes and recording the change', async () => {
    const { result, invalidate } = setup();
    await act(() => result.current.mutateAsync({ booking, total: 4000, reason: 'Vaste gast' }));
    expect(db.update).toHaveBeenCalledWith({
      total_price: 4000, deposit_amount: 1200,
      payment_notes: expect.stringMatching(/^Bestaande notitie\nPrijsafspraak .*€4340\.00 → €4000\.00 — Vaste gast$/),
    });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['bookings'] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['booking-dossier'] });
  });

  it('preserves a received deposit and does not reset payment or contract flags', async () => {
    const { result } = setup();
    await act(() => result.current.mutateAsync({ booking: { ...booking, deposit_paid: true }, total: 4000, reason: '' }));
    expect(db.update).toHaveBeenCalledWith({ total_price: 4000, deposit_amount: 1302, payment_notes: expect.any(String) });
  });

  it('rounds fractional cents in the deposit and supports empty notes', async () => {
    const { result } = setup();
    await act(() => result.current.mutateAsync({ booking: { ...booking, payment_notes: null }, total: 3999.99, reason: '' }));
    expect(db.update).toHaveBeenCalledWith({ total_price: 3999.99, deposit_amount: 1200, payment_notes: expect.any(String) });
    expect(db.is).toHaveBeenCalledWith('payment_notes', null);
  });

  it('rejects stale records instead of silently reporting success', async () => {
    db.maybeSingle.mockResolvedValue({ data: null, error: null });
    const { result, invalidate } = setup();
    await act(async () => {
      await expect(result.current.mutateAsync({ booking, total: 4000, reason: '' })).rejects.toThrow('intussen gewijzigd');
    });
    expect(db.eq).toHaveBeenCalledWith('total_price', 4340);
    expect(db.eq).toHaveBeenCalledWith('deposit_paid', false);
    expect(db.eq).toHaveBeenCalledWith('remaining_paid', false);
    expect(db.eq).toHaveBeenCalledWith('payment_notes', 'Bestaande notitie');
    expect(invalidate).not.toHaveBeenCalled();
  });

  it('does not send fully paid bookings or totals below a received deposit to the database', async () => {
    const { result } = setup();
    await act(async () => {
      await expect(result.current.mutateAsync({ booking: { ...booking, remaining_paid: true }, total: 4000, reason: '' })).rejects.toThrow('volledig betaald');
      await expect(result.current.mutateAsync({ booking: { ...booking, deposit_paid: true }, total: 1000, reason: '' })).rejects.toThrow('ontvangen voorschot');
    });
    expect(db.update).not.toHaveBeenCalled();
  });
});
