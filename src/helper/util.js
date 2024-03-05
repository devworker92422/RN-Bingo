
import { sealedCount } from "../config";

export const generateWinner = (total, winnerCount) => {
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
    const winners = numbers.slice(0, winnerCount);
    const sealed = numbers.slice(winnerCount, sealedCount + winnerCount);
    return {
        winnerList: winners,
        sealedList: sealed
    };
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