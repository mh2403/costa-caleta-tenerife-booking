import { useState } from 'react';
import { useLanguage } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { addDays, isSameDay, isWithinInterval } from 'date-fns';
import { CalendarX, CalendarCheck } from 'lucide-react';

// Mock data
const initialBlockedDates = [
  { start: addDays(new Date(), 30), end: addDays(new Date(), 35) },
  { start: addDays(new Date(), 50), end: addDays(new Date(), 52) },
];

const bookedDates = [
  { start: addDays(new Date(), 5), end: addDays(new Date(), 10) },
  { start: addDays(new Date(), 20), end: addDays(new Date(), 25) },
];

export function AdminAvailability() {
  const { t } = useLanguage();
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [mode, setMode] = useState<'block' | 'unblock'>('block');

  const isDateBooked = (date: Date) => {
    return bookedDates.some(booking =>
      isWithinInterval(date, { start: booking.start, end: booking.end })
    );
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blocked =>
      isWithinInterval(date, { start: blocked.start, end: blocked.end })
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (isDateBooked(date)) return; // Can't modify booked dates

    const isSelected = selectedDates.some(d => isSameDay(d, date));
    if (isSelected) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, date)));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleBlockDates = () => {
    if (selectedDates.length === 0) return;

    const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    const newBlocked = {
      start: sortedDates[0],
      end: sortedDates[sortedDates.length - 1],
    };

    setBlockedDates([...blockedDates, newBlocked]);
    setSelectedDates([]);
  };

  const handleUnblockDates = () => {
    const newBlocked = blockedDates.filter(blocked => {
      return !selectedDates.some(date =>
        isWithinInterval(date, { start: blocked.start, end: blocked.end })
      );
    });
    setBlockedDates(newBlocked);
    setSelectedDates([]);
  };

  const getDayClassName = (date: Date) => {
    if (isDateBooked(date)) {
      return 'bg-primary/20 text-primary';
    }
    if (isDateBlocked(date)) {
      return 'bg-destructive/20 text-destructive';
    }
    if (selectedDates.some(d => isSameDay(d, date))) {
      return 'bg-secondary text-secondary-foreground';
    }
    return '';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          {t.admin.availability}
        </h1>
        <p className="text-muted-foreground mt-1">Block dates for personal use or maintenance</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20" />
          <span className="text-sm text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive/20" />
          <span className="text-sm text-muted-foreground">Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary" />
          <span className="text-sm text-muted-foreground">Selected</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-card rounded-xl p-6 shadow-soft">
          <Calendar
            mode="single"
            selected={undefined}
            onSelect={handleDateSelect}
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
                ? `${selectedDates.length} date(s) selected`
                : 'Select dates on the calendar'}
            </h3>

            <div className="space-y-3">
              <Button
                variant="destructive"
                className="w-full flex items-center gap-2"
                disabled={selectedDates.length === 0}
                onClick={handleBlockDates}
              >
                <CalendarX className="h-4 w-4" />
                {t.admin.blockDates}
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                disabled={selectedDates.length === 0}
                onClick={handleUnblockDates}
              >
                <CalendarCheck className="h-4 w-4" />
                {t.admin.unblockDates}
              </Button>
            </div>
          </div>

          {/* Blocked Periods List */}
          <div className="bg-card rounded-xl p-6 shadow-soft">
            <h3 className="font-heading text-lg font-semibold mb-4">Blocked Periods</h3>
            {blockedDates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No blocked dates</p>
            ) : (
              <div className="space-y-2">
                {blockedDates.map((blocked, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm"
                  >
                    <span>
                      {blocked.start.toLocaleDateString()} - {blocked.end.toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setBlockedDates(blockedDates.filter((_, i) => i !== index));
                      }}
                    >
                      Remove
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
