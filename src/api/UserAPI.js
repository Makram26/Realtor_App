import firestore from '@react-native-firebase/firestore'

const getUsers = async (id) => {
    // var userList = [];
    // console.log(id)
    var mobiles
    await firestore()
        .collection('users')
        .where('id', '==', id)
        .get()
        .then(querySnapshot => {
            // var duplicate_User = querySnapshot.size
            // console.log("duplicate", duplicate_User)
            querySnapshot.forEach(doc => {
                const { mobile } = doc.data()
                
                mobiles = mobile
            });
        })

    return mobiles
}

const getBusinessName = async(id) => {
    var business
    await firestore()
        .collection('users')
        .where('id', '==', id)
        .get()
        .then(querySnapshot => {
            // var duplicate_User = querySnapshot.size
            // console.log("duplicate", duplicate_User)
            querySnapshot.forEach(doc => {
                const { businessName } = doc.data()
                // console.log(mobile)
                business = businessName
            });
        })

    return business
}

export default {
    getUsers,
    getBusinessName
}