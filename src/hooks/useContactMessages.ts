import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ContactMessageStatus = 'new' | 'read' | 'replied';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: ContactMessageStatus;
  language: 'en' | 'nl' | 'es';
  created_at: string;
  updated_at: string;
}

export function useContactMessages() {
  return useQuery({
    queryKey: ['contact_messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at' | 'status'> & { status?: ContactMessageStatus }) => {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          ...payload,
          status: payload.status ?? 'new',
        })
        .select()
        .single();

      if (error) throw error;
      return data as ContactMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_messages'] });
    },
  });
}

export function useUpdateContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ContactMessageStatus }) => {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ContactMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_messages'] });
    },
  });
}
