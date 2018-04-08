export class Query {
    constructor(search) {
        this.query = {};
        search = search || location.search;
        if (search && search[0] == '?')
            search = search.substr(1);
        var index = search.indexOf('&');
        while (index != -1) {
            let current = search.substr(0, index);
            search = search.substr(index + 1);
            if (current) {
                index = current.indexOf('=');
                if (index != -1) {
                    var src = decodeURIComponent(current.substr(index + 1));
                    var value = convert(src);
                    this.query[current.substr(0, index)] = value;
                }
            }
            index = search.indexOf('&');
        }
    }

    get(name) {
        return this.query[name];
    }

    set(name, value) {
        this.query[name] = value;
        return this;
    }

    clear() {
        this.query = {};
        return this;
    }

    delete(name) {
        delete this.query[name];
        return this;
    }

    toString() {
        var attr = [];
        for (const key in this.query) {
            attr.push(`${key}=${encodeURIComponent(this.query[key])}`);
        }
        return attr.join('&');
    }
}

const dateRegex = /^\d{2,4}[-/]\d{1,2}[-/]\d{1,2}[T +]\d{1,2}:\d{1,2}(:\d{1,2})?$/;
const intRegex = /^\d+$/;
const floatRegex = /^[0-9.]+$/;

function convert(value) {
    if (floatRegex.test(value))
        return parseFloat(value);
    if (intRegex.test(value))
        return parseInt(value);
    if (dateRegex.test(value))
        return new Date(value.replace(/[T+]/, ' '));
    return value;
}

export const query = new Query();