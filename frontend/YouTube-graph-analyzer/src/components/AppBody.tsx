import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import QueryForm from './QueryForm.tsx'
import { useMemo, useState } from 'react';
import Graph, { VideoGraphData } from './Graph.tsx';
import Tabs from './Tabs.tsx';
import DataTable from './DataTable.tsx';
import { VideoHistogram } from './VideoHistograms.tsx';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#6b6b6b',
    boxShadow: 'none',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: '#ffffff',
    height: '100%',
  }));

export type AttributeArray = any[];

  

export default function BasicGrid() {
  const [graphData, setGraphData] = useState<VideoGraphData | undefined>();

  type VideoAttributeMap = {
    rate: AttributeArray;
    ratings: AttributeArray;
    comments: AttributeArray;
    length: AttributeArray;
    views: AttributeArray;
  };

const extractVideoAttributes = (graphData: VideoGraphData | undefined): VideoAttributeMap => {
  if (!graphData){
    return {
      rate: [],
      ratings: [],
      comments: [],
      length: [],
      views: []
    };
  }
  const videos = graphData.data.video?.flat() ?? [];

  const getValue = (prop: any) =>
    typeof prop === 'object' && 'low' in prop ? prop.low : prop;

  return {
    rate: videos.map(v => [v.properties.id, v.properties.rate]),
    ratings: videos.map(v => [v.properties.id, getValue(v.properties.ratings)]),
    comments: videos.map(v => [v.properties.id, getValue(v.properties.comments)]),
    length: videos.map(v => [v.properties.id, getValue(v.properties.length)]),
    views: videos.map(v => [v.properties.id, getValue(v.properties.views)]),
  };
};

const histogramData = useMemo(() => extractVideoAttributes(graphData), [graphData]);


  return (
    <Box width='100%' sx={{ flexGrow: 1}}>
      <Grid container color={'#f5f5f5'} spacing={2}>
        <Grid size={6}>
          <Item><QueryForm graph={graphData} onChange={(g: VideoGraphData) => {setGraphData(g)}} /></Item>
        </Grid>
        <Grid size={6} color={'#f5f5f5'}>
          <Item>
          <Tabs 
            ItemOne={
              <Item> <Graph graph={graphData} /></Item>
            } 
            ItemTwo={
              <Item><DataTable graph={graphData} /> </Item>
            } 
            ItemThree={<Item> <VideoHistogram 
              rate={histogramData.rate} 
              ratings={histogramData.ratings} 
              length={histogramData.length} 
              comments={histogramData.comments} 
              views={histogramData.length}
            /></Item>} />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
