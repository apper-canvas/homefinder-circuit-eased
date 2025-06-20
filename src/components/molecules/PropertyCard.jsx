import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import favoriteService from '@/services/api/favoriteService'

const PropertyCard = ({ property, isFavorite = false, onFavoriteChange }) => {
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [currentFavorite, setCurrentFavorite] = useState(isFavorite)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleFavoriteToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setFavoriteLoading(true)
    try {
      if (currentFavorite) {
        await favoriteService.deleteByPropertyId(property.Id)
        setCurrentFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await favoriteService.create({ propertyId: property.Id })
        setCurrentFavorite(true)
        toast.success('Added to favorites')
      }
      onFavoriteChange?.()
    } catch (error) {
      toast.error('Failed to update favorites')
    } finally {
      setFavoriteLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <Link to={`/property/${property.Id}`} className="block">
        <div className="relative">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          
          {/* Favorite button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <ApperIcon
              name="Heart"
              className={`w-5 h-5 transition-colors ${
                currentFavorite 
                  ? 'text-error fill-current' 
                  : 'text-surface-600 hover:text-error'
              }`}
            />
          </motion.button>

          {/* Price overlay */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-primary text-white px-3 py-1 rounded-md font-semibold">
              {formatPrice(property.price)}
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-display font-semibold text-lg text-surface-900 mb-2 line-clamp-2">
            {property.title}
          </h3>
          
          <div className="flex items-center text-surface-600 mb-3">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
            <span className="text-sm truncate">
              {property.address}, {property.city}, {property.state}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-surface-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
                <span>{property.bedrooms} bed</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
                <span>{property.bathrooms} bath</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Square" className="w-4 h-4 mr-1" />
                <span>{property.squareFeet?.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-surface-200">
            <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
              {property.propertyType}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default PropertyCard