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

    async removeEntries(tableName, ids) {
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

    async deleteData(tableName, id) {
        return new Promise((resolve, reject) => {
            this.isTableCreated(tableName)
            .then(result => {
                if (!result) {
                    reject(`The [${tableName}] table doesn't exists!`);

                    return;
                }

                this.db.transaction(tx => {
                    tx.executeSql(
                        `DELETE FROM ${tableName} WHERE id = ${id}`, 
                        [],
                        (_, result) => {
                            resolve(true);
                        },
                        (_, error) => {
                            reject(`Error deleting a record from the [${tableName}] table: ${error}`);
                        }
                    );
                });
            });
        });
    }

    async insertData(tableName, data) {
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

    async updateData(tableName, data) {
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

    static openDb(name) {
        return SQLite.openDatabase(name);
    }
}

export class DatabaseService extends DatabaseHandler {
    constructor(db) {
        super(db);
    }

    async createAndInsertDefaultCategories() {
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                const keys = Object.keys(constants.DEFAULT_DATABASE_DATA);
                const placeholders = keys.map(() => '(?, ?)').join(', ');
                const categories = keys.flatMap(item => {
                    return [
                        constants.DEFAULT_DATABASE_DATA[item].title,
                        constants.DEFAULT_DATABASE_DATA[item].avatar
                    ];
                });

                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS category (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT UNQIUE, 
                        avatar TEXT
                    );`,
                    [],
                    (_, result) => {},
                    (_, error) => {
                        reject(`Error creating the [category] table: ${error}`);
                    }
                );

                tx.executeSql(
                    `INSERT INTO category (title, avatar) VALUES ${placeholders};`,
                    categories, 
                    (_, result) => {},
                    (_, error) => {
                        reject(`Error when inserting data into the [category] table: ${error}`);
                    }
                );

                resolve(true);
            });
        })
    }

    async createAndInsertDefaultActivities() {
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                const values = Object.entries(constants.DEFAULT_DATABASE_DATA);
                const activities = values.flatMap(item => 
                    item[1].activities.flatMap(title => [title, item[0]])
                );
                const placeholders = activities
                    .slice(0, activities.length / 2)
                    .map(() => '(?, ?)')
                    .join(', ');

                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS activity (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT,
                        category_id INTEGER,
                        FOREIGN KEY (category_id) REFERENCES category(id)
                    );`,
                    [],
                    (_, result) => {},
                    (_, error) => {
                        reject(`Error creating the [activity] table: ${error}`);
                    }
                );

                tx.executeSql(
                    `INSERT INTO activity (title, category_id) VALUES ${placeholders};`,
                    activities, 
                    (_, result) => {},
                    (_, error) => {
                        reject(`Error when inserting data into the [activity] table: ${error}`);
                    }
                );

                resolve(true);
            });
        })
    }

    async createTask() {
        return new Promise((resolve, reject) => {
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
                    );`,
                    [],
                    (_, result) => {},
                    (_, error) => {
                        reject(`Error creating the [task] table: ${error}`);
                    }
                );
    
                resolve(true);
            });
        })
    }

    async initializeDatabase() {
        Promise.all([
            this.isTableCreated('category'),
            this.isTableCreated('activity'),
            this.isTableCreated('task')
        ])
        .then(([isCategoryCreated, isActivityCreated, isTaskCreated]) => {
            if (!isCategoryCreated) {
                this.createAndInsertDefaultCategories();
            }
            if (!isActivityCreated) {
                this.createAndInsertDefaultActivities();
            }
            if (!isTaskCreated) {
                this.createTask();
            }
        });
    }
}