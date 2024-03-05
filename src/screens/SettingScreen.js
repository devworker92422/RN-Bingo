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
import { generateWinner } from '../helper';
import { colorPattern, BoardList, sealedRate, sealedCount } from '../config';

const SettingScreen = (props) => {
    const dispatch = useDispatch();
    const [price, setPrice] = useState(null);
    const [boardType, setBoardType] = useState(null);
    const [profit, setProfit] = useState(null);
    const [winner, setWinner] = useState(null);
    const [profitAmount, setProfitAmount] = useState(null);
    const [sealedAmount, setSealedAmount] = useState(null);
    const [priceModal, setPriceModal] = useState(false);
    const [boardModal, setBoardModal] = useState(false);
    const [profitModal, setProfitModal] = useState(false);

    const onPressSaveBtn = () => {
        const tmpBoard = [];
        let tmpBoardRow = [];
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
        const { winnerList, sealedList } = generateWinner(boardType.count, winner);
        for (let i = 0; i < boardType.count; i++) {
            let tmpSquare = {
                squareID: i,
                isEverted: false,
                bgColor: colorPattern[(i % 3)],
            }
            let winnerFlag = winnerList.find((w) => {
                return w == i;
            });
            let sealedFlag = sealedList.find((s) => {
                return s == i;
            });
            tmpSquare['isWinner'] = winnerFlag == undefined ? false : true;
            tmpSquare['isSealed'] = sealedFlag == undefined ? false : true;
            if (tmpSquare['isWinner'])
                tmpSquare['bgImage'] = './check.png';
            if (tmpSquare['isSealed'])
                tmpSquare['bgImage'] = './sealed.png';
            if (i % boardType.col == (boardType.col - 1)) {
                tmpBoardRow.push(tmpSquare);
                tmpBoard.push(tmpBoardRow);
                tmpBoardRow = [];
            } else {
                tmpBoardRow.push(tmpSquare);
            }
        }
        dispatch(settingAction({ type: 'price', data: Number(price) }));
        dispatch(settingAction({ type: 'profit', data: Number(profit) }));
        dispatch(settingAction({ type: 'boardType', data: boardType }));
        dispatch(settingAction({ type: 'winnerCount', data: winner }));
        dispatch(settingAction({ type: 'sealedAmount', data: sealedAmount }));
        dispatch(settingAction({ type: 'winnerList', data: winnerList }));
        dispatch(settingAction({ type: 'sealedList', data: sealedList }));
        dispatch(settingAction({ type: 'boardSquares', data: tmpBoard }));
        props.navigation.navigate('main');
    }

    const onPressBackBtn = () => {
        props.navigation.navigate('main');
    }

    const onPressRadioBtnOfBoardType = (index) => {
        setBoardType(BoardList[index]);
    }

    useEffect(() => {
        if (boardType != null && profit != null) {
            let tmpWinner = Math.floor((boardType.count - sealedCount) * (100 - profit) / 100);
            let tmpProfit = (boardType.count - tmpWinner - sealedCount) * price;
            let tmpSealedAmount = Math.floor(tmpProfit * sealedRate / 100);
            setWinner(tmpWinner);
            setProfitAmount(tmpProfit - tmpSealedAmount);
            setSealedAmount(tmpSealedAmount);
        }
    }, [boardType, profit])

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
                        <RadioButton.Group value={price} onValueChange={value => setPrice(value)} >
                            <RadioButton.Item label="$1" value="1" />
                            <RadioButton.Item label="$5" value="5" />
                            <RadioButton.Item label="$10" value="10" />
                        </RadioButton.Group>
                        <Button mode="contained" onPress={() => { setPriceModal(false) }}>Save</Button>
                    </Modal>
                    <Modal onDismiss={() => { setBoardModal(false) }} contentContainerStyle={styles.modal} visible={boardModal}>
                        <Text variant='titleLarge'>Choose the Board Type</Text>
                        <RadioButton.Group value={boardType ? boardType.count : null} >
                            {
                                BoardList.map((board, i) => (
                                    <RadioButton.Item key={i} label={board.count + " (" + board.row + " * " + board.col + ")"} value={board.count} onPress={() => { onPressRadioBtnOfBoardType(i) }} />
                                ))
                            }
                        </RadioButton.Group>
                        <Button mode="contained" onPress={() => { setBoardModal(false) }}>Save</Button>
                    </Modal>
                    <Modal onDismiss={() => { setProfitModal(false) }} contentContainerStyle={styles.modal} visible={profitModal}>
                        <Text variant='titleLarge'>Choose the Profit</Text>
                        <RadioButton.Group value={profit} onValueChange={value => setProfit(value)} >
                            <RadioButton.Item label="5%" value="5" />
                            <RadioButton.Item label="10%" value="10" />
                            <RadioButton.Item label="15%" value="15" />
                            <RadioButton.Item label="20%" value="20" />
                            <RadioButton.Item label="25%" value="25" />
                        </RadioButton.Group>
                        <Button mode="contained" onPress={() => { setProfitModal(false) }}>Save</Button>
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
    }
})

export default SettingScreen;