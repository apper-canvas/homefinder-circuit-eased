import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Illustration */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }}
            className="mb-8"
          >
            <div className="relative">
              <ApperIcon name="Home" className="w-32 h-32 text-surface-300 mx-auto" />
              <motion.div
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  transition: { repeat: Infinity, duration: 2 }
                }}
                className="absolute top-0 right-0 transform translate-x-2 -translate-y-2"
              >
                <ApperIcon name="Search" className="w-8 h-8 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-display font-bold text-surface-900 mb-4"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold text-surface-800 mb-4"
          >
            Property Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-surface-600 mb-8 leading-relaxed"
          >
            Oops! The property you're looking for seems to have moved to a different neighborhood. 
            Let's help you find your way back home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <Link to="/" className="block">
              <Button size="lg" className="w-full sm:w-auto">
                <ApperIcon name="Home" className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/properties">
                <Button variant="outline" size="lg">
                  <ApperIcon name="Building2" className="w-4 h-4 mr-2" />
                  Browse Properties
                </Button>
              </Link>
              
              <Link to="/map">
                <Button variant="outline" size="lg">
                  <ApperIcon name="Map" className="w-4 h-4 mr-2" />
                  View Map
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound