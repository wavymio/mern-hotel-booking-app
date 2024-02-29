import React, { useState } from 'react'
import { useSearchContext } from '../contexts/SearchContext'
import { useQuery } from 'react-query'
import * as apiClient  from '../api-client'
import SearchResultCard from '../components/SearchResultCard'
import Pagination from '../components/Pagination'
import StarRatingFilter from '../components/StarRatingFilter'
import HotelTypeFilter from '../components/HotelTypeFilter'
import HotelFacilityFilter from '../components/HotelFacilityFilter'
import PriceFilter from '../components/PriceFilter'

const Search = () => {
    const search = useSearchContext()
    const [page, setPage] = useState(1)
    const [selectedStars, setSelectedStars] = useState([])
    const [selectedTypes, setSelectedTypes] = useState([])
    const [selectedFacilities, setSelectedFacilities] = useState([])
    const [selectedPrice, setSelectedPrice] = useState()
    const [sortOption, setSortOption] = useState('')

    const searchParams = {
        destination: search.destination,
        chcekIn: search.checkIn.toISOString(),
        chcekOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: selectedTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        sortOption
    }

    const {data: hotelData} = useQuery(["searchHotels", searchParams], () => {
        return apiClient.searchHotels(searchParams)
    })
    
    const handleStarsChange = (ev) => {
        const starRating = ev.target.value
        
        setSelectedStars((prevStars) => 
            ev.target.checked 
                ? [...prevStars, starRating]
                : prevStars.filter(rating => rating !== starRating)
        )

    }

    const handleTypesChange = (ev) => {
        const hotelType = ev.target.value

        setSelectedTypes((prevTypes) => 
            ev.target.checked
                ? [...prevTypes, hotelType]
                : prevTypes.filter(type => type !== hotelType)
        )
    }
    
    const handleFacilitiesChange = (ev) => {
        const hotelFacility = ev.target.value

        setSelectedFacilities((prevFacilities) => 
            ev.target.checked
                ? [...prevFacilities, hotelFacility]
                : prevFacilities.filter(facility => facility !== hotelFacility)
        )
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5'>
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">Filter by:</h3>
                    <StarRatingFilter selectedStars={selectedStars} onChange={handleStarsChange} />
                    <HotelTypeFilter selectedTypes={selectedTypes} onChange={handleTypesChange} />
                    <HotelFacilityFilter selectedFacilities={selectedFacilities} onChange={handleFacilitiesChange} />
                    <PriceFilter selectedPrice={selectedPrice} onChange={(value) => setSelectedPrice(value)} />
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.total} Hotels found
                        {search.destination ? ` in ${search.destination}` : ''}
                    </span>
                    <select value={sortOption} onChange={(ev) => setSortOption(ev.target.value)} className='p-2 border rounded-md'>
                        <option value="">Sort</option>
                        <option value="starRating">Star Rating</option>
                        <option value="pricePerNightAsc">Price Per Night (low to high)</option>
                        <option value="pricePerNightDesc">Price Per Night (high to low)</option>
                    </select>
                </div>
                {hotelData?.data.map((hotel, index) => (
                    <SearchResultCard key={index} hotel={hotel} />
                ))}
                <div>
                    <Pagination page={hotelData?.pagination.page || 1} pages={hotelData?.pagination.pages || 1} onPageChange={(page) => setPage(page)} />
                </div>
            </div>
        </div>
    )
}

export default Search
