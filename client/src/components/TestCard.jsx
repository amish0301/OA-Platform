import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, CardActions, Icon, Stack, Modal, Box, Tooltip } from '@mui/material';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { MdContentCopy as CopyIcon, MdOutlineDelete as DeleteIcon } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AlertDialog } from '../shared/Alertdialog';

const TestCard = ({ title, description, category = [], subCategory = [], duration, totalQuestions, id = null, score, admin, onDeleteTest }) => {
    const [open, setOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();

    const styles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        padding: { xs: '1rem', sm: '2rem' },
        p: 4,
        borderRadius: '10px',
        maxWidth: { xs: '90%', sm: '600px' },
        width: '100%',
        bgcolor: '#f9f9f9',
        border: '1px solid #ddd',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    };

    const modalContentStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    };

    const handleClick = () => {
        navigate(`/test/${id}/instruction`);
    }

    const handleEditTest = () => {
        navigate(`/admin/tests/edit/${id}`)
    }

    const handleCopyID = () => {
        navigator.clipboard.writeText(id);
        toast.success('Test ID copied to clipboard!', { autoClose: 500, position: 'bottom-center', hideProgressBar: true });
    }

    useEffect(() => {
        return () => {
            setOpen(false);
        }
    }, [navigate]);

    return (
        <Card style={{
            minWidth: 300,
            backgroundColor: '#fff',
            borderRadius: '15px',
            padding: '.5rem',
        }}>
            {isDeleteAlertOpen && <AlertDialog title="Delete Test" content={"Are you sure you want to `delete` this test?"} open={isDeleteAlertOpen} setIsAlertOpen={setIsDeleteAlertOpen} submitTest={() => onDeleteTest(id)} />}
            <CardContent>
                <Stack direction="row" alignItems="center" gap="1rem" style={{ width: '100%', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-center' }}>
                    <Typography style={{
                        fontWeight: 'bolder',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }}>
                        {title}
                    </Typography>

                    <Stack direction="row" alignItems="center" gap={"1rem"}>
                        {!admin && <Tooltip title="Total Questions">
                            <div className='flex items-center space-x-1 cursor-pointer'>
                                <IoDocumentTextOutline className='text-xl' />
                                <Typography variant='subtitle1' sx={{ fontWeight: 'bolder', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{totalQuestions}</Typography>
                            </div>
                        </Tooltip>}
                        {!admin && <Tooltip title="Test Duration">
                            <div className='flex items-center space-x-2 cursor-pointer'>
                                <IoTimeOutline className='text-xl' />
                                <Typography variant='subtitle2' sx={{ fontWeight: 'bolder', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{duration} min</Typography>
                            </div>
                        </Tooltip>}
                        {score && <Tooltip title="Score">
                            <div className='flex items-center space-x-2 cursor-pointer'>
                                <IoTimeOutline className='text-xl' />
                                <Typography variant='subtitle2' sx={{ fontWeight: 'bolder', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{score}</Typography>
                            </div>
                        </Tooltip>}
                        {admin &&
                            <div className='flex items-center space-x-2 cursor-pointer'>
                                <Button sx={{ padding: '0.2rem 0', fontWeight: 'bolder' }} variant='text' onClick={handleCopyID}>Copy Id <code style={{ fontWeight: 'bolder', padding: '0.4rem .2rem' }}><CopyIcon /></code></Button>
                            </div>
                        }
                        {admin && <Tooltip title="Delete Test">
                            <div onClick={() => setIsDeleteAlertOpen(true)}>
                                <DeleteIcon size={20} style={{ cursor: 'pointer', color: 'red' }} />
                            </div>
                        </Tooltip>}
                    </Stack>
                </Stack>
                <Typography variant='subtitle2' style={{ marginTop: '1rem', color: '#666', fontWeight: 'bolder' }}>
                    Description
                </Typography>
                <Typography variant='subtitle1' style={{
                    color: '#555',
                }}>
                    {description}
                </Typography>

            </CardContent>
            <CardActions>
                <Stack direction="row" alignItems="center" gap="1rem" width={'100%'}>
                    <Button size="small" variant="contained" color="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={admin ? handleEditTest : handleClick}>
                        {admin ? 'Edit Test' : 'Start Test'}
                        <Icon>
                            <FaArrowUpRightFromSquare className='mt-1 text-sm' />
                        </Icon>
                    </Button>
                    <Button size="small" variant="outlined" color="secondary" style={{ marginLeft: 'auto', fontWeight: 'bolder' }} onClick={handleOpen}>
                        View Details
                    </Button>
                </Stack>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-view-more"
                    aria-describedby="modal-view-more"
                >
                    <Box sx={styles}>
                        <Stack rowGap={2} justifyContent={'left'} style={modalContentStyle}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom="1rem" borderBottom={"1px solid #ddd"} paddingBottom="1rem">
                                <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    component="h2"
                                    fontWeight="bolder"
                                    sx={{
                                        fontSize: { xs: '1rem', sm: '1.3rem' },
                                        wordWrap: 'break-word',
                                        textTransform: 'capitalize',
                                        letterSpacing: '1px',
                                        overflow: 'hidden',
                                        marginRight: 'auto',
                                    }}
                                >
                                    {title}
                                </Typography>
                                <RxCross2 className="text-3xl cursor-pointer text-gray-600" onClick={handleClose} />
                            </Stack>

                            <Typography variant='subtitle1'>
                                <strong>Description: </strong>
                                {description}
                            </Typography>

                            <Typography variant='subtitle1'>
                                <strong>Category: </strong>
                                {Array.isArray(category) ? category.join(', ') : '-'}
                            </Typography>

                            <Typography variant='subtitle1'>
                                <strong>Sub-Category: </strong>
                                {Array.isArray(subCategory) ? subCategory?.join(', ') : '-'}
                            </Typography>

                            <Typography variant='subtitle1'>
                                <strong>Total Questions: </strong>
                                {totalQuestions}
                            </Typography>

                            <Typography variant='subtitle1'>
                                <strong>Time: </strong>
                                {duration} Min
                            </Typography>

                        </Stack>
                    </Box>
                </Modal>
            </CardActions>
        </Card >
    );
};

export default TestCard;