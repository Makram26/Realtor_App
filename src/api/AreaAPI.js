import client from './client'
import firestore from '@react-native-firebase/firestore'

const getSocieties = (name) => {
  return client.get(
    `/api/data/areas/1/${name}`
  );
};

const getIndianSocieties = (name) => {
  return client.get(
    `https://s.99acres.com/api/autocomplete/suggest?term=${name}&PREFERENCE=S&RESCOM=R&FORMAT=APP&SEARCH_TYPE=COWORKING&CITY=&landmarkRequired=true`
  );
};

const getCities = (name) => {
  return client.get(
    `/api/data/cities/${name}`
  );
};

const getProfileData = async (uid) => {

  var inventoryList = [];

  await firestore()
    .collection('users')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { id, city, mobile, businessName, country } = doc.data()
          if (uid == id) {
            inventoryList.push({
              city:city,
              mobile:mobile,
              businessName: businessName,
              country: country
            })
          }

      });

    })
  return inventoryList
}

const getUserMobile = async (uid) => {

  var userNumber = [];

  await firestore()
    .collection('users')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { id, mobile, } = doc.data()
          if (uid == id) {
            userNumber.push({
              mobile:mobile,
            })
          }

      });

    })
  return userNumber
}


const getFileSocieties = async(id) => {
  var societyList = [];

  await firestore()
    .collection('Societies')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { user_id, societyName} = doc.data()
          if (user_id == id) {
            societyList.push({
              societyName:societyName,
            })
          }

      });

    })
  return societyList
}

export default {
  getSocieties,
  getProfileData,
  getUserMobile,
  getCities,
  getIndianSocieties,
  getFileSocieties
}