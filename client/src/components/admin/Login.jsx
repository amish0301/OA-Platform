import axios from 'axios';
import React, { useState } from 'react'
import { GoEyeClosed as ClosedIcon, GoEye as OpenIcon } from "react-icons/go";
import { RiLockPasswordFill as PasswordIcon } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { userExists } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';


const AdminLogin = () => {
    const [eyeOpen, setEyeOpen] = useState(false);
    // add isAdmin true in redux store
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        // api call
        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/admin/login`, { key }, {
                withCredentials: true,
                headers: {
                    'X-uId': user?._id
                }
            });

            if (res.data.success) {
                setLoading(false);
                toast.success(res.data.message);
                console.log(res.data);
                dispatch(userExists({ ...res.data.user }));
                navigate('/', { replace: true });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong while Login');
        } finally {
            setLoading(false);
        }

        setKey('');
    }

    if (loading) return <Loader show={loading} size={70} color='#3a1c71' />

    return (
        <div className='bg-gray-50 min-h-screen items-center flex justify-center'>
            <div className='bg-gray-100 rounded-xl shadow-xl max-w-sm w-full p-8 items-center'>
                <h2 className='font-semibold text-xl text-center'>Admin Login</h2>
                <div className='relative w-full mt-8'>
                    <span className='m-auto border-r border-r-orange-200 absolute p-2 top-[7px] rounded-l-lg left-0 items-center z-10'><PasswordIcon className='text-gray-500 text-lg' /></span>
                    <input type={`${eyeOpen ? 'text' : 'password'}`} className='px-10 py-3 rounded-lg border w-full' placeholder='enter admin key' name='skey' required aria-label='skey' onChange={(e) => setKey(e.target.value)} value={key} />
                    <span className='text-lg absolute top-[25px] right-3 -translate-y-1/2 cursor-pointer' onClick={() => setEyeOpen(prev => !prev)}>
                        {eyeOpen ? <OpenIcon /> : <ClosedIcon />}
                    </span>
                </div>
                <button className='bg-[#5783db] hover:bg-[#002D74]/90 duration-300 w-full text-white font-semibold py-2 rounded-lg mt-5 focus:outline-1 focus:border-none focus:outline-offset-1' onClick={handleClick}>
                    Login
                </button>
            </div>
        </div>
    )
}

export default AdminLogin;