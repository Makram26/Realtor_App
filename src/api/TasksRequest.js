import firestore from '@react-native-firebase/firestore'

const createNewTask = async (uid, title, subject, date, time, status, priorty, inventory, inventoryID, lead, leadID, note, businessID, role, name, leadName, timestamp) => {
  let response = true
  try {
    firestore()
      .collection('Tasks')
      .add({
        user_id: uid,
        title: title,
        subject: subject,
        date: date,
        time:time,
        status: status,
        priorty: priorty,
        inventory: inventory,
        inventoryID: inventoryID,
        lead: lead,
        leadID: leadID,
        note: note,
        businessID,
        role,
        name,
        leadName,
        timestamp
      })
  }
  catch (err) {
    console.warn(err);
    response = false
  }


  return response
}

const getTasks = async (id, type, business) => {

  var TaskList = [];

  // console.log(id)

  await firestore().collection('Tasks')
    .orderBy('timestamp', 'desc')
    .get()
    .then(querySnapshot => {
      // var duplicate_User = querySnapshot.size
      // console.log("duplicate", duplicate_User)
      querySnapshot.forEach(doc => {
        const { user_id, subject, date, status, priorty, note, inventory, lead, businessID, name, role, title, time } = doc.data()
        if (type == "own") {
          if (user_id === id) {
            TaskList.push({
              id: doc.id, 
              title: title, 
              subject: subject, 
              date: date,  
              status: status, 
              priorty: priorty, 
              time: time, 
              inventory: inventory, 
              lead: lead, 
              name: name, 
              role: role,
              businessID: businessID,
              user_id: user_id,
            });
          }
        }
        else {
          if (user_id === id || businessID == business) {
            TaskList.push({
              id: doc.id,
              title: title,
              subject: subject,
              date: date,
              time: time,
              status: status,
              priorty: priorty,
              note: note,
              inventory: inventory,
              lead: lead,
              name: name,
              role: role,
              businessID: businessID,
              user_id: user_id,
            });
          }
        }
      });
    })



  return TaskList
}

const getMyTasks = async(id) => {
  var TaskList = [];

  // console.log(id)

  await firestore()
    .collection('Tasks')
    .orderBy('timestamp', 'desc')
    .get()
    .then(querySnapshot => {
      // var duplicate_User = querySnapshot.size
      // console.log("duplicate", duplicate_User)
      querySnapshot.forEach(doc => {
        const { user_id, subject, date, status, priorty, note, inventory, lead, businessID, name, role, title, time } = doc.data()
          if (user_id === id) {
            TaskList.push({
              id: doc.id,
              title: title,
              subject: subject,
              date: date,
              time: time,
              status: status,
              priorty: priorty,
              note: note,
              inventory: inventory,
              lead: lead,
              name: name,
              role: role ? role : "",
              businessID: businessID,
              user_id: user_id,
            });
          }
      });
    })
  return TaskList
}

const getTasksByAgent = async(id) => {
  var TaskList = [];

  // console.log(id)

  await firestore()
    .collection('Tasks')
    .orderBy('timestamp', 'desc')
    .get()
    .then(querySnapshot => {
      // var duplicate_User = querySnapshot.size
      // console.log("duplicate", duplicate_User)
      querySnapshot.forEach(doc => {
        const { user_id, subject, date, status, priorty, note, inventory, lead, businessID, name, role, title, time } = doc.data()
          if (businessID == id) {
            TaskList.push({
              id: doc.id,
              title: title,
              subject: subject,
              date: date,
              time: time,
              status: status,
              priorty: priorty,
              note: note,
              inventory: inventory,
              lead: lead,
              name: name,
              role: role ? role : "",
              businessID: businessID,
              user_id: user_id,
            });
          }
      });
    })
  return TaskList
}

const getTaskCount = async (id) => {
  var inventoryList = []

  await firestore().collection('Tasks')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { user_id, status } = doc.data()

        if (user_id === id && status != "Done") {
          inventoryList.push({
            id: doc.id,
          });

        }

      });

    })
    // console.log(inventoryList)
  return inventoryList.length
}

const getDashTasks = async (id, type, business) => {

  var TaskList = [];

  // console.log(id)

  await firestore().collection('Tasks')
    // .where("status","!=","Done")
    .orderBy('date', 'desc')
    .get()
    .then(querySnapshot => {
      // var duplicate_User = querySnapshot.size
      // console.log("duplicate", duplicate_User)
      querySnapshot.forEach(doc => {
        const { user_id, subject, date, status, priorty, note, inventory, lead, businessID, name, leadName, title, time } = doc.data()
        if (type == "own") {
          if (user_id === id && status != "Done") {
            TaskList.push({
              id: doc.id,
              subject: subject,
              title: title,
              date: date,
              time:time,
              status: status,
              priorty: priorty,
              note: note,
              inventory: inventory,
              lead: lead,
              name: name,
              leadName: leadName,
              businessID: businessID,
              user_id: user_id,
            });
          }
        }
        else {
          if (user_id === id && status != "Done" || businessID == business) {
            TaskList.push({
              id: doc.id,
              subject: subject,
              title: title,
              date: date,
              time:time,
              status: status,
              priorty: priorty,
              note: note,
              inventory: inventory,
              lead: lead,
              name: name,
              leadName: leadName,
              businessID: businessID,
              user_id: user_id,
            });
          }
        }
      });
    })
  return TaskList
}

const getInventoryTasks = async (id, type, business) => {
  var inventoryList = [];

  console.log("apiID", id)

  await firestore()
    .collection('Tasks')
    .get()
    .then(querySnapshot => {
      // var duplicate_User = querySnapshot.size
      // console.log("duplicate", duplicate_User)
      querySnapshot.forEach(doc => {
        const { inventoryID, subject, date, status, priorty, inventory, businessID, note, title, time,lead } = doc.data()
        if (type == "own") {
          if (inventoryID === id) {
            inventoryList.push({
              id: doc.id,
              title: title,
              subject: subject,
              date: date,
              time: time,
              status: status,
              priorty: priorty,
              inventory: inventory,
              note: note,
              lead:lead,
              businessID: businessID,
              inventoryID: inventoryID,
            });
          }
        } else {
          if (inventoryID === id && business == businessID) {
            inventoryList.push({
              id: doc.id,
              subject: subject,
              title:title,
              date: date,
              time: time,
              status: status,
              priorty: priorty,
              inventory: inventory,
              note: note,
              lead:lead,
              businessID: businessID,
              inventoryID: inventoryID,
            });
          }
        }
      });
    })

  return inventoryList
}

const getLeadTasks = async (id, type, business) => {
  var leadList = [];

  console.log("apiID", id)

  await firestore().collection('Tasks')
    .orderBy('timestamp', 'desc')
    .get()
    .then(querySnapshot => {
      // var duplicate_User = querySnapshot.size
      // console.log("duplicate", duplicate_User)
      querySnapshot.forEach(doc => {
        const { leadID, subject, date, status, priorty, inventory,lead, businessID, note, title, time } = doc.data()
        console.log("lead id",leadID)
        if (type == "own") {
          if (leadID === id) {
            leadList.push({
              id: doc.id,
              subject: subject,
              title: title,
              date: date,
              time: time,
              status: status,
              priorty: priorty,
              inventory: inventory,
              lead:lead,
              note: note,
              businessID: businessID,
              leadID: leadID,
            });
          }
        } else {
          if (leadID === id && businessID == business) {
            leadList.push({
              id: doc.id,
              subject: subject,
              title:title,
              date: date,
              time: time,
              status: status,
              priorty: priorty,
              inventory: inventory,
              lead:lead,
              note:note,
              businessID: businessID,
              leadID: leadID,
            });
          }
        }
      });
    })

  return leadList
}

const getLeadsForTasks = async (id) => {
  var list = []
  // console.log(id)

  await firestore()
    .collection('leads')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { user_id, property_type, leadName, mobile, size, size_type, deal } = doc.data()

        if (user_id === id && deal == false) {
          list.push({
            id: doc.id,
            property_type: property_type,
            leadName: leadName,
            mobile: mobile,
            size: size,
            size_type: size_type
          });

        }

      });

    })

  return list

}

const getSpecificTasks = async (id) => {
  var TaskList = [];

  // console.log(id)

  await firestore().collection('Tasks')
    .get()
    .then(querySnapshot => {
      // var duplicate_User = querySnapshot.size
      // console.log("duplicate", duplicate_User)
      querySnapshot.forEach(doc => {
        const { subject, date, status, priorty, note, inventory, lead } = doc.data()

        if (doc.id === id) {
          TaskList.push({
            id: doc.id,
            subject: subject,
            date: date,
            status: status,
            priorty: priorty,
            note: note,
            inventory: inventory,
            lead: lead
          });

        }

      });
    })



  return TaskList
}



export default {
  createNewTask,
  getTasks,    //used
  getInventoryTasks,
  getLeadsForTasks,
  getSpecificTasks,
  getDashTasks,
  getLeadTasks,
  getTaskCount,
  getMyTasks, //not used
  getTasksByAgent  //used
}