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
import axiosInstance from '../hooks/useAxios';
import { removeFromDeleteQuestionList, resetAdminState, setIsEditTestName, setTestName, updateDeleteQuestionList } from '../redux/slices/admin';
import { setIsLoading } from '../redux/slices/misc';
import CustomInfoIcon from './InfoIcon';

const EditTest = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [name, setName] = useState(data?.name);
    const { deleteQuestionList, isEditTestName, testName } = useSelector((state) => state.admin);
    const { isLoading } = useSelector(state => state.misc);

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

        const toastId = toast.loading('Updating Test...');
        dispatch(setIsLoading(true));
        try {
            const { data } = await axiosInstance.put(`/test/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (data.success) {
                toast.update(toastId, { render: data.message, type: 'success', isLoading: false, autoClose: 1300 });
            }
        } catch (error) {
            return toast.update(toastId, { render: error.response.data.message, type: 'error', isLoading: false, autoClose: 1300 });
        } finally {
            dispatch(setIsLoading(false));
        }
    }

    const fetchTestData = async () => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await axiosInstance.get(`/test/${id}`);
            if (data.success) {
                setData(data.test);
                setName(data.test.name);
            }
        } catch (error) {
            throw error;
        } finally {
            dispatch(setIsLoading(false));
        }
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
        fetchTestData();
        return () => {
            setData([]);
            dispatch(setIsLoading(false));
            dispatch(resetAdminState());
        }
    }, [id]);

    if (isLoading) return <Loader show={isLoading} color={'#3a1c71'} />
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
            <Stack direction={'row'} gap={1} sx={{ display: 'flex', marginBottom: '.5rem', alignItems: 'center'}}>
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