// Hardcoded module "node:dns"
// only resolve4, resolve, lookup, resolve6, resolveSrv, and reverse are implemented.
const dns = Bun.dns;
const utilPromisifyCustomSymbol = Symbol.for("nodejs.util.promisify.custom");

function getServers() {
  return dns.getServers();
}

function lookup(domain, options, callback) {
  if (typeof options == "function") {
    callback = options;
  }

  if (typeof callback != "function") {
    throw new TypeError("callback must be a function");
  }

  if (typeof options == "number") {
    options = { family: options };
  }

  if (domain !== domain || (typeof domain !== "number" && !domain)) {
    console.warn(
      `DeprecationWarning: The provided hostname "${String(
        domain,
      )}" is not a valid hostname, and is supported in the dns module solely for compatibility.`,
    );
    callback(null, null, 4);
    return;
  }

  dns.lookup(domain, options).then(res => {
    res.sort((a, b) => a.family - b.family);

    if (options?.all) {
      callback(null, res.map(mapLookupAll));
    } else {
      const [{ address, family }] = res;
      callback(null, address, family);
    }
  }, callback);
}

function lookupService(address, port, callback) {
  if (typeof callback != "function") {
    throw new TypeError("callback must be a function");
  }

  dns.lookupService(address, port, callback).then(
    results => {
      callback(null, ...results);
    },
    error => {
      callback(error);
    },
  );
}

var InternalResolver = class Resolver {
  constructor(options) {}

  cancel() {}

  getServers() {
    return [];
  }

  resolve(hostname, rrtype, callback) {
    if (typeof rrtype == "function") {
      callback = rrtype;
      rrtype = null;
    }

    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.resolve(hostname).then(
      results => {
        switch (rrtype?.toLowerCase()) {
          case "a":
          case "aaaa":
            callback(null, hostname, results.map(mapResolveX));
            break;
          default:
            callback(null, results);
            break;
        }
      },
      error => {
        callback(error);
      },
    );
  }

  resolve4(hostname, options, callback) {
    if (typeof options == "function") {
      callback = options;
      options = null;
    }

    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.lookup(hostname, { family: 4 }).then(
      addresses => {
        callback(null, options?.ttl ? addresses : addresses.map(mapResolveX));
      },
      error => {
        callback(error);
      },
    );
  }

  resolve6(hostname, options, callback) {
    if (typeof options == "function") {
      callback = options;
      options = null;
    }

    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.lookup(hostname, { family: 6 }).then(
      addresses => {
        callback(null, options?.ttl ? addresses : addresses.map(({ address }) => address));
      },
      error => {
        callback(error);
      },
    );
  }

  resolveAny(hostname, callback) {
    callback(null, []);
  }

  resolveCname(hostname, callback) {
    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.resolveCname(hostname, callback).then(
      results => {
        callback(null, results);
      },
      error => {
        callback(error);
      },
    );
  }

  resolveMx(hostname, callback) {
    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.resolveMx(hostname, callback).then(
      results => {
        callback(null, results);
      },
      error => {
        callback(error);
      },
    );
  }

  resolveNaptr(hostname, callback) {
    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.resolveNaptr(hostname, callback).then(
      results => {
        callback(null, results);
      },
      error => {
        callback(error);
      },
    );
  }

  resolveNs(hostname, callback) {
    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.resolveNs(hostname, callback).then(
      results => {
        callback(null, results);
      },
      error => {
        callback(error);
      },
    );
  }

  resolvePtr(hostname, callback) {
    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.resolvePtr(hostname, callback).then(
      results => {
        callback(null, results);
      },
      error => {
        callback(error);
      },
    );
  }

  resolveSrv(hostname, callback) {
    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.resolveSrv(hostname, callback).then(
      results => {
        callback(null, results);
      },
      error => {
        callback(error);
      },
    );
  }

  resolveCaa(hostname, callback) {
    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.resolveCaa(hostname, callback).then(
      results => {
        callback(null, results);
      },
      error => {
        callback(error);
      },
    );
  }

  resolveTxt(hostname, callback) {
    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.resolveTxt(hostname, callback).then(
      results => {
        callback(null, results);
      },
      error => {
        callback(error);
      },
    );
  }
  resolveSoa(hostname, callback) {
    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.resolveSoa(hostname, callback).then(
      results => {
        callback(null, results);
      },
      error => {
        callback(error);
      },
    );
  }

  reverse(ip, callback) {
    if (typeof callback != "function") {
      throw new TypeError("callback must be a function");
    }

    dns.reverse(ip, callback).then(
      results => {
        callback(null, results);
      },
      error => {
        callback(error);
      },
    );
  }

  setServers(servers) {}
};

function Resolver(options) {
  return new InternalResolver(options);
}
Resolver.prototype = {};
Object.setPrototypeOf(Resolver.prototype, InternalResolver.prototype);
Object.setPrototypeOf(Resolver, InternalResolver);

var {
  resolve,
  resolve4,
  resolve6,
  resolveAny,
  resolveCname,
  resolveCaa,
  resolveMx,
  resolveNaptr,
  resolveNs,
  resolvePtr,
  resolveSoa,
  resolveSrv,
  reverse,
  resolveTxt,
} = InternalResolver.prototype;

function setDefaultResultOrder() {}
function setServers() {}

const promisifyLookup = res => {
  res.sort((a, b) => a.family - b.family);
  const [{ address, family }] = res;
  return { address, family };
};

const mapLookupAll = res => {
  const { address, family } = res;
  return { address, family };
};

const promisifyLookupAll = res => {
  res.sort((a, b) => a.family - b.family);
  return res.map(mapLookupAll);
};

const mapResolveX = a => a.address;

const promisifyResolveX = res => {
  return res?.map(mapResolveX);
};

// promisified versions
const promises = {
  lookup(domain, options) {
    if (options?.all) {
      return dns.lookup(domain, options).then(promisifyLookupAll);
    }
    return dns.lookup(domain, options).then(promisifyLookup);
  },

  lookupService(address, port) {
    return dns.lookupService(address, port);
  },

  resolve(hostname, rrtype) {
    if (typeof rrtype !== "string") {
      rrtype = null;
    }
    switch (rrtype?.toLowerCase()) {
      case "a":
      case "aaaa":
        return dns.resolve(hostname, rrtype).then(promisifyLookup);
      default:
        return dns.resolve(hostname, rrtype);
    }
  },

  resolve4(hostname, options) {
    if (options?.ttl) {
      return dns.lookup(hostname, { family: 4 });
    }
    return dns.lookup(hostname, { family: 4 }).then(promisifyResolveX);
  },

  resolve6(hostname, options) {
    if (options?.ttl) {
      return dns.lookup(hostname, { family: 6 });
    }
    return dns.lookup(hostname, { family: 6 }).then(promisifyResolveX);
  },

  resolveSrv(hostname) {
    return dns.resolveSrv(hostname);
  },
  resolveTxt(hostname) {
    return dns.resolveTxt(hostname);
  },
  resolveSoa(hostname) {
    return dns.resolveSoa(hostname);
  },
  resolveNaptr(hostname) {
    return dns.resolveNaptr(hostname);
  },

  resolveMx(hostname) {
    return dns.resolveMx(hostname);
  },
  resolveCaa(hostname) {
    return dns.resolveCaa(hostname);
  },
  resolveNs(hostname) {
    return dns.resolveNs(hostname);
  },
  resolvePtr(hostname) {
    return dns.resolvePtr(hostname);
  },
  resolveCname(hostname) {
    return dns.resolveCname(hostname);
  },
  reverse(ip) {
    return dns.reverse(ip);
  },

  Resolver: class Resolver {
    constructor(options) {}

    cancel() {}

    getServers() {
      return [];
    }

    resolve(hostname, rrtype) {
      if (typeof rrtype !== "string") {
        rrtype = null;
      }
      switch (rrtype?.toLowerCase()) {
        case "a":
        case "aaaa":
          return dns.resolve(hostname, rrtype).then(promisifyLookup);
        default:
          return dns.resolve(hostname, rrtype);
      }
    }

    resolve4(hostname, options) {
      if (options?.ttl) {
        return dns.lookup(hostname, { family: 4 });
      }
      return dns.lookup(hostname, { family: 4 }).then(promisifyResolveX);
    }

    resolve6(hostname, options) {
      if (options?.ttl) {
        return dns.lookup(hostname, { family: 6 });
      }
      return dns.lookup(hostname, { family: 6 }).then(promisifyResolveX);
    }

    resolveAny(hostname) {
      return Promise.resolve([]);
    }

    resolveCname(hostname) {
      return dns.resolveCname(hostname);
    }

    resolveMx(hostname) {
      return dns.resolveMx(hostname);
    }

    resolveNaptr(hostname) {
      return dns.resolveNaptr(hostname);
    }

    resolveNs(hostname) {
      return dns.resolveNs(hostname);
    }

    resolvePtr(hostname) {
      return dns.resolvePtr(hostname);
    }

    resolveSoa(hostname) {
      return dns.resolveSoa(hostname);
    }

    resolveSrv(hostname) {
      return dns.resolveSrv(hostname);
    }

    resolveCaa(hostname) {
      return dns.resolveCaa(hostname);
    }

    resolveTxt(hostname) {
      return dns.resolveTxt(hostname);
    }

    reverse(ip) {
      return dns.reverse(ip);
    }

    setServers(servers) {}
  },
};
for (const key of ["resolveAny"]) {
  promises[key] = () => Promise.resolve(undefined);
}

// Compatibility with util.promisify(dns[method])
for (const [method, pMethod] of [
  [lookup, promises.lookup],
  [lookupService, promises.lookupService],
  [resolve, promises.resolve],
  [reverse, promises.reverse],
  [resolve4, promises.resolve4],
  [resolve6, promises.resolve6],
  [resolveAny, promises.resolveAny],
  [resolveCname, promises.resolveCname],
  [resolveCaa, promises.resolveCaa],
  [resolveMx, promises.resolveMx],
  [resolveNs, promises.resolveNs],
  [resolvePtr, promises.resolvePtr],
  [resolveSoa, promises.resolveSoa],
  [resolveSrv, promises.resolveSrv],
  [resolveTxt, promises.resolveTxt],
  [resolveNaptr, promises.resolveNaptr],
]) {
  method[utilPromisifyCustomSymbol] = pMethod;
}

export default {
  // these are wrong
  ADDRCONFIG: 0,
  ALL: 1,
  V4MAPPED: 2,

  // ERROR CODES
  NODATA: "DNS_ENODATA",
  FORMERR: "DNS_EFORMERR",
  SERVFAIL: "DNS_ESERVFAIL",
  NOTFOUND: "DNS_ENOTFOUND",
  NOTIMP: "DNS_ENOTIMP",
  REFUSED: "DNS_EREFUSED",
  BADQUERY: "DNS_EBADQUERY",
  BADNAME: "DNS_EBADNAME",
  BADFAMILY: "DNS_EBADFAMILY",
  BADRESP: "DNS_EBADRESP",
  CONNREFUSED: "DNS_ECONNREFUSED",
  TIMEOUT: "DNS_ETIMEOUT",
  EOF: "DNS_EEOF",
  FILE: "DNS_EFILE",
  NOMEM: "DNS_ENOMEM",
  DESTRUCTION: "DNS_EDESTRUCTION",
  BADSTR: "DNS_EBADSTR",
  BADFLAGS: "DNS_EBADFLAGS",
  NONAME: "DNS_ENONAME",
  BADHINTS: "DNS_EBADHINTS",
  NOTINITIALIZED: "DNS_ENOTINITIALIZED",
  LOADIPHLPAPI: "DNS_ELOADIPHLPAPI",
  ADDRGETNETWORKPARAMS: "DNS_EADDRGETNETWORKPARAMS",
  CANCELLED: "DNS_ECANCELLED",

  lookup,
  lookupService,
  Resolver,
  setServers,
  setDefaultResultOrder,
  resolve,
  reverse,
  resolve4,
  resolve6,
  resolveAny,
  resolveCname,
  resolveCaa,
  resolveMx,
  resolveNs,
  resolvePtr,
  resolveSoa,
  resolveSrv,
  resolveTxt,
  resolveNaptr,
  promises,
  getServers,
};
