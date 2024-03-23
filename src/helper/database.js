
export const checkDBTables = async (db) => {
    let sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='tbl_sealed';";
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                [],
                (tx, resultSet) => {
                    resolve(resultSet.rows.length);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
}

export const createBoardTable = (db) => {
    let sql = `CREATE TABLE IF NOT EXISTS tbl_board (
      "id" INTEGER NOT NULL DEFAULT '' PRIMARY KEY AUTOINCREMENT,
      "setting_id" INTEGER(11),
      "isEverted" integer(11),
      "isWinner" integer(11),
      "isSealed" integer(11),
      "value" integer(11),
      "square_id" INTEGER(11),
      "bg_color" text(255)
    );`;
    let result = false;
    db.executeSql(sql, [], (result) => {
        result = true;
        console.log("create board table success ")
    }, (err) => {
        result = false;
        console.log("create board table failure ")
    });
    return result;
}

export const createSettingTable = (db) => {
    let sql = `CREATE TABLE IF NOT EXISTS tbl_setting (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "b_count" integer(11),
      "b_row" integer(11),
      "b_col" integer(11),
      "price" integer(11),
      "p_rate" integer(11),
      "p_real_amount" integer(11),
      "sealed_amount" integer(11),
      "status" integer(2),
      "create_at" text(255)
    );`;
    let result = false;
    db.executeSql(sql, [], (result) => {
        result = true;
        console.log("create setting table success ")
    }, (err) => {
        result = false;
        console.log("create setting table failure ")
    });
    return result;
}

export const createSealedTable = (db) => {
    let sql = `CREATE TABLE  tbl_sealed (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "square_id" INTEGER(11),
      "setting_id" INTEGER(11),
      "name" text(255)
    );`;
    let result = false;
    db.executeSql(sql, [], (result) => {
        result = true;
        console.log("create sealed table success ")
    }, (err) => {
        result = false;
        console.log("create sealed table failure ")
    });
    return result;
}

export const readLastSettig = async (db) => {
    let sql = "SELECT * FROM tbl_setting where id = (select MAX(id) from tbl_setting)";
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                [],
                (tx, resultSet) => {
                    resolve(resultSet.rows.item(0));
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
}

export const readAllSetting = async (db) => {
    let sql = "SELECT * FROM tbl_setting ORDER BY id DESC";
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            let tmp = [];
            tx.executeSql(
                sql,
                [],
                (tx, resultSet) => {
                    for (let i = 0; i < resultSet.rows.length; i++) {
                        tmp.push(resultSet.rows.item(i))
                    }
                    resolve(tmp);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
}

export const readBoardSquares = async (db, setting_id) => {
    let sql = "SELECT * FROM tbl_board WHERE setting_id = ? ORDER BY square_id"
    let params = [setting_id];
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            let board = [];
            tx.executeSql(
                sql,
                params,
                (tx, resultSet) => {
                    for (let i = 0; i < resultSet.rows.length; i++) {
                        let square = resultSet.rows.item(i);
                        let tmpSlice = {
                            squareID: Number(square.square_id),
                            value: Number(square.value),
                            bgColor: square.bg_color,
                            isEverted: Number(square.isEverted) == 0 ? false : true,
                            isWinner: Number(square.isWinner) == 0 ? false : true,
                            isSealed: Number(square.isSealed) == 0 ? false : true
                        }
                        board.push(tmpSlice);
                    }
                    resolve(board);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
}

export const readSealedNames = async (db, setting_id) => {
    let sql = "SELECT * FROM tbl_sealed WHERE setting_id = ?";
    let params = [setting_id];
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            let tmp = [];
            tx.executeSql(
                sql,
                params,
                (tx, resultSet) => {
                    for (let i = 0; i < resultSet.rows.length; i++) {
                        let tmpSealed = resultSet.rows.item(i);
                        let tmpSlice = {
                            id: Number(tmpSealed.square_id),
                            name: resultSet.rows.item(i).name
                        }
                        tmp.push(tmpSlice);
                    }
                    resolve(tmp);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
}

export const insertNewSetting = async (db, setting) => {
    let sql = "INSERT INTO tbl_setting (b_count, b_row, b_col, price, p_rate, p_real_amount ,sealed_amount ,status ,create_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let params = [setting.b_count, setting.b_row, setting.b_col, setting.price, setting.p_rate, setting.p_real_amount, setting.sealed_amount, setting.status, setting.create_at];
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                params,
                (tx, resultSet) => {
                    resolve(resultSet.insertId);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
}

export const insertBoardSquare = async (db, square, setting_id) => {
    let sql = "INSERT INTO tbl_board (setting_id, isEverted, isWinner, isSealed, value, square_id, bg_color) VALUES (?, ?, ?, ?, ?, ?, ?)";
    let params = [setting_id, square.isEverted, square.isWinner, square.isSealed, square.value, square.squareID, square.bgColor];
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                params,
                (tx, resultSet) => {
                    resolve(resultSet.insertId);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
}

export const insertNewSealedName = (db, sealed) => {
    let sql = "INSERT INTO tbl_sealed (setting_id, square_id,  name) VALUES (?, ?, ?)";
    let params = [sealed.setting_id, sealed.id, sealed.name];
    db.executeSql(sql, params, (result) => {
        result = true;
        console.log("insert new sealed success ")
    }, (err) => {
        result = false;
        console.log("insert new sealed failure ", err)
    });
}

export const deleteExcutedBoard = (db, setting_id) => {
    let sql = "DELETE FROM tbl_board where setting_id = ? "
    let params = [setting_id];
    db.executeSql(sql, params, (result) => {
        console.log("Delete excuted board is success")
    }, (error) => {
        console.log("Delete excuted board success is failure", error);
    });
}

export const deleteExcutedSeald = (db, setting_id) => {
    let sql = "DELETE FROM tbl_sealed where setting_id = ? "
    let params = [setting_id];
    db.executeSql(sql, params, (result) => {
        console.log("Delete excuted sealed is success")
    }, (error) => {
        console.log("Delete excuted sealed success is failure", error);
    });
}


export const updateBoardSquare = async (db, setting_id, square) => {
    let sql = "UPDATE tbl_board SET isEverted = ? WHERE setting_id =? and square_id = ?";
    let params = [square.isEverted, setting_id, square.squareID];
    db.executeSql(sql, params, (result) => {
        console.log("square was updated successfully")
    }, (error) => {
        console.log("square updateing was failed with error", error);
    });
}

export const updateSetting = async (db, setting) => {

}

export const finishCurrentGame = async (db, setting_id) => {
    let sql = "UPDATE tbl_settting SET status = 1 where id = ? ";
    let params = [setting_id];
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                params,
                (tx, resultSet) => {
                    resolve(resultSet);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
}

export const dropTable = (db, table_name) => {
    let sql = "DROP TABLE tbl_sealed ";
    let params = [];
    db.executeSql(sql, params, (result) => {
        console.log(table_name, " was removed successfully")
    }, (error) => {
        console.log(table_name, " was unremoved with error", error);
    });
}
