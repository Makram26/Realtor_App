import firestore from '@react-native-firebase/firestore'

const getUsers = async (id) => {
    var userList = [];
    // console.log(id)
    await firestore().collection('UserSettings')
        .get()
        .then(querySnapshot => {
            // var duplicate_User = querySnapshot.size
            // console.log("duplicate", duplicate_User)
            querySnapshot.forEach(doc => {
                const { user_id, name, mobile, city, role, email, status } = doc.data()
                if (user_id === id) {
                    userList.push({
                        id: doc.id,
                        name: name,
                        contact: mobile,
                        city: city,
                        role: role,
                        email: email,
                        status: status
                    });
                }
            });
        })

    return userList
}


const getPaymentStatus = async (user_id) => {
    var users
    // console.log("akram",user_id)
    await firestore().collection('users')
        .where("id", "==", user_id)
        .get()
        .then(querySnapshot => {
            // var duplicate_User = querySnapshot.size
            // console.log("duplicate", duplicate_User)
            querySnapshot.forEach(doc => {
                const { totaUsers } = doc.data()
                users = totaUsers
            });
        })
    // console.log("waleed",userList)
    return users
}

const getTotalUsers = async (user_id) => {
    var users = []
    // console.log("akram",user_id)
    await firestore().collection('UserSettings')
        .where("user_id", "==", user_id)
        .get()
        .then(querySnapshot => {
            // var duplicate_User = querySnapshot.size
            // console.log("duplicate", duplicate_User)
            querySnapshot.forEach(doc => {
                const { name } = doc.data()
                users.push(name)
            });
        })
    // console.log("waleed",userList)
    return users.length
}

const getLeadUsers = async (id, Id_Business) => {
    var userList = [];
    console.log(">>>>>>>>>>>", id)
    console.log("<<<<<<<<<<<<<<<", Id_Business)

    if (Id_Business) {
        await firestore().collection('UserSettings')
            .get()
            .then(querySnapshot => {
                // var duplicate_User = querySnapshot.size
                // console.log("duplicate", duplicate_User)
                querySnapshot.forEach(doc => {
                    const { user_id, name, mobile, city, role, businessID, admin_id, uid } = doc.data()
                    // console.log("uid",businessID)
                    // console.log("user_id",user_id)
                    // console.log("id",id)
                    if (businessID == Id_Business && uid != id) {
                        userList.push({
                            id: doc.id,
                            name: name,
                            contact: mobile,
                            city: city,
                            role: role,
                            uid: businessID,
                            admin_id: admin_id
                        });
                    }
                });
            })
    }
    else {
        await firestore().collection('UserSettings')
        .get()
        .then(querySnapshot => {
            // var duplicate_User = querySnapshot.size
            // console.log("duplicate", duplicate_User)
            querySnapshot.forEach(doc => {
                const { user_id, name, mobile, city, role, businessID, admin_id, uid } = doc.data()
                // console.log("uid",businessID)
                // console.log("user_id",user_id)
                // console.log("id",id)
                if (businessID  && user_id == id) {
                    userList.push({
                        id: doc.id,
                        name: name,
                        contact: mobile,
                        city: city,
                        role: role,
                        uid: businessID,
                        admin_id: admin_id
                    });
                }
            });
        })
    }

    return userList
}

const getAdmins = async () => {
    var adminList = []

    await firestore().collection('users')
        .get()
        .then(querySnapshot => {
            // var duplicate_User = querySnapshot.size
            // console.log("duplicate", duplicate_User)
            querySnapshot.forEach(doc => {
                const { id, name, email } = doc.data()
                adminList.push({
                    id: id,
                    name: name,
                    email: email,
                });
            });
        })

    return adminList

}

export default {
    getUsers,
    getPaymentStatus,
    getTotalUsers,
    getLeadUsers,
    getAdmins
}