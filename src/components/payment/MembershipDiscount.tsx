
import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MembershipDiscountProps {
  userId: string;
  onMembershipApplied: (discount: number, membershipName: string) => void;
}

const MembershipDiscount = ({ userId, onMembershipApplied }: MembershipDiscountProps) => {
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<any>(null);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        // Get active membership for current user
        const { data, error } = await supabase
          .from('user_memberships')
          .select(`
            *,
            plan_id (
              name,
              discount_percentage
            )
          `)
          .eq('user_id', userId)
          .gte('end_date', new Date().toISOString())
          .order('end_date', { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          setMembership(data);
          onMembershipApplied(
            data.plan_id.discount_percentage,
            data.plan_id.name
          );
        }
      } catch (error) {
        console.error("Error fetching membership:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMembership();
    } else {
      setLoading(false);
    }
  }, [userId, onMembershipApplied]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Checking membership status...</span>
      </div>
    );
  }

  if (!membership) {
    return null;
  }

  return (
    <div className="mb-6 bg-green-50 p-4 rounded-md border border-green-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-green-800">Membership Discount Applied</h3>
          <p className="text-sm text-green-700">
            Your {membership.plan_id.name} membership gives you {membership.plan_id.discount_percentage}% discount!
          </p>
        </div>
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Active
        </Badge>
      </div>
    </div>
  );
};

export default MembershipDiscount;
