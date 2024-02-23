import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import * as apiClient from '../api-client'
import ManageHotelForm from '../forms/ManageHotelForm/ManageHotelForm'
import { useAppContext } from '../contexts/AppContext'

const EditHotel = () => {
    const { hotelId } = useParams()
    const { showToast } = useAppContext() 
    const { data: hotel } = useQuery("fetchMyHotelById", () => {
       return apiClient.fetchMyHotelById(hotelId || '')
    }, {
        enabled: !!hotelId // if hotelId has a value, enabled willl be true, if hotel id returns undefined, null etc, enabled will be false and the useQuery will not run
    })

    const { mutate, isLoading } = useMutation(apiClient.updatedHotelById, {
        onSuccess: () => {
            showToast({message: "Hotel Updated!", type: "SUCCESS"})
        }, 
        onError: () => {
            showToast({message: "Error Updating Hotel", type: "ERROR"})
        }
    })
    
    const handleSave = (hotelFormData) => {
        mutate(hotelFormData)
    }

    return (
        <ManageHotelForm isLoading={isLoading} hotel={hotel}  onSave={handleSave}/>
    )
}

export default EditHotel
