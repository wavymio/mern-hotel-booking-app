import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import * as apiClient from '../api-client'
import { useAppContext } from '../contexts/AppContext'

const SignOutButton = () => {
    const queryClient = useQueryClient()
    const {showToast} = useAppContext()
    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken")
            showToast({ message: "Signed Out", type: "SUCCESS" })
        }, onError: (err) => {
            showToast({ message: err.message, type: "ERROR" })
        }
    })

    const handleClick = () => {
        mutation.mutate()
    }
    return (
        <button onClick={handleClick} className="text-blue-600 px-3 font-bold hover:bg-gray-100 bg-white">Sign Out</button>
    )
}

export default SignOutButton
