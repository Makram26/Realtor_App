import React, { createContext, useState } from 'react'
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
export const AuthContext = createContext({})

GoogleSignin.configure({
    webClientId: '975680620261-opas3mrbnf5hn5i3h5r1mhhmeckdnti1.apps.googleusercontent.com',
    // offlineAccess: true
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [confirm, setConfirm] = useState(null);
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                Googlelogin: async () => {
                    try {
                        // Get the users ID token
                        const { idToken } = await GoogleSignin.signIn();

                        // console.log("idToken", idToken)

                        // Create a Google credential with the token
                        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
                        // console.log("googleCredential", googleCredential)
                        // Sign-in the user with the credential
                        //    const response = auth().signInWithCredential(googleCredential);

                        //    console.log("response",response)


                        const response = await auth().signInWithCredential(googleCredential)
                        // console.log(response)
                        
                        return response

                        //  navigation.navigate("BottomTabNavigation")
                    } catch (error) {
                        console.log(error)
                    }
                },
                logout: async () => {
                    try {
                        await auth().signOut()
                    } catch (e) {
                        console.error(e)
                    }
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

