
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  data: Array<{ name: string; bookings: number }>;
}

const BookingsBarChart = ({ data }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>Bookings Over Time</CardTitle>
    </CardHeader>
    <CardContent className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default BookingsBarChart;
