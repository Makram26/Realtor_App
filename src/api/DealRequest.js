import firestore from '@react-native-firebase/firestore'

const createNewDeals = async (uid, title, dealAmount, buyerCommission, sellerCommission,
  inventoryPropertyImg, inventoryPropertyType, inventoryCityName, inventorySocietyName, inventoryBedroomsQuantity, inventorySize, inventorySizeType, amount, facilities,
  leadName, leadMobile, leadSocietyName, leadCatagory, leadBedroomsQuantity, leadBudget, leadSize, leadSizeType, leadPortionType, leadUnitType, leadTransactionType, leadDiscription) => {
  let response = true
  try {
    firestore()
      .collection('Deal')
      .add({
        user_id: uid,
        title: title,
        dealAmount: dealAmount,
        buyerCommission: buyerCommission,
        sellerCommission: sellerCommission,

        inventoryPropertyImg: inventoryPropertyImg,
        inventoryProperty_type: inventoryPropertyType,
        inventoryCityName: inventoryCityName,
        inventorySocietyName: inventorySocietyName,
        inventoryBedroomsQuantity: inventoryBedroomsQuantity,
        inventorySize: inventorySize,
        inventorySizeType: inventorySizeType,
        address: address,
        amount: amount,
        facilities: facilities,

        leadName: leadName,
        leadMobile: leadMobile,
        leadSocietyName: leadSocietyName,
        leadCatagory: leadCatagory,
        leadBedroomsQuantity: leadBedroomsQuantity,
        leadBudget: leadBudget,
        leadSize: leadSize,
        leadSizeType: leadSizeType,
        leadPortionType: leadPortionType,
        leadUnitType: leadUnitType,
        leadTransactionType: leadTransactionType,
        leadDiscription: leadDiscription,
      })
  }
  catch (err) {
    console.warn(err);
    response = false
  }
  return response
}

const getDeals = async (id) => {

  var DealLists = [];

  console.log(id)

  await firestore().collection('leads')
    .get()
    .then(querySnapshot => {
      // var duplicate_User = querySnapshot.size
      // console.log("duplicate", duplicate_User)
      querySnapshot.forEach(doc => {
        const { user_id, title, dealAmount, buyerCommission, sellerCommission,
          inventoryPropertyImg, inventoryPropertyType, inventoryCityName, inventorySocietyName, inventoryBedroomsQuantity, inventorySize, inventorySizeType, amount, facilities,
          leadName, leadMobile, leadSocietyName, leadCatagory, leadBedroomsQuantity, leadBudget, leadSize, leadSizeType, leadPortionType, leadUnitType, leadTransactionType, leadDiscription } = doc.data()

        if (user_id === id) {
          DealLists.push({
            id: doc.id,
            title: title,
            dealAmount: dealAmount,
            buyerCommission: buyerCommission,
            sellerCommission: sellerCommission,

            inventoryPropertyImg: inventoryPropertyImg,
        inventoryProperty_type: inventoryPropertyType,
        inventoryCityName: inventoryCityName,
        inventorySocietyName: inventorySocietyName,
        inventoryBedroomsQuantity: inventoryBedroomsQuantity,
        inventorySize: inventorySize,
        inventorySizeType: inventorySizeType,
        address: address,
        amount: amount,
        facilities: facilities,

        leadName: leadName,
        leadMobile: leadMobile,
        leadSocietyName: leadSocietyName,
        leadCatagory: leadCatagory,
        leadBedroomsQuantity: leadBedroomsQuantity,
        leadBudget: leadBudget,
        leadSize: leadSize,
        leadSizeType: leadSizeType,
        leadPortionType: leadPortionType,
        leadUnitType: leadUnitType,
        leadTransactionType: leadTransactionType,
        leadDiscription: leadDiscription,
          });

        }
      });
    })
  return DealLists
}
// =======================================================


const createNewDeal = async (uid, title, dealAmount, buyerCommission, sellerCommission, buyerAmountinRs, sellerAmountinRs,
  leadId, leadSocietyName, leadBedroomsQuantity, leadBudget, leadCatagory, leadName, leadMobile, leadPortion_type, leadProperty_type, leadSize, leadSize_type, leadUnit_type, leadDescription,
  inventoryId,inventoryHouseName, inventoryCityName, inventorySocietyName, inventoryDemand, inventoryPropertyImg, inventoryPropertyType, inventorySize, inventorySizeType, inventoryTransactionType, inventoryRooms, inventoryDescription,
  inventoryOnwerBuild, inventoryCorner, inventoryGated, inventorySuiGas, inventoryMainRoad, inventoryFacingPark,) => {
  let response = true
  try {
    firestore()
      .collection('Deal')
      .add({
        user_id: uid,
        title: title,
        dealAmount: dealAmount,
        buyerCommission: buyerCommission + "%",
        sellerCommission: sellerCommission + "%",
        buyerAmountinRs: buyerAmountinRs,
        sellerAmountinRs: sellerAmountinRs,

        leadDetail: {
          leadId: leadId,
          leadSocietyName: leadSocietyName,
          leadBedroomsQuantity: leadBedroomsQuantity,
          leadBudget: leadBudget,
          leadCatagory: leadCatagory,
          leadName: leadName,
          leadMobile: leadMobile,
          leadPortion_type: leadPortion_type,
          leadProperty_type: leadProperty_type,
          leadSize: leadSize,
          leadSize_type: leadSize_type,
          leadUnit_type : leadUnit_type,
          leadDescription: leadDescription,
        },

        inventoryDetail: {
          inventoryId: inventoryId,
          inventoryHouseName: inventoryHouseName,
          inventoryCityName: inventoryCityName,
          inventorySocietyName: inventorySocietyName,
          inventoryDemand: inventoryDemand,
          inventoryPropertyImg: inventoryPropertyImg,
          inventoryPropertyType: inventoryPropertyType,
          inventorySize: inventorySize,
          inventorySizeType: inventorySizeType,
          inventoryTransactionType: inventoryTransactionType,
          inventoryRooms: inventoryRooms,
          inventoryDescription: inventoryDescription,
          inventoryFacilities: {
            inventoryOnwerBuild: inventoryOnwerBuild,
            inventoryCorner: inventoryCorner,
            inventoryGated: inventoryGated,
            inventorySuiGas: inventorySuiGas,
            inventoryMainRoad: inventoryMainRoad,
            inventoryFacingPark: inventoryFacingPark,
          }
        }

        // leadId: leadId,
        // inventoryId: inventoryId,
      })
  }
  catch (err) {
    console.warn(err);
    response = false
  }
  return response
}


const getDeal = async (id, type, business) => {
  var DealList = [];
  console.log(id)

  await firestore()
    .collection('Deal')
    .orderBy('timestamp', 'desc')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { user_id, title, dealAmount, buyerCommission, sellerCommission, buyerAmountinRs, sellerAmountinRs, leads, inventory, businessID, name, role, buyerName, sellerName} = doc.data()
        if(type == "own"){
          if (user_id === id) {
            DealList.push({
              id: doc.id,
              title: title,
              dealAmount: dealAmount,
              buyerCommission: buyerCommission,
              sellerCommission: sellerCommission,
              buyerAmountinRs: buyerAmountinRs,
              sellerAmountinRs: sellerAmountinRs,
              sellerName: sellerName,
              buyerName: buyerName,
              leadDetail: leads,
              inventoryDetail: inventory,
              name: name,
              role: role,
              businessID: businessID
            });
          }
        } 
        else {
          if(user_id === id || businessID == business){
            DealList.push({
              id: doc.id,
              title: title,
              dealAmount: dealAmount,
              buyerCommission: buyerCommission,
              sellerCommission: sellerCommission,
              buyerAmountinRs: buyerAmountinRs,
              sellerAmountinRs: sellerAmountinRs,
              leadDetail: leads,
              sellerName: sellerName,
              buyerName: buyerName,
              inventoryDetail: inventory,
              name: name,
              role: role,
              businessID: businessID
            });
          }
        }
        
      });
    })
  return DealList
}

const getDealCount = async (id) => {
  var DealList = [];

  await firestore().collection('Deal')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { user_id} = doc.data()
        if (user_id === id) {
          DealList.push({
            id: doc.id
          })
        }
      })
    })
    return DealList
}



export default {
  createNewDeals,
  getDeals,
  createNewDeal,
  getDeal,
  getDealCount
}