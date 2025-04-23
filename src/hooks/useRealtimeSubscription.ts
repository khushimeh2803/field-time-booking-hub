
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

interface UseRealtimeSubscriptionProps {
  table: string;
  onEvent?: (payload: RealtimePostgresChangesPayload<any>) => void;
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
      // Create a channel with table name for better identification
      channel = supabase.channel(`realtime:${table}`);

      // Add listeners for each event type individually
      events.forEach((event) => {
        channel.on(
          'postgres_changes', 
          { 
            event, 
            schema: 'public', 
            table 
          }, 
          (payload) => {
            console.log(`Realtime ${event} event on ${table}:`, payload);
            if (onEvent) onEvent(payload);
          }
        );
      });

      // Subscribe to the channel after adding all listeners
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
