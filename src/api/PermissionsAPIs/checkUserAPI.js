import firestore from '@react-native-firebase/firestore'

const checkUserType = async (id) => {
    console.log("login user id",id)

    var duplicate_user

    await firestore().collection('UserSettings')
        .where('uid', '==', id)
        .get()
        .then(querySnapshot => {
            duplicate_user = querySnapshot.size
            console.log("duplicate", duplicate_user)
        })

    return duplicate_user
}

const checkAccessType = async (id) => {
    console.log("agent id",id)

    var user_role
    var businessID
    let templist=[]
    await firestore().collection('UserSettings')
        .where('uid', '==', id)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const { role, businessID } = doc.data()
                templist.push({
                    user_role : role,
                    businessID : businessID
                })
               
            });
        })

    // return {user_role, businessID}
    return templist

}

export default {
    checkUserType,
    checkAccessType
}