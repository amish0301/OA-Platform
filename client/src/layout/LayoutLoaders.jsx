import { Grid, Paper, Skeleton, Stack } from "@mui/material";


// App Layout
export const AppLayoutLoader = () => {
    return (
        <div>
            {/* navbar */}
            <Stack sx={{ width: '100%' }}>
                <Skeleton variant="rectangular" width="100%" height={'4rem'} />
            </Stack>
            {/* content */}
            <Stack sx={{ height: 'calc(100vh - 2rem)', width: '100%', py: '1rem' }}>
                <Skeleton variant="rectangular" width="100%" height={'100%'} />
            </Stack>
        </div>
    );
};

const NavigationLoader = () => {
    return (
        <Grid item xs={12} md={4} lg={4} sx={{ position: 'fixed', height: '100vh', gap: 3 }}>
            <Skeleton variant="text" height={'8rem'} width={'100%'} style={{ margin: '1rem' }} />
            {
                Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} variant="rounded" height={'4rem'} width={'100%'} />
                ))
            }
        </Grid>
    );
};

// Test Dashboard layout
export const TestLayoutLoader = () => {
    return (
        <Grid container minHeight={'100vh'} sx={{ overflow: 'hidden' }} >
            <NavigationLoader />
            <Grid item xs={12} md={8} lg={11} sx={{
                marginLeft: { md: '33.33%', lg: '20%' },
                height: '100vh',
                bgcolor: '#fafbfd',
                overflowY: 'hidden',
            }}>
                <Skeleton variant="rectangular" height={'100%'} />
            </Grid>
        </Grid>
    );
};

export const AdminLayoutLoader = () => {
    return (
        <Grid container minHeight={'100vh'}>
            <Grid item xs={12} sm={4} md={3} lg={2} sx={{
                display: { xs: 'none', sm: 'block' },
            }}>
                {
                    Array.from({ length: 10 }).map((_, index) => (
                        <Skeleton key={index} variant="text" height={'4rem'} width={'100%'} />
                    ))
                }
            </Grid>
            <Grid item xs={12} sm={8} md={9} lg={10} sx={{ overflowY: 'auto', p: { xs: 2, md: 1 }, height: '100vh', bgcolor: '#eff7f9' }}>
                <Stack sx={{ width: '100%' }}>
                    <Skeleton variant="rectangular" width="100%" height={'3rem'} />
                </Stack>
                <Stack sx={{ height: 'calc(100vh - 3rem)', width: '100%', py: '1rem' }}>
                    <Skeleton variant="rectangular" width="100%" height={'100%'} />
                </Stack>
            </Grid>
        </Grid>
    )
}