import mockFavorites from '../mockData/favorites.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let favorites = [...mockFavorites]

const favoriteService = {
  async getAll() {
    await delay(200)
    return [...favorites]
  },

  async getById(id) {
    await delay(150)
    const favorite = favorites.find(f => f.Id === parseInt(id, 10))
    if (!favorite) {
      throw new Error('Favorite not found')
    }
    return { ...favorite }
  },

  async getByPropertyId(propertyId) {
    await delay(150)
    const favorite = favorites.find(f => f.propertyId === parseInt(propertyId, 10))
    return favorite ? { ...favorite } : null
  },

  async create(favorite) {
    await delay(300)
    const existingFavorite = favorites.find(f => f.propertyId === favorite.propertyId)
    if (existingFavorite) {
      return { ...existingFavorite }
    }
    
    const newId = Math.max(...favorites.map(f => f.Id), 0) + 1
    const newFavorite = {
      ...favorite,
      Id: newId,
      savedDate: new Date().toISOString().split('T')[0]
    }
    favorites.push(newFavorite)
    return { ...newFavorite }
  },

  async delete(id) {
    await delay(250)
    const index = favorites.findIndex(f => f.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Favorite not found')
    }
    favorites.splice(index, 1)
    return true
  },

  async deleteByPropertyId(propertyId) {
    await delay(250)
    const index = favorites.findIndex(f => f.propertyId === parseInt(propertyId, 10))
    if (index === -1) {
      throw new Error('Favorite not found')
    }
    favorites.splice(index, 1)
    return true
  }
}

export default favoriteService