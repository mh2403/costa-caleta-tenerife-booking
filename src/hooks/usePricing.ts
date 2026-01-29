import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type PricingRule = Tables<'pricing_rules'>;
export type PricingRuleInsert = TablesInsert<'pricing_rules'>;
export type PricingRuleUpdate = TablesUpdate<'pricing_rules'>;

// Fetch all active pricing rules (public)
export function usePricingRules() {
  return useQuery({
    queryKey: ['pricing-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_rules')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as PricingRule[];
    },
  });
}

// Fetch all pricing rules including inactive (admin)
export function useAllPricingRules() {
  return useQuery({
    queryKey: ['pricing-rules-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_rules')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as PricingRule[];
    },
  });
}

// Create a pricing rule (admin only)
export function useCreatePricingRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rule: PricingRuleInsert) => {
      const { data, error } = await supabase
        .from('pricing_rules')
        .insert(rule)
        .select()
        .single();

      if (error) throw error;
      return data as PricingRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-rules'] });
      queryClient.invalidateQueries({ queryKey: ['pricing-rules-all'] });
    },
  });
}

// Update a pricing rule (admin only)
export function useUpdatePricingRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: PricingRuleUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('pricing_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as PricingRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-rules'] });
      queryClient.invalidateQueries({ queryKey: ['pricing-rules-all'] });
    },
  });
}

// Delete a pricing rule (admin only)
export function useDeletePricingRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pricing_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-rules'] });
      queryClient.invalidateQueries({ queryKey: ['pricing-rules-all'] });
    },
  });
}
