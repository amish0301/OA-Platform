import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { IoClose as CloseIcon } from 'react-icons/io5';
import { setIsQuestionAdd, setQuestions } from '../redux/slices/admin';
import { toast } from 'react-toastify';

export const QuestionModal = (props) => {

    const { isQuestionAdd, dispatch } = props;
    const [desc, setDesc] = useState('');
    const [question, setQuestion] = useState({
        question: '',
        options: [],
        answer: null
    });

    const handleClose = () => {
        dispatch(setIsQuestionAdd(false));
    }

    const handleSubmit = () => {

        // do validation 

        const newQuestion = {
            question: desc,
            options: [],
            answer: null
        }

        dispatch(setQuestions(prev => [...prev, newQuestion]));

        return () => {
            dispatch(setIsQuestionAdd(false));
        }
    }

    return (
        <Modal open={isQuestionAdd} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '8px',
                }}
            >
                <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Add New Question
                </Typography>
                <TextField
                    label="Question Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                    value={desc}
                    required
                    onChange={(e) => setDesc(e.target.value)}
                    helperText={desc === '' ? 'Question description is required' : ''}
                />
                {
                    Array.from({ length: 4 }).map((_, index) => (
                        <div className='flex gap-2 items-center justify-start'>
                            <span className='font-bold font-poppins'>{index + 1}</span>
                            <TextField
                                key={index}
                                label={`Option ${index + 1}`}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                required
                                onChange={(e) => setQuestion(prev => ({...prev, options: [...prev.options, e.target.value]}))}
                                helperText={`Option ${index + 1} is required`}
                            />
                        </div>
                    ))
                }
                <TextField label="Correct Option" variant="outlined" fullWidth sx={{ mt: 2 }} placeholder='e.g. Option 1/2/3' required />
                <Button variant='contained' color='primary' sx={{ mt: 2 }} fullWidth onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </Modal>
    )
}