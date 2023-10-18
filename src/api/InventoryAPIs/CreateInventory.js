import firestore from '@react-native-firebase/firestore'

const createInventory = async (
    uid,
    transactionType,
    location,
    propertyType,
    unitType,
    floorType,
    demand,
    rooms,
    facilities,
) => {
    let response = true
    try {
        firestore()
            .collection('Inventory')
            .add({
                user_id: uid,
                transactionType: transactionType,
                location: location,
                propertyType: propertyType,
                unitType: unitType,
                floorType: floorType,
                demand: demand,
                rooms: rooms,
                facilities: facilities
            })
    }
    catch (err) {
        console.warn(err);
        response = false
    }
    return response
}

const getInventory = async (id, type, business) => {
    var inventoryList = [];
    console.log("id",id)

    await firestore()
        .collection('Inventory')
        .orderBy('timestamp','desc')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const { user_id, houseName, societyName, cityName, demand, rooms, transactionType, propertyImg,  size, sizeType, description, facilities, viewStatus, deal, leadName, catagory, unitType, floorType, propertyType, isLead, leadID, businessID, name, role, toMarketplace, country,sellerName,sellerMobile } = doc.data()
                if(type == "own"){
                    if (user_id === id && deal == false) {
                        inventoryList.push({
                            id: doc.id,
                            houseName: houseName,
                            societyName: societyName,
                            cityName: cityName,
                            demand: demand, //g 
                            rooms: rooms, //g
                            transactionType: transactionType, //g
                            propertyImg: propertyImg,
                            size: size,
                            sizeType: sizeType,
                            description: description,
                            facilities: facilities,
                            viewStatus: viewStatus,
                            leadName: leadName ? leadName : "",
                            catagory: catagory,
                            unitType: unitType,
                            floorType: floorType,
                            propertyType: propertyType,
                            isLead: isLead,
                            leadID: leadID ? leadID : "",
                            name: name,
                            role: role,
                            businessID: businessID,
                            toMarketplace: toMarketplace,
                            country: country,
                            sellerMobile:sellerMobile,
                            sellerName:sellerName,
                            from: "Inventory"
                        });
                    }
                }
                else{
                    if(user_id === id || businessID == business){
                        if (deal == false) {
                            inventoryList.push({
                                id: doc.id,
                                houseName: houseName,
                                societyName: societyName,
                                cityName: cityName,
                                demand: demand, //g 
                                rooms: rooms, //g
                                transactionType: transactionType, //g
                                propertyImg: propertyImg,
                                size: size,
                                sizeType: sizeType,
                                description: description,
                                facilities: facilities,
                                viewStatus: viewStatus,
                                leadName: leadName ? leadName : "",
                                catagory: catagory,
                                unitType: unitType,
                                floorType: floorType,
                                propertyType: propertyType,
                                isLead: isLead,
                                leadID: leadID ? leadID : "",
                                name: name,
                                role: role,
                                businessID: businessID,
                                toMarketplace: toMarketplace,
                                country: country,
                                sellerMobile:sellerMobile,
                                sellerName:sellerName,
                                from: "Inventory"
                            });
                        }
                    }
                  }
                
            }); 
        })
    return inventoryList
}


// const updateInventory = async (id) => {
//   console.log(id)
//   await getInventory()
//   try {
//     firestore().collection('Inventory').doc(doc.id)
//       .update({
//         viewStatus: viewStatus
//       })
//       .then(() => {
//         console.log("View Status Updated")
//       })
//   } catch (err) {
//     console.log(err)
//     console.log(
//         "Error occured",
//     )
// }
// }

const inventoryCount = async (id) => {
    var inventoryList = [];

    await firestore().collection('Inventory').orderBy('timestamp','desc')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const { user_id, deal } = doc.data()

                if (user_id === id && deal == false) {
                    inventoryList.push({
                        id: doc.id,
                    });

                }

            });
            
        })

    return inventoryList
}



export default {
    createInventory,
    getInventory,
    inventoryCount
}