import { useState, useEffect } from 'react'

const PriceSlider = ({ 
  min = 0, 
  max = 2000000, 
  value = [0, 2000000], 
  onChange,
  step = 10000,
  className = '' 
}) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value)
    const newValue = [newMin, Math.max(newMin, localValue[1])]
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value)
    const newValue = [Math.min(localValue[0], newMax), newMax]
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    }
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`
    }
    return `$${price.toLocaleString()}`
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between text-sm font-medium text-surface-700">
        <span>{formatPrice(localValue[0])}</span>
        <span>{formatPrice(localValue[1])}</span>
      </div>
      
      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-surface-200 rounded-full">
          <div 
            className="h-2 bg-primary rounded-full"
            style={{
              left: `${(localValue[0] / max) * 100}%`,
              width: `${((localValue[1] - localValue[0]) / max) * 100}%`
            }}
          />
        </div>
        
        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute top-0 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
        />
        
        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute top-0 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
        />
      </div>
      
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2C5282;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2C5282;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}

export default PriceSlider