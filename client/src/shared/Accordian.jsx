import { Accordion, AccordionDetails, AccordionSummary, Button, Fade, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { IoIosAddCircleOutline as AddIcon } from "react-icons/io";
import { MdDeleteOutline as DeleteIcon, MdExpandMore as ExpandMoreIcon } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import QuestionList from '../components/admin/QuestionList';
import { DeleteQuestionModal, QuestionModal } from '../lib/Modal';
import { setIsDeleteQuestion, setIsQuestionAdd } from '../redux/slices/admin';

const CustomAccordian = ({ title, content, index }) => {

    const [expanded, setExpanded] = useState(false);
    const handleExpansion = () => {
        setExpanded(prev => !prev);
    }

    const dispatch = useDispatch();

    const { isQuestionAdd, isDeleteQuestion, trace } = useSelector(state => state.admin);


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
                                <div className='w-full flex flex-col sticky bottom-0 z-1 '>
                                    <Button variant='contained' startIcon={<AddIcon />} sx={{ mt: '1rem', padding: '0.5rem 1rem', bgcolor: '#286675' }} onClick={() => dispatch(setIsQuestionAdd(true))}>
                                        {
                                            isQuestionAdd ? 'Cancel' : 'Add Question'
                                        }
                                    </Button>
                                    <Button variant='outlined' color='error' startIcon={<DeleteIcon />} sx={{ mt: '1rem', padding: '0.5rem 1rem', bgcolor: '#ffffff' }} onClick={() => dispatch(setIsDeleteQuestion(true))}>Delete Question</Button>
                                </div>
                                {isQuestionAdd && <QuestionModal isQuestionAdd={isQuestionAdd} dispatch={dispatch} questionId={trace}/>}
                                {isDeleteQuestion && <DeleteQuestionModal isDeleteQuestion={isDeleteQuestion} dispatch={dispatch} />}
                            </Fragment>
                        )
                    }
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

// For Delete question - create modal in which will take question id as input and delete that question



export default CustomAccordian