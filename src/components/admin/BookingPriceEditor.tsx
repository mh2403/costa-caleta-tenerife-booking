import { useState } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUpdateBookingPrice, type BookingDossier } from '@/hooks/useBookings';
import { useToast } from '@/hooks/use-toast';
import { getBookingDeposit, parseBookingPrice, roundPrice } from '@/lib/bookingPrice';

const currency = (amount: number) => new Intl.NumberFormat('nl-BE', {
  style: 'currency', currency: 'EUR',
}).format(amount);

export function BookingPriceEditor({ booking, isAdmin }: { booking: BookingDossier; isAdmin: boolean }) {
  const [snapshot, setSnapshot] = useState<BookingDossier | null>(null);
  const [price, setPrice] = useState('');
  const [reason, setReason] = useState('');
  const [saveError, setSaveError] = useState('');
  const updatePrice = useUpdateBookingPrice();
  const { toast } = useToast();

  if (!isAdmin) return null;

  const total = parseBookingPrice(price);
  const deposit = snapshot && total !== null ? getBookingDeposit({ ...snapshot, total_price: total }) : 0;
  const validationError = snapshot?.remaining_paid
    ? 'Deze boeking is al volledig betaald. Een prijswijziging vraagt een aparte verrekening van de betaling.'
    : total === null
      ? 'Vul een bedrag groter dan nul in, met maximaal twee decimalen (bijvoorbeeld 4000 of 3999,50).'
      : total < deposit
        ? `De totaalprijs mag niet lager zijn dan het ontvangen voorschot van ${currency(deposit)}.`
        : '';
  const unchanged = snapshot && total === Number(snapshot.total_price);

  const close = () => {
    if (!updatePrice.isPending) setSnapshot(null);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAdmin || !snapshot || validationError || total === null || unchanged || updatePrice.isPending) return;
    setSaveError('');
    try {
      await updatePrice.mutateAsync({ booking: snapshot, total, reason });
      setSnapshot(null);
      toast({ title: 'Prijs aangepast', description: 'De afgesproken prijs is opgeslagen in het boekingsdossier.' });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Opslaan mislukt. Probeer het opnieuw.');
    }
  };

  return (
    <>
      <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => {
        setSnapshot(booking);
        setPrice(Number(booking.total_price).toFixed(2).replace('.', ','));
        setReason('');
        setSaveError('');
      }}>
        <Pencil className="h-3.5 w-3.5" />Prijs aanpassen
      </Button>
      <Dialog open={!!snapshot} onOpenChange={(open) => { if (!open) close(); }}>
        <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-xl sm:max-w-lg" onEscapeKeyDown={(event) => {
          if (updatePrice.isPending) event.preventDefault();
        }} onPointerDownOutside={(event) => { if (updatePrice.isPending) event.preventDefault(); }}>
          <DialogHeader>
            <DialogTitle>Prijs aanpassen</DialogTitle>
            <DialogDescription>Stel een afgesproken totaalprijs in voor {snapshot?.guest_name}. De gast ziet de nieuwe prijs na het opslaan.</DialogDescription>
          </DialogHeader>
          {snapshot && (
            <form onSubmit={save} className="space-y-5">
              <div className="flex items-center justify-between rounded-lg bg-muted/60 p-3 text-sm">
                <span className="text-muted-foreground">Huidige totaalprijs</span>
                <span className="font-semibold">{currency(Number(snapshot.total_price))}</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agreed-total-price">Nieuwe totaalprijs, inclusief schoonmaak</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input id="agreed-total-price" inputMode="decimal" value={price} onChange={(event) => {
                    setPrice(event.target.value);
                    setSaveError('');
                  }} className="pl-8 text-lg" disabled={updatePrice.isPending || snapshot.remaining_paid}
                    aria-invalid={!!validationError} aria-describedby={validationError ? 'price-error' : undefined} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price-reason">Interne reden <span className="font-normal text-muted-foreground">(optioneel)</span></Label>
                <Textarea id="price-reason" placeholder="Bijvoorbeeld: vaste gast — afgesproken met eigenaar" value={reason}
                  onChange={(event) => setReason(event.target.value)} rows={2} maxLength={1000} disabled={updatePrice.isPending} />
                <p className="text-xs text-muted-foreground">Alleen zichtbaar voor beheerders. De oude en nieuwe prijs worden bij de interne notities bewaard.</p>
              </div>
              {!validationError && total !== null && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2 text-sm" aria-live="polite">
                  <div className="flex justify-between gap-4 font-semibold"><span>Nieuwe totaalprijs</span><span>{currency(total)}</span></div>
                  <div className="flex justify-between gap-4"><span>{snapshot.deposit_paid ? 'Ontvangen voorschot (blijft behouden)' : '30% voorschot'}</span><span>{currency(deposit)}</span></div>
                  <div className="flex justify-between gap-4"><span>{snapshot.deposit_paid ? 'Nog te betalen' : '70% restbedrag'}</span><span>{currency(roundPrice(total - deposit))}</span></div>
                </div>
              )}
              {(snapshot.contract_sent || snapshot.contract_file_path || snapshot.guest_contract_signed) && (
                <p className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">Er is al een contract verstuurd of ondertekend. Pas het contract apart aan voor de nieuwe prijs; het PDF-bestand verandert niet automatisch.</p>
              )}
              {validationError && <p id="price-error" role="alert" className="text-sm text-destructive">{validationError}</p>}
              {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={close} disabled={updatePrice.isPending}>Annuleren</Button>
                <Button type="submit" disabled={!!validationError || !!unchanged || updatePrice.isPending}>
                  {updatePrice.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {updatePrice.isPending ? 'Opslaan…' : 'Opslaan'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
