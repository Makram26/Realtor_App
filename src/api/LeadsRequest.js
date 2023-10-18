import firestore from '@react-native-firebase/firestore'
import { confirmSetupIntent } from '@stripe/stripe-react-native';

const createNewLeads = async (uid, propertyType, catagory, leadName, mobile, portionType,
  bedroomsQuantity, bathroomQuantity, budget, size, sizeType, unitType, societyName, houseNo, description, deal) => {
  let response = true
  var docID = ""
  try {
    firestore()
      .collection('leads')
      .add({
        user_id: uid,
        property_type: propertyType,
        catagory: catagory,
        leadName: leadName,
        mobile: mobile,
        portion_type: portionType,
        bedroomsQuantity: bedroomsQuantity,
        bathroomQuantity: bathroomQuantity,
        budget: budget,
        // location: location,
        size: size,
        size_type: sizeType,
        unitType: unitType,
        societyName: societyName,
        houseNo: houseNo,
        description: description,
        deal: deal
      }).then(docRef => {
        console.log("Document written with ID: ", docRef.id);
        docID = docRef.id
        // console.log("You can now also access this. as expected: ", this.foo)
      })
  }
  catch (err) {
    console.warn(err);
    response = false
  }
  return response
}

const getLeads = async (id, type, business) => {

  var LeadList = [];



  await firestore().collection('leads')
    .orderBy('timestamp','desc')
    .get()
    .then(querySnapshot => {
      // var duplicate_User = querySnapshot.size
      // console.log("duplicate", duplicate_User)
      querySnapshot.forEach(doc => {
        const { user_id, leadName, mobile, property_type, bedroomsQuantity, bathroomQuantity, budget, catagory, portion_type, size, size_type, unitType, societyName, description, deal, hasInventory, businessID, name, role, inventoryProperty, inventoryID, houseNo, hasTask, taskID,facilities,status} = doc.data()
  
        if(type == "own"){
          if (user_id === id && deal == false) {
            LeadList.push({
              id: doc.id,
              leadName: leadName,
              mobile: mobile,
              property_type: property_type,
              // location: location,
              bedroomsQuantity: bedroomsQuantity,
              bathroomQuantity: bathroomQuantity,
              budget: budget,
              catagory: catagory,
              portion_type: portion_type,
              size: size,
              size_type: size_type,
              unitType: unitType,
              societyName: societyName,
              description: description,
              hasInventory: hasInventory,
              name: name,
              role: role,
              businessID: businessID,
              inventoryProperty: inventoryProperty ? inventoryProperty : "",
              inventoryID: inventoryID ? inventoryID : "",
              taskID: taskID ? taskID : "",
              hasTask: hasTask,
              houseNo: houseNo,
              facilities:facilities,
              status:status
            });
          }
        }
        else{
          if(user_id === id || businessID == business){
            if( deal == false){
              LeadList.push({
                id: doc.id,
                leadName: leadName,
                mobile: mobile,
                property_type: property_type,
                // location: location,
                bedroomsQuantity: bedroomsQuantity,
                bathroomQuantity: bathroomQuantity,
                budget: budget,
                catagory: catagory,
                portion_type: portion_type,
                size: size,
                size_type: size_type,
                unitType: unitType,
                societyName: societyName,
                description: description,
                hasInventory: hasInventory,
                name: name,
                role: role,
                businessID: businessID,
                inventoryProperty: inventoryProperty ? inventoryProperty : "",
                inventoryID: inventoryID ? inventoryID : "",
                taskID: taskID ? taskID : "",
                hasTask: hasTask,
                facilities:facilities,
                houseNo: houseNo,
                status:status
              });
            }
          }
        }
        
      });
    })
  return LeadList
}


const getDealsLeads = async (id) => {

  var LeadList = [];

  console.log(id)

  await firestore().collection('leads')
    .get()
    .then(querySnapshot => {
      // var duplicate_User = querySnapshot.size
      // console.log("duplicate", duplicate_User)
      querySnapshot.forEach(doc => {
        const { user_id, leadName, mobile } = doc.data()

        if (user_id === id) {
          LeadList.push({
            id: doc.id,
            leadName: leadName,
            mobile: mobile,
            checked: false
          });

        }


      });
    })



  return LeadList
}

const leadCount = async(id) => {
  var LeadList = [];

  await firestore().collection('leads')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { user_id, deal } = doc.data()

        if (user_id === id && deal == false) {
          LeadList.push({
            id: doc.id,
          });
        }
      });
    })

  return LeadList

}

const getLeadInventory = async(id) => {
  var LeadList = [];
  // console.log(id)
  await firestore().collection('Inventory')
        .get()
        .then(querySnapshot => {
            // var duplicate_User = querySnapshot.size
            // console.log("duplicate", duplicate_User)
            querySnapshot.forEach(doc => {
                const { leadID, houseName, societyName, cityName, demand, rooms, transactionType,sellerName,sellerMobile, propertyImg,catagory,  size, sizeType, description, facilities, viewStatus, leadName,propertyType,isLead } = doc.data()

                if (leadID === id) {
                  LeadList.push({
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
                        leadName: leadName,
                        isLead:isLead,
                        sellerName:sellerName,
                        sellerMobile:sellerMobile,
                        propertyType:propertyType,
                        catagory:catagory
                    });
                }
            }); 
        })
  return LeadList
}

const getLeadContactInformation = async(id) => {
  var LeadList = [];

  await firestore().collection('leads')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { user_id, leadName, mobile } = doc.data()

        if (user_id === id) {
          LeadList.push({
            id: doc.id,
            leadName: leadName,
            mobile: mobile
          });
        }
      });
    })

  return LeadList
}
const getLeadsByAgent = async(id) => {
  var LeadsList = [];

  // console.log(id)

  await firestore()
    .collection('leads')
    .orderBy('timestamp', 'desc')
    .get()
    .then(querySnapshot => {
      // var duplicate_User = querySnapshot.size
      // console.log("duplicate", duplicate_User)
      querySnapshot.forEach(doc => {
        const { user_id, leadName, mobile, property_type, bedroomsQuantity, bathroomQuantity, budget, catagory, portion_type, size, size_type, unitType, societyName, description, deal, hasInventory, businessID, name, role, inventoryProperty, inventoryID, houseNo, hasTask, taskID,facilities,status} = doc.data()
          if (businessID == id) {
            LeadsList.push({
              id: doc.id,
                leadName: leadName,
                mobile: mobile,
                property_type: property_type,
                // location: location,
                bedroomsQuantity: bedroomsQuantity,
                bathroomQuantity: bathroomQuantity,
                budget: budget,
                catagory: catagory,
                portion_type: portion_type,
                size: size,
                size_type: size_type,
                unitType: unitType,
                societyName: societyName,
                description: description,
                hasInventory: hasInventory,
                name: name,
                role: role,
                businessID: businessID,
                inventoryProperty: inventoryProperty ? inventoryProperty : "",
                inventoryID: inventoryID ? inventoryID : "",
                taskID: taskID ? taskID : "",
                hasTask: hasTask,
                facilities:facilities,
                houseNo: houseNo,
                status:status
            });
          }
      });
    })
  return LeadsList
}

export default {
  createNewLeads,
  getLeads,
  getDealsLeads,
  leadCount,
  getLeadInventory,
  getLeadContactInformation,
  getLeadsByAgent
}