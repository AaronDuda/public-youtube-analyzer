import Box from "@mui/material/Box";
import { Chart } from "react-google-charts";
import { AttributeArray } from "./AppBody";

export type VideoHistogramProps = {
    rate: AttributeArray;
    ratings: AttributeArray;
    length: AttributeArray;
    comments: AttributeArray;
    views: AttributeArray;
}

export const options = (color: string) => ({
    title: "Average Rate",
    legend: { position: "none" },
    colors: [color],
  });
  

export function VideoHistogram(props: VideoHistogramProps) {
  return (
    <>
    <Box>
        <Chart
        chartType="Histogram"
        width="100%"
        height="400px"
        data={props.rate}
        options={options("green")}
        />
    </Box>
    <Box>
        <Chart
        chartType="Histogram"
        width="100%"
        height="400px"
        data={props.ratings}
        options={options("red")}
        />
    </Box>
    <Box>
        <Chart
        chartType="Histogram"
        width="100%"
        height="400px"
        data={props.comments}
        options={options("blue")}
        />
    </Box>
    <Box>
        <Chart
        chartType="Histogram"
        width="100%"
        height="400px"
        data={props.length}
        options={options("yellow")}
        />
    </Box>
    <Box>
        <Chart
        chartType="Histogram"
        width="100%"
        height="400px"
        data={props.views}
        options={options("brown")}
        />
    </Box>
    </>
  );
}