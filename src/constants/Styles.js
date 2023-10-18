import { StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import Colors from './Colors';

export const WelcomeScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        marginTop: 5
    },
    imageStyle: {
        width: "100%",
        height: "96%",
        marginTop: 5,
        justifyContent: 'flex-end'
    },
    welsomeText: {
        fontSize: 24,
        color: "#312C2C",
        fontWeight: "800",
        marginLeft: 15,
    },
    notesText: {
        textAlign: 'center',
        marginBottom: 2,
        fontSize: 16,
        color: "#7D7F88",
        fontWeight: "400",
        marginLeft: 15,
        marginRight: 5
    },
    siginContainer: {
        backgroundColor: "#6A88E8",
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
        borderRadius: 100,
        borderColor: "#6A88E8",
        borderWidth: 1,
        elevation: 0.9
    },
    siginText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: '500',
        padding: 13
    },
    signupContainer: {
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        marginBottom: 15,
        marginRight: 15,
        borderRadius: 100,
        borderColor: "#E3E3E7",
        borderWidth: 1,
        elevation: 0.9
    },
    signupText: {
        color: "#475569",
        fontSize: 18,
        fontWeight: '500',
        padding: 13
    },
    SocialIcon:{
        borderRadius:12,
        height:50,
        backgroundColor:"#1F45FC"
    },
});
export const LogInScreenStyle = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#FCFCFC"
    },
    Header: {
        height: "10%",
        backgroundColor: "#FFFFFF",
        // backgroundColor: "#FCFCFC",
        // justifyContent: 'center',
        borderBottomEndRadius: 40,
        shadowColor: "#282B4E",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 20,
    },
    WolcomeText:{
        color: "#6179E4", 
        marginLeft: 25, 
        fontSize: 28, 
        fontWeight: "800", 
        marginTop: 5
    },
    HeaderText:{
        color: "#464646", 
        marginLeft: 25, 
        fontSize: 15, 
        fontWeight: "500",
    },
    MobileNumberContainer:{
        backgroundColor: "#fcfcfc",
        flexDirection: 'row',
        color: "#1A1E25",
        // alignItems: 'center', 
        // margin: 15, 
        borderRadius: 100,
        borderColor: "#6681E6",
        borderWidth: 1,
        elevation: 0.9
    },
    headingMobileText:{
        fontSize: 14,
        color: '#C0C0C0',
        marginBottom: 13
    },
    personIcon:{
        justifyContent: 'center', 
        marginLeft: 8
    },
    MobileInput:{
        padding:10
    },
    headingPassword:{
        marginTop: 25,
        fontSize: 14,
        color: '#C0C0C0',
        marginBottom: 13
    },
    PasswordContainer:{
        backgroundColor: "#fff",
        flexDirection: "row",
        color: "#7D7F88",
        // alignItems: 'center', 
        // margin: 15, 
        padding: 3,
        borderRadius: 100,
        borderColor: "#fff",
        borderWidth: 1,
        elevation: 20
    },
    KeyIcon:{
        justifyContent: 'center', 
        marginLeft: 5
    },
    PasswordInput:{
        padding: 10, 
        width: "90%"
    },
    HideShowIcon:{
        justifyContent: "space-evenly", 
        marginRight: 10
    },
    LoginBtn:{
        backgroundColor: "#6885E7",
        justifyContent: 'center',
        marginTop: 50,
        // alignItems: 'center', 
        // margin: 15, 
        padding: 10,
        borderRadius: 100,
        borderColor: "#6885E7",
        borderWidth: 1,
        elevation: 20
    },
    LoginBtnText:{
        textAlign: 'center', 
        fontSize: 18, 
        padding: 5, 
        color: "#FFFFFF"
    },
    ForgotText:{
        color: "#7D7F88", 
        textAlign: 'center', 
        fontSize: 15, 
        marginTop: 15, 
        marginBottom: 50 
    },
    Drawline:{
        borderColor: "#A8B9FF", 
        borderWidth: 0.5, 
        marginTop: 40
    },
    ORContainer:{
        justifyContent: 'center', 
        alignItems: 'center',
    },
    ORText:{
        width: 80, 
        textAlign: 'center', 
        borderRadius: 100, 
        marginTop: -25, 
        padding: 10, 
        backgroundColor: "#A8B9FF", 
        fontSize: 20, 
        fontWeight: "600" 
    },
    SignUpBtn:{
        backgroundColor: "#F3F5FF",
        justifyContent: 'center',
        marginTop: 60,
        marginBottom: 10,
        // alignItems: 'center', 
        // margin: 15, 
        padding: 10,
        borderRadius: 100,
        borderColor: "#6179E4",
        borderWidth: 1,
        elevation: 20
    },
    SingUpText:{
        textAlign: 'center', 
        fontSize: 18, 
        fontWeight: "500", 
        padding: 5, 
        color: "#6179E4"
    }

})
export const SignUpScreenStyle = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#FCFCFC"
    },
    Heading:{
        marginTop: 25,
        fontSize: 17,
        color: '#1A1E25',
        marginBottom: 13
    },
    inputTextStyle:{
        padding: 10, 
        fontSize: 12,
        width: "90%"
    },
    InputBox:{
        backgroundColor: "#fff",
        color: "#7D7F88",
        // alignItems: 'center', 
        // margin: 15, 
        borderRadius: 100,
        borderColor: "#fff",
        borderWidth: 1,
        elevation: 20
    },
    Button:{
        backgroundColor: "#6885E7",
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 10,
        // alignItems: 'center', 
        // margin: 15, 
        padding: 10,
        borderRadius: 100,
        borderColor: "#6179E4",
        borderWidth: 1,
        elevation: 20
    },
    btnText:{
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "500",
        padding: 5,
        color: "#FFFFFF"
    }
    
})

export const DrawerStyle = StyleSheet.create({
    mainContainer:{
        flex:1
    },
    iconContainer:{
        // width: RFPercentage(8), 
        // height: RFValue(55), 
        width: 48,
        height:48,
        elevation: 2, 
        borderRadius: 10, 
        backgroundColor: "#FDFDFD", 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    userDetailsContainer:{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: -25, 
        margin: 15 
    },
    username:{
        color: "#1A1E25", 
        fontSize: 24, 
        fontWeight: "600",
        marginTop:10
    },
    usermail:{
        color: "#7D7F88", 
        fontSize: 16, 
        fontWeight: '400' ,
       
    
    },
    iconStyle:{
        flex: 0.1, 
        height:40,
        width:40, 
        elevation: 1, 
        borderRadius: 10, 
        backgroundColor: "#fff", 
        borderWidth: 0.6, 
        borderColor: "#E3E3E7", 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    DrawerDataContainer:{
        flex: 0.9, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginLeft: 10, 
        alignItems: 'center' 
    },
    textStyle:{
        color: "#1A1E25", 
        fontSize: 16, 
        fontWeight: "500"
    }
    
    
})
export const HeaderStyle = StyleSheet.create({
    mainContainer:{
        
        // backgroundColor: "red",
        width: "92%",
        alignSelf: 'center',
        flexDirection: 'row',
        alignSelf:"center", 
        marginTop: 20, 
       
    },
    arrowbox:{
        elevation: 2, 
        borderRadius: 10, 
        backgroundColor: "#FDFDFD", 
        borderWidth: 0.5, 
        borderColor: "#E3E3E7", 
        height: 34, 
        width: 34, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    HeaderTextContainer:{
        height: 30, 
        width: "88.1%", 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginLeft: 10, 
        alignItems: 'center',
       
    },
    HeaderText:{
        color: "#1A1E25", 
        fontSize: 18, 
        fontWeight: '600' ,
        marginLeft:5
    },
    HeaderImage:{
        width: 32.36, 
        height: 31.45,
        borderRadius: 50
    },
    calendarIcon:{
        width: 18, 
        height: 18,
        marginRight:10
    },
    searchContainer:{
        backgroundColor: "#F2F2F3", 
        flexDirection: 'row', 
        borderColor: "#E3E3E7", 
        borderWidth: 0.8, 
        alignSelf:"center",
        alignItems:"center",
        width: "92%", 
        borderRadius: 100, 
        // marginLeft: 15, 
        // marginRight: 20, 
        marginTop: 20
    },
    searchText:{
        marginLeft: 5,
        width: "85%", 
        fontSize: 16, 
        fontWeight: "normal"
    }


    
})