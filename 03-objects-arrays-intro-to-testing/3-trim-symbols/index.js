/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (!string || size === 0) {
        return "";
    }
    if (!size) {
        return string;
    }
    
    let formattedString = string[0];
    let sameLetterCount = 1;
    for(const char of string) {
      if (char === formattedString[formattedString.length - 1]) {
        if (sameLetterCount < size) {
          formattedString += char;
          sameLetterCount++;
        }
      } else {
        formattedString += char;
        sameLetterCount = 1;
      }
    }

    return formattedString;
}
