import { Button, CircularProgress, IconButton, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BiSolidEdit as EditIcon } from "react-icons/bi";
import { FaCheck as CheckIcon } from "react-icons/fa6";
import { RxCross2 as CrossIcon } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import QuestionList from '../components/admin/QuestionList';
import Results from '../components/admin/Results';
import Loader from '../components/Loader';
import { removeFromDeleteQuestionList, resetAdminState, setIsEditTestName, setTestName, updateDeleteQuestionList } from '../redux/slices/admin';
import CustomInfoIcon from './InfoIcon';
import useFetchQuery from '../hooks/useFetchData'

const EditTest = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [name, setName] = useState(data?.name);
    const { deleteQuestionList, isEditTestName, testName } = useSelector((state) => state.admin);
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
    }
    const { response, error, isLoading, refetch: updateTest } = useFetchQuery(`/test/${id}`, 'PUT', null, config);
    const { response: fetchTestResponse, error: fetchTestError, isLoading: isFetchTest, refetch: fetchTestData } = useFetchQuery(`/test/${id}`);

    const handleCheckboxChange = (qId, isChecked) => {
        if (isChecked) {
            dispatch(updateDeleteQuestionList(qId));  // Add ID
        } else {
            dispatch(removeFromDeleteQuestionList(qId));  // Remove ID
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('questionToDelete', JSON.stringify(deleteQuestionList));
        formData.append('name', testName);

        updateTest(formData);
    }

    const closeEditTestName = () => {
        dispatch(setIsEditTestName(false));
        setName('');
    }

    const setTestNameHandler = () => {
        dispatch(setTestName(name));
        closeEditTestName();
    }

    useEffect(() => {
        if (response) {
            toast.success(response.message);
        } else if (error) toast.error(error);
    }, [response, error])

    useEffect(() => {
        if (fetchTestResponse) {
            setData(fetchTestResponse.test);
            setName(fetchTestResponse.test.name);
        } else if (fetchTestError) throw fetchTestError;
    }, [fetchTestResponse, fetchTestError])

    useEffect(() => {
        fetchTestData();
        return () => {
            setData([]);
            dispatch(resetAdminState());
        }
    }, [id]);

    if (isLoading || isFetchTest) return <Loader show={isLoading || isFetchTest} />

    return (
        <div className='w-full px-10'>
            <Stack direction="row" justifyContent="space-between" alignItems={"center"}>
                <Typography variant="h4" component="h4" sx={{ mb: 4 }}>Edit Test</Typography>
                <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading && <CircularProgress size={16} sx={{ color: 'white' }} />}
                    Save
                </Button>
            </Stack>

            {/* Edit Test name */}
            <Stack direction={'row'} gap={1} sx={{ display: 'flex', marginBottom: '.5rem', alignItems: 'center' }}>
                <Typography variant='h6' sx={{ minWidth: 'fit-content', fontWeight: '600', color: 'GrayText' }}>Test Name:</Typography>
                {
                    isEditTestName ? <TextField label="Test Name" variant="outlined" size='small' sx={{ p: '.5rem', mt: '.5rem' }} value={name} onChange={(e) => setName(e.target.value)} /> :
                        <Typography variant='h6' sx={{ width: '100%', fontWeight: '600', color: 'GrayText' }}>{testName ? testName : name}</Typography>
                }
                {
                    isEditTestName ? (<div className='flex items-center justify-start space-x-2'>
                        <IconButton onClick={closeEditTestName}>
                            <CrossIcon />
                        </IconButton>
                        <IconButton onClick={setTestNameHandler}>
                            <CheckIcon />
                        </IconButton>
                    </div>) : (<>
                        <Button variant='text' startIcon={<EditIcon />} onClick={() => dispatch(setIsEditTestName(true))}>Edit</Button>
                    </>)
                }
            </Stack>

            <CustomInfoIcon content={'Select all the questions you want to delete'} title={'Questions'} />
            <QuestionList questions={data?.questions} deleteQuestionList={deleteQuestionList} handleCheckboxChange={handleCheckboxChange} isEdit={true} />

            {/* logic for edit result. */}
            <CustomInfoIcon content={'Select all the correct answers'} title={'Correct Answers'} />
            <Results questions={data?.questions} isEdit={true} />
        </div>
    )
}

export default EditTest