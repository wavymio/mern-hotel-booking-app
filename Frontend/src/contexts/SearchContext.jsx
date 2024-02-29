import React, { useContext, useState } from "react"
const SearchContext = React.createContext(undefined)

export const SearchContextProvider = ({children}) => {
    const [destination, setDestination] = useState("")
    const [checkIn, setCheckIn] = useState(new Date())
    const [checkOut, setCheckOut] = useState(new Date())
    const [adultCount, setAdultCount] = useState(1)
    const [childCount, setChildCount] = useState(0)
    const [hotelId, setHotelId] = useState("")
   
    const saveSearchValues = (destination, checkIn, checkOut, adultCount, childCount, hotelId) => {
        setDestination(destination)
        setCheckIn(checkIn)
        setCheckOut(checkOut)
        setAdultCount(adultCount)
        setChildCount(childCount)
        if (hotelId) {
            setHotelId(hotelId)
        }
    }
    return (
        <SearchContext.Provider value={{destination, checkIn, checkOut, adultCount, childCount, saveSearchValues, hotelId}}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearchContext = () => {
    const context = useContext(SearchContext)
    return context
}