import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BiSolidEdit as EditIcon } from "react-icons/bi";
import { RxCross2 as CrossIcon } from "react-icons/rx";
import { FaCheck as CheckIcon } from "react-icons/fa6";
import CustomAccordian from '../../../shared/Accordian';
import { questions } from '../../../constants/sampleData';
import { useDispatch, useSelector } from 'react-redux';
import { setIsEditTestName } from '../../../redux/slices/admin';
import QuestionList from '../QuestionList';

const CreateTest = () => {

  const [name, setName] = useState('Test Name');
  const dispatch = useDispatch();
  const { isEditTestName } = useSelector(state => state.admin);

  useEffect(() => {

  }, [dispatch])


  return (
    <Stack sx={{ p: '1rem', height: '100%' }} spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: '600', color: 'GrayText', marginBottom: '.5rem' }}>
        Create Test
      </Typography>
      <Paper elevation={2} sx={{ padding: '1.5rem', minHeight: '100%', borderRadius: '1rem', display: { xs: 'row', sm: 'flex' }, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', bgcolor: 'white' }}>

        {/* left */}
        <Box sx={{ width: { xs: '100%', sm: '50%' }, height: '100%', overflowY: 'auto' }}>
          <Stack direction={'row'} sx={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '.5rem' }}>
            {
              !isEditTestName ? <Typography variant='h6' sx={{ width: '100%', fontWeight: '600', color: 'GrayText' }}>{name}</Typography> : <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            }
            {
              !isEditTestName ? <div className='create_test_edit' onClick={() => dispatch(setIsEditTestName(!isEditTestName))}>
                <EditIcon style={{ color: 'green', fontSize: '1.2rem' }} />
                <span style={{ marginLeft: '.3rem', color: 'green' }}>Edit Testname</span>
              </div> : (
                <div className='space-x-2 flex items-center'>
                  <IconButton onClick={() => dispatch(setIsEditTestName(false))} size='medium'>
                    <CrossIcon className='text-red-500' />
                  </IconButton>
                  <IconButton onClick={() => dispatch(setIsEditTestName(false))} size='medium'>
                    <CheckIcon className='text-green-500' />
                  </IconButton>
                </div>
              )
            }
          </Stack>

          <Stack direction={'column'} sx={{ width: '100%', padding: '0 2rem', marginTop: '2rem' }} spacing={3}>
            <CustomAccordian title={'Questions'} content={questions} index={1} />
            <CustomAccordian title={'Results'} content={'See results'} />
            <CustomAccordian title={'Time Settings'} content={'timer'} />
          </Stack>
        </Box>

        {/* right */}
        <Box sx={{ width: { xs: '100%', sm: '50%', overflowY: 'auto' }, maxHeight: '100%' }}>
          <Box sx={{ width: '100%', height: '100%', overflowY: 'auto', padding: '1rem', border: '1px solid black', borderRadius: '1rem' }}>
            <QuestionList questions={questions} />
          </Box>
        </Box>
      </Paper>
    </Stack>
  )
}

// for rendering questions - we can resue same questionList component with optional rendernig

export default CreateTest