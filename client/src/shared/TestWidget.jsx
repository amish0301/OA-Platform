import { Paper, Typography } from '@mui/material'
import React from 'react'
import CustomInfoIcon from './InfoIcon'

const TestWidget = ({ title, value, info }) => {
    return (
        <Paper elevation={2} sx={{ padding: '1rem 1.5rem', borderRadius: '.4rem', margin: '1rem 0', minWidth: '16rem' }}>
            <CustomInfoIcon content={info} title={title} />
            <Typography variant='h5' component={'div'} sx={{ color: 'rgba(0,0,0,0.7)', fontWeight: '600', textAlign: 'left', marginTop: '1rem' }}>{value}</Typography>
        </Paper>
    )
}

export default TestWidget