import * as SQLite from 'expo-sqlite';

export class DatabaseHandler {
    constructor(db) {
        this.db = db;
    }

    async isTableCreated(tableName) {
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(
                    `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`,
                    [tableName],
                    (_, result) => {
                        resolve(result.rows.length != 0);
                    },
                    (_, error) => {
                        reject(`Error checking the existence of the table [${tableName}]: ${error}`);
                    }
                )
            });
        });
    }

    async dropTable(tableName) {
        return new Promise((resolve, reject) => {
            this.isTableCreated(tableName)
            .then(result => {
                if (!result) {
                    reject(`The [${tableName}] table doesn't exists!`);

                    return;
                }

                this.db.transaction(tx => {
                    tx.executeSql(
                        `DROP TABLE ${tableName};`, 
                        [], 
                        (_, result) => {
                            resolve(result);
                        },
                        (_, error) => {
                            reject(`Table deletion error [${tableName}]: ${error}`);
                        }
                    )
                });
            });
        })
    }

    async clearTable(tableName) {
        return new Promise((resolve, reject) => {
            this.isTableCreated(tableName)
            .then(result => {
                if (!result) {
                    reject(`The [${tableName}] table doesn't exists!`);

                    return;
                }

                this.db.transaction(tx => {
                    tx.executeSql(
                        `DELETE FROM ${tableName};`, 
                        [], 
                        (_, result) => {
                            resolve(result);
                        },
                        (_, error) => {
                            reject(`Table clearing error [${tableName}]: ${error}`);
                        }
                    )
                });
            });
        })
    }

    async getAllTableNames() {
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(
                    `SELECT name FROM sqlite_master WHERE type='table';`,
                    [],
                    (_, result) => {
                        resolve(result.rows);
                    },
                    (_, error) => {
                        reject(`Error getting the names of all tables: ${error}`);
                    }
                );
            })
        });
    }

    async getTableEntries(tableName, order={}, condition={}, count={}) {
        const { orderBy, typeOrder } = order;
        const { limit, offset } = count
        
        let orderString = `${orderBy ? 'ORDER BY ' + orderBy + ' ' + typeOrder : ''}`;
        let countString = '';
        let conditionString = '';

        if (limit || offset) {
            countString = `
                ${limit ? 'LIMIT ' + limit : 'LIMIT 0'} 
                ${offset ? ' OFFSET ' + offset : ' OFFSET 0'}
            `;
        }

        if (Array.isArray(condition)) {
            conditionString += 'WHERE ';

            condition.forEach((item, index, array) => {
                const { field, comparison, value, logicalOperator } = item;
                conditionString += `${field + ' ' + comparison + ' ' + value}`;
            
                if (index !== array.length - 1) {
                    conditionString += logicalOperator ? ' ' + logicalOperator + ' ' : ' AND ';
                }
            })
        }
        else {
            const { field, comparison, value } = condition;

            if (field != null && comparison != null && value != null) {
                conditionString = `${'WHERE ' + field + ' ' + comparison + ' ' + value}`;
            }
        }

        return new Promise((resolve, reject) => {
            this.isTableCreated(tableName)
            .then(result => {
                if (!result) {
                    reject(`The [${tableName}] table doesn't exists!`);

                    return;
                }

                this.db.transaction(tx => {
                    tx.executeSql(
                        `SELECT * FROM ${tableName} 
                        ${conditionString}
                        ${orderString}
                        ${countString};`, 
                        [], 
                        (_, result) => {
                            resolve(result.rows);
                        },
                        (_, error) => {
                            reject(`Error getting data from the [${tableName}] table: ${error}`);
                        }
                    );
                })
            });
        })
    }

    async deleteEntries(tableName, ids) {
        if (typeof ids !== 'object') {
            ids = [ids];
        }

        return new Promise((resolve, reject) => {
            this.isTableCreated(tableName)
            .then(result => {
                if (!result) {
                    reject(`The [${tableName}] table doesn't exists!`);

                    return;
                }

                this.db.transaction(tx => {
                    tx.executeSql(
                        `DELETE FROM ${tableName} WHERE id IN (${ids.join(',')})`, 
                        [], 
                        (_, result) => {
                            resolve(result);
                        },
                        (_, error) => {
                            reject(`Error deleting records from the [${tableName}] table: ${error}`);
                        }
                    );
                });
            });
        })
    }

    async insertEntry(tableName, data) {
        return new Promise((resolve, reject) => {
            this.isTableCreated(tableName)
            .then(result => {
                if (!result) {
                    reject(`The [${tableName}] table doesn't exists!`);

                    return;
                }

                const keys = Object.keys(data).join(', ');
                const values = Object.values(data);
                const placeholders = values.map(item => '?').join(', ');
                const insertQuery = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders});`;

                this.db.transaction(tx => {
                    tx.executeSql(
                        insertQuery, 
                        values,
                        (_, result) => {
                            resolve(result.insertId);
                        },
                        (_, error) => {
                            reject(`Error adding an entry to the [${tableName}] table: ${error}`);
                        }
                    );
                });
            });
        });
    }

    async updateEntry(tableName, data) {
        return new Promise((resolve, reject) => {
            this.isTableCreated(tableName)
            .then(result => {
                if (!result) {
                    reject(`The [${tableName}] table doesn't exists!`);

                    return;
                }

                const dataWithoutID = Object.fromEntries(
                    Object.entries(data).filter(item => item[0] !== 'id')
                );
                const keys = Object.keys(dataWithoutID).map(item => `${item} = ?`).join(', ');
                const values = [...Object.values(dataWithoutID), data.id];
                const insertQuery = `UPDATE ${tableName} SET ${keys} WHERE id = ?;`;

                this.db.transaction(tx => {
                    tx.executeSql(
                        insertQuery, 
                        values,
                        (_, result) => {
                            resolve(result);
                        },
                        (_, error) => {
                            reject(`Error updating a record in the [${tableName}] table: ${error}`);
                        }
                    );
                });
            });
        });
    }

    static openDb(name) {
        return SQLite.openDatabase(name);
    }
}
