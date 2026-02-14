import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { bookingFlowConfig } from '@/lib/bookingFlowConfig';

export type Booking = Tables<'bookings'>;
export type BookingInsert = TablesInsert<'bookings'>;
export type BookingUpdate = TablesUpdate<'bookings'>;
export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled';
export type BookingDossier = Database['public']['Functions']['get_booking_dossier']['Returns'][number];
export type PublicBookingCreateResult = {
  id: string;
  public_token: string | null;
};
export type PublicSignedContractUploadResult = Database['public']['Functions']['submit_signed_contract']['Returns'][number];
type LegacySignedContractResult = Database['public']['Functions']['sign_booking_contract']['Returns'][number];
export type PublicReviewResult = Database['public']['Functions']['submit_booking_review']['Returns'][number];

const getBookingDossierQueryKey = (token: string) => ['booking-dossier', token] as const;

// Fetch all bookings (admin only)
export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
  });
}

// Create a new booking (public)
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: BookingInsert) => {
      const normalizedBooking: BookingInsert = {
        guest_name: booking.guest_name?.trim() ?? '',
        guest_email: booking.guest_email?.trim() ?? '',
        guest_phone: booking.guest_phone?.trim() ?? '',
        check_in: booking.check_in,
        check_out: booking.check_out,
        num_guests: Math.max(1, booking.num_guests ?? 1),
        message: booking.message ?? null,
        language: booking.language ?? 'en',
        total_price: booking.total_price,
        cleaning_fee: bookingFlowConfig.cleaningFee,
        deposit_amount: Number((Number(booking.total_price) * bookingFlowConfig.depositRatio).toFixed(2)),
        status: 'pending',
      };

      const checkInDate = new Date(normalizedBooking.check_in);
      const checkOutDate = new Date(normalizedBooking.check_out);
      const diffMs = checkOutDate.getTime() - checkInDate.getTime();
      const nights = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (nights < bookingFlowConfig.minStayNights) {
        throw new Error(`Minimum stay is ${bookingFlowConfig.minStayNights} nights`);
      }

      // Primary path: RPC keeps server-side validation centralized.
      const { data, error: rpcError } = await supabase.rpc('create_public_booking', {
        _guest_name: normalizedBooking.guest_name,
        _guest_email: normalizedBooking.guest_email,
        _guest_phone: normalizedBooking.guest_phone,
        _check_in: normalizedBooking.check_in,
        _check_out: normalizedBooking.check_out,
        _num_guests: normalizedBooking.num_guests ?? 1,
        _message: normalizedBooking.message ?? null,
        _language: normalizedBooking.language ?? 'en',
        _total_price: normalizedBooking.total_price,
        _cleaning_fee: bookingFlowConfig.cleaningFee,
      });

      if (!rpcError) {
        const created = data?.[0];
        if (!created) {
          throw new Error('Booking could not be created');
        }

        return {
          id: created.id,
          public_token: created.public_token ?? null,
        } as PublicBookingCreateResult;
      }

      const rpcMessage = `${rpcError.code ?? ''} ${rpcError.message ?? ''}`.toLowerCase();
      const canFallback =
        rpcError.code === '42883' ||
        rpcMessage.includes('create_public_booking') ||
        rpcMessage.includes('gen_random_bytes');

      if (!canFallback) {
        throw new Error(`Booking create failed (rpc: ${rpcError.message})`);
      }

      const generatedToken =
        typeof globalThis.crypto?.randomUUID === 'function'
          ? globalThis.crypto.randomUUID().replace(/-/g, '')
          : `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;

      // Controlled fallback for environments where RPC/migration is not available yet.
      const fallbackPayloadWithToken: BookingInsert = {
        ...normalizedBooking,
        cleaning_fee: bookingFlowConfig.cleaningFee,
        public_token: generatedToken,
      };

      const { error: directWithTokenError } = await supabase
        .from('bookings')
        .insert(fallbackPayloadWithToken);

      if (!directWithTokenError) {
        return {
          id: '',
          public_token: generatedToken,
        } as PublicBookingCreateResult;
      }

      // Backward compatibility: legacy schema without public_token column.
      const { error: directLegacyError } = await supabase
        .from('bookings')
        .insert(normalizedBooking);

      if (!directLegacyError) {
        return {
          id: '',
          public_token: null,
        } as PublicBookingCreateResult;
      }

      throw new Error(
        `Booking create failed (rpc: ${rpcError.message}; fallback_token: ${directWithTokenError.message}; fallback_legacy: ${directLegacyError.message})`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

// Update booking status (admin only)
export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: BookingUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking-dossier'] });
    },
  });
}

// Delete a booking (admin only)
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking-dossier'] });
    },
  });
}

// Get booked date ranges (for public calendar)
export function useBookedDates() {
  return useQuery({
    queryKey: ['booked-dates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('check_in, check_out')
        .in('status', ['pending', 'confirmed']);

      if (error) throw error;
      return data.map(b => ({
        start: new Date(b.check_in),
        end: new Date(b.check_out),
      }));
    },
  });
}

export function usePublicBookingDossier(token: string | null) {
  return useQuery({
    queryKey: token ? getBookingDossierQueryKey(token) : ['booking-dossier', 'missing-token'],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_booking_dossier', {
        _token: token as string,
      });

      if (error) throw error;
      return (data?.[0] ?? null) as BookingDossier | null;
    },
  });
}

export function useSubmitSignedBookingContractByToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ token, filePath }: { token: string; filePath: string }) => {
      const { data, error } = await supabase.rpc('submit_signed_contract', {
        _token: token,
        _file_path: filePath,
      });

      if (error) {
        const rpcMessage = `${error.code ?? ''} ${error.message ?? ''}`.toLowerCase();
        const canFallback =
          error.code === '42883' ||
          rpcMessage.includes('submit_signed_contract') ||
          rpcMessage.includes('function') ||
          rpcMessage.includes('does not exist');

        if (!canFallback) throw error;

        // Legacy backend fallback: mark contract as signed even if the new RPC is not available yet.
        const { data: legacyData, error: legacyError } = await supabase.rpc('sign_booking_contract', {
          _token: token,
          _full_name: '',
        });

        if (legacyError) throw legacyError;

        const legacyResult = legacyData?.[0] as LegacySignedContractResult | undefined;
        if (!legacyResult?.success) {
          throw new Error('Signed contract could not be saved');
        }

        return {
          success: true,
          uploaded_at: legacyResult.signed_at ?? new Date().toISOString(),
        } as PublicSignedContractUploadResult;
      }

      const result = data?.[0];
      if (!result?.success) {
        throw new Error('Signed contract could not be saved');
      }

      return result as PublicSignedContractUploadResult;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getBookingDossierQueryKey(variables.token) });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useSubmitBookingReviewByToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      token,
      author,
      rating,
      review,
    }: {
      token: string;
      author: string;
      rating: number;
      review: string;
    }) => {
      const { data, error } = await supabase.rpc('submit_booking_review', {
        _token: token,
        _author: author,
        _rating: rating,
        _review: review,
      });

      if (error) throw error;

      const result = data?.[0];
      if (!result?.success) {
        throw new Error('Review could not be submitted');
      }

      return result as PublicReviewResult;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getBookingDossierQueryKey(variables.token) });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
