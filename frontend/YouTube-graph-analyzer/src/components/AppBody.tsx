import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import QueryForm from './QueryForm.tsx'
import { useState } from 'react';
import Graph, { VideoGraphData } from './Graph.tsx';
import Tabs from './Tabs.tsx';
import DataTable from './DataTable.tsx';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#6b6b6b',
    boxShadow: 'none',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: '#ffffff',
    height: '100%',
  }));


  

export default function BasicGrid() {
  const [graphData, setGraphData] = useState<VideoGraphData | undefined>();

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
            ItemThree={<Item> <Graph graph={graphData} /></Item>} />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
