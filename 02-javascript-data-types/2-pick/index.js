/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    let newObj = {};
    Object.entries(obj).forEach((arr) => {
        if (fields.indexOf(arr[0]) !== -1) {
            newObj[arr[0]] = arr[1];
        }
    });

    return newObj;
};
