import {
    StyleSheet,
    View,
    Alert,
    BackHandler
} from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SQLite from 'react-native-sqlite-storage';
import { Button, Text } from 'react-native-paper';
import { sealedAction } from '../features/SealedSlice';
import { settingAction } from '../features/SettingSlice';
import {
    checkDBTables,
    createSettingTable,
    createBoardTable,
    createSealedTable,
    readLastSettig,
    readBoardSquares,
    readSealedNames,
    deleteExcutedBoard,
    deleteExcutedSeald,
    finishCurrentGame,
    insertNewSealedName,
    dropTable
} from '../helper/database';
import { DB_FILE_NAME } from '../config';

const db = SQLite.openDatabase(
    {
        name: DB_FILE_NAME,
        location: 'default'
    },
    () => { console.log("Database connected!") }, //on success
    error => console.log("Database error", error) //on error
)

const MainScreen = (props) => {

    const dispatch = useDispatch();
    const { dbFlag, boardSquares, price, boardType, sealedAmount, finishFlag, curSettingID } = useSelector(state => state.setting);

    const [curDBFlag, setCurDBFlag] = useState(dbFlag)

    const onPressSetting = () => {
        if (finishFlag == false && boardSquares.length > 0) {
            Alert.alert('Bingo', 'All of Squares are not sold , Do you want to start new game?', [
                {
                    text: 'Yes',
                    onPress: async () => {
                        deleteExcutedBoard(db, curSettingID);
                        deleteExcutedSeald(db, curSettingID);
                        await finishCurrentGame(db, curSettingID);
                        props.navigation.navigate('setting');
                    },
                },
                {
                    text: 'No',
                    style: 'cancel',
                },
            ]);
            return;
        }
        props.navigation.navigate('setting');
    }

    const onPressStart = () => {
        if (boardSquares.length == 0 || finishFlag == true) {
            Alert.alert('Please fill the setting field');
            return;
        }
        props.navigation.navigate('punchBoard');
    }

    const onPressHistory = () => {
        props.navigation.navigate('history');
    }

    const onPressExit = async () => {
        let tmp = await readSealedNames(db, 1);
        console.log("all setting", tmp)
        // setPreviousSetting(tmp);
        // createUserTable();
        // Alert.alert('Bingo', 'Exit Game', [
        //     {
        //         text: 'OK',
        //         onPress: () => BackHandler.exitApp(),
        //     },
        //     {
        //         text: 'Cancel',
        //         style: 'cancel',
        //     },
        // ]);
    }

    const setPreviousSetting = (setting) => {
        // init setting
        dispatch(settingAction({ type: 'curSettingID', data: Number(setting.id) }));
        dispatch(settingAction({ type: 'price', data: Number(setting.price) }));
        dispatch(settingAction({ type: 'profit', data: Number(setting.p_rate) }));
        dispatch(settingAction({ type: 'boardType', data: { count: setting.b_count, row: setting.b_row, col: setting.b_col } }));
        dispatch(settingAction({ type: 'finishFlag', data: Number(setting.status) == 0 ? false : true }));
        dispatch(settingAction({ type: 'sealedAmount', data: setting.sealed_amount }));

        // init board squares

        readBoardSquares(db, setting.id)
            .then((tmpBoard) => {
                const tmpBoardChunks = [];
                for (let i = 0; i < tmpBoard.length; i += setting.b_col) {
                    tmpBoardChunks.push(tmpBoard.slice(i, i + setting.b_col));
                }
                dispatch(settingAction({ type: 'boardSquares', data: tmpBoardChunks }));
                readSealedNames(db, setting.id)
                    .then((tmpSealed) => {
                        dispatch(sealedAction({ type: 'sealedList', data: tmpSealedName }));
                    });
            });
    }

    useEffect(() => {
        if (curDBFlag == null) {
            checkDBTables(db)
                .then((val) => {
                    if (val == 0) {
                        createSettingTable(db);
                        createBoardTable(db);
                        createSealedTable(db);
                    } else {
                        readLastSettig(db)
                            .then((setting) => {
                                if (setting != null) {
                                    setPreviousSetting(setting);
                                }
                            });
                    }
                    setCurDBFlag(1);
                    dispatch(settingAction({ type: 'dbFlag', data: 1 }));
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [])

    return (
        <View style={styles.container}>
            {
                boardSquares.length > 0 && finishFlag == false ? (
                    <View style={styles.settingGroup}>
                        <View style={styles.priceBar}>
                            <Text variant='headlineLarge' style={styles.fontBold}> ${price}</Text>
                            <Text variant='titleLarge' style={styles.fontLight}>Per Punch</Text>
                        </View>
                        <View style={styles.sealedBar}>
                            <Text variant='headlineLarge' style={[styles.fontBold, { color: 'red' }]}> $ {sealedAmount}</Text>
                            <Text variant='titleLarge' style={styles.fontBold}>Sealed Winner</Text>
                        </View>
                        <View style={styles.boardBar}>
                            <Text variant='headlineLarge' style={styles.fontBold}> {boardType.count}</Text>
                            <Text variant='titleLarge' style={styles.fontLight}> ( {boardType.row} * {boardType.col} )</Text>
                        </View>
                    </View>
                ) : null
            }
            <Button mode='outlined' style={styles.borderSpan} onPress={onPressSetting}>
                <Text style={styles.textWeight} >Setting</Text>
            </Button>
            <Button mode='outlined' style={styles.borderSpan} onPress={onPressStart}>
                <Text style={styles.textWeight} >Start</Text>
            </Button>
            <Button mode='outlined' style={styles.borderSpan} onPress={onPressHistory}>
                <Text style={styles.textWeight} >History</Text>
            </Button>
            <Button mode='outlined' style={styles.borderSpan} onPress={onPressExit}>
                <Text style={styles.textWeight} >Exit</Text>
            </Button>
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
    borderSpan: {
        marginBottom: 15,
        marginTop: 15,
    },
    textWeight: {
        fontSize: 20
    },
    settingGroup: {
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 50,
        borderColor: "#000000",
        borderWidth: 2,
        height: 100,
        marginBottom: 20
    },
    priceBar: {
        flex: 0.25,
        borderRightWidth: 2,
        borderRightColor: "#000000",
        alignItems: 'center',
        justifyContent: 'center',
    },
    sealedBar: {
        flex: 0.5,
        borderLeftColor: "#000000",
        borderLeftWidth: 2,
        borderRightWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boardBar: {
        flex: 0.25,
        borderLeftColor: "#000000",
        borderLeftWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fontLight: {
        fontWeight: 300
    },
    fontBold: {
        fontWeight: 700
    }
});

export default MainScreen;