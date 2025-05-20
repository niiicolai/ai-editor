import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, Legend, Label } from 'recharts';

export default function LineChartComponent({
  data,
  y1Label = "Value 1",
  y2Label = "Value 2",
  y3Label = "Value 3"
}: {
  /**
   * The data array for the chart.
   * Each object should have:
   *  - x: number (X axis value)
   *  - y1: number (First line value)
   *  - y2: number (Second line value)
   *  - y3: number (Third line value)
   *  - name?: string (Optional name for the data point)
   */
  data: Array<{
    x: number;
    y1: number;
    y2: number;
    y3: number;
    name?: string;
  }>;
  /**
   * Label for y1 line
   */
  y1Label?: string;
  /**
   * Label for y2 line
   */
  y2Label?: string;
  /**
   * Label for y3 line
   */
  y3Label?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid />
        <XAxis dataKey="x" name="X Axis">
          <Label value="X Axis" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="Y Axis" angle={-90} position="insideLeft" />
        </YAxis>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y1" name={y1Label} stroke="#8884d8" />
        <Line type="monotone" dataKey="y2" name={y2Label} stroke="#82ca9d" />
        <Line type="monotone" dataKey="y3" name={y3Label} stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );
}
