import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default function TasksCard({
    title,
    status,
    subject,
    date,
    onPress,
    navigate
}) {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        setCurrentDate(
          date + '/' + month + '/' + year
        );
    }, []);

    // console.log(currentDate)

    return (
        <TouchableOpacity onPress={navigate}>
            <View style={styles.upperContainer}>
                <Text style={styles.subjectText}>{title}</Text>
                <Text style={[styles.textStyle, { width: "20%", textAlign: "right" }]}>{subject}</Text>

            </View>
            
            <View style={styles.lowerContainer}>
                <View style={styles.dateContainer}>
                    <Text style={styles.textStyle}>{date}</Text>

                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    {
                        status == "Late" ?
                            <View style={{ flex: 0.6 }}>
                                <Image style={styles.ClockImage} resizeMode='contain' source={require('../assets/images/clock.png')} />
                            </View>
                        : 
                        currentDate == date ?
                            <View style={{ flex: 0.6 }}>
                                <Image style={styles.ClockImage} resizeMode='contain' source={require('../assets/images/clock.png')} />
                            </View>
                        : null
                    }
                    
                    {
                        status !== "Done" ? 
                            <TouchableOpacity style={styles.doneBtn} onPress={onPress}>
                                <Text style={styles.doneText}>Done</Text>
                            </TouchableOpacity>
                        : null
                    }
                    
                    <TouchableOpacity style={styles.priortyContainer}>
                        <Text style={styles.priortyText}>{status.toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ borderWidth: 0.6, marginTop: 20, marginBottom: 10, borderColor: "#D6D6D6" }} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    upperContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    subjectText: {
        color: "#1A1E25",
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.0113,
        // width: "75%"
    },
    textStyle: {
        color: "#7D7F88",
        fontSize: 13,
        fontWeight: "400",
        letterSpacing: 0.02,
    },
    lowerContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "space-between",
    },
    dateContainer: {
        flex: 1,
        justifyContent: "center"
    },
    ClockImage: {
        width: 20,
        height: 20
    },
    doneBtn:
    {
        // flex: 1.2,
        width:90,
        backgroundColor: "#F2F2F3",
        borderRadius: 10,
        borderWidth: 0.8,
        borderColor: "#E3E3E7",
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    doneText: {
        color: "#7D7F88",
        padding: 0,
        fontSize: 12,
        fontWeight: "400",
        letterSpacing: 0.0113
        // padding: 5
    },
    priortyContainer: {
        flex: 1,
        flexDirection: "row-reverse"
    },
    priortyText: {
        color: "#917AFD",
        fontSize: 14,
        fontWeight: "500",
        letterSpacing: 0.02
    },
   

})
