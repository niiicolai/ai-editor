import { ResponsiveContainer, ScatterChart, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Scatter } from 'recharts';

export default function BubbleChartComponent({
    data
}: {
    data: Array<{
        x: number;
        y: number;
        z: number;
        name: string;
    }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis dataKey="x" name="X Axis" />
        <YAxis dataKey="y" name="Y Axis" />
        <ZAxis dataKey="z" range={[100, 1000]} name="Size" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Samples" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
