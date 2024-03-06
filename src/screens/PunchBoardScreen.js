import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    View,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Image,
    TouchableOpacity,
    ToastAndroid
} from "react-native";
import {
    Text,
    Modal,
    PaperProvider,
    Portal,
    TextInput,
    Button
} from "react-native-paper";
import { settingAction } from "../features/SettingSlice";
import { sealedAction } from "../features/SealedSlice";

const PunchBoardScreen = (props) => {
    const dispatch = useDispatch();
    const screenWidth = Dimensions.get("screen").width;
    const screenHeight = Dimensions.get("screen").height;
    const { boardSquares, price, boardType } = useSelector(state => state.setting);
    const [squareSize, setSquareSize] = useState(0);
    const [curBoardSquares, setCurBoardSquares] = useState([...boardSquares]);
    const [currentSquare, setCurrentSquare] = useState();
    const [sealedName, setSealedName] = useState("");
    const [sealedNameList, setSealedLNameist] = useState([]);
    const [visible, setVisible] = useState(false);
    const [count, setCount] = useState(0);

    const showToastWithGravity = (flag) => {
        let str = flag ? 'Success' : 'Failure';
        ToastAndroid.showWithGravity(
            str,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
        );
    };

    const onPressSquare = (rowVal, colVal) => {
        let tmpBoardSquares = JSON.parse(JSON.stringify(curBoardSquares));
        let currentID = tmpBoardSquares[rowVal][colVal].squareID;
        if (tmpBoardSquares[rowVal][colVal].isEverted == true)
            return;
        setCurrentSquare(tmpBoardSquares[rowVal][colVal].squareID);
        if (tmpBoardSquares[rowVal][colVal].isSealed) {
            setVisible(true);
        } else {
            tmpBoardSquares[rowVal][colVal].isEverted = true;
            setCurBoardSquares([...tmpBoardSquares]);
            dispatch(settingAction({ type: 'boardSquares', data: tmpBoardSquares }));
        }
    }

    const onPressOKOfModal = () => {
        let tmpSealNameList = sealedNameList;
        let tmpBoardSquares = JSON.parse(JSON.stringify(curBoardSquares));
        tmpSealNameList.push({ id: currentSquare, name: sealedName });
        if (tmpSealNameList.length > 4) {
            Array.prototype.move = function (from, to) {
                this.splice(to, 0, this.splice(from, 1)[0]);
            };
            tmpSealNameList.move(0, 3);
        }
        setSealedName("");
        setSealedLNameist([...tmpSealNameList]);
        setVisible(false);
        curBoardSquares.map((row, i) => {
            row.map((square, j) => {
                if (square.squareID == currentSquare) {
                    tmpBoardSquares[i][j].isEverted = true;
                    setCurBoardSquares(tmpBoardSquares);
                    dispatch(settingAction({ type: 'boardSquares', data: tmpBoardSquares }));
                }
            });
        });
        dispatch(sealedAction({ type: 'sealedList', data: tmpSealNameList }));
    }

    useEffect(() => {
        const cardTmpWidth = Math.ceil((screenWidth - 100) / boardType.col);
        const cardTmpHeight = Math.ceil((screenHeight - 400) / boardType.row);
        setSquareSize(cardTmpWidth);
    }, []);

    useEffect(() => {
        if (curBoardSquares.length > 0) {
            let flag = 1;
            curBoardSquares.map((row) => {
                row.map((square) => {
                    if (!square.isEverted)
                        flag *= 0;
                });
            });
            if (flag == 1) {
                setTimeout(() => {
                    props.navigation.navigate('sealed');
                }, 1000);
            }
        }
    }, [curBoardSquares])

    return (
        <PaperProvider>
            <Portal>
                <Modal visible={visible} contentContainerStyle={styles.modal}>
                    <View style={styles.sealedName}>
                        <Text variant="titleLarge" style={styles.modalTxt} >
                            Enter the sealed name
                        </Text>
                        <Text variant="titleMedium" style={styles.modalTxt}>
                            Current Square Number : {currentSquare}
                        </Text>
                        <TextInput
                            label="Name"
                            value={sealedName}
                            onChangeText={text => setSealedName(text)}
                        />
                    </View>
                    <Button style={styles.modalBtn} mode="contained" disabled={sealedName == "" ? true : false} onPress={onPressOKOfModal} >OK</Button>
                </Modal>
            </Portal >
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.headTxt}>
                        <Text variant="displayLarge" >
                            Master
                            <Text variant="displayLarge" style={styles.priceTxt}> $ {price} </Text>
                            Per Square
                        </Text>
                    </View>
                    {
                        curBoardSquares.map((row, i) => (
                            < View key={i} style={styles.squareRow} >
                                {
                                    row.map((square, j) => (
                                        <TouchableOpacity key={j} onPress={() => { onPressSquare(i, j) }} style={[styles.square, { justifyContent: 'center', alignItems: 'center', height: squareSize, width: squareSize, backgroundColor: square.isEverted ? 'white' : square.bgColor }]}>
                                            {
                                                square.isEverted && !square.isWinner && !square.isSealed ? (
                                                    <Image source={require('../img/cross.png')} style={{ height: (squareSize - 15), width: (squareSize - 15), margin: 5 }} />
                                                ) : null
                                            }
                                            {
                                                square.isEverted && square.isWinner ? (

                                                    <Text variant="headlineSmall" style={[styles.priceTxt]} >${square.value}</Text>
                                                ) : null
                                            }
                                            {
                                                square.isEverted && square.isSealed ? (
                                                    <Image source={require('../img/sealed.png')} style={{ height: (squareSize - 15), width: (squareSize - 15), margin: 5 }} />
                                                ) : null
                                            }
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        ))
                    }
                </ScrollView>
            </SafeAreaView >
        </PaperProvider >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'right',
        justifyContent: 'center',
        paddingTop: StatusBar.currentHeight,
    },
    headTxt: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20
    },
    priceTxt: {
        fontWeight: '700',
        color: 'red',
    },
    square: {
        marginRight: 2,
        marginLeft: 2,
        borderRadius: 10,
        borderColor: "#000000",
        borderWidth: 2,
    },
    squareRow: {
        display: 'flex',
        flexDirection: "row",
        marginTop: 5,
        justifyContent: 'center',
    },
    scrollView: {
        marginHorizontal: 20,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 10
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    sealedName: {
        padding: 20
    },
    modalBtn: {
        marginLeft: 20,
        marginRight: 20
    },
    modalTxt: {
        paddingBottom: 15
    },
    sealedTxt: {
        fontWeight: '700',
        color: 'black'
    }

});

export default PunchBoardScreen;