import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { DataTable, Text } from 'react-native-paper';


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
    const [numberOfItemsPerPageList] = useState([2, 3, 4]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );
    const [items] = useState([
        {
            key: 1,
            name: 'Cupcake',
            calories: 356,
            fat: 16,
        },
        {
            key: 2,
            name: 'Eclair',
            calories: 262,
            fat: 16,
        },
        {
            key: 3,
            name: 'Frozen yogurt',
            calories: 159,
            fat: 6,
        },
        {
            key: 4,
            name: 'Gingerbread',
            calories: 305,
            fat: 3.7,
        },
    ]);
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    return (
        <View style={styles.container}>
            <Text>this is history view screen</Text>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>No</DataTable.Title>
                    <DataTable.Title numeric>Price</DataTable.Title>
                    <DataTable.Title >BoardType</DataTable.Title>
                    {/* <DataTable.Title >Sealed Amount</DataTable.Title>
                    <DataTable.Title >Profit (%)</DataTable.Title>
                    <DataTable.Title >Profit ($)</DataTable.Title>
                    <DataTable.Title >Status</DataTable.Title> */}
                </DataTable.Header>
                {items.slice(from, to).map((item) => (
                    <DataTable.Row key={item.key}>
                        <DataTable.Cell>{item.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.calories}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.fat}</DataTable.Cell>
                    </DataTable.Row>
                ))}
                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(items.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${items.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                />
            </DataTable>
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
})

export default HistoryScreen;