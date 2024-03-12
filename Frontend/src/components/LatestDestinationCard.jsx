import React from 'react'
import { Link } from 'react-router-dom'

const LatestDestinationCard = ({hotel}) => {
    return (
        <Link to={`/detail/${hotel._id}`} className='relative cursor-pointer overflow-hidden rounded-md'>
            <div className='h-[300px]'>
                <img src={hotel.imageUrls[0]} className='w-full h-full object-center' />
            </div>
            <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-b-md">
                <span className="flex text-white font-bold tracking-light text-xl justify-center">{hotel.name}</span>
            </div>
        </Link>
    )
}

export default LatestDestinationCard
