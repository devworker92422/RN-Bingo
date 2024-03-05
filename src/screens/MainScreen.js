import {
    StyleSheet,
    View,
    BackHandler,
    Alert
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

const MainScreen = (props) => {

    const { boardSquares, price, boardType, sealedAmount, finishFlag } = useSelector(state => state.setting);

    const onPressSetting = () => {
        if (finishFlag == false && boardSquares.length > 0) {
            Alert.alert('Bingo', 'All of Squares are not sold , Do you want to start new game?', [
                {
                    text: 'Yes',
                    onPress: () => props.navigation.navigate('setting'),
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
        props.navigation.navigate('punchBoard')
    }

    const onPressExit = () => {
        Alert.alert('Bingo', 'Exit Game', [
            {
                text: 'OK',
                onPress: () => BackHandler.exitApp(),
            },
            {
                text: 'Cancel',
                style: 'cancel',
            },
        ]);
        props.navigation.navigate('sealed');
    }

    return (
        <View style={styles.container}>
            {
                boardSquares.length != 0 ? (
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