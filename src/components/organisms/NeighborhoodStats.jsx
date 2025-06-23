import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import neighborhoodService from '@/services/api/neighborhoodService'

const NeighborhoodStats = ({ propertyId }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadNeighborhoodStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await neighborhoodService.getByPropertyId(propertyId)
        setStats(result)
      } catch (err) {
        setError(err.message || 'Failed to load neighborhood stats')
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      loadNeighborhoodStats()
    }
  }, [propertyId])

  if (loading) {
    return (
      <div className="mb-8">
        <SkeletonLoader height="h-6" width="w-48" className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonLoader height="h-32" />
          <SkeletonLoader height="h-32" />
          <SkeletonLoader height="h-32" />
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return null
  }

  const getScoreColor = (score, maxScore = 100) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-success'
    if (percentage >= 60) return 'text-warning'
    return 'text-error'
  }

  const getScoreBgColor = (score, maxScore = 100) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'bg-success/10'
    if (percentage >= 60) return 'bg-warning/10'
    return 'bg-error/10'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-semibold text-surface-900 mb-6">Neighborhood Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* School Ratings */}
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-lg ${getScoreBgColor(stats.schoolRating, 10)} mr-3`}>
              <ApperIcon name="GraduationCap" className={`w-6 h-6 ${getScoreColor(stats.schoolRating, 10)}`} />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900">School Rating</h3>
              <p className="text-sm text-surface-600">Local schools quality</p>
            </div>
          </div>
          
          <div className="flex items-end mb-3">
            <span className={`text-3xl font-bold ${getScoreColor(stats.schoolRating, 10)}`}>
              {stats.schoolRating}
            </span>
            <span className="text-surface-500 ml-1">/10</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-surface-600">Elementary</span>
              <span className="font-medium text-surface-900">{stats.elementaryRating}/10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-600">Middle School</span>
              <span className="font-medium text-surface-900">{stats.middleSchoolRating}/10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-600">High School</span>
              <span className="font-medium text-surface-900">{stats.highSchoolRating}/10</span>
            </div>
          </div>
        </div>

        {/* Transit Score */}
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-lg ${getScoreBgColor(stats.transitScore)} mr-3`}>
              <ApperIcon name="Bus" className={`w-6 h-6 ${getScoreColor(stats.transitScore)}`} />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900">Transit Score</h3>
              <p className="text-sm text-surface-600">Public transportation</p>
            </div>
          </div>
          
          <div className="flex items-end mb-3">
            <span className={`text-3xl font-bold ${getScoreColor(stats.transitScore)}`}>
              {stats.transitScore}
            </span>
            <span className="text-surface-500 ml-1">/100</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-surface-600">Bus Routes</span>
              <span className="font-medium text-surface-900">{stats.busRoutes}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-600">Nearest Station</span>
              <span className="font-medium text-surface-900">{stats.nearestStation}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-600">Avg Wait Time</span>
              <span className="font-medium text-surface-900">{stats.avgWaitTime} min</span>
            </div>
          </div>
        </div>

        {/* Walkability Score */}
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-lg ${getScoreBgColor(stats.walkScore)} mr-3`}>
              <ApperIcon name="MapPin" className={`w-6 h-6 ${getScoreColor(stats.walkScore)}`} />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900">Walk Score</h3>
              <p className="text-sm text-surface-600">Walkability rating</p>
            </div>
          </div>
          
          <div className="flex items-end mb-3">
            <span className={`text-3xl font-bold ${getScoreColor(stats.walkScore)}`}>
              {stats.walkScore}
            </span>
            <span className="text-surface-500 ml-1">/100</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-surface-600">Restaurants</span>
              <span className="font-medium text-surface-900">{stats.nearbyRestaurants}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-600">Grocery Stores</span>
              <span className="font-medium text-surface-900">{stats.nearbyGrocery}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-600">Parks</span>
              <span className="font-medium text-surface-900">{stats.nearbyParks}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NeighborhoodStats