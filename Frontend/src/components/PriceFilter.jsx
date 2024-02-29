const PriceFilter = ({ selectedPrice, onChange }) => {
    return (
        <div>
            <h4 className="text-md font-semibold mb-2">Max Price</h4>
            <select className="p-2 border rounded-md w-full" value={selectedPrice} onChange={ev => onChange(ev.target.value ? parseInt(ev.target.value) : undefined)}>
                <option value="">Select Max Price</option>
                {[1000, 2000, 3000, 4000, 5000, 10000].map((price, index) => (
                    <option key={index} value={price}>{price}</option>
                ))

                }
            </select>
        </div>
    )
}

export default PriceFilter