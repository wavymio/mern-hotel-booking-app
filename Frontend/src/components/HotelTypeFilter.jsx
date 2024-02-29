import React from 'react'
import { hotelTypes} from '../config/hotel-options-config'

const HotelTypeFilter = ({selectedTypes, onChange}) => {
    return (
        <div className='border-b border-slate-300 pb-5'>
            <h4 className="text-md font-semibold mb-2">Hotel Types</h4>
            {hotelTypes.map((type, index) => (
                <label key={index} className="flex items-center space-x-2">
                    <input type="checkbox" className='rounded' value={type} checked={selectedTypes?.includes(type)} onChange={onChange} />
                    <span>{type}</span>
                </label>
            ))}
        </div>
    )
}

export default HotelTypeFilter
