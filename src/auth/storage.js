import AsyncStorage from "@react-native-async-storage/async-storage"

const storeSession = async (areas, city, cityID, country, countryID) => {
    // console.log("city>>>>>>>>>>>>>>>>>>>>>>>>.",city)
    try {
        // console.log("areas", areas)
        await AsyncStorage.setItem('@areas', JSON.stringify(areas));
        await AsyncStorage.setItem('@city', city);
        await AsyncStorage.setItem('@cityID', JSON.stringify(cityID));
        await AsyncStorage.setItem('@country', country);
        await AsyncStorage.setItem('@countryID', JSON.stringify(countryID));
    } catch (e) {
        console.log(e)
    }
}

const storeAreas = async(areas, city) => {
    try {
        await AsyncStorage.setItem('@areas', JSON.stringify(areas));
        await AsyncStorage.setItem('@city', city);
    } catch (e) {
        console.log(e)
    }
}

const getAreas = async () => {
    try {
        const areas = await AsyncStorage.getItem('@areas');
        return areas;
    } catch (e) {
        console.log(e);
    }
};

export default {
    storeSession,
    getAreas,
    storeAreas
}