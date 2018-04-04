! function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.mozlite = t() : e.mozlite = t()
}(window, function() {
    return function(e) {
        var t = {};

        function n(o) { if (t[o]) return t[o].exports; var r = t[o] = { i: o, l: !1, exports: {} }; return e[o].call(r.exports, r, r.exports, n), r.l = !0, r.exports }
        return n.m = e, n.c = t, n.d = function(e, t, o) { n.o(e, t) || Object.defineProperty(e, t, { configurable: !1, enumerable: !0, get: o }) }, n.r = function(e) { Object.defineProperty(e, "__esModule", { value: !0 }) }, n.n = function(e) { var t = e && e.__esModule ? function() { return e.default } : function() { return e }; return n.d(t, "a", t), t }, n.o = function(e, t) { return Object.prototype.hasOwnProperty.call(e, t) }, n.p = "", n(n.s = 0)
    }([function(e, t, n) {
        "use strict";
        (function(e) { n(1), e(function() { alert("xx") }) }).call(this, n(! function() { var e = new Error('Cannot find module "jquery"'); throw e.code = "MODULE_NOT_FOUND", e }()))
    }, function(e, t) {}])
});