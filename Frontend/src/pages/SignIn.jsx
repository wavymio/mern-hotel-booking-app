import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import * as apiClient from '../api-client'
import { useAppContext } from '../contexts/AppContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const SignIn = () => {
    const queryClient = useQueryClient()
    const {showToast} = useAppContext()
    const navigate = useNavigate()
    const location = useLocation()

    const { register, formState: {errors}, handleSubmit } = useForm()
    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async () => {
            showToast({message: "Sign In Successful", type: "SUCCESS"})
            await queryClient.invalidateQueries("validateToken")
            navigate(location.state?.from?.pathname || '/')
        },
        onError: (err) => {
            showToast({message: err.message, type:"ERROR" })
        }
    })

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data)
    })
    
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <h2 className="text-3xl font-bold">Sign In</h2>
            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input type="email" className='border rounded w-full py-1 px-2 font-normal '
                {...register("email", {required: "This field is required"})}/>
                {errors.email &&
                    (<span className='text-red-500'>{errors.email.message}</span>)
                }
            </label>
            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input type="password" className='border rounded w-full py-1 px-2 font-normal '
                {...register("password", {required: "This field is required", minLength: {value:6, message: "Password must be at least 6 characters"}})}/>
                {errors.password &&
                    (<span className='text-red-500'>{errors.password.message}</span>)
                }
            </label>
            <span className='flex items-center justify-between'>
                <span className='text-sm'>Not Registered? <Link to="/register" className='underline'>Create an account here</Link>
                </span>
                <button type='submit' className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">Login</button>
            </span>
        </form>
    )
}

export default SignIn
