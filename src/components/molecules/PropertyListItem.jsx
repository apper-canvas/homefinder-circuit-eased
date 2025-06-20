import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import favoriteService from '@/services/api/favoriteService'

const PropertyListItem = ({ property, isFavorite = false, onFavoriteChange }) => {
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <Link to={`/property/${property.Id}`} className="block">
        <div className="flex">
          <div className="relative w-64 h-48 flex-shrink-0">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
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
          </div>

          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-display font-semibold text-xl text-surface-900 line-clamp-1">
                {property.title}
              </h3>
              <div className="bg-primary text-white px-3 py-1 rounded-md font-semibold text-lg ml-4">
                {formatPrice(property.price)}
              </div>
            </div>
            
            <div className="flex items-center text-surface-600 mb-4">
              <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {property.address}, {property.city}, {property.state}
              </span>
            </div>

            <div className="flex items-center space-x-6 text-surface-600 mb-4">
              <div className="flex items-center">
                <ApperIcon name="Bed" className="w-5 h-5 mr-2" />
                <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Bath" className="w-5 h-5 mr-2" />
                <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Square" className="w-5 h-5 mr-2" />
                <span>{property.squareFeet?.toLocaleString()} sqft</span>
              </div>
            </div>

            <p className="text-surface-600 text-sm line-clamp-2 mb-4">
              {property.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                {property.propertyType}
              </span>
              <span className="text-sm text-surface-500">
                Listed {new Date(property.listingDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default PropertyListItem