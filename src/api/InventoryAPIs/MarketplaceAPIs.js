import firestore from '@react-native-firebase/firestore'

const getUsers = async (userid) => {
    var userName

    var foodList = [];
    var paymentsToRecieve = 0

    
    var snapshot = await firestore()
        .collection('Marketplace')
        //.where('status', '==', "Some Amount Received")
        .get()
    
    snapshot.forEach((doc) => {
        const { id, username } = doc.data()
        if(id == userid){
            foodList.push(username);
        }
        
        // foodList.push(foodItem);
    });
    
    
    return userName
          
}

const getMarketplace = async (id) => {

    var inventoryList = [];

    console.log(id)

    // const name = await getUsers(id)
    //console.log("name", name)

    await firestore().collection('Marketplace')
        .get()
        .then(querySnapshot => {
            // var duplicate_User = querySnapshot.size
            // console.log("duplicate", duplicate_User)
            querySnapshot.forEach(doc => {
                const { user_id, demand, location, rooms, transactionType, propertyType, propertyImg, catagory, size, sizeType } = doc.data()

                if (user_id == id) {
                    inventoryList.push({
                        id: doc.id,
                        demand: demand,
                        location: location,
                        rooms: rooms,
                        transactionType: transactionType,
                        propertyType: propertyType,
                        propertyImg: propertyImg,
                        catagory: catagory,
                        size: size,
                        sizeType: sizeType,
                    });

                }

            });
            
        })

    return inventoryList
}

export default {
    getMarketplace
}