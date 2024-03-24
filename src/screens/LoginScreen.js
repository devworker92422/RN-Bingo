import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import SQLite from 'react-native-sqlite-storage';
import {
    checkDBUsers,
    insertUserData,
    updateUserPwd,
    compareUserPwd
} from "../helper/database";
import { DB_FILE_NAME } from "../config";

const db = SQLite.openDatabase(
    {
        name: DB_FILE_NAME,
        location: 'default'
    },
    () => { console.log("Database connected!") }, //on success
    error => console.log("Database error", error) //on error
)


const LoginScreen = (props) => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [errorTxt, setErrorText] = useState("");

    const onPressLoginBtn = () => {
        setErrorText("");
        if (name == "" || password == "") {
            setErrorText("Enter the User name and Password");
            return;
        }
        let user = {
            name,
            password
        }
        compareUserPwd(db, user)
            .then((res) => {

            })
    }

    const onPressEditBtn = () => {
        props.navigation.navigate('');
    }

    useEffect(() => {
        checkDBUsers(db)
            .then((val) => {
                if (val == 0) {
                    insertUserData(db)
                }
            })
    }, []);

    return (
        <View style={styles.container}>
            <Text>This is login page</Text>
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
            </View>
            <View style={styles.btnGroup}>
                <Button mode="contained" onPress={onPressLoginBtn}>
                    Login
                </Button>
                <Button mode="outlined" onPress={onPressEditBtn}>
                    Edit
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

export default LoginScreen;