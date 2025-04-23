
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
      // Create a channel with a specific name to avoid conflicts
      channel = supabase.channel(`realtime:${table}`);

      // Add event listeners for each specified event type
      events.forEach((event) => {
        channel = channel.on(
          'postgres_changes',
          { 
            event: event, 
            schema: 'public', 
            table: table 
          },
          (payload) => {
            console.log(`Realtime ${event} event on ${table}:`, payload);
            if (onEvent) onEvent(payload);
          }
        );
      });

      // Subscribe to the channel and handle connection status
      await channel.subscribe((status) => {
        console.log(`Realtime subscription status for ${table}:`, status);
      });
    };

    setupSubscription();

    // Cleanup function to remove the channel when component unmounts
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, onEvent, events]);
};

