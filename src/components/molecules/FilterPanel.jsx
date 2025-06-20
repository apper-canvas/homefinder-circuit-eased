import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import PriceSlider from '@/components/atoms/PriceSlider'

const FilterPanel = ({ isOpen, onClose, onFilterChange, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 2000000,
    bedrooms: 0,
    bathrooms: 0,
    propertyTypes: [],
    ...currentFilters
  })

  const propertyTypes = ['House', 'Condo', 'Townhouse', 'Apartment']

  const handlePriceChange = (priceRange) => {
    setFilters(prev => ({
      ...prev,
      priceMin: priceRange[0],
      priceMax: priceRange[1]
    }))
  }

  const handleBedroomChange = (bedrooms) => {
    setFilters(prev => ({ ...prev, bedrooms }))
  }

  const handleBathroomChange = (bathrooms) => {
    setFilters(prev => ({ ...prev, bathrooms }))
  }

  const handlePropertyTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }))
  }

  const handleApplyFilters = () => {
    onFilterChange(filters)
    onClose()
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      priceMin: 0,
      priceMax: 2000000,
      bedrooms: 0,
      bathrooms: 0,
      propertyTypes: []
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.priceMin > 0 || filters.priceMax < 2000000) count++
    if (filters.bedrooms > 0) count++
    if (filters.bathrooms > 0) count++
    if (filters.propertyTypes.length > 0) count++
    return count
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:w-full lg:h-auto lg:shadow-none lg:bg-transparent"
          >
            <div className="p-6 h-full overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-lg font-semibold text-surface-900">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-surface-900 mb-3">Price Range</h3>
                  <PriceSlider
                    value={[filters.priceMin, filters.priceMax]}
                    onChange={handlePriceChange}
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <h3 className="font-medium text-surface-900 mb-3">Bedrooms</h3>
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        onClick={() => handleBedroomChange(num)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          filters.bedrooms === num
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-surface-700 border-surface-300 hover:border-primary'
                        }`}
                      >
                        {num === 0 ? 'Any' : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <h3 className="font-medium text-surface-900 mb-3">Bathrooms</h3>
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        onClick={() => handleBathroomChange(num)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          filters.bathrooms === num
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-surface-700 border-surface-300 hover:border-primary'
                        }`}
                      >
                        {num === 0 ? 'Any' : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <h3 className="font-medium text-surface-900 mb-3">Property Type</h3>
                  <div className="space-y-2">
                    {propertyTypes.map(type => (
                      <label
                        key={type}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.propertyTypes.includes(type)}
                          onChange={() => handlePropertyTypeToggle(type)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-all ${
                          filters.propertyTypes.includes(type)
                            ? 'bg-primary border-primary'
                            : 'border-surface-300 hover:border-primary'
                        }`}>
                          {filters.propertyTypes.includes(type) && (
                            <ApperIcon name="Check" className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-surface-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active Filters */}
                {getActiveFilterCount() > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-surface-900">Active Filters</h3>
                      <button
                        onClick={handleClearFilters}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(filters.priceMin > 0 || filters.priceMax < 2000000) && (
                        <Badge variant="primary">
                          ${(filters.priceMin/1000).toFixed(0)}K - ${(filters.priceMax/1000).toFixed(0)}K
                        </Badge>
                      )}
                      {filters.bedrooms > 0 && (
                        <Badge variant="primary">{filters.bedrooms}+ Bedrooms</Badge>
                      )}
                      {filters.bathrooms > 0 && (
                        <Badge variant="primary">{filters.bathrooms}+ Bathrooms</Badge>
                      )}
                      {filters.propertyTypes.map(type => (
                        <Badge key={type} variant="primary">{type}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-6 lg:hidden">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FilterPanel