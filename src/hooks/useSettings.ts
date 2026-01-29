import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface SettingsMap {
  base_price: { amount: number };
  cleaning_fee: { amount: number };
  check_in_time: { time: string };
  check_out_time: { time: string };
  max_guests: { count: number };
  owner_email: { email: string };
  owner_phone: { phone: string };
  whatsapp_number: { number: string };
  currency: { code: string; symbol: string };
}

type SettingValue = SettingsMap[keyof SettingsMap];

// Fetch all settings (public)
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) throw error;

      // Convert array to a map for easier access
      const settingsMap: Record<string, SettingValue> = {};
      data.forEach((setting) => {
        settingsMap[setting.key] = setting.value as SettingValue;
      });

      return settingsMap as Partial<SettingsMap>;
    },
  });
}

// Get a specific setting with default value
export function useSetting<K extends keyof SettingsMap>(key: K, defaultValue: SettingsMap[K]) {
  const { data: settings, ...rest } = useSettings();
  return {
    data: settings?.[key] ?? defaultValue,
    ...rest,
  };
}

// Update a setting (admin only)
export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: Json }) => {
      const { data, error } = await supabase
        .from('settings')
        .update({ value })
        .eq('key', key)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}
