import { priceStep1, priceStep5, priceStep10, priceStep20 } from "../config";

export const getPriceStep = (price) => {
    switch (price) {
        case 1:
            return priceStep1;
        case 5:
            return priceStep5;
        case 10:
            return priceStep10;
        case 20:
            return priceStep20;
        default:
            return [];
    }
}

export const getWinAmount = (totalAmount, priceStep) => {
    let tmp = totalAmount;
    let count = 0;
    let price = [];
    let stepCount = priceStep.length;
    while (1) {
        if (tmp >= priceStep[0] && tmp <= priceStep[stepCount - 1]) {
            price.push(tmp);
            count++;
            break;
        } else {
            tmp -= priceStep[count % stepCount];
            price.push(priceStep[count % stepCount]);
            count++;
        }
    }
    return price;
}

export const generateRandArray = (total) => {
    let numbers = [];
    for (let i = 0; i < total; i++)
        numbers.push(i);
    let tmp, current, top = numbers.length;
    if (top)
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = numbers[current];
            numbers[current] = numbers[top];
            numbers[top] = tmp;
        }
    return numbers;
}

export const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getRowAndColumn = (total) => {
    switch (total) {
        case 100:
            return { row: 10, col: 10 };
        case 150:
            return { row: 10, col: 15 };
        case 200:
            return { row: 10, col: 20 };
        case 250:
            return { row: 10, col: 25 };
        case 300:
            return { row: 15, col: 20 };
        default:
            return { row: 10, col: 20 };
    }
}