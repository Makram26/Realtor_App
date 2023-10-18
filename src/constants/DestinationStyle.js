import { StyleSheet } from "react-native";

// Global Style use for Google Places API 
const destStyle = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'silver',
        padding: 10,
        margin: 5,
    },
    textinput:{
        padding: 5,
        borderRadius: 10,
        borderColor: 'black',
        // borderWidth: 1,
        margin: 5,
        paddingLeft: 15,
        backgroundColor: '#e7e7e7',
        marginLeft: 25,
    },


    row:{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        // padding: 5,
        marginHorizontal:10,
    },
    iconContiner:{
        backgroundColor: '#a2a2a2',
        padding: 5,
        borderRadius: 50,
        marginRight: 15,

    },
    locationText:{
        fontWeight: 'bold',
        fontSize: 14.5,
    },


    circle:{
        width: 5,
        height: 5,
        backgroundColor: 'black',
        position: 'absolute',
        top: 20,
        left: 10,
    },
    line:{
        width: 1,
        height: 43,
        backgroundColor: 'black',
        position: 'absolute',
        top: 28,
        left: 12
    },
    square:{
        width: 5,
        height: 5,
        backgroundColor: 'black',
        position: 'absolute',
        top: 75,
        left: 10
    }

})

export default destStyle; 