import { Paper, Stack, Typography } from "@mui/material";

export const Widget = ({ title, value, Icon }) => {
    return (
        <Paper elevation={3} sx={{ padding: '1.5rem', borderRadius: '1.5rem', margin: '2rem 0', width: '18rem' }}>
            <Stack alignItems={'center'} spacing={'1.2rem'}>
                <Typography textTransform={'capitalize'} sx={{ color: 'rgba(0,0,0,0.7)', borderRadius: '50%', border: '5px solid rgba(0,0,0,0.9)', width: '5rem', height: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', borderWidth: '0.4rem' }}>
                    {value}
                </Typography>
                <Stack direction={'row'} alignItems={'center'} spacing={'0.5rem'}>
                    {Icon}
                    <Typography variant={'body2'} fontSize={'1rem'} fontWeight={'600'} textTransform={'capitalize'}>{title}</Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}