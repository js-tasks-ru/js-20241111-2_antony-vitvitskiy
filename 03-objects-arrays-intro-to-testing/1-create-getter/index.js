/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const arrKeys = path.split('.');

    return function(obj) {
        let foundValue;
        
        arrKeys.forEach((key) => {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    obj = obj[key];
                } else if (!!obj[key] || obj[key] === null) {
                    foundValue = obj[key];
                }
            }
        });

        return foundValue;
    }
}
