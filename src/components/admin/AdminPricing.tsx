import { useState, useEffect } from 'react';
import { translations } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, Loader2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useSettings, useUpdateSetting } from '@/hooks/useSettings';
import {
  useAllPricingRules,
  useCreatePricingRule,
  useUpdatePricingRule,
  useDeletePricingRule,
  PricingRule,
} from '@/hooks/usePricing';

export function AdminPricing() {
  const t = translations.nl;
  const { toast } = useToast();
  const { data: settings, isLoading: loadingSettings } = useSettings();
  const { data: pricingRules = [], isLoading: loadingRules } = useAllPricingRules();
  const updateSetting = useUpdateSetting();
  const createRule = useCreatePricingRule();
  const updateRule = useUpdatePricingRule();
  const deleteRule = useDeletePricingRule();

  const [basePrice, setBasePrice] = useState<number>(85);
  const [cleaningFee, setCleaningFee] = useState<number>(50);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [newRule, setNewRule] = useState({
    name: '',
    start_date: '',
    end_date: '',
    price_per_night: '',
    min_stay: '1',
  });

  // Update local state when settings load
  useEffect(() => {
    if (settings?.base_price) {
      setBasePrice(settings.base_price.amount);
    }
    if (settings?.cleaning_fee) {
      setCleaningFee(settings.cleaning_fee.amount);
    }
  }, [settings]);

  const handleSaveBasePrice = async () => {
    try {
      await updateSetting.mutateAsync({
        key: 'base_price',
        value: { amount: basePrice },
      });
      toast({ title: t.common.success });
    } catch (error) {
      toast({ title: t.common.error, variant: 'destructive' });
    }
  };

  const handleSaveCleaningFee = async () => {
    try {
      await updateSetting.mutateAsync({
        key: 'cleaning_fee',
        value: { amount: cleaningFee },
      });
      toast({ title: t.common.success });
    } catch (error) {
      toast({ title: t.common.error, variant: 'destructive' });
    }
  };

  const handleCreateRule = async () => {
    if (!newRule.name || !newRule.start_date || !newRule.end_date || !newRule.price_per_night) {
      toast({ title: 'Vul alle velden in', variant: 'destructive' });
      return;
    }

    try {
      if (editingRule) {
        await updateRule.mutateAsync({
          id: editingRule.id,
          name: newRule.name,
          start_date: newRule.start_date,
          end_date: newRule.end_date,
          price_per_night: parseFloat(newRule.price_per_night),
          min_stay: parseInt(newRule.min_stay) || 1,
        });
      } else {
        await createRule.mutateAsync({
          name: newRule.name,
          start_date: newRule.start_date,
          end_date: newRule.end_date,
          price_per_night: parseFloat(newRule.price_per_night),
          min_stay: parseInt(newRule.min_stay) || 1,
          is_active: true,
        });
      }
      toast({ title: t.common.success });
      setDialogOpen(false);
      setEditingRule(null);
      setNewRule({ name: '', start_date: '', end_date: '', price_per_night: '', min_stay: '1' });
    } catch (error) {
      toast({ title: t.common.error, variant: 'destructive' });
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm(t.admin.deleteConfirm)) return;
    try {
      await deleteRule.mutateAsync(id);
      toast({ title: t.common.success });
    } catch (error) {
      toast({ title: t.common.error, variant: 'destructive' });
    }
  };

  const handleEditRule = (rule: PricingRule) => {
    setEditingRule(rule);
    setNewRule({
      name: rule.name,
      start_date: rule.start_date,
      end_date: rule.end_date,
      price_per_night: String(rule.price_per_night),
      min_stay: String(rule.min_stay || 1),
    });
    setDialogOpen(true);
  };

  const isLoading = loadingSettings || loadingRules;

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
          {t.admin.pricing}
        </h1>
        <p className="text-muted-foreground mt-1">Beheer basisprijzen en seizoensprijzen</p>
      </div>

      {/* Base Pricing */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-soft">
          <h3 className="font-heading text-lg font-semibold mb-4">{t.admin.basePriceLabel}</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveBasePrice}
              disabled={updateSetting.isPending}
            >
              {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t.admin.save}
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-soft">
          <h3 className="font-heading text-lg font-semibold mb-4">Schoonmaakkosten</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  type="number"
                  value={cleaningFee}
                  onChange={(e) => setCleaningFee(parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveCleaningFee}
              disabled={updateSetting.isPending}
            >
              {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t.admin.save}
            </Button>
          </div>
        </div>
      </div>

      {/* Seasonal Pricing */}
      <div className="bg-card rounded-xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg font-semibold">{t.admin.seasonalPricing}</h3>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingRule(null);
              setNewRule({ name: '', start_date: '', end_date: '', price_per_night: '', min_stay: '1' });
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t.admin.addSeason}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRule ? 'Seizoen bewerken' : t.admin.addSeason}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t.admin.seasonName}</Label>
                  <Input
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    placeholder="bv. Hoogseizoen"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t.admin.startDate}</Label>
                    <Input
                      type="date"
                      value={newRule.start_date}
                      onChange={(e) => setNewRule({ ...newRule, start_date: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>{t.admin.endDate}</Label>
                    <Input
                      type="date"
                      value={newRule.end_date}
                      onChange={(e) => setNewRule({ ...newRule, end_date: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t.admin.pricePerNight}</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                      <Input
                        type="number"
                        value={newRule.price_per_night}
                        onChange={(e) => setNewRule({ ...newRule, price_per_night: e.target.value })}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Minimum verblijf (nachten)</Label>
                    <Input
                      type="number"
                      value={newRule.min_stay}
                      onChange={(e) => setNewRule({ ...newRule, min_stay: e.target.value })}
                      className="mt-1"
                      min="1"
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    {t.admin.cancel}
                  </Button>
                  <Button
                    onClick={handleCreateRule}
                    disabled={createRule.isPending || updateRule.isPending}
                  >
                    {(createRule.isPending || updateRule.isPending) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t.admin.save
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {pricingRules.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nog geen seizoensprijzen</p>
        ) : (
          <div className="space-y-3">
            {pricingRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium">{rule.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(rule.start_date), 'MMM d, yyyy')} - {format(new Date(rule.end_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-primary">€{Number(rule.price_per_night)}/nacht</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRule(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteRule(rule.id)}
                      disabled={deleteRule.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
