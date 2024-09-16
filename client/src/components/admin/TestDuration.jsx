import { Button, TextField } from '@mui/material';
import React, { useState } from 'react'
import { setIsEditTestDuration, setTestDuration } from '../../redux/slices/admin';
import { useSelector } from 'react-redux';

const TestDuration = ({ testDuration, dispatch }) => {
    const [duration, setDuration] = useState(testDuration || '');

    const { isEditTestDuration } = useSelector(state => state.admin);

    const handleIsEditTestDuration = () => {
        dispatch(setIsEditTestDuration(true));
    }

    const handleSaveTestDuration = () => {
        dispatch(setTestDuration(duration));
        dispatch(setIsEditTestDuration(false));
    }
    return (
        <div className='space-x-2 flex items-center'>
            <TextField
                label="Test Duration"
                variant="outlined"
                size='medium'
                sx={{ p: '.5rem', mt: '.5rem' }}
                value={duration}
                onChange={e => setDuration(e.target.value)}
                helperText="Enter Test Duration in Minutes"
                placeholder='eg. 30/40/60 min'
                disabled={!isEditTestDuration}
            />
            <Button
                variant='contained'
                sx={{ mt: '1rem 0', padding: '0.5rem 1rem', bgcolor: '#286675' }}
                onClick={isEditTestDuration ? handleSaveTestDuration : handleIsEditTestDuration}
            >
                {isEditTestDuration ? 'Save' : 'Edit'}
            </Button>
        </div>
    )
}

export default TestDuration