import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import SQLite from 'react-native-sqlite-storage';
import { updateUserPwd } from "../helper/database";
import { DB_FILE_NAME } from "../config";

const db = SQLite.openDatabase(
    {
        name: DB_FILE_NAME,
        location: 'default'
    },
    () => { console.log("Database connected!") }, //on success
    error => console.log("Database error", error) //on error
)

const PasswordUpdateScreen = (props) => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");

    const onPressUpdate = () => {

    }

    const onPressCancel = () => {
        props.navigation.navigate('main');
    }

    return (
        <View style={styles.container}>
            <Text>This is Pwd Change Screen</Text>
            <View style={styles.inputGroup}>
                <TextInput
                    label="User Name"
                    value={name}
                    style={styles.inputTxt}
                    onChangeText={name => setName(name)}
                />
                <TextInput
                    label="Password"
                    value={password}
                    style={styles.inputTxt}
                    onChangeText={password => setPassword(password)}
                />
                <TextInput
                    label="New Password"
                    value={newPwd}
                    style={styles.inputTxt}
                    onChangeText={newPwd => setNewPwd(newPwd)}
                />
                <TextInput
                    label="Retype New Password"
                    value={confirmPwd}
                    style={styles.inputTxt}
                    onChangeText={confirmPwd => setConfirmPwd(confirmPwd)}
                />
            </View>
            <View style={styles.btnGroup}>
                <Button mode="contained" onPress={onPressUpdate}>
                    <Text>Update</Text>
                </Button>
                <Button mode="outlined" onPress={onPressCancel}>
                    <Text>Cancel</Text>
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'right',
        justifyContent: 'center',
        padding: 25
    },
    inputTxt: {
        padding: 10
    },
    inputGroup: {
        padding: 25
    },
    btnGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    }
})

export default PasswordUpdateScreen