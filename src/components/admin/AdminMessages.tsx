import { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Mail, MessageCircle, Phone, Loader2, CheckCircle } from 'lucide-react';
import { translations } from '@/i18n';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useContactMessages, useUpdateContactMessage, ContactMessage } from '@/hooks/useContactMessages';
import { useToast } from '@/hooks/use-toast';

const statusLabels: Record<string, string> = {
  new: 'Nieuw',
  read: 'Gelezen',
  replied: 'Beantwoord',
};

const statusStyles: Record<string, string> = {
  new: 'bg-accent/20 text-accent-foreground',
  read: 'bg-muted text-muted-foreground',
  replied: 'bg-primary/10 text-primary',
};

export function AdminMessages() {
  const t = translations.nl;
  const { toast } = useToast();
  const { data: messages = [], isLoading, isError, error } = useContactMessages();
  const updateMessage = useUpdateContactMessage();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const handleOpenMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      try {
        await updateMessage.mutateAsync({ id: message.id, status: 'read' });
        setSelectedMessage({ ...message, status: 'read' });
      } catch (error) {
        toast({ title: t.common.error, variant: 'destructive' });
      }
    }
  };

  const handleStatusUpdate = async (status: 'read' | 'replied') => {
    if (!selectedMessage) return;
    try {
      await updateMessage.mutateAsync({ id: selectedMessage.id, status });
      setSelectedMessage((prev) => (prev ? { ...prev, status } : prev));
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

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : t.common.error;
    return (
      <div className="space-y-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            {t.admin.messages}
          </h1>
          <p className="text-muted-foreground mt-1">Alle contactvragen op één plek</p>
        </div>
        <div className="bg-destructive/10 text-destructive rounded-xl p-6">
          <p className="font-semibold mb-1">Vragen konden niet worden geladen.</p>
          <p className="text-sm">{errorMessage}</p>
          <p className="text-sm mt-3">
            Controleer of de database-migratie voor <span className="font-semibold">contact_messages</span> is uitgevoerd.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          {t.admin.messages}
        </h1>
        <p className="text-muted-foreground mt-1">Alle contactvragen op één plek</p>
      </div>

      <div className="bg-card rounded-xl shadow-soft overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Geen vragen ontvangen
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Naam</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefoon</TableHead>
                <TableHead>Bericht</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="text-sm">
                    {format(new Date(message.created_at), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.phone ?? '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[260px] truncate">
                    {message.message}
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[message.status] ?? 'bg-muted text-muted-foreground'}`}>
                      {statusLabels[message.status] ?? message.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenMessage(message)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Contactvraag</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Datum</p>
                  <p className="font-semibold">
                    {format(new Date(selectedMessage.created_at), 'PPP')}
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold">{statusLabels[selectedMessage.status] ?? selectedMessage.status}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedMessage.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm text-muted-foreground mb-1">Bericht</p>
                <p>{selectedMessage.message}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" asChild className="flex-1">
                  <a href={`mailto:${selectedMessage.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    E-mail
                  </a>
                </Button>
                <Button
                  variant="whatsapp"
                  asChild
                  className="flex-1"
                  disabled={!selectedMessage.phone}
                >
                  <a
                    href={selectedMessage.phone ? `https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}` : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => handleStatusUpdate('read')}>
                  Markeer als gelezen
                </Button>
                <Button onClick={() => handleStatusUpdate('replied')}>
                  Markeer als beantwoord
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
