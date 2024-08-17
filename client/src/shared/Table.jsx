import React from 'react'
import { Container, Paper, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';

const Table = ({ rows, cols, heading, rowHeight = 52 }) => {
    return (
        <Container sx={{ height: '80vh' }}>
            <Paper elevation={3} sx={{ padding: '1rem 4rem', borderRadius: '1rem', margin: 'auto', width: '100%', overflow: 'hidden', height: '100%', boxShadow: 'none' }}>
                <Typography textAlign={'center'} variant='h4' sx={{ margin: '2rem 0', textTransform: 'uppercase' }}>{heading}</Typography>
                <DataGrid rows={rows} columns={cols} rowHeight={rowHeight} disableColumnMenu disableColumnSelector disableDensitySelector disableSelectionOnClick style={{ height: '80%', }} sx={{
                    border: 'none', '.table-header': {
                        bgcolor: '#030303', color: 'white'
                    },
                    '.MuiDataGrid-cell': {
                        display: 'flex',
                        justifyContent: 'left',
                        alignItems: 'center',
                        padding: '0 1rem',
                    },

                }} />
            </Paper>
        </Container>
    )
}

export default Table