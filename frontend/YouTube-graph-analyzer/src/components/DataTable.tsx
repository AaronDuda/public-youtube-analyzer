import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { VideoGraphData } from './Graph';

export type DataTableProps = {
    graph: VideoGraphData | undefined;
}

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Video ID',
  },
  {
    id: 'views',
    numeric: true,
    disablePadding: false,
    label: 'Views',
  },
  {
    id: 'ratings',
    numeric: true,
    disablePadding: false,
    label: 'Ratings',
  },
  {
    id: 'rate',
    numeric: true,
    disablePadding: false,
    label: 'Average rating',
  },
  {
    id: 'comments',
    numeric: true,
    disablePadding: false,
    label: 'Comments',
  },
  {
    id: 'age',
    numeric: true,
    disablePadding: false,
    label: 'Date',
  },
];


export default function dataTable(props: DataTableProps) {
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);


  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (props?.graph?.data ? props.graph.data.video[0].length : 0)) : 0;

  const visibleRows = React.useMemo(
    () => {
      if (props?.graph?.data) {
        return [...props.graph.data.video[0]].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      } else {
        return []
      }
    },
    [page, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
      <Toolbar><Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">Records</Typography></Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <TableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                    >
                        {headCell.label}
                    </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, index) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell
                      component="th"
                      id={index.toString()}
                      scope="row"
                      padding="none"
                    >
                      {row.properties.id}
                    </TableCell>
                    <TableCell align="right">{row.properties.views.low}</TableCell>
                    <TableCell align="right">{row.properties.ratings.low}</TableCell>
                    <TableCell align="right">{row.properties.rate}</TableCell>
                    <TableCell align="right">{row.properties.comments.low}</TableCell>
                    <TableCell align="right">{row.properties.age.low}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={props?.graph?.data ? props.graph.data.video[0].length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
