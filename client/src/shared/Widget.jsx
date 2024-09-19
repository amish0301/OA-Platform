import { Paper, Stack, Typography } from "@mui/material";

export const Widget = ({ title, value, Icon }) => {
    return (
        <Paper elevation={3} sx={{ padding: '2rem', borderRadius: '1.5rem', margin: '2rem 0', width: '20rem' }}>
            <Stack alignItems={'center'} spacing={'1rem'}>
                <Typography sx={{ color: 'rgba(0,0,0,0.7)', borderRadius: '50%', border: '5px solid rgba(0,0,0,0.9)', width: '5rem', height: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {value}
                </Typography>
                <Stack direction={'row'} alignItems={'center'} spacing={'0.5rem'}>
                    {Icon}
                    <Typography>{title}</Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}