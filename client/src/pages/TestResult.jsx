import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../hooks/useAxios';
import Loader from '../components/Loader';
import { Box, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { FaCheckCircle as CheckCircleIcon } from "react-icons/fa";
import { MdCancel as CancelIcon } from "react-icons/md";
import Confetti from 'react-confetti'

const TestResult = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({});
  const { id } = useParams();
  const navigate = useNavigate()

  const getResultData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(`/user/result/${id}`);
      if (data.success) {
        setResult(data.result);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getResultData()
    return () => {
      setResult({});
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return <Loader show={isLoading} />

  return (
    <Box sx={{
      padding: { xs: 2, sm: 4 },
      maxWidth: { xs: '100%', sm: 800 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 6,
      mx: { xs: 0, sm: 'auto' },
      mt: { sm: 6, xs: 4 },
      overflow: 'hidden',
    }}>
      {result?.isPassed && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <Typography variant="h3" fontWeight="bold" sx={{ color: result?.isPassed ? '#4caf50' : '#f44336', mb: 4, textAlign: 'center' }}>
        {result?.isPassed ? "Congratulations!" : "Better Luck Next Time!"}
      </Typography>

      {/* Test Info */}
      <Paper sx={{
        padding: 3,
        mb: 4,
        boxShadow: 4,
        borderRadius: 2,
        bgcolor: 'background.paper',
        width: '100%'
      }}>
        <Typography variant="h5" fontWeight="bold" textTransform="capitalize" sx={{ color: 'primary.main' }}>{result?.testName}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: "bolder" }}>Completed At: {result?.completedAt}</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: "bolder" }}>Time Taken: {result?.timeTaken}</Typography>
      </Paper>

      {/* Score Display */}
      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
        <CircularProgress
          variant="determinate"
          value={(result?.score / result?.totalQuestions) * 100}
          size={150}
          thickness={5}
          sx={{ color: result?.isPassed ? '#4caf50' : '#f44336' }}
        />
        <Box sx={{
          position: 'absolute', top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Typography variant="h4" fontWeight="bold" color={result?.isPassed ? 'success.main' : 'error.main'}>
            {result?.score}/{result?.totalQuestions}
          </Typography>
        </Box>
      </Box>

      {/* Pass/Fail Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4, gap: 1 }}>
        {result?.isPassed ? (
          <CheckCircleIcon style={{ fontSize: 20, color: 'success.main' }} />
        ) : (
          <CancelIcon sx={{ fontSize: 20, color: 'error.main' }} />
        )}
        <Typography variant="h6" fontWeight="bold">
          {result?.isPassed ? "You Passed!" : "You Failed!"}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" size="large" onClick={() => console.log('View Answers')}>
          View Answers
        </Button>
        <Button variant="outlined" color="primary" size="large" onClick={() => navigate('/test/dashboard')}>
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  )
}

export default TestResult