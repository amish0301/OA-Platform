import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, CardActions, Icon, Stack, Modal, Box } from '@mui/material';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const TestCard = ({ title = "Test Title", description = "Test Description", category = "domain", subCategory = "subdomain", time, totalQuestions, id = null }) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const styles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '12px',
        maxWidth: '500px',
        width: '100%',
        bgcolor: '#f9f9f9', // Light background color
        border: '1px solid #ddd', // Subtle border
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow
    };

    const modalTitleStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold',
        letterSpacing: '1px',
        borderBottom: '1px solid #eee',
        paddingBottom: '8px',
        marginBottom: '16px',
    };

    const modalContentStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    };

    const handleClick = async () => {
        // redirect to test page

    }

    return (
        <Card style={{
            maxWidth: 400,
            backgroundColor: '#fff',
            borderRadius: '15px',
            padding: '.5rem',
        }}>
            <CardContent>
                <Stack direction="row" alignItems="center" gap="1rem" style={{ width: '100%', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-center' }}>
                    <Typography style={{
                        fontWeight: 'bolder',
                        cursor: 'pointer',
                    }}>
                        {title}
                    </Typography>

                    <Stack direction="row" alignItems="center" gap={"1.2rem"} style={{ userSelect: 'none' }}>
                        <div className='flex items-center gap-1'>
                            <IoDocumentTextOutline className='text-xl' />
                            <Typography variant='subtitle1' className='pt-1'>{totalQuestions}</Typography>
                        </div>
                        <div className='flex items-center gap-1'>
                            <IoTimeOutline className='text-xl' />
                            <Typography variant='subtitle1' className='pt-1'>{time}</Typography>
                        </div>
                    </Stack>
                </Stack>
                <Typography style={{
                    marginTop: '0.5rem',
                    color: '#555',
                }}>
                    {description}
                </Typography>

            </CardContent>
            <CardActions>
                <Button size="small" variant="contained" color="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={handleClick}>
                    Start Test
                    <Icon>
                        <FaArrowUpRightFromSquare className='mt-1 text-sm' />
                    </Icon>
                </Button>
                <Button size="small" variant="outlined" color="secondary" style={{ marginLeft: 'auto', fontWeight: 'bolder' }} onClick={handleOpen}>
                    View Details
                </Button>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-view-more"
                    aria-describedby="modal-view-more"
                >
                    <Box sx={styles}>
                        <Stack rowGap={2} justifyContent={'left'} style={modalContentStyle}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight={'bolder'} sx={modalTitleStyle}>
                                {title}
                                <RxCross2 className='text-2xl cursor-pointer' onClick={handleClose} />
                            </Typography>
                            <Typography variant='subtitle1'>
                                <strong>Description: </strong>
                                {description}
                            </Typography>

                            <Typography variant='subtitle1'>
                                <strong>Category: </strong>
                                {category}
                            </Typography>

                            <Typography variant='subtitle1'>
                                <strong>Sub Category: </strong>
                                {subCategory}
                            </Typography>

                            <Typography variant='subtitle1'>
                                <strong>Total Questions: </strong>
                                {totalQuestions}
                            </Typography>

                            <Typography variant='subtitle1'>
                                <strong>Time: </strong>
                                {time}
                            </Typography>

                        </Stack>
                    </Box>
                </Modal>
            </CardActions>
        </Card>
    );
};

export default TestCard;