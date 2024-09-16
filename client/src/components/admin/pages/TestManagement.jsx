import { Box, Paper, Typography } from '@mui/material'
import React from 'react'

const TestManagement = () => {

  // const [tests, setTests] = useState([])

  // const fetchTests = async () => {  
    
  // }

  return (
    <Box sx={{ p: '1rem', height: '100%' }} spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: '600', color: 'GrayText', marginBottom: '.5rem' }}>
        Test Management
      </Typography>

      <Paper elevation={2} sx={{ padding: '1.5rem', minHeight: '100%', borderRadius: '1rem', display: { xs: 'row', sm: 'flex' }, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', bgcolor: 'white' }}>

        {

        }

      </Paper>
    </Box>
  )
}

export default TestManagement