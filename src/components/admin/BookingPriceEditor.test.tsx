import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BookingPriceEditor } from './BookingPriceEditor';
import type { BookingDossier } from '@/hooks/useBookings';

const mocks = vi.hoisted(() => ({ mutateAsync: vi.fn(), toast: vi.fn() }));
vi.mock('@/hooks/useBookings', () => ({ useUpdateBookingPrice: () => ({ mutateAsync: mocks.mutateAsync, isPending: false }) }));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: mocks.toast }) }));

const booking = {
  id: 'test-booking', guest_name: 'Testgast', total_price: 4340, deposit_amount: 1302,
  deposit_paid: false, remaining_paid: false, payment_notes: 'Bestaande notitie',
  contract_sent: true,
} as BookingDossier;

function openEditor(overrides: Partial<BookingDossier> = {}) {
  render(<BookingPriceEditor booking={{ ...booking, ...overrides }} isAdmin />);
  fireEvent.click(screen.getByRole('button', { name: 'Prijs aanpassen' }));
}

describe('BookingPriceEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mutateAsync.mockResolvedValue(undefined);
  });
  afterEach(cleanup);

  it('does not show editing controls to guests', () => {
    render(<BookingPriceEditor booking={booking} isAdmin={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('previews the agreed price and saves only after explicit submission', async () => {
    openEditor();
    fireEvent.change(screen.getByLabelText('Nieuwe totaalprijs, inclusief schoonmaak'), { target: { value: '4000,00' } });
    fireEvent.change(screen.getByLabelText(/Interne reden/), { target: { value: 'Vaste gast' } });
    expect(screen.getByText(/1\.200,00/)).toBeInTheDocument();
    expect(screen.getByText(/2\.800,00/)).toBeInTheDocument();
    expect(screen.getByText(/PDF-bestand verandert niet automatisch/)).toBeInTheDocument();
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Opslaan' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(mocks.mutateAsync).toHaveBeenCalledWith({ booking, total: 4000, reason: 'Vaste gast' });
  });

  it('discards changes when cancelled and resets on reopening', () => {
    openEditor();
    fireEvent.change(screen.getByLabelText('Nieuwe totaalprijs, inclusief schoonmaak'), { target: { value: '4000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Annuleren' }));
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Prijs aanpassen' }));
    expect(screen.getByLabelText('Nieuwe totaalprijs, inclusief schoonmaak')).toHaveValue('4340,00');
  });

  it('keeps received deposits and calculates the outstanding balance', () => {
    openEditor({ deposit_paid: true });
    fireEvent.change(screen.getByLabelText('Nieuwe totaalprijs, inclusief schoonmaak'), { target: { value: '4000' } });
    expect(screen.getByText(/1\.302,00/)).toBeInTheDocument();
    expect(screen.getByText(/2\.698,00/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Nieuwe totaalprijs, inclusief schoonmaak'), { target: { value: '1000' } });
    expect(screen.getByRole('alert')).toHaveTextContent('niet lager zijn dan het ontvangen voorschot');
    expect(screen.getByRole('button', { name: 'Opslaan' })).toBeDisabled();
  });

  it.each(['0', '-20', 'abc', '4000,001', '100000000', ''])('rejects invalid amount %s', (value) => {
    openEditor();
    fireEvent.change(screen.getByLabelText('Nieuwe totaalprijs, inclusief schoonmaak'), { target: { value } });
    expect(screen.getByRole('button', { name: 'Opslaan' })).toBeDisabled();
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
  });

  it('blocks changes to fully paid bookings', () => {
    openEditor({ remaining_paid: true });
    expect(screen.getByRole('alert')).toHaveTextContent('al volledig betaald');
    expect(screen.getByRole('button', { name: 'Opslaan' })).toBeDisabled();
  });

  it('keeps the dialog and entered amount when saving fails', async () => {
    mocks.mutateAsync.mockRejectedValue(new Error('Opslaan mislukt.'));
    openEditor();
    fireEvent.change(screen.getByLabelText('Nieuwe totaalprijs, inclusief schoonmaak'), { target: { value: '4000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Opslaan' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Opslaan mislukt.');
    expect(screen.getByLabelText('Nieuwe totaalprijs, inclusief schoonmaak')).toHaveValue('4000');
    expect(mocks.toast).not.toHaveBeenCalled();
  });
});
