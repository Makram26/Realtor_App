import authStorage from './storage'

export default useAuth = () => {
    const areas = (areas, city, cityID, country, countryID) => {
        authStorage.storeSession(areas, city, cityID, country, countryID)
    };

    const storeArea = (store, city) => {
        authStorage.storeAreas(store, city)
    }

    return {areas, storeArea}
}