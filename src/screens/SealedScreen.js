import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    SafeAreaView,
    Image,
    TouchableOpacity,
    BackHandler
} from "react-native";

import {
    Text,
    Modal,
    Portal,
    PaperProvider,
    Button
} from "react-native-paper";
import SQLite from 'react-native-sqlite-storage';
import { DB_FILE_NAME } from "../config";
import {
    deleteExcutedBoard,
    deleteExcutedSeald,
    finishCurrentGame
} from "../helper/database";
import { settingAction } from "../features/SettingSlice";

const db = SQLite.openDatabase(
    {
        name: DB_FILE_NAME,
        location: 'default'
    },
    () => { console.log("Database connected!") }, //on success
    error => console.log("Database error", error) //on error
)

const SealedScreen = (props) => {

    const dispatch = useDispatch();

    const screenWidth = Dimensions.get("screen").width;
    const screenHeight = Dimensions.get("screen").height;

    const { sealedList } = useSelector(state => state.sealed);
    const { sealedAmount, curSettingID } = useSelector(state => state.setting);
    const [cardSize, setCardSize] = useState(0);
    const [curSealedList, setCurSealedList] = useState([]);
    const [activeCard, setActiveCard] = useState(null);
    const [visible, setVisible] = useState(false);

    const onPressSealedCard = async (row, col) => {
        if (activeCard != null)
            return;
        const tmpCard = curSealedList[row][col];
        setActiveCard(tmpCard);
        setVisible(true);
        deleteExcutedBoard(db, curSettingID);
        deleteExcutedSeald(db, curSettingID);
        finishCurrentGame(db, curSettingID);
        dispatch(settingAction({ type: 'finishFlag', data: true }));
    }

    const onPressExit = () => {
        BackHandler.exitApp()
    }

    const onPressNewSetting = () => {
        props.navigation.navigate('setting');
    }

    const onPressMainMenu = () => {
        props.navigation.navigate('main');
    }

    useEffect(() => {
        if (screenWidth > screenHeight)
            setCardSize((screenHeight - 200) / 3);
        else
            setCardSize((screenWidth - 200) / 3);
        let tmpSealedList = [];
        let tmpRowSealed = [];

        for (let i = 0; i < sealedList.length; i++) {
            let tmp = {}
            if ((i + 1) % 3 == 0) {
                tmpRowSealed.push(sealedList[i]);
                tmpSealedList.push(tmpRowSealed);
                tmpRowSealed = [];
            } else {
                tmpRowSealed.push(sealedList[i]);
            }
        }
        tmpSealedList.push(tmpRowSealed);
        setCurSealedList([...tmpSealedList]);
    }, [])

    return (
        <PaperProvider>
            <SafeAreaView style={styles.container}>
                <Portal>
                    <Modal visible={visible} contentContainerStyle={styles.modal}>
                        <Text style={styles.modalTxtMargin} variant="displayMedium">Sealed Name is : <Text variant="displayMedium" style={styles.txtBold}>{activeCard ? activeCard.name : null}</Text></Text>
                        <Text style={styles.modalTxtMargin} variant="displayMedium">Square Number is : <Text variant="displayMedium" style={styles.txtBold}>{activeCard ? activeCard.id : null}</Text></Text>
                        <Text style={styles.modalTxtMargin} variant="displayMedium">Sealed Amount : <Text variant="displayMedium" style={[styles.txtBold, { color: 'red' }]}> $ {sealedAmount}</Text></Text>
                        <View style={styles.modalBtnGroup}>
                            <Button mode="outlined" style={styles.btnWidth} onPress={onPressNewSetting}><Text variant="titleLarge">New Setting</Text></Button>
                            <Button mode="contained" style={styles.btnWidth} onPress={onPressMainMenu}><Text variant="titleLarge">Main Menu</Text></Button>
                            <Button mode="contained-tonal" style={styles.btnWidth} onPress={onPressExit}><Text variant="titleLarge">Exit</Text></Button>
                        </View>
                    </Modal>
                </Portal>
                <View style={styles.header}>
                    <Text variant="displayLarge" >Choose a Box</Text>
                </View>
                <ScrollView style={styles.scrollView}>
                    {
                        curSealedList.map((row, i) => (
                            <View key={i} style={styles.cardRow}>
                                {
                                    row.map((card, j) => (
                                        <TouchableOpacity key={j} onPress={() => { onPressSealedCard(i, j) }} style={[styles.card, { justifyContent: 'center', alignItems: 'center', height: cardSize, width: cardSize }]}>
                                            <Image source={require('../img/sealed.png')} style={{ height: cardSize - 15, width: cardSize - 15, margin: 5 }} />
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        ))
                    }
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>

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
    card: {
        marginRight: 2,
        marginLeft: 2,
        borderRadius: 10,
        borderColor: "#000000",
        borderWidth: 2,
    },
    cardRow: {
        display: 'flex',
        flexDirection: "row",
        marginTop: 5,
        justifyContent: 'space-between',
        paddingTop: 15
    },
    scrollView: {
        marginHorizontal: 20,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 10
    },
    header: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    txtBold: {
        fontWeight: 700
    },
    modalTxtMargin: {
        marginBottom: 20
    },
    modalBtnGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btnWidth: {
        width: 200
    },
    sealedTxt: {
        fontWeight: '700'
    }
});

export default SealedScreen;