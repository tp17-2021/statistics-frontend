export const isDevelopmentMode = process.env.NODE_ENV === "development"

export const abbr = function(x, count = 4) {
    let is_cut = x.length > count;
    count = x.length < count ? x.length : count;
    let text = x.substring(0, count);
    text = is_cut ? text + '...' : text;
    return text;
}

var base = (
    import.meta.env.VITE_API_BASE_PATH || "http://localhost:8222");
export const baseApiUrl = function(path) {
    // let base = "http://localhost:8222";
    return `${base}${path}`;
}

export const getCandidateFullName = function(c) {
    let x = c.degrees_before ? c.degrees_before + " " : "";
    return x + c.first_name + " " + c.last_name;
}

export const addZeroes = function(num) {
    num = typeof num === "number" ? num.toString() : num;
    const dec = num.split('.')[1]
    const len = dec && dec.length > 2 ? dec.length : 2
    return Number(num).toFixed(len)
}

export const roundTwoDecimal = function(num) {
    return Math.round(num * 100) / 100;
}