import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
    DataTable,
    Text,
    Provider,
    Button,
    Modal,
    Portal,
    TextInput
} from 'react-native-paper';
import SQLite from 'react-native-sqlite-storage';
import { DB_FILE_NAME, TABLE_ITEMS_PER_PAGE } from "../config";
import {
    compareUserPwd,
    readAllSetting,
    deleteCompletedGame
} from "../helper/database";

const db = SQLite.openDatabase(
    {
        name: DB_FILE_NAME,
        location: 'default'
    },
    () => { console.log("Database connected!") }, //on success
    error => console.log("Database error", error) //on error
)

const HistoryScreen = (props) => {
    const [page, setPage] = useState(0);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        TABLE_ITEMS_PER_PAGE[0]
    );
    const [items, setItems] = useState([]);
    const [modal, setModal] = useState(false);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [errorTxt, setErrorTxt] = useState("");
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    const onPressClearBtn = () => {
        setModal(true)
    }

    const onPressCancelBtn = () => {
        props.navigation.navigate('main');
    }

    const onPressConfirmBtn = () => {
        setModal(false);
        if (name == "" || password == "") {
            setErrorTxt("Invalid User Name or Password");
            clearErrorTxt();
            return;
        }
        compareUserPwd(db, { name, password })
            .then((result) => {
                if (result > 0) {
                    deleteCompletedGame(db)
                        .then((val) => {
                            initTableData();
                        });
                } else {
                    setErrorTxt("Invalid User Name or Password");
                    clearErrorTxt();
                }
            });
    }

    const initTableData = () => {
        readAllSetting(db)
            .then((data) => {
                console.log("all data ", data);
                setItems([...data]);
            })
    }

    const clearErrorTxt = () => {
        setTimeout(() => {
            setErrorTxt("")
        }, 5000)
    }

    useEffect(() => {
        initTableData();
    }, [])

    return (
        <Provider>
            <View style={styles.container}>
                <Portal>
                    <Modal onDismiss={() => { setModal(false) }} contentContainerStyle={styles.modal} visible={modal} >
                        <Text variant='titleLarge'>Enter the User Name and Password</Text>
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
                                secureTextEntry
                                style={styles.inputTxt}
                                onChangeText={password => setPassword(password)}
                            />
                        </View>
                        <Button mode="contained" onPress={onPressConfirmBtn}>Confirm</Button>
                    </Modal>
                </Portal>
                <Text variant="titleLarge" style={styles.errorTxt}>{errorTxt}</Text>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title style={styles.txtBlod}><Text variant="bodyMedium">Price</Text> </DataTable.Title>
                        <DataTable.Title style={styles.txtBlod}><Text variant="bodyMedium">BoardType</Text></DataTable.Title>
                        <DataTable.Title style={styles.txtBlod}><Text variant="bodyMedium">Sealed Amount</Text></DataTable.Title>
                        <DataTable.Title style={styles.txtBlod}><Text variant="bodyMedium">Profit (%)</Text></DataTable.Title>
                        <DataTable.Title style={styles.txtBlod}><Text variant="bodyMedium">Profit ($)</Text></DataTable.Title>
                        <DataTable.Title style={styles.txtBlod}><Text variant="bodyMedium">Status</Text></DataTable.Title>
                    </DataTable.Header>
                    {items.slice(from, to).map((item) => (
                        <DataTable.Row key={item.id}>
                            <DataTable.Cell><Text variant="labelLarge"> $ {item.price}</Text></DataTable.Cell>
                            <DataTable.Cell><Text variant="labelLarge">{item.b_count} </Text></DataTable.Cell>
                            <DataTable.Cell><Text variant="labelLarge">$ {item.sealed_amount}</Text></DataTable.Cell>
                            <DataTable.Cell><Text variant="labelLarge"> {item.p_rate} %</Text></DataTable.Cell>
                            <DataTable.Cell><Text variant="labelLarge">$ {Math.floor(Number(item.b_count) * Number(item.price) * Number(item.p_rate) / 100)} </Text></DataTable.Cell>
                            <DataTable.Cell><Text variant="labelLarge" style={Number(item.status) == 0 ? styles.progressColor : styles.completeColor}>{Number(item.status) == 0 ? "Progress" : "Complete"}</Text> </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(items.length / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${items.length}`}
                        numberOfItemsPerPageList={TABLE_ITEMS_PER_PAGE}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </DataTable>
                <View style={styles.btnGroup}>
                    <Button mode="contained" style={styles.button} onPress={onPressClearBtn}>
                        Clear
                    </Button>
                    <Button mode="outlined" style={styles.button} onPress={onPressCancelBtn}>
                        Cancel
                    </Button>
                </View>
            </View>
        </Provider>
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
    txtBlod: {
        fontWeight: '700'
    },
    completeColor: {
        color: '#198754'
    },
    progressColor: {
        color: '#0d6efd'
    },
    btnGroup: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        margin: 10
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    inputGroup: {
        marginBottom: 10,
        marginTop: 10
    },
    inputTxt: {
        marginBottom: 10,
        marginTop: 10,
    },
    errorTxt: {
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        color: 'red',
    }
})

export default HistoryScreen;