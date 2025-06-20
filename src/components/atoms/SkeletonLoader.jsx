import { motion } from 'framer-motion'

const SkeletonLoader = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '', 
  count = 1,
  variant = 'default'
}) => {
  const shimmerVariants = {
    animate: {
      x: ['-100%', '100%'],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }
    }
  }

  const SkeletonElement = ({ index = 0 }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`${width} ${typeof height === 'number' ? `h-${height}` : height} bg-surface-200 rounded relative overflow-hidden ${className}`}
    >
      <motion.div
        variants={shimmerVariants}
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
    </motion.div>
  )

  if (variant === 'card') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <SkeletonElement />
        <div className="p-4 space-y-3">
          <SkeletonElement width="w-3/4" height="h-5" />
          <SkeletonElement width="w-1/2" height="h-4" />
          <div className="flex space-x-4">
            <SkeletonElement width="w-16" height="h-4" />
            <SkeletonElement width="w-16" height="h-4" />
            <SkeletonElement width="w-16" height="h-4" />
          </div>
        </div>
      </div>
    )
  }

  if (count === 1) {
    return <SkeletonElement />
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonElement key={index} index={index} />
      ))}
    </div>
  )
}

export default SkeletonLoader