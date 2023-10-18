import { PermissionsAndroid } from 'react-native'

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "App Camera Permission",
                message: "App needs access to your camera ",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Camera permission given");
            openCamara();
        } else {
            alert("Camera permission denied")
            console.log("Camera permission denied");
        }
    } catch (err) {
        console.warn(err);
    }
};

const openCamara = () => {
    const options = {
        storageOptions: {
            path: 'images',
            mediaType: 'photo',
        },
        includeBase64: true,
        maxWidth: 200,
        maxHeight: 200
    };

    launchCamera(options, response => {
        // console.log('Response = ', response);
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            // You can also display the image using data:
            // const source = {uri: 'data:image/png;base64,'+ response.base64};
            const source = { uri: response.assets[0].uri };
            // console.log("source", source)
            if (source !== null) {
                const uri = response.assets[0].uri
                return {source, uri}
            }
        }
    });
};

export default {
    requestCameraPermission
}