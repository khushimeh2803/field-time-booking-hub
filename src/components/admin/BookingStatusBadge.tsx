
import { Badge } from "@/components/ui/badge";

interface BookingStatusBadgeProps {
  status: string;
}

const BookingStatusBadge = ({ status }: BookingStatusBadgeProps) => {
  const getVariantAndColor = () => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return {
          variant: "outline" as const,
          className: "bg-green-100 text-green-800 border-green-200"
        };
      case 'pending':
        return {
          variant: "outline" as const,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200"
        };
      case 'cancelled':
        return {
          variant: "outline" as const,
          className: "bg-red-100 text-red-800 border-red-200"
        };
      case 'completed':
        return {
          variant: "outline" as const,
          className: "bg-blue-100 text-blue-800 border-blue-200"
        };
      default:
        return {
          variant: "outline" as const,
          className: "bg-gray-100 text-gray-800 border-gray-200"
        };
    }
  };

  const { variant, className } = getVariantAndColor();

  return (
    <Badge variant={variant} className={className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default BookingStatusBadge;
