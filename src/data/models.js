import { ValidationErrorMessages } from './errorMessages.js';

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
            this.errors['title'] = ValidationErrorMessages.invalidDataType('String');
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
            this.errors['title'] = ValidationErrorMessages.invalidDataType('String');
        }
    }
    
    validateCategory() {
        if (typeof this._category !== 'number') {
            this.errors['category'] = ValidationErrorMessages.invalidDataType('Number');
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
            this.errors['category_id'] = ValidationErrorMessages.valueIsEmpty();

            return;
        }
    }

    validateActivity_id() {
        if (typeof this._activity_id !== 'number') {
            this.errors['activity_id'] = ValidationErrorMessages.valueIsEmpty();

            return;
        }
    }

    validateBudget() {
        if (typeof this._budget !== 'number') {
            this.errors['budget'] = ValidationErrorMessages.invalidDataType('Number');;

            return;
        } 
    }

    validateStarted_at() {
        if (typeof this._started_at !== 'number') {
            this.errors['started_at'] = ValidationErrorMessages.invalidDataType('Number');;

            return;
        }

        if (this._started_at < new Date()) {
            this.errors['started_at'] = ValidationErrorMessages.valueTooSmall();

            return;
        }
    };

    validateEnded_at() {
        if (typeof this._ended_at !== 'number') {
            this.errors['ended_at'] = ValidationErrorMessages.invalidDataType('Number');

            return;
        }

        if (this._ended_at < this._started_at) {
            this.errors['ended_at'] = ValidationErrorMessages.valueTooSmall();

            return;
        }

        if (this._ended_at < new Date()) {
            this.errors['ended_at'] = ValidationErrorMessages.valueTooSmall();

            return;
        }
    };
}