import mockData from '@/services/mockData/neighborhoods'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const neighborhoodService = {
  async getByPropertyId(propertyId) {
    await delay(300)
    
    const parsedId = parseInt(propertyId)
    if (isNaN(parsedId)) {
      throw new Error('Invalid property ID')
    }
    
    const stats = mockData.find(item => item.propertyId === parsedId)
    if (!stats) {
      throw new Error('Neighborhood stats not found')
    }
    
    return { ...stats }
  }
}

export default neighborhoodService