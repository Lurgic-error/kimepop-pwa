try {
    self["workbox:core:6.5.1"] && _()
} catch {}
const N = (n, ...e) => {
        let t = n;
        return e.length > 0 && (t += ` :: ${JSON.stringify(e)}`), t
    },
    v = N;
class l extends Error {
    constructor(e, t) {
        const s = v(e, t);
        super(s), this.name = e, this.details = t
    }
}
const f = {
        googleAnalytics: "googleAnalytics",
        precache: "precache-v2",
        prefix: "workbox",
        runtime: "runtime",
        suffix: typeof registration != "undefined" ? registration.scope : ""
    },
    C = n => [f.prefix, n, f.suffix].filter(e => e && e.length > 0).join("-"),
    x = n => {
        for (const e of Object.keys(f)) n(e)
    },
    U = {
        updateDetails: n => {
            x(e => {
                typeof n[e] == "string" && (f[e] = n[e])
            })
        },
        getGoogleAnalyticsName: n => n || C(f.googleAnalytics),
        getPrecacheName: n => n || C(f.precache),
        getPrefix: () => f.prefix,
        getRuntimeName: n => n || C(f.runtime),
        getSuffix: () => f.suffix
    };

function L(n, e) {
    const t = e();
    return n.waitUntil(t), t
}
try {
    self["workbox:precaching:6.5.1"] && _()
} catch {}
const O = "__WB_REVISION__";

function E(n) {
    if (!n) throw new l("add-to-cache-list-unexpected-type", {
        entry: n
    });
    if (typeof n == "string") {
        const r = new URL(n, location.href);
        return {
            cacheKey: r.href,
            url: r.href
        }
    }
    const {
        revision: e,
        url: t
    } = n;
    if (!t) throw new l("add-to-cache-list-unexpected-type", {
        entry: n
    });
    if (!e) {
        const r = new URL(t, location.href);
        return {
            cacheKey: r.href,
            url: r.href
        }
    }
    const s = new URL(t, location.href),
        a = new URL(t, location.href);
    return s.searchParams.set(O, e), {
        cacheKey: s.href,
        url: a.href
    }
}
class M {
    constructor() {
        this.updatedURLs = [], this.notUpdatedURLs = [], this.handlerWillStart = async ({
            request: e,
            state: t
        }) => {
            t && (t.originalRequest = e)
        }, this.cachedResponseWillBeUsed = async ({
            event: e,
            state: t,
            cachedResponse: s
        }) => {
            if (e.type === "install" && t && t.originalRequest && t.originalRequest instanceof Request) {
                const a = t.originalRequest.url;
                s ? this.notUpdatedURLs.push(a) : this.updatedURLs.push(a)
            }
            return s
        }
    }
}
class I {
    constructor({
        precacheController: e
    }) {
        this.cacheKeyWillBeUsed = async ({
            request: t,
            params: s
        }) => {
            const a = (s == null ? void 0 : s.cacheKey) || this._precacheController.getCacheKeyForURL(t.url);
            return a ? new Request(a, {
                headers: t.headers
            }) : t
        }, this._precacheController = e
    }
}
let p;

function A() {
    if (p === void 0) {
        const n = new Response("");
        if ("body" in n) try {
            new Response(n.body), p = !0
        } catch {
            p = !1
        }
        p = !1
    }
    return p
}
async function S(n, e) {
    let t = null;
    if (n.url && (t = new URL(n.url).origin), t !== self.location.origin) throw new l("cross-origin-copy-response", {
        origin: t
    });
    const s = n.clone(),
        a = {
            headers: new Headers(s.headers),
            status: s.status,
            statusText: s.statusText
        },
        r = e ? e(a) : a,
        i = A() ? s.body : await s.blob();
    return new Response(i, r)
}
const W = n => new URL(String(n), location.href).href.replace(new RegExp(`^${location.origin}`), "");

function P(n, e) {
    const t = new URL(n);
    for (const s of e) t.searchParams.delete(s);
    return t.href
}
async function q(n, e, t, s) {
    const a = P(e.url, t);
    if (e.url === a) return n.match(e, s);
    const r = Object.assign(Object.assign({}, s), {
            ignoreSearch: !0
        }),
        i = await n.keys(e, r);
    for (const c of i) {
        const o = P(c.url, t);
        if (a === o) return n.match(c, s)
    }
}
class D {
    constructor() {
        this.promise = new Promise((e, t) => {
            this.resolve = e, this.reject = t
        })
    }
}
const j = new Set;
async function H() {
    for (const n of j) await n()
}

function F(n) {
    return new Promise(e => setTimeout(e, n))
}
try {
    self["workbox:strategies:6.5.1"] && _()
} catch {}

function R(n) {
    return typeof n == "string" ? new Request(n) : n
}
class B {
    constructor(e, t) {
        this._cacheKeys = {}, Object.assign(this, t), this.event = t.event, this._strategy = e, this._handlerDeferred = new D, this._extendLifetimePromises = [], this._plugins = [...e.plugins], this._pluginStateMap = new Map;
        for (const s of this._plugins) this._pluginStateMap.set(s, {});
        this.event.waitUntil(this._handlerDeferred.promise)
    }
    async fetch(e) {
        const {
            event: t
        } = this;
        let s = R(e);
        if (s.mode === "navigate" && t instanceof FetchEvent && t.preloadResponse) {
            const i = await t.preloadResponse;
            if (i) return i
        }
        const a = this.hasCallback("fetchDidFail") ? s.clone() : null;
        try {
            for (const i of this.iterateCallbacks("requestWillFetch")) s = await i({
                request: s.clone(),
                event: t
            })
        } catch (i) {
            if (i instanceof Error) throw new l("plugin-error-request-will-fetch", {
                thrownErrorMessage: i.message
            })
        }
        const r = s.clone();
        try {
            let i;
            i = await fetch(s, s.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
            for (const c of this.iterateCallbacks("fetchDidSucceed")) i = await c({
                event: t,
                request: r,
                response: i
            });
            return i
        } catch (i) {
            throw a && await this.runCallbacks("fetchDidFail", {
                error: i,
                event: t,
                originalRequest: a.clone(),
                request: r.clone()
            }), i
        }
    }
    async fetchAndCachePut(e) {
        const t = await this.fetch(e),
            s = t.clone();
        return this.waitUntil(this.cachePut(e, s)), t
    }
    async cacheMatch(e) {
        const t = R(e);
        let s;
        const {
            cacheName: a,
            matchOptions: r
        } = this._strategy, i = await this.getCacheKey(t, "read"), c = Object.assign(Object.assign({}, r), {
            cacheName: a
        });
        s = await caches.match(i, c);
        for (const o of this.iterateCallbacks("cachedResponseWillBeUsed")) s = await o({
            cacheName: a,
            matchOptions: r,
            cachedResponse: s,
            request: i,
            event: this.event
        }) || void 0;
        return s
    }
    async cachePut(e, t) {
        const s = R(e);
        await F(0);
        const a = await this.getCacheKey(s, "write");
        if (!t) throw new l("cache-put-with-no-response", {
            url: W(a.url)
        });
        const r = await this._ensureResponseSafeToCache(t);
        if (!r) return !1;
        const {
            cacheName: i,
            matchOptions: c
        } = this._strategy, o = await self.caches.open(i), h = this.hasCallback("cacheDidUpdate"), g = h ? await q(o, a.clone(), ["__WB_REVISION__"], c) : null;
        try {
            await o.put(a, h ? r.clone() : r)
        } catch (u) {
            if (u instanceof Error) throw u.name === "QuotaExceededError" && await H(), u
        }
        for (const u of this.iterateCallbacks("cacheDidUpdate")) await u({
            cacheName: i,
            oldResponse: g,
            newResponse: r.clone(),
            request: a,
            event: this.event
        });
        return !0
    }
    async getCacheKey(e, t) {
        const s = `${e.url} | ${t}`;
        if (!this._cacheKeys[s]) {
            let a = e;
            for (const r of this.iterateCallbacks("cacheKeyWillBeUsed")) a = R(await r({
                mode: t,
                request: a,
                event: this.event,
                params: this.params
            }));
            this._cacheKeys[s] = a
        }
        return this._cacheKeys[s]
    }
    hasCallback(e) {
        for (const t of this._strategy.plugins)
            if (e in t) return !0;
        return !1
    }
    async runCallbacks(e, t) {
        for (const s of this.iterateCallbacks(e)) await s(t)
    }* iterateCallbacks(e) {
        for (const t of this._strategy.plugins)
            if (typeof t[e] == "function") {
                const s = this._pluginStateMap.get(t);
                yield r => {
                    const i = Object.assign(Object.assign({}, r), {
                        state: s
                    });
                    return t[e](i)
                }
            }
    }
    waitUntil(e) {
        return this._extendLifetimePromises.push(e), e
    }
    async doneWaiting() {
        let e;
        for (; e = this._extendLifetimePromises.shift();) await e
    }
    destroy() {
        this._handlerDeferred.resolve(null)
    }
    async _ensureResponseSafeToCache(e) {
        let t = e,
            s = !1;
        for (const a of this.iterateCallbacks("cacheWillUpdate"))
            if (t = await a({
                    request: this.request,
                    response: t,
                    event: this.event
                }) || void 0, s = !0, !t) break;
        return s || t && t.status !== 200 && (t = void 0), t
    }
}
class V {
    constructor(e = {}) {
        this.cacheName = U.getRuntimeName(e.cacheName), this.plugins = e.plugins || [], this.fetchOptions = e.fetchOptions, this.matchOptions = e.matchOptions
    }
    handle(e) {
        const [t] = this.handleAll(e);
        return t
    }
    handleAll(e) {
        e instanceof FetchEvent && (e = {
            event: e,
            request: e.request
        });
        const t = e.event,
            s = typeof e.request == "string" ? new Request(e.request) : e.request,
            a = "params" in e ? e.params : void 0,
            r = new B(this, {
                event: t,
                request: s,
                params: a
            }),
            i = this._getResponse(r, s, t),
            c = this._awaitComplete(i, r, s, t);
        return [i, c]
    }
    async _getResponse(e, t, s) {
        await e.runCallbacks("handlerWillStart", {
            event: s,
            request: t
        });
        let a;
        try {
            if (a = await this._handle(t, e), !a || a.type === "error") throw new l("no-response", {
                url: t.url
            })
        } catch (r) {
            if (r instanceof Error) {
                for (const i of e.iterateCallbacks("handlerDidError"))
                    if (a = await i({
                            error: r,
                            event: s,
                            request: t
                        }), a) break
            }
            if (!a) throw r
        }
        for (const r of e.iterateCallbacks("handlerWillRespond")) a = await r({
            event: s,
            request: t,
            response: a
        });
        return a
    }
    async _awaitComplete(e, t, s, a) {
        let r, i;
        try {
            r = await e
        } catch {}
        try {
            await t.runCallbacks("handlerDidRespond", {
                event: a,
                request: s,
                response: r
            }), await t.doneWaiting()
        } catch (c) {
            c instanceof Error && (i = c)
        }
        if (await t.runCallbacks("handlerDidComplete", {
                event: a,
                request: s,
                response: r,
                error: i
            }), t.destroy(), i) throw i
    }
}
class d extends V {
    constructor(e = {}) {
        e.cacheName = U.getPrecacheName(e.cacheName), super(e), this._fallbackToNetwork = e.fallbackToNetwork !== !1, this.plugins.push(d.copyRedirectedCacheableResponsesPlugin)
    }
    async _handle(e, t) {
        const s = await t.cacheMatch(e);
        return s || (t.event && t.event.type === "install" ? await this._handleInstall(e, t) : await this._handleFetch(e, t))
    }
    async _handleFetch(e, t) {
        let s;
        const a = t.params || {};
        if (this._fallbackToNetwork) {
            const r = a.integrity,
                i = e.integrity,
                c = !i || i === r;
            s = await t.fetch(new Request(e, {
                integrity: i || r
            })), r && c && (this._useDefaultCacheabilityPluginIfNeeded(), await t.cachePut(e, s.clone()))
        } else throw new l("missing-precache-entry", {
            cacheName: this.cacheName,
            url: e.url
        });
        return s
    }
    async _handleInstall(e, t) {
        this._useDefaultCacheabilityPluginIfNeeded();
        const s = await t.fetch(e);
        if (!await t.cachePut(e, s.clone())) throw new l("bad-precaching-response", {
            url: e.url,
            status: s.status
        });
        return s
    }
    _useDefaultCacheabilityPluginIfNeeded() {
        let e = null,
            t = 0;
        for (const [s, a] of this.plugins.entries()) a !== d.copyRedirectedCacheableResponsesPlugin && (a === d.defaultPrecacheCacheabilityPlugin && (e = s), a.cacheWillUpdate && t++);
        t === 0 ? this.plugins.push(d.defaultPrecacheCacheabilityPlugin) : t > 1 && e !== null && this.plugins.splice(e, 1)
    }
}
d.defaultPrecacheCacheabilityPlugin = {
    async cacheWillUpdate({
        response: n
    }) {
        return !n || n.status >= 400 ? null : n
    }
};
d.copyRedirectedCacheableResponsesPlugin = {
    async cacheWillUpdate({
        response: n
    }) {
        return n.redirected ? await S(n) : n
    }
};
class $ {
    constructor({
        cacheName: e,
        plugins: t = [],
        fallbackToNetwork: s = !0
    } = {}) {
        this._urlsToCacheKeys = new Map, this._urlsToCacheModes = new Map, this._cacheKeysToIntegrities = new Map, this._strategy = new d({
            cacheName: U.getPrecacheName(e),
            plugins: [...t, new I({
                precacheController: this
            })],
            fallbackToNetwork: s
        }), this.install = this.install.bind(this), this.activate = this.activate.bind(this)
    }
    get strategy() {
        return this._strategy
    }
    precache(e) {
        this.addToCacheList(e), this._installAndActiveListenersAdded || (self.addEventListener("install", this.install), self.addEventListener("activate", this.activate), this._installAndActiveListenersAdded = !0)
    }
    addToCacheList(e) {
        const t = [];
        for (const s of e) {
            typeof s == "string" ? t.push(s) : s && s.revision === void 0 && t.push(s.url);
            const {
                cacheKey: a,
                url: r
            } = E(s), i = typeof s != "string" && s.revision ? "reload" : "default";
            if (this._urlsToCacheKeys.has(r) && this._urlsToCacheKeys.get(r) !== a) throw new l("add-to-cache-list-conflicting-entries", {
                firstEntry: this._urlsToCacheKeys.get(r),
                secondEntry: a
            });
            if (typeof s != "string" && s.integrity) {
                if (this._cacheKeysToIntegrities.has(a) && this._cacheKeysToIntegrities.get(a) !== s.integrity) throw new l("add-to-cache-list-conflicting-integrities", {
                    url: r
                });
                this._cacheKeysToIntegrities.set(a, s.integrity)
            }
            if (this._urlsToCacheKeys.set(r, a), this._urlsToCacheModes.set(r, i), t.length > 0) {
                const c = `Workbox is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
                console.warn(c)
            }
        }
    }
    install(e) {
        return L(e, async () => {
            const t = new M;
            this.strategy.plugins.push(t);
            for (const [r, i] of this._urlsToCacheKeys) {
                const c = this._cacheKeysToIntegrities.get(i),
                    o = this._urlsToCacheModes.get(r),
                    h = new Request(r, {
                        integrity: c,
                        cache: o,
                        credentials: "same-origin"
                    });
                await Promise.all(this.strategy.handleAll({
                    params: {
                        cacheKey: i
                    },
                    request: h,
                    event: e
                }))
            }
            const {
                updatedURLs: s,
                notUpdatedURLs: a
            } = t;
            return {
                updatedURLs: s,
                notUpdatedURLs: a
            }
        })
    }
    activate(e) {
        return L(e, async () => {
            const t = await self.caches.open(this.strategy.cacheName),
                s = await t.keys(),
                a = new Set(this._urlsToCacheKeys.values()),
                r = [];
            for (const i of s) a.has(i.url) || (await t.delete(i), r.push(i.url));
            return {
                deletedURLs: r
            }
        })
    }
    getURLsToCacheKeys() {
        return this._urlsToCacheKeys
    }
    getCachedURLs() {
        return [...this._urlsToCacheKeys.keys()]
    }
    getCacheKeyForURL(e) {
        const t = new URL(e, location.href);
        return this._urlsToCacheKeys.get(t.href)
    }
    getIntegrityForCacheKey(e) {
        return this._cacheKeysToIntegrities.get(e)
    }
    async matchPrecache(e) {
        const t = e instanceof Request ? e.url : e,
            s = this.getCacheKeyForURL(t);
        if (s) return (await self.caches.open(this.strategy.cacheName)).match(s)
    }
    createHandlerBoundToURL(e) {
        const t = this.getCacheKeyForURL(e);
        if (!t) throw new l("non-precached-url", {
            url: e
        });
        return s => (s.request = new Request(e), s.params = Object.assign({
            cacheKey: t
        }, s.params), this.strategy.handle(s))
    }
}
let b;
const K = () => (b || (b = new $), b);
try {
    self["workbox:routing:6.5.1"] && _()
} catch {}
const T = "GET",
    m = n => n && typeof n == "object" ? n : {
        handle: n
    };
class w {
    constructor(e, t, s = T) {
        this.handler = m(t), this.match = e, this.method = s
    }
    setCatchHandler(e) {
        this.catchHandler = m(e)
    }
}
class G extends w {
    constructor(e, t, s) {
        const a = ({
            url: r
        }) => {
            const i = e.exec(r.href);
            if (!!i && !(r.origin !== location.origin && i.index !== 0)) return i.slice(1)
        };
        super(a, t, s)
    }
}
class J {
    constructor() {
        this._routes = new Map, this._defaultHandlerMap = new Map
    }
    get routes() {
        return this._routes
    }
    addFetchListener() {
        self.addEventListener("fetch", e => {
            const {
                request: t
            } = e, s = this.handleRequest({
                request: t,
                event: e
            });
            s && e.respondWith(s)
        })
    }
    addCacheListener() {
        self.addEventListener("message", e => {
            if (e.data && e.data.type === "CACHE_URLS") {
                const {
                    payload: t
                } = e.data, s = Promise.all(t.urlsToCache.map(a => {
                    typeof a == "string" && (a = [a]);
                    const r = new Request(...a);
                    return this.handleRequest({
                        request: r,
                        event: e
                    })
                }));
                e.waitUntil(s), e.ports && e.ports[0] && s.then(() => e.ports[0].postMessage(!0))
            }
        })
    }
    handleRequest({
        request: e,
        event: t
    }) {
        const s = new URL(e.url, location.href);
        if (!s.protocol.startsWith("http")) return;
        const a = s.origin === location.origin,
            {
                params: r,
                route: i
            } = this.findMatchingRoute({
                event: t,
                request: e,
                sameOrigin: a,
                url: s
            });
        let c = i && i.handler;
        const o = e.method;
        if (!c && this._defaultHandlerMap.has(o) && (c = this._defaultHandlerMap.get(o)), !c) return;
        let h;
        try {
            h = c.handle({
                url: s,
                request: e,
                event: t,
                params: r
            })
        } catch (u) {
            h = Promise.reject(u)
        }
        const g = i && i.catchHandler;
        return h instanceof Promise && (this._catchHandler || g) && (h = h.catch(async u => {
            if (g) try {
                return await g.handle({
                    url: s,
                    request: e,
                    event: t,
                    params: r
                })
            } catch (k) {
                k instanceof Error && (u = k)
            }
            if (this._catchHandler) return this._catchHandler.handle({
                url: s,
                request: e,
                event: t
            });
            throw u
        })), h
    }
    findMatchingRoute({
        url: e,
        sameOrigin: t,
        request: s,
        event: a
    }) {
        const r = this._routes.get(s.method) || [];
        for (const i of r) {
            let c;
            const o = i.match({
                url: e,
                sameOrigin: t,
                request: s,
                event: a
            });
            if (o) return c = o, (Array.isArray(c) && c.length === 0 || o.constructor === Object && Object.keys(o).length === 0 || typeof o == "boolean") && (c = void 0), {
                route: i,
                params: c
            }
        }
        return {}
    }
    setDefaultHandler(e, t = T) {
        this._defaultHandlerMap.set(t, m(e))
    }
    setCatchHandler(e) {
        this._catchHandler = m(e)
    }
    registerRoute(e) {
        this._routes.has(e.method) || this._routes.set(e.method, []), this._routes.get(e.method).push(e)
    }
    unregisterRoute(e) {
        if (!this._routes.has(e.method)) throw new l("unregister-route-but-not-found-with-method", {
            method: e.method
        });
        const t = this._routes.get(e.method).indexOf(e);
        if (t > -1) this._routes.get(e.method).splice(t, 1);
        else throw new l("unregister-route-route-not-registered")
    }
}
let y;
const Q = () => (y || (y = new J, y.addFetchListener(), y.addCacheListener()), y);

function z(n, e, t) {
    let s;
    if (typeof n == "string") {
        const r = new URL(n, location.href),
            i = ({
                url: c
            }) => c.href === r.href;
        s = new w(i, e, t)
    } else if (n instanceof RegExp) s = new G(n, e, t);
    else if (typeof n == "function") s = new w(n, e, t);
    else if (n instanceof w) s = n;
    else throw new l("unsupported-route-type", {
        moduleName: "workbox-routing",
        funcName: "registerRoute",
        paramName: "capture"
    });
    return Q().registerRoute(s), s
}

function X(n, e = []) {
    for (const t of [...n.searchParams.keys()]) e.some(s => s.test(t)) && n.searchParams.delete(t);
    return n
}

function* Y(n, {
    ignoreURLParametersMatching: e = [/^utm_/, /^fbclid$/],
    directoryIndex: t = "index.html",
    cleanURLs: s = !0,
    urlManipulation: a
} = {}) {
    const r = new URL(n, location.href);
    r.hash = "", yield r.href;
    const i = X(r, e);
    if (yield i.href, t && i.pathname.endsWith("/")) {
        const c = new URL(i.href);
        c.pathname += t, yield c.href
    }
    if (s) {
        const c = new URL(i.href);
        c.pathname += ".html", yield c.href
    }
    if (a) {
        const c = a({
            url: r
        });
        for (const o of c) yield o.href
    }
}
class Z extends w {
    constructor(e, t) {
        const s = ({
            request: a
        }) => {
            const r = e.getURLsToCacheKeys();
            for (const i of Y(a.url, t)) {
                const c = r.get(i);
                if (c) {
                    const o = e.getIntegrityForCacheKey(c);
                    return {
                        cacheKey: c,
                        integrity: o
                    }
                }
            }
        };
        super(s, e.strategy)
    }
}

function ee(n) {
    const e = K(),
        t = new Z(e, n);
    z(t)
}

function te(n) {
    K().precache(n)
}

function se(n, e) {
    te(n), ee(e)
}
se([{
    "revision": null,
    "url": "assets/AboutView.224a81ad.js"
}, {
    "revision": null,
    "url": "assets/AboutView.ab071ea6.css"
}, {
    "revision": null,
    "url": "assets/index.038ca730.css"
}, {
    "revision": null,
    "url": "assets/index.d17090e7.js"
}, {
    "revision": "e694904b78b778de7fd0a01101545d67",
    "url": "index.html"
}, {
    "revision": "1dce78f6761d59b2b19d1b32c48b76dc",
    "url": "manifest.webmanifest"
}]);
"serviceWorker" in navigator && (console.log("service worker is here"), ne().catch(n => console.error(n)));
async function ne() {
    console.log(`Registering service worker
`);
    const n = await navigator.serviceWorker.register("./worker.js", {
        scpoe: "/"
    });
    console.log(`Completed registering service worker.
`), console.log(`Registering Push Notification Subscription.
`);
    const e = await n.pushManager.subscribe({
        userVisibleOnly: !0,
        applicationServerKey: ae(publicVapidKey)
    });
    console.log(`Completed registering push.
`), console.log("Sending Push Notifications Subscription"), await fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify(e),
        headers: {
            "content-type": "application/json"
        }
    }), console.log(`Completed sending push notification.
`)
}

function ae(n) {
    const e = "=".repeat((4 - n.length % 4) % 4),
        t = (n + e).replace(/-/g, "+").replace(/_/g, "/"),
        s = window.atob(t),
        a = new Uint8Array(s.length);
    for (let r = 0; r < s.length; ++r) a[r] = s.charCodeAt(r);
    return a
}
