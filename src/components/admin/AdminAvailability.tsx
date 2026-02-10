import { useState } from 'react';
import { translations } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { isSameDay, isWithinInterval, addDays } from 'date-fns';
import { CalendarX, CalendarCheck, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useBlockedDates, useCreateBlockedDate, useDeleteBlockedDate } from '@/hooks/useBlockedDates';
import { useBookedDates } from '@/hooks/useBookings';

export function AdminAvailability() {
  const t = translations.nl;
  const { toast } = useToast();
  const { data: blockedDatesData = [], isLoading: loadingBlocked } = useBlockedDates();
  const { data: bookedDates = [], isLoading: loadingBooked } = useBookedDates();
  const createBlockedDate = useCreateBlockedDate();
  const deleteBlockedDate = useDeleteBlockedDate();

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const isLoading = loadingBlocked || loadingBooked;

  const isDateBooked = (date: Date) => {
    return bookedDates.some(booking =>
      isWithinInterval(date, { start: booking.start, end: addDays(booking.end, -1) })
    );
  };

  const isDateBlocked = (date: Date) => {
    return blockedDatesData.some(blocked =>
      isWithinInterval(date, { start: blocked.start, end: blocked.end })
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    // Can't modify booked dates
    if (isDateBooked(date)) {
      toast({
        title: 'Deze datum is al geboekt',
        description: 'U kunt geen datum blokkeren met een bevestigde boeking.',
        variant: 'destructive',
      });
      return;
    }

    const isSelected = selectedDates.some(d => isSameDay(d, date));
    if (isSelected) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, date)));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleBlockDates = async () => {
    if (selectedDates.length === 0) return;

    const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    
    try {
      await createBlockedDate.mutateAsync({
        start_date: format(sortedDates[0], 'yyyy-MM-dd'),
        end_date: format(sortedDates[sortedDates.length - 1], 'yyyy-MM-dd'),
        reason: 'Geblokkeerd door eigenaar',
      });
      toast({ title: t.common.success, description: 'Data succesvol geblokkeerd' });
      setSelectedDates([]);
    } catch (error) {
      toast({ title: t.common.error, variant: 'destructive' });
    }
  };

  const handleUnblockDates = async () => {
    // Find which blocked date ranges contain any of the selected dates
    const blockedToRemove = blockedDatesData.filter(blocked =>
      selectedDates.some(date =>
        isWithinInterval(date, { start: blocked.start, end: blocked.end })
      )
    );

    try {
      for (const blocked of blockedToRemove) {
        await deleteBlockedDate.mutateAsync(blocked.id);
      }
      toast({ title: t.common.success, description: 'Data succesvol gedeblokkeerd' });
      setSelectedDates([]);
    } catch (error) {
      toast({ title: t.common.error, variant: 'destructive' });
    }
  };

  const handleRemoveBlocked = async (id: string) => {
    try {
      await deleteBlockedDate.mutateAsync(id);
      toast({ title: t.common.success });
    } catch (error) {
      toast({ title: t.common.error, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          {t.admin.availability}
        </h1>
        <p className="text-muted-foreground mt-1">Blokkeer data voor eigen gebruik of onderhoud</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20" />
          <span className="text-sm text-muted-foreground">Geboekt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive/20" />
          <span className="text-sm text-muted-foreground">Geblokkeerd</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary" />
          <span className="text-sm text-muted-foreground">Geselecteerd</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-card rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-end mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCalendarMonth(new Date())}
            >
              Vandaag
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={undefined}
            onSelect={handleDateSelect}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            modifiers={{
              booked: (date) => isDateBooked(date),
              blocked: (date) => isDateBlocked(date),
              selected: (date) => selectedDates.some(d => isSameDay(d, date)),
            }}
            modifiersClassNames={{
              booked: 'bg-primary/20 text-primary',
              blocked: 'bg-destructive/20 text-destructive',
              selected: 'bg-secondary text-secondary-foreground',
            }}
            className="rounded-md border pointer-events-auto"
            numberOfMonths={1}
          />
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl p-6 shadow-soft">
            <h3 className="font-heading text-lg font-semibold mb-4">
              {selectedDates.length > 0
                ? `${selectedDates.length} datum(s) geselecteerd`
                : 'Selecteer data op de kalender'}
            </h3>

            <div className="space-y-3">
              <Button
                variant="destructive"
                className="w-full flex items-center gap-2"
                disabled={selectedDates.length === 0 || createBlockedDate.isPending}
                onClick={handleBlockDates}
              >
                {createBlockedDate.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CalendarX className="h-4 w-4" />
                )}
                {t.admin.blockDates}
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                disabled={selectedDates.length === 0 || deleteBlockedDate.isPending}
                onClick={handleUnblockDates}
              >
                {deleteBlockedDate.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CalendarCheck className="h-4 w-4" />
                )}
                {t.admin.unblockDates}
              </Button>
            </div>
          </div>

          {/* Blocked Periods List */}
          <div className="bg-card rounded-xl p-6 shadow-soft">
            <h3 className="font-heading text-lg font-semibold mb-4">Geblokkeerde periodes</h3>
            {blockedDatesData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Geen geblokkeerde data</p>
            ) : (
              <div className="space-y-2">
                {blockedDatesData.map((blocked) => (
                  <div
                    key={blocked.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm"
                  >
                    <span>
                      {format(blocked.start, 'MMM d, yyyy')} - {format(blocked.end, 'MMM d, yyyy')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveBlocked(blocked.id)}
                      disabled={deleteBlockedDate.isPending}
                    >
                      Verwijderen
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
