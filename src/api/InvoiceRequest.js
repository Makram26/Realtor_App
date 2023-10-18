import firestore from '@react-native-firebase/firestore'


const getInvoice = async (id, type, business) => {
  var InvoiceList = [];
  console.log(id)

  await firestore()
    .collection('Invoice')
    .orderBy('timestamp', 'desc')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { user_id, invoiceNo, date, customerName, commission, propertyDetail, totalAmount, dueAmount, paidAmount, businessID, accountType } = doc.data()
        if(type == "own"){
          if (user_id === id) {
            InvoiceList.push({
              id: doc.id,
              invoiceNo: invoiceNo,
              date: date,
              customerName: customerName,
              commission: commission,
              propertyDetail: propertyDetail,
              totalAmount: totalAmount,
              dueAmount: dueAmount,
              paidAmount: paidAmount,
              businessID: businessID,
              accountType: accountType,
            });
          }
        } 
        else {
          if(user_id === id || businessID == business){
            InvoiceList.push({
              id: doc.id,
              invoiceNo: invoiceNo,
              date: date,
              customerName: customerName,
              commission: commission,
              propertyDetail: propertyDetail,
              totalAmount: totalAmount,
              dueAmount: dueAmount,
              paidAmount: paidAmount,
              businessID: businessID,
              accountType: accountType,
            });
          }
        }
        
      });
    })
  return InvoiceList
}



export default {
  getInvoice,
}