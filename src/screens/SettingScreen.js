import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
    Text,
    Button,
    Modal,
    Portal,
    PaperProvider,

    RadioButton
} from 'react-native-paper';
import { settingAction } from '../features/SettingSlice';
import { generateRandArray, getPriceStep, getWinAmount } from '../helper';
import { colorPattern, BoardList, profitList, priceList, sealedRate, sealedCount } from '../config';

const SettingScreen = (props) => {
    const dispatch = useDispatch();
    const [priceID, setPriceID] = useState(0);
    const [boardID, setBoardID] = useState(0);
    const [profitID, setProfitID] = useState(0);
    const [price, setPrice] = useState(null);
    const [boardType, setBoardType] = useState(null);
    const [profit, setProfit] = useState(null);
    const [winner, setWinner] = useState(null);
    const [profitAmount, setProfitAmount] = useState(null);
    const [sealedAmount, setSealedAmount] = useState(null);
    const [winAmounts, setWinAmounts] = useState([]);
    const [priceModal, setPriceModal] = useState(false);
    const [boardModal, setBoardModal] = useState(false);
    const [profitModal, setProfitModal] = useState(false);

    const onPressSaveBtn = () => {
        let tmpBoard = [];
        let tmpBoardChunks = [];
        if (price == null) {
            alert('Please choose the price per square');
            return;
        }
        if (boardType == null) {
            alert('Please choose board type');
            return;
        }
        if (profit == null) {
            alert('Please choose profit rate');
            return;
        }
        const tmp_number_arr = generateRandArray(boardType.count);
        for (let i = 0; i < boardType.count; i++) {
            let tmpSquare = {
                squareID: tmp_number_arr[i],
                isEverted: false,
                isSealed: false,
                isWinner: false,
                value: 0,
                bgColor: colorPattern[(tmp_number_arr[i] % colorPattern.length)],
            }
            if (i < sealedCount)
                tmpSquare['isSealed'] = true;
            if (i > sealedCount && i < (sealedCount + winAmounts.length)) {
                tmpSquare['isWinner'] = true;
                tmpSquare['value'] = winAmounts[i - sealedCount];
            }
            tmpBoard.push(tmpSquare);
        }
        tmpBoard.sort((a, b) => {
            return a.squareID - b.squareID;
        });
        for (let i = 0; i < tmpBoard.length; i += boardType.row) {
            tmpBoardChunks.push(tmpBoard.slice(i, i + boardType.row));
        }
        dispatch(settingAction({ type: 'price', data: Number(price) }));
        dispatch(settingAction({ type: 'profit', data: Number(profit) }));
        dispatch(settingAction({ type: 'boardType', data: boardType }));
        dispatch(settingAction({ type: 'winnerCount', data: winner }));
        dispatch(settingAction({ type: 'finishFlag', data: false }));
        dispatch(settingAction({ type: 'sealedAmount', data: sealedAmount }));
        dispatch(settingAction({ type: 'boardSquares', data: tmpBoardChunks }));
        props.navigation.navigate('main');
    }

    const onPressBackBtn = () => {
        props.navigation.navigate('main');
    }

    const onPressSaveBtnOfPriceModal = () => {
        setPrice(priceList[priceID]);
        setPriceModal(false);
    }

    const onPressSaveBtnOfBoardTypeModal = () => {
        setBoardType(BoardList[boardID]);
        setBoardModal(false);
    }

    const onPressSaveBtnOfProfitModal = () => {
        setProfit(profitList[profitID]);
        setProfitModal(false);
    }

    useEffect(() => {
        if (boardType != null && profit != null && price != null) {
            let totalAmount = boardType.count * price;
            let tmpProfitAmount = Math.floor(totalAmount * profit / 100);
            let tmpSealedAmount = Math.floor(totalAmount * sealedRate / 100);
            let winAmount = totalAmount - tmpProfitAmount - tmpSealedAmount;
            const curPriceStep = getPriceStep(Number(price));
            const winAmountArr = getWinAmount(winAmount, curPriceStep);
            setWinAmounts([...winAmountArr]);
            setWinner(winAmountArr.length);
            setProfitAmount(tmpProfitAmount);
            setSealedAmount(tmpSealedAmount);
        }
    }, [boardType, profit, price])

    return (
        <PaperProvider>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => { setPriceModal(true) }} style={styles.settingItem}>
                    <Text variant="titleLarge">Price per Square :</Text>
                    <Text variant='titleLarge' style={styles.settingValue}> ${price} </Text>
                </TouchableOpacity>
                <Portal>
                    <Modal onDismiss={() => { setPriceModal(false) }} contentContainerStyle={styles.modal} visible={priceModal} >
                        <Text variant='titleLarge'>Choose the Price per Square</Text>
                        {
                            priceList.map((a, index) => (
                                <TouchableOpacity key={index} onPress={() => { setPriceID(index) }} style={styles.radioBtn}>
                                    <Text variant='titleLarge' style={styles.txtBlod}>${a}</Text>
                                    <RadioButton onPress={() => { setPriceID(index) }} status={index === priceID ? 'checked' : 'unchecked'} value={a} />
                                </TouchableOpacity>
                            ))
                        }
                        <Button mode="contained" onPress={onPressSaveBtnOfPriceModal}>Save</Button>
                    </Modal>
                    <Modal onDismiss={() => { setBoardModal(false) }} contentContainerStyle={styles.modal} visible={boardModal}>
                        <Text variant='titleLarge'>Choose the Board Type</Text>
                        {
                            BoardList.map((a, index) => (
                                <TouchableOpacity key={index} onPress={() => { setBoardID(index) }} style={styles.radioBtn}>
                                    <Text variant='titleLarge' style={styles.txtBlod}>{a.count + " (" + a.row + " * " + a.col + ")"}</Text>
                                    <RadioButton onPress={() => { setBoardID(index) }} status={index === boardID ? 'checked' : 'unchecked'} />
                                </TouchableOpacity>
                            ))
                        }
                        <Button mode="contained" onPress={onPressSaveBtnOfBoardTypeModal}>Save</Button>
                    </Modal>
                    <Modal onDismiss={() => { setProfitModal(false) }} contentContainerStyle={styles.modal} visible={profitModal}>
                        <Text variant='titleLarge'>Choose the Profit</Text>
                        {
                            profitList.map((a, index) => (
                                <TouchableOpacity key={index} onPress={() => { setProfitID(index) }} style={styles.radioBtn}>
                                    <Text variant='titleLarge' style={styles.txtBlod}>{a + " %"}</Text>
                                    <RadioButton onPress={() => { setProfitID(index) }} status={index === profitID ? 'checked' : 'unchecked'} />
                                </TouchableOpacity>
                            ))
                        }
                        <Button mode="contained" onPress={onPressSaveBtnOfProfitModal}>Save</Button>
                    </Modal>
                </Portal>
                <TouchableOpacity style={styles.settingItem} onPress={() => { setBoardModal(true) }} >
                    <Text variant="titleLarge">Board Type :</Text>
                    <Text variant='titleLarge' style={styles.settingValue}> {boardType ? boardType.count : null} </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={() => { setProfitModal(true) }}>
                    <Text variant='titleLarge'>Profit :</Text>
                    <Text variant='titleLarge'>{profit} %</Text>
                </TouchableOpacity>
                <View style={styles.detailBar}>
                    <View style={styles.settingItem}>
                        <Text variant='titleLarge'>Total Winner :</Text>
                        <Text variant='titleLarge'>{winner}</Text>
                    </View>
                    <View style={styles.settingItem}>
                        <Text variant='titleLarge'>Sealed Winner Amount :</Text>
                        <Text variant='titleLarge'>{sealedAmount}</Text>
                    </View>
                    <View style={styles.settingItem}>
                        <Text variant='titleLarge'>Profit Amount :</Text>
                        <Text variant='titleLarge'>{profitAmount}</Text>
                    </View>
                    <View style={styles.btnGroup}>
                        <Button mode="contained" style={styles.button} onPress={onPressSaveBtn}><Text style={styles.saveBtnText} variant='titleLarge'>Save</Text> </Button>
                        <Button mode="outlined" style={styles.button} onPress={onPressBackBtn}><Text variant='titleLarge'>Back</Text> </Button>
                    </View>
                </View>
            </View>
        </PaperProvider >

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
    settingItem: {
        display: 'flex',
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center'
    },
    settingValue: {
        alignItems: 'center',
    },
    button: {
        paddingLeft: 15,
        paddingRight: 15
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    btnGroup: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    saveBtnText: {
        color: 'white'
    },
    detailBar: {
        borderTopWidth: 10,
        borderTopColor: '#5c0099',
        paddingTop: 20,
        paddingBottom: 20,
        marginTop: 20
    },
    radioBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
    },
    txtBlod: {
        fontWeight: '700'
    }
})

export default SettingScreen;