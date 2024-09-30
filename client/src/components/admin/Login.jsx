import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GoEyeClosed as ClosedIcon, GoEye as OpenIcon } from "react-icons/go";
import { RiLockPasswordFill as PasswordIcon } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetchQuery from '../../hooks/useFetchData';
import { userExists } from '../../redux/slices/userSlice';
import Loader from '../Loader';


const AdminLogin = () => {
    const [eyeOpen, setEyeOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [key, setKey] = useState('');
    const { response, error, isLoading, refetch } = useFetchQuery('/admin/login', 'POST', { key });


    const handleClick = () => {
        refetch();
        setKey('');
    }

    useEffect(() => {
        if (response) {
            toast.success(response.message);
            dispatch(userExists(response.user));
            navigate('/admin/dashboard', { replace: true })
        }
        else if (error) toast.error(error);

        return () => {
            toast.dismiss()
        }
    }, [response, error])

    if (isLoading) return <Loader show={isLoading} />
    return (
        <div className='bg-gray-50 min-h-screen flex items-center justify-center'>
            <div className='bg-gray-100 rounded-xl shadow-xl max-w-sm w-full p-8 items-center flex-col justify-center'>
                <h2 className='font-semibold text-xl text-center'>Admin Login</h2>
                <div className='relative w-full mt-8'>
                    <span className='m-auto border-r border-r-orange-200 absolute p-2 top-[7px] rounded-l-lg left-0 items-center z-10'><PasswordIcon className='text-gray-500 text-lg' /></span>
                    <input type={`${eyeOpen ? 'text' : 'password'}`} className='px-10 py-3 rounded-lg border w-full' autoFocus placeholder='enter admin key' name='skey' required aria-label='skey' onChange={(e) => setKey(e.target.value)} value={key} autoComplete='off' />
                    <span className='text-lg absolute top-[25px] right-3 -translate-y-1/2 cursor-pointer' onClick={() => setEyeOpen(prev => !prev)}>
                        {eyeOpen ? <OpenIcon /> : <ClosedIcon />}
                    </span>
                </div>

                {isLoading ? <div className='flex items-center justify-center mt-3'><CircularProgress color="inherit" size={25} /></div> :
                    <button className='bg-[#5783db] hover:bg-[#002D74]/90 duration-300 w-full text-white font-semibold py-2 rounded-lg mt-5 focus:outline-1 focus:border-none focus:outline-offset-1' onClick={handleClick} disabled={isLoading}>
                        Login
                    </button>
                }
            </div>
        </div>
    )
}

export default AdminLogin;