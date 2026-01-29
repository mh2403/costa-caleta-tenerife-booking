import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type BlockedDate = Tables<'blocked_dates'>;
export type BlockedDateInsert = TablesInsert<'blocked_dates'>;

// Fetch all blocked dates (public for availability check)
export function useBlockedDates() {
  return useQuery({
    queryKey: ['blocked-dates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data.map((b) => ({
        ...b,
        start: new Date(b.start_date),
        end: new Date(b.end_date),
      }));
    },
  });
}

// Create blocked date range (admin only)
export function useCreateBlockedDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blocked: BlockedDateInsert) => {
      const { data, error } = await supabase
        .from('blocked_dates')
        .insert(blocked)
        .select()
        .single();

      if (error) throw error;
      return data as BlockedDate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-dates'] });
    },
  });
}

// Delete a blocked date range (admin only)
export function useDeleteBlockedDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-dates'] });
    },
  });
}
