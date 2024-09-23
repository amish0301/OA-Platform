import { Box, Button, IconButton, Modal, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { IoClose as CloseIcon } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { deleteQuestions, resetQuestions, setIsDeleteQuestion, setIsQuestionAdd, setQuestions } from '../redux/slices/admin';
import { validateInput } from './feature';

export const QuestionModal = (props) => {

    const { isQuestionAdd, dispatch, questionId } = props;
    const [desc, setDesc] = useState('');
    const [answer, setAnswer] = useState(null);
    const [options, setOptions] = useState(['', '', '', ''])

    const handleClose = () => {
        dispatch(setIsQuestionAdd(false));
        setDesc('');
        setOptions(['', '', '', '', '']);
        setAnswer(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!desc || !answer || options.some(option => option === '')) {
            toast.error('Please fill in all fields');
            return;
        }

        toast.success('Question added successfully');
        dispatch(setQuestions({ question: desc, answer, options, id: questionId + 1 }));
        handleClose();
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
                    onChange={e => setDesc(e.target.value)}
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
                                value={options[index]}
                                onChange={(e) => setOptions((prev) => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                            />
                        </div>
                    ))
                }
                <TextField label="Correct Option" variant="outlined" fullWidth sx={{ mt: 2 }} placeholder='e.g. Option 1/2/3' value={answer} onChange={e => setAnswer(e.target.value)} required />
                <Button variant='contained' color='primary' sx={{ mt: 2 }} fullWidth onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </Modal>
    )
}

export const DeleteQuestionModal = (props) => {
    const { isDeleteQuestion, dispatch, questions } = props;

    const [input, setInput] = useState('');

    const handleClose = () => {
        dispatch(setIsDeleteQuestion(false));
        setInput('');
    }

    const handleDelete = (e) => {
        e.preventDefault();

        const errorMessage = validateInput(input, questions);

        if (errorMessage) {
            return toast.error(errorMessage);
        }

        input.trim();

        if (input === 'all') {
            dispatch(resetQuestions());
            handleClose();
            return toast.success('All questions deleted successfully');
        }

        const nums = input.split(',').map(num => parseInt(num.trim()));
        dispatch(deleteQuestions(nums))
        handleClose();
        return toast.success('Questions deleted successfully');
    }

    return (
        <Modal open={isDeleteQuestion} onClose={handleClose}>
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
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Delete Question
                </Typography>

                <TextField
                    label="Question Numbers seprated with (',')"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ mb: 2 }}
                    value={input}
                    placeholder='enter "Q. number" to delete it, or write "all" to delete all questions'
                    onChange={e => setInput(e.target.value)}
                />

                <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                    Are you sure you want to delete this question?
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end', width: '100%' }}>
                    <Button variant='outlined' color='primary' sx={{ mt: 2 }} onClick={() => dispatch(setIsDeleteQuestion(false))}>
                        Cancel
                    </Button>
                    <Button variant='contained' color='error' sx={{ mt: 2 }} onClick={handleDelete}>
                        Delete
                    </Button>
                </Stack>
            </Box>
        </Modal>
    )
}