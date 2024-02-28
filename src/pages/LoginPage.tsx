/* eslint-disable @typescript-eslint/no-misused-promises */
import {FC, useEffect, useState} from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import Logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { login, login_lichess } from '../store/reducers/UserSlice';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import AuthError from '../components/Modals/AuthError';
import { ServerError } from '../models/response/ServerError';
import LichessLogo from '../assets/lichess.svg'
import { useQuery } from '../hooks/useQuery';
import { checkAuth } from '../store/reducers/UserSlice';

type Form = {
    email: string,
    password: string,
};

const LoginPage: FC = () => {
    const [modal, setModal] = useState<boolean>(false);
    const [modalError, setModalError] = useState<string>('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {isAuth} = useAppSelector(state => state.UserSlice);
    const { register, handleSubmit, formState: {errors, isSubmitSuccessful} } = useForm<Form>();
    const query = useQuery();
    const token = query.get('token');
    
    useEffect(() => {
        const t = async() => {
            if(token) {
                localStorage.setItem('token', token);
                await dispatch(checkAuth());
            }
        }
        void t();
    }, [dispatch, token])
    

    
    useEffect(() => {
        if(isSubmitSuccessful) {
            if(isAuth) {
                navigate('/');
            }  
        }   
    }, [isSubmitSuccessful]) // eslint-disable-line react-hooks/exhaustive-deps



    const onSubmit: SubmitHandler<Form> = async (data) => {
        const response = await dispatch(login({email: data.email, password: data.password}));
        // const res = response.payload as ServerError;
        console.log("response ===> ", localStorage.getItem('error'))
        const error = localStorage.getItem('error')
        if(error && error !== "undefined") {
            setModal(true);
            setModalError(error)
        }
    }

    const lichessLogin = async () => {
        const response = await dispatch(login_lichess());
        // const res = response.payload as ServerError;
        // if(res?.error) {
        //     setModal(true);
        //     setModalError(res.error)
        // }
        console.log("response lichess ===> ", localStorage.getItem('error'))
        const error = localStorage.getItem('error')
        if(error && error !== "undefined") {
            setModal(true);
            setModalError(error)
        }
    }

    return (
        <section className="flex items-center h-screen">
            <div className="bg-white container mx-auto flex flex-col p-10 max-w-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
                    <img className='w-48 self-center mb-5' src={ Logo } alt="logo" />
                    <h1 className='text-2xl font-semibold tracking-wider text-gray-800 capitalize '>Login to your account</h1>
                    <p className='mt-4 text-gray-500 mb-5'>Let's get you all set up so you can verify your personal account and begin setting up your profile.</p>
                    <Input wrapperClasses='mb-5' type="email" label='Email:' placeholder='Email' error={errors.email?.message} register={register('email', { required: "The field must be filled" })}/>
                    <Input wrapperClasses='mb-5' type="password" label='Password:' placeholder='Password' error={errors.password?.message} register={register('password', { required: "The field must be filled" })}/>
                    <Button>Login</Button>
                    <p className='mt-5 mb-5 text-gray-700'>Dont have account? <Link className='text-[#fbceb1]' to={'/register'}>Sign up here.</Link></p>
                </form>
                <div className="flex">
                    <a href="https://lichess.org/oauth?response_type=code&client_id=lichess-api-demo&redirect_uri=https://api.araratchess.com/api/auth/login_lichess&scope=email:read&code_challenge=xeZTXS07vL-CrdlqB3DuO0v85hJCn69-_ewlqnPSLp0&code_challenge_method=S256"><Button onClick={lichessLogin}><img className='w-8 mr-5' src={LichessLogo} alt="lichess_login" />Login with Lichess</Button></a>
                </div>
            </div>
            <AuthError modal={modal} setModal={setModal} error={modalError}/>
        </section>
    )
}

export default LoginPage;