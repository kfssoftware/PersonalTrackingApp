import general from "utils/general";
import { ValidationMessages, ValidationRules } from "./validation-rules";
class SValidator {

    constructor() {
        this.constraints = {};
        this.isValid = false;
        this.scopeKey = general.generateRandomString(5);
        this.items = {}
    }

    generateNewScopeKey() {
        this.scopeKey = general.generateRandomString(5);
        return this.scopeKey;
    }


    isNullOrEmpty(value) {
        return (value === "" || value === null || value === undefined || (value instanceof Array && value?.length === 0))
    }

    static addValidationRule(name, validateCallback, messageCallback) {
        ValidationMessages[name] = messageCallback;
        ValidationRules[name] = validateCallback;
    };

    static removeValidationRule(name) {
        delete ValidationMessages[name];
        delete ValidationRules[name];
    };

    allValid() {
        let isValid = true;
        Object.keys(this.items).map(key => {
            const item = this.items[key];
            if (item.scopeKey !== this.scopeKey)
                return;
            var errMsg = this.validateAndGetErrorMessage(key, this.items[key].lastValue, true);
            if (!this.isNullOrEmpty(errMsg))
                isValid = false;
        });
        return isValid;
    }

    register(name, value, rules, scopeKey, setChangedAnyway = false) {
        if (!this.items[name]) {
            this.items[name] = {
                lastValue: null,
                rules: rules,
                errorMessage: null,
                scopeKey,
                isChangedBefore: false
            }
        }
        const item = this.items[name];

        item.scopeKey = scopeKey;
        item.rules = rules;

        var errMsg = this.validateAndGetErrorMessage(name, value, setChangedAnyway);

        this.items[name].lastValue = value;

        return errMsg;

    }





    validateAndGetErrorMessage(name, value, setChangedAnyway = false) {
        const item = this.items[name];

        if (setChangedAnyway)
            item.isChangedBefore = true;

        if (value == item.lastValue && !setChangedAnyway) { // return cached
            return item.errorMessage;
        }
        item.lastValue = value;
        if (!this.isNullOrEmpty(value))
            item.isChangedBefore = true;
        if (!item.isChangedBefore && this.isNullOrEmpty(value)) {
            item.errorMessage = null;
            return null;
        }

        let errMsg = "";
        for (var i = 0; i < item.rules.length; i++) {
            const ruleItem = item.rules[i];
            const isValid = ValidationRules[ruleItem.rule](value, ruleItem?.value);
            if (!isValid) {
                const msg = ruleItem?.message ?? ValidationMessages[ruleItem.rule](value, ruleItem?.value);
                errMsg = msg;
                break;
            }
        }
        item.errorMessage = errMsg;
        return errMsg;
    }

}

export default SValidator;