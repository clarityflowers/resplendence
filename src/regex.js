const regex = (importName) => {
    return RegExp(importName + "(\\(((.|[\\s\\S]])+?)\\))?`(--(\\d+))?((.|[\\s\\S])*?)`", 'g');
}

export default regex;