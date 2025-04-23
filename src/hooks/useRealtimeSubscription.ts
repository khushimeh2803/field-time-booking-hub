
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

      // Build channel configuration with listeners for each event type
      const channelWithListeners = events.reduce((ch, event) => {
        return ch.on(
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
      }, channel);

      // Subscribe to the configured channel
      await channelWithListeners.subscribe((status) => {
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
