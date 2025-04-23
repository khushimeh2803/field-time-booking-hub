
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
      // Create a channel for this table
      channel = supabase.channel(`realtime_${table}`);

      // Subscribe to specified events
      events.forEach((event) => {
        channel = channel.on(
          'postgres_changes', // This is the correct event type for Supabase Realtime
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

      // Start subscribing
      await channel.subscribe();
    };

    setupSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, onEvent, events]);
};
