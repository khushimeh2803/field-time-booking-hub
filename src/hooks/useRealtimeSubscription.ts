
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

interface UseRealtimeSubscriptionProps {
  table: string;
  onEvent?: (payload: any) => void;
  events?: RealtimeEvent[];
}

export const useRealtimeSubscription = ({
  table,
  onEvent,
  events = ['INSERT', 'UPDATE', 'DELETE'],
}: UseRealtimeSubscriptionProps) => {
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      channel = supabase.channel(`realtime_${table}`);

      events.forEach((event) => {
        channel = channel.on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table,
          },
          (payload) => {
            console.log(`Realtime ${event} event on ${table}:`, payload);
            if (onEvent) onEvent(payload);
          }
        );
      });

      await channel.subscribe((status) => {
        console.log(`Realtime subscription status for ${table}:`, status);
      });
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, onEvent, events]);
};
