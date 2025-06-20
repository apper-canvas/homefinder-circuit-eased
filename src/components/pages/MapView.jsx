import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import PropertyCard from '@/components/molecules/PropertyCard'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import EmptyState from '@/components/atoms/EmptyState'
import propertyService from '@/services/api/propertyService'

const MapView = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: 47.6062, lng: -122.3321 }) // Seattle
  const [zoom, setZoom] = useState(10)

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await propertyService.getAll()
        setProperties(result)
        
        // Center map on properties if available
        if (result.length > 0) {
          const avgLat = result.reduce((sum, p) => sum + p.coordinates.lat, 0) / result.length
          const avgLng = result.reduce((sum, p) => sum + p.coordinates.lng, 0) / result.length
          setMapCenter({ lat: avgLat, lng: avgLng })
        }
      } catch (err) {
        setError(err.message || 'Failed to load properties')
      } finally {
        setLoading(false)
      }
    }
    loadProperties()
  }, [])

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    }
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`
    }
    return `$${price.toLocaleString()}`
  }

  const handleMarkerClick = (property) => {
    setSelectedProperty(property)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 3))
  }

  const handleRecenter = () => {
    if (properties.length > 0) {
      const avgLat = properties.reduce((sum, p) => sum + p.coordinates.lat, 0) / properties.length
      const avgLng = properties.reduce((sum, p) => sum + p.coordinates.lng, 0) / properties.length
      setMapCenter({ lat: avgLat, lng: avgLng })
      setZoom(10)
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-background flex">
        <div className="flex-1 relative">
          <SkeletonLoader height="h-full" />
        </div>
        <div className="w-96 bg-white border-l border-surface-200 p-4">
          <SkeletonLoader count={3} height="h-32" className="mb-4" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <ErrorState
          title="Failed to load map"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <EmptyState
          icon="Map"
          title="No properties to display"
          message="There are no properties available to show on the map."
          actionLabel="View All Properties"
          onAction={() => window.location.href = '/properties'}
        />
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Map Container */}
      <div className="flex-1 relative bg-surface-100">
        {/* Map Placeholder */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-200 rounded-full"></div>
            <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-blue-200 rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-green-300 rounded-full"></div>
          </div>

          {/* Property Markers */}
          {properties.map((property) => {
            // Convert coordinates to screen position (mock positioning)
            const screenX = ((property.coordinates.lng + 122.5) * 800) % 800
            const screenY = ((47.8 - property.coordinates.lat) * 600) % 600
            
            return (
              <motion.button
                key={property.Id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleMarkerClick(property)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                  selectedProperty?.Id === property.Id
                    ? 'z-20'
                    : 'z-10'
                }`}
                style={{
                  left: `${Math.max(10, Math.min(90, (screenX / 800) * 100))}%`,
                  top: `${Math.max(10, Math.min(90, (screenY / 600) * 100))}%`
                }}
              >
                <div className={`relative ${selectedProperty?.Id === property.Id ? 'scale-110' : ''} transition-transform`}>
                  <div className={`bg-primary text-white px-3 py-2 rounded-lg shadow-lg text-sm font-semibold min-w-max ${
                    selectedProperty?.Id === property.Id ? 'bg-secondary' : ''
                  }`}>
                    {formatPrice(property.price)}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-primary"></div>
                </div>
              </motion.button>
            )
          })}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="block w-10 h-10 flex items-center justify-center hover:bg-surface-50 transition-colors border-b border-surface-200"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="block w-10 h-10 flex items-center justify-center hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name="Minus" className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-4 right-4">
            <Button
              onClick={handleRecenter}
              variant="outline"
              size="sm"
              className="bg-white"
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
              Recenter
            </Button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
            <div className="text-xs text-surface-600 mb-2 font-medium">Price Range</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary rounded mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-secondary rounded mr-2"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Sidebar */}
      <div className="w-96 bg-white border-l border-surface-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-surface-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-surface-900">
              Properties Map
            </h2>
            <Link to="/properties" className="text-primary hover:text-primary/80">
              <ApperIcon name="List" className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-surface-600">
            {properties.length} properties found
          </p>
        </div>

        {/* Property List/Details */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {selectedProperty ? (
            /* Selected Property Details */
            <div className="p-4">
              <button
                onClick={() => setSelectedProperty(null)}
                className="flex items-center text-primary hover:text-primary/80 mb-4 text-sm"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-1" />
                Back to list
              </button>
              
              <PropertyCard property={selectedProperty} />
              
              <div className="mt-4 pt-4 border-t border-surface-200">
                <Link
                  to={`/property/${selectedProperty.Id}`}
                  className="block w-full"
                >
                  <Button size="lg" className="w-full">
                    View Full Details
                    <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Property List */
            <div className="p-4 space-y-4">
              <p className="text-sm text-surface-600 mb-4">
                Click on a marker to see property details
              </p>
              
              {properties.map((property) => (
                <motion.div
                  key={property.Id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-surface-200 rounded-lg p-3 hover:border-primary cursor-pointer transition-colors"
                  onClick={() => handleMarkerClick(property)}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-surface-900 truncate">
                        {property.title}
                      </h3>
                      <p className="text-sm text-surface-600 truncate">
                        {property.address}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(property.price)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MapView