import * as SQLite from 'expo-sqlite';
import * as constants from '../styles/constants';

class ValidationErrorsMessages {
    static invalidDataType(correctType) {
        return `Invalid data type [Correct data type ${correctType}]`;
    }

    static valueTooMuch() {
        return `Value too much`;
    }

    static valueTooSmall() {
        return `Value too small`;
    }

    static valueIsEmpty() {
        return `Value cannot be empty`;
    }
};

export function openDB(name) {
    return SQLite.openDatabase(name);
}

export class DatabaseService {
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
                
                        const categoryValues = Object.values(constants.defaultCategories);
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
                                reject(error);
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
                    conditionString += logicalOperator ? ' ' + logicalOperator + ' ': ' AND ';
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
                                resolve(`Запись в Таблицу ${tableName} успешно добавлена: ${result}`)
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
    };
}

export class Category {
    errors = {};

    constructor(data) {
        const { title, avatar } = data;

        this.title = title;
        this.avatar = avatar;
    }

    get title() {
        return this._title;
    }
    
    set title(value) {
        this._title = value;
        this.validateTitle(); 
    }

    get avatar() {
        return this._avatar;
    }
    
    set avatar(value) {
        this._avatar = value;
        this.validateAvatar(); 
    }

    validateTitle() {
        if (typeof this._title !== 'string') {
            this.errors['title'] = ValidationErrorsMessages.invalidDataType('String');
        }
    }
}

export class Activity {
    errors = {};

    constructor(data) {
        const { title, category } = data;
        
        this.title = title;
        this.category = category;
    }

    get title() {
        return this._title;
    }
    
    set title(value) {
        this._title = value;
        this.validateTitle(); 
    }

    get category() {
        return this._category;
    }
    
    set category(value) {
        this._category = value;
        this.validateCategory(); 
    }

    validateTitle() {
        if (typeof this._title !== 'string') {
            this.errors['title'] = ValidationErrorsMessages.invalidDataType('String');
        }
    }
    
    validateCategory() {
        if (typeof this._category !== 'number') {
            this.errors['category'] = ValidationErrorsMessages.invalidDataType('Number');
        }
    }
}

export class Task {
    errors = {};

    constructor(data) {
        const {
            title,
            description, 
            budget,
            route,
            is_route_following,
            is_map_enabled,
            start_latitude,
            start_longitude,
            end_latitude,
            end_longitude,
            created_at,
            started_at,
            ended_at,
            category_id,
            activity_id
        } = data;

        this.title = title
        this.description = description
        this.budget = budget
        this.route = route
        this.is_route_following = is_route_following
        this.is_map_enabled = is_map_enabled
        this.start_latitude = start_latitude
        this.start_longitude = start_longitude
        this.end_latitude = end_latitude
        this.end_longitude = end_longitude
        this.created_at = created_at
        this.started_at = started_at
        this.ended_at = ended_at
        this.category_id = category_id
        this.activity_id = activity_id
    }

    get started_at() {
        return this._started_at;
    }
    
    set started_at(value) {
        this._started_at = value;
        this.validateStarted_at(); 
    }

    get ended_at() {
        return this._ended_at;
    }
    
    set ended_at(value) {
        this._ended_at = value;
        this.validateEnded_at(); 
    }

    get budget() {
        return this._budget;
    }
    
    set budget(value) {
        this._budget = value;
        this.validateBudget(); 
    }

    get category_id() {
        return this._category_id;
    }
    
    set category_id(value) {
        this._category_id = value;
        this.validateCategory_id(); 
    }

    get activity_id() {
        return this._activity_id;
    }
    
    set activity_id(value) {
        this._activity_id = value;
        this.validateActivity_id(); 
    }

    validateCategory_id() {
        if (typeof this._category_id !== 'number') {
            this.errors['category_id'] = ValidationErrorsMessages.valueIsEmpty();

            return;
        }
    }

    validateActivity_id() {
        if (typeof this._activity_id !== 'number') {
            this.errors['activity_id'] = ValidationErrorsMessages.valueIsEmpty();

            return;
        }
    }

    validateBudget() {
        if (typeof this._budget !== 'number') {
            this.errors['budget'] = ValidationErrorsMessages.invalidDataType('Number');;

            return;
        } 
    }

    validateStarted_at() {
        if (typeof this._started_at !== 'number') {
            this.errors['started_at'] = ValidationErrorsMessages.invalidDataType('Number');;

            return;
        }

        if (this._started_at < new Date()) {
            this.errors['started_at'] = ValidationErrorsMessages.valueTooSmall();

            return;
        }
    };

    validateEnded_at() {
        if (typeof this._ended_at !== 'number') {
            this.errors['ended_at'] = ValidationErrorsMessages.invalidDataType('Number');

            return;
        }

        if (this._ended_at < this._started_at) {
            this.errors['ended_at'] = ValidationErrorsMessages.valueTooSmall();

            return;
        }

        if (this._ended_at < new Date()) {
            this.errors['ended_at'] = ValidationErrorsMessages.valueTooSmall();

            return;
        }
    };
}