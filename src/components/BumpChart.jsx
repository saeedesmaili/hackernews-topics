// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bump
import { ResponsiveBump } from "@nivo/bump";

const CustomPointComponent = (props) => {
  const point = props.point;

  return (
    <g
      transform={`translate(${point.x}, ${point.y})`}
      style={{ pointerEvents: "none" }}
    >
      <rect
        x={point.size * -0.5 - 4}
        y={(point.size / 4) * -0.5 + 4}
        width={point.size + point.borderWidth}
        height={(point.size + point.borderWidth) / 4}
        fill="rgba(0, 0, 0, .07)"
      />
      <rect
        x={point.size * -0.5}
        y={(point.size / 4) * -0.5}
        width={point.size}
        height={point.size / 4}
        fill={point.color}
        stroke={point.borderColor}
        strokeWidth={point.borderWidth / 2}
      />
      <text
        textAnchor="middle"
        y={4}
        fill={point.borderColor}
        fontSize={13}
        fontWeight={point.isActive ? 700 : 400}
      >
        {point.serie.id}
      </text>
    </g>
  );
};

const BumpChart = ({ data, highlights, onClick }) => (
  <ResponsiveBump
    data={data}
    colors={(d) => {
      if (d.id === highlights[0]) return "red";
      if (d.id === highlights[1]) return "green";
      if (d.id === highlights[2]) return "blue";
      return "gray";
    }}
    lineWidth={(d) => {
      if (highlights.includes(d.id)) return 3;
      return 0;
    }}
    activeLineWidth={6}
    inactiveLineWidth={(d) => {
      if (highlights.includes(d.id)) return 3;
      return 0;
    }}
    inactiveOpacity={0.15}
    startLabel={false}
    endLabel={false}
    xPadding={1}
    xOuterPadding={0.4}
    axisTop={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "",
      legendPosition: "middle",
      legendOffset: -36,
    }}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "",
      legendPosition: "middle",
      legendOffset: 32,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "",
      legendPosition: "middle",
      legendOffset: 32,
    }}
    axisRight={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "",
      legendPosition: "middle",
      legendOffset: 32,
    }}
    margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
    onClick={onClick}
    theme={{
      text: { fontSize: 21 },
      axis: { ticks: { text: { fontSize: 12 } } },
    }}
    pointComponent={CustomPointComponent}
    enableGridX={false}
    enableGridY={false}
    opacity={0.3}
    pointSize={80}
    activePointSize={80}
    inactivePointSize={80}
    pointBorderWidth={1}
    activePointBorderWidth={4}
    inactivePointBorderWidth={1}
    pointColor="#ffffff"
    pointBorderColor={{ from: "serie.color" }}
  />
);
export default BumpChart;
