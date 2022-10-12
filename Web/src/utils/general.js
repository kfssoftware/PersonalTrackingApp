import { notification, message } from "antd";
import i18next from "i18next";
import { RoleActionEnum } from "./enums";
import * as UserTypeEnum from "./enums/user-type-enum"

const UNIT_CONVERSIONS = {
    KG_TO_POUND: 2.2046226218,
    FOOT_TO_CM: 30.48,
    INCH_TO_CH: 2.54,
}

const dateConvertOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
const dateConvertWithTimeOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
const dateConverter = new Intl.DateTimeFormat('en-US', dateConvertOptions);
const dateConverterWithTime = new Intl.DateTimeFormat('en-US', dateConvertWithTimeOptions);

const isNullOrEmpty = (value) => (value === "" || value === null || value === undefined || value === "undefined" || (value instanceof Array && value?.length === 0))

const apiDateFormatToUserFormat = (date, showTime) => {
    if (isNullOrEmpty(date))
        return null;
    if (isNaN(Date.parse(date)))
        return null;
    var parsedDate = new Date(date);
    if (parsedDate === NaN)
        return null;
    if (showTime)
        return dateConverterWithTime.format(parsedDate);
    else
        return dateConverter.format(parsedDate);
}

const FootAndInchToCm = (foot, inch) => {
    if (inch > 11.9) {
        var addFoots = inch / 12;
        if (!(inch % 12)) {
            inch = 0;
        } else {
            inch = inch % 12;
        }
        foot = foot + parseInt(addFoots.toFixed(0), 10);
    }

    var cm = foot * UNIT_CONVERSIONS.FOOT_TO_CM;
    cm += inch * UNIT_CONVERSIONS.INCH_TO_CH;

    return cm.toFixed(2);
}

const convertSeoLink = (text) => {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '').replace(/[\s_-]+/g, '-');
}

const cmToFootAndInch = (cm) => {
    var approxFoot = (cm / UNIT_CONVERSIONS.FOOT_TO_CM);
    var decimals = approxFoot % 1;
    var inch = Math.round(decimals * 12);
    var foot = (parseFloat(cm) < UNIT_CONVERSIONS.FOOT_TO_CM) ? 0 : Math.floor(approxFoot);

    return {
        foot: foot,
        inch: inch
    };
}
const kgToPound = (kg) => {
    return (kg * UNIT_CONVERSIONS.KG_TO_POUND).toFixed(1);
}

const poundToKg = (pound) => {
    return (pound / UNIT_CONVERSIONS.KG_TO_POUND).toFixed(1);
}

const isNumber = value => matchRegexp(value, /^\d+$/);

const isFloat = (value) => {
    const isFloatx = matchRegexp(value, /^(?:-?[1-9]\d*|-?0)?(?:\.\d+)?$/i);
    return isFloatx;
}

const matchRegexp = (value, regexp) => {
    const validationRegexp = (regexp instanceof RegExp ? regexp : (new RegExp(regexp)));
    return (validationRegexp.test(value));
}

const moneyInputRules = [{ rule: "required" }, { rule: "isNumber" }, { rule: "minNumber", value: 1 }, { rule: "maxNumber", value: 9999999 }];

function removeEmojis(string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return string.toString().replace(regex, '');
}

const PhoneRegex = /\d{1}((\(\d{3}\) ?)|(\d{3})\s) ?\d{3} \d{2} \d{2}/g;
const PhoneMask = "1(111) 111 11 11";
const IdentityNoMask = "11111111111";

const notificationSuccess = (message) => {
    notification.success({
        message: i18next.t("general.success"),
        description: i18next.t(message)
    })
}
const notificationError = (message) => {
    notification.error({
        message: "Error",
        description: message
    })
}
const notificationWarning = (message) => {
    notification.warning({
        message: "Warning",
        description: message
    })
}

const messageSuccess = (val) => {
    message.success(val);
}
const messageError = (val) => {
    message.error(val);
}
const messageWarning = (val) => {
    message.warning(val);
}

const arrayMove = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

const generateRandomString = (length = 15) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const generateKeyForUpdateGridItem = (id) => {
    return { id, key: generateRandomString(10) }
}

const addDaysToDate = (date, day) => {
    date.setDate(date.getDate() + day);
    return date;
}

const getFileExtension = fileName => fileName.substr(fileName.lastIndexOf('.') + 1)?.toLowerCase();

const isImageExtension = extension => ["jpg", "jpeg", "png"].includes(extension?.toLowerCase());

const hasAccess = (action) => {
    if (global.roles !== null)
        return global?.roles?.has(action);
    else
        return false
}

const toUpper = text => text?.toLocaleUpperCase('en-US');

const getFirstFile = (filesJson) => {
    if (isNullOrEmpty(filesJson))
        return null;
    const files = JSON.parse(filesJson);
    return files[0];
}
const getCellRendererClassName = (rowData) => {
    // return "rowStyle rowStyle" + rowData?.gridRowStyle
    return "rowStyle rowStyle0"
}
const calculateDistance = (lat1, lon1, lat2, lon2, unit) => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}

export default {
    hasAccess,
    isImageExtension,
    getFileExtension,
    isNullOrEmpty,
    addDaysToDate,
    apiDateFormatToUserFormat,
    FootAndInchToCm,
    messageWarning,
    messageError,
    messageSuccess,
    generateRandomString,
    generateKeyForUpdateGridItem,
    notificationError,
    convertSeoLink,
    PhoneMask,
    IdentityNoMask,
    notificationSuccess,
    notificationWarning,
    PhoneRegex,
    cmToFootAndInch,
    isNumber,
    isFloat,
    kgToPound,
    poundToKg,
    matchRegexp,
    removeEmojis,
    arrayMove,
    moneyInputRules,
    toUpper,
    getFirstFile,
    getCellRendererClassName,
    calculateDistance
}
