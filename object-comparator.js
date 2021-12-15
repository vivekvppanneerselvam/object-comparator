import { trim } from "jquery";
import { isObject } from "util";
import { isDate } from "util/types";


const VALUE_CREATED = 'created', VALUE_UPDATED = "updated", VALUE_DELETED = "deleted", VALUE_UNCHANGED = "unchanged"

const compare = (obj1, obj2) => {
    if (isFunction(obj1) || isFunction(obj2)) {
        throw 'Invalid argument, function given, object expected.';
    }
    if (isValue(obj1) || isValue(obj2)) {
        var type = compareValues(obj1, obj2)
        if (type === "updated")
            return {
                oldValue: obj1 === undefined ? '' : obj1,
                newValue: obj2 === undefined ? '' : obj2
            };
        else
            return false
    }
    var diff = {};
    for (var key in obj1) {
        if (isFunction(obj1[key])) {
            continue;
        }
        var value2 = undefined;
        if (obj2[key] !== undefined) {
            value2 = obj2[key];
        }
        if (compare(obj1[key], value2) === false)
            continue;
        diff[key] = compare(obj1[key], value2);
    }
    for (var key in obj2) {
        if (isFunction(obj2[key]) || diff[key] !== undefined) {
            continue;
        }
        if (compare(undefined, obj2[key]) === false)
            continue;
        diff[key] = compare(undefined, obj2[key]);

    }
    return diff;
}

const compareValues = (value1, value2) => {
    if (trim(value1) === trim(value2)) {
        return VALUE_UNCHANGED;
    }
    if (isDate(value1) && isDate(value2) && value1.getTime() === value2.getTime()) {
        return VALUE_UNCHANGED;
    }
    if (value1 === undefined) {
        return VALUE_CREATED;
    }
    if (value2 === undefined) {
        return VALUE_DELETED;
    }
    return VALUE_UPDATED;
}

const trim = (x) => {
    if (typeof x !== "number" && typeof x !== "object") {
        return (x !== undefined) ? (x !== null && x !== "null") ? x.trim() : '' : ''
    } else {
        return x
    }
}
const isFunction = (x) => {
    return Object.prototype.toString.call(x) === '[object Function]';
}

const isArray = (x) => {
    return Object.prototype.toString.call(x) === '[object Array]';
}
const isDate = (x) => {
    return Object.prototype.toString.call(x) === '[object Date]';
}
const isObject = (x) => {
    return Object.prototype.toString.call(x) === '[object Object]';
}

const isValue = (x) => {
    return !isObject(x) && !isArray(x);
}

export { compare, compareValues, isFunction, isArray, isDate, isObject, isValue }