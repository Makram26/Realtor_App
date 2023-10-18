import firestore from '@react-native-firebase/firestore'

const getDashTask = async (id, date, type, business) => {
    // console.log(id, date, type, business)
    var TaskList = [];

    // console.log(id,date)

    await firestore().collection('Tasks')
        // .where("user_id", "==", id)
        // .where("date","==",date)
        // .where("status","!=","Done")
        .orderBy('timestamp', 'desc')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const { user_id, date, priorty, status, subject, lead, note, inventory, businessID, name, leadName, title } = doc.data()
                if(type == "own" ){
                    if (user_id === id && date == date && status !== "Done") {
                        TaskList.push({
                            id: doc.id,
                            title: title,
                            date : date,
                            priorty: priorty,
                            status: status,
                            subject: subject,
                            lead: lead,
                            note: note,
                            inventory: inventory,
                            name: name,
                            leadName: leadName
                        });
                    }
                }
                else{
                    if (user_id === id || businessID == business) {
                        if(date == date && status !== "Done") {
                            TaskList.push({
                                id: doc.id,
                                title: title,
                                date : date,
                                priorty: priorty,
                                status: status,
                                subject: subject,
                                lead: lead,
                                note: note,
                                inventory: inventory,
                                name: name,
                                leadName: leadName
                            });
                        }
                      }
                }
            });
        })
    return TaskList
}
export default {
    getDashTask,
}