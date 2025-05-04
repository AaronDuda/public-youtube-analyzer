import { useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
    Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Categories from './Categories';
import { Dayjs } from 'dayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import axios from 'axios';
import { NEO4J_SERVER_ADDRESS, YOUTUBE_DATE } from './Constants';
import { VideoGraphData } from './Graph';

export type QueryFormProps = {
    graph: VideoGraphData | undefined;
    onChange: (g: VideoGraphData) => void;
}


export default function QueryForm(props: QueryFormProps) {
    const [id, setID]                   = useState<string | undefined>();
    const [uploader, setUploader]       = useState<string | undefined>();
    const [lrate, setLrate]             = useState<number | undefined>();
    const [hrate, setHrate]             = useState<number | undefined>();
    const [lRatings, setLRatings]       = useState<number | undefined>();
    const [hRatings, setHRatings]       = useState<number | undefined>();
    const [lComments, setLComments]     = useState<number | undefined>();
    const [hComments, setHComments]     = useState<number | undefined>();
    const [lLength, setLLength]         = useState<number | undefined>();
    const [hLength, setHLength]         = useState<number | undefined>();
    const [lViews, setLViews]           = useState<number | undefined>();
    const [hViews, setHViews]           = useState<number | undefined>();
    const [categories, setCategories]   = useState<string[]>([]);
    const [excludeV, setExcludeV]       = useState<boolean>(false);
    const [excludeU, setExcludeU]       = useState<boolean>(false);
    const [excludeC, setExcludeC]       = useState<boolean>(false);
    const [dateRange, setDateRange]     = useState<{startDate: Dayjs | undefined, endDate: Dayjs | undefined}>({startDate: undefined, endDate: undefined});
    const [limit, setLimit]             = useState<number | undefined>();

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log('making request');
        axios.get(NEO4J_SERVER_ADDRESS + '/search', {
            params: {
              id: id,
              uploader: uploader,
              lrate: lrate,
              hrate: hrate,
              lRatings: lRatings,
              hRatings: hRatings,
              lComments: lComments,
              hComments: hComments,
              lLength: lLength,
              hLength: hLength,
              lViews: lViews,
              hViews: hViews,
              startDate: dateRange.startDate?.diff(YOUTUBE_DATE, 'day'),
              endDate: dateRange.endDate?.diff(YOUTUBE_DATE, 'day'),
              categories: categories,
              excludeC: excludeC,
              excludeU: excludeU,
              excludeV: excludeV,
              limit: limit
            }
        })
        .then(response => {
            props.onChange(response.data as VideoGraphData)
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    };


    function handleStartDateChange(value: PickerValue, context: any): void {
        if (!context) {
            let temp = dateRange;
            temp.startDate = value as Dayjs;
            setDateRange(temp);
        }
    }

    function handleEndDateChange(value: PickerValue, context: any): void {
        if (!context) {
            let temp = dateRange;
            temp.endDate = value as Dayjs;
            setDateRange(temp);
        }
    }

    return (
        <>
            <Typography sx={{ flexGrow: 1, fontFamily: "boldonse", color: 'white' }}>Build a Query</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                    component="form"
                    sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400}}
                    onSubmit={handleSubmit}
                    borderColor='white'

                >
                <TextField
                    label="Video ID (type 'any' for all videos)"
                    value={id}
                    onChange={(e) => setID(e.target.value)}
                />

                <TextField
                    label="Uploader (type 'any' for all uploaders)"
                    value={uploader}
                    onChange={(e) => setUploader(e.target.value)}
                />

                <Categories selectedItems={categories} onChange={function (value: string[]): void {setCategories(value)} } />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                    label="Least comments"
                    value={lComments}
                    onChange={(e) => setLComments(Number.parseInt(e.target.value) || undefined)}
                />
                <Typography sx={{ fontFamily: "boldonse", color: 'white' }}> - </Typography>
                <TextField
                    label="Most comments"
                    value={hComments}
                    onChange={(e) => setHComments(Number.parseInt(e.target.value) || undefined)}
                />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DatePicker
                    label="Start date"
                    value={dateRange.startDate}
                    onChange={handleStartDateChange}
                />
                <Typography sx={{ fontFamily: "boldonse", color: 'white' }}> - </Typography>
                <DatePicker
                    label="End date"
                    value={dateRange.endDate}
                    onChange={handleEndDateChange}
                />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        label="Least ratings"
                        value={lRatings}
                        inputMode='numeric'
                        onChange={(e) => setLRatings(Number.parseInt(e.target.value) || undefined)}
                    />
                    <Typography sx={{ fontFamily: "boldonse", color: 'white' }}> - </Typography>
                    <TextField
                        label="Most ratings"
                        value={hRatings}
                        inputMode='numeric'
                        onChange={(e) => setHRatings(Number.parseInt(e.target.value) || undefined)}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        label="Lowest average rating"
                        value={lrate}
                        onChange={(e) => setLrate(Number.parseInt(e.target.value) || undefined)}
                    />
                    <Typography sx={{ fontFamily: "boldonse", color: 'white' }}> - </Typography>
                    <TextField
                        label="Highest average ratings"
                        value={hrate}
                        onChange={(e) => setHrate(Number.parseInt(e.target.value) || undefined)}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        label="Least views"
                        value={lViews}
                        onChange={(e) => setLViews(Number.parseInt(e.target.value) || undefined)}
                    />
                    <Typography sx={{ fontFamily: "boldonse", color: 'white' }}> - </Typography>
                    <TextField
                        label="Most views"
                        value={hViews}
                        onChange={(e) => setHViews(Number.parseInt(e.target.value) || undefined)}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        label="Least length"
                        value={lLength}
                        onChange={(e) => setLLength(Number.parseInt(e.target.value) || undefined)}
                    />
                    <Typography sx={{ fontFamily: "boldonse", color: 'white' }}> - </Typography>
                    <TextField
                        label="Most length"
                        value={hLength}
                        onChange={(e) => setHLength(Number.parseInt(e.target.value) || undefined)}
                    />
                </Box>

                <TextField
                    label="Set output limit"
                    value={limit}
                    onChange={(e) => setLimit(Number.parseInt(e.target.value) || undefined)}
                />

                <FormGroup>
                    <FormControlLabel control={<Checkbox onChange={(_e, checked) => {setExcludeV(checked)} }/>} label="Exclude Videos" />
                    <FormControlLabel control={<Checkbox onChange={(_e, checked) => {setExcludeU(checked)} }/>} label="Exclude Uploaders" />
                    <FormControlLabel control={<Checkbox onChange={(_e, checked) => {setExcludeC(checked)} }/>} label="Exclude Categories" />
                </FormGroup>

                <Button type="submit" variant="contained">
                Submit
                </Button>
                </Box>
            </LocalizationProvider>
        </>
    );
}
