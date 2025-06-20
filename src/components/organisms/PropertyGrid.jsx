import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PropertyCard from '@/components/molecules/PropertyCard'
import PropertyListItem from '@/components/molecules/PropertyListItem'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import EmptyState from '@/components/atoms/EmptyState'
import favoriteService from '@/services/api/favoriteService'

const PropertyGrid = ({ properties, loading, error, viewType = 'grid', onRetry }) => {
  const [favorites, setFavorites] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favs = await favoriteService.getAll()
        setFavorites(favs)
      } catch (error) {
        console.error('Failed to load favorites:', error)
      } finally {
        setFavoritesLoading(false)
      }
    }
    loadFavorites()
  }, [])

  const handleFavoriteChange = async () => {
    try {
      const favs = await favoriteService.getAll()
      setFavorites(favs)
    } catch (error) {
      console.error('Failed to reload favorites:', error)
    }
  }

  const isFavorite = (propertyId) => {
    return favorites.some(fav => fav.propertyId === propertyId)
  }

  if (loading) {
    return (
      <div className={viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonLoader key={index} height={viewType === 'grid' ? 320 : 200} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load properties"
        message={error}
        onRetry={onRetry}
      />
    )
  }

  if (!properties || properties.length === 0) {
    return (
      <EmptyState
        icon="Home"
        title="No properties found"
        message="Try adjusting your search criteria or filters to find more properties."
        actionLabel="Clear Filters"
        onAction={onRetry}
      />
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (viewType === 'list') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {properties.map((property) => (
          <motion.div key={property.Id} variants={itemVariants}>
            <PropertyListItem
              property={property}
              isFavorite={!favoritesLoading && isFavorite(property.Id)}
              onFavoriteChange={handleFavoriteChange}
            />
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {properties.map((property) => (
        <motion.div key={property.Id} variants={itemVariants}>
          <PropertyCard
            property={property}
            isFavorite={!favoritesLoading && isFavorite(property.Id)}
            onFavoriteChange={handleFavoriteChange}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default PropertyGrid