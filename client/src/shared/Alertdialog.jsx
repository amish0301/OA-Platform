import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setIsSubmitting, setIsTestSubmitted } from '../redux/slices/misc';

export const AlertDialog = ({ open, setIsAlertOpen, submitTest, title="", content }) => {

    const dispatch = useDispatch();
    const handleClose = useCallback(() => {
        setIsAlertOpen(false);
    }, [setIsAlertOpen]);

    const handleCancel = useCallback(() => {
        dispatch(setIsTestSubmitted(false));
        dispatch(setIsSubmitting(false));
        handleClose();
    }, [dispatch, handleClose]);

    const handleConfirm = useCallback(async () => {
        dispatch(setIsTestSubmitted(true));
        handleClose();
        await submitTest();
    }, [dispatch, handleClose, submitTest]);

    return (
        <>
            <Dialog
                open={open}
                onClose={handleCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold' }}>
                    {title ? title : "Alert"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {content ? content : "Are you sure you want to submit the test?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' color='error' onClick={handleCancel}>Cancel</Button>
                    <Button variant='contained' color='success' onClick={handleConfirm} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
