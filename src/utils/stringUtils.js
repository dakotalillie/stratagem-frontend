export function camelCaseObjectProperties(obj) {
  if (obj === null) return;
  const newObj = {};

  for (let param of Object.keys(obj)) {
    if (typeof obj[param] === 'object' && !Array.isArray(obj[param])) {
      newObj[convertToCamelCase(param)] = camelCaseObjectProperties(obj[param]);
    } else if (Array.isArray(obj[param])) {
      newObj[convertToCamelCase(param)] = camelCaseArrayItems(obj[param]);
    } else {
      newObj[convertToCamelCase(param)] = obj[param];
    }
  }
  
  return newObj;
}

export function camelCaseArrayItems(arr) {
  const newArr = [];

  for (let item of arr) {
    if (typeof item === 'object' && !Array.isArray(item)) {
      newArr.push(camelCaseObjectProperties(item));
    } else if (Array.isArray(item)) {
      newArr.push(camelCaseArrayItems(item));
    } else {
      newArr.push(item);
    }
  }

  return newArr;
}

export function convertToCamelCase(string) {
  const words = string.split("_");
  if (words.length === 1) return string;

  for (let i = 1; i < words.length; i++)
    words[i] = capitalize(words[i]);
  
  return words.join("");
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}