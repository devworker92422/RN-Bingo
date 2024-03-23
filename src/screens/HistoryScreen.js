import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { DataTable, Text, Provider } from 'react-native-paper';
import SQLite from 'react-native-sqlite-storage';
import { DB_FILE_NAME, TABLE_ITEMS_PER_PAGE } from "../config";
import { readAllSetting } from "../helper/database";

const db = SQLite.openDatabase(
    {
        name: DB_FILE_NAME,
        location: 'default'
    },
    () => { console.log("Database connected!") }, //on success
    error => console.log("Database error", error) //on error
)

const HistoryScreen = () => {
    const [page, setPage] = useState(0);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        TABLE_ITEMS_PER_PAGE[0]
    );
    const [items, setItems] = useState([]);
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    useEffect(() => {
        readAllSetting(db)
            .then((data) => {
                console.log(data)
                setItems([...data]);
            })
    }, [])

    return (
        <Provider>
            <View style={styles.container}>
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
    }
})

export default HistoryScreen;