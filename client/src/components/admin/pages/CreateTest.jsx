import { Box, Button, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { BiSolidEdit as EditIcon } from "react-icons/bi";
import { FaCheck as CheckIcon } from "react-icons/fa6";
import { RxCross2 as CrossIcon } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../../../hooks/useAxios';
import { resetAdminState, setIsEditTestName, setTestName } from '../../../redux/slices/admin';
import CustomAccordian from '../../../shared/Accordian';
import QuestionList from '../QuestionList';
import Loader from '../../Loader';

const CreateTest = () => {

  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { isEditTestName, questions, testName, testDuration, categories, testDescription } = useSelector(state => state.admin);

  const closeEditTestName = () => {
    dispatch(setIsEditTestName(false));
    setName('');
  }

  const setTestNameHandler = () => {
    dispatch(setTestName(name));
    closeEditTestName();
  }

  const createTestHandler = async (e) => {
    e.preventDefault();

    if (!questions.length || !categories.length) return toast.error('Please add questions or categories');

    const formData = new FormData();
    formData.append('name', testName);
    formData.append('duration', testDuration);
    formData.append('categories', JSON.stringify(categories));
    formData.append('questions', JSON.stringify(questions));
    formData.append('description', testDescription);


    // API call to create test
    const config = {
      'Content-Type': 'multipart/form-data',
    };

    const toastId = toast.loading('Creating test...');
    setIsLoading(true);

    try {
      const res = await axiosInstance.post('/test/create', formData, config);
      toast.update(toastId, { render: res.data.message, type: 'success', isLoading: false, autoClose: 1000 });
      dispatch(resetAdminState());
    } catch (error) {
      toast.update(toastId, { render: error.response.data.message, type: 'error', isLoading: false, autoClose: 1500 });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <Loader show={isLoading} />

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
              !isEditTestName ? <Typography variant='h6' sx={{ width: '100%', fontWeight: '600', color: 'GrayText' }}>{
                testName ? testName : 'Test Name'
              }</Typography> : <TextField label="Test Name" variant="outlined" size='small' sx={{ p: '.5rem', mt: '.5rem' }} onChange={(e) => setName(e.target.value)} />
            }
            {
              !isEditTestName ? <div className='create_test_edit' onClick={() => dispatch(setIsEditTestName(true))}>
                <EditIcon style={{ color: 'green', fontSize: '1.2rem' }} />
                <span style={{ marginLeft: '.3rem', color: 'green' }}>Edit Testname</span>
              </div> : (
                <div className='space-x-2 flex items-center'>
                  <IconButton onClick={closeEditTestName} size='medium'>
                    <CrossIcon className='text-red-500' />
                  </IconButton>
                  <IconButton onClick={setTestNameHandler} size='medium'>
                    <CheckIcon className='text-green-500' />
                  </IconButton>
                </div>
              )
            }
          </Stack>

          <Stack direction={'column'} sx={{ width: '100%', padding: '0 2rem', marginTop: '2rem' }} spacing={3}>
            <CustomAccordian title={'Questions'} content={questions} index={1} />
            <CustomAccordian title={'Results'} index={2} />
            <CustomAccordian title={'Test Duration'} index={3} />
            <CustomAccordian title={'Add Category'} index={4} />
            <CustomAccordian title={'Add Description'} index={5} />
          </Stack>
        </Box>

        {/* right */}
        <Box sx={{ width: { xs: '100%', sm: '50%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }, maxHeight: '100%' }}>
          <Stack direction={'row'} sx={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '.5rem' }}>
            <Typography variant="h6" sx={{ fontWeight: '600', color: 'GrayText', marginBottom: '.5rem' }}>
              Preview
            </Typography>
            <Button variant='contained' size='medium' color='success' sx={{ ml: 'auto', mb: '.5rem' }} onClick={createTestHandler}>Create</Button>
          </Stack>
          <Box sx={{ width: '100%', height: '100%', overflowY: 'auto', padding: '1rem', border: '1px solid black', borderRadius: '1rem' }}>
            {
              questions?.length ? <QuestionList questions={questions} isPreview={true} /> : <Typography variant='h6' textTransform={'capitalize'} sx={{ fontWeight: '600', color: 'GrayText', textAlign: 'center', marginY: '50%' }}>No Questions added</Typography>
            }
          </Box>
        </Box>
      </Paper>
    </Stack>
  )
}

export default CreateTest