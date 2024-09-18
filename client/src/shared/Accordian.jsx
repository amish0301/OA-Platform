import { Accordion, AccordionDetails, AccordionSummary, Button, Fade, TextField, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { IoIosAddCircleOutline as AddIcon } from "react-icons/io";
import { MdDeleteOutline as DeleteIcon, MdExpandMore as ExpandMoreIcon } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import QuestionList from '../components/admin/QuestionList';
import Results from '../components/admin/Results';
import TestCategory from '../components/admin/TestCategory';
import TestDuration from '../components/admin/TestDuration';
import { DeleteQuestionModal, QuestionModal } from '../lib/Modal';
import { setIsDeleteQuestion, setIsEditTestDescription, setIsQuestionAdd, setTestDescription } from '../redux/slices/admin';

const CustomAccordian = ({ title, content, index }) => {

    const { isQuestionAdd, isDeleteQuestion, isEditTestDescription, trace, testDuration, testDescription, questions, categories } = useSelector(state => state.admin);
    const [expanded, setExpanded] = useState(false);
    const [desc, setDesc] = useState(testDescription || '');
    const dispatch = useDispatch();

    const handleExpansion = () => {
        setExpanded(prev => !prev);
    }
    const handleIsEditTestDescription = () => {
        dispatch(setIsEditTestDescription(true));
    }

    const handleSaveTestDescription = () => {
        dispatch(setTestDescription(desc));
        dispatch(setIsEditTestDescription(false));
    }

    return (
        <div>
            <Accordion
                expanded={expanded}
                onChange={handleExpansion}
                slots={{ transition: Fade }}
                slotProps={{ transition: { timeout: 400 } }}
                sx={{
                    border: '2px solid #ccc',
                    boxShadow: expanded ? '0 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
                    '&:before': {
                        display: 'none',
                    },

                    '& .MuiAccordionSummary-root': {
                        bgcolor: '#f7f9fc',
                        borderBottom: expanded ? '2px solid #ddd' : '1px solid #ccc',
                        transition: 'background-color 0.3s, border-bottom 0.3s',
                        padding: '0.5rem 1rem',
                    },
                    '& .MuiAccordionDetails-root': {
                        padding: '1rem',
                        display: expanded ? 'block' : 'none',
                        maxHeight: expanded ? '300px' : '0',
                        overflowY: 'auto',
                        transition: 'max-height 0.4s ease',
                    },
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ fontSize: '1.5rem', color: 'black', fontWeight: 'bolder' }} />}
                    aria-controls="accordian-content"
                    id="accordian-header"
                    sx={{ bgcolor: '#ffffff' }}
                >
                    <Typography variant='body1' sx={{ fontWeight: '700', color: '#333' }}>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {
                        index == 1 && (
                            <Fragment>
                                <QuestionList questions={content} />
                                <div className='w-full flex flex-col sticky bottom-0 z-1'>
                                    <Button variant='contained' startIcon={<AddIcon />} sx={{ mt: '1rem', padding: '0.5rem 1rem', bgcolor: '#286675' }} onClick={() => dispatch(setIsQuestionAdd(true))}>
                                        {
                                            isQuestionAdd ? 'Cancel' : 'Add Question'
                                        }
                                    </Button>
                                    <Button variant='outlined' color='error' startIcon={<DeleteIcon />} sx={{ mt: '1rem', padding: '0.5rem 1rem', bgcolor: '#ffffff' }} onClick={() => dispatch(setIsDeleteQuestion(true))}>Delete Question</Button>
                                </div>
                                {isQuestionAdd && <QuestionModal isQuestionAdd={isQuestionAdd} dispatch={dispatch} questionId={trace} />}
                                {isDeleteQuestion && <DeleteQuestionModal isDeleteQuestion={isDeleteQuestion} dispatch={dispatch} questions={questions} />}
                            </Fragment>
                        )
                    }
                    {index == 2 && <Results dispatch={dispatch} questions={questions} />}
                    {index == 3 && <TestDuration testDuration={testDuration} dispatch={dispatch} />}
                    {index == 4 && <TestCategory dispatch={dispatch} categories={categories} />}
                    {index == 5 &&
                        <div className='space-x-2 flex items-center'>
                            <TextField
                                label="Test Description"
                                variant="outlined"
                                multiline
                                rows={3}
                                sx={{ p: '.5rem', mt: '.5rem', width: '100%' }}
                                value={desc}
                                onChange={e => setDesc(e.target.value)}
                                disabled={!isEditTestDescription}
                            />
                            <Button
                                variant='contained'
                                sx={{ mt: '1rem 0', padding: '0.5rem 1rem', bgcolor: '#286675' }}
                                onClick={isEditTestDescription ? handleSaveTestDescription : handleIsEditTestDescription}
                            >
                                {isEditTestDescription ? 'Save' : 'Edit'}
                            </Button>
                        </div>
                    }
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default CustomAccordian