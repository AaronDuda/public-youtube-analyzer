import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { YouTube } from '@mui/icons-material';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" enableColorOnDark>
        <Toolbar>
          <IconButton
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <YouTube />
          </IconButton>
          <Typography align="left" variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: "boldonse", color: 'white' }}>
            YouTube Data Analyzer
          </Typography>
          <Button color="inherit" size="large" href='https://neo4j.com' target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.simpleicons.org/neo4j" alt="Neo4j logo"></img>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
