var at = Object.defineProperty;
var ht = (s, x, o) => x in s ? at(s, x, { enumerable: !0, configurable: !0, writable: !0, value: o }) : s[x] = o;
var Bf = (s, x, o) => (ht(s, typeof x != "symbol" ? x + "" : x, o), o);
import { SUI_TYPE_ARG as ct, Coin as E0, JsonRpcProvider as ut, Connection as lt, getSuiObjectData as bt, getMoveObject as G0, toSingleSignaturePubkeyPair as dt, messageWithIntent as yt, IntentScope as vt, fromB64 as gt } from "@mysten/sui.js";
class wt {
  constructor(x, o) {
    Bf(this, "provider");
    Bf(this, "address");
    this.provider = x, this.address = o;
  }
  async get(x = ct) {
    return (await this.getAllCoins()).find((_) => _.typeArg === x)?.balance || BigInt(0);
  }
  async getAllCoins() {
    const x = await this.provider.query.getOwnedCoins(this.address), o = /* @__PURE__ */ new Map();
    for (const y of x)
      o.has(y.typeArg) ? o.set(y.typeArg, o.get(y.typeArg) + y.balance) : o.set(y.typeArg, y.balance);
    return Array.from(o.entries()).map((y) => ({
      typeArg: y[0],
      balance: y[1]
    }));
  }
}
class ar {
  constructor(x, o) {
    Bf(this, "balance");
    this.balance = new wt(x, o);
  }
}
const X0 = "0x2::coin::Coin";
class U0 {
  constructor(x, o, y) {
    Bf(this, "_objectId");
    Bf(this, "_typeArg");
    Bf(this, "_balance");
    Bf(this, "_symbol");
    this._objectId = x, this._balance = y, this._typeArg = o, this._symbol = $f.getCoinSymbol(o);
  }
  get objectId() {
    return this._objectId;
  }
  get typeArg() {
    return this._typeArg;
  }
  get balance() {
    return this._balance;
  }
  get symbol() {
    return this._symbol;
  }
  static fromDto(x) {
    return new U0(x.objectId, x.typeArg, x.balance);
  }
  toDto() {
    return {
      objectId: this._objectId,
      balance: this._balance,
      typeArg: this._typeArg,
      symbol: this._symbol
    };
  }
  toString() {
    return JSON.stringify(this.toDto());
  }
}
class $f {
  static isCoin(x) {
    return x.type.startsWith(X0);
  }
  static isSUI(x) {
    const o = $f.getCoinTypeArg(x);
    return o ? $f.getCoinSymbol(o) === "SUI" : !1;
  }
  static getCoinObject(x) {
    const o = E0.getCoinTypeArg(x);
    if (!o)
      throw new Error("coin typeArg cannot be null");
    return new U0(
      x.fields.id.id,
      o,
      BigInt(x.fields.balance)
    );
  }
  static getBalance(x) {
    return BigInt(x.fields.balance);
  }
  static getCoinTypeArg(x) {
    return E0.getCoinTypeArg(x);
  }
  static getCoinSymbol(x) {
    return x.substring(x.lastIndexOf(":") + 1);
  }
  static getCoinTypeFromArg(x) {
    return `${X0}<${x}>`;
  }
}
class Z0 {
  static isNft(x) {
    return !!(x.fields.name && x.fields.description && x.fields.url);
  }
  static getNftObject(x, o) {
    return {
      objectId: x.fields.id.id,
      name: x.fields.name,
      description: x.fields.description,
      url: x.fields.url,
      previousTransaction: o,
      objectType: x.type
    };
  }
}
const hr = "0x0000000000000000000000000000000000000005";
class cr {
  constructor(x) {
    Bf(this, "query");
    this.query = new _t(x);
  }
}
class _t {
  constructor(x) {
    Bf(this, "provider");
    this.provider = new ut(new lt({ fullnode: x }));
  }
  async getOwnedObjects(x) {
    let o = !0, y = null, _ = [];
    for (; o; ) {
      const Z = await this.provider.getOwnedObjects({
        owner: x,
        cursor: y,
        options: {
          showType: !0,
          showDisplay: !0,
          showContent: !0,
          showOwner: !0
        }
      });
      Z.data?.forEach((K) => {
        const ff = bt(K);
        ff && _.push(ff);
      }), o = Z.hasNextPage, y = Z.nextCursor;
    }
    return _;
  }
  async getOwnedCoins(x) {
    return (await this.getOwnedObjects(x)).map((_) => ({
      id: _.objectId,
      object: G0(_)
    })).filter((_) => _.object && E0.isCoin(_.object)).map((_) => $f.getCoinObject(_.object));
  }
  async getOwnedNfts(x) {
    return (await this.getOwnedObjects(x)).map((_) => ({
      id: _.objectId,
      object: G0(_),
      previousTransaction: _.previousTransaction
    })).filter((_) => _.object && Z0.isNft(_.object)).map((_) => {
      const Z = _.object;
      return Z0.getNftObject(Z, _.previousTransaction);
    });
  }
}
const q0 = 1e6, w0 = 1e9, _0 = 1e12;
function ur(s, x) {
  return W0(
    s,
    Object.assign(
      {
        decimals: 9
      },
      x
    )
  );
}
function W0(s, x) {
  const { decimals: o = 0, withAbbr: y = !0 } = x ?? {};
  if (typeof s == "bigint" && !At(s))
    return J0(BigInt(s), {
      decimals: o,
      withAbbr: y
    });
  if (Number(s) === 0)
    return "0";
  if (Number(s) < 0)
    return "-" + W0(-Number(s), x);
  const _ = Number(s) / 10 ** o;
  return _ > 0 && _ < 1 ? pt(_) : V0(_, y);
}
function V0(s, x) {
  if (x) {
    if (s >= q0 && s < w0)
      return p0(s, q0, "M");
    if (s >= w0 && s < _0)
      return p0(s, w0, "B");
    if (s >= _0)
      return p0(s, _0, "T");
  }
  return Intl.NumberFormat("en-US").format(s);
}
function p0(s, x, o) {
  let y;
  typeof s == "bigint" ? y = String(s / (BigInt(x) / 1000n)) : y = String(Math.floor(s / (x / 1e3)));
  const _ = y.padEnd(4, "0");
  return Intl.NumberFormat("en-US").format(Number(_)).replace(",", ".") + o;
}
function pt(s) {
  if (s <= 0)
    return "0";
  const x = Math.ceil(-Math.log10(s));
  return Number(s) % Math.pow(10, 10 - (x + 2)) === 0 && Number(s) % Math.pow(10, 10 - (x + 1)) === 0 ? A0(s, x) : Number(s) % Math.pow(10, 10 - (x + 2)) === 0 && Number(s) % Math.pow(10, 10 - (x + 1)) !== 0 ? A0(s, x + 1) : A0(s, x + 2);
}
function A0(s, x) {
  function o(y) {
    if (isNaN(y))
      return y.toString();
    const _ = "" + y;
    return /e/i.test(_) ? y.toFixed(18).replace(/\.?0+$/, "") : y.toString();
  }
  return x = x || 0, x = Math.pow(10, x), o(Math.floor(s * x) / x);
}
function J0(s, x) {
  if (s === 0n)
    return "0";
  if (s < 0n)
    return "-" + J0(-s, x);
  const { decimals: o = 9, withAbbr: y = !0 } = x ?? {}, _ = s / 10n ** BigInt(o);
  return V0(_, y);
}
function At(s) {
  const x = Number.MIN_SAFE_INTEGER, o = Number.MAX_SAFE_INTEGER;
  return s >= BigInt(x) && s <= BigInt(o);
}
function lr(s) {
  if (typeof s != "string")
    throw new Error("address is not a string");
  return !s || !s.startsWith("0x") ? s : s.slice(0, 7) + "...." + s.slice(-4, s.length);
}
function Et(s) {
  var x = s.default;
  if (typeof x == "function") {
    var o = function() {
      return x.apply(this, arguments);
    };
    o.prototype = x.prototype;
  } else
    o = {};
  return Object.defineProperty(o, "__esModule", { value: !0 }), Object.keys(s).forEach(function(y) {
    var _ = Object.getOwnPropertyDescriptor(s, y);
    Object.defineProperty(o, y, _.get ? _ : {
      enumerable: !0,
      get: function() {
        return s[y];
      }
    });
  }), o;
}
function Bt(s) {
  throw new Error('Could not dynamically require "' + s + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Q0 = { exports: {} };
const St = {}, Ut = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: St
}, Symbol.toStringTag, { value: "Module" })), jt = /* @__PURE__ */ Et(Ut);
(function(s) {
  (function(x) {
    var o = function(t) {
      var e, r = new Float64Array(16);
      if (t)
        for (e = 0; e < t.length; e++)
          r[e] = t[e];
      return r;
    }, y = function() {
      throw new Error("no PRNG");
    }, _ = new Uint8Array(16), Z = new Uint8Array(32);
    Z[0] = 9;
    var N = o(), K = o([1]), ff = o([56129, 1]), hf = o([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), tf = o([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), ef = o([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), lf = o([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), vf = o([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
    function nf(t, e, r, f) {
      t[e] = r >> 24 & 255, t[e + 1] = r >> 16 & 255, t[e + 2] = r >> 8 & 255, t[e + 3] = r & 255, t[e + 4] = f >> 24 & 255, t[e + 5] = f >> 16 & 255, t[e + 6] = f >> 8 & 255, t[e + 7] = f & 255;
    }
    function rf(t, e, r, f, n) {
      var a, h = 0;
      for (a = 0; a < n; a++)
        h |= t[e + a] ^ r[f + a];
      return (1 & h - 1 >>> 8) - 1;
    }
    function _f(t, e, r, f) {
      return rf(t, e, r, f, 16);
    }
    function r0(t, e, r, f) {
      return rf(t, e, r, f, 32);
    }
    function ft(t, e, r, f) {
      for (var n = f[0] & 255 | (f[1] & 255) << 8 | (f[2] & 255) << 16 | (f[3] & 255) << 24, a = r[0] & 255 | (r[1] & 255) << 8 | (r[2] & 255) << 16 | (r[3] & 255) << 24, h = r[4] & 255 | (r[5] & 255) << 8 | (r[6] & 255) << 16 | (r[7] & 255) << 24, b = r[8] & 255 | (r[9] & 255) << 8 | (r[10] & 255) << 16 | (r[11] & 255) << 24, w = r[12] & 255 | (r[13] & 255) << 8 | (r[14] & 255) << 16 | (r[15] & 255) << 24, L = f[4] & 255 | (f[5] & 255) << 8 | (f[6] & 255) << 16 | (f[7] & 255) << 24, E = e[0] & 255 | (e[1] & 255) << 8 | (e[2] & 255) << 16 | (e[3] & 255) << 24, J = e[4] & 255 | (e[5] & 255) << 8 | (e[6] & 255) << 16 | (e[7] & 255) << 24, S = e[8] & 255 | (e[9] & 255) << 8 | (e[10] & 255) << 16 | (e[11] & 255) << 24, O = e[12] & 255 | (e[13] & 255) << 8 | (e[14] & 255) << 16 | (e[15] & 255) << 24, C = f[8] & 255 | (f[9] & 255) << 8 | (f[10] & 255) << 16 | (f[11] & 255) << 24, z = r[16] & 255 | (r[17] & 255) << 8 | (r[18] & 255) << 16 | (r[19] & 255) << 24, D = r[20] & 255 | (r[21] & 255) << 8 | (r[22] & 255) << 16 | (r[23] & 255) << 24, Y = r[24] & 255 | (r[25] & 255) << 8 | (r[26] & 255) << 16 | (r[27] & 255) << 24, P = r[28] & 255 | (r[29] & 255) << 8 | (r[30] & 255) << 16 | (r[31] & 255) << 24, R = f[12] & 255 | (f[13] & 255) << 8 | (f[14] & 255) << 16 | (f[15] & 255) << 24, U = n, M = a, B = h, j = b, T = w, p = L, c = E, u = J, v = S, l = O, d = C, g = z, I = D, H = Y, $ = P, F = R, i, X = 0; X < 20; X += 2)
        i = U + I | 0, T ^= i << 7 | i >>> 32 - 7, i = T + U | 0, v ^= i << 9 | i >>> 32 - 9, i = v + T | 0, I ^= i << 13 | i >>> 32 - 13, i = I + v | 0, U ^= i << 18 | i >>> 32 - 18, i = p + M | 0, l ^= i << 7 | i >>> 32 - 7, i = l + p | 0, H ^= i << 9 | i >>> 32 - 9, i = H + l | 0, M ^= i << 13 | i >>> 32 - 13, i = M + H | 0, p ^= i << 18 | i >>> 32 - 18, i = d + c | 0, $ ^= i << 7 | i >>> 32 - 7, i = $ + d | 0, B ^= i << 9 | i >>> 32 - 9, i = B + $ | 0, c ^= i << 13 | i >>> 32 - 13, i = c + B | 0, d ^= i << 18 | i >>> 32 - 18, i = F + g | 0, j ^= i << 7 | i >>> 32 - 7, i = j + F | 0, u ^= i << 9 | i >>> 32 - 9, i = u + j | 0, g ^= i << 13 | i >>> 32 - 13, i = g + u | 0, F ^= i << 18 | i >>> 32 - 18, i = U + j | 0, M ^= i << 7 | i >>> 32 - 7, i = M + U | 0, B ^= i << 9 | i >>> 32 - 9, i = B + M | 0, j ^= i << 13 | i >>> 32 - 13, i = j + B | 0, U ^= i << 18 | i >>> 32 - 18, i = p + T | 0, c ^= i << 7 | i >>> 32 - 7, i = c + p | 0, u ^= i << 9 | i >>> 32 - 9, i = u + c | 0, T ^= i << 13 | i >>> 32 - 13, i = T + u | 0, p ^= i << 18 | i >>> 32 - 18, i = d + l | 0, g ^= i << 7 | i >>> 32 - 7, i = g + d | 0, v ^= i << 9 | i >>> 32 - 9, i = v + g | 0, l ^= i << 13 | i >>> 32 - 13, i = l + v | 0, d ^= i << 18 | i >>> 32 - 18, i = F + $ | 0, I ^= i << 7 | i >>> 32 - 7, i = I + F | 0, H ^= i << 9 | i >>> 32 - 9, i = H + I | 0, $ ^= i << 13 | i >>> 32 - 13, i = $ + H | 0, F ^= i << 18 | i >>> 32 - 18;
      U = U + n | 0, M = M + a | 0, B = B + h | 0, j = j + b | 0, T = T + w | 0, p = p + L | 0, c = c + E | 0, u = u + J | 0, v = v + S | 0, l = l + O | 0, d = d + C | 0, g = g + z | 0, I = I + D | 0, H = H + Y | 0, $ = $ + P | 0, F = F + R | 0, t[0] = U >>> 0 & 255, t[1] = U >>> 8 & 255, t[2] = U >>> 16 & 255, t[3] = U >>> 24 & 255, t[4] = M >>> 0 & 255, t[5] = M >>> 8 & 255, t[6] = M >>> 16 & 255, t[7] = M >>> 24 & 255, t[8] = B >>> 0 & 255, t[9] = B >>> 8 & 255, t[10] = B >>> 16 & 255, t[11] = B >>> 24 & 255, t[12] = j >>> 0 & 255, t[13] = j >>> 8 & 255, t[14] = j >>> 16 & 255, t[15] = j >>> 24 & 255, t[16] = T >>> 0 & 255, t[17] = T >>> 8 & 255, t[18] = T >>> 16 & 255, t[19] = T >>> 24 & 255, t[20] = p >>> 0 & 255, t[21] = p >>> 8 & 255, t[22] = p >>> 16 & 255, t[23] = p >>> 24 & 255, t[24] = c >>> 0 & 255, t[25] = c >>> 8 & 255, t[26] = c >>> 16 & 255, t[27] = c >>> 24 & 255, t[28] = u >>> 0 & 255, t[29] = u >>> 8 & 255, t[30] = u >>> 16 & 255, t[31] = u >>> 24 & 255, t[32] = v >>> 0 & 255, t[33] = v >>> 8 & 255, t[34] = v >>> 16 & 255, t[35] = v >>> 24 & 255, t[36] = l >>> 0 & 255, t[37] = l >>> 8 & 255, t[38] = l >>> 16 & 255, t[39] = l >>> 24 & 255, t[40] = d >>> 0 & 255, t[41] = d >>> 8 & 255, t[42] = d >>> 16 & 255, t[43] = d >>> 24 & 255, t[44] = g >>> 0 & 255, t[45] = g >>> 8 & 255, t[46] = g >>> 16 & 255, t[47] = g >>> 24 & 255, t[48] = I >>> 0 & 255, t[49] = I >>> 8 & 255, t[50] = I >>> 16 & 255, t[51] = I >>> 24 & 255, t[52] = H >>> 0 & 255, t[53] = H >>> 8 & 255, t[54] = H >>> 16 & 255, t[55] = H >>> 24 & 255, t[56] = $ >>> 0 & 255, t[57] = $ >>> 8 & 255, t[58] = $ >>> 16 & 255, t[59] = $ >>> 24 & 255, t[60] = F >>> 0 & 255, t[61] = F >>> 8 & 255, t[62] = F >>> 16 & 255, t[63] = F >>> 24 & 255;
    }
    function tt(t, e, r, f) {
      for (var n = f[0] & 255 | (f[1] & 255) << 8 | (f[2] & 255) << 16 | (f[3] & 255) << 24, a = r[0] & 255 | (r[1] & 255) << 8 | (r[2] & 255) << 16 | (r[3] & 255) << 24, h = r[4] & 255 | (r[5] & 255) << 8 | (r[6] & 255) << 16 | (r[7] & 255) << 24, b = r[8] & 255 | (r[9] & 255) << 8 | (r[10] & 255) << 16 | (r[11] & 255) << 24, w = r[12] & 255 | (r[13] & 255) << 8 | (r[14] & 255) << 16 | (r[15] & 255) << 24, L = f[4] & 255 | (f[5] & 255) << 8 | (f[6] & 255) << 16 | (f[7] & 255) << 24, E = e[0] & 255 | (e[1] & 255) << 8 | (e[2] & 255) << 16 | (e[3] & 255) << 24, J = e[4] & 255 | (e[5] & 255) << 8 | (e[6] & 255) << 16 | (e[7] & 255) << 24, S = e[8] & 255 | (e[9] & 255) << 8 | (e[10] & 255) << 16 | (e[11] & 255) << 24, O = e[12] & 255 | (e[13] & 255) << 8 | (e[14] & 255) << 16 | (e[15] & 255) << 24, C = f[8] & 255 | (f[9] & 255) << 8 | (f[10] & 255) << 16 | (f[11] & 255) << 24, z = r[16] & 255 | (r[17] & 255) << 8 | (r[18] & 255) << 16 | (r[19] & 255) << 24, D = r[20] & 255 | (r[21] & 255) << 8 | (r[22] & 255) << 16 | (r[23] & 255) << 24, Y = r[24] & 255 | (r[25] & 255) << 8 | (r[26] & 255) << 16 | (r[27] & 255) << 24, P = r[28] & 255 | (r[29] & 255) << 8 | (r[30] & 255) << 16 | (r[31] & 255) << 24, R = f[12] & 255 | (f[13] & 255) << 8 | (f[14] & 255) << 16 | (f[15] & 255) << 24, U = n, M = a, B = h, j = b, T = w, p = L, c = E, u = J, v = S, l = O, d = C, g = z, I = D, H = Y, $ = P, F = R, i, X = 0; X < 20; X += 2)
        i = U + I | 0, T ^= i << 7 | i >>> 32 - 7, i = T + U | 0, v ^= i << 9 | i >>> 32 - 9, i = v + T | 0, I ^= i << 13 | i >>> 32 - 13, i = I + v | 0, U ^= i << 18 | i >>> 32 - 18, i = p + M | 0, l ^= i << 7 | i >>> 32 - 7, i = l + p | 0, H ^= i << 9 | i >>> 32 - 9, i = H + l | 0, M ^= i << 13 | i >>> 32 - 13, i = M + H | 0, p ^= i << 18 | i >>> 32 - 18, i = d + c | 0, $ ^= i << 7 | i >>> 32 - 7, i = $ + d | 0, B ^= i << 9 | i >>> 32 - 9, i = B + $ | 0, c ^= i << 13 | i >>> 32 - 13, i = c + B | 0, d ^= i << 18 | i >>> 32 - 18, i = F + g | 0, j ^= i << 7 | i >>> 32 - 7, i = j + F | 0, u ^= i << 9 | i >>> 32 - 9, i = u + j | 0, g ^= i << 13 | i >>> 32 - 13, i = g + u | 0, F ^= i << 18 | i >>> 32 - 18, i = U + j | 0, M ^= i << 7 | i >>> 32 - 7, i = M + U | 0, B ^= i << 9 | i >>> 32 - 9, i = B + M | 0, j ^= i << 13 | i >>> 32 - 13, i = j + B | 0, U ^= i << 18 | i >>> 32 - 18, i = p + T | 0, c ^= i << 7 | i >>> 32 - 7, i = c + p | 0, u ^= i << 9 | i >>> 32 - 9, i = u + c | 0, T ^= i << 13 | i >>> 32 - 13, i = T + u | 0, p ^= i << 18 | i >>> 32 - 18, i = d + l | 0, g ^= i << 7 | i >>> 32 - 7, i = g + d | 0, v ^= i << 9 | i >>> 32 - 9, i = v + g | 0, l ^= i << 13 | i >>> 32 - 13, i = l + v | 0, d ^= i << 18 | i >>> 32 - 18, i = F + $ | 0, I ^= i << 7 | i >>> 32 - 7, i = I + F | 0, H ^= i << 9 | i >>> 32 - 9, i = H + I | 0, $ ^= i << 13 | i >>> 32 - 13, i = $ + H | 0, F ^= i << 18 | i >>> 32 - 18;
      t[0] = U >>> 0 & 255, t[1] = U >>> 8 & 255, t[2] = U >>> 16 & 255, t[3] = U >>> 24 & 255, t[4] = p >>> 0 & 255, t[5] = p >>> 8 & 255, t[6] = p >>> 16 & 255, t[7] = p >>> 24 & 255, t[8] = d >>> 0 & 255, t[9] = d >>> 8 & 255, t[10] = d >>> 16 & 255, t[11] = d >>> 24 & 255, t[12] = F >>> 0 & 255, t[13] = F >>> 8 & 255, t[14] = F >>> 16 & 255, t[15] = F >>> 24 & 255, t[16] = c >>> 0 & 255, t[17] = c >>> 8 & 255, t[18] = c >>> 16 & 255, t[19] = c >>> 24 & 255, t[20] = u >>> 0 & 255, t[21] = u >>> 8 & 255, t[22] = u >>> 16 & 255, t[23] = u >>> 24 & 255, t[24] = v >>> 0 & 255, t[25] = v >>> 8 & 255, t[26] = v >>> 16 & 255, t[27] = v >>> 24 & 255, t[28] = l >>> 0 & 255, t[29] = l >>> 8 & 255, t[30] = l >>> 16 & 255, t[31] = l >>> 24 & 255;
    }
    function Kf(t, e, r, f) {
      ft(t, e, r, f);
    }
    function Gf(t, e, r, f) {
      tt(t, e, r, f);
    }
    var Lf = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
    function j0(t, e, r, f, n, a, h) {
      var b = new Uint8Array(16), w = new Uint8Array(64), L, E;
      for (E = 0; E < 16; E++)
        b[E] = 0;
      for (E = 0; E < 8; E++)
        b[E] = a[E];
      for (; n >= 64; ) {
        for (Kf(w, b, h, Lf), E = 0; E < 64; E++)
          t[e + E] = r[f + E] ^ w[E];
        for (L = 1, E = 8; E < 16; E++)
          L = L + (b[E] & 255) | 0, b[E] = L & 255, L >>>= 8;
        n -= 64, e += 64, f += 64;
      }
      if (n > 0)
        for (Kf(w, b, h, Lf), E = 0; E < n; E++)
          t[e + E] = r[f + E] ^ w[E];
      return 0;
    }
    function T0(t, e, r, f, n) {
      var a = new Uint8Array(16), h = new Uint8Array(64), b, w;
      for (w = 0; w < 16; w++)
        a[w] = 0;
      for (w = 0; w < 8; w++)
        a[w] = f[w];
      for (; r >= 64; ) {
        for (Kf(h, a, n, Lf), w = 0; w < 64; w++)
          t[e + w] = h[w];
        for (b = 1, w = 8; w < 16; w++)
          b = b + (a[w] & 255) | 0, a[w] = b & 255, b >>>= 8;
        r -= 64, e += 64;
      }
      if (r > 0)
        for (Kf(h, a, n, Lf), w = 0; w < r; w++)
          t[e + w] = h[w];
      return 0;
    }
    function L0(t, e, r, f, n) {
      var a = new Uint8Array(32);
      Gf(a, f, n, Lf);
      for (var h = new Uint8Array(8), b = 0; b < 8; b++)
        h[b] = f[b + 16];
      return T0(t, e, r, h, a);
    }
    function e0(t, e, r, f, n, a, h) {
      var b = new Uint8Array(32);
      Gf(b, a, h, Lf);
      for (var w = new Uint8Array(8), L = 0; L < 8; L++)
        w[L] = a[L + 16];
      return j0(t, e, r, f, n, w, b);
    }
    var Xf = function(t) {
      this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.leftover = 0, this.fin = 0;
      var e, r, f, n, a, h, b, w;
      e = t[0] & 255 | (t[1] & 255) << 8, this.r[0] = e & 8191, r = t[2] & 255 | (t[3] & 255) << 8, this.r[1] = (e >>> 13 | r << 3) & 8191, f = t[4] & 255 | (t[5] & 255) << 8, this.r[2] = (r >>> 10 | f << 6) & 7939, n = t[6] & 255 | (t[7] & 255) << 8, this.r[3] = (f >>> 7 | n << 9) & 8191, a = t[8] & 255 | (t[9] & 255) << 8, this.r[4] = (n >>> 4 | a << 12) & 255, this.r[5] = a >>> 1 & 8190, h = t[10] & 255 | (t[11] & 255) << 8, this.r[6] = (a >>> 14 | h << 2) & 8191, b = t[12] & 255 | (t[13] & 255) << 8, this.r[7] = (h >>> 11 | b << 5) & 8065, w = t[14] & 255 | (t[15] & 255) << 8, this.r[8] = (b >>> 8 | w << 8) & 8191, this.r[9] = w >>> 5 & 127, this.pad[0] = t[16] & 255 | (t[17] & 255) << 8, this.pad[1] = t[18] & 255 | (t[19] & 255) << 8, this.pad[2] = t[20] & 255 | (t[21] & 255) << 8, this.pad[3] = t[22] & 255 | (t[23] & 255) << 8, this.pad[4] = t[24] & 255 | (t[25] & 255) << 8, this.pad[5] = t[26] & 255 | (t[27] & 255) << 8, this.pad[6] = t[28] & 255 | (t[29] & 255) << 8, this.pad[7] = t[30] & 255 | (t[31] & 255) << 8;
    };
    Xf.prototype.blocks = function(t, e, r) {
      for (var f = this.fin ? 0 : 2048, n, a, h, b, w, L, E, J, S, O, C, z, D, Y, P, R, U, M, B, j = this.h[0], T = this.h[1], p = this.h[2], c = this.h[3], u = this.h[4], v = this.h[5], l = this.h[6], d = this.h[7], g = this.h[8], I = this.h[9], H = this.r[0], $ = this.r[1], F = this.r[2], i = this.r[3], X = this.r[4], Q = this.r[5], m = this.r[6], G = this.r[7], W = this.r[8], V = this.r[9]; r >= 16; )
        n = t[e + 0] & 255 | (t[e + 1] & 255) << 8, j += n & 8191, a = t[e + 2] & 255 | (t[e + 3] & 255) << 8, T += (n >>> 13 | a << 3) & 8191, h = t[e + 4] & 255 | (t[e + 5] & 255) << 8, p += (a >>> 10 | h << 6) & 8191, b = t[e + 6] & 255 | (t[e + 7] & 255) << 8, c += (h >>> 7 | b << 9) & 8191, w = t[e + 8] & 255 | (t[e + 9] & 255) << 8, u += (b >>> 4 | w << 12) & 8191, v += w >>> 1 & 8191, L = t[e + 10] & 255 | (t[e + 11] & 255) << 8, l += (w >>> 14 | L << 2) & 8191, E = t[e + 12] & 255 | (t[e + 13] & 255) << 8, d += (L >>> 11 | E << 5) & 8191, J = t[e + 14] & 255 | (t[e + 15] & 255) << 8, g += (E >>> 8 | J << 8) & 8191, I += J >>> 5 | f, S = 0, O = S, O += j * H, O += T * (5 * V), O += p * (5 * W), O += c * (5 * G), O += u * (5 * m), S = O >>> 13, O &= 8191, O += v * (5 * Q), O += l * (5 * X), O += d * (5 * i), O += g * (5 * F), O += I * (5 * $), S += O >>> 13, O &= 8191, C = S, C += j * $, C += T * H, C += p * (5 * V), C += c * (5 * W), C += u * (5 * G), S = C >>> 13, C &= 8191, C += v * (5 * m), C += l * (5 * Q), C += d * (5 * X), C += g * (5 * i), C += I * (5 * F), S += C >>> 13, C &= 8191, z = S, z += j * F, z += T * $, z += p * H, z += c * (5 * V), z += u * (5 * W), S = z >>> 13, z &= 8191, z += v * (5 * G), z += l * (5 * m), z += d * (5 * Q), z += g * (5 * X), z += I * (5 * i), S += z >>> 13, z &= 8191, D = S, D += j * i, D += T * F, D += p * $, D += c * H, D += u * (5 * V), S = D >>> 13, D &= 8191, D += v * (5 * W), D += l * (5 * G), D += d * (5 * m), D += g * (5 * Q), D += I * (5 * X), S += D >>> 13, D &= 8191, Y = S, Y += j * X, Y += T * i, Y += p * F, Y += c * $, Y += u * H, S = Y >>> 13, Y &= 8191, Y += v * (5 * V), Y += l * (5 * W), Y += d * (5 * G), Y += g * (5 * m), Y += I * (5 * Q), S += Y >>> 13, Y &= 8191, P = S, P += j * Q, P += T * X, P += p * i, P += c * F, P += u * $, S = P >>> 13, P &= 8191, P += v * H, P += l * (5 * V), P += d * (5 * W), P += g * (5 * G), P += I * (5 * m), S += P >>> 13, P &= 8191, R = S, R += j * m, R += T * Q, R += p * X, R += c * i, R += u * F, S = R >>> 13, R &= 8191, R += v * $, R += l * H, R += d * (5 * V), R += g * (5 * W), R += I * (5 * G), S += R >>> 13, R &= 8191, U = S, U += j * G, U += T * m, U += p * Q, U += c * X, U += u * i, S = U >>> 13, U &= 8191, U += v * F, U += l * $, U += d * H, U += g * (5 * V), U += I * (5 * W), S += U >>> 13, U &= 8191, M = S, M += j * W, M += T * G, M += p * m, M += c * Q, M += u * X, S = M >>> 13, M &= 8191, M += v * i, M += l * F, M += d * $, M += g * H, M += I * (5 * V), S += M >>> 13, M &= 8191, B = S, B += j * V, B += T * W, B += p * G, B += c * m, B += u * Q, S = B >>> 13, B &= 8191, B += v * X, B += l * i, B += d * F, B += g * $, B += I * H, S += B >>> 13, B &= 8191, S = (S << 2) + S | 0, S = S + O | 0, O = S & 8191, S = S >>> 13, C += S, j = O, T = C, p = z, c = D, u = Y, v = P, l = R, d = U, g = M, I = B, e += 16, r -= 16;
      this.h[0] = j, this.h[1] = T, this.h[2] = p, this.h[3] = c, this.h[4] = u, this.h[5] = v, this.h[6] = l, this.h[7] = d, this.h[8] = g, this.h[9] = I;
    }, Xf.prototype.finish = function(t, e) {
      var r = new Uint16Array(10), f, n, a, h;
      if (this.leftover) {
        for (h = this.leftover, this.buffer[h++] = 1; h < 16; h++)
          this.buffer[h] = 0;
        this.fin = 1, this.blocks(this.buffer, 0, 16);
      }
      for (f = this.h[1] >>> 13, this.h[1] &= 8191, h = 2; h < 10; h++)
        this.h[h] += f, f = this.h[h] >>> 13, this.h[h] &= 8191;
      for (this.h[0] += f * 5, f = this.h[0] >>> 13, this.h[0] &= 8191, this.h[1] += f, f = this.h[1] >>> 13, this.h[1] &= 8191, this.h[2] += f, r[0] = this.h[0] + 5, f = r[0] >>> 13, r[0] &= 8191, h = 1; h < 10; h++)
        r[h] = this.h[h] + f, f = r[h] >>> 13, r[h] &= 8191;
      for (r[9] -= 1 << 13, n = (f ^ 1) - 1, h = 0; h < 10; h++)
        r[h] &= n;
      for (n = ~n, h = 0; h < 10; h++)
        this.h[h] = this.h[h] & n | r[h];
      for (this.h[0] = (this.h[0] | this.h[1] << 13) & 65535, this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535, this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535, this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535, this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535, this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535, this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535, this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535, a = this.h[0] + this.pad[0], this.h[0] = a & 65535, h = 1; h < 8; h++)
        a = (this.h[h] + this.pad[h] | 0) + (a >>> 16) | 0, this.h[h] = a & 65535;
      t[e + 0] = this.h[0] >>> 0 & 255, t[e + 1] = this.h[0] >>> 8 & 255, t[e + 2] = this.h[1] >>> 0 & 255, t[e + 3] = this.h[1] >>> 8 & 255, t[e + 4] = this.h[2] >>> 0 & 255, t[e + 5] = this.h[2] >>> 8 & 255, t[e + 6] = this.h[3] >>> 0 & 255, t[e + 7] = this.h[3] >>> 8 & 255, t[e + 8] = this.h[4] >>> 0 & 255, t[e + 9] = this.h[4] >>> 8 & 255, t[e + 10] = this.h[5] >>> 0 & 255, t[e + 11] = this.h[5] >>> 8 & 255, t[e + 12] = this.h[6] >>> 0 & 255, t[e + 13] = this.h[6] >>> 8 & 255, t[e + 14] = this.h[7] >>> 0 & 255, t[e + 15] = this.h[7] >>> 8 & 255;
    }, Xf.prototype.update = function(t, e, r) {
      var f, n;
      if (this.leftover) {
        for (n = 16 - this.leftover, n > r && (n = r), f = 0; f < n; f++)
          this.buffer[this.leftover + f] = t[e + f];
        if (r -= n, e += n, this.leftover += n, this.leftover < 16)
          return;
        this.blocks(this.buffer, 0, 16), this.leftover = 0;
      }
      if (r >= 16 && (n = r - r % 16, this.blocks(t, e, n), e += n, r -= n), r) {
        for (f = 0; f < r; f++)
          this.buffer[this.leftover + f] = t[e + f];
        this.leftover += r;
      }
    };
    function n0(t, e, r, f, n, a) {
      var h = new Xf(a);
      return h.update(r, f, n), h.finish(t, e), 0;
    }
    function M0(t, e, r, f, n, a) {
      var h = new Uint8Array(16);
      return n0(h, 0, r, f, n, a), _f(t, e, h, 0);
    }
    function x0(t, e, r, f, n) {
      var a;
      if (r < 32)
        return -1;
      for (e0(t, 0, e, 0, r, f, n), n0(t, 16, t, 32, r - 32, t), a = 0; a < 16; a++)
        t[a] = 0;
      return 0;
    }
    function i0(t, e, r, f, n) {
      var a, h = new Uint8Array(32);
      if (r < 32 || (L0(h, 0, 32, f, n), M0(e, 16, e, 32, r - 32, h) !== 0))
        return -1;
      for (e0(t, 0, e, 0, r, f, n), a = 0; a < 32; a++)
        t[a] = 0;
      return 0;
    }
    function Sf(t, e) {
      var r;
      for (r = 0; r < 16; r++)
        t[r] = e[r] | 0;
    }
    function o0(t) {
      var e, r, f = 1;
      for (e = 0; e < 16; e++)
        r = t[e] + f + 65535, f = Math.floor(r / 65536), t[e] = r - f * 65536;
      t[0] += f - 1 + 37 * (f - 1);
    }
    function Nf(t, e, r) {
      for (var f, n = ~(r - 1), a = 0; a < 16; a++)
        f = n & (t[a] ^ e[a]), t[a] ^= f, e[a] ^= f;
    }
    function Of(t, e) {
      var r, f, n, a = o(), h = o();
      for (r = 0; r < 16; r++)
        h[r] = e[r];
      for (o0(h), o0(h), o0(h), f = 0; f < 2; f++) {
        for (a[0] = h[0] - 65517, r = 1; r < 15; r++)
          a[r] = h[r] - 65535 - (a[r - 1] >> 16 & 1), a[r - 1] &= 65535;
        a[15] = h[15] - 32767 - (a[14] >> 16 & 1), n = a[15] >> 16 & 1, a[14] &= 65535, Nf(h, a, 1 - n);
      }
      for (r = 0; r < 16; r++)
        t[2 * r] = h[r] & 255, t[2 * r + 1] = h[r] >> 8;
    }
    function I0(t, e) {
      var r = new Uint8Array(32), f = new Uint8Array(32);
      return Of(r, t), Of(f, e), r0(r, 0, f, 0);
    }
    function N0(t) {
      var e = new Uint8Array(32);
      return Of(e, t), e[0] & 1;
    }
    function s0(t, e) {
      var r;
      for (r = 0; r < 16; r++)
        t[r] = e[2 * r] + (e[2 * r + 1] << 8);
      t[15] &= 32767;
    }
    function Af(t, e, r) {
      for (var f = 0; f < 16; f++)
        t[f] = e[f] + r[f];
    }
    function Ef(t, e, r) {
      for (var f = 0; f < 16; f++)
        t[f] = e[f] - r[f];
    }
    function q(t, e, r) {
      var f, n, a = 0, h = 0, b = 0, w = 0, L = 0, E = 0, J = 0, S = 0, O = 0, C = 0, z = 0, D = 0, Y = 0, P = 0, R = 0, U = 0, M = 0, B = 0, j = 0, T = 0, p = 0, c = 0, u = 0, v = 0, l = 0, d = 0, g = 0, I = 0, H = 0, $ = 0, F = 0, i = r[0], X = r[1], Q = r[2], m = r[3], G = r[4], W = r[5], V = r[6], af = r[7], k = r[8], xf = r[9], of = r[10], sf = r[11], cf = r[12], bf = r[13], df = r[14], yf = r[15];
      f = e[0], a += f * i, h += f * X, b += f * Q, w += f * m, L += f * G, E += f * W, J += f * V, S += f * af, O += f * k, C += f * xf, z += f * of, D += f * sf, Y += f * cf, P += f * bf, R += f * df, U += f * yf, f = e[1], h += f * i, b += f * X, w += f * Q, L += f * m, E += f * G, J += f * W, S += f * V, O += f * af, C += f * k, z += f * xf, D += f * of, Y += f * sf, P += f * cf, R += f * bf, U += f * df, M += f * yf, f = e[2], b += f * i, w += f * X, L += f * Q, E += f * m, J += f * G, S += f * W, O += f * V, C += f * af, z += f * k, D += f * xf, Y += f * of, P += f * sf, R += f * cf, U += f * bf, M += f * df, B += f * yf, f = e[3], w += f * i, L += f * X, E += f * Q, J += f * m, S += f * G, O += f * W, C += f * V, z += f * af, D += f * k, Y += f * xf, P += f * of, R += f * sf, U += f * cf, M += f * bf, B += f * df, j += f * yf, f = e[4], L += f * i, E += f * X, J += f * Q, S += f * m, O += f * G, C += f * W, z += f * V, D += f * af, Y += f * k, P += f * xf, R += f * of, U += f * sf, M += f * cf, B += f * bf, j += f * df, T += f * yf, f = e[5], E += f * i, J += f * X, S += f * Q, O += f * m, C += f * G, z += f * W, D += f * V, Y += f * af, P += f * k, R += f * xf, U += f * of, M += f * sf, B += f * cf, j += f * bf, T += f * df, p += f * yf, f = e[6], J += f * i, S += f * X, O += f * Q, C += f * m, z += f * G, D += f * W, Y += f * V, P += f * af, R += f * k, U += f * xf, M += f * of, B += f * sf, j += f * cf, T += f * bf, p += f * df, c += f * yf, f = e[7], S += f * i, O += f * X, C += f * Q, z += f * m, D += f * G, Y += f * W, P += f * V, R += f * af, U += f * k, M += f * xf, B += f * of, j += f * sf, T += f * cf, p += f * bf, c += f * df, u += f * yf, f = e[8], O += f * i, C += f * X, z += f * Q, D += f * m, Y += f * G, P += f * W, R += f * V, U += f * af, M += f * k, B += f * xf, j += f * of, T += f * sf, p += f * cf, c += f * bf, u += f * df, v += f * yf, f = e[9], C += f * i, z += f * X, D += f * Q, Y += f * m, P += f * G, R += f * W, U += f * V, M += f * af, B += f * k, j += f * xf, T += f * of, p += f * sf, c += f * cf, u += f * bf, v += f * df, l += f * yf, f = e[10], z += f * i, D += f * X, Y += f * Q, P += f * m, R += f * G, U += f * W, M += f * V, B += f * af, j += f * k, T += f * xf, p += f * of, c += f * sf, u += f * cf, v += f * bf, l += f * df, d += f * yf, f = e[11], D += f * i, Y += f * X, P += f * Q, R += f * m, U += f * G, M += f * W, B += f * V, j += f * af, T += f * k, p += f * xf, c += f * of, u += f * sf, v += f * cf, l += f * bf, d += f * df, g += f * yf, f = e[12], Y += f * i, P += f * X, R += f * Q, U += f * m, M += f * G, B += f * W, j += f * V, T += f * af, p += f * k, c += f * xf, u += f * of, v += f * sf, l += f * cf, d += f * bf, g += f * df, I += f * yf, f = e[13], P += f * i, R += f * X, U += f * Q, M += f * m, B += f * G, j += f * W, T += f * V, p += f * af, c += f * k, u += f * xf, v += f * of, l += f * sf, d += f * cf, g += f * bf, I += f * df, H += f * yf, f = e[14], R += f * i, U += f * X, M += f * Q, B += f * m, j += f * G, T += f * W, p += f * V, c += f * af, u += f * k, v += f * xf, l += f * of, d += f * sf, g += f * cf, I += f * bf, H += f * df, $ += f * yf, f = e[15], U += f * i, M += f * X, B += f * Q, j += f * m, T += f * G, p += f * W, c += f * V, u += f * af, v += f * k, l += f * xf, d += f * of, g += f * sf, I += f * cf, H += f * bf, $ += f * df, F += f * yf, a += 38 * M, h += 38 * B, b += 38 * j, w += 38 * T, L += 38 * p, E += 38 * c, J += 38 * u, S += 38 * v, O += 38 * l, C += 38 * d, z += 38 * g, D += 38 * I, Y += 38 * H, P += 38 * $, R += 38 * F, n = 1, f = a + n + 65535, n = Math.floor(f / 65536), a = f - n * 65536, f = h + n + 65535, n = Math.floor(f / 65536), h = f - n * 65536, f = b + n + 65535, n = Math.floor(f / 65536), b = f - n * 65536, f = w + n + 65535, n = Math.floor(f / 65536), w = f - n * 65536, f = L + n + 65535, n = Math.floor(f / 65536), L = f - n * 65536, f = E + n + 65535, n = Math.floor(f / 65536), E = f - n * 65536, f = J + n + 65535, n = Math.floor(f / 65536), J = f - n * 65536, f = S + n + 65535, n = Math.floor(f / 65536), S = f - n * 65536, f = O + n + 65535, n = Math.floor(f / 65536), O = f - n * 65536, f = C + n + 65535, n = Math.floor(f / 65536), C = f - n * 65536, f = z + n + 65535, n = Math.floor(f / 65536), z = f - n * 65536, f = D + n + 65535, n = Math.floor(f / 65536), D = f - n * 65536, f = Y + n + 65535, n = Math.floor(f / 65536), Y = f - n * 65536, f = P + n + 65535, n = Math.floor(f / 65536), P = f - n * 65536, f = R + n + 65535, n = Math.floor(f / 65536), R = f - n * 65536, f = U + n + 65535, n = Math.floor(f / 65536), U = f - n * 65536, a += n - 1 + 37 * (n - 1), n = 1, f = a + n + 65535, n = Math.floor(f / 65536), a = f - n * 65536, f = h + n + 65535, n = Math.floor(f / 65536), h = f - n * 65536, f = b + n + 65535, n = Math.floor(f / 65536), b = f - n * 65536, f = w + n + 65535, n = Math.floor(f / 65536), w = f - n * 65536, f = L + n + 65535, n = Math.floor(f / 65536), L = f - n * 65536, f = E + n + 65535, n = Math.floor(f / 65536), E = f - n * 65536, f = J + n + 65535, n = Math.floor(f / 65536), J = f - n * 65536, f = S + n + 65535, n = Math.floor(f / 65536), S = f - n * 65536, f = O + n + 65535, n = Math.floor(f / 65536), O = f - n * 65536, f = C + n + 65535, n = Math.floor(f / 65536), C = f - n * 65536, f = z + n + 65535, n = Math.floor(f / 65536), z = f - n * 65536, f = D + n + 65535, n = Math.floor(f / 65536), D = f - n * 65536, f = Y + n + 65535, n = Math.floor(f / 65536), Y = f - n * 65536, f = P + n + 65535, n = Math.floor(f / 65536), P = f - n * 65536, f = R + n + 65535, n = Math.floor(f / 65536), R = f - n * 65536, f = U + n + 65535, n = Math.floor(f / 65536), U = f - n * 65536, a += n - 1 + 37 * (n - 1), t[0] = a, t[1] = h, t[2] = b, t[3] = w, t[4] = L, t[5] = E, t[6] = J, t[7] = S, t[8] = O, t[9] = C, t[10] = z, t[11] = D, t[12] = Y, t[13] = P, t[14] = R, t[15] = U;
    }
    function pf(t, e) {
      q(t, e, e);
    }
    function O0(t, e) {
      var r = o(), f;
      for (f = 0; f < 16; f++)
        r[f] = e[f];
      for (f = 253; f >= 0; f--)
        pf(r, r), f !== 2 && f !== 4 && q(r, r, e);
      for (f = 0; f < 16; f++)
        t[f] = r[f];
    }
    function C0(t, e) {
      var r = o(), f;
      for (f = 0; f < 16; f++)
        r[f] = e[f];
      for (f = 250; f >= 0; f--)
        pf(r, r), f !== 1 && q(r, r, e);
      for (f = 0; f < 16; f++)
        t[f] = r[f];
    }
    function Zf(t, e, r) {
      var f = new Uint8Array(32), n = new Float64Array(80), a, h, b = o(), w = o(), L = o(), E = o(), J = o(), S = o();
      for (h = 0; h < 31; h++)
        f[h] = e[h];
      for (f[31] = e[31] & 127 | 64, f[0] &= 248, s0(n, r), h = 0; h < 16; h++)
        w[h] = n[h], E[h] = b[h] = L[h] = 0;
      for (b[0] = E[0] = 1, h = 254; h >= 0; --h)
        a = f[h >>> 3] >>> (h & 7) & 1, Nf(b, w, a), Nf(L, E, a), Af(J, b, L), Ef(b, b, L), Af(L, w, E), Ef(w, w, E), pf(E, J), pf(S, b), q(b, L, b), q(L, w, J), Af(J, b, L), Ef(b, b, L), pf(w, b), Ef(L, E, S), q(b, L, ff), Af(b, b, E), q(L, L, b), q(b, E, S), q(E, w, n), pf(w, J), Nf(b, w, a), Nf(L, E, a);
      for (h = 0; h < 16; h++)
        n[h + 16] = b[h], n[h + 32] = L[h], n[h + 48] = w[h], n[h + 64] = E[h];
      var O = n.subarray(32), C = n.subarray(16);
      return O0(O, O), q(C, C, O), Of(t, C), 0;
    }
    function qf(t, e) {
      return Zf(t, e, Z);
    }
    function Y0(t, e) {
      return y(e, 32), qf(t, e);
    }
    function Wf(t, e, r) {
      var f = new Uint8Array(32);
      return Zf(f, r, e), Gf(t, _, f, Lf);
    }
    var R0 = x0, rt = i0;
    function et(t, e, r, f, n, a) {
      var h = new Uint8Array(32);
      return Wf(h, n, a), R0(t, e, r, f, h);
    }
    function nt(t, e, r, f, n, a) {
      var h = new Uint8Array(32);
      return Wf(h, n, a), rt(t, e, r, f, h);
    }
    var P0 = [
      1116352408,
      3609767458,
      1899447441,
      602891725,
      3049323471,
      3964484399,
      3921009573,
      2173295548,
      961987163,
      4081628472,
      1508970993,
      3053834265,
      2453635748,
      2937671579,
      2870763221,
      3664609560,
      3624381080,
      2734883394,
      310598401,
      1164996542,
      607225278,
      1323610764,
      1426881987,
      3590304994,
      1925078388,
      4068182383,
      2162078206,
      991336113,
      2614888103,
      633803317,
      3248222580,
      3479774868,
      3835390401,
      2666613458,
      4022224774,
      944711139,
      264347078,
      2341262773,
      604807628,
      2007800933,
      770255983,
      1495990901,
      1249150122,
      1856431235,
      1555081692,
      3175218132,
      1996064986,
      2198950837,
      2554220882,
      3999719339,
      2821834349,
      766784016,
      2952996808,
      2566594879,
      3210313671,
      3203337956,
      3336571891,
      1034457026,
      3584528711,
      2466948901,
      113926993,
      3758326383,
      338241895,
      168717936,
      666307205,
      1188179964,
      773529912,
      1546045734,
      1294757372,
      1522805485,
      1396182291,
      2643833823,
      1695183700,
      2343527390,
      1986661051,
      1014477480,
      2177026350,
      1206759142,
      2456956037,
      344077627,
      2730485921,
      1290863460,
      2820302411,
      3158454273,
      3259730800,
      3505952657,
      3345764771,
      106217008,
      3516065817,
      3606008344,
      3600352804,
      1432725776,
      4094571909,
      1467031594,
      275423344,
      851169720,
      430227734,
      3100823752,
      506948616,
      1363258195,
      659060556,
      3750685593,
      883997877,
      3785050280,
      958139571,
      3318307427,
      1322822218,
      3812723403,
      1537002063,
      2003034995,
      1747873779,
      3602036899,
      1955562222,
      1575990012,
      2024104815,
      1125592928,
      2227730452,
      2716904306,
      2361852424,
      442776044,
      2428436474,
      593698344,
      2756734187,
      3733110249,
      3204031479,
      2999351573,
      3329325298,
      3815920427,
      3391569614,
      3928383900,
      3515267271,
      566280711,
      3940187606,
      3454069534,
      4118630271,
      4000239992,
      116418474,
      1914138554,
      174292421,
      2731055270,
      289380356,
      3203993006,
      460393269,
      320620315,
      685471733,
      587496836,
      852142971,
      1086792851,
      1017036298,
      365543100,
      1126000580,
      2618297676,
      1288033470,
      3409855158,
      1501505948,
      4234509866,
      1607167915,
      987167468,
      1816402316,
      1246189591
    ];
    function D0(t, e, r, f) {
      for (var n = new Int32Array(16), a = new Int32Array(16), h, b, w, L, E, J, S, O, C, z, D, Y, P, R, U, M, B, j, T, p, c, u, v, l, d, g, I = t[0], H = t[1], $ = t[2], F = t[3], i = t[4], X = t[5], Q = t[6], m = t[7], G = e[0], W = e[1], V = e[2], af = e[3], k = e[4], xf = e[5], of = e[6], sf = e[7], cf = 0; f >= 128; ) {
        for (T = 0; T < 16; T++)
          p = 8 * T + cf, n[T] = r[p + 0] << 24 | r[p + 1] << 16 | r[p + 2] << 8 | r[p + 3], a[T] = r[p + 4] << 24 | r[p + 5] << 16 | r[p + 6] << 8 | r[p + 7];
        for (T = 0; T < 80; T++)
          if (h = I, b = H, w = $, L = F, E = i, J = X, S = Q, O = m, C = G, z = W, D = V, Y = af, P = k, R = xf, U = of, M = sf, c = m, u = sf, v = u & 65535, l = u >>> 16, d = c & 65535, g = c >>> 16, c = (i >>> 14 | k << 32 - 14) ^ (i >>> 18 | k << 32 - 18) ^ (k >>> 41 - 32 | i << 32 - (41 - 32)), u = (k >>> 14 | i << 32 - 14) ^ (k >>> 18 | i << 32 - 18) ^ (i >>> 41 - 32 | k << 32 - (41 - 32)), v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, c = i & X ^ ~i & Q, u = k & xf ^ ~k & of, v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, c = P0[T * 2], u = P0[T * 2 + 1], v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, c = n[T % 16], u = a[T % 16], v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, l += v >>> 16, d += l >>> 16, g += d >>> 16, B = d & 65535 | g << 16, j = v & 65535 | l << 16, c = B, u = j, v = u & 65535, l = u >>> 16, d = c & 65535, g = c >>> 16, c = (I >>> 28 | G << 32 - 28) ^ (G >>> 34 - 32 | I << 32 - (34 - 32)) ^ (G >>> 39 - 32 | I << 32 - (39 - 32)), u = (G >>> 28 | I << 32 - 28) ^ (I >>> 34 - 32 | G << 32 - (34 - 32)) ^ (I >>> 39 - 32 | G << 32 - (39 - 32)), v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, c = I & H ^ I & $ ^ H & $, u = G & W ^ G & V ^ W & V, v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, l += v >>> 16, d += l >>> 16, g += d >>> 16, O = d & 65535 | g << 16, M = v & 65535 | l << 16, c = L, u = Y, v = u & 65535, l = u >>> 16, d = c & 65535, g = c >>> 16, c = B, u = j, v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, l += v >>> 16, d += l >>> 16, g += d >>> 16, L = d & 65535 | g << 16, Y = v & 65535 | l << 16, H = h, $ = b, F = w, i = L, X = E, Q = J, m = S, I = O, W = C, V = z, af = D, k = Y, xf = P, of = R, sf = U, G = M, T % 16 === 15)
            for (p = 0; p < 16; p++)
              c = n[p], u = a[p], v = u & 65535, l = u >>> 16, d = c & 65535, g = c >>> 16, c = n[(p + 9) % 16], u = a[(p + 9) % 16], v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, B = n[(p + 1) % 16], j = a[(p + 1) % 16], c = (B >>> 1 | j << 32 - 1) ^ (B >>> 8 | j << 32 - 8) ^ B >>> 7, u = (j >>> 1 | B << 32 - 1) ^ (j >>> 8 | B << 32 - 8) ^ (j >>> 7 | B << 32 - 7), v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, B = n[(p + 14) % 16], j = a[(p + 14) % 16], c = (B >>> 19 | j << 32 - 19) ^ (j >>> 61 - 32 | B << 32 - (61 - 32)) ^ B >>> 6, u = (j >>> 19 | B << 32 - 19) ^ (B >>> 61 - 32 | j << 32 - (61 - 32)) ^ (j >>> 6 | B << 32 - 6), v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, l += v >>> 16, d += l >>> 16, g += d >>> 16, n[p] = d & 65535 | g << 16, a[p] = v & 65535 | l << 16;
        c = I, u = G, v = u & 65535, l = u >>> 16, d = c & 65535, g = c >>> 16, c = t[0], u = e[0], v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, l += v >>> 16, d += l >>> 16, g += d >>> 16, t[0] = I = d & 65535 | g << 16, e[0] = G = v & 65535 | l << 16, c = H, u = W, v = u & 65535, l = u >>> 16, d = c & 65535, g = c >>> 16, c = t[1], u = e[1], v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, l += v >>> 16, d += l >>> 16, g += d >>> 16, t[1] = H = d & 65535 | g << 16, e[1] = W = v & 65535 | l << 16, c = $, u = V, v = u & 65535, l = u >>> 16, d = c & 65535, g = c >>> 16, c = t[2], u = e[2], v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, l += v >>> 16, d += l >>> 16, g += d >>> 16, t[2] = $ = d & 65535 | g << 16, e[2] = V = v & 65535 | l << 16, c = F, u = af, v = u & 65535, l = u >>> 16, d = c & 65535, g = c >>> 16, c = t[3], u = e[3], v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, l += v >>> 16, d += l >>> 16, g += d >>> 16, t[3] = F = d & 65535 | g << 16, e[3] = af = v & 65535 | l << 16, c = i, u = k, v = u & 65535, l = u >>> 16, d = c & 65535, g = c >>> 16, c = t[4], u = e[4], v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, l += v >>> 16, d += l >>> 16, g += d >>> 16, t[4] = i = d & 65535 | g << 16, e[4] = k = v & 65535 | l << 16, c = X, u = xf, v = u & 65535, l = u >>> 16, d = c & 65535, g = c >>> 16, c = t[5], u = e[5], v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, l += v >>> 16, d += l >>> 16, g += d >>> 16, t[5] = X = d & 65535 | g << 16, e[5] = xf = v & 65535 | l << 16, c = Q, u = of, v = u & 65535, l = u >>> 16, d = c & 65535, g = c >>> 16, c = t[6], u = e[6], v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, l += v >>> 16, d += l >>> 16, g += d >>> 16, t[6] = Q = d & 65535 | g << 16, e[6] = of = v & 65535 | l << 16, c = m, u = sf, v = u & 65535, l = u >>> 16, d = c & 65535, g = c >>> 16, c = t[7], u = e[7], v += u & 65535, l += u >>> 16, d += c & 65535, g += c >>> 16, l += v >>> 16, d += l >>> 16, g += d >>> 16, t[7] = m = d & 65535 | g << 16, e[7] = sf = v & 65535 | l << 16, cf += 128, f -= 128;
      }
      return f;
    }
    function Mf(t, e, r) {
      var f = new Int32Array(8), n = new Int32Array(8), a = new Uint8Array(256), h, b = r;
      for (f[0] = 1779033703, f[1] = 3144134277, f[2] = 1013904242, f[3] = 2773480762, f[4] = 1359893119, f[5] = 2600822924, f[6] = 528734635, f[7] = 1541459225, n[0] = 4089235720, n[1] = 2227873595, n[2] = 4271175723, n[3] = 1595750129, n[4] = 2917565137, n[5] = 725511199, n[6] = 4215389547, n[7] = 327033209, D0(f, n, e, r), r %= 128, h = 0; h < r; h++)
        a[h] = e[b - r + h];
      for (a[r] = 128, r = 256 - 128 * (r < 112 ? 1 : 0), a[r - 9] = 0, nf(a, r - 8, b / 536870912 | 0, b << 3), D0(f, n, a, r), h = 0; h < 8; h++)
        nf(t, 8 * h, f[h], n[h]);
      return 0;
    }
    function Vf(t, e) {
      var r = o(), f = o(), n = o(), a = o(), h = o(), b = o(), w = o(), L = o(), E = o();
      Ef(r, t[1], t[0]), Ef(E, e[1], e[0]), q(r, r, E), Af(f, t[0], t[1]), Af(E, e[0], e[1]), q(f, f, E), q(n, t[3], e[3]), q(n, n, tf), q(a, t[2], e[2]), Af(a, a, a), Ef(h, f, r), Ef(b, a, n), Af(w, a, n), Af(L, f, r), q(t[0], h, b), q(t[1], L, w), q(t[2], w, b), q(t[3], h, L);
    }
    function z0(t, e, r) {
      var f;
      for (f = 0; f < 4; f++)
        Nf(t[f], e[f], r);
    }
    function a0(t, e) {
      var r = o(), f = o(), n = o();
      O0(n, e[2]), q(r, e[0], n), q(f, e[1], n), Of(t, f), t[31] ^= N0(r) << 7;
    }
    function h0(t, e, r) {
      var f, n;
      for (Sf(t[0], N), Sf(t[1], K), Sf(t[2], K), Sf(t[3], N), n = 255; n >= 0; --n)
        f = r[n / 8 | 0] >> (n & 7) & 1, z0(t, e, f), Vf(e, t), Vf(t, t), z0(t, e, f);
    }
    function Jf(t, e) {
      var r = [o(), o(), o(), o()];
      Sf(r[0], ef), Sf(r[1], lf), Sf(r[2], K), q(r[3], ef, lf), h0(t, r, e);
    }
    function c0(t, e, r) {
      var f = new Uint8Array(64), n = [o(), o(), o(), o()], a;
      for (r || y(e, 32), Mf(f, e, 32), f[0] &= 248, f[31] &= 127, f[31] |= 64, Jf(n, f), a0(t, n), a = 0; a < 32; a++)
        e[a + 32] = t[a];
      return 0;
    }
    var Qf = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
    function u0(t, e) {
      var r, f, n, a;
      for (f = 63; f >= 32; --f) {
        for (r = 0, n = f - 32, a = f - 12; n < a; ++n)
          e[n] += r - 16 * e[f] * Qf[n - (f - 32)], r = Math.floor((e[n] + 128) / 256), e[n] -= r * 256;
        e[n] += r, e[f] = 0;
      }
      for (r = 0, n = 0; n < 32; n++)
        e[n] += r - (e[31] >> 4) * Qf[n], r = e[n] >> 8, e[n] &= 255;
      for (n = 0; n < 32; n++)
        e[n] -= r * Qf[n];
      for (f = 0; f < 32; f++)
        e[f + 1] += e[f] >> 8, t[f] = e[f] & 255;
    }
    function l0(t) {
      var e = new Float64Array(64), r;
      for (r = 0; r < 64; r++)
        e[r] = t[r];
      for (r = 0; r < 64; r++)
        t[r] = 0;
      u0(t, e);
    }
    function H0(t, e, r, f) {
      var n = new Uint8Array(64), a = new Uint8Array(64), h = new Uint8Array(64), b, w, L = new Float64Array(64), E = [o(), o(), o(), o()];
      Mf(n, f, 32), n[0] &= 248, n[31] &= 127, n[31] |= 64;
      var J = r + 64;
      for (b = 0; b < r; b++)
        t[64 + b] = e[b];
      for (b = 0; b < 32; b++)
        t[32 + b] = n[32 + b];
      for (Mf(h, t.subarray(32), r + 32), l0(h), Jf(E, h), a0(t, E), b = 32; b < 64; b++)
        t[b] = f[b];
      for (Mf(a, t, r + 64), l0(a), b = 0; b < 64; b++)
        L[b] = 0;
      for (b = 0; b < 32; b++)
        L[b] = h[b];
      for (b = 0; b < 32; b++)
        for (w = 0; w < 32; w++)
          L[b + w] += a[b] * n[w];
      return u0(t.subarray(32), L), J;
    }
    function xt(t, e) {
      var r = o(), f = o(), n = o(), a = o(), h = o(), b = o(), w = o();
      return Sf(t[2], K), s0(t[1], e), pf(n, t[1]), q(a, n, hf), Ef(n, n, t[2]), Af(a, t[2], a), pf(h, a), pf(b, h), q(w, b, h), q(r, w, n), q(r, r, a), C0(r, r), q(r, r, n), q(r, r, a), q(r, r, a), q(t[0], r, a), pf(f, t[0]), q(f, f, a), I0(f, n) && q(t[0], t[0], vf), pf(f, t[0]), q(f, f, a), I0(f, n) ? -1 : (N0(t[0]) === e[31] >> 7 && Ef(t[0], N, t[0]), q(t[3], t[0], t[1]), 0);
    }
    function b0(t, e, r, f) {
      var n, a = new Uint8Array(32), h = new Uint8Array(64), b = [o(), o(), o(), o()], w = [o(), o(), o(), o()];
      if (r < 64 || xt(w, f))
        return -1;
      for (n = 0; n < r; n++)
        t[n] = e[n];
      for (n = 0; n < 32; n++)
        t[n + 32] = f[n];
      if (Mf(h, t, r), l0(h), h0(b, w, h), Jf(w, e.subarray(32)), Vf(b, w), a0(a, b), r -= 64, r0(e, 0, a, 0)) {
        for (n = 0; n < r; n++)
          t[n] = 0;
        return -1;
      }
      for (n = 0; n < r; n++)
        t[n] = e[n + 64];
      return r;
    }
    var d0 = 32, mf = 24, Pf = 32, Cf = 16, Df = 32, kf = 32, zf = 32, Hf = 32, y0 = 32, F0 = mf, it = Pf, ot = Cf, Uf = 64, If = 32, Yf = 64, v0 = 32, g0 = 64;
    x.lowlevel = {
      crypto_core_hsalsa20: Gf,
      crypto_stream_xor: e0,
      crypto_stream: L0,
      crypto_stream_salsa20_xor: j0,
      crypto_stream_salsa20: T0,
      crypto_onetimeauth: n0,
      crypto_onetimeauth_verify: M0,
      crypto_verify_16: _f,
      crypto_verify_32: r0,
      crypto_secretbox: x0,
      crypto_secretbox_open: i0,
      crypto_scalarmult: Zf,
      crypto_scalarmult_base: qf,
      crypto_box_beforenm: Wf,
      crypto_box_afternm: R0,
      crypto_box: et,
      crypto_box_open: nt,
      crypto_box_keypair: Y0,
      crypto_hash: Mf,
      crypto_sign: H0,
      crypto_sign_keypair: c0,
      crypto_sign_open: b0,
      crypto_secretbox_KEYBYTES: d0,
      crypto_secretbox_NONCEBYTES: mf,
      crypto_secretbox_ZEROBYTES: Pf,
      crypto_secretbox_BOXZEROBYTES: Cf,
      crypto_scalarmult_BYTES: Df,
      crypto_scalarmult_SCALARBYTES: kf,
      crypto_box_PUBLICKEYBYTES: zf,
      crypto_box_SECRETKEYBYTES: Hf,
      crypto_box_BEFORENMBYTES: y0,
      crypto_box_NONCEBYTES: F0,
      crypto_box_ZEROBYTES: it,
      crypto_box_BOXZEROBYTES: ot,
      crypto_sign_BYTES: Uf,
      crypto_sign_PUBLICKEYBYTES: If,
      crypto_sign_SECRETKEYBYTES: Yf,
      crypto_sign_SEEDBYTES: v0,
      crypto_hash_BYTES: g0,
      gf: o,
      D: hf,
      L: Qf,
      pack25519: Of,
      unpack25519: s0,
      M: q,
      A: Af,
      S: pf,
      Z: Ef,
      pow2523: C0,
      add: Vf,
      set25519: Sf,
      modL: u0,
      scalarmult: h0,
      scalarbase: Jf
    };
    function $0(t, e) {
      if (t.length !== d0)
        throw new Error("bad key size");
      if (e.length !== mf)
        throw new Error("bad nonce size");
    }
    function st(t, e) {
      if (t.length !== zf)
        throw new Error("bad public key size");
      if (e.length !== Hf)
        throw new Error("bad secret key size");
    }
    function wf() {
      for (var t = 0; t < arguments.length; t++)
        if (!(arguments[t] instanceof Uint8Array))
          throw new TypeError("unexpected type, use Uint8Array");
    }
    function K0(t) {
      for (var e = 0; e < t.length; e++)
        t[e] = 0;
    }
    x.randomBytes = function(t) {
      var e = new Uint8Array(t);
      return y(e, t), e;
    }, x.secretbox = function(t, e, r) {
      wf(t, e, r), $0(r, e);
      for (var f = new Uint8Array(Pf + t.length), n = new Uint8Array(f.length), a = 0; a < t.length; a++)
        f[a + Pf] = t[a];
      return x0(n, f, f.length, e, r), n.subarray(Cf);
    }, x.secretbox.open = function(t, e, r) {
      wf(t, e, r), $0(r, e);
      for (var f = new Uint8Array(Cf + t.length), n = new Uint8Array(f.length), a = 0; a < t.length; a++)
        f[a + Cf] = t[a];
      return f.length < 32 || i0(n, f, f.length, e, r) !== 0 ? null : n.subarray(Pf);
    }, x.secretbox.keyLength = d0, x.secretbox.nonceLength = mf, x.secretbox.overheadLength = Cf, x.scalarMult = function(t, e) {
      if (wf(t, e), t.length !== kf)
        throw new Error("bad n size");
      if (e.length !== Df)
        throw new Error("bad p size");
      var r = new Uint8Array(Df);
      return Zf(r, t, e), r;
    }, x.scalarMult.base = function(t) {
      if (wf(t), t.length !== kf)
        throw new Error("bad n size");
      var e = new Uint8Array(Df);
      return qf(e, t), e;
    }, x.scalarMult.scalarLength = kf, x.scalarMult.groupElementLength = Df, x.box = function(t, e, r, f) {
      var n = x.box.before(r, f);
      return x.secretbox(t, e, n);
    }, x.box.before = function(t, e) {
      wf(t, e), st(t, e);
      var r = new Uint8Array(y0);
      return Wf(r, t, e), r;
    }, x.box.after = x.secretbox, x.box.open = function(t, e, r, f) {
      var n = x.box.before(r, f);
      return x.secretbox.open(t, e, n);
    }, x.box.open.after = x.secretbox.open, x.box.keyPair = function() {
      var t = new Uint8Array(zf), e = new Uint8Array(Hf);
      return Y0(t, e), { publicKey: t, secretKey: e };
    }, x.box.keyPair.fromSecretKey = function(t) {
      if (wf(t), t.length !== Hf)
        throw new Error("bad secret key size");
      var e = new Uint8Array(zf);
      return qf(e, t), { publicKey: e, secretKey: new Uint8Array(t) };
    }, x.box.publicKeyLength = zf, x.box.secretKeyLength = Hf, x.box.sharedKeyLength = y0, x.box.nonceLength = F0, x.box.overheadLength = x.secretbox.overheadLength, x.sign = function(t, e) {
      if (wf(t, e), e.length !== Yf)
        throw new Error("bad secret key size");
      var r = new Uint8Array(Uf + t.length);
      return H0(r, t, t.length, e), r;
    }, x.sign.open = function(t, e) {
      if (wf(t, e), e.length !== If)
        throw new Error("bad public key size");
      var r = new Uint8Array(t.length), f = b0(r, t, t.length, e);
      if (f < 0)
        return null;
      for (var n = new Uint8Array(f), a = 0; a < n.length; a++)
        n[a] = r[a];
      return n;
    }, x.sign.detached = function(t, e) {
      for (var r = x.sign(t, e), f = new Uint8Array(Uf), n = 0; n < f.length; n++)
        f[n] = r[n];
      return f;
    }, x.sign.detached.verify = function(t, e, r) {
      if (wf(t, e, r), e.length !== Uf)
        throw new Error("bad signature size");
      if (r.length !== If)
        throw new Error("bad public key size");
      var f = new Uint8Array(Uf + t.length), n = new Uint8Array(Uf + t.length), a;
      for (a = 0; a < Uf; a++)
        f[a] = e[a];
      for (a = 0; a < t.length; a++)
        f[a + Uf] = t[a];
      return b0(n, f, f.length, r) >= 0;
    }, x.sign.keyPair = function() {
      var t = new Uint8Array(If), e = new Uint8Array(Yf);
      return c0(t, e), { publicKey: t, secretKey: e };
    }, x.sign.keyPair.fromSecretKey = function(t) {
      if (wf(t), t.length !== Yf)
        throw new Error("bad secret key size");
      for (var e = new Uint8Array(If), r = 0; r < e.length; r++)
        e[r] = t[32 + r];
      return { publicKey: e, secretKey: new Uint8Array(t) };
    }, x.sign.keyPair.fromSeed = function(t) {
      if (wf(t), t.length !== v0)
        throw new Error("bad seed size");
      for (var e = new Uint8Array(If), r = new Uint8Array(Yf), f = 0; f < 32; f++)
        r[f] = t[f];
      return c0(e, r, !0), { publicKey: e, secretKey: r };
    }, x.sign.publicKeyLength = If, x.sign.secretKeyLength = Yf, x.sign.seedLength = v0, x.sign.signatureLength = Uf, x.hash = function(t) {
      wf(t);
      var e = new Uint8Array(g0);
      return Mf(e, t, t.length), e;
    }, x.hash.hashLength = g0, x.verify = function(t, e) {
      return wf(t, e), t.length === 0 || e.length === 0 || t.length !== e.length ? !1 : rf(t, 0, e, 0, t.length) === 0;
    }, x.setPRNG = function(t) {
      y = t;
    }, function() {
      var t = typeof self < "u" ? self.crypto || self.msCrypto : null;
      if (t && t.getRandomValues) {
        var e = 65536;
        x.setPRNG(function(r, f) {
          var n, a = new Uint8Array(f);
          for (n = 0; n < f; n += e)
            t.getRandomValues(a.subarray(n, n + Math.min(f - n, e)));
          for (n = 0; n < f; n++)
            r[n] = a[n];
          K0(a);
        });
      } else
        typeof Bt < "u" && (t = jt, t && t.randomBytes && x.setPRNG(function(r, f) {
          var n, a = t.randomBytes(f);
          for (n = 0; n < f; n++)
            r[n] = a[n];
          K0(a);
        }));
    }();
  })(s.exports ? s.exports : self.nacl = self.nacl || {});
})(Q0);
function B0(s) {
  if (!Number.isSafeInteger(s) || s < 0)
    throw new Error(`Wrong positive integer: ${s}`);
}
function Tt(s) {
  if (typeof s != "boolean")
    throw new Error(`Expected boolean, not ${s}`);
}
function m0(s, ...x) {
  if (!(s instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (x.length > 0 && !x.includes(s.length))
    throw new TypeError(`Expected Uint8Array of length ${x}, not of length=${s.length}`);
}
function Lt(s) {
  if (typeof s != "function" || typeof s.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  B0(s.outputLen), B0(s.blockLen);
}
function Mt(s, x = !0) {
  if (s.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (x && s.finished)
    throw new Error("Hash#digest() has already been called");
}
function It(s, x) {
  m0(s);
  const o = x.outputLen;
  if (s.length < o)
    throw new Error(`digestInto() expects output buffer of length at least ${o}`);
}
const Rf = {
  number: B0,
  bool: Tt,
  bytes: m0,
  hash: Lt,
  exists: Mt,
  output: It
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const t0 = (s) => new Uint32Array(s.buffer, s.byteOffset, Math.floor(s.byteLength / 4)), Nt = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Nt)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (s, x) => x.toString(16).padStart(2, "0"));
function Ot(s) {
  if (typeof s != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof s}`);
  return new TextEncoder().encode(s);
}
function Ff(s) {
  if (typeof s == "string" && (s = Ot(s)), !(s instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof s})`);
  return s;
}
class Ct {
  clone() {
    return this._cloneInto();
  }
}
function Yt(s) {
  const x = (y, _) => s(_).update(Ff(y)).digest(), o = s({});
  return x.outputLen = o.outputLen, x.blockLen = o.blockLen, x.create = (y) => s(y), x;
}
const Rt = new Uint8Array([
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  14,
  10,
  4,
  8,
  9,
  15,
  13,
  6,
  1,
  12,
  0,
  2,
  11,
  7,
  5,
  3,
  11,
  8,
  12,
  0,
  5,
  2,
  15,
  13,
  10,
  14,
  3,
  6,
  7,
  1,
  9,
  4,
  7,
  9,
  3,
  1,
  13,
  12,
  11,
  14,
  2,
  6,
  5,
  10,
  4,
  0,
  15,
  8,
  9,
  0,
  5,
  7,
  2,
  4,
  10,
  15,
  14,
  1,
  11,
  12,
  6,
  8,
  3,
  13,
  2,
  12,
  6,
  10,
  0,
  11,
  8,
  3,
  4,
  13,
  7,
  5,
  15,
  14,
  1,
  9,
  12,
  5,
  1,
  15,
  14,
  13,
  4,
  10,
  0,
  7,
  6,
  3,
  9,
  2,
  8,
  11,
  13,
  11,
  7,
  14,
  12,
  1,
  3,
  9,
  5,
  0,
  15,
  4,
  8,
  6,
  2,
  10,
  6,
  15,
  14,
  9,
  11,
  3,
  0,
  8,
  12,
  2,
  13,
  7,
  1,
  4,
  10,
  5,
  10,
  2,
  8,
  4,
  7,
  6,
  1,
  5,
  15,
  11,
  9,
  14,
  3,
  12,
  13,
  0,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  14,
  10,
  4,
  8,
  9,
  15,
  13,
  6,
  1,
  12,
  0,
  2,
  11,
  7,
  5,
  3
]);
class Pt extends Ct {
  constructor(x, o, y = {}, _, Z, N) {
    if (super(), this.blockLen = x, this.outputLen = o, this.length = 0, this.pos = 0, this.finished = !1, this.destroyed = !1, Rf.number(x), Rf.number(o), Rf.number(_), o < 0 || o > _)
      throw new Error("outputLen bigger than keyLen");
    if (y.key !== void 0 && (y.key.length < 1 || y.key.length > _))
      throw new Error(`key must be up 1..${_} byte long or undefined`);
    if (y.salt !== void 0 && y.salt.length !== Z)
      throw new Error(`salt must be ${Z} byte long or undefined`);
    if (y.personalization !== void 0 && y.personalization.length !== N)
      throw new Error(`personalization must be ${N} byte long or undefined`);
    this.buffer32 = t0(this.buffer = new Uint8Array(x));
  }
  update(x) {
    Rf.exists(this);
    const { blockLen: o, buffer: y, buffer32: _ } = this;
    x = Ff(x);
    const Z = x.length;
    for (let N = 0; N < Z; ) {
      this.pos === o && (this.compress(_, 0, !1), this.pos = 0);
      const K = Math.min(o - this.pos, Z - N), ff = x.byteOffset + N;
      if (K === o && !(ff % 4) && N + K < Z) {
        const hf = new Uint32Array(x.buffer, ff, Math.floor((Z - N) / 4));
        for (let tf = 0; N + o < Z; tf += _.length, N += o)
          this.length += o, this.compress(hf, tf, !1);
        continue;
      }
      y.set(x.subarray(N, N + K), this.pos), this.pos += K, this.length += K, N += K;
    }
    return this;
  }
  digestInto(x) {
    Rf.exists(this), Rf.output(x, this);
    const { pos: o, buffer32: y } = this;
    this.finished = !0, this.buffer.subarray(o).fill(0), this.compress(y, 0, !0);
    const _ = t0(x);
    this.get().forEach((Z, N) => _[N] = Z);
  }
  digest() {
    const { buffer: x, outputLen: o } = this;
    this.digestInto(x);
    const y = x.slice(0, o);
    return this.destroy(), y;
  }
  _cloneInto(x) {
    const { buffer: o, length: y, finished: _, destroyed: Z, outputLen: N, pos: K } = this;
    return x || (x = new this.constructor({ dkLen: N })), x.set(...this.get()), x.length = y, x.finished = _, x.destroyed = Z, x.outputLen = N, x.buffer.set(o), x.pos = K, x;
  }
}
const f0 = BigInt(2 ** 32 - 1), S0 = BigInt(32);
function k0(s, x = !1) {
  return x ? { h: Number(s & f0), l: Number(s >> S0 & f0) } : { h: Number(s >> S0 & f0) | 0, l: Number(s & f0) | 0 };
}
function Dt(s, x = !1) {
  let o = new Uint32Array(s.length), y = new Uint32Array(s.length);
  for (let _ = 0; _ < s.length; _++) {
    const { h: Z, l: N } = k0(s[_], x);
    [o[_], y[_]] = [Z, N];
  }
  return [o, y];
}
const zt = (s, x) => BigInt(s >>> 0) << S0 | BigInt(x >>> 0), Ht = (s, x, o) => s >>> o, Ft = (s, x, o) => s << 32 - o | x >>> o, $t = (s, x, o) => s >>> o | x << 32 - o, Kt = (s, x, o) => s << 32 - o | x >>> o, Gt = (s, x, o) => s << 64 - o | x >>> o - 32, Xt = (s, x, o) => s >>> o - 32 | x << 64 - o, Zt = (s, x) => x, qt = (s, x) => s, Wt = (s, x, o) => s << o | x >>> 32 - o, Vt = (s, x, o) => x << o | s >>> 32 - o, Jt = (s, x, o) => x << o - 32 | s >>> 64 - o, Qt = (s, x, o) => s << o - 32 | x >>> 64 - o;
function mt(s, x, o, y) {
  const _ = (x >>> 0) + (y >>> 0);
  return { h: s + o + (_ / 2 ** 32 | 0) | 0, l: _ | 0 };
}
const kt = (s, x, o) => (s >>> 0) + (x >>> 0) + (o >>> 0), fr = (s, x, o, y) => x + o + y + (s / 2 ** 32 | 0) | 0, tr = (s, x, o, y) => (s >>> 0) + (x >>> 0) + (o >>> 0) + (y >>> 0), rr = (s, x, o, y, _) => x + o + y + _ + (s / 2 ** 32 | 0) | 0, er = (s, x, o, y, _) => (s >>> 0) + (x >>> 0) + (o >>> 0) + (y >>> 0) + (_ >>> 0), nr = (s, x, o, y, _, Z) => x + o + y + _ + Z + (s / 2 ** 32 | 0) | 0, gf = {
  fromBig: k0,
  split: Dt,
  toBig: zt,
  shrSH: Ht,
  shrSL: Ft,
  rotrSH: $t,
  rotrSL: Kt,
  rotrBH: Gt,
  rotrBL: Xt,
  rotr32H: Zt,
  rotr32L: qt,
  rotlSH: Wt,
  rotlSL: Vt,
  rotlBH: Jt,
  rotlBL: Qt,
  add: mt,
  add3L: kt,
  add3H: fr,
  add4L: tr,
  add4H: rr,
  add5H: nr,
  add5L: er
}, uf = new Uint32Array([
  4089235720,
  1779033703,
  2227873595,
  3144134277,
  4271175723,
  1013904242,
  1595750129,
  2773480762,
  2917565137,
  1359893119,
  725511199,
  2600822924,
  4215389547,
  528734635,
  327033209,
  1541459225
]), A = new Uint32Array(32);
function jf(s, x, o, y, _, Z) {
  const N = _[Z], K = _[Z + 1];
  let ff = A[2 * s], hf = A[2 * s + 1], tf = A[2 * x], ef = A[2 * x + 1], lf = A[2 * o], vf = A[2 * o + 1], nf = A[2 * y], rf = A[2 * y + 1], _f = gf.add3L(ff, tf, N);
  hf = gf.add3H(_f, hf, ef, K), ff = _f | 0, { Dh: rf, Dl: nf } = { Dh: rf ^ hf, Dl: nf ^ ff }, { Dh: rf, Dl: nf } = { Dh: gf.rotr32H(rf, nf), Dl: gf.rotr32L(rf, nf) }, { h: vf, l: lf } = gf.add(vf, lf, rf, nf), { Bh: ef, Bl: tf } = { Bh: ef ^ vf, Bl: tf ^ lf }, { Bh: ef, Bl: tf } = { Bh: gf.rotrSH(ef, tf, 24), Bl: gf.rotrSL(ef, tf, 24) }, A[2 * s] = ff, A[2 * s + 1] = hf, A[2 * x] = tf, A[2 * x + 1] = ef, A[2 * o] = lf, A[2 * o + 1] = vf, A[2 * y] = nf, A[2 * y + 1] = rf;
}
function Tf(s, x, o, y, _, Z) {
  const N = _[Z], K = _[Z + 1];
  let ff = A[2 * s], hf = A[2 * s + 1], tf = A[2 * x], ef = A[2 * x + 1], lf = A[2 * o], vf = A[2 * o + 1], nf = A[2 * y], rf = A[2 * y + 1], _f = gf.add3L(ff, tf, N);
  hf = gf.add3H(_f, hf, ef, K), ff = _f | 0, { Dh: rf, Dl: nf } = { Dh: rf ^ hf, Dl: nf ^ ff }, { Dh: rf, Dl: nf } = { Dh: gf.rotrSH(rf, nf, 16), Dl: gf.rotrSL(rf, nf, 16) }, { h: vf, l: lf } = gf.add(vf, lf, rf, nf), { Bh: ef, Bl: tf } = { Bh: ef ^ vf, Bl: tf ^ lf }, { Bh: ef, Bl: tf } = { Bh: gf.rotrBH(ef, tf, 63), Bl: gf.rotrBL(ef, tf, 63) }, A[2 * s] = ff, A[2 * s + 1] = hf, A[2 * x] = tf, A[2 * x + 1] = ef, A[2 * o] = lf, A[2 * o + 1] = vf, A[2 * y] = nf, A[2 * y + 1] = rf;
}
class xr extends Pt {
  constructor(x = {}) {
    super(128, x.dkLen === void 0 ? 64 : x.dkLen, x, 64, 16, 16), this.v0l = uf[0] | 0, this.v0h = uf[1] | 0, this.v1l = uf[2] | 0, this.v1h = uf[3] | 0, this.v2l = uf[4] | 0, this.v2h = uf[5] | 0, this.v3l = uf[6] | 0, this.v3h = uf[7] | 0, this.v4l = uf[8] | 0, this.v4h = uf[9] | 0, this.v5l = uf[10] | 0, this.v5h = uf[11] | 0, this.v6l = uf[12] | 0, this.v6h = uf[13] | 0, this.v7l = uf[14] | 0, this.v7h = uf[15] | 0;
    const o = x.key ? x.key.length : 0;
    if (this.v0l ^= this.outputLen | o << 8 | 1 << 16 | 1 << 24, x.salt) {
      const y = t0(Ff(x.salt));
      this.v4l ^= y[0], this.v4h ^= y[1], this.v5l ^= y[2], this.v5h ^= y[3];
    }
    if (x.personalization) {
      const y = t0(Ff(x.personalization));
      this.v6l ^= y[0], this.v6h ^= y[1], this.v7l ^= y[2], this.v7h ^= y[3];
    }
    if (x.key) {
      const y = new Uint8Array(this.blockLen);
      y.set(Ff(x.key)), this.update(y);
    }
  }
  get() {
    let { v0l: x, v0h: o, v1l: y, v1h: _, v2l: Z, v2h: N, v3l: K, v3h: ff, v4l: hf, v4h: tf, v5l: ef, v5h: lf, v6l: vf, v6h: nf, v7l: rf, v7h: _f } = this;
    return [x, o, y, _, Z, N, K, ff, hf, tf, ef, lf, vf, nf, rf, _f];
  }
  set(x, o, y, _, Z, N, K, ff, hf, tf, ef, lf, vf, nf, rf, _f) {
    this.v0l = x | 0, this.v0h = o | 0, this.v1l = y | 0, this.v1h = _ | 0, this.v2l = Z | 0, this.v2h = N | 0, this.v3l = K | 0, this.v3h = ff | 0, this.v4l = hf | 0, this.v4h = tf | 0, this.v5l = ef | 0, this.v5h = lf | 0, this.v6l = vf | 0, this.v6h = nf | 0, this.v7l = rf | 0, this.v7h = _f | 0;
  }
  compress(x, o, y) {
    this.get().forEach((ff, hf) => A[hf] = ff), A.set(uf, 16);
    let { h: _, l: Z } = gf.fromBig(BigInt(this.length));
    A[24] = uf[8] ^ Z, A[25] = uf[9] ^ _, y && (A[28] = ~A[28], A[29] = ~A[29]);
    let N = 0;
    const K = Rt;
    for (let ff = 0; ff < 12; ff++)
      jf(0, 4, 8, 12, x, o + 2 * K[N++]), Tf(0, 4, 8, 12, x, o + 2 * K[N++]), jf(1, 5, 9, 13, x, o + 2 * K[N++]), Tf(1, 5, 9, 13, x, o + 2 * K[N++]), jf(2, 6, 10, 14, x, o + 2 * K[N++]), Tf(2, 6, 10, 14, x, o + 2 * K[N++]), jf(3, 7, 11, 15, x, o + 2 * K[N++]), Tf(3, 7, 11, 15, x, o + 2 * K[N++]), jf(0, 5, 10, 15, x, o + 2 * K[N++]), Tf(0, 5, 10, 15, x, o + 2 * K[N++]), jf(1, 6, 11, 12, x, o + 2 * K[N++]), Tf(1, 6, 11, 12, x, o + 2 * K[N++]), jf(2, 7, 8, 13, x, o + 2 * K[N++]), Tf(2, 7, 8, 13, x, o + 2 * K[N++]), jf(3, 4, 9, 14, x, o + 2 * K[N++]), Tf(3, 4, 9, 14, x, o + 2 * K[N++]);
    this.v0l ^= A[0] ^ A[16], this.v0h ^= A[1] ^ A[17], this.v1l ^= A[2] ^ A[18], this.v1h ^= A[3] ^ A[19], this.v2l ^= A[4] ^ A[20], this.v2h ^= A[5] ^ A[21], this.v3l ^= A[6] ^ A[22], this.v3h ^= A[7] ^ A[23], this.v4l ^= A[8] ^ A[24], this.v4h ^= A[9] ^ A[25], this.v5l ^= A[10] ^ A[26], this.v5h ^= A[11] ^ A[27], this.v6l ^= A[12] ^ A[28], this.v6h ^= A[13] ^ A[29], this.v7l ^= A[14] ^ A[30], this.v7h ^= A[15] ^ A[31], A.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer32.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
const ir = Yt((s) => new xr(s));
function br(s) {
  const x = dt(s.signature), o = yt(
    vt.PersonalMessage,
    gt(s.messageBytes)
  );
  return Q0.exports.sign.detached.verify(
    ir(o, { dkLen: 32 }),
    x.signature,
    x.pubKey.toBytes()
  );
}
export {
  ar as Account,
  cr as Provider,
  hr as SUI_SYSTEM_STATE_OBJECT_ID,
  lr as addressEllipsis,
  W0 as formatCurrency,
  ur as formatSUI,
  br as verifySignedMessage
};
