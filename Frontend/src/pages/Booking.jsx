import React, { useEffect, useState } from 'react'
import * as apiClient from '../api-client'
import { useQuery } from 'react-query'
import BookingForm from '../forms/BookingForm/BookingForm'
import { useSearchContext } from '../contexts/SearchContext'
import { useParams } from 'react-router-dom'
import BookingDetailsSummary from '../components/BookingDetailsSummary'
import {Elements} from '@stripe/react-stripe-js'
import { useAppContext } from '../contexts/AppContext'

const Booking = () => {
    const { stripePromise } = useAppContext()
    const search = useSearchContext()
    const { hotelId } = useParams()

    const [numberOfNights, setNumberOfNights] = useState(0)

    useEffect(() => {
        if(search.checkIn && search.checkOut) {
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24)
            setNumberOfNights(Math.ceil(nights))
        }
    }, [search.checkIn, search.checkOut])

    const {data: paymentIntentData} = useQuery("createPaymentIntent", () => {
        return apiClient.createPaymentIntent(hotelId, numberOfNights.toString())
    }, {
        enabled: !!hotelId && numberOfNights > 0
    }) 

    const { data: hotel } = useQuery('fetchHotelByID', () => {
        return apiClient.fetchMyHotelById(hotelId)
        }, {
        enabled: !!hotelId
    })
    console.log('hotel ', hotel)

    const {data: currentUser} = useQuery('fetchCurrentUser', apiClient.fetchCurrentUser)


    return (
        <div className='grid md:grid-cols-[1fr_2fr]'>
            {hotel &&
                <BookingDetailsSummary checkIn={search.checkIn} checkOut={search.checkOut} adultCount={search.adultCount} childCount={search.childCount} numberOfNights={numberOfNights} hotel={hotel} />
            }
            {currentUser && paymentIntentData &&
                <Elements stripe={stripePromise} options={{
                    clientSecret: paymentIntentData.clientSecret
                }}>
                    <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
                </Elements> 
            }
            </div>
    )
}

export default Booking
