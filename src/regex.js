const regex = (importName) => {
    return RegExp(importName + "(\\((.+?)\\))?`((.|[\\s\\S])*?)`", 'g');
}

export default regex;