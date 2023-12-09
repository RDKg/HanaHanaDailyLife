import * as SQLite from 'expo-sqlite';
import * as constants from '../constants.js';

export class DatabaseHandler {
    constructor(db) {
        this.db = db;
    }

    async dropTableData(tableName) {
        return new Promise((resolve, reject) => {
            this.isTableCreated(tableName)
            .then(result => {
                if (result) {
                    this.db.transaction(tx => {
                        tx.executeSql(
                            `DROP TABLE ${tableName};`, 
                            [], 
                            (_, result) => {
                                resolve(`Таблица ${tableName} удалена.`)
                            },
                            (_, error) => {
                                reject(error)
                            }
                        );
                    });
                }
                else {
                    reject(`Таблицы ${tableName} не существует.`);
                }
            });
        })
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
                        reject(error);
                    }
                )
            });
        });
    }

    async getTableData(tableName, order={}, condition={}, count={}) {
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
                if (result) {
                    this.db.transaction(tx => {
                        const query = `
                            SELECT * FROM ${tableName} 
                            ${conditionString}
                            ${orderString}
                            ${countString};
                        `;

                        tx.executeSql(
                            query, 
                            [], 
                            (_, result) => {
                                resolve(result.rows);
                            },
                            (_, error) => {
                                reject(error)
                            }
                        );
                    })
                }
                else {
                    reject(`Таблицы ${tableName} не существует.`);
                }
            });
        })
    }

    async removeEntry(tableName, ids) {
        if (typeof ids !== 'object') {
            ids = [ids];
        }

        return new Promise((resolve, reject) => {
            this.isTableCreated(tableName)
            .then(result => {
                if (result) {
                    this.db.transaction(tx => {
                        tx.executeSql(
                            `DELETE FROM ${tableName} WHERE id IN (${ids.join(',')})`, 
                            [], 
                            (_, result) => {
                                resolve(`Таблица ${tableName} удалена.`)
                            },
                            (_, error) => {
                                reject(error)
                            }
                        );
                    });
                }
                else {
                    reject(`Таблицы ${tableName} не существует.`);
                }
            });
        })
    }

    async deleteData(tableName, id) {
        return new Promise((resolve, reject) => {
            this.isTableCreated(tableName)
            .then(result => {
                if (result) {
                    this.db.transaction(tx => {
                        tx.executeSql(
                            `DELETE FROM ${tableName} WHERE id = ${id}`, 
                            [],
                            (_, result) => {
                                resolve(`Запись в Таблице ${tableName} успешно удалена: ${result}`)
                            },
                            (_, error) => {
                                reject(`Ошибка удаления записи в Таблице ${tableName}: ${error}`);
                            }
                        );
                    });
                }
                else {
                    reject(`Таблицы ${tableName} не существует.`);
                }
            });
        });
    }

    async insertData(tableName, data) {
        return new Promise((resolve, reject) => {
            this.isTableCreated(tableName)
            .then(result => {
                if (result) {
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
                                reject(`Ошибка добавления записи в Таблицу ${tableName}: ${error}`);
                            }
                        );
                    });
                }
                else {
                    reject(`Таблицы ${tableName} не существует.`);
                }
            });
        });
    }

    async updateData(tableName, data) {
        return new Promise((resolve, reject) => {
            this.isTableCreated(tableName)
            .then(result => {
                if (result) {
                    const dataWithoutID = Object.fromEntries(
                        Object.entries(data).filter(item => {
                            if (item[0] !== 'id') {
                                return true;
                            }
                        })
                    );
                    const keys = Object.keys(dataWithoutID).map(item => `${item} = ?`).join(', ');
                    const values = [...Object.values(dataWithoutID), data.id];
                    const insertQuery = `UPDATE ${tableName} SET ${keys} WHERE id = ?;`;

                    this.db.transaction(tx => {
                        tx.executeSql(
                            insertQuery, 
                            values,
                            (_, result) => {
                                resolve(`Запись в Таблице ${tableName} успешно обновлена: ${result}`)
                            },
                            (_, error) => {
                                reject(`Ошибка обновления записи в Таблице ${tableName}: ${error}`);
                            }
                        );
                    });
                }
                else {
                    reject(`Таблицы ${tableName} не существует.`);
                }
            });
        });
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
                        reject(`Ошибка получения названия всех таблиц: ${error}`);
                    }
                );
            })
        });
    }

    async createAndInsertDefaultData() {
        return new Promise((resolve, reject) => {
            const isCreated = async () => {
                const isCategoryTableCreated = await this.isTableCreated('category');
                const isActivityTableCreated = await this.isTableCreated('activity');

                return isCategoryTableCreated && isActivityTableCreated;
            } 

            isCreated().then(result => {
                if (result == false) { 
                    this.db.transaction(tx => {
                        tx.executeSql(
                            `CREATE TABLE IF NOT EXISTS category (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                title TEXT UNIQUE, 
                                avatar TEXT
                            );`
                        );
                        tx.executeSql(
                            `CREATE TABLE IF NOT EXISTS activity (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                title TEXT,
                                category_id INTEGER,
                                FOREIGN KEY (category_id) REFERENCES category(id)
                            );`
                        );
                
                        const categoryValues = Object.values(constants.DEFAULT_DATABASE_DATA);
                        const categoryInsertQuery = 'INSERT OR IGNORE INTO category (title, avatar) VALUES ' + 
                        categoryValues.map(() => '(?, ?)').join(', ') + ';';
                        const categoryInsertParams = categoryValues.flatMap(category => [category.title, category.avatar]);
            
                        tx.executeSql(
                            categoryInsertQuery, 
                            categoryInsertParams,
                            (_, result) => {
                                const category_ids = {};
            
                                for (let i = 1; i < categoryValues.length + 1; i++) {
                                    category_ids[categoryValues[i-1].title] = i;
                                }
                
                                const activityValues = [];
                
                                categoryValues.forEach(category => {
                                    const category_id = category_ids[category.title];
                                    const activities = category.activities || [];
                
                                    activities.forEach(activity => {
                                        activityValues.push({title: activity, category_id: category_id})
                                    });
                                });
                
                                const activityInsertQuery = 'INSERT OR IGNORE INTO activity (title, category_id) VALUES ' +
                                activityValues.map(() => '(?, ?)').join(', ') + ';';
                                const activityInsertParams = activityValues.flatMap(activity => [
                                    activity.title,
                                    activity.category_id,
                                ]);

                                tx.executeSql(activityInsertQuery, activityInsertParams);

                                resolve(true);
                            },
                            (_, error) => {
                                reject(`Произошла ошибка во время добавления записи в category: ${error}`);
                            }
                        );
                    });
                }
                else {
                    resolve(false);
                }
            })

            this.db.transaction(tx => {
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS task (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT,
                        description TEXT NULL,
                        budget INTEGER NULL,
                        route TEXT NULL,
                        is_route_following BOOLEAN,
                        is_map_enabled BOOLEAN,
                        start_latitude REAL NULL,
                        start_longitude REAL NULL,
                        end_latitude REAL NULL,
                        end_longitude REAL NULL,
                        created_at INTEGER,
                        started_at INTEGER,
                        ended_at INTEGER,
                        category_id INTEGER,
                        activity_id INTEGER,
                        is_deleted BOOLEAN DEFAULT false,
                        FOREIGN KEY (category_id) REFERENCES category(id),
                        FOREIGN KEY (activity_id) REFERENCES activity(id)
                    );`
                );
            })
        })
    } 

    static openDb(name) {
        return SQLite.openDatabase(name);
    }
}