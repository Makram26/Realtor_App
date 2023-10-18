import firestore from '@react-native-firebase/firestore'

const getInventory = async (id, type, business) => {
    var inventoryList = [];
    console.log("id",id)

    await firestore()
        .collection('Inventory')
        .orderBy('timestamp','desc')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const { user_id, houseName, societyName, cityName, demand, rooms, transactionType, propertyImg,  size, sizeType, description, facilities, viewStatus, deal, leadName, catagory, unitType, floorType, propertyType, isLead, leadID, businessID, name, role, toMarketplace } = doc.data()
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
                            toMarketplace: toMarketplace
                        });
                    }
                }
                else{
                    if(user_id === id && deal == false){
                        if (businessID == business) {
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
                                toMarketplace: toMarketplace
                            });
                        }
                    }
                  }
                
            }); 
        })
    return inventoryList
}

const getMarketplace = async (city, countryName) => {
    var inventoryList = [];
    console.log("countryName",countryName)

    await firestore()
        .collection('Marketplace')
        .orderBy('timestamp','desc')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const { user_id, houseName, societyName, cityName, demand, rooms, transactionType, propertyImg,  size, sizeType, description, facilities, viewStatus, deal, leadName, catagory, unitType, floorType, propertyType, isLead, leadID, businessID, name, role, country, mobileNumber, propertyID} = doc.data()
                if(deal == false && countryName == country && city == cityName){
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
                        user_id: user_id,
                        mobileNumber: mobileNumber,
                        propertyID: propertyID
                    });
                }
            }); 
        })
    return inventoryList
}

const getFilterMarketPlaceInventories = async (id, transaction, society, property, min, max) => {
    var inventoryList = [];

    await firestore()
        .collection('Marketplace')
        .orderBy('timestamp','desc')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const { user_id, houseName, societyName, cityName, demand, rooms, transactionType, propertyImg,  size, sizeType, description, facilities, viewStatus, deal, leadName, catagory, unitType, floorType, propertyType, isLead, leadID, businessID, name, role, propertyID } = doc.data()
                if(user_id == id && deal == false){
                    if(transaction == transactionType || society == societyName || property == propertyType || (demand >= min && demand <= max)){
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
                            user_id: user_id,
                            propertyID: propertyID
                        });
                    }
                }
            }); 
        })
    return inventoryList
}

const getMarketplaceCount = async(id, countryName) => {
    var inventoryList = [];

    await firestore()
        .collection('Marketplace')
        .orderBy('timestamp','desc')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const { user_id, deal, country } = doc.data()

                if (user_id == id && deal == false && countryName == country) {
                    inventoryList.push({
                        id: doc.id,
                    });

                }

            });
            
        })

    return inventoryList
}

const getLeadInventoryMarketplace = async (uid, city, countryName) => {
    var inventoryList = [];
    //console.log("countryName",countryName)

    await firestore()
        .collection('Marketplace')
        .orderBy('timestamp','desc')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const { user_id, houseName, societyName, cityName, demand, rooms, transactionType, propertyImg,  size, sizeType, description, facilities, viewStatus, deal, leadName, catagory, unitType, floorType, propertyType, isLead, leadID, businessID, name, role, country, mobileNumber,} = doc.data()
                if(uid !== user_id && deal == false && countryName == country && city == cityName){
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
                        user_id: user_id,
                        mobileNumber: mobileNumber,
                        from: "Marketplace"
                    });
                }
            }); 
        })
    return inventoryList
}

const dealMarketplaceInventories = async(lead, uid, city, countryName) => {
    var inventoryList = [];

    await firestore()
        .collection('Marketplace')
        .orderBy('timestamp','desc')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const { user_id, houseName, societyName, cityName, demand, rooms, transactionType, propertyImg,  size, sizeType, description, facilities, viewStatus, deal, leadName, catagory, unitType, floorType, propertyType, isLead, leadID, businessID, name, role, country, mobileNumber, ofLead } = doc.data()
                if(ofLead == lead && uid !== user_id && deal == false && countryName == country && city == cityName){
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
                        user_id: user_id,
                        mobileNumber: mobileNumber,
                        from: "Marketplace"
                    });
                }
            }); 
        })
    return inventoryList
}

export default {
    getInventory,
    getMarketplace,
    getFilterMarketPlaceInventories,
    getMarketplaceCount,
    getLeadInventoryMarketplace,
    dealMarketplaceInventories
}