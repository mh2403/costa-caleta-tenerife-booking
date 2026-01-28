import { useState } from 'react';
import { useLanguage } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, Edit, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface Season {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  pricePerNight: number;
}

const initialSeasons: Season[] = [
  {
    id: 1,
    name: 'High Season',
    startDate: new Date(2026, 11, 1),
    endDate: new Date(2027, 2, 31),
    pricePerNight: 120,
  },
  {
    id: 2,
    name: 'Low Season',
    startDate: new Date(2026, 3, 1),
    endDate: new Date(2026, 10, 30),
    pricePerNight: 80,
  },
];

export function AdminPricing() {
  const { t } = useLanguage();
  const [basePrice, setBasePrice] = useState(90);
  const [cleaningFee, setCleaningFee] = useState(50);
  const [seasons, setSeasons] = useState(initialSeasons);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSeason, setNewSeason] = useState<Partial<Season>>({
    name: '',
    pricePerNight: 100,
  });

  const handleSaveSeason = () => {
    if (!newSeason.name || !newSeason.startDate || !newSeason.endDate || !newSeason.pricePerNight) {
      return;
    }

    if (editingSeason) {
      setSeasons(seasons.map(s =>
        s.id === editingSeason.id
          ? { ...s, ...newSeason as Season }
          : s
      ));
    } else {
      setSeasons([
        ...seasons,
        {
          id: Date.now(),
          name: newSeason.name,
          startDate: newSeason.startDate,
          endDate: newSeason.endDate,
          pricePerNight: newSeason.pricePerNight,
        },
      ]);
    }

    setDialogOpen(false);
    setEditingSeason(null);
    setNewSeason({ name: '', pricePerNight: 100 });
  };

  const handleEditSeason = (season: Season) => {
    setEditingSeason(season);
    setNewSeason(season);
    setDialogOpen(true);
  };

  const handleDeleteSeason = (id: number) => {
    setSeasons(seasons.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          {t.admin.pricing}
        </h1>
        <p className="text-muted-foreground mt-1">Manage base prices and seasonal rates</p>
      </div>

      {/* Base Pricing */}
      <div className="bg-card rounded-xl p-6 shadow-soft">
        <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Base Pricing
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="basePrice">{t.admin.basePriceLabel}</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
              <Input
                id="basePrice"
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="cleaningFee">{t.booking.cleaningFee}</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
              <Input
                id="cleaningFee"
                type="number"
                value={cleaningFee}
                onChange={(e) => setCleaningFee(Number(e.target.value))}
                className="pl-8"
              />
            </div>
          </div>
        </div>
        <Button variant="hero" size="sm" className="mt-4">
          {t.admin.save}
        </Button>
      </div>

      {/* Seasonal Pricing */}
      <div className="bg-card rounded-xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold">
            {t.admin.seasonalPricing}
          </h2>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingSeason(null);
              setNewSeason({ name: '', pricePerNight: 100 });
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t.admin.addSeason}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSeason ? 'Edit Season' : t.admin.addSeason}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="seasonName">{t.admin.seasonName}</Label>
                  <Input
                    id="seasonName"
                    value={newSeason.name || ''}
                    onChange={(e) => setNewSeason({ ...newSeason, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t.admin.startDate}</Label>
                    <Calendar
                      mode="single"
                      selected={newSeason.startDate}
                      onSelect={(date) => setNewSeason({ ...newSeason, startDate: date })}
                      className="rounded-md border mt-1 pointer-events-auto"
                    />
                  </div>
                  <div>
                    <Label>{t.admin.endDate}</Label>
                    <Calendar
                      mode="single"
                      selected={newSeason.endDate}
                      onSelect={(date) => setNewSeason({ ...newSeason, endDate: date })}
                      className="rounded-md border mt-1 pointer-events-auto"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="seasonPrice">{t.admin.pricePerNight}</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                    <Input
                      id="seasonPrice"
                      type="number"
                      value={newSeason.pricePerNight || ''}
                      onChange={(e) => setNewSeason({ ...newSeason, pricePerNight: Number(e.target.value) })}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    {t.admin.cancel}
                  </Button>
                  <Button variant="hero" onClick={handleSaveSeason}>
                    {t.admin.save}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Seasons List */}
        <div className="space-y-3">
          {seasons.map((season) => (
            <div
              key={season.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div>
                <p className="font-semibold">{season.name}</p>
                <p className="text-sm text-muted-foreground">
                  {format(season.startDate, 'MMM d, yyyy')} - {format(season.endDate, 'MMM d, yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-primary">
                  €{season.pricePerNight}/night
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditSeason(season)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteSeason(season.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
