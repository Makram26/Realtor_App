import firestore from '@react-native-firebase/firestore'

const getInvoiceUser = async (id, type, business) => {
  var InvoiceUserList = [];
  console.log(id)

  await firestore()
    .collection('InvoiceUser')
    .orderBy('timestamp', 'desc')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { user_id, name, phoneNo, email, address, invoicerName, status, businessID, } = doc.data()
        if(type == "own"){
          if (user_id === id) {
            InvoiceUserList.push({
              id: doc.id,
              name: name,
              phoneNo: phoneNo,
              email: email,
              address: address,
              status: status,
              businessID: businessID,
              invoicerName: invoicerName,
            });
          }
        } 
        else {
          if(user_id === id || businessID == business){
            InvoiceUserList.push({
              id: doc.id,
              name: name,
              phoneNo: phoneNo,
              email: email,
              address: address,
              status: status,
              businessID: businessID,
              invoicerName: invoicerName,
            });
          }
        }
        
      });
    })
  return InvoiceUserList
}

export default {
  getInvoiceUser,
}