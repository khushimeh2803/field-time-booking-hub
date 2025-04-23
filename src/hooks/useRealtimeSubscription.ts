
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
      // Create a unique channel for each table
      channel = supabase.channel(`realtime:${table}`);

      // Add listeners for each event type
      events.forEach((event) => {
        channel = channel.on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table,
          },
          (payload: RealtimePostgresChangesPayload<any>) => {
            console.log(`Realtime ${event} event on ${table}:`, payload);
            onEvent?.(payload);
          }
        );
      });

      // Subscribe to the channel
      await channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to ${table}`);
        } else if (status === 'CLOSED') {
          console.log(`Subscription closed for ${table}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to ${table}`);
        }
      });
    };

    setupSubscription().catch(console.error);

    return () => {
      if (channel) {
        console.log(`Cleaning up subscription for ${table}`);
        supabase.removeChannel(channel);
      }
    };
  }, [table, onEvent, events]);
};

