import AsyncStorage from '@react-native-async-storage/async-storage';
export const login = (userId, password, database, url) => {
    console.log(`${url}web/session/authenticate`)
    return fetch(`${url}web/session/authenticate`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            params: {
                login: userId,
                password: password,
                db: database
            }
        }),
    }).then(res => res.json());
}
export const dealApi = (leadName,mobile,sellerName,sellerMobile,description,buyerCommissionAmount,sellerCommissionAmount,url) => {
    console.log(`${url}api/deal`)
    return fetch(`${url}api/deal`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            params: {
                // leadName: leadName,
                // mobile: mobile,
                // dealAmount,dealAmount,
                // description: description,
                seller_name:sellerName,
                seller_mobile: sellerMobile,
                buyer_name:leadName,
                buyer_mobile: mobile,
                description: description,
                seller_commission: sellerCommissionAmount,
                buyer_commission:buyerCommissionAmount
            }
        }),
    }).then(res => res.json());
}
// export const NotificationApi = (title,message,token) => {
//     return fetch("http://192.168.70.91:5000/sendNotification", {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json, text/plain, */*',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             title:title,
//             message:message,
//             token:token
//         }),
//     }).then(res => res.json());
// }

export const NotificationApi = (title,message,token) => {
    return fetch("http://192.168.80.136:5000/sendNotification", {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title:title,
            message:message,
            token:token
        }),
    }).then(res => res.json());
}

export const storeData = async (userId, password, database, url) => {
    try {
        await AsyncStorage.setItem('user_id', userId.toString())
        await AsyncStorage.setItem('password', password)
        await AsyncStorage.setItem('database', database)
        await AsyncStorage.setItem('url', url)
        console.log(userId)
      
    } catch (e) {
        console.log("error", e)
        // saving error
    }
}
