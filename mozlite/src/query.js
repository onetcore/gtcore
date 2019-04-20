export class Query {
    constructor(search) {
        search = search || location.search;
        if (search && search[0] == '?')
            search = search.substr(1);
        this._query = {};
        let index = search.indexOf('&');
        while (index != -1) {
            let current = search.substr(0, index);
            search = search.substr(index + 1);
            current = split(current);
            if (current) this._query[current.name] = current.value;
            index = search.indexOf('&');
        }
        search = split(search);
        if (search) this._query[search.name] = search.value;
    }

    get(name) {
        return this._query[name];
    }

    set(name, value) {
        this._query[name] = value;
        return this;
    }

    clear() {
        this._query = {};
        return this;
    }

    delete(name) {
        delete this._query[name];
        return this;
    }

    toString() {
        let attr = [];
        for (const key in this._query) {
            attr.push(`${key}=${encodeURIComponent(this._query[key])}`);
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

function split(current) {
    if (current) {
        let index = current.indexOf('=');
        if (index != -1) {
            let src = decodeURIComponent(current.substr(index + 1));
            let value = convert(src);
            return { name: current.substr(0, index), value };
        }
    }
    return null;
}

export const query = new Query();