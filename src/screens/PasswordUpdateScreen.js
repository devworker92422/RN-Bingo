import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import SQLite from 'react-native-sqlite-storage';
import { updateUserPwd, compareUserPwd } from "../helper/database";
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
    const [errorTxt, setErrorTxt] = useState("");
    const [flag, setFlag] = useState(false);

    const onPressUpdate = () => {
        if (name == "" || password == "" || newPwd == "" || confirmPwd == "") {
            errorTxtHandler("Invalid User Name or Password");
            return;
        }
        if (newPwd != confirmPwd) {
            errorTxtHandler("Password is not matched");
            return;
        }
        if (newPwd.length > 5) {
            errorTxtHandler("Password length must be over 5 letters");
            return;
        }
        compareUserPwd(db, { name, password })
            .then((val) => {
                if (val > 0) {
                    updateUserPwd(db, { name, password: newPwd })
                        .then((val) => {
                            setFlag(true);
                            initState();
                            setTimeout(() => {
                                setFlag(false);
                            }, 8000)
                        })
                } else {
                    errorTxtHandler("Invalid User Name or Password");
                    return;
                }
            })
    }

    const onPressCancel = () => {
        props.navigation.navigate('main');
    }

    const errorTxtHandler = (txt) => {
        setErrorTxt(txt);
        setTimeout(() => {
            setErrorTxt("");
        }, 8000)
    }

    const initState = () => {
        setName("");
        setPassword("");
        setNewPwd("");
        setConfirmPwd("")
    }

    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.headerTxt}>Change the Password</Text>
            {
                flag ? (
                    <Text variant="titleMedium" style={styles.successTxt}>Changed password successfully</Text>
                ) : null
            }
            <Text variant="titleMedium" style={styles.errotTxt}>{errorTxt}</Text>
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
                    secureTextEntry
                    onChangeText={password => setPassword(password)}
                />
                <TextInput
                    label="New Password"
                    value={newPwd}
                    style={styles.inputTxt}
                    secureTextEntry
                    onChangeText={newPwd => setNewPwd(newPwd)}
                />
                <TextInput
                    label="Retype New Password"
                    value={confirmPwd}
                    style={styles.inputTxt}
                    secureTextEntry
                    onChangeText={confirmPwd => setConfirmPwd(confirmPwd)}
                />
            </View>
            <View style={styles.btnGroup}>
                <Button mode="contained" onPress={onPressUpdate} style={styles.button}>
                    Change
                </Button>
                <Button mode="outlined" onPress={onPressCancel} style={styles.button}>
                    Cancel
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
        marginBottom: 10,
        marginTop: 10
    },
    inputGroup: {
        padding: 25
    },
    btnGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        marginLeft: 10,
        marginRight: 10
    },
    headerTxt: {
        textAlign: 'center',
    },
    errotTxt: {
        color: 'red',
        textAlign: 'center',
        paddingBottom: 10,
        paddingTop: 10
    },
    successTxt: {
        color: '#198754',
        textAlign: 'center',
        paddingBottom: 10,
        paddingTop: 10
    }
})

export default PasswordUpdateScreen