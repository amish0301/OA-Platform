import { IconButton, Popover, Typography } from '@mui/material';
import React, { useState } from 'react';
import { MdInfoOutline as InfoIcon } from "react-icons/md";

const CustomInfoIcon = ({ content, title }) => {

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
    const handlePopoverClose = () => {
        setAnchorEl(null);
    }

    const handlePopoverOpen = (e) => {
        setAnchorEl(e.currentTarget);
    }

    return (
        <div className='flex items-center mb-4 mt-2'>
            <Typography variant="h6" component="h6" >{title}</Typography>
            <IconButton onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                size="small">
                <InfoIcon style={{ fontSize: 20, color: '#555' }} />
            </IconButton>
            <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: 'none', width: '100%' }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
                disableScrollLock
            >
                <Typography variant='subtitle2' sx={{ p: 2, width: '100%', fontWeight: '600' }}>{content}</Typography>
            </Popover>
        </div>
    );
};

export default CustomInfoIcon;
