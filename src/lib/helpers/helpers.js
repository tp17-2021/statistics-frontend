export const abbr = function(x, count = 4) {
    count = x.length < count ? x.length : count;
    return x.substring(0, count);
}

export const baseApiUrl = function(path) {
    let base = "http://localhost:8222";
    return `${base}${path}`;
}