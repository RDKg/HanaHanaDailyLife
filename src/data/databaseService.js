import * as constants from '../constants.js';

import { DatabaseHandler } from './databaseHandler.js';

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
                        title TEXT UNIQUE, 
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
        })
        .catch((error) => console.error(`Database initialization error: ${error}`));
    }

    async getExistingYears() {
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(
                    `SELECT 
                        DISTINCT strftime('%Y', datetime(started_at / 1000, 'unixepoch')) AS year
                    FROM task;`,
                    [],
                    (_, {rows}) => {
                        const result = rows._array.map(item => item.year).sort().reverse();
    
                        resolve(result);
                    },
                    (_, error) => {
                        reject(`Error executing the request to get the existing years: ${error}`);
                    }
                );
            });
        });
    }

    async getMonthlyBudgetsOfYear(year) {
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(
                    `SELECT 
                        CAST(strftime('%m', datetime(started_at / 1000, 'unixepoch')) AS INTEGER) AS month,
                        strftime('%Y', datetime(started_at / 1000, 'unixepoch')) AS year,
                        SUM(budget) AS total_budget
                    FROM task
                    WHERE strftime('%Y', datetime(started_at / 1000, 'unixepoch')) = ?
                    GROUP BY month
                    ORDER BY month;`,
                    [year], 
                    (_, {rows}) => {
                        const budgets = rows._array;

                        resolve(budgets);
                    },
                    (_, error) => {
                        reject(`Error executing the request to get monthly budgets of year: ${error}`);
                    }
                );
            });
        });
    }

    async getTasksOfMonthAndYear(year, month) {
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM task
                    WHERE strftime('%Y', datetime(started_at / 1000, 'unixepoch')) = ?
                    AND CAST(strftime('%m', datetime(started_at / 1000, 'unixepoch')) AS INTEGER) = ?;`,
                    [year, month],   
                    (_, {rows}) => {
                        resolve(rows._array);
                    },
                    (_, error) => {
                        reject(`Error executing the request to receive data for the month: ${error}`);
                    }
                );
            });
        });
    }
}