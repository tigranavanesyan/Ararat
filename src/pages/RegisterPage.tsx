/* eslint-disable @typescript-eslint/no-misused-promises */
import {FC, useEffect, useState} from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../assets/logo.png'
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { registration } from '../store/reducers/UserSlice';
import { ServerError } from '../models/response/ServerError';
import { EmailValidation, PasswordValidation } from '../utils/ValidationRules';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import AuthError from '../components/Modals/AuthError';

type Form = {
    email: string,
    name: string,
    sname: string,
    password: string,
    confirm_password: string
};

const RegisterPage: FC = () => {
    const [modal, setModal] = useState<boolean>(false);
    const [modalError, setModalError] = useState<string>('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {isAuth} = useAppSelector(state => state.UserSlice);
    const { register, handleSubmit, watch, formState: {errors, isSubmitSuccessful} } = useForm<Form>();

    useEffect(() => {
        if(isSubmitSuccessful) {
            if(isAuth) {
                navigate('/');
            }  
        }
    }, [isSubmitSuccessful]) // eslint-disable-line react-hooks/exhaustive-deps

    const onSubmit: SubmitHandler<Form> = async (data) => {
        const response = await dispatch(registration({email: data.email, name: data.name, sname: data.sname, password: data.password}));
        const res = response.payload as ServerError;
        if(res?.error) {
            setModal(true);
            setModalError(res.error)
        }
    }

    return (
        <section className="flex items-center h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className='bg-white container mx-auto flex flex-col p-10 max-w-2xl'>
                <img className='w-40 self-center mb-5' src={ Logo } alt="logo" />
                <h1 className='text-2xl font-semibold tracking-wider text-gray-800 capitalize '>Register To Get Started</h1>
                <p className='mt-4 text-gray-500 mb-5'>Let's get you all set up so you can verify your personal account and begin setting up your profile.</p>
                <Input wrapperClasses='mb-5' type="email" label='Email:' placeholder='Email' error={errors.email?.message} register={register('email', EmailValidation)}/>
                <Input wrapperClasses='mb-5' type="text" label='First Name:' placeholder='First Name' error={errors.name?.message} register={register('name', { required: "The field must be filled" })}/>
                <Input wrapperClasses='mb-5' type="text" label='Last Name:' placeholder='Last Name' error={errors.sname?.message} register={register('sname', { required: "The field must be filled" })}/>
                <Input wrapperClasses='mb-5' type="password" label='Password:' placeholder='Password' error={errors.password?.message} register={register('password', PasswordValidation)}/>
                <Input wrapperClasses='mb-5' type="password" label='Confirm Password:' placeholder='Confirm Password' error={errors.confirm_password?.message} register={register('confirm_password', { 
                    required: "The field must be filled",
                    validate: (val: string) => {
                        if (watch('password') != val) {
                            return "Your passwords do no match";
                        }
                    }, 
                })}/>
                <Button>Register</Button>
                <p className='mt-5 text-gray-700'>Already have an account ? <Link className='text-[#fbceb1]' to={'/login'}>Log In here.</Link></p>
            </form>
            <AuthError modal={modal} setModal={setModal} error={modalError}/>
        </section>
    )
}

export default RegisterPage;