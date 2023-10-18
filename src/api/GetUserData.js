import firestore from '@react-native-firebase/firestore'

const userRecord = async (user_id) => {

  var tempList = [];

  console.log(user_id)

  await firestore().collection('users')
    .get()
    .then(querySnapshot => {
      // var duplicate_User = querySnapshot.size
      // console.log("duplicate", duplicate_User)
      querySnapshot.forEach(doc => {
        const { id,email, image, username,} = doc.data()

       if(id === user_id){
        tempList.push({
          email: email,
          image: image,
          username: username,
        });
        console

       }
        

      });
    })
  
 

  return tempList
}
export default {
  userRecord,
}