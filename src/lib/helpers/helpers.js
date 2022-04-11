export const abbr = function(x, count = 4) {
    let is_cut = x.length > count;
    count = x.length < count ? x.length : count;
    let text = x.substring(0, count);
    text = is_cut ? text + '...' : text;
    return text;
}

let base = (
    import.meta.env.API_BASE_PATH || "http://localhost:8222");
export const baseApiUrl = function(path) {
    // let base = "http://localhost:8222";
    return `${base}${path}`;
}

export const getCandidateFullName = function(c) {
    let x = c.degrees_before ? c.degrees_before + " " : "";
    return x + c.first_name + " " + c.last_name;
}