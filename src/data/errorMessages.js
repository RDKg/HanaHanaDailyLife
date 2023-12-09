export class ValidationErrorMessages {
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