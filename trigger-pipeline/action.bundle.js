'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var os = _interopDefault(require('os'));
var path = _interopDefault(require('path'));
var http = _interopDefault(require('http'));
var https = _interopDefault(require('https'));
var url = _interopDefault(require('url'));
var net = _interopDefault(require('net'));
var tls = _interopDefault(require('tls'));
var util = _interopDefault(require('util'));
var events = _interopDefault(require('events'));
var tty = _interopDefault(require('tty'));

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var command = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Commands
 *
 * Command Format:
 *   ##[name key=value;key=value]message
 *
 * Examples:
 *   ##[warning]This is the user warning message
 *   ##[set-secret name=mypassword]definatelyNotAPassword!
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message) {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_PREFIX = '##[';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_PREFIX + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        // safely append the val - avoid blowing up when attempting to
                        // call .replace() if message is not a string for some reason
                        cmdStr += `${key}=${escape(`${val || ''}`)};`;
                    }
                }
            }
        }
        cmdStr += ']';
        // safely append the message - avoid blowing up when attempting to
        // call .replace() if message is not a string for some reason
        const message = `${this.message || ''}`;
        cmdStr += escapeData(message);
        return cmdStr;
    }
}
function escapeData(s) {
    return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}
function escape(s) {
    return s
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/]/g, '%5D')
        .replace(/;/g, '%3B');
}

});

unwrapExports(command);
var command_1 = command.issueCommand;
var command_2 = command.issue;

var core = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * exports the variable and registers a secret which will get masked from logs
 * @param name the name of the variable to set
 * @param val value of the secret
 */
function exportSecret(name, val) {
    exportVariable(name, val);
    command.issueCommand('set-secret', {}, val);
}
exports.exportSecret = exportSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(' ', '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command.issue('warning', message);
}
exports.warning = warning;

});

unwrapExports(core);
var core_1 = core.ExitCode;
var core_2 = core.exportVariable;
var core_3 = core.exportSecret;
var core_4 = core.addPath;
var core_5 = core.getInput;
var core_6 = core.setOutput;
var core_7 = core.setFailed;
var core_8 = core.debug;
var core_9 = core.error;
var core_10 = core.warning;

var isObj = value => {
	const type = typeof value;
	return value !== null && (type === 'object' || type === 'function');
};

function getPathSegments(path) {
	const pathArray = path.split('.');
	const parts = [];

	for (let i = 0; i < pathArray.length; i++) {
		let p = pathArray[i];

		while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
			p = p.slice(0, -1) + '.';
			p += pathArray[++i];
		}

		parts.push(p);
	}

	return parts;
}

var dotProp = {
	get(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return value === undefined ? object : value;
		}

		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			if (!Object.prototype.propertyIsEnumerable.call(object, pathArray[i])) {
				return value;
			}

			object = object[pathArray[i]];

			if (object === undefined || object === null) {
				// `object` is either `undefined` or `null` so we want to stop the loop, and
				// if this is not the last bit of the path, and
				// if it did't return `undefined`
				// it would return `null` if `object` is `null`
				// but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
				if (i !== pathArray.length - 1) {
					return value;
				}

				break;
			}
		}

		return object;
	},

	set(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return object;
		}

		const root = object;
		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (!isObj(object[p])) {
				object[p] = {};
			}

			if (i === pathArray.length - 1) {
				object[p] = value;
			}

			object = object[p];
		}

		return root;
	},

	delete(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return;
		}

		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (i === pathArray.length - 1) {
				delete object[p];
				return;
			}

			object = object[p];

			if (!isObj(object)) {
				return;
			}
		}
	},

	has(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return false;
		}

		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			if (isObj(object)) {
				if (!(pathArray[i] in object)) {
					return false;
				}

				object = object[pathArray[i]];
			} else {
				return false;
			}
		}

		return true;
	}
};

function isObject (x) {
  return typeof x === 'object' && x.constructor === Object
}

var deepExtend = function deepExtend (x, y) {
  var keys = Object.keys(y);

  for (var n = 0; n < keys.length; n++) {
    var key = keys[n];
    var yValue = y[key];
    var xValue = x[key];

    if (x.hasOwnProperty(key) && isObject(xValue) && isObject(yValue)) {
      var r = {};
      deepExtend(r, xValue);
      deepExtend(r, yValue);
      x[key] = r;
    } else {
      x[key] = yValue;
    }
  }

  return x
};

// from https://gist.github.com/Yaffle/1088850

var parseUri = function parseURI (url) {
  var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:/?#]+:)?(\/\/(?:([^:@/]*(?::[^:@/]*)?)@)?(([^:/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
  return (m ? {
    href: m[0] || '',
    protocol: m[1] || '',
    authority: m[2] || '',
    auth: decodeURIComponent(m[3] || ''),
    host: m[4] || '',
    hostname: m[5] || '',
    port: m[6] || '',
    pathname: m[7] || '',
    search: m[8] || '',
    hash: m[9] || ''
  } : null)
};

// from https://gist.github.com/Yaffle/1088850



var resolveUrl = function (base, href) { // RFC 3986
  function removeDotSegments (input) {
    var output = [];
    input.replace(/^(\.\.?(\/|$))+/, '')
      .replace(/\/(\.(\/|$))+/g, '/')
      .replace(/\/\.\.$/, '/../')
      .replace(/\/?[^/]*/g, function (p) {
        if (p === '/..') {
          output.pop();
        } else {
          output.push(p);
        }
      });
    return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '')
  }

  href = parseUri(href || '');
  base = parseUri(base || '');

  return !href || !base ? null : (href.protocol || base.protocol) +
         (href.protocol || href.authority ? href.authority : base.authority) +
         removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname)) +
         (href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) +
         href.hash
};

function client (url, options, middleware) {
  var args = parseClientArguments(url, options, middleware);
  return new Httpism(args.url, args.options || {}, args.middleware)
}

function Httpism (url, options, middleware) {
  this.url = url;
  this._options = options;
  this.middleware = middleware;
}

Httpism.prototype.send = function (method, url, body, _options) {
  console.warn('httpism.send() is deprecated please use httpism.request()');
  return this.request.apply(this, arguments)
};

Httpism.prototype.request = function (method, url, body, _options) {
  var request;

  if (method instanceof Object) {
    request = method;
  } else {
    var options = mergeClientOptions(this._options, _options);
    request = {
      method: method,
      url: resolveUrl(this.url, url),
      headers: lowerCaseHeaders(options.headers || {}),
      body: body,
      options: options
    };
  }

  var self = this;

  function sendToMiddleware (index, req) {
    if (index < self.middleware.length) {
      var middleware = self.middleware[index];
      return middleware(req, function (nextRequest) { return sendToMiddleware(index + 1, nextRequest || req) }, self)
    }
  }

  return sendToMiddleware(0, request).then(function (response) {
    if (request.options.response === true) {
      return response
    } else {
      responseCompatibility(response);
      return response.body
    }
  }, function (e) {
    if (e.isRedirectResponse) {
      return e.redirectResponse
    } else {
      throw e
    }
  })
};

function responseCompatibility (response) {
  function responseWarning () {
    console.warn('httpism >= 3.0.0 returns the response body by default, please pass the {response: true} option if you want the whole response');
  }

  if (response.body instanceof Object && !Object.isFrozen(response.body)) {
    if (!response.body.hasOwnProperty('body')) {
      Object.defineProperty(response.body, 'body', {
        get: function () {
          responseWarning();
          return this
        }
      });
    }

    if (!response.body.hasOwnProperty('url')) {
      Object.defineProperty(response.body, 'url', {
        get: function () {
          responseWarning();
          return response.url
        }
      });
    }

    if (!response.body.hasOwnProperty('statusCode')) {
      Object.defineProperty(response.body, 'statusCode', {
        get: function () {
          responseWarning();
          return response.statusCode
        }
      });
    }

    if (!response.body.hasOwnProperty('headers')) {
      Object.defineProperty(response.body, 'headers', {
        get: function () {
          responseWarning();
          return response.headers
        }
      });
    }
  }
}

function lowerCaseHeaders (headers) {
  Object.keys(headers).forEach(function (key) {
    var lower = key.toLowerCase();
    if (key.toLowerCase() !== key) {
      headers[lower] = headers[key];
      delete headers[key];
    }
  });

  return headers
}

function findMiddlewareIndexes (names, middleware) {
  return names.map(function (name) {
    for (var n = 0; n < middleware.length; n++) {
      var m = middleware[n];
      if (m.httpismMiddleware && m.httpismMiddleware.name === name) {
        return n
      }
    }

    return -1
  }).filter(function (i) {
    return i >= 0
  })
}

function insertMiddlewareIntoIndex (middleware, m, index) {
  middleware.splice(index, 0, m);
}

Httpism.prototype.client = function (url, options, middleware) {
  var args = parseClientArguments(url, options, middleware);

  var client = new Httpism(
    resolveUrl(this.url, args.url),
    mergeClientOptions(this._options, args.options),
    this.middleware.slice()
  );

  if (args.middleware) {
    args.middleware.forEach(function (m) {
      client.use(m);
    });
  }

  return client
};

Httpism.prototype.api = function (url, options, middleware) {
  console.warn('httpism >= 3.0.0 renamed httpism.api() to httpism.client(), please update your usage');
  return this.client(url, options, middleware)
};

Httpism.prototype.insertMiddleware = function (m) {
  console.warn('httpism >= 3.0.0 renamed httpism.insertMiddleware() to httpism.use(), please update your usage');
  return this.use(m)
};

Httpism.prototype.use = function (m) {
  var meta = m.httpismMiddleware;

  if (meta && (meta.before || meta.after)) {
    var position = meta.before || meta.after;
    var names = typeof position === 'string' ? [position] : position;
    var indexes = findMiddlewareIndexes(names, this.middleware);
    if (indexes.length) {
      var index = meta.before ? Math.min.apply(Math, indexes) : Math.max.apply(Math, indexes) + 1;

      if (index >= 0) {
        insertMiddlewareIntoIndex(this.middleware, m, index);
        return
      }
    }

    throw new Error('no such middleware: ' + (meta.before || meta.after))
  } else {
    this.middleware.unshift(m);
  }
};

Httpism.prototype.removeMiddleware = function (name) {
  console.warn('httpism.removeMiddleware() is deprecated please use httpism.remove()');
  this.remove(name);
};

Httpism.prototype.remove = function (name) {
  var indexes = findMiddlewareIndexes([name], this.middleware);
  for (var i = indexes.length - 1; i >= 0; i--) {
    this.middleware.splice(indexes[i], 1);
  }
};

function addMethod (method) {
  Httpism.prototype[method] = function (url, options) {
    return this.request(method, url, undefined, options)
  };
}

function addMethodWithBody (method) {
  Httpism.prototype[method] = function (url, body, options) {
    return this.request(method, url, body, options)
  };
}

addMethod('get');
addMethod('delete');
addMethod('head');
addMethodWithBody('post');
addMethodWithBody('put');
addMethodWithBody('patch');
addMethodWithBody('options');

function parseClientArguments () {
  var url, options, middleware;

  for (var n = 0; n < arguments.length; n++) {
    var arg = arguments[n];

    if (typeof arg === 'string') {
      url = arg;
    } else if (typeof arg === 'function') {
      middleware = [arg];
    } else if (arg instanceof Array) {
      middleware = arg;
    } else if (arg instanceof Object) {
      options = arg;
    }
  }

  return {
    url: url,
    options: options,
    middleware: middleware
  }
}

function mergeClientOptions (x, y) {
  var r = {};
  deepExtend(r, x || {});
  deepExtend(r, y || {});
  return r
}

var client_1 = client;

var middleware = function (name, fn) {
  fn.httpismMiddleware = {
    name: name
  };
  return fn
};

var parseUrl = url.parse;

var DEFAULT_PORTS = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443,
};

var stringEndsWith = String.prototype.endsWith || function(s) {
  return s.length <= this.length &&
    this.indexOf(s, this.length - s.length) !== -1;
};

/**
 * @param {string|object} url - The URL, or the result from url.parse.
 * @return {string} The URL of the proxy that should handle the request to the
 *  given URL. If no proxy is set, this will be an empty string.
 */
function getProxyForUrl(url) {
  var parsedUrl = typeof url === 'string' ? parseUrl(url) : url || {};
  var proto = parsedUrl.protocol;
  var hostname = parsedUrl.host;
  var port = parsedUrl.port;
  if (typeof hostname !== 'string' || !hostname || typeof proto !== 'string') {
    return '';  // Don't proxy URLs without a valid scheme or host.
  }

  proto = proto.split(':', 1)[0];
  // Stripping ports in this way instead of using parsedUrl.hostname to make
  // sure that the brackets around IPv6 addresses are kept.
  hostname = hostname.replace(/:\d*$/, '');
  port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
  if (!shouldProxy(hostname, port)) {
    return '';  // Don't proxy URLs that match NO_PROXY.
  }

  var proxy = getEnv(proto + '_proxy') || getEnv('all_proxy');
  if (proxy && proxy.indexOf('://') === -1) {
    // Missing scheme in proxy, default to the requested URL's scheme.
    proxy = proto + '://' + proxy;
  }
  return proxy;
}

/**
 * Determines whether a given URL should be proxied.
 *
 * @param {string} hostname - The host name of the URL.
 * @param {number} port - The effective port of the URL.
 * @returns {boolean} Whether the given URL should be proxied.
 * @private
 */
function shouldProxy(hostname, port) {
  var NO_PROXY = getEnv('no_proxy').toLowerCase();
  if (!NO_PROXY) {
    return true;  // Always proxy if NO_PROXY is not set.
  }
  if (NO_PROXY === '*') {
    return false;  // Never proxy if wildcard is set.
  }

  return NO_PROXY.split(/[,\s]/).every(function(proxy) {
    if (!proxy) {
      return true;  // Skip zero-length hosts.
    }
    var parsedProxy = proxy.match(/^(.+):(\d+)$/);
    var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
    var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
    if (parsedProxyPort && parsedProxyPort !== port) {
      return true;  // Skip if ports don't match.
    }

    if (!/^[.*]/.test(parsedProxyHostname)) {
      // No wildcards, so stop proxying if there is an exact match.
      return hostname !== parsedProxyHostname;
    }

    if (parsedProxyHostname.charAt(0) === '*') {
      // Remove leading wildcard.
      parsedProxyHostname = parsedProxyHostname.slice(1);
    }
    // Stop proxying if the hostname ends with the no_proxy host.
    return !stringEndsWith.call(hostname, parsedProxyHostname);
  });
}

/**
 * Get the value for an environment variable.
 *
 * @param {string} key - The name of the environment variable.
 * @return {string} The value of the environment variable.
 * @private
 */
function getEnv(key) {
  return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || '';
}

var getProxyForUrl_1 = getProxyForUrl;

var proxyFromEnv = {
	getProxyForUrl: getProxyForUrl_1
};

var extend = function (object, extension) {
  var keys = Object.keys(extension);

  for (var n = 0; n < keys.length; n++) {
    var key = keys[n];
    object[key] = extension[key];
  }

  return object
};

var merge = function (x, y) {
  if (x && y) {
    var r = {};

    extend(r, y);
    extend(r, x);

    return r
  } else if (y) {
    return y
  } else {
    return x
  }
};

/**
 * This currently needs to be applied to all Node.js versions
 * in order to determine if the `req` is an HTTP or HTTPS request.
 *
 * There is currently no PR attempting to move this property upstream.
 */
const patchMarker = "__agent_base_https_request_patched__";
if (!https.request[patchMarker]) {
  https.request = (function(request) {
    return function(_options, cb) {
      let options;
      if (typeof _options === 'string') {
        options = url.parse(_options);
      } else {
        options = Object.assign({}, _options);
      }
      if (null == options.port) {
        options.port = 443;
      }
      options.secureEndpoint = true;
      return request.call(https, options, cb);
    };
  })(https.request);
  https.request[patchMarker] = true;
}

/**
 * This is needed for Node.js >= 9.0.0 to make sure `https.get()` uses the
 * patched `https.request()`.
 *
 * Ref: https://github.com/nodejs/node/commit/5118f31
 */
https.get = function (_url, _options, cb) {
    let options;
    if (typeof _url === 'string' && _options && typeof _options !== 'function') {
      options = Object.assign({}, url.parse(_url), _options);
    } else if (!_options && !cb) {
      options = _url;
    } else if (!cb) {
      options = _url;
      cb = _options;
    }

  const req = https.request(options, cb);
  req.end();
  return req;
};

var es6Promise = createCommonjsModule(function (module, exports) {
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

(function (global, factory) {
	 module.exports = factory() ;
}(commonjsGlobal, (function () {
function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    var then$$1 = void 0;
    try {
      then$$1 = value.then;
    } catch (error) {
      reject(promise, error);
      return;
    }
    handleMaybeThenable(promise, value, then$$1);
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = true;

  if (hasCallback) {
    try {
      value = callback(detail);
    } catch (e) {
      succeeded = false;
      error = e;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
  }

  if (promise._state !== PENDING) ; else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (succeeded === false) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = void 0;
      var error = void 0;
      var didError = false;
      try {
        _then = entry.then;
      } catch (e) {
        didError = true;
        error = e;
      }

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        if (didError) {
          reject(promise, error);
        } else {
          handleMaybeThenable(promise, entry, _then);
        }
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof commonjsGlobal !== 'undefined') {
    local = commonjsGlobal;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));




});

/* global self, window, module, global, require */
var promise = function () {

    var globalObject = void 0;

    function isFunction(x) {
        return typeof x === "function";
    }

    // Seek the global object
    if (commonjsGlobal !== undefined) {
        globalObject = commonjsGlobal;
    } else if (window !== undefined && window.document) {
        globalObject = window;
    } else {
        globalObject = self;
    }

    // Test for any native promise implementation, and if that
    // implementation appears to conform to the specificaton.
    // This code mostly nicked from the es6-promise module polyfill
    // and then fooled with.
    var hasPromiseSupport = function () {

        // No promise object at all, and it's a non-starter
        if (!globalObject.hasOwnProperty("Promise")) {
            return false;
        }

        // There is a Promise object. Does it conform to the spec?
        var P = globalObject.Promise;

        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        if (!P.hasOwnProperty("resolve") || !P.hasOwnProperty("reject")) {
            return false;
        }

        if (!P.hasOwnProperty("all") || !P.hasOwnProperty("race")) {
            return false;
        }

        // Older version of the spec had a resolver object
        // as the arg rather than a function
        return function () {

            var resolve = void 0;

            var p = new globalObject.Promise(function (r) {
                resolve = r;
            });

            if (p) {
                return isFunction(resolve);
            }

            return false;
        }();
    }();

    // Export the native Promise implementation if it
    // looks like it matches the spec
    if (hasPromiseSupport) {
        return globalObject.Promise;
    }

    //  Otherwise, return the es6-promise polyfill by @jaffathecake.
    return es6Promise.Promise;
}();

/* global module, require */
var promisify = function () {

    // Get a promise object. This may be native, or it may be polyfilled

    var ES6Promise = promise;

    /**
     * thatLooksLikeAPromiseToMe()
     *
     * Duck-types a promise.
     *
     * @param {object} o
     * @return {bool} True if this resembles a promise
     */
    function thatLooksLikeAPromiseToMe(o) {
        return o && typeof o.then === "function" && typeof o.catch === "function";
    }

    /**
     * promisify()
     *
     * Transforms callback-based function -- func(arg1, arg2 .. argN, callback) -- into
     * an ES6-compatible Promise. Promisify provides a default callback of the form (error, result)
     * and rejects when `error` is truthy. You can also supply settings object as the second argument.
     *
     * @param {function} original - The function to promisify
     * @param {object} settings - Settings object
     * @param {object} settings.thisArg - A `this` context to use. If not set, assume `settings` _is_ `thisArg`
     * @param {bool} settings.multiArgs - Should multiple arguments be returned as an array?
     * @return {function} A promisified version of `original`
     */
    return function promisify(original, settings) {

        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var returnMultipleArguments = settings && settings.multiArgs;

            var target = void 0;
            if (settings && settings.thisArg) {
                target = settings.thisArg;
            } else if (settings) {
                target = settings;
            }

            // Return the promisified function
            return new ES6Promise(function (resolve, reject) {

                // Append the callback bound to the context
                args.push(function callback(err) {

                    if (err) {
                        return reject(err);
                    }

                    for (var _len2 = arguments.length, values = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                        values[_key2 - 1] = arguments[_key2];
                    }

                    if (false === !!returnMultipleArguments) {
                        return resolve(values[0]);
                    }

                    resolve(values);
                });

                // Call the function
                var response = original.apply(target, args);

                // If it looks like original already returns a promise,
                // then just resolve with that promise. Hopefully, the callback function we added will just be ignored.
                if (thatLooksLikeAPromiseToMe(response)) {
                    resolve(response);
                }
            });
        };
    };
}();

const inherits = util.inherits;

const EventEmitter = events.EventEmitter;

var agentBase = Agent;

function isAgent(v) {
  return v && typeof v.addRequest === 'function';
}

/**
 * Base `http.Agent` implementation.
 * No pooling/keep-alive is implemented by default.
 *
 * @param {Function} callback
 * @api public
 */
function Agent(callback, _opts) {
  if (!(this instanceof Agent)) {
    return new Agent(callback, _opts);
  }

  EventEmitter.call(this);

  // The callback gets promisified if it has 3 parameters
  // (i.e. it has a callback function) lazily
  this._promisifiedCallback = false;

  let opts = _opts;
  if ('function' === typeof callback) {
    this.callback = callback;
  } else if (callback) {
    opts = callback;
  }

  // timeout for the socket to be returned from the callback
  this.timeout = (opts && opts.timeout) || null;

  this.options = opts;
}
inherits(Agent, EventEmitter);

/**
 * Override this function in your subclass!
 */
Agent.prototype.callback = function callback(req, opts) {
  throw new Error(
    '"agent-base" has no default implementation, you must subclass and override `callback()`'
  );
};

/**
 * Called by node-core's "_http_client.js" module when creating
 * a new HTTP request with this Agent instance.
 *
 * @api public
 */
Agent.prototype.addRequest = function addRequest(req, _opts) {
  const ownOpts = Object.assign({}, _opts);

  // Set default `host` for HTTP to localhost
  if (null == ownOpts.host) {
    ownOpts.host = 'localhost';
  }

  // Set default `port` for HTTP if none was explicitly specified
  if (null == ownOpts.port) {
    ownOpts.port = ownOpts.secureEndpoint ? 443 : 80;
  }

  const opts = Object.assign({}, this.options, ownOpts);

  if (opts.host && opts.path) {
    // If both a `host` and `path` are specified then it's most likely the
    // result of a `url.parse()` call... we need to remove the `path` portion so
    // that `net.connect()` doesn't attempt to open that as a unix socket file.
    delete opts.path;
  }

  delete opts.agent;
  delete opts.hostname;
  delete opts._defaultAgent;
  delete opts.defaultPort;
  delete opts.createConnection;

  // Hint to use "Connection: close"
  // XXX: non-documented `http` module API :(
  req._last = true;
  req.shouldKeepAlive = false;

  // Create the `stream.Duplex` instance
  let timeout;
  let timedOut = false;
  const timeoutMs = this.timeout;
  const freeSocket = this.freeSocket;

  function onerror(err) {
    if (req._hadError) return;
    req.emit('error', err);
    // For Safety. Some additional errors might fire later on
    // and we need to make sure we don't double-fire the error event.
    req._hadError = true;
  }

  function ontimeout() {
    timeout = null;
    timedOut = true;
    const err = new Error(
      'A "socket" was not created for HTTP request before ' + timeoutMs + 'ms'
    );
    err.code = 'ETIMEOUT';
    onerror(err);
  }

  function callbackError(err) {
    if (timedOut) return;
    if (timeout != null) {
      clearTimeout(timeout);
      timeout = null;
    }
    onerror(err);
  }

  function onsocket(socket) {
    if (timedOut) return;
    if (timeout != null) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (isAgent(socket)) {
      // `socket` is actually an http.Agent instance, so relinquish
      // responsibility for this `req` to the Agent from here on
      socket.addRequest(req, opts);
    } else if (socket) {
      function onfree() {
        freeSocket(socket, opts);
      }
      socket.on('free', onfree);
      req.onSocket(socket);
    } else {
      const err = new Error(
        'no Duplex stream was returned to agent-base for `' + req.method + ' ' + req.path + '`'
      );
      onerror(err);
    }
  }

  if (!this._promisifiedCallback && this.callback.length >= 3) {
    // Legacy callback function - convert to a Promise
    this.callback = promisify(this.callback, this);
    this._promisifiedCallback = true;
  }

  if (timeoutMs > 0) {
    timeout = setTimeout(ontimeout, timeoutMs);
  }

  try {
    Promise.resolve(this.callback(req, opts)).then(onsocket, callbackError);
  } catch (err) {
    Promise.reject(err).catch(callbackError);
  }
};

Agent.prototype.freeSocket = function freeSocket(socket, opts) {
  // TODO reuse sockets
  socket.destroy();
};

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = ms;
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * Active `debug` instances.
  */

  createDebug.instances = [];
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    var prevTime;

    function debug() {
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return match;
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend; // Debug.formatArgs = formatArgs;
    // debug.rawLog = rawLog;
    // env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    createDebug.instances.push(debug);
    return debug;
  }

  function destroy() {
    var index = createDebug.instances.indexOf(this);

    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }

    return false;
  }

  function extend(namespace, delimiter) {
    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < createDebug.instances.length; i++) {
      var instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }
  /**
  * Disable debug output.
  *
  * @api public
  */


  function disable() {
    createDebug.enable('');
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

var common = setup;

var browser = createCommonjsModule(function (module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log() {
  var _console;

  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = common(exports);
var formatters = module.exports.formatters;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};
});
var browser_1 = browser.log;
var browser_2 = browser.formatArgs;
var browser_3 = browser.save;
var browser_4 = browser.load;
var browser_5 = browser.useColors;
var browser_6 = browser.storage;
var browser_7 = browser.colors;

var hasFlag = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};

const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

var supportsColor_1 = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};

var node = createCommonjsModule(function (module, exports) {

/**
 * Module dependencies.
 */



/**
 * This is the Node.js implementation of `debug()`.
 */


exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
  // Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
  // eslint-disable-next-line import/no-extraneous-dependencies
  var supportsColor = supportsColor_1;

  if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
    exports.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221];
  }
} catch (error) {} // Swallow - we only care if `supports-color` is available; it doesn't have to be.

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */


exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // Camel-case
  var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function (_, k) {
    return k.toUpperCase();
  }); // Coerce string value into JS value

  var val = process.env[key];

  if (/^(yes|on|true|enabled)$/i.test(val)) {
    val = true;
  } else if (/^(no|off|false|disabled)$/i.test(val)) {
    val = false;
  } else if (val === 'null') {
    val = null;
  } else {
    val = Number(val);
  }

  obj[prop] = val;
  return obj;
}, {});
/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
}
/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  var name = this.namespace,
      useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = "\x1B[3" + (c < 8 ? c : '8;5;' + c);
    var prefix = "  ".concat(colorCode, ";1m").concat(name, " \x1B[0m");
    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + "\x1B[0m");
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  }

  return new Date().toISOString() + ' ';
}
/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */


function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  if (namespaces) {
    process.env.DEBUG = namespaces;
  } else {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  return process.env.DEBUG;
}
/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */


function init(debug) {
  debug.inspectOpts = {};
  var keys = Object.keys(exports.inspectOpts);

  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

module.exports = common(exports);
var formatters = module.exports.formatters;
/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts).replace(/\s*\n\s*/g, ' ');
};
/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */


formatters.O = function (v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};
});
var node_1 = node.init;
var node_2 = node.log;
var node_3 = node.formatArgs;
var node_4 = node.save;
var node_5 = node.load;
var node_6 = node.useColors;
var node_7 = node.colors;
var node_8 = node.inspectOpts;

var src = createCommonjsModule(function (module) {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */
if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
  module.exports = browser;
} else {
  module.exports = node;
}
});

/**
 * Module dependencies.
 */





var inherits$1 = util.inherits;
var debug = src('https-proxy-agent');

/**
 * Module exports.
 */

var httpsProxyAgent = HttpsProxyAgent;

/**
 * The `HttpsProxyAgent` implements an HTTP Agent subclass that connects to the
 * specified "HTTP(s) proxy server" in order to proxy HTTPS requests.
 *
 * @api public
 */

function HttpsProxyAgent(opts) {
  if (!(this instanceof HttpsProxyAgent)) return new HttpsProxyAgent(opts);
  if ('string' == typeof opts) opts = url.parse(opts);
  if (!opts)
    throw new Error(
      'an HTTP(S) proxy server `host` and `port` must be specified!'
    );
  debug('creating new HttpsProxyAgent instance: %o', opts);
  agentBase.call(this, opts);

  var proxy = Object.assign({}, opts);

  // if `true`, then connect to the proxy server over TLS. defaults to `false`.
  this.secureProxy = proxy.protocol ? /^https:?$/i.test(proxy.protocol) : false;

  // prefer `hostname` over `host`, and set the `port` if needed
  proxy.host = proxy.hostname || proxy.host;
  proxy.port = +proxy.port || (this.secureProxy ? 443 : 80);

  // ALPN is supported by Node.js >= v5.
  // attempt to negotiate http/1.1 for proxy servers that support http/2
  if (this.secureProxy && !('ALPNProtocols' in proxy)) {
    proxy.ALPNProtocols = ['http 1.1'];
  }

  if (proxy.host && proxy.path) {
    // if both a `host` and `path` are specified then it's most likely the
    // result of a `url.parse()` call... we need to remove the `path` portion so
    // that `net.connect()` doesn't attempt to open that as a unix socket file.
    delete proxy.path;
    delete proxy.pathname;
  }

  this.proxy = proxy;
  this.defaultPort = 443;
}
inherits$1(HttpsProxyAgent, agentBase);

/**
 * Called when the node-core HTTP client library is creating a new HTTP request.
 *
 * @api public
 */

HttpsProxyAgent.prototype.callback = function connect(req, opts, fn) {
  var proxy = this.proxy;

  // create a socket connection to the proxy server
  var socket;
  if (this.secureProxy) {
    socket = tls.connect(proxy);
  } else {
    socket = net.connect(proxy);
  }

  // we need to buffer any HTTP traffic that happens with the proxy before we get
  // the CONNECT response, so that if the response is anything other than an "200"
  // response code, then we can re-play the "data" events on the socket once the
  // HTTP parser is hooked up...
  var buffers = [];
  var buffersLength = 0;

  function read() {
    var b = socket.read();
    if (b) ondata(b);
    else socket.once('readable', read);
  }

  function cleanup() {
    socket.removeListener('data', ondata);
    socket.removeListener('end', onend);
    socket.removeListener('error', onerror);
    socket.removeListener('close', onclose);
    socket.removeListener('readable', read);
  }

  function onclose(err) {
    debug('onclose had error %o', err);
  }

  function onend() {
    debug('onend');
  }

  function onerror(err) {
    cleanup();
    fn(err);
  }

  function ondata(b) {
    buffers.push(b);
    buffersLength += b.length;
    var buffered = Buffer.concat(buffers, buffersLength);
    var str = buffered.toString('ascii');

    if (!~str.indexOf('\r\n\r\n')) {
      // keep buffering
      debug('have not received end of HTTP headers yet...');
      if (socket.read) {
        read();
      } else {
        socket.once('data', ondata);
      }
      return;
    }

    var firstLine = str.substring(0, str.indexOf('\r\n'));
    var statusCode = +firstLine.split(' ')[1];
    debug('got proxy server response: %o', firstLine);

    if (200 == statusCode) {
      // 200 Connected status code!
      var sock = socket;

      // nullify the buffered data since we won't be needing it
      buffers = buffered = null;

      if (opts.secureEndpoint) {
        // since the proxy is connecting to an SSL server, we have
        // to upgrade this socket connection to an SSL connection
        debug(
          'upgrading proxy-connected socket to TLS connection: %o',
          opts.host
        );
        opts.socket = socket;
        opts.servername = opts.servername || opts.host;
        opts.host = null;
        opts.hostname = null;
        opts.port = null;
        sock = tls.connect(opts);
      }

      cleanup();
      fn(null, sock);
    } else {
      // some other status code that's not 200... need to re-play the HTTP header
      // "data" events onto the socket once the HTTP machinery is attached so that
      // the user can parse and handle the error status code
      cleanup();

      // save a reference to the concat'd Buffer for the `onsocket` callback
      buffers = buffered;

      // need to wait for the "socket" event to re-play the "data" events
      req.once('socket', onsocket);
      fn(null, socket);
    }
  }

  function onsocket(socket) {
    // replay the "buffers" Buffer onto the `socket`, since at this point
    // the HTTP module machinery has been hooked up for the user
    if ('function' == typeof socket.ondata) {
      // node <= v0.11.3, the `ondata` function is set on the socket
      socket.ondata(buffers, 0, buffers.length);
    } else if (socket.listeners('data').length > 0) {
      // node > v0.11.3, the "data" event is listened for directly
      socket.emit('data', buffers);
    } else {
      // never?
      throw new Error('should not happen...');
    }

    // nullify the cached Buffer instance
    buffers = null;
  }

  socket.on('error', onerror);
  socket.on('close', onclose);
  socket.on('end', onend);

  if (socket.read) {
    read();
  } else {
    socket.once('data', ondata);
  }

  var hostname = opts.host + ':' + opts.port;
  var msg = 'CONNECT ' + hostname + ' HTTP/1.1\r\n';

  var headers = Object.assign({}, proxy.headers);
  if (proxy.auth) {
    headers['Proxy-Authorization'] =
      'Basic ' + Buffer.from(proxy.auth).toString('base64');
  }

  // the Host header should only include the port
  // number when it is a non-standard port
  var host = opts.host;
  if (!isDefaultPort(opts.port, opts.secureEndpoint)) {
    host += ':' + opts.port;
  }
  headers['Host'] = host;

  headers['Connection'] = 'close';
  Object.keys(headers).forEach(function(name) {
    msg += name + ': ' + headers[name] + '\r\n';
  });

  socket.write(msg + '\r\n');
};

function isDefaultPort(port, secure) {
  return Boolean((!secure && port === 80) || (secure && port === 443));
}

var obfuscateUrlPassword = function (url) {
  return url.replace(/^([-a-z]*:\/\/[^:]*:)[^@]*@/, function (_, first) { return first + '********@' })
};

var proxyForUrl = proxyFromEnv.getProxyForUrl;
var URL = url.URL;




function nodeRequest (request, options, protocol, withResponse) {
  if (protocol === 'https:') {
    return https.request(merge(request, options.https), withResponse)
  } else {
    return http.request(merge(request, options.http), withResponse)
  }
}

function proxyUrl (request, proxy) {
  var url = new URL(request.url);
  var proxyUrl = new URL(proxy);

  request.headers.host = url.hostname;

  if (url.protocol === 'https:') {
    url.agent = new httpsProxyAgent(proxy);
    return url
  } else {
    if (proxyUrl.auth) {
      request.headers['proxy-authorization'] = 'Basic ' + Buffer.from(proxyUrl.auth).toString('base64');
    }

    var split = request.url.split('?');
    var pathname = split[0];
    var search = split[1] || '';
    return {
      hostname: proxyUrl.hostname,
      port: proxyUrl.port,
      protocol: proxyUrl.protocol,
      pathname: pathname,
      search: search
    }
  }
}

function parseUrl$1 (request) {
  var proxy = proxyForUrl(request.url) || request.options.proxy;

  if (proxy) {
    return proxyUrl(request, proxy)
  } else {
    return new URL(request.url)
  }
}

var http_1 = middleware('http', function (request) {
  return new Promise(function (resolve, reject) {
    var url = parseUrl$1(request);

    var req = nodeRequest(
      {
        hostname: url.hostname,
        port: url.port,
        method: request.method,
        path: url.pathname + url.search,
        headers: request.headers,
        agent: url.agent
      },
      request.options,
      url.protocol,
      function (res) {
        return resolve({
          statusCode: res.statusCode,
          statusText: http.STATUS_CODES[res.statusCode],
          url: request.url,
          headers: res.headers,
          body: res
        })
      }
    );

    if (request.options.timeout) {
      req.setTimeout(request.options.timeout);

      req.on('timeout', function () {
        var msg = request.method.toUpperCase() + ' ' + obfuscateUrlPassword(request.url) + ' => timeout (' + request.options.timeout + 'ms)';
        reject(new Error(msg));
      });
    }

    req.on('error', function (e) {
      reject(e);
    });

    if (request.body) {
      request.body.pipe(req);
    } else {
      req.end();
    }
  })
});

/**
 * Helpers.
 */

var s$1 = 1000;
var m$1 = s$1 * 60;
var h$1 = m$1 * 60;
var d$1 = h$1 * 24;
var w$1 = d$1 * 7;
var y$1 = d$1 * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms$1 = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse$1(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong$1(val) : fmtShort$1(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse$1(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y$1;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w$1;
    case 'days':
    case 'day':
    case 'd':
      return n * d$1;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h$1;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m$1;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s$1;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort$1(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d$1) {
    return Math.round(ms / d$1) + 'd';
  }
  if (msAbs >= h$1) {
    return Math.round(ms / h$1) + 'h';
  }
  if (msAbs >= m$1) {
    return Math.round(ms / m$1) + 'm';
  }
  if (msAbs >= s$1) {
    return Math.round(ms / s$1) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong$1(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d$1) {
    return plural$1(ms, msAbs, d$1, 'day');
  }
  if (msAbs >= h$1) {
    return plural$1(ms, msAbs, h$1, 'hour');
  }
  if (msAbs >= m$1) {
    return plural$1(ms, msAbs, m$1, 'minute');
  }
  if (msAbs >= s$1) {
    return plural$1(ms, msAbs, s$1, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural$1(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup$1(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = ms$1;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

var common$1 = setup$1;

var browser$1 = createCommonjsModule(function (module, exports) {
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = common$1(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};
});
var browser_1$1 = browser$1.log;
var browser_2$1 = browser$1.formatArgs;
var browser_3$1 = browser$1.save;
var browser_4$1 = browser$1.load;
var browser_5$1 = browser$1.useColors;
var browser_6$1 = browser$1.storage;
var browser_7$1 = browser$1.colors;

var node$1 = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = supportsColor_1;

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = common$1(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};
});
var node_1$1 = node$1.init;
var node_2$1 = node$1.log;
var node_3$1 = node$1.formatArgs;
var node_4$1 = node$1.save;
var node_5$1 = node$1.load;
var node_6$1 = node$1.useColors;
var node_7$1 = node$1.colors;
var node_8$1 = node$1.inspectOpts;

var src$1 = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = browser$1;
} else {
	module.exports = node$1;
}
});

var prepareForLogging = function prepareForLogging (r) {
  return removeUndefined({
    method: r.method,
    url: r.url && obfuscateUrlPassword(r.url),
    headers: r.headers && obfuscateHeaders(r.headers),
    body: r.stringBody !== undefined ? r.stringBody : r.body ? '[Stream]' : undefined,
    statusCode: r.statusCode,
    statusText: r.statusText
  })
};

function obfuscateHeaders (headers) {
  var result = {};
  Object.keys(headers).forEach(function (key) {
    if (key.toLowerCase() === 'authorization') {
      var auth = headers[key].split(/\s*/g);

      if (auth.length > 1) {
        result[key] = String(headers[key]).split(' ')[0] + ' ********';
      } else {
        result[key] = '********';
      }
    } else {
      result[key] = headers[key];
    }
  });
  return result
}

function removeUndefined (obj) {
  Object.keys(obj).forEach(function (key) {
    if (typeof obj[key] === 'undefined') {
      delete obj[key];
    }
  });

  return obj
}

var debugResponse = src$1('httpism:response');


function logResponse (response) {
  if (!response.redirectResponse) {
    debugResponse(prepareForLogging(response));
  }
}

var log = middleware('log', function (request, next) {
  var promise = next();

  if (debugResponse.enabled) {
    return promise.then(function (response) {
      logResponse(response);
      return response
    }, function (e) {
      var res = extend({}, e);
      logResponse(res);
      throw e
    })
  } else {
    return promise
  }
});

var logResponse_1 = logResponse;
log.logResponse = logResponse_1;

var logError = src$1('httpism:error');

var logDetailError = src$1('httpism:response:error');

var exception = middleware('exception', function (request, next) {
  return next().then(function (response) {
    var exceptions = request.options.exceptions;
    var isException = exceptions === false ? false : typeof exceptions === 'function' ? exceptions(response) : response.statusCode >= 400;

    if (isException) {
      var obfuscatedUrl = obfuscateUrlPassword(request.url);
      var msg = request.method.toUpperCase() + ' ' + obfuscatedUrl + ' => ' + response.statusCode + ' ' + response.statusText;
      logError(msg);
      var logResponse = prepareForLogging(response);
      logDetailError(logResponse);
      var error = extend(new Error(msg), response);
      error.url = obfuscatedUrl;
      throw error
    } else {
      return response
    }
  })
});

var stringToStream = function (s) {
  return {
    pipe: function (stream) {
      stream.write(s);
      stream.end();
    }
  }
};

var setBodyToString = function (r, s) {
  r.body = stringToStream(s);
  r.headers['content-length'] = Buffer.byteLength(s, 'utf-8');
  r.stringBody = s;
};

var setHeaderTo = function (request, header, value) {
  if (!request.headers[header]) {
    return (request.headers[header] = value)
  }
};

var responseBodyTypes = {
  json: function (response) {
    return contentTypeIs(response, 'application/json')
  },
  text: function (response) {
    return contentTypeIsText(response) || contentTypeIs(response, 'application/javascript')
  },
  form: function (response) {
    return contentTypeIs(response, 'application/x-www-form-urlencoded')
  },
  stream: function () {
    return false
  }
};

function contentTypeIsText (response) {
  return contentTypeIs(response, 'text/.*')
}

function contentTypeIs (response, expectedContentType) {
  var re = new RegExp('^\\s*' + expectedContentType + '\\s*($|;)');
  return re.test(response.headers['content-type'])
}

var shouldParseAs = function (response, type, request) {
  if (request.options.responseBody) {
    return type === request.options.responseBody
  } else {
    var bodyType = responseBodyTypes[type];
    if (bodyType) {
      return bodyType(response)
    }
  }
};

var streamToString = function (s) {
  return new Promise(function (resolve, reject) {
    s.setEncoding('utf-8');
    var strings = [];

    s.on('data', function (d) {
      strings.push(d);
    });

    s.on('end', function () {
      resolve(strings.join(''));
    });

    s.on('error', function (e) {
      reject(e);
    });
  })
};

var readBodyAsString = function (r) {
  return streamToString(r.body).then(function (string) {
    r.stringBody = string;
  })
};

var textServer = middleware('text', function (request, next) {
  if (typeof request.body === 'string') {
    setBodyToString(request, request.body);
    setHeaderTo(request, 'content-type', 'text/plain');
  }

  return next().then(function (response) {
    if (shouldParseAs(response, 'text', request)) {
      return readBodyAsString(response).then(function () {
        response.body = response.stringBody;
        return response
      })
    } else {
      return response
    }
  })
});

var isStream = function (body) {
  return body !== undefined && typeof body.pipe === 'function'
};

var querystringLite = {
  parse: function (string) {
    var params = {};

    string.split('&').forEach(function (component) {
      var split = component.split('=');
      if (split[1]) {
        params[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
      }
    });

    return params
  },

  stringify: function (params) {
    return Object.keys(params)
      .filter(function (key) {
        return typeof (params[key]) !== 'undefined'
      })
      .map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
      })
      .join('&')
  }
};

var formServer = middleware('form', function (request, next) {
  if (request.options.form && request.body instanceof Object && !isStream(request.body)) {
    var querystring = request.options.qs || querystringLite;
    setBodyToString(request, querystring.stringify(request.body));
    setHeaderTo(request, 'content-type', 'application/x-www-form-urlencoded');
  }

  return next().then(function (response) {
    if (shouldParseAs(response, 'form', request)) {
      return readBodyAsString(response).then(function () {
        var querystring = request.options.qs || querystringLite;
        response.body = querystring.parse(response.stringBody);
        return response
      })
    } else {
      return response
    }
  })
});

var jsonServer = middleware('json', function (request, next) {
  if (request.body instanceof Object && !isStream(request.body)) {
    setBodyToString(request, JSON.stringify(request.body));
    setHeaderTo(request, 'content-type', 'application/json');
  }

  setHeaderTo(request, 'accept', 'application/json');

  return next().then(function (response) {
    if (shouldParseAs(response, 'json', request)) {
      return readBodyAsString(response).then(function () {
        response.body = JSON.parse(response.stringBody, request.options.jsonReviver);
        return response
      })
    } else {
      return response
    }
  })
});

var expandUrl = function expandUrl (pattern, _params, _qs) {
  var qs = _qs || querystringLite;
  var params = _params || {};
  var onlyQueryParams = extend({}, params);

  var uri = parseUri(pattern);
  var pathPattern = uri.pathname;
  var path = pathPattern.replace(/:([a-z_][a-z0-9_]*)\*/gi, function (_, id) {
    var param = params[id];
    if (param === undefined) {
      throw new Error('No value for :' + id + '*')
    }
    delete onlyQueryParams[id];
    return encodeURI(paramToString(param))
  });

  path = path.replace(/:([a-z_][a-z0-9_]*)/gi, function (_, id) {
    var param = params[id];
    if (param === undefined) {
      throw new Error('No value for :' + id)
    }
    delete onlyQueryParams[id];
    return encodeURIComponent(paramToString(param))
  });

  var query = qs.stringify(extend(qs.parse(uri.search.replace(/^\?/, '')), onlyQueryParams));

  var fullpath = query ? path + '?' + query : path;

  return uri.protocol + uri.authority + fullpath + uri.hash
};

function paramToString (p) {
  if (p === undefined || p === null) {
    return ''
  } else {
    return p
  }
}

var params = middleware('params', function (request, next) {
  if (request.options.params instanceof Object) {
    var render = request.options.expandUrl || expandUrl;
    request.url = render(request.url, request.options.params, request.options.qs);
  }

  return next()
});

var mergeQueryString = function (request) {
  var qs = request.options.qs || querystringLite;

  var split = request.url.split('?');
  var path = split[0];
  var querystring = qs.parse(split[1] || '');
  var mergedQueryString = merge(request.options.querystring, querystring);

  request.url = path + '?' + qs.stringify(mergedQueryString);
};

var querystring = middleware('querystring', function (request, next) {
  if (request.options.querystring instanceof Object) {
    console.warn('options.querystring is deprecated, please see https://github.com/featurist/httpism#params');
    mergeQueryString(request);
  }

  return next()
});

var base64 = createCommonjsModule(function (module, exports) {
(function(root) {

	// Detect free variables `exports`.
	var freeExports =  exports;

	// Detect free variable `module`.
	var freeModule =  module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code, and use
	// it as `root`.
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var InvalidCharacterError = function(message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	var error = function(message) {
		// Note: the error messages used throughout this file match those used by
		// the native `atob`/`btoa` implementation in Chromium.
		throw new InvalidCharacterError(message);
	};

	var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	// http://whatwg.org/html/common-microsyntaxes.html#space-character
	var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

	// `decode` is designed to be fully compatible with `atob` as described in the
	// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
	// The optimized base64-decoding algorithm used is based on @atk’s excellent
	// implementation. https://gist.github.com/atk/1020396
	var decode = function(input) {
		input = String(input)
			.replace(REGEX_SPACE_CHARACTERS, '');
		var length = input.length;
		if (length % 4 == 0) {
			input = input.replace(/==?$/, '');
			length = input.length;
		}
		if (
			length % 4 == 1 ||
			// http://whatwg.org/C#alphanumeric-ascii-characters
			/[^+a-zA-Z0-9/]/.test(input)
		) {
			error(
				'Invalid character: the string to be decoded is not correctly encoded.'
			);
		}
		var bitCounter = 0;
		var bitStorage;
		var buffer;
		var output = '';
		var position = -1;
		while (++position < length) {
			buffer = TABLE.indexOf(input.charAt(position));
			bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
			// Unless this is the first of a group of 4 characters…
			if (bitCounter++ % 4) {
				// …convert the first 8 bits to a single ASCII character.
				output += String.fromCharCode(
					0xFF & bitStorage >> (-2 * bitCounter & 6)
				);
			}
		}
		return output;
	};

	// `encode` is designed to be fully compatible with `btoa` as described in the
	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
	var encode = function(input) {
		input = String(input);
		if (/[^\0-\xFF]/.test(input)) {
			// Note: no need to special-case astral symbols here, as surrogates are
			// matched, and the input is supposed to only contain ASCII anyway.
			error(
				'The string to be encoded contains characters outside of the ' +
				'Latin1 range.'
			);
		}
		var padding = input.length % 3;
		var output = '';
		var position = -1;
		var a;
		var b;
		var c;
		var buffer;
		// Make sure any padding is handled outside of the loop.
		var length = input.length - padding;

		while (++position < length) {
			// Read three bytes, i.e. 24 bits.
			a = input.charCodeAt(position) << 16;
			b = input.charCodeAt(++position) << 8;
			c = input.charCodeAt(++position);
			buffer = a + b + c;
			// Turn the 24 bits into four chunks of 6 bits each, and append the
			// matching character for each of them to the output.
			output += (
				TABLE.charAt(buffer >> 18 & 0x3F) +
				TABLE.charAt(buffer >> 12 & 0x3F) +
				TABLE.charAt(buffer >> 6 & 0x3F) +
				TABLE.charAt(buffer & 0x3F)
			);
		}

		if (padding == 2) {
			a = input.charCodeAt(position) << 8;
			b = input.charCodeAt(++position);
			buffer = a + b;
			output += (
				TABLE.charAt(buffer >> 10) +
				TABLE.charAt((buffer >> 4) & 0x3F) +
				TABLE.charAt((buffer << 2) & 0x3F) +
				'='
			);
		} else if (padding == 1) {
			buffer = input.charCodeAt(position);
			output += (
				TABLE.charAt(buffer >> 2) +
				TABLE.charAt((buffer << 4) & 0x3F) +
				'=='
			);
		}

		return output;
	};

	var base64 = {
		'encode': encode,
		'decode': decode,
		'version': '0.1.0'
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = base64;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in base64) {
				base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.base64 = base64;
	}

}(commonjsGlobal));
});

function encodeBasicAuthorizationHeader (s) {
  return 'Basic ' + base64.encode(s)
}

var basicAuth = middleware('basicAuth', function (request, next) {
  function basicAuthorizationHeader () {
    if (request.options.basicAuth) {
      var username = request.options.basicAuth.username || '';
      var password = request.options.basicAuth.password || '';

      return encodeBasicAuthorizationHeader(username.replace(/:/g, '') + ':' + password)
    } else {
      var url = parseUri(request.url);
      if (url.auth) {
        return encodeBasicAuthorizationHeader(url.auth)
      }
    }
  }

  var header = basicAuthorizationHeader();
  if (header) {
    request.headers.authorization = header;
  }

  return next()
});

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var wrappy_1 = wrappy;
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k];
  });

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    var ret = fn.apply(this, args);
    var cb = args[args.length-1];
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k];
      });
    }
    return ret
  }
}

var once_1 = wrappy_1(once);
var strict = wrappy_1(onceStrict);

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  });

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  });
});

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  f.called = false;
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  var name = fn.name || 'Function wrapped with `once`';
  f.onceError = name + " shouldn't be called more than once";
  f.called = false;
  return f
}
once_1.strict = strict;

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once_1(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		if (readable && !(rs && rs.ended)) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && ws.ended)) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

var endOfStream = eos;

var output = middleware('output', function (request, next) {
  if (request.options.output) {
    request.options.responseBody = 'stream';
    return next().then(function (response) {
      return new Promise(function (resolve, reject) {
        endOfStream(response.body.pipe(request.options.output), function (error, result) {
          delete response.body;
          if (error) reject(error);
          else resolve(response);
        });
      })
    })
  } else {
    return next()
  }
});

var logResponse$1 = log.logResponse;



function consumeStream (s) {
  return new Promise(function (resolve, reject) {
    s.on('end', function () {
      resolve();
    });

    s.on('error', function (e) {
      reject(e);
    });

    s.resume();
  })
}

var redirect = middleware('redirect', function (request, next, client) {
  return next().then(function (response) {
    var statusCode = response.statusCode;
    var location = response.headers.location;

    if (request.options.redirect !== false && location && (statusCode === 300 || statusCode === 301 || statusCode === 302 || statusCode === 303 || statusCode === 307)) {
      if (isStream(response.body)) {
        consumeStream(response.body);
      }
      logResponse$1(response);
      return client.get(resolveUrl(request.url, location), request.options).then(function (redirectResponse) {
        var error = new Error('redirect');
        error.isRedirectResponse = true;
        error.redirectResponse = redirectResponse;
        throw error
      })
    } else {
      return response
    }
  })
});

var ipRegex = createCommonjsModule(function (module) {

const v4 = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}';

const v6seg = '[0-9a-fA-F]{1,4}';
const v6 = `
(
(?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${v4}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${v4}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${v4}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${v4}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

const ip = module.exports = opts => opts && opts.exact ?
	new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
	new RegExp(`(?:${v4})|(?:${v6})`, 'g');

ip.v4 = opts => opts && opts.exact ? new RegExp(`^${v4}$`) : new RegExp(v4, 'g');
ip.v6 = opts => opts && opts.exact ? new RegExp(`^${v6}$`) : new RegExp(v6, 'g');
});

/** Highest positive signed 32-bit float value */
const maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
const base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128; // 0x80
const delimiter = '-'; // '\x2D'

/** Regular expressions */
const regexPunycode = /^xn--/;
const regexNonASCII = /[^\0-\x7E]/; // non-ASCII chars
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */
const errors = {
	'overflow': 'Overflow: input needs wider integers to process',
	'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
	'invalid-input': 'Invalid input'
};

/** Convenience shortcuts */
const baseMinusTMin = base - tMin;
const floor = Math.floor;
const stringFromCharCode = String.fromCharCode;

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error(type) {
	throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function map(array, fn) {
	const result = [];
	let length = array.length;
	while (length--) {
		result[length] = fn(array[length]);
	}
	return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {Array} A new string of characters returned by the callback
 * function.
 */
function mapDomain(string, fn) {
	const parts = string.split('@');
	let result = '';
	if (parts.length > 1) {
		// In email addresses, only the domain name should be punycoded. Leave
		// the local part (i.e. everything up to `@`) intact.
		result = parts[0] + '@';
		string = parts[1];
	}
	// Avoid `split(regex)` for IE8 compatibility. See #17.
	string = string.replace(regexSeparators, '\x2E');
	const labels = string.split('.');
	const encoded = map(labels, fn).join('.');
	return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
	const output = [];
	let counter = 0;
	const length = string.length;
	while (counter < length) {
		const value = string.charCodeAt(counter++);
		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
			// It's a high surrogate, and there is a next character.
			const extra = string.charCodeAt(counter++);
			if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
			} else {
				// It's an unmatched surrogate; only append this code unit, in case the
				// next code unit is the high surrogate of a surrogate pair.
				output.push(value);
				counter--;
			}
		} else {
			output.push(value);
		}
	}
	return output;
}

/**
 * Creates a string based on an array of numeric code points.
 * @see `punycode.ucs2.decode`
 * @memberOf punycode.ucs2
 * @name encode
 * @param {Array} codePoints The array of numeric code points.
 * @returns {String} The new Unicode string (UCS-2).
 */
const ucs2encode = array => String.fromCodePoint(...array);

/**
 * Converts a basic code point into a digit/integer.
 * @see `digitToBasic()`
 * @private
 * @param {Number} codePoint The basic numeric code point value.
 * @returns {Number} The numeric value of a basic code point (for use in
 * representing integers) in the range `0` to `base - 1`, or `base` if
 * the code point does not represent a value.
 */
const basicToDigit = function(codePoint) {
	if (codePoint - 0x30 < 0x0A) {
		return codePoint - 0x16;
	}
	if (codePoint - 0x41 < 0x1A) {
		return codePoint - 0x41;
	}
	if (codePoint - 0x61 < 0x1A) {
		return codePoint - 0x61;
	}
	return base;
};

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
const digitToBasic = function(digit, flag) {
	//  0..25 map to ASCII a..z or A..Z
	// 26..35 map to ASCII 0..9
	return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
const adapt = function(delta, numPoints, firstTime) {
	let k = 0;
	delta = firstTime ? floor(delta / damp) : delta >> 1;
	delta += floor(delta / numPoints);
	for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
		delta = floor(delta / baseMinusTMin);
	}
	return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
 * symbols.
 * @memberOf punycode
 * @param {String} input The Punycode string of ASCII-only symbols.
 * @returns {String} The resulting string of Unicode symbols.
 */
const decode = function(input) {
	// Don't use UCS-2.
	const output = [];
	const inputLength = input.length;
	let i = 0;
	let n = initialN;
	let bias = initialBias;

	// Handle the basic code points: let `basic` be the number of input code
	// points before the last delimiter, or `0` if there is none, then copy
	// the first basic code points to the output.

	let basic = input.lastIndexOf(delimiter);
	if (basic < 0) {
		basic = 0;
	}

	for (let j = 0; j < basic; ++j) {
		// if it's not a basic code point
		if (input.charCodeAt(j) >= 0x80) {
			error('not-basic');
		}
		output.push(input.charCodeAt(j));
	}

	// Main decoding loop: start just after the last delimiter if any basic code
	// points were copied; start at the beginning otherwise.

	for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

		// `index` is the index of the next character to be consumed.
		// Decode a generalized variable-length integer into `delta`,
		// which gets added to `i`. The overflow checking is easier
		// if we increase `i` as we go, then subtract off its starting
		// value at the end to obtain `delta`.
		let oldi = i;
		for (let w = 1, k = base; /* no condition */; k += base) {

			if (index >= inputLength) {
				error('invalid-input');
			}

			const digit = basicToDigit(input.charCodeAt(index++));

			if (digit >= base || digit > floor((maxInt - i) / w)) {
				error('overflow');
			}

			i += digit * w;
			const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

			if (digit < t) {
				break;
			}

			const baseMinusT = base - t;
			if (w > floor(maxInt / baseMinusT)) {
				error('overflow');
			}

			w *= baseMinusT;

		}

		const out = output.length + 1;
		bias = adapt(i - oldi, out, oldi == 0);

		// `i` was supposed to wrap around from `out` to `0`,
		// incrementing `n` each time, so we'll fix that now:
		if (floor(i / out) > maxInt - n) {
			error('overflow');
		}

		n += floor(i / out);
		i %= out;

		// Insert `n` at position `i` of the output.
		output.splice(i++, 0, n);

	}

	return String.fromCodePoint(...output);
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
const encode = function(input) {
	const output = [];

	// Convert the input in UCS-2 to an array of Unicode code points.
	input = ucs2decode(input);

	// Cache the length.
	let inputLength = input.length;

	// Initialize the state.
	let n = initialN;
	let delta = 0;
	let bias = initialBias;

	// Handle the basic code points.
	for (const currentValue of input) {
		if (currentValue < 0x80) {
			output.push(stringFromCharCode(currentValue));
		}
	}

	let basicLength = output.length;
	let handledCPCount = basicLength;

	// `handledCPCount` is the number of code points that have been handled;
	// `basicLength` is the number of basic code points.

	// Finish the basic string with a delimiter unless it's empty.
	if (basicLength) {
		output.push(delimiter);
	}

	// Main encoding loop:
	while (handledCPCount < inputLength) {

		// All non-basic code points < n have been handled already. Find the next
		// larger one:
		let m = maxInt;
		for (const currentValue of input) {
			if (currentValue >= n && currentValue < m) {
				m = currentValue;
			}
		}

		// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
		// but guard against overflow.
		const handledCPCountPlusOne = handledCPCount + 1;
		if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
			error('overflow');
		}

		delta += (m - n) * handledCPCountPlusOne;
		n = m;

		for (const currentValue of input) {
			if (currentValue < n && ++delta > maxInt) {
				error('overflow');
			}
			if (currentValue == n) {
				// Represent delta as a generalized variable-length integer.
				let q = delta;
				for (let k = base; /* no condition */; k += base) {
					const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
					if (q < t) {
						break;
					}
					const qMinusT = q - t;
					const baseMinusT = base - t;
					output.push(
						stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
					);
					q = floor(qMinusT / baseMinusT);
				}

				output.push(stringFromCharCode(digitToBasic(q, 0)));
				bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
				delta = 0;
				++handledCPCount;
			}
		}

		++delta;
		++n;

	}
	return output.join('');
};

/**
 * Converts a Punycode string representing a domain name or an email address
 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
 * it doesn't matter if you call it on a string that has already been
 * converted to Unicode.
 * @memberOf punycode
 * @param {String} input The Punycoded domain name or email address to
 * convert to Unicode.
 * @returns {String} The Unicode representation of the given Punycode
 * string.
 */
const toUnicode = function(input) {
	return mapDomain(input, function(string) {
		return regexPunycode.test(string)
			? decode(string.slice(4).toLowerCase())
			: string;
	});
};

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
const toASCII = function(input) {
	return mapDomain(input, function(string) {
		return regexNonASCII.test(string)
			? 'xn--' + encode(string)
			: string;
	});
};

/*--------------------------------------------------------------------------*/

/** Define the public API */
const punycode = {
	/**
	 * A string representing the current Punycode.js version number.
	 * @memberOf punycode
	 * @type String
	 */
	'version': '2.1.0',
	/**
	 * An object of methods to convert from JavaScript's internal character
	 * representation (UCS-2) to Unicode code points, and back.
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode
	 * @type Object
	 */
	'ucs2': {
		'decode': ucs2decode,
		'encode': ucs2encode
	},
	'decode': decode,
	'encode': encode,
	'toASCII': toASCII,
	'toUnicode': toUnicode
};

var punycode_1 = punycode;

var rules = [
	"ac",
	"com.ac",
	"edu.ac",
	"gov.ac",
	"net.ac",
	"mil.ac",
	"org.ac",
	"ad",
	"nom.ad",
	"ae",
	"co.ae",
	"net.ae",
	"org.ae",
	"sch.ae",
	"ac.ae",
	"gov.ae",
	"mil.ae",
	"aero",
	"accident-investigation.aero",
	"accident-prevention.aero",
	"aerobatic.aero",
	"aeroclub.aero",
	"aerodrome.aero",
	"agents.aero",
	"aircraft.aero",
	"airline.aero",
	"airport.aero",
	"air-surveillance.aero",
	"airtraffic.aero",
	"air-traffic-control.aero",
	"ambulance.aero",
	"amusement.aero",
	"association.aero",
	"author.aero",
	"ballooning.aero",
	"broker.aero",
	"caa.aero",
	"cargo.aero",
	"catering.aero",
	"certification.aero",
	"championship.aero",
	"charter.aero",
	"civilaviation.aero",
	"club.aero",
	"conference.aero",
	"consultant.aero",
	"consulting.aero",
	"control.aero",
	"council.aero",
	"crew.aero",
	"design.aero",
	"dgca.aero",
	"educator.aero",
	"emergency.aero",
	"engine.aero",
	"engineer.aero",
	"entertainment.aero",
	"equipment.aero",
	"exchange.aero",
	"express.aero",
	"federation.aero",
	"flight.aero",
	"freight.aero",
	"fuel.aero",
	"gliding.aero",
	"government.aero",
	"groundhandling.aero",
	"group.aero",
	"hanggliding.aero",
	"homebuilt.aero",
	"insurance.aero",
	"journal.aero",
	"journalist.aero",
	"leasing.aero",
	"logistics.aero",
	"magazine.aero",
	"maintenance.aero",
	"media.aero",
	"microlight.aero",
	"modelling.aero",
	"navigation.aero",
	"parachuting.aero",
	"paragliding.aero",
	"passenger-association.aero",
	"pilot.aero",
	"press.aero",
	"production.aero",
	"recreation.aero",
	"repbody.aero",
	"res.aero",
	"research.aero",
	"rotorcraft.aero",
	"safety.aero",
	"scientist.aero",
	"services.aero",
	"show.aero",
	"skydiving.aero",
	"software.aero",
	"student.aero",
	"trader.aero",
	"trading.aero",
	"trainer.aero",
	"union.aero",
	"workinggroup.aero",
	"works.aero",
	"af",
	"gov.af",
	"com.af",
	"org.af",
	"net.af",
	"edu.af",
	"ag",
	"com.ag",
	"org.ag",
	"net.ag",
	"co.ag",
	"nom.ag",
	"ai",
	"off.ai",
	"com.ai",
	"net.ai",
	"org.ai",
	"al",
	"com.al",
	"edu.al",
	"gov.al",
	"mil.al",
	"net.al",
	"org.al",
	"am",
	"co.am",
	"com.am",
	"commune.am",
	"net.am",
	"org.am",
	"ao",
	"ed.ao",
	"gv.ao",
	"og.ao",
	"co.ao",
	"pb.ao",
	"it.ao",
	"aq",
	"ar",
	"com.ar",
	"edu.ar",
	"gob.ar",
	"gov.ar",
	"int.ar",
	"mil.ar",
	"musica.ar",
	"net.ar",
	"org.ar",
	"tur.ar",
	"arpa",
	"e164.arpa",
	"in-addr.arpa",
	"ip6.arpa",
	"iris.arpa",
	"uri.arpa",
	"urn.arpa",
	"as",
	"gov.as",
	"asia",
	"at",
	"ac.at",
	"co.at",
	"gv.at",
	"or.at",
	"au",
	"com.au",
	"net.au",
	"org.au",
	"edu.au",
	"gov.au",
	"asn.au",
	"id.au",
	"info.au",
	"conf.au",
	"oz.au",
	"act.au",
	"nsw.au",
	"nt.au",
	"qld.au",
	"sa.au",
	"tas.au",
	"vic.au",
	"wa.au",
	"act.edu.au",
	"catholic.edu.au",
	"eq.edu.au",
	"nsw.edu.au",
	"nt.edu.au",
	"qld.edu.au",
	"sa.edu.au",
	"tas.edu.au",
	"vic.edu.au",
	"wa.edu.au",
	"qld.gov.au",
	"sa.gov.au",
	"tas.gov.au",
	"vic.gov.au",
	"wa.gov.au",
	"education.tas.edu.au",
	"schools.nsw.edu.au",
	"aw",
	"com.aw",
	"ax",
	"az",
	"com.az",
	"net.az",
	"int.az",
	"gov.az",
	"org.az",
	"edu.az",
	"info.az",
	"pp.az",
	"mil.az",
	"name.az",
	"pro.az",
	"biz.az",
	"ba",
	"com.ba",
	"edu.ba",
	"gov.ba",
	"mil.ba",
	"net.ba",
	"org.ba",
	"bb",
	"biz.bb",
	"co.bb",
	"com.bb",
	"edu.bb",
	"gov.bb",
	"info.bb",
	"net.bb",
	"org.bb",
	"store.bb",
	"tv.bb",
	"*.bd",
	"be",
	"ac.be",
	"bf",
	"gov.bf",
	"bg",
	"a.bg",
	"b.bg",
	"c.bg",
	"d.bg",
	"e.bg",
	"f.bg",
	"g.bg",
	"h.bg",
	"i.bg",
	"j.bg",
	"k.bg",
	"l.bg",
	"m.bg",
	"n.bg",
	"o.bg",
	"p.bg",
	"q.bg",
	"r.bg",
	"s.bg",
	"t.bg",
	"u.bg",
	"v.bg",
	"w.bg",
	"x.bg",
	"y.bg",
	"z.bg",
	"0.bg",
	"1.bg",
	"2.bg",
	"3.bg",
	"4.bg",
	"5.bg",
	"6.bg",
	"7.bg",
	"8.bg",
	"9.bg",
	"bh",
	"com.bh",
	"edu.bh",
	"net.bh",
	"org.bh",
	"gov.bh",
	"bi",
	"co.bi",
	"com.bi",
	"edu.bi",
	"or.bi",
	"org.bi",
	"biz",
	"bj",
	"asso.bj",
	"barreau.bj",
	"gouv.bj",
	"bm",
	"com.bm",
	"edu.bm",
	"gov.bm",
	"net.bm",
	"org.bm",
	"bn",
	"com.bn",
	"edu.bn",
	"gov.bn",
	"net.bn",
	"org.bn",
	"bo",
	"com.bo",
	"edu.bo",
	"gob.bo",
	"int.bo",
	"org.bo",
	"net.bo",
	"mil.bo",
	"tv.bo",
	"web.bo",
	"academia.bo",
	"agro.bo",
	"arte.bo",
	"blog.bo",
	"bolivia.bo",
	"ciencia.bo",
	"cooperativa.bo",
	"democracia.bo",
	"deporte.bo",
	"ecologia.bo",
	"economia.bo",
	"empresa.bo",
	"indigena.bo",
	"industria.bo",
	"info.bo",
	"medicina.bo",
	"movimiento.bo",
	"musica.bo",
	"natural.bo",
	"nombre.bo",
	"noticias.bo",
	"patria.bo",
	"politica.bo",
	"profesional.bo",
	"plurinacional.bo",
	"pueblo.bo",
	"revista.bo",
	"salud.bo",
	"tecnologia.bo",
	"tksat.bo",
	"transporte.bo",
	"wiki.bo",
	"br",
	"9guacu.br",
	"abc.br",
	"adm.br",
	"adv.br",
	"agr.br",
	"aju.br",
	"am.br",
	"anani.br",
	"aparecida.br",
	"arq.br",
	"art.br",
	"ato.br",
	"b.br",
	"barueri.br",
	"belem.br",
	"bhz.br",
	"bio.br",
	"blog.br",
	"bmd.br",
	"boavista.br",
	"bsb.br",
	"campinagrande.br",
	"campinas.br",
	"caxias.br",
	"cim.br",
	"cng.br",
	"cnt.br",
	"com.br",
	"contagem.br",
	"coop.br",
	"cri.br",
	"cuiaba.br",
	"curitiba.br",
	"def.br",
	"ecn.br",
	"eco.br",
	"edu.br",
	"emp.br",
	"eng.br",
	"esp.br",
	"etc.br",
	"eti.br",
	"far.br",
	"feira.br",
	"flog.br",
	"floripa.br",
	"fm.br",
	"fnd.br",
	"fortal.br",
	"fot.br",
	"foz.br",
	"fst.br",
	"g12.br",
	"ggf.br",
	"goiania.br",
	"gov.br",
	"ac.gov.br",
	"al.gov.br",
	"am.gov.br",
	"ap.gov.br",
	"ba.gov.br",
	"ce.gov.br",
	"df.gov.br",
	"es.gov.br",
	"go.gov.br",
	"ma.gov.br",
	"mg.gov.br",
	"ms.gov.br",
	"mt.gov.br",
	"pa.gov.br",
	"pb.gov.br",
	"pe.gov.br",
	"pi.gov.br",
	"pr.gov.br",
	"rj.gov.br",
	"rn.gov.br",
	"ro.gov.br",
	"rr.gov.br",
	"rs.gov.br",
	"sc.gov.br",
	"se.gov.br",
	"sp.gov.br",
	"to.gov.br",
	"gru.br",
	"imb.br",
	"ind.br",
	"inf.br",
	"jab.br",
	"jampa.br",
	"jdf.br",
	"joinville.br",
	"jor.br",
	"jus.br",
	"leg.br",
	"lel.br",
	"londrina.br",
	"macapa.br",
	"maceio.br",
	"manaus.br",
	"maringa.br",
	"mat.br",
	"med.br",
	"mil.br",
	"morena.br",
	"mp.br",
	"mus.br",
	"natal.br",
	"net.br",
	"niteroi.br",
	"*.nom.br",
	"not.br",
	"ntr.br",
	"odo.br",
	"ong.br",
	"org.br",
	"osasco.br",
	"palmas.br",
	"poa.br",
	"ppg.br",
	"pro.br",
	"psc.br",
	"psi.br",
	"pvh.br",
	"qsl.br",
	"radio.br",
	"rec.br",
	"recife.br",
	"ribeirao.br",
	"rio.br",
	"riobranco.br",
	"riopreto.br",
	"salvador.br",
	"sampa.br",
	"santamaria.br",
	"santoandre.br",
	"saobernardo.br",
	"saogonca.br",
	"sjc.br",
	"slg.br",
	"slz.br",
	"sorocaba.br",
	"srv.br",
	"taxi.br",
	"tc.br",
	"teo.br",
	"the.br",
	"tmp.br",
	"trd.br",
	"tur.br",
	"tv.br",
	"udi.br",
	"vet.br",
	"vix.br",
	"vlog.br",
	"wiki.br",
	"zlg.br",
	"bs",
	"com.bs",
	"net.bs",
	"org.bs",
	"edu.bs",
	"gov.bs",
	"bt",
	"com.bt",
	"edu.bt",
	"gov.bt",
	"net.bt",
	"org.bt",
	"bv",
	"bw",
	"co.bw",
	"org.bw",
	"by",
	"gov.by",
	"mil.by",
	"com.by",
	"of.by",
	"bz",
	"com.bz",
	"net.bz",
	"org.bz",
	"edu.bz",
	"gov.bz",
	"ca",
	"ab.ca",
	"bc.ca",
	"mb.ca",
	"nb.ca",
	"nf.ca",
	"nl.ca",
	"ns.ca",
	"nt.ca",
	"nu.ca",
	"on.ca",
	"pe.ca",
	"qc.ca",
	"sk.ca",
	"yk.ca",
	"gc.ca",
	"cat",
	"cc",
	"cd",
	"gov.cd",
	"cf",
	"cg",
	"ch",
	"ci",
	"org.ci",
	"or.ci",
	"com.ci",
	"co.ci",
	"edu.ci",
	"ed.ci",
	"ac.ci",
	"net.ci",
	"go.ci",
	"asso.ci",
	"aéroport.ci",
	"int.ci",
	"presse.ci",
	"md.ci",
	"gouv.ci",
	"*.ck",
	"!www.ck",
	"cl",
	"gov.cl",
	"gob.cl",
	"co.cl",
	"mil.cl",
	"cm",
	"co.cm",
	"com.cm",
	"gov.cm",
	"net.cm",
	"cn",
	"ac.cn",
	"com.cn",
	"edu.cn",
	"gov.cn",
	"net.cn",
	"org.cn",
	"mil.cn",
	"公司.cn",
	"网络.cn",
	"網絡.cn",
	"ah.cn",
	"bj.cn",
	"cq.cn",
	"fj.cn",
	"gd.cn",
	"gs.cn",
	"gz.cn",
	"gx.cn",
	"ha.cn",
	"hb.cn",
	"he.cn",
	"hi.cn",
	"hl.cn",
	"hn.cn",
	"jl.cn",
	"js.cn",
	"jx.cn",
	"ln.cn",
	"nm.cn",
	"nx.cn",
	"qh.cn",
	"sc.cn",
	"sd.cn",
	"sh.cn",
	"sn.cn",
	"sx.cn",
	"tj.cn",
	"xj.cn",
	"xz.cn",
	"yn.cn",
	"zj.cn",
	"hk.cn",
	"mo.cn",
	"tw.cn",
	"co",
	"arts.co",
	"com.co",
	"edu.co",
	"firm.co",
	"gov.co",
	"info.co",
	"int.co",
	"mil.co",
	"net.co",
	"nom.co",
	"org.co",
	"rec.co",
	"web.co",
	"com",
	"coop",
	"cr",
	"ac.cr",
	"co.cr",
	"ed.cr",
	"fi.cr",
	"go.cr",
	"or.cr",
	"sa.cr",
	"cu",
	"com.cu",
	"edu.cu",
	"org.cu",
	"net.cu",
	"gov.cu",
	"inf.cu",
	"cv",
	"cw",
	"com.cw",
	"edu.cw",
	"net.cw",
	"org.cw",
	"cx",
	"gov.cx",
	"cy",
	"ac.cy",
	"biz.cy",
	"com.cy",
	"ekloges.cy",
	"gov.cy",
	"ltd.cy",
	"name.cy",
	"net.cy",
	"org.cy",
	"parliament.cy",
	"press.cy",
	"pro.cy",
	"tm.cy",
	"cz",
	"de",
	"dj",
	"dk",
	"dm",
	"com.dm",
	"net.dm",
	"org.dm",
	"edu.dm",
	"gov.dm",
	"do",
	"art.do",
	"com.do",
	"edu.do",
	"gob.do",
	"gov.do",
	"mil.do",
	"net.do",
	"org.do",
	"sld.do",
	"web.do",
	"dz",
	"com.dz",
	"org.dz",
	"net.dz",
	"gov.dz",
	"edu.dz",
	"asso.dz",
	"pol.dz",
	"art.dz",
	"ec",
	"com.ec",
	"info.ec",
	"net.ec",
	"fin.ec",
	"k12.ec",
	"med.ec",
	"pro.ec",
	"org.ec",
	"edu.ec",
	"gov.ec",
	"gob.ec",
	"mil.ec",
	"edu",
	"ee",
	"edu.ee",
	"gov.ee",
	"riik.ee",
	"lib.ee",
	"med.ee",
	"com.ee",
	"pri.ee",
	"aip.ee",
	"org.ee",
	"fie.ee",
	"eg",
	"com.eg",
	"edu.eg",
	"eun.eg",
	"gov.eg",
	"mil.eg",
	"name.eg",
	"net.eg",
	"org.eg",
	"sci.eg",
	"*.er",
	"es",
	"com.es",
	"nom.es",
	"org.es",
	"gob.es",
	"edu.es",
	"et",
	"com.et",
	"gov.et",
	"org.et",
	"edu.et",
	"biz.et",
	"name.et",
	"info.et",
	"net.et",
	"eu",
	"fi",
	"aland.fi",
	"*.fj",
	"*.fk",
	"fm",
	"fo",
	"fr",
	"asso.fr",
	"com.fr",
	"gouv.fr",
	"nom.fr",
	"prd.fr",
	"tm.fr",
	"aeroport.fr",
	"avocat.fr",
	"avoues.fr",
	"cci.fr",
	"chambagri.fr",
	"chirurgiens-dentistes.fr",
	"experts-comptables.fr",
	"geometre-expert.fr",
	"greta.fr",
	"huissier-justice.fr",
	"medecin.fr",
	"notaires.fr",
	"pharmacien.fr",
	"port.fr",
	"veterinaire.fr",
	"ga",
	"gb",
	"gd",
	"ge",
	"com.ge",
	"edu.ge",
	"gov.ge",
	"org.ge",
	"mil.ge",
	"net.ge",
	"pvt.ge",
	"gf",
	"gg",
	"co.gg",
	"net.gg",
	"org.gg",
	"gh",
	"com.gh",
	"edu.gh",
	"gov.gh",
	"org.gh",
	"mil.gh",
	"gi",
	"com.gi",
	"ltd.gi",
	"gov.gi",
	"mod.gi",
	"edu.gi",
	"org.gi",
	"gl",
	"co.gl",
	"com.gl",
	"edu.gl",
	"net.gl",
	"org.gl",
	"gm",
	"gn",
	"ac.gn",
	"com.gn",
	"edu.gn",
	"gov.gn",
	"org.gn",
	"net.gn",
	"gov",
	"gp",
	"com.gp",
	"net.gp",
	"mobi.gp",
	"edu.gp",
	"org.gp",
	"asso.gp",
	"gq",
	"gr",
	"com.gr",
	"edu.gr",
	"net.gr",
	"org.gr",
	"gov.gr",
	"gs",
	"gt",
	"com.gt",
	"edu.gt",
	"gob.gt",
	"ind.gt",
	"mil.gt",
	"net.gt",
	"org.gt",
	"gu",
	"com.gu",
	"edu.gu",
	"gov.gu",
	"guam.gu",
	"info.gu",
	"net.gu",
	"org.gu",
	"web.gu",
	"gw",
	"gy",
	"co.gy",
	"com.gy",
	"edu.gy",
	"gov.gy",
	"net.gy",
	"org.gy",
	"hk",
	"com.hk",
	"edu.hk",
	"gov.hk",
	"idv.hk",
	"net.hk",
	"org.hk",
	"公司.hk",
	"教育.hk",
	"敎育.hk",
	"政府.hk",
	"個人.hk",
	"个人.hk",
	"箇人.hk",
	"網络.hk",
	"网络.hk",
	"组織.hk",
	"網絡.hk",
	"网絡.hk",
	"组织.hk",
	"組織.hk",
	"組织.hk",
	"hm",
	"hn",
	"com.hn",
	"edu.hn",
	"org.hn",
	"net.hn",
	"mil.hn",
	"gob.hn",
	"hr",
	"iz.hr",
	"from.hr",
	"name.hr",
	"com.hr",
	"ht",
	"com.ht",
	"shop.ht",
	"firm.ht",
	"info.ht",
	"adult.ht",
	"net.ht",
	"pro.ht",
	"org.ht",
	"med.ht",
	"art.ht",
	"coop.ht",
	"pol.ht",
	"asso.ht",
	"edu.ht",
	"rel.ht",
	"gouv.ht",
	"perso.ht",
	"hu",
	"co.hu",
	"info.hu",
	"org.hu",
	"priv.hu",
	"sport.hu",
	"tm.hu",
	"2000.hu",
	"agrar.hu",
	"bolt.hu",
	"casino.hu",
	"city.hu",
	"erotica.hu",
	"erotika.hu",
	"film.hu",
	"forum.hu",
	"games.hu",
	"hotel.hu",
	"ingatlan.hu",
	"jogasz.hu",
	"konyvelo.hu",
	"lakas.hu",
	"media.hu",
	"news.hu",
	"reklam.hu",
	"sex.hu",
	"shop.hu",
	"suli.hu",
	"szex.hu",
	"tozsde.hu",
	"utazas.hu",
	"video.hu",
	"id",
	"ac.id",
	"biz.id",
	"co.id",
	"desa.id",
	"go.id",
	"mil.id",
	"my.id",
	"net.id",
	"or.id",
	"ponpes.id",
	"sch.id",
	"web.id",
	"ie",
	"gov.ie",
	"il",
	"ac.il",
	"co.il",
	"gov.il",
	"idf.il",
	"k12.il",
	"muni.il",
	"net.il",
	"org.il",
	"im",
	"ac.im",
	"co.im",
	"com.im",
	"ltd.co.im",
	"net.im",
	"org.im",
	"plc.co.im",
	"tt.im",
	"tv.im",
	"in",
	"co.in",
	"firm.in",
	"net.in",
	"org.in",
	"gen.in",
	"ind.in",
	"nic.in",
	"ac.in",
	"edu.in",
	"res.in",
	"gov.in",
	"mil.in",
	"info",
	"int",
	"eu.int",
	"io",
	"com.io",
	"iq",
	"gov.iq",
	"edu.iq",
	"mil.iq",
	"com.iq",
	"org.iq",
	"net.iq",
	"ir",
	"ac.ir",
	"co.ir",
	"gov.ir",
	"id.ir",
	"net.ir",
	"org.ir",
	"sch.ir",
	"ایران.ir",
	"ايران.ir",
	"is",
	"net.is",
	"com.is",
	"edu.is",
	"gov.is",
	"org.is",
	"int.is",
	"it",
	"gov.it",
	"edu.it",
	"abr.it",
	"abruzzo.it",
	"aosta-valley.it",
	"aostavalley.it",
	"bas.it",
	"basilicata.it",
	"cal.it",
	"calabria.it",
	"cam.it",
	"campania.it",
	"emilia-romagna.it",
	"emiliaromagna.it",
	"emr.it",
	"friuli-v-giulia.it",
	"friuli-ve-giulia.it",
	"friuli-vegiulia.it",
	"friuli-venezia-giulia.it",
	"friuli-veneziagiulia.it",
	"friuli-vgiulia.it",
	"friuliv-giulia.it",
	"friulive-giulia.it",
	"friulivegiulia.it",
	"friulivenezia-giulia.it",
	"friuliveneziagiulia.it",
	"friulivgiulia.it",
	"fvg.it",
	"laz.it",
	"lazio.it",
	"lig.it",
	"liguria.it",
	"lom.it",
	"lombardia.it",
	"lombardy.it",
	"lucania.it",
	"mar.it",
	"marche.it",
	"mol.it",
	"molise.it",
	"piedmont.it",
	"piemonte.it",
	"pmn.it",
	"pug.it",
	"puglia.it",
	"sar.it",
	"sardegna.it",
	"sardinia.it",
	"sic.it",
	"sicilia.it",
	"sicily.it",
	"taa.it",
	"tos.it",
	"toscana.it",
	"trentin-sud-tirol.it",
	"trentin-süd-tirol.it",
	"trentin-sudtirol.it",
	"trentin-südtirol.it",
	"trentin-sued-tirol.it",
	"trentin-suedtirol.it",
	"trentino-a-adige.it",
	"trentino-aadige.it",
	"trentino-alto-adige.it",
	"trentino-altoadige.it",
	"trentino-s-tirol.it",
	"trentino-stirol.it",
	"trentino-sud-tirol.it",
	"trentino-süd-tirol.it",
	"trentino-sudtirol.it",
	"trentino-südtirol.it",
	"trentino-sued-tirol.it",
	"trentino-suedtirol.it",
	"trentino.it",
	"trentinoa-adige.it",
	"trentinoaadige.it",
	"trentinoalto-adige.it",
	"trentinoaltoadige.it",
	"trentinos-tirol.it",
	"trentinostirol.it",
	"trentinosud-tirol.it",
	"trentinosüd-tirol.it",
	"trentinosudtirol.it",
	"trentinosüdtirol.it",
	"trentinosued-tirol.it",
	"trentinosuedtirol.it",
	"trentinsud-tirol.it",
	"trentinsüd-tirol.it",
	"trentinsudtirol.it",
	"trentinsüdtirol.it",
	"trentinsued-tirol.it",
	"trentinsuedtirol.it",
	"tuscany.it",
	"umb.it",
	"umbria.it",
	"val-d-aosta.it",
	"val-daosta.it",
	"vald-aosta.it",
	"valdaosta.it",
	"valle-aosta.it",
	"valle-d-aosta.it",
	"valle-daosta.it",
	"valleaosta.it",
	"valled-aosta.it",
	"valledaosta.it",
	"vallee-aoste.it",
	"vallée-aoste.it",
	"vallee-d-aoste.it",
	"vallée-d-aoste.it",
	"valleeaoste.it",
	"valléeaoste.it",
	"valleedaoste.it",
	"valléedaoste.it",
	"vao.it",
	"vda.it",
	"ven.it",
	"veneto.it",
	"ag.it",
	"agrigento.it",
	"al.it",
	"alessandria.it",
	"alto-adige.it",
	"altoadige.it",
	"an.it",
	"ancona.it",
	"andria-barletta-trani.it",
	"andria-trani-barletta.it",
	"andriabarlettatrani.it",
	"andriatranibarletta.it",
	"ao.it",
	"aosta.it",
	"aoste.it",
	"ap.it",
	"aq.it",
	"aquila.it",
	"ar.it",
	"arezzo.it",
	"ascoli-piceno.it",
	"ascolipiceno.it",
	"asti.it",
	"at.it",
	"av.it",
	"avellino.it",
	"ba.it",
	"balsan-sudtirol.it",
	"balsan-südtirol.it",
	"balsan-suedtirol.it",
	"balsan.it",
	"bari.it",
	"barletta-trani-andria.it",
	"barlettatraniandria.it",
	"belluno.it",
	"benevento.it",
	"bergamo.it",
	"bg.it",
	"bi.it",
	"biella.it",
	"bl.it",
	"bn.it",
	"bo.it",
	"bologna.it",
	"bolzano-altoadige.it",
	"bolzano.it",
	"bozen-sudtirol.it",
	"bozen-südtirol.it",
	"bozen-suedtirol.it",
	"bozen.it",
	"br.it",
	"brescia.it",
	"brindisi.it",
	"bs.it",
	"bt.it",
	"bulsan-sudtirol.it",
	"bulsan-südtirol.it",
	"bulsan-suedtirol.it",
	"bulsan.it",
	"bz.it",
	"ca.it",
	"cagliari.it",
	"caltanissetta.it",
	"campidano-medio.it",
	"campidanomedio.it",
	"campobasso.it",
	"carbonia-iglesias.it",
	"carboniaiglesias.it",
	"carrara-massa.it",
	"carraramassa.it",
	"caserta.it",
	"catania.it",
	"catanzaro.it",
	"cb.it",
	"ce.it",
	"cesena-forli.it",
	"cesena-forlì.it",
	"cesenaforli.it",
	"cesenaforlì.it",
	"ch.it",
	"chieti.it",
	"ci.it",
	"cl.it",
	"cn.it",
	"co.it",
	"como.it",
	"cosenza.it",
	"cr.it",
	"cremona.it",
	"crotone.it",
	"cs.it",
	"ct.it",
	"cuneo.it",
	"cz.it",
	"dell-ogliastra.it",
	"dellogliastra.it",
	"en.it",
	"enna.it",
	"fc.it",
	"fe.it",
	"fermo.it",
	"ferrara.it",
	"fg.it",
	"fi.it",
	"firenze.it",
	"florence.it",
	"fm.it",
	"foggia.it",
	"forli-cesena.it",
	"forlì-cesena.it",
	"forlicesena.it",
	"forlìcesena.it",
	"fr.it",
	"frosinone.it",
	"ge.it",
	"genoa.it",
	"genova.it",
	"go.it",
	"gorizia.it",
	"gr.it",
	"grosseto.it",
	"iglesias-carbonia.it",
	"iglesiascarbonia.it",
	"im.it",
	"imperia.it",
	"is.it",
	"isernia.it",
	"kr.it",
	"la-spezia.it",
	"laquila.it",
	"laspezia.it",
	"latina.it",
	"lc.it",
	"le.it",
	"lecce.it",
	"lecco.it",
	"li.it",
	"livorno.it",
	"lo.it",
	"lodi.it",
	"lt.it",
	"lu.it",
	"lucca.it",
	"macerata.it",
	"mantova.it",
	"massa-carrara.it",
	"massacarrara.it",
	"matera.it",
	"mb.it",
	"mc.it",
	"me.it",
	"medio-campidano.it",
	"mediocampidano.it",
	"messina.it",
	"mi.it",
	"milan.it",
	"milano.it",
	"mn.it",
	"mo.it",
	"modena.it",
	"monza-brianza.it",
	"monza-e-della-brianza.it",
	"monza.it",
	"monzabrianza.it",
	"monzaebrianza.it",
	"monzaedellabrianza.it",
	"ms.it",
	"mt.it",
	"na.it",
	"naples.it",
	"napoli.it",
	"no.it",
	"novara.it",
	"nu.it",
	"nuoro.it",
	"og.it",
	"ogliastra.it",
	"olbia-tempio.it",
	"olbiatempio.it",
	"or.it",
	"oristano.it",
	"ot.it",
	"pa.it",
	"padova.it",
	"padua.it",
	"palermo.it",
	"parma.it",
	"pavia.it",
	"pc.it",
	"pd.it",
	"pe.it",
	"perugia.it",
	"pesaro-urbino.it",
	"pesarourbino.it",
	"pescara.it",
	"pg.it",
	"pi.it",
	"piacenza.it",
	"pisa.it",
	"pistoia.it",
	"pn.it",
	"po.it",
	"pordenone.it",
	"potenza.it",
	"pr.it",
	"prato.it",
	"pt.it",
	"pu.it",
	"pv.it",
	"pz.it",
	"ra.it",
	"ragusa.it",
	"ravenna.it",
	"rc.it",
	"re.it",
	"reggio-calabria.it",
	"reggio-emilia.it",
	"reggiocalabria.it",
	"reggioemilia.it",
	"rg.it",
	"ri.it",
	"rieti.it",
	"rimini.it",
	"rm.it",
	"rn.it",
	"ro.it",
	"roma.it",
	"rome.it",
	"rovigo.it",
	"sa.it",
	"salerno.it",
	"sassari.it",
	"savona.it",
	"si.it",
	"siena.it",
	"siracusa.it",
	"so.it",
	"sondrio.it",
	"sp.it",
	"sr.it",
	"ss.it",
	"suedtirol.it",
	"südtirol.it",
	"sv.it",
	"ta.it",
	"taranto.it",
	"te.it",
	"tempio-olbia.it",
	"tempioolbia.it",
	"teramo.it",
	"terni.it",
	"tn.it",
	"to.it",
	"torino.it",
	"tp.it",
	"tr.it",
	"trani-andria-barletta.it",
	"trani-barletta-andria.it",
	"traniandriabarletta.it",
	"tranibarlettaandria.it",
	"trapani.it",
	"trento.it",
	"treviso.it",
	"trieste.it",
	"ts.it",
	"turin.it",
	"tv.it",
	"ud.it",
	"udine.it",
	"urbino-pesaro.it",
	"urbinopesaro.it",
	"va.it",
	"varese.it",
	"vb.it",
	"vc.it",
	"ve.it",
	"venezia.it",
	"venice.it",
	"verbania.it",
	"vercelli.it",
	"verona.it",
	"vi.it",
	"vibo-valentia.it",
	"vibovalentia.it",
	"vicenza.it",
	"viterbo.it",
	"vr.it",
	"vs.it",
	"vt.it",
	"vv.it",
	"je",
	"co.je",
	"net.je",
	"org.je",
	"*.jm",
	"jo",
	"com.jo",
	"org.jo",
	"net.jo",
	"edu.jo",
	"sch.jo",
	"gov.jo",
	"mil.jo",
	"name.jo",
	"jobs",
	"jp",
	"ac.jp",
	"ad.jp",
	"co.jp",
	"ed.jp",
	"go.jp",
	"gr.jp",
	"lg.jp",
	"ne.jp",
	"or.jp",
	"aichi.jp",
	"akita.jp",
	"aomori.jp",
	"chiba.jp",
	"ehime.jp",
	"fukui.jp",
	"fukuoka.jp",
	"fukushima.jp",
	"gifu.jp",
	"gunma.jp",
	"hiroshima.jp",
	"hokkaido.jp",
	"hyogo.jp",
	"ibaraki.jp",
	"ishikawa.jp",
	"iwate.jp",
	"kagawa.jp",
	"kagoshima.jp",
	"kanagawa.jp",
	"kochi.jp",
	"kumamoto.jp",
	"kyoto.jp",
	"mie.jp",
	"miyagi.jp",
	"miyazaki.jp",
	"nagano.jp",
	"nagasaki.jp",
	"nara.jp",
	"niigata.jp",
	"oita.jp",
	"okayama.jp",
	"okinawa.jp",
	"osaka.jp",
	"saga.jp",
	"saitama.jp",
	"shiga.jp",
	"shimane.jp",
	"shizuoka.jp",
	"tochigi.jp",
	"tokushima.jp",
	"tokyo.jp",
	"tottori.jp",
	"toyama.jp",
	"wakayama.jp",
	"yamagata.jp",
	"yamaguchi.jp",
	"yamanashi.jp",
	"栃木.jp",
	"愛知.jp",
	"愛媛.jp",
	"兵庫.jp",
	"熊本.jp",
	"茨城.jp",
	"北海道.jp",
	"千葉.jp",
	"和歌山.jp",
	"長崎.jp",
	"長野.jp",
	"新潟.jp",
	"青森.jp",
	"静岡.jp",
	"東京.jp",
	"石川.jp",
	"埼玉.jp",
	"三重.jp",
	"京都.jp",
	"佐賀.jp",
	"大分.jp",
	"大阪.jp",
	"奈良.jp",
	"宮城.jp",
	"宮崎.jp",
	"富山.jp",
	"山口.jp",
	"山形.jp",
	"山梨.jp",
	"岩手.jp",
	"岐阜.jp",
	"岡山.jp",
	"島根.jp",
	"広島.jp",
	"徳島.jp",
	"沖縄.jp",
	"滋賀.jp",
	"神奈川.jp",
	"福井.jp",
	"福岡.jp",
	"福島.jp",
	"秋田.jp",
	"群馬.jp",
	"香川.jp",
	"高知.jp",
	"鳥取.jp",
	"鹿児島.jp",
	"*.kawasaki.jp",
	"*.kitakyushu.jp",
	"*.kobe.jp",
	"*.nagoya.jp",
	"*.sapporo.jp",
	"*.sendai.jp",
	"*.yokohama.jp",
	"!city.kawasaki.jp",
	"!city.kitakyushu.jp",
	"!city.kobe.jp",
	"!city.nagoya.jp",
	"!city.sapporo.jp",
	"!city.sendai.jp",
	"!city.yokohama.jp",
	"aisai.aichi.jp",
	"ama.aichi.jp",
	"anjo.aichi.jp",
	"asuke.aichi.jp",
	"chiryu.aichi.jp",
	"chita.aichi.jp",
	"fuso.aichi.jp",
	"gamagori.aichi.jp",
	"handa.aichi.jp",
	"hazu.aichi.jp",
	"hekinan.aichi.jp",
	"higashiura.aichi.jp",
	"ichinomiya.aichi.jp",
	"inazawa.aichi.jp",
	"inuyama.aichi.jp",
	"isshiki.aichi.jp",
	"iwakura.aichi.jp",
	"kanie.aichi.jp",
	"kariya.aichi.jp",
	"kasugai.aichi.jp",
	"kira.aichi.jp",
	"kiyosu.aichi.jp",
	"komaki.aichi.jp",
	"konan.aichi.jp",
	"kota.aichi.jp",
	"mihama.aichi.jp",
	"miyoshi.aichi.jp",
	"nishio.aichi.jp",
	"nisshin.aichi.jp",
	"obu.aichi.jp",
	"oguchi.aichi.jp",
	"oharu.aichi.jp",
	"okazaki.aichi.jp",
	"owariasahi.aichi.jp",
	"seto.aichi.jp",
	"shikatsu.aichi.jp",
	"shinshiro.aichi.jp",
	"shitara.aichi.jp",
	"tahara.aichi.jp",
	"takahama.aichi.jp",
	"tobishima.aichi.jp",
	"toei.aichi.jp",
	"togo.aichi.jp",
	"tokai.aichi.jp",
	"tokoname.aichi.jp",
	"toyoake.aichi.jp",
	"toyohashi.aichi.jp",
	"toyokawa.aichi.jp",
	"toyone.aichi.jp",
	"toyota.aichi.jp",
	"tsushima.aichi.jp",
	"yatomi.aichi.jp",
	"akita.akita.jp",
	"daisen.akita.jp",
	"fujisato.akita.jp",
	"gojome.akita.jp",
	"hachirogata.akita.jp",
	"happou.akita.jp",
	"higashinaruse.akita.jp",
	"honjo.akita.jp",
	"honjyo.akita.jp",
	"ikawa.akita.jp",
	"kamikoani.akita.jp",
	"kamioka.akita.jp",
	"katagami.akita.jp",
	"kazuno.akita.jp",
	"kitaakita.akita.jp",
	"kosaka.akita.jp",
	"kyowa.akita.jp",
	"misato.akita.jp",
	"mitane.akita.jp",
	"moriyoshi.akita.jp",
	"nikaho.akita.jp",
	"noshiro.akita.jp",
	"odate.akita.jp",
	"oga.akita.jp",
	"ogata.akita.jp",
	"semboku.akita.jp",
	"yokote.akita.jp",
	"yurihonjo.akita.jp",
	"aomori.aomori.jp",
	"gonohe.aomori.jp",
	"hachinohe.aomori.jp",
	"hashikami.aomori.jp",
	"hiranai.aomori.jp",
	"hirosaki.aomori.jp",
	"itayanagi.aomori.jp",
	"kuroishi.aomori.jp",
	"misawa.aomori.jp",
	"mutsu.aomori.jp",
	"nakadomari.aomori.jp",
	"noheji.aomori.jp",
	"oirase.aomori.jp",
	"owani.aomori.jp",
	"rokunohe.aomori.jp",
	"sannohe.aomori.jp",
	"shichinohe.aomori.jp",
	"shingo.aomori.jp",
	"takko.aomori.jp",
	"towada.aomori.jp",
	"tsugaru.aomori.jp",
	"tsuruta.aomori.jp",
	"abiko.chiba.jp",
	"asahi.chiba.jp",
	"chonan.chiba.jp",
	"chosei.chiba.jp",
	"choshi.chiba.jp",
	"chuo.chiba.jp",
	"funabashi.chiba.jp",
	"futtsu.chiba.jp",
	"hanamigawa.chiba.jp",
	"ichihara.chiba.jp",
	"ichikawa.chiba.jp",
	"ichinomiya.chiba.jp",
	"inzai.chiba.jp",
	"isumi.chiba.jp",
	"kamagaya.chiba.jp",
	"kamogawa.chiba.jp",
	"kashiwa.chiba.jp",
	"katori.chiba.jp",
	"katsuura.chiba.jp",
	"kimitsu.chiba.jp",
	"kisarazu.chiba.jp",
	"kozaki.chiba.jp",
	"kujukuri.chiba.jp",
	"kyonan.chiba.jp",
	"matsudo.chiba.jp",
	"midori.chiba.jp",
	"mihama.chiba.jp",
	"minamiboso.chiba.jp",
	"mobara.chiba.jp",
	"mutsuzawa.chiba.jp",
	"nagara.chiba.jp",
	"nagareyama.chiba.jp",
	"narashino.chiba.jp",
	"narita.chiba.jp",
	"noda.chiba.jp",
	"oamishirasato.chiba.jp",
	"omigawa.chiba.jp",
	"onjuku.chiba.jp",
	"otaki.chiba.jp",
	"sakae.chiba.jp",
	"sakura.chiba.jp",
	"shimofusa.chiba.jp",
	"shirako.chiba.jp",
	"shiroi.chiba.jp",
	"shisui.chiba.jp",
	"sodegaura.chiba.jp",
	"sosa.chiba.jp",
	"tako.chiba.jp",
	"tateyama.chiba.jp",
	"togane.chiba.jp",
	"tohnosho.chiba.jp",
	"tomisato.chiba.jp",
	"urayasu.chiba.jp",
	"yachimata.chiba.jp",
	"yachiyo.chiba.jp",
	"yokaichiba.chiba.jp",
	"yokoshibahikari.chiba.jp",
	"yotsukaido.chiba.jp",
	"ainan.ehime.jp",
	"honai.ehime.jp",
	"ikata.ehime.jp",
	"imabari.ehime.jp",
	"iyo.ehime.jp",
	"kamijima.ehime.jp",
	"kihoku.ehime.jp",
	"kumakogen.ehime.jp",
	"masaki.ehime.jp",
	"matsuno.ehime.jp",
	"matsuyama.ehime.jp",
	"namikata.ehime.jp",
	"niihama.ehime.jp",
	"ozu.ehime.jp",
	"saijo.ehime.jp",
	"seiyo.ehime.jp",
	"shikokuchuo.ehime.jp",
	"tobe.ehime.jp",
	"toon.ehime.jp",
	"uchiko.ehime.jp",
	"uwajima.ehime.jp",
	"yawatahama.ehime.jp",
	"echizen.fukui.jp",
	"eiheiji.fukui.jp",
	"fukui.fukui.jp",
	"ikeda.fukui.jp",
	"katsuyama.fukui.jp",
	"mihama.fukui.jp",
	"minamiechizen.fukui.jp",
	"obama.fukui.jp",
	"ohi.fukui.jp",
	"ono.fukui.jp",
	"sabae.fukui.jp",
	"sakai.fukui.jp",
	"takahama.fukui.jp",
	"tsuruga.fukui.jp",
	"wakasa.fukui.jp",
	"ashiya.fukuoka.jp",
	"buzen.fukuoka.jp",
	"chikugo.fukuoka.jp",
	"chikuho.fukuoka.jp",
	"chikujo.fukuoka.jp",
	"chikushino.fukuoka.jp",
	"chikuzen.fukuoka.jp",
	"chuo.fukuoka.jp",
	"dazaifu.fukuoka.jp",
	"fukuchi.fukuoka.jp",
	"hakata.fukuoka.jp",
	"higashi.fukuoka.jp",
	"hirokawa.fukuoka.jp",
	"hisayama.fukuoka.jp",
	"iizuka.fukuoka.jp",
	"inatsuki.fukuoka.jp",
	"kaho.fukuoka.jp",
	"kasuga.fukuoka.jp",
	"kasuya.fukuoka.jp",
	"kawara.fukuoka.jp",
	"keisen.fukuoka.jp",
	"koga.fukuoka.jp",
	"kurate.fukuoka.jp",
	"kurogi.fukuoka.jp",
	"kurume.fukuoka.jp",
	"minami.fukuoka.jp",
	"miyako.fukuoka.jp",
	"miyama.fukuoka.jp",
	"miyawaka.fukuoka.jp",
	"mizumaki.fukuoka.jp",
	"munakata.fukuoka.jp",
	"nakagawa.fukuoka.jp",
	"nakama.fukuoka.jp",
	"nishi.fukuoka.jp",
	"nogata.fukuoka.jp",
	"ogori.fukuoka.jp",
	"okagaki.fukuoka.jp",
	"okawa.fukuoka.jp",
	"oki.fukuoka.jp",
	"omuta.fukuoka.jp",
	"onga.fukuoka.jp",
	"onojo.fukuoka.jp",
	"oto.fukuoka.jp",
	"saigawa.fukuoka.jp",
	"sasaguri.fukuoka.jp",
	"shingu.fukuoka.jp",
	"shinyoshitomi.fukuoka.jp",
	"shonai.fukuoka.jp",
	"soeda.fukuoka.jp",
	"sue.fukuoka.jp",
	"tachiarai.fukuoka.jp",
	"tagawa.fukuoka.jp",
	"takata.fukuoka.jp",
	"toho.fukuoka.jp",
	"toyotsu.fukuoka.jp",
	"tsuiki.fukuoka.jp",
	"ukiha.fukuoka.jp",
	"umi.fukuoka.jp",
	"usui.fukuoka.jp",
	"yamada.fukuoka.jp",
	"yame.fukuoka.jp",
	"yanagawa.fukuoka.jp",
	"yukuhashi.fukuoka.jp",
	"aizubange.fukushima.jp",
	"aizumisato.fukushima.jp",
	"aizuwakamatsu.fukushima.jp",
	"asakawa.fukushima.jp",
	"bandai.fukushima.jp",
	"date.fukushima.jp",
	"fukushima.fukushima.jp",
	"furudono.fukushima.jp",
	"futaba.fukushima.jp",
	"hanawa.fukushima.jp",
	"higashi.fukushima.jp",
	"hirata.fukushima.jp",
	"hirono.fukushima.jp",
	"iitate.fukushima.jp",
	"inawashiro.fukushima.jp",
	"ishikawa.fukushima.jp",
	"iwaki.fukushima.jp",
	"izumizaki.fukushima.jp",
	"kagamiishi.fukushima.jp",
	"kaneyama.fukushima.jp",
	"kawamata.fukushima.jp",
	"kitakata.fukushima.jp",
	"kitashiobara.fukushima.jp",
	"koori.fukushima.jp",
	"koriyama.fukushima.jp",
	"kunimi.fukushima.jp",
	"miharu.fukushima.jp",
	"mishima.fukushima.jp",
	"namie.fukushima.jp",
	"nango.fukushima.jp",
	"nishiaizu.fukushima.jp",
	"nishigo.fukushima.jp",
	"okuma.fukushima.jp",
	"omotego.fukushima.jp",
	"ono.fukushima.jp",
	"otama.fukushima.jp",
	"samegawa.fukushima.jp",
	"shimogo.fukushima.jp",
	"shirakawa.fukushima.jp",
	"showa.fukushima.jp",
	"soma.fukushima.jp",
	"sukagawa.fukushima.jp",
	"taishin.fukushima.jp",
	"tamakawa.fukushima.jp",
	"tanagura.fukushima.jp",
	"tenei.fukushima.jp",
	"yabuki.fukushima.jp",
	"yamato.fukushima.jp",
	"yamatsuri.fukushima.jp",
	"yanaizu.fukushima.jp",
	"yugawa.fukushima.jp",
	"anpachi.gifu.jp",
	"ena.gifu.jp",
	"gifu.gifu.jp",
	"ginan.gifu.jp",
	"godo.gifu.jp",
	"gujo.gifu.jp",
	"hashima.gifu.jp",
	"hichiso.gifu.jp",
	"hida.gifu.jp",
	"higashishirakawa.gifu.jp",
	"ibigawa.gifu.jp",
	"ikeda.gifu.jp",
	"kakamigahara.gifu.jp",
	"kani.gifu.jp",
	"kasahara.gifu.jp",
	"kasamatsu.gifu.jp",
	"kawaue.gifu.jp",
	"kitagata.gifu.jp",
	"mino.gifu.jp",
	"minokamo.gifu.jp",
	"mitake.gifu.jp",
	"mizunami.gifu.jp",
	"motosu.gifu.jp",
	"nakatsugawa.gifu.jp",
	"ogaki.gifu.jp",
	"sakahogi.gifu.jp",
	"seki.gifu.jp",
	"sekigahara.gifu.jp",
	"shirakawa.gifu.jp",
	"tajimi.gifu.jp",
	"takayama.gifu.jp",
	"tarui.gifu.jp",
	"toki.gifu.jp",
	"tomika.gifu.jp",
	"wanouchi.gifu.jp",
	"yamagata.gifu.jp",
	"yaotsu.gifu.jp",
	"yoro.gifu.jp",
	"annaka.gunma.jp",
	"chiyoda.gunma.jp",
	"fujioka.gunma.jp",
	"higashiagatsuma.gunma.jp",
	"isesaki.gunma.jp",
	"itakura.gunma.jp",
	"kanna.gunma.jp",
	"kanra.gunma.jp",
	"katashina.gunma.jp",
	"kawaba.gunma.jp",
	"kiryu.gunma.jp",
	"kusatsu.gunma.jp",
	"maebashi.gunma.jp",
	"meiwa.gunma.jp",
	"midori.gunma.jp",
	"minakami.gunma.jp",
	"naganohara.gunma.jp",
	"nakanojo.gunma.jp",
	"nanmoku.gunma.jp",
	"numata.gunma.jp",
	"oizumi.gunma.jp",
	"ora.gunma.jp",
	"ota.gunma.jp",
	"shibukawa.gunma.jp",
	"shimonita.gunma.jp",
	"shinto.gunma.jp",
	"showa.gunma.jp",
	"takasaki.gunma.jp",
	"takayama.gunma.jp",
	"tamamura.gunma.jp",
	"tatebayashi.gunma.jp",
	"tomioka.gunma.jp",
	"tsukiyono.gunma.jp",
	"tsumagoi.gunma.jp",
	"ueno.gunma.jp",
	"yoshioka.gunma.jp",
	"asaminami.hiroshima.jp",
	"daiwa.hiroshima.jp",
	"etajima.hiroshima.jp",
	"fuchu.hiroshima.jp",
	"fukuyama.hiroshima.jp",
	"hatsukaichi.hiroshima.jp",
	"higashihiroshima.hiroshima.jp",
	"hongo.hiroshima.jp",
	"jinsekikogen.hiroshima.jp",
	"kaita.hiroshima.jp",
	"kui.hiroshima.jp",
	"kumano.hiroshima.jp",
	"kure.hiroshima.jp",
	"mihara.hiroshima.jp",
	"miyoshi.hiroshima.jp",
	"naka.hiroshima.jp",
	"onomichi.hiroshima.jp",
	"osakikamijima.hiroshima.jp",
	"otake.hiroshima.jp",
	"saka.hiroshima.jp",
	"sera.hiroshima.jp",
	"seranishi.hiroshima.jp",
	"shinichi.hiroshima.jp",
	"shobara.hiroshima.jp",
	"takehara.hiroshima.jp",
	"abashiri.hokkaido.jp",
	"abira.hokkaido.jp",
	"aibetsu.hokkaido.jp",
	"akabira.hokkaido.jp",
	"akkeshi.hokkaido.jp",
	"asahikawa.hokkaido.jp",
	"ashibetsu.hokkaido.jp",
	"ashoro.hokkaido.jp",
	"assabu.hokkaido.jp",
	"atsuma.hokkaido.jp",
	"bibai.hokkaido.jp",
	"biei.hokkaido.jp",
	"bifuka.hokkaido.jp",
	"bihoro.hokkaido.jp",
	"biratori.hokkaido.jp",
	"chippubetsu.hokkaido.jp",
	"chitose.hokkaido.jp",
	"date.hokkaido.jp",
	"ebetsu.hokkaido.jp",
	"embetsu.hokkaido.jp",
	"eniwa.hokkaido.jp",
	"erimo.hokkaido.jp",
	"esan.hokkaido.jp",
	"esashi.hokkaido.jp",
	"fukagawa.hokkaido.jp",
	"fukushima.hokkaido.jp",
	"furano.hokkaido.jp",
	"furubira.hokkaido.jp",
	"haboro.hokkaido.jp",
	"hakodate.hokkaido.jp",
	"hamatonbetsu.hokkaido.jp",
	"hidaka.hokkaido.jp",
	"higashikagura.hokkaido.jp",
	"higashikawa.hokkaido.jp",
	"hiroo.hokkaido.jp",
	"hokuryu.hokkaido.jp",
	"hokuto.hokkaido.jp",
	"honbetsu.hokkaido.jp",
	"horokanai.hokkaido.jp",
	"horonobe.hokkaido.jp",
	"ikeda.hokkaido.jp",
	"imakane.hokkaido.jp",
	"ishikari.hokkaido.jp",
	"iwamizawa.hokkaido.jp",
	"iwanai.hokkaido.jp",
	"kamifurano.hokkaido.jp",
	"kamikawa.hokkaido.jp",
	"kamishihoro.hokkaido.jp",
	"kamisunagawa.hokkaido.jp",
	"kamoenai.hokkaido.jp",
	"kayabe.hokkaido.jp",
	"kembuchi.hokkaido.jp",
	"kikonai.hokkaido.jp",
	"kimobetsu.hokkaido.jp",
	"kitahiroshima.hokkaido.jp",
	"kitami.hokkaido.jp",
	"kiyosato.hokkaido.jp",
	"koshimizu.hokkaido.jp",
	"kunneppu.hokkaido.jp",
	"kuriyama.hokkaido.jp",
	"kuromatsunai.hokkaido.jp",
	"kushiro.hokkaido.jp",
	"kutchan.hokkaido.jp",
	"kyowa.hokkaido.jp",
	"mashike.hokkaido.jp",
	"matsumae.hokkaido.jp",
	"mikasa.hokkaido.jp",
	"minamifurano.hokkaido.jp",
	"mombetsu.hokkaido.jp",
	"moseushi.hokkaido.jp",
	"mukawa.hokkaido.jp",
	"muroran.hokkaido.jp",
	"naie.hokkaido.jp",
	"nakagawa.hokkaido.jp",
	"nakasatsunai.hokkaido.jp",
	"nakatombetsu.hokkaido.jp",
	"nanae.hokkaido.jp",
	"nanporo.hokkaido.jp",
	"nayoro.hokkaido.jp",
	"nemuro.hokkaido.jp",
	"niikappu.hokkaido.jp",
	"niki.hokkaido.jp",
	"nishiokoppe.hokkaido.jp",
	"noboribetsu.hokkaido.jp",
	"numata.hokkaido.jp",
	"obihiro.hokkaido.jp",
	"obira.hokkaido.jp",
	"oketo.hokkaido.jp",
	"okoppe.hokkaido.jp",
	"otaru.hokkaido.jp",
	"otobe.hokkaido.jp",
	"otofuke.hokkaido.jp",
	"otoineppu.hokkaido.jp",
	"oumu.hokkaido.jp",
	"ozora.hokkaido.jp",
	"pippu.hokkaido.jp",
	"rankoshi.hokkaido.jp",
	"rebun.hokkaido.jp",
	"rikubetsu.hokkaido.jp",
	"rishiri.hokkaido.jp",
	"rishirifuji.hokkaido.jp",
	"saroma.hokkaido.jp",
	"sarufutsu.hokkaido.jp",
	"shakotan.hokkaido.jp",
	"shari.hokkaido.jp",
	"shibecha.hokkaido.jp",
	"shibetsu.hokkaido.jp",
	"shikabe.hokkaido.jp",
	"shikaoi.hokkaido.jp",
	"shimamaki.hokkaido.jp",
	"shimizu.hokkaido.jp",
	"shimokawa.hokkaido.jp",
	"shinshinotsu.hokkaido.jp",
	"shintoku.hokkaido.jp",
	"shiranuka.hokkaido.jp",
	"shiraoi.hokkaido.jp",
	"shiriuchi.hokkaido.jp",
	"sobetsu.hokkaido.jp",
	"sunagawa.hokkaido.jp",
	"taiki.hokkaido.jp",
	"takasu.hokkaido.jp",
	"takikawa.hokkaido.jp",
	"takinoue.hokkaido.jp",
	"teshikaga.hokkaido.jp",
	"tobetsu.hokkaido.jp",
	"tohma.hokkaido.jp",
	"tomakomai.hokkaido.jp",
	"tomari.hokkaido.jp",
	"toya.hokkaido.jp",
	"toyako.hokkaido.jp",
	"toyotomi.hokkaido.jp",
	"toyoura.hokkaido.jp",
	"tsubetsu.hokkaido.jp",
	"tsukigata.hokkaido.jp",
	"urakawa.hokkaido.jp",
	"urausu.hokkaido.jp",
	"uryu.hokkaido.jp",
	"utashinai.hokkaido.jp",
	"wakkanai.hokkaido.jp",
	"wassamu.hokkaido.jp",
	"yakumo.hokkaido.jp",
	"yoichi.hokkaido.jp",
	"aioi.hyogo.jp",
	"akashi.hyogo.jp",
	"ako.hyogo.jp",
	"amagasaki.hyogo.jp",
	"aogaki.hyogo.jp",
	"asago.hyogo.jp",
	"ashiya.hyogo.jp",
	"awaji.hyogo.jp",
	"fukusaki.hyogo.jp",
	"goshiki.hyogo.jp",
	"harima.hyogo.jp",
	"himeji.hyogo.jp",
	"ichikawa.hyogo.jp",
	"inagawa.hyogo.jp",
	"itami.hyogo.jp",
	"kakogawa.hyogo.jp",
	"kamigori.hyogo.jp",
	"kamikawa.hyogo.jp",
	"kasai.hyogo.jp",
	"kasuga.hyogo.jp",
	"kawanishi.hyogo.jp",
	"miki.hyogo.jp",
	"minamiawaji.hyogo.jp",
	"nishinomiya.hyogo.jp",
	"nishiwaki.hyogo.jp",
	"ono.hyogo.jp",
	"sanda.hyogo.jp",
	"sannan.hyogo.jp",
	"sasayama.hyogo.jp",
	"sayo.hyogo.jp",
	"shingu.hyogo.jp",
	"shinonsen.hyogo.jp",
	"shiso.hyogo.jp",
	"sumoto.hyogo.jp",
	"taishi.hyogo.jp",
	"taka.hyogo.jp",
	"takarazuka.hyogo.jp",
	"takasago.hyogo.jp",
	"takino.hyogo.jp",
	"tamba.hyogo.jp",
	"tatsuno.hyogo.jp",
	"toyooka.hyogo.jp",
	"yabu.hyogo.jp",
	"yashiro.hyogo.jp",
	"yoka.hyogo.jp",
	"yokawa.hyogo.jp",
	"ami.ibaraki.jp",
	"asahi.ibaraki.jp",
	"bando.ibaraki.jp",
	"chikusei.ibaraki.jp",
	"daigo.ibaraki.jp",
	"fujishiro.ibaraki.jp",
	"hitachi.ibaraki.jp",
	"hitachinaka.ibaraki.jp",
	"hitachiomiya.ibaraki.jp",
	"hitachiota.ibaraki.jp",
	"ibaraki.ibaraki.jp",
	"ina.ibaraki.jp",
	"inashiki.ibaraki.jp",
	"itako.ibaraki.jp",
	"iwama.ibaraki.jp",
	"joso.ibaraki.jp",
	"kamisu.ibaraki.jp",
	"kasama.ibaraki.jp",
	"kashima.ibaraki.jp",
	"kasumigaura.ibaraki.jp",
	"koga.ibaraki.jp",
	"miho.ibaraki.jp",
	"mito.ibaraki.jp",
	"moriya.ibaraki.jp",
	"naka.ibaraki.jp",
	"namegata.ibaraki.jp",
	"oarai.ibaraki.jp",
	"ogawa.ibaraki.jp",
	"omitama.ibaraki.jp",
	"ryugasaki.ibaraki.jp",
	"sakai.ibaraki.jp",
	"sakuragawa.ibaraki.jp",
	"shimodate.ibaraki.jp",
	"shimotsuma.ibaraki.jp",
	"shirosato.ibaraki.jp",
	"sowa.ibaraki.jp",
	"suifu.ibaraki.jp",
	"takahagi.ibaraki.jp",
	"tamatsukuri.ibaraki.jp",
	"tokai.ibaraki.jp",
	"tomobe.ibaraki.jp",
	"tone.ibaraki.jp",
	"toride.ibaraki.jp",
	"tsuchiura.ibaraki.jp",
	"tsukuba.ibaraki.jp",
	"uchihara.ibaraki.jp",
	"ushiku.ibaraki.jp",
	"yachiyo.ibaraki.jp",
	"yamagata.ibaraki.jp",
	"yawara.ibaraki.jp",
	"yuki.ibaraki.jp",
	"anamizu.ishikawa.jp",
	"hakui.ishikawa.jp",
	"hakusan.ishikawa.jp",
	"kaga.ishikawa.jp",
	"kahoku.ishikawa.jp",
	"kanazawa.ishikawa.jp",
	"kawakita.ishikawa.jp",
	"komatsu.ishikawa.jp",
	"nakanoto.ishikawa.jp",
	"nanao.ishikawa.jp",
	"nomi.ishikawa.jp",
	"nonoichi.ishikawa.jp",
	"noto.ishikawa.jp",
	"shika.ishikawa.jp",
	"suzu.ishikawa.jp",
	"tsubata.ishikawa.jp",
	"tsurugi.ishikawa.jp",
	"uchinada.ishikawa.jp",
	"wajima.ishikawa.jp",
	"fudai.iwate.jp",
	"fujisawa.iwate.jp",
	"hanamaki.iwate.jp",
	"hiraizumi.iwate.jp",
	"hirono.iwate.jp",
	"ichinohe.iwate.jp",
	"ichinoseki.iwate.jp",
	"iwaizumi.iwate.jp",
	"iwate.iwate.jp",
	"joboji.iwate.jp",
	"kamaishi.iwate.jp",
	"kanegasaki.iwate.jp",
	"karumai.iwate.jp",
	"kawai.iwate.jp",
	"kitakami.iwate.jp",
	"kuji.iwate.jp",
	"kunohe.iwate.jp",
	"kuzumaki.iwate.jp",
	"miyako.iwate.jp",
	"mizusawa.iwate.jp",
	"morioka.iwate.jp",
	"ninohe.iwate.jp",
	"noda.iwate.jp",
	"ofunato.iwate.jp",
	"oshu.iwate.jp",
	"otsuchi.iwate.jp",
	"rikuzentakata.iwate.jp",
	"shiwa.iwate.jp",
	"shizukuishi.iwate.jp",
	"sumita.iwate.jp",
	"tanohata.iwate.jp",
	"tono.iwate.jp",
	"yahaba.iwate.jp",
	"yamada.iwate.jp",
	"ayagawa.kagawa.jp",
	"higashikagawa.kagawa.jp",
	"kanonji.kagawa.jp",
	"kotohira.kagawa.jp",
	"manno.kagawa.jp",
	"marugame.kagawa.jp",
	"mitoyo.kagawa.jp",
	"naoshima.kagawa.jp",
	"sanuki.kagawa.jp",
	"tadotsu.kagawa.jp",
	"takamatsu.kagawa.jp",
	"tonosho.kagawa.jp",
	"uchinomi.kagawa.jp",
	"utazu.kagawa.jp",
	"zentsuji.kagawa.jp",
	"akune.kagoshima.jp",
	"amami.kagoshima.jp",
	"hioki.kagoshima.jp",
	"isa.kagoshima.jp",
	"isen.kagoshima.jp",
	"izumi.kagoshima.jp",
	"kagoshima.kagoshima.jp",
	"kanoya.kagoshima.jp",
	"kawanabe.kagoshima.jp",
	"kinko.kagoshima.jp",
	"kouyama.kagoshima.jp",
	"makurazaki.kagoshima.jp",
	"matsumoto.kagoshima.jp",
	"minamitane.kagoshima.jp",
	"nakatane.kagoshima.jp",
	"nishinoomote.kagoshima.jp",
	"satsumasendai.kagoshima.jp",
	"soo.kagoshima.jp",
	"tarumizu.kagoshima.jp",
	"yusui.kagoshima.jp",
	"aikawa.kanagawa.jp",
	"atsugi.kanagawa.jp",
	"ayase.kanagawa.jp",
	"chigasaki.kanagawa.jp",
	"ebina.kanagawa.jp",
	"fujisawa.kanagawa.jp",
	"hadano.kanagawa.jp",
	"hakone.kanagawa.jp",
	"hiratsuka.kanagawa.jp",
	"isehara.kanagawa.jp",
	"kaisei.kanagawa.jp",
	"kamakura.kanagawa.jp",
	"kiyokawa.kanagawa.jp",
	"matsuda.kanagawa.jp",
	"minamiashigara.kanagawa.jp",
	"miura.kanagawa.jp",
	"nakai.kanagawa.jp",
	"ninomiya.kanagawa.jp",
	"odawara.kanagawa.jp",
	"oi.kanagawa.jp",
	"oiso.kanagawa.jp",
	"sagamihara.kanagawa.jp",
	"samukawa.kanagawa.jp",
	"tsukui.kanagawa.jp",
	"yamakita.kanagawa.jp",
	"yamato.kanagawa.jp",
	"yokosuka.kanagawa.jp",
	"yugawara.kanagawa.jp",
	"zama.kanagawa.jp",
	"zushi.kanagawa.jp",
	"aki.kochi.jp",
	"geisei.kochi.jp",
	"hidaka.kochi.jp",
	"higashitsuno.kochi.jp",
	"ino.kochi.jp",
	"kagami.kochi.jp",
	"kami.kochi.jp",
	"kitagawa.kochi.jp",
	"kochi.kochi.jp",
	"mihara.kochi.jp",
	"motoyama.kochi.jp",
	"muroto.kochi.jp",
	"nahari.kochi.jp",
	"nakamura.kochi.jp",
	"nankoku.kochi.jp",
	"nishitosa.kochi.jp",
	"niyodogawa.kochi.jp",
	"ochi.kochi.jp",
	"okawa.kochi.jp",
	"otoyo.kochi.jp",
	"otsuki.kochi.jp",
	"sakawa.kochi.jp",
	"sukumo.kochi.jp",
	"susaki.kochi.jp",
	"tosa.kochi.jp",
	"tosashimizu.kochi.jp",
	"toyo.kochi.jp",
	"tsuno.kochi.jp",
	"umaji.kochi.jp",
	"yasuda.kochi.jp",
	"yusuhara.kochi.jp",
	"amakusa.kumamoto.jp",
	"arao.kumamoto.jp",
	"aso.kumamoto.jp",
	"choyo.kumamoto.jp",
	"gyokuto.kumamoto.jp",
	"kamiamakusa.kumamoto.jp",
	"kikuchi.kumamoto.jp",
	"kumamoto.kumamoto.jp",
	"mashiki.kumamoto.jp",
	"mifune.kumamoto.jp",
	"minamata.kumamoto.jp",
	"minamioguni.kumamoto.jp",
	"nagasu.kumamoto.jp",
	"nishihara.kumamoto.jp",
	"oguni.kumamoto.jp",
	"ozu.kumamoto.jp",
	"sumoto.kumamoto.jp",
	"takamori.kumamoto.jp",
	"uki.kumamoto.jp",
	"uto.kumamoto.jp",
	"yamaga.kumamoto.jp",
	"yamato.kumamoto.jp",
	"yatsushiro.kumamoto.jp",
	"ayabe.kyoto.jp",
	"fukuchiyama.kyoto.jp",
	"higashiyama.kyoto.jp",
	"ide.kyoto.jp",
	"ine.kyoto.jp",
	"joyo.kyoto.jp",
	"kameoka.kyoto.jp",
	"kamo.kyoto.jp",
	"kita.kyoto.jp",
	"kizu.kyoto.jp",
	"kumiyama.kyoto.jp",
	"kyotamba.kyoto.jp",
	"kyotanabe.kyoto.jp",
	"kyotango.kyoto.jp",
	"maizuru.kyoto.jp",
	"minami.kyoto.jp",
	"minamiyamashiro.kyoto.jp",
	"miyazu.kyoto.jp",
	"muko.kyoto.jp",
	"nagaokakyo.kyoto.jp",
	"nakagyo.kyoto.jp",
	"nantan.kyoto.jp",
	"oyamazaki.kyoto.jp",
	"sakyo.kyoto.jp",
	"seika.kyoto.jp",
	"tanabe.kyoto.jp",
	"uji.kyoto.jp",
	"ujitawara.kyoto.jp",
	"wazuka.kyoto.jp",
	"yamashina.kyoto.jp",
	"yawata.kyoto.jp",
	"asahi.mie.jp",
	"inabe.mie.jp",
	"ise.mie.jp",
	"kameyama.mie.jp",
	"kawagoe.mie.jp",
	"kiho.mie.jp",
	"kisosaki.mie.jp",
	"kiwa.mie.jp",
	"komono.mie.jp",
	"kumano.mie.jp",
	"kuwana.mie.jp",
	"matsusaka.mie.jp",
	"meiwa.mie.jp",
	"mihama.mie.jp",
	"minamiise.mie.jp",
	"misugi.mie.jp",
	"miyama.mie.jp",
	"nabari.mie.jp",
	"shima.mie.jp",
	"suzuka.mie.jp",
	"tado.mie.jp",
	"taiki.mie.jp",
	"taki.mie.jp",
	"tamaki.mie.jp",
	"toba.mie.jp",
	"tsu.mie.jp",
	"udono.mie.jp",
	"ureshino.mie.jp",
	"watarai.mie.jp",
	"yokkaichi.mie.jp",
	"furukawa.miyagi.jp",
	"higashimatsushima.miyagi.jp",
	"ishinomaki.miyagi.jp",
	"iwanuma.miyagi.jp",
	"kakuda.miyagi.jp",
	"kami.miyagi.jp",
	"kawasaki.miyagi.jp",
	"marumori.miyagi.jp",
	"matsushima.miyagi.jp",
	"minamisanriku.miyagi.jp",
	"misato.miyagi.jp",
	"murata.miyagi.jp",
	"natori.miyagi.jp",
	"ogawara.miyagi.jp",
	"ohira.miyagi.jp",
	"onagawa.miyagi.jp",
	"osaki.miyagi.jp",
	"rifu.miyagi.jp",
	"semine.miyagi.jp",
	"shibata.miyagi.jp",
	"shichikashuku.miyagi.jp",
	"shikama.miyagi.jp",
	"shiogama.miyagi.jp",
	"shiroishi.miyagi.jp",
	"tagajo.miyagi.jp",
	"taiwa.miyagi.jp",
	"tome.miyagi.jp",
	"tomiya.miyagi.jp",
	"wakuya.miyagi.jp",
	"watari.miyagi.jp",
	"yamamoto.miyagi.jp",
	"zao.miyagi.jp",
	"aya.miyazaki.jp",
	"ebino.miyazaki.jp",
	"gokase.miyazaki.jp",
	"hyuga.miyazaki.jp",
	"kadogawa.miyazaki.jp",
	"kawaminami.miyazaki.jp",
	"kijo.miyazaki.jp",
	"kitagawa.miyazaki.jp",
	"kitakata.miyazaki.jp",
	"kitaura.miyazaki.jp",
	"kobayashi.miyazaki.jp",
	"kunitomi.miyazaki.jp",
	"kushima.miyazaki.jp",
	"mimata.miyazaki.jp",
	"miyakonojo.miyazaki.jp",
	"miyazaki.miyazaki.jp",
	"morotsuka.miyazaki.jp",
	"nichinan.miyazaki.jp",
	"nishimera.miyazaki.jp",
	"nobeoka.miyazaki.jp",
	"saito.miyazaki.jp",
	"shiiba.miyazaki.jp",
	"shintomi.miyazaki.jp",
	"takaharu.miyazaki.jp",
	"takanabe.miyazaki.jp",
	"takazaki.miyazaki.jp",
	"tsuno.miyazaki.jp",
	"achi.nagano.jp",
	"agematsu.nagano.jp",
	"anan.nagano.jp",
	"aoki.nagano.jp",
	"asahi.nagano.jp",
	"azumino.nagano.jp",
	"chikuhoku.nagano.jp",
	"chikuma.nagano.jp",
	"chino.nagano.jp",
	"fujimi.nagano.jp",
	"hakuba.nagano.jp",
	"hara.nagano.jp",
	"hiraya.nagano.jp",
	"iida.nagano.jp",
	"iijima.nagano.jp",
	"iiyama.nagano.jp",
	"iizuna.nagano.jp",
	"ikeda.nagano.jp",
	"ikusaka.nagano.jp",
	"ina.nagano.jp",
	"karuizawa.nagano.jp",
	"kawakami.nagano.jp",
	"kiso.nagano.jp",
	"kisofukushima.nagano.jp",
	"kitaaiki.nagano.jp",
	"komagane.nagano.jp",
	"komoro.nagano.jp",
	"matsukawa.nagano.jp",
	"matsumoto.nagano.jp",
	"miasa.nagano.jp",
	"minamiaiki.nagano.jp",
	"minamimaki.nagano.jp",
	"minamiminowa.nagano.jp",
	"minowa.nagano.jp",
	"miyada.nagano.jp",
	"miyota.nagano.jp",
	"mochizuki.nagano.jp",
	"nagano.nagano.jp",
	"nagawa.nagano.jp",
	"nagiso.nagano.jp",
	"nakagawa.nagano.jp",
	"nakano.nagano.jp",
	"nozawaonsen.nagano.jp",
	"obuse.nagano.jp",
	"ogawa.nagano.jp",
	"okaya.nagano.jp",
	"omachi.nagano.jp",
	"omi.nagano.jp",
	"ookuwa.nagano.jp",
	"ooshika.nagano.jp",
	"otaki.nagano.jp",
	"otari.nagano.jp",
	"sakae.nagano.jp",
	"sakaki.nagano.jp",
	"saku.nagano.jp",
	"sakuho.nagano.jp",
	"shimosuwa.nagano.jp",
	"shinanomachi.nagano.jp",
	"shiojiri.nagano.jp",
	"suwa.nagano.jp",
	"suzaka.nagano.jp",
	"takagi.nagano.jp",
	"takamori.nagano.jp",
	"takayama.nagano.jp",
	"tateshina.nagano.jp",
	"tatsuno.nagano.jp",
	"togakushi.nagano.jp",
	"togura.nagano.jp",
	"tomi.nagano.jp",
	"ueda.nagano.jp",
	"wada.nagano.jp",
	"yamagata.nagano.jp",
	"yamanouchi.nagano.jp",
	"yasaka.nagano.jp",
	"yasuoka.nagano.jp",
	"chijiwa.nagasaki.jp",
	"futsu.nagasaki.jp",
	"goto.nagasaki.jp",
	"hasami.nagasaki.jp",
	"hirado.nagasaki.jp",
	"iki.nagasaki.jp",
	"isahaya.nagasaki.jp",
	"kawatana.nagasaki.jp",
	"kuchinotsu.nagasaki.jp",
	"matsuura.nagasaki.jp",
	"nagasaki.nagasaki.jp",
	"obama.nagasaki.jp",
	"omura.nagasaki.jp",
	"oseto.nagasaki.jp",
	"saikai.nagasaki.jp",
	"sasebo.nagasaki.jp",
	"seihi.nagasaki.jp",
	"shimabara.nagasaki.jp",
	"shinkamigoto.nagasaki.jp",
	"togitsu.nagasaki.jp",
	"tsushima.nagasaki.jp",
	"unzen.nagasaki.jp",
	"ando.nara.jp",
	"gose.nara.jp",
	"heguri.nara.jp",
	"higashiyoshino.nara.jp",
	"ikaruga.nara.jp",
	"ikoma.nara.jp",
	"kamikitayama.nara.jp",
	"kanmaki.nara.jp",
	"kashiba.nara.jp",
	"kashihara.nara.jp",
	"katsuragi.nara.jp",
	"kawai.nara.jp",
	"kawakami.nara.jp",
	"kawanishi.nara.jp",
	"koryo.nara.jp",
	"kurotaki.nara.jp",
	"mitsue.nara.jp",
	"miyake.nara.jp",
	"nara.nara.jp",
	"nosegawa.nara.jp",
	"oji.nara.jp",
	"ouda.nara.jp",
	"oyodo.nara.jp",
	"sakurai.nara.jp",
	"sango.nara.jp",
	"shimoichi.nara.jp",
	"shimokitayama.nara.jp",
	"shinjo.nara.jp",
	"soni.nara.jp",
	"takatori.nara.jp",
	"tawaramoto.nara.jp",
	"tenkawa.nara.jp",
	"tenri.nara.jp",
	"uda.nara.jp",
	"yamatokoriyama.nara.jp",
	"yamatotakada.nara.jp",
	"yamazoe.nara.jp",
	"yoshino.nara.jp",
	"aga.niigata.jp",
	"agano.niigata.jp",
	"gosen.niigata.jp",
	"itoigawa.niigata.jp",
	"izumozaki.niigata.jp",
	"joetsu.niigata.jp",
	"kamo.niigata.jp",
	"kariwa.niigata.jp",
	"kashiwazaki.niigata.jp",
	"minamiuonuma.niigata.jp",
	"mitsuke.niigata.jp",
	"muika.niigata.jp",
	"murakami.niigata.jp",
	"myoko.niigata.jp",
	"nagaoka.niigata.jp",
	"niigata.niigata.jp",
	"ojiya.niigata.jp",
	"omi.niigata.jp",
	"sado.niigata.jp",
	"sanjo.niigata.jp",
	"seiro.niigata.jp",
	"seirou.niigata.jp",
	"sekikawa.niigata.jp",
	"shibata.niigata.jp",
	"tagami.niigata.jp",
	"tainai.niigata.jp",
	"tochio.niigata.jp",
	"tokamachi.niigata.jp",
	"tsubame.niigata.jp",
	"tsunan.niigata.jp",
	"uonuma.niigata.jp",
	"yahiko.niigata.jp",
	"yoita.niigata.jp",
	"yuzawa.niigata.jp",
	"beppu.oita.jp",
	"bungoono.oita.jp",
	"bungotakada.oita.jp",
	"hasama.oita.jp",
	"hiji.oita.jp",
	"himeshima.oita.jp",
	"hita.oita.jp",
	"kamitsue.oita.jp",
	"kokonoe.oita.jp",
	"kuju.oita.jp",
	"kunisaki.oita.jp",
	"kusu.oita.jp",
	"oita.oita.jp",
	"saiki.oita.jp",
	"taketa.oita.jp",
	"tsukumi.oita.jp",
	"usa.oita.jp",
	"usuki.oita.jp",
	"yufu.oita.jp",
	"akaiwa.okayama.jp",
	"asakuchi.okayama.jp",
	"bizen.okayama.jp",
	"hayashima.okayama.jp",
	"ibara.okayama.jp",
	"kagamino.okayama.jp",
	"kasaoka.okayama.jp",
	"kibichuo.okayama.jp",
	"kumenan.okayama.jp",
	"kurashiki.okayama.jp",
	"maniwa.okayama.jp",
	"misaki.okayama.jp",
	"nagi.okayama.jp",
	"niimi.okayama.jp",
	"nishiawakura.okayama.jp",
	"okayama.okayama.jp",
	"satosho.okayama.jp",
	"setouchi.okayama.jp",
	"shinjo.okayama.jp",
	"shoo.okayama.jp",
	"soja.okayama.jp",
	"takahashi.okayama.jp",
	"tamano.okayama.jp",
	"tsuyama.okayama.jp",
	"wake.okayama.jp",
	"yakage.okayama.jp",
	"aguni.okinawa.jp",
	"ginowan.okinawa.jp",
	"ginoza.okinawa.jp",
	"gushikami.okinawa.jp",
	"haebaru.okinawa.jp",
	"higashi.okinawa.jp",
	"hirara.okinawa.jp",
	"iheya.okinawa.jp",
	"ishigaki.okinawa.jp",
	"ishikawa.okinawa.jp",
	"itoman.okinawa.jp",
	"izena.okinawa.jp",
	"kadena.okinawa.jp",
	"kin.okinawa.jp",
	"kitadaito.okinawa.jp",
	"kitanakagusuku.okinawa.jp",
	"kumejima.okinawa.jp",
	"kunigami.okinawa.jp",
	"minamidaito.okinawa.jp",
	"motobu.okinawa.jp",
	"nago.okinawa.jp",
	"naha.okinawa.jp",
	"nakagusuku.okinawa.jp",
	"nakijin.okinawa.jp",
	"nanjo.okinawa.jp",
	"nishihara.okinawa.jp",
	"ogimi.okinawa.jp",
	"okinawa.okinawa.jp",
	"onna.okinawa.jp",
	"shimoji.okinawa.jp",
	"taketomi.okinawa.jp",
	"tarama.okinawa.jp",
	"tokashiki.okinawa.jp",
	"tomigusuku.okinawa.jp",
	"tonaki.okinawa.jp",
	"urasoe.okinawa.jp",
	"uruma.okinawa.jp",
	"yaese.okinawa.jp",
	"yomitan.okinawa.jp",
	"yonabaru.okinawa.jp",
	"yonaguni.okinawa.jp",
	"zamami.okinawa.jp",
	"abeno.osaka.jp",
	"chihayaakasaka.osaka.jp",
	"chuo.osaka.jp",
	"daito.osaka.jp",
	"fujiidera.osaka.jp",
	"habikino.osaka.jp",
	"hannan.osaka.jp",
	"higashiosaka.osaka.jp",
	"higashisumiyoshi.osaka.jp",
	"higashiyodogawa.osaka.jp",
	"hirakata.osaka.jp",
	"ibaraki.osaka.jp",
	"ikeda.osaka.jp",
	"izumi.osaka.jp",
	"izumiotsu.osaka.jp",
	"izumisano.osaka.jp",
	"kadoma.osaka.jp",
	"kaizuka.osaka.jp",
	"kanan.osaka.jp",
	"kashiwara.osaka.jp",
	"katano.osaka.jp",
	"kawachinagano.osaka.jp",
	"kishiwada.osaka.jp",
	"kita.osaka.jp",
	"kumatori.osaka.jp",
	"matsubara.osaka.jp",
	"minato.osaka.jp",
	"minoh.osaka.jp",
	"misaki.osaka.jp",
	"moriguchi.osaka.jp",
	"neyagawa.osaka.jp",
	"nishi.osaka.jp",
	"nose.osaka.jp",
	"osakasayama.osaka.jp",
	"sakai.osaka.jp",
	"sayama.osaka.jp",
	"sennan.osaka.jp",
	"settsu.osaka.jp",
	"shijonawate.osaka.jp",
	"shimamoto.osaka.jp",
	"suita.osaka.jp",
	"tadaoka.osaka.jp",
	"taishi.osaka.jp",
	"tajiri.osaka.jp",
	"takaishi.osaka.jp",
	"takatsuki.osaka.jp",
	"tondabayashi.osaka.jp",
	"toyonaka.osaka.jp",
	"toyono.osaka.jp",
	"yao.osaka.jp",
	"ariake.saga.jp",
	"arita.saga.jp",
	"fukudomi.saga.jp",
	"genkai.saga.jp",
	"hamatama.saga.jp",
	"hizen.saga.jp",
	"imari.saga.jp",
	"kamimine.saga.jp",
	"kanzaki.saga.jp",
	"karatsu.saga.jp",
	"kashima.saga.jp",
	"kitagata.saga.jp",
	"kitahata.saga.jp",
	"kiyama.saga.jp",
	"kouhoku.saga.jp",
	"kyuragi.saga.jp",
	"nishiarita.saga.jp",
	"ogi.saga.jp",
	"omachi.saga.jp",
	"ouchi.saga.jp",
	"saga.saga.jp",
	"shiroishi.saga.jp",
	"taku.saga.jp",
	"tara.saga.jp",
	"tosu.saga.jp",
	"yoshinogari.saga.jp",
	"arakawa.saitama.jp",
	"asaka.saitama.jp",
	"chichibu.saitama.jp",
	"fujimi.saitama.jp",
	"fujimino.saitama.jp",
	"fukaya.saitama.jp",
	"hanno.saitama.jp",
	"hanyu.saitama.jp",
	"hasuda.saitama.jp",
	"hatogaya.saitama.jp",
	"hatoyama.saitama.jp",
	"hidaka.saitama.jp",
	"higashichichibu.saitama.jp",
	"higashimatsuyama.saitama.jp",
	"honjo.saitama.jp",
	"ina.saitama.jp",
	"iruma.saitama.jp",
	"iwatsuki.saitama.jp",
	"kamiizumi.saitama.jp",
	"kamikawa.saitama.jp",
	"kamisato.saitama.jp",
	"kasukabe.saitama.jp",
	"kawagoe.saitama.jp",
	"kawaguchi.saitama.jp",
	"kawajima.saitama.jp",
	"kazo.saitama.jp",
	"kitamoto.saitama.jp",
	"koshigaya.saitama.jp",
	"kounosu.saitama.jp",
	"kuki.saitama.jp",
	"kumagaya.saitama.jp",
	"matsubushi.saitama.jp",
	"minano.saitama.jp",
	"misato.saitama.jp",
	"miyashiro.saitama.jp",
	"miyoshi.saitama.jp",
	"moroyama.saitama.jp",
	"nagatoro.saitama.jp",
	"namegawa.saitama.jp",
	"niiza.saitama.jp",
	"ogano.saitama.jp",
	"ogawa.saitama.jp",
	"ogose.saitama.jp",
	"okegawa.saitama.jp",
	"omiya.saitama.jp",
	"otaki.saitama.jp",
	"ranzan.saitama.jp",
	"ryokami.saitama.jp",
	"saitama.saitama.jp",
	"sakado.saitama.jp",
	"satte.saitama.jp",
	"sayama.saitama.jp",
	"shiki.saitama.jp",
	"shiraoka.saitama.jp",
	"soka.saitama.jp",
	"sugito.saitama.jp",
	"toda.saitama.jp",
	"tokigawa.saitama.jp",
	"tokorozawa.saitama.jp",
	"tsurugashima.saitama.jp",
	"urawa.saitama.jp",
	"warabi.saitama.jp",
	"yashio.saitama.jp",
	"yokoze.saitama.jp",
	"yono.saitama.jp",
	"yorii.saitama.jp",
	"yoshida.saitama.jp",
	"yoshikawa.saitama.jp",
	"yoshimi.saitama.jp",
	"aisho.shiga.jp",
	"gamo.shiga.jp",
	"higashiomi.shiga.jp",
	"hikone.shiga.jp",
	"koka.shiga.jp",
	"konan.shiga.jp",
	"kosei.shiga.jp",
	"koto.shiga.jp",
	"kusatsu.shiga.jp",
	"maibara.shiga.jp",
	"moriyama.shiga.jp",
	"nagahama.shiga.jp",
	"nishiazai.shiga.jp",
	"notogawa.shiga.jp",
	"omihachiman.shiga.jp",
	"otsu.shiga.jp",
	"ritto.shiga.jp",
	"ryuoh.shiga.jp",
	"takashima.shiga.jp",
	"takatsuki.shiga.jp",
	"torahime.shiga.jp",
	"toyosato.shiga.jp",
	"yasu.shiga.jp",
	"akagi.shimane.jp",
	"ama.shimane.jp",
	"gotsu.shimane.jp",
	"hamada.shimane.jp",
	"higashiizumo.shimane.jp",
	"hikawa.shimane.jp",
	"hikimi.shimane.jp",
	"izumo.shimane.jp",
	"kakinoki.shimane.jp",
	"masuda.shimane.jp",
	"matsue.shimane.jp",
	"misato.shimane.jp",
	"nishinoshima.shimane.jp",
	"ohda.shimane.jp",
	"okinoshima.shimane.jp",
	"okuizumo.shimane.jp",
	"shimane.shimane.jp",
	"tamayu.shimane.jp",
	"tsuwano.shimane.jp",
	"unnan.shimane.jp",
	"yakumo.shimane.jp",
	"yasugi.shimane.jp",
	"yatsuka.shimane.jp",
	"arai.shizuoka.jp",
	"atami.shizuoka.jp",
	"fuji.shizuoka.jp",
	"fujieda.shizuoka.jp",
	"fujikawa.shizuoka.jp",
	"fujinomiya.shizuoka.jp",
	"fukuroi.shizuoka.jp",
	"gotemba.shizuoka.jp",
	"haibara.shizuoka.jp",
	"hamamatsu.shizuoka.jp",
	"higashiizu.shizuoka.jp",
	"ito.shizuoka.jp",
	"iwata.shizuoka.jp",
	"izu.shizuoka.jp",
	"izunokuni.shizuoka.jp",
	"kakegawa.shizuoka.jp",
	"kannami.shizuoka.jp",
	"kawanehon.shizuoka.jp",
	"kawazu.shizuoka.jp",
	"kikugawa.shizuoka.jp",
	"kosai.shizuoka.jp",
	"makinohara.shizuoka.jp",
	"matsuzaki.shizuoka.jp",
	"minamiizu.shizuoka.jp",
	"mishima.shizuoka.jp",
	"morimachi.shizuoka.jp",
	"nishiizu.shizuoka.jp",
	"numazu.shizuoka.jp",
	"omaezaki.shizuoka.jp",
	"shimada.shizuoka.jp",
	"shimizu.shizuoka.jp",
	"shimoda.shizuoka.jp",
	"shizuoka.shizuoka.jp",
	"susono.shizuoka.jp",
	"yaizu.shizuoka.jp",
	"yoshida.shizuoka.jp",
	"ashikaga.tochigi.jp",
	"bato.tochigi.jp",
	"haga.tochigi.jp",
	"ichikai.tochigi.jp",
	"iwafune.tochigi.jp",
	"kaminokawa.tochigi.jp",
	"kanuma.tochigi.jp",
	"karasuyama.tochigi.jp",
	"kuroiso.tochigi.jp",
	"mashiko.tochigi.jp",
	"mibu.tochigi.jp",
	"moka.tochigi.jp",
	"motegi.tochigi.jp",
	"nasu.tochigi.jp",
	"nasushiobara.tochigi.jp",
	"nikko.tochigi.jp",
	"nishikata.tochigi.jp",
	"nogi.tochigi.jp",
	"ohira.tochigi.jp",
	"ohtawara.tochigi.jp",
	"oyama.tochigi.jp",
	"sakura.tochigi.jp",
	"sano.tochigi.jp",
	"shimotsuke.tochigi.jp",
	"shioya.tochigi.jp",
	"takanezawa.tochigi.jp",
	"tochigi.tochigi.jp",
	"tsuga.tochigi.jp",
	"ujiie.tochigi.jp",
	"utsunomiya.tochigi.jp",
	"yaita.tochigi.jp",
	"aizumi.tokushima.jp",
	"anan.tokushima.jp",
	"ichiba.tokushima.jp",
	"itano.tokushima.jp",
	"kainan.tokushima.jp",
	"komatsushima.tokushima.jp",
	"matsushige.tokushima.jp",
	"mima.tokushima.jp",
	"minami.tokushima.jp",
	"miyoshi.tokushima.jp",
	"mugi.tokushima.jp",
	"nakagawa.tokushima.jp",
	"naruto.tokushima.jp",
	"sanagochi.tokushima.jp",
	"shishikui.tokushima.jp",
	"tokushima.tokushima.jp",
	"wajiki.tokushima.jp",
	"adachi.tokyo.jp",
	"akiruno.tokyo.jp",
	"akishima.tokyo.jp",
	"aogashima.tokyo.jp",
	"arakawa.tokyo.jp",
	"bunkyo.tokyo.jp",
	"chiyoda.tokyo.jp",
	"chofu.tokyo.jp",
	"chuo.tokyo.jp",
	"edogawa.tokyo.jp",
	"fuchu.tokyo.jp",
	"fussa.tokyo.jp",
	"hachijo.tokyo.jp",
	"hachioji.tokyo.jp",
	"hamura.tokyo.jp",
	"higashikurume.tokyo.jp",
	"higashimurayama.tokyo.jp",
	"higashiyamato.tokyo.jp",
	"hino.tokyo.jp",
	"hinode.tokyo.jp",
	"hinohara.tokyo.jp",
	"inagi.tokyo.jp",
	"itabashi.tokyo.jp",
	"katsushika.tokyo.jp",
	"kita.tokyo.jp",
	"kiyose.tokyo.jp",
	"kodaira.tokyo.jp",
	"koganei.tokyo.jp",
	"kokubunji.tokyo.jp",
	"komae.tokyo.jp",
	"koto.tokyo.jp",
	"kouzushima.tokyo.jp",
	"kunitachi.tokyo.jp",
	"machida.tokyo.jp",
	"meguro.tokyo.jp",
	"minato.tokyo.jp",
	"mitaka.tokyo.jp",
	"mizuho.tokyo.jp",
	"musashimurayama.tokyo.jp",
	"musashino.tokyo.jp",
	"nakano.tokyo.jp",
	"nerima.tokyo.jp",
	"ogasawara.tokyo.jp",
	"okutama.tokyo.jp",
	"ome.tokyo.jp",
	"oshima.tokyo.jp",
	"ota.tokyo.jp",
	"setagaya.tokyo.jp",
	"shibuya.tokyo.jp",
	"shinagawa.tokyo.jp",
	"shinjuku.tokyo.jp",
	"suginami.tokyo.jp",
	"sumida.tokyo.jp",
	"tachikawa.tokyo.jp",
	"taito.tokyo.jp",
	"tama.tokyo.jp",
	"toshima.tokyo.jp",
	"chizu.tottori.jp",
	"hino.tottori.jp",
	"kawahara.tottori.jp",
	"koge.tottori.jp",
	"kotoura.tottori.jp",
	"misasa.tottori.jp",
	"nanbu.tottori.jp",
	"nichinan.tottori.jp",
	"sakaiminato.tottori.jp",
	"tottori.tottori.jp",
	"wakasa.tottori.jp",
	"yazu.tottori.jp",
	"yonago.tottori.jp",
	"asahi.toyama.jp",
	"fuchu.toyama.jp",
	"fukumitsu.toyama.jp",
	"funahashi.toyama.jp",
	"himi.toyama.jp",
	"imizu.toyama.jp",
	"inami.toyama.jp",
	"johana.toyama.jp",
	"kamiichi.toyama.jp",
	"kurobe.toyama.jp",
	"nakaniikawa.toyama.jp",
	"namerikawa.toyama.jp",
	"nanto.toyama.jp",
	"nyuzen.toyama.jp",
	"oyabe.toyama.jp",
	"taira.toyama.jp",
	"takaoka.toyama.jp",
	"tateyama.toyama.jp",
	"toga.toyama.jp",
	"tonami.toyama.jp",
	"toyama.toyama.jp",
	"unazuki.toyama.jp",
	"uozu.toyama.jp",
	"yamada.toyama.jp",
	"arida.wakayama.jp",
	"aridagawa.wakayama.jp",
	"gobo.wakayama.jp",
	"hashimoto.wakayama.jp",
	"hidaka.wakayama.jp",
	"hirogawa.wakayama.jp",
	"inami.wakayama.jp",
	"iwade.wakayama.jp",
	"kainan.wakayama.jp",
	"kamitonda.wakayama.jp",
	"katsuragi.wakayama.jp",
	"kimino.wakayama.jp",
	"kinokawa.wakayama.jp",
	"kitayama.wakayama.jp",
	"koya.wakayama.jp",
	"koza.wakayama.jp",
	"kozagawa.wakayama.jp",
	"kudoyama.wakayama.jp",
	"kushimoto.wakayama.jp",
	"mihama.wakayama.jp",
	"misato.wakayama.jp",
	"nachikatsuura.wakayama.jp",
	"shingu.wakayama.jp",
	"shirahama.wakayama.jp",
	"taiji.wakayama.jp",
	"tanabe.wakayama.jp",
	"wakayama.wakayama.jp",
	"yuasa.wakayama.jp",
	"yura.wakayama.jp",
	"asahi.yamagata.jp",
	"funagata.yamagata.jp",
	"higashine.yamagata.jp",
	"iide.yamagata.jp",
	"kahoku.yamagata.jp",
	"kaminoyama.yamagata.jp",
	"kaneyama.yamagata.jp",
	"kawanishi.yamagata.jp",
	"mamurogawa.yamagata.jp",
	"mikawa.yamagata.jp",
	"murayama.yamagata.jp",
	"nagai.yamagata.jp",
	"nakayama.yamagata.jp",
	"nanyo.yamagata.jp",
	"nishikawa.yamagata.jp",
	"obanazawa.yamagata.jp",
	"oe.yamagata.jp",
	"oguni.yamagata.jp",
	"ohkura.yamagata.jp",
	"oishida.yamagata.jp",
	"sagae.yamagata.jp",
	"sakata.yamagata.jp",
	"sakegawa.yamagata.jp",
	"shinjo.yamagata.jp",
	"shirataka.yamagata.jp",
	"shonai.yamagata.jp",
	"takahata.yamagata.jp",
	"tendo.yamagata.jp",
	"tozawa.yamagata.jp",
	"tsuruoka.yamagata.jp",
	"yamagata.yamagata.jp",
	"yamanobe.yamagata.jp",
	"yonezawa.yamagata.jp",
	"yuza.yamagata.jp",
	"abu.yamaguchi.jp",
	"hagi.yamaguchi.jp",
	"hikari.yamaguchi.jp",
	"hofu.yamaguchi.jp",
	"iwakuni.yamaguchi.jp",
	"kudamatsu.yamaguchi.jp",
	"mitou.yamaguchi.jp",
	"nagato.yamaguchi.jp",
	"oshima.yamaguchi.jp",
	"shimonoseki.yamaguchi.jp",
	"shunan.yamaguchi.jp",
	"tabuse.yamaguchi.jp",
	"tokuyama.yamaguchi.jp",
	"toyota.yamaguchi.jp",
	"ube.yamaguchi.jp",
	"yuu.yamaguchi.jp",
	"chuo.yamanashi.jp",
	"doshi.yamanashi.jp",
	"fuefuki.yamanashi.jp",
	"fujikawa.yamanashi.jp",
	"fujikawaguchiko.yamanashi.jp",
	"fujiyoshida.yamanashi.jp",
	"hayakawa.yamanashi.jp",
	"hokuto.yamanashi.jp",
	"ichikawamisato.yamanashi.jp",
	"kai.yamanashi.jp",
	"kofu.yamanashi.jp",
	"koshu.yamanashi.jp",
	"kosuge.yamanashi.jp",
	"minami-alps.yamanashi.jp",
	"minobu.yamanashi.jp",
	"nakamichi.yamanashi.jp",
	"nanbu.yamanashi.jp",
	"narusawa.yamanashi.jp",
	"nirasaki.yamanashi.jp",
	"nishikatsura.yamanashi.jp",
	"oshino.yamanashi.jp",
	"otsuki.yamanashi.jp",
	"showa.yamanashi.jp",
	"tabayama.yamanashi.jp",
	"tsuru.yamanashi.jp",
	"uenohara.yamanashi.jp",
	"yamanakako.yamanashi.jp",
	"yamanashi.yamanashi.jp",
	"ke",
	"ac.ke",
	"co.ke",
	"go.ke",
	"info.ke",
	"me.ke",
	"mobi.ke",
	"ne.ke",
	"or.ke",
	"sc.ke",
	"kg",
	"org.kg",
	"net.kg",
	"com.kg",
	"edu.kg",
	"gov.kg",
	"mil.kg",
	"*.kh",
	"ki",
	"edu.ki",
	"biz.ki",
	"net.ki",
	"org.ki",
	"gov.ki",
	"info.ki",
	"com.ki",
	"km",
	"org.km",
	"nom.km",
	"gov.km",
	"prd.km",
	"tm.km",
	"edu.km",
	"mil.km",
	"ass.km",
	"com.km",
	"coop.km",
	"asso.km",
	"presse.km",
	"medecin.km",
	"notaires.km",
	"pharmaciens.km",
	"veterinaire.km",
	"gouv.km",
	"kn",
	"net.kn",
	"org.kn",
	"edu.kn",
	"gov.kn",
	"kp",
	"com.kp",
	"edu.kp",
	"gov.kp",
	"org.kp",
	"rep.kp",
	"tra.kp",
	"kr",
	"ac.kr",
	"co.kr",
	"es.kr",
	"go.kr",
	"hs.kr",
	"kg.kr",
	"mil.kr",
	"ms.kr",
	"ne.kr",
	"or.kr",
	"pe.kr",
	"re.kr",
	"sc.kr",
	"busan.kr",
	"chungbuk.kr",
	"chungnam.kr",
	"daegu.kr",
	"daejeon.kr",
	"gangwon.kr",
	"gwangju.kr",
	"gyeongbuk.kr",
	"gyeonggi.kr",
	"gyeongnam.kr",
	"incheon.kr",
	"jeju.kr",
	"jeonbuk.kr",
	"jeonnam.kr",
	"seoul.kr",
	"ulsan.kr",
	"kw",
	"com.kw",
	"edu.kw",
	"emb.kw",
	"gov.kw",
	"ind.kw",
	"net.kw",
	"org.kw",
	"ky",
	"edu.ky",
	"gov.ky",
	"com.ky",
	"org.ky",
	"net.ky",
	"kz",
	"org.kz",
	"edu.kz",
	"net.kz",
	"gov.kz",
	"mil.kz",
	"com.kz",
	"la",
	"int.la",
	"net.la",
	"info.la",
	"edu.la",
	"gov.la",
	"per.la",
	"com.la",
	"org.la",
	"lb",
	"com.lb",
	"edu.lb",
	"gov.lb",
	"net.lb",
	"org.lb",
	"lc",
	"com.lc",
	"net.lc",
	"co.lc",
	"org.lc",
	"edu.lc",
	"gov.lc",
	"li",
	"lk",
	"gov.lk",
	"sch.lk",
	"net.lk",
	"int.lk",
	"com.lk",
	"org.lk",
	"edu.lk",
	"ngo.lk",
	"soc.lk",
	"web.lk",
	"ltd.lk",
	"assn.lk",
	"grp.lk",
	"hotel.lk",
	"ac.lk",
	"lr",
	"com.lr",
	"edu.lr",
	"gov.lr",
	"org.lr",
	"net.lr",
	"ls",
	"ac.ls",
	"biz.ls",
	"co.ls",
	"edu.ls",
	"gov.ls",
	"info.ls",
	"net.ls",
	"org.ls",
	"sc.ls",
	"lt",
	"gov.lt",
	"lu",
	"lv",
	"com.lv",
	"edu.lv",
	"gov.lv",
	"org.lv",
	"mil.lv",
	"id.lv",
	"net.lv",
	"asn.lv",
	"conf.lv",
	"ly",
	"com.ly",
	"net.ly",
	"gov.ly",
	"plc.ly",
	"edu.ly",
	"sch.ly",
	"med.ly",
	"org.ly",
	"id.ly",
	"ma",
	"co.ma",
	"net.ma",
	"gov.ma",
	"org.ma",
	"ac.ma",
	"press.ma",
	"mc",
	"tm.mc",
	"asso.mc",
	"md",
	"me",
	"co.me",
	"net.me",
	"org.me",
	"edu.me",
	"ac.me",
	"gov.me",
	"its.me",
	"priv.me",
	"mg",
	"org.mg",
	"nom.mg",
	"gov.mg",
	"prd.mg",
	"tm.mg",
	"edu.mg",
	"mil.mg",
	"com.mg",
	"co.mg",
	"mh",
	"mil",
	"mk",
	"com.mk",
	"org.mk",
	"net.mk",
	"edu.mk",
	"gov.mk",
	"inf.mk",
	"name.mk",
	"ml",
	"com.ml",
	"edu.ml",
	"gouv.ml",
	"gov.ml",
	"net.ml",
	"org.ml",
	"presse.ml",
	"*.mm",
	"mn",
	"gov.mn",
	"edu.mn",
	"org.mn",
	"mo",
	"com.mo",
	"net.mo",
	"org.mo",
	"edu.mo",
	"gov.mo",
	"mobi",
	"mp",
	"mq",
	"mr",
	"gov.mr",
	"ms",
	"com.ms",
	"edu.ms",
	"gov.ms",
	"net.ms",
	"org.ms",
	"mt",
	"com.mt",
	"edu.mt",
	"net.mt",
	"org.mt",
	"mu",
	"com.mu",
	"net.mu",
	"org.mu",
	"gov.mu",
	"ac.mu",
	"co.mu",
	"or.mu",
	"museum",
	"academy.museum",
	"agriculture.museum",
	"air.museum",
	"airguard.museum",
	"alabama.museum",
	"alaska.museum",
	"amber.museum",
	"ambulance.museum",
	"american.museum",
	"americana.museum",
	"americanantiques.museum",
	"americanart.museum",
	"amsterdam.museum",
	"and.museum",
	"annefrank.museum",
	"anthro.museum",
	"anthropology.museum",
	"antiques.museum",
	"aquarium.museum",
	"arboretum.museum",
	"archaeological.museum",
	"archaeology.museum",
	"architecture.museum",
	"art.museum",
	"artanddesign.museum",
	"artcenter.museum",
	"artdeco.museum",
	"arteducation.museum",
	"artgallery.museum",
	"arts.museum",
	"artsandcrafts.museum",
	"asmatart.museum",
	"assassination.museum",
	"assisi.museum",
	"association.museum",
	"astronomy.museum",
	"atlanta.museum",
	"austin.museum",
	"australia.museum",
	"automotive.museum",
	"aviation.museum",
	"axis.museum",
	"badajoz.museum",
	"baghdad.museum",
	"bahn.museum",
	"bale.museum",
	"baltimore.museum",
	"barcelona.museum",
	"baseball.museum",
	"basel.museum",
	"baths.museum",
	"bauern.museum",
	"beauxarts.museum",
	"beeldengeluid.museum",
	"bellevue.museum",
	"bergbau.museum",
	"berkeley.museum",
	"berlin.museum",
	"bern.museum",
	"bible.museum",
	"bilbao.museum",
	"bill.museum",
	"birdart.museum",
	"birthplace.museum",
	"bonn.museum",
	"boston.museum",
	"botanical.museum",
	"botanicalgarden.museum",
	"botanicgarden.museum",
	"botany.museum",
	"brandywinevalley.museum",
	"brasil.museum",
	"bristol.museum",
	"british.museum",
	"britishcolumbia.museum",
	"broadcast.museum",
	"brunel.museum",
	"brussel.museum",
	"brussels.museum",
	"bruxelles.museum",
	"building.museum",
	"burghof.museum",
	"bus.museum",
	"bushey.museum",
	"cadaques.museum",
	"california.museum",
	"cambridge.museum",
	"can.museum",
	"canada.museum",
	"capebreton.museum",
	"carrier.museum",
	"cartoonart.museum",
	"casadelamoneda.museum",
	"castle.museum",
	"castres.museum",
	"celtic.museum",
	"center.museum",
	"chattanooga.museum",
	"cheltenham.museum",
	"chesapeakebay.museum",
	"chicago.museum",
	"children.museum",
	"childrens.museum",
	"childrensgarden.museum",
	"chiropractic.museum",
	"chocolate.museum",
	"christiansburg.museum",
	"cincinnati.museum",
	"cinema.museum",
	"circus.museum",
	"civilisation.museum",
	"civilization.museum",
	"civilwar.museum",
	"clinton.museum",
	"clock.museum",
	"coal.museum",
	"coastaldefence.museum",
	"cody.museum",
	"coldwar.museum",
	"collection.museum",
	"colonialwilliamsburg.museum",
	"coloradoplateau.museum",
	"columbia.museum",
	"columbus.museum",
	"communication.museum",
	"communications.museum",
	"community.museum",
	"computer.museum",
	"computerhistory.museum",
	"comunicações.museum",
	"contemporary.museum",
	"contemporaryart.museum",
	"convent.museum",
	"copenhagen.museum",
	"corporation.museum",
	"correios-e-telecomunicações.museum",
	"corvette.museum",
	"costume.museum",
	"countryestate.museum",
	"county.museum",
	"crafts.museum",
	"cranbrook.museum",
	"creation.museum",
	"cultural.museum",
	"culturalcenter.museum",
	"culture.museum",
	"cyber.museum",
	"cymru.museum",
	"dali.museum",
	"dallas.museum",
	"database.museum",
	"ddr.museum",
	"decorativearts.museum",
	"delaware.museum",
	"delmenhorst.museum",
	"denmark.museum",
	"depot.museum",
	"design.museum",
	"detroit.museum",
	"dinosaur.museum",
	"discovery.museum",
	"dolls.museum",
	"donostia.museum",
	"durham.museum",
	"eastafrica.museum",
	"eastcoast.museum",
	"education.museum",
	"educational.museum",
	"egyptian.museum",
	"eisenbahn.museum",
	"elburg.museum",
	"elvendrell.museum",
	"embroidery.museum",
	"encyclopedic.museum",
	"england.museum",
	"entomology.museum",
	"environment.museum",
	"environmentalconservation.museum",
	"epilepsy.museum",
	"essex.museum",
	"estate.museum",
	"ethnology.museum",
	"exeter.museum",
	"exhibition.museum",
	"family.museum",
	"farm.museum",
	"farmequipment.museum",
	"farmers.museum",
	"farmstead.museum",
	"field.museum",
	"figueres.museum",
	"filatelia.museum",
	"film.museum",
	"fineart.museum",
	"finearts.museum",
	"finland.museum",
	"flanders.museum",
	"florida.museum",
	"force.museum",
	"fortmissoula.museum",
	"fortworth.museum",
	"foundation.museum",
	"francaise.museum",
	"frankfurt.museum",
	"franziskaner.museum",
	"freemasonry.museum",
	"freiburg.museum",
	"fribourg.museum",
	"frog.museum",
	"fundacio.museum",
	"furniture.museum",
	"gallery.museum",
	"garden.museum",
	"gateway.museum",
	"geelvinck.museum",
	"gemological.museum",
	"geology.museum",
	"georgia.museum",
	"giessen.museum",
	"glas.museum",
	"glass.museum",
	"gorge.museum",
	"grandrapids.museum",
	"graz.museum",
	"guernsey.museum",
	"halloffame.museum",
	"hamburg.museum",
	"handson.museum",
	"harvestcelebration.museum",
	"hawaii.museum",
	"health.museum",
	"heimatunduhren.museum",
	"hellas.museum",
	"helsinki.museum",
	"hembygdsforbund.museum",
	"heritage.museum",
	"histoire.museum",
	"historical.museum",
	"historicalsociety.museum",
	"historichouses.museum",
	"historisch.museum",
	"historisches.museum",
	"history.museum",
	"historyofscience.museum",
	"horology.museum",
	"house.museum",
	"humanities.museum",
	"illustration.museum",
	"imageandsound.museum",
	"indian.museum",
	"indiana.museum",
	"indianapolis.museum",
	"indianmarket.museum",
	"intelligence.museum",
	"interactive.museum",
	"iraq.museum",
	"iron.museum",
	"isleofman.museum",
	"jamison.museum",
	"jefferson.museum",
	"jerusalem.museum",
	"jewelry.museum",
	"jewish.museum",
	"jewishart.museum",
	"jfk.museum",
	"journalism.museum",
	"judaica.museum",
	"judygarland.museum",
	"juedisches.museum",
	"juif.museum",
	"karate.museum",
	"karikatur.museum",
	"kids.museum",
	"koebenhavn.museum",
	"koeln.museum",
	"kunst.museum",
	"kunstsammlung.museum",
	"kunstunddesign.museum",
	"labor.museum",
	"labour.museum",
	"lajolla.museum",
	"lancashire.museum",
	"landes.museum",
	"lans.museum",
	"läns.museum",
	"larsson.museum",
	"lewismiller.museum",
	"lincoln.museum",
	"linz.museum",
	"living.museum",
	"livinghistory.museum",
	"localhistory.museum",
	"london.museum",
	"losangeles.museum",
	"louvre.museum",
	"loyalist.museum",
	"lucerne.museum",
	"luxembourg.museum",
	"luzern.museum",
	"mad.museum",
	"madrid.museum",
	"mallorca.museum",
	"manchester.museum",
	"mansion.museum",
	"mansions.museum",
	"manx.museum",
	"marburg.museum",
	"maritime.museum",
	"maritimo.museum",
	"maryland.museum",
	"marylhurst.museum",
	"media.museum",
	"medical.museum",
	"medizinhistorisches.museum",
	"meeres.museum",
	"memorial.museum",
	"mesaverde.museum",
	"michigan.museum",
	"midatlantic.museum",
	"military.museum",
	"mill.museum",
	"miners.museum",
	"mining.museum",
	"minnesota.museum",
	"missile.museum",
	"missoula.museum",
	"modern.museum",
	"moma.museum",
	"money.museum",
	"monmouth.museum",
	"monticello.museum",
	"montreal.museum",
	"moscow.museum",
	"motorcycle.museum",
	"muenchen.museum",
	"muenster.museum",
	"mulhouse.museum",
	"muncie.museum",
	"museet.museum",
	"museumcenter.museum",
	"museumvereniging.museum",
	"music.museum",
	"national.museum",
	"nationalfirearms.museum",
	"nationalheritage.museum",
	"nativeamerican.museum",
	"naturalhistory.museum",
	"naturalhistorymuseum.museum",
	"naturalsciences.museum",
	"nature.museum",
	"naturhistorisches.museum",
	"natuurwetenschappen.museum",
	"naumburg.museum",
	"naval.museum",
	"nebraska.museum",
	"neues.museum",
	"newhampshire.museum",
	"newjersey.museum",
	"newmexico.museum",
	"newport.museum",
	"newspaper.museum",
	"newyork.museum",
	"niepce.museum",
	"norfolk.museum",
	"north.museum",
	"nrw.museum",
	"nuernberg.museum",
	"nuremberg.museum",
	"nyc.museum",
	"nyny.museum",
	"oceanographic.museum",
	"oceanographique.museum",
	"omaha.museum",
	"online.museum",
	"ontario.museum",
	"openair.museum",
	"oregon.museum",
	"oregontrail.museum",
	"otago.museum",
	"oxford.museum",
	"pacific.museum",
	"paderborn.museum",
	"palace.museum",
	"paleo.museum",
	"palmsprings.museum",
	"panama.museum",
	"paris.museum",
	"pasadena.museum",
	"pharmacy.museum",
	"philadelphia.museum",
	"philadelphiaarea.museum",
	"philately.museum",
	"phoenix.museum",
	"photography.museum",
	"pilots.museum",
	"pittsburgh.museum",
	"planetarium.museum",
	"plantation.museum",
	"plants.museum",
	"plaza.museum",
	"portal.museum",
	"portland.museum",
	"portlligat.museum",
	"posts-and-telecommunications.museum",
	"preservation.museum",
	"presidio.museum",
	"press.museum",
	"project.museum",
	"public.museum",
	"pubol.museum",
	"quebec.museum",
	"railroad.museum",
	"railway.museum",
	"research.museum",
	"resistance.museum",
	"riodejaneiro.museum",
	"rochester.museum",
	"rockart.museum",
	"roma.museum",
	"russia.museum",
	"saintlouis.museum",
	"salem.museum",
	"salvadordali.museum",
	"salzburg.museum",
	"sandiego.museum",
	"sanfrancisco.museum",
	"santabarbara.museum",
	"santacruz.museum",
	"santafe.museum",
	"saskatchewan.museum",
	"satx.museum",
	"savannahga.museum",
	"schlesisches.museum",
	"schoenbrunn.museum",
	"schokoladen.museum",
	"school.museum",
	"schweiz.museum",
	"science.museum",
	"scienceandhistory.museum",
	"scienceandindustry.museum",
	"sciencecenter.museum",
	"sciencecenters.museum",
	"science-fiction.museum",
	"sciencehistory.museum",
	"sciences.museum",
	"sciencesnaturelles.museum",
	"scotland.museum",
	"seaport.museum",
	"settlement.museum",
	"settlers.museum",
	"shell.museum",
	"sherbrooke.museum",
	"sibenik.museum",
	"silk.museum",
	"ski.museum",
	"skole.museum",
	"society.museum",
	"sologne.museum",
	"soundandvision.museum",
	"southcarolina.museum",
	"southwest.museum",
	"space.museum",
	"spy.museum",
	"square.museum",
	"stadt.museum",
	"stalbans.museum",
	"starnberg.museum",
	"state.museum",
	"stateofdelaware.museum",
	"station.museum",
	"steam.museum",
	"steiermark.museum",
	"stjohn.museum",
	"stockholm.museum",
	"stpetersburg.museum",
	"stuttgart.museum",
	"suisse.museum",
	"surgeonshall.museum",
	"surrey.museum",
	"svizzera.museum",
	"sweden.museum",
	"sydney.museum",
	"tank.museum",
	"tcm.museum",
	"technology.museum",
	"telekommunikation.museum",
	"television.museum",
	"texas.museum",
	"textile.museum",
	"theater.museum",
	"time.museum",
	"timekeeping.museum",
	"topology.museum",
	"torino.museum",
	"touch.museum",
	"town.museum",
	"transport.museum",
	"tree.museum",
	"trolley.museum",
	"trust.museum",
	"trustee.museum",
	"uhren.museum",
	"ulm.museum",
	"undersea.museum",
	"university.museum",
	"usa.museum",
	"usantiques.museum",
	"usarts.museum",
	"uscountryestate.museum",
	"usculture.museum",
	"usdecorativearts.museum",
	"usgarden.museum",
	"ushistory.museum",
	"ushuaia.museum",
	"uslivinghistory.museum",
	"utah.museum",
	"uvic.museum",
	"valley.museum",
	"vantaa.museum",
	"versailles.museum",
	"viking.museum",
	"village.museum",
	"virginia.museum",
	"virtual.museum",
	"virtuel.museum",
	"vlaanderen.museum",
	"volkenkunde.museum",
	"wales.museum",
	"wallonie.museum",
	"war.museum",
	"washingtondc.museum",
	"watchandclock.museum",
	"watch-and-clock.museum",
	"western.museum",
	"westfalen.museum",
	"whaling.museum",
	"wildlife.museum",
	"williamsburg.museum",
	"windmill.museum",
	"workshop.museum",
	"york.museum",
	"yorkshire.museum",
	"yosemite.museum",
	"youth.museum",
	"zoological.museum",
	"zoology.museum",
	"ירושלים.museum",
	"иком.museum",
	"mv",
	"aero.mv",
	"biz.mv",
	"com.mv",
	"coop.mv",
	"edu.mv",
	"gov.mv",
	"info.mv",
	"int.mv",
	"mil.mv",
	"museum.mv",
	"name.mv",
	"net.mv",
	"org.mv",
	"pro.mv",
	"mw",
	"ac.mw",
	"biz.mw",
	"co.mw",
	"com.mw",
	"coop.mw",
	"edu.mw",
	"gov.mw",
	"int.mw",
	"museum.mw",
	"net.mw",
	"org.mw",
	"mx",
	"com.mx",
	"org.mx",
	"gob.mx",
	"edu.mx",
	"net.mx",
	"my",
	"com.my",
	"net.my",
	"org.my",
	"gov.my",
	"edu.my",
	"mil.my",
	"name.my",
	"mz",
	"ac.mz",
	"adv.mz",
	"co.mz",
	"edu.mz",
	"gov.mz",
	"mil.mz",
	"net.mz",
	"org.mz",
	"na",
	"info.na",
	"pro.na",
	"name.na",
	"school.na",
	"or.na",
	"dr.na",
	"us.na",
	"mx.na",
	"ca.na",
	"in.na",
	"cc.na",
	"tv.na",
	"ws.na",
	"mobi.na",
	"co.na",
	"com.na",
	"org.na",
	"name",
	"nc",
	"asso.nc",
	"nom.nc",
	"ne",
	"net",
	"nf",
	"com.nf",
	"net.nf",
	"per.nf",
	"rec.nf",
	"web.nf",
	"arts.nf",
	"firm.nf",
	"info.nf",
	"other.nf",
	"store.nf",
	"ng",
	"com.ng",
	"edu.ng",
	"gov.ng",
	"i.ng",
	"mil.ng",
	"mobi.ng",
	"name.ng",
	"net.ng",
	"org.ng",
	"sch.ng",
	"ni",
	"ac.ni",
	"biz.ni",
	"co.ni",
	"com.ni",
	"edu.ni",
	"gob.ni",
	"in.ni",
	"info.ni",
	"int.ni",
	"mil.ni",
	"net.ni",
	"nom.ni",
	"org.ni",
	"web.ni",
	"nl",
	"no",
	"fhs.no",
	"vgs.no",
	"fylkesbibl.no",
	"folkebibl.no",
	"museum.no",
	"idrett.no",
	"priv.no",
	"mil.no",
	"stat.no",
	"dep.no",
	"kommune.no",
	"herad.no",
	"aa.no",
	"ah.no",
	"bu.no",
	"fm.no",
	"hl.no",
	"hm.no",
	"jan-mayen.no",
	"mr.no",
	"nl.no",
	"nt.no",
	"of.no",
	"ol.no",
	"oslo.no",
	"rl.no",
	"sf.no",
	"st.no",
	"svalbard.no",
	"tm.no",
	"tr.no",
	"va.no",
	"vf.no",
	"gs.aa.no",
	"gs.ah.no",
	"gs.bu.no",
	"gs.fm.no",
	"gs.hl.no",
	"gs.hm.no",
	"gs.jan-mayen.no",
	"gs.mr.no",
	"gs.nl.no",
	"gs.nt.no",
	"gs.of.no",
	"gs.ol.no",
	"gs.oslo.no",
	"gs.rl.no",
	"gs.sf.no",
	"gs.st.no",
	"gs.svalbard.no",
	"gs.tm.no",
	"gs.tr.no",
	"gs.va.no",
	"gs.vf.no",
	"akrehamn.no",
	"åkrehamn.no",
	"algard.no",
	"ålgård.no",
	"arna.no",
	"brumunddal.no",
	"bryne.no",
	"bronnoysund.no",
	"brønnøysund.no",
	"drobak.no",
	"drøbak.no",
	"egersund.no",
	"fetsund.no",
	"floro.no",
	"florø.no",
	"fredrikstad.no",
	"hokksund.no",
	"honefoss.no",
	"hønefoss.no",
	"jessheim.no",
	"jorpeland.no",
	"jørpeland.no",
	"kirkenes.no",
	"kopervik.no",
	"krokstadelva.no",
	"langevag.no",
	"langevåg.no",
	"leirvik.no",
	"mjondalen.no",
	"mjøndalen.no",
	"mo-i-rana.no",
	"mosjoen.no",
	"mosjøen.no",
	"nesoddtangen.no",
	"orkanger.no",
	"osoyro.no",
	"osøyro.no",
	"raholt.no",
	"råholt.no",
	"sandnessjoen.no",
	"sandnessjøen.no",
	"skedsmokorset.no",
	"slattum.no",
	"spjelkavik.no",
	"stathelle.no",
	"stavern.no",
	"stjordalshalsen.no",
	"stjørdalshalsen.no",
	"tananger.no",
	"tranby.no",
	"vossevangen.no",
	"afjord.no",
	"åfjord.no",
	"agdenes.no",
	"al.no",
	"ål.no",
	"alesund.no",
	"ålesund.no",
	"alstahaug.no",
	"alta.no",
	"áltá.no",
	"alaheadju.no",
	"álaheadju.no",
	"alvdal.no",
	"amli.no",
	"åmli.no",
	"amot.no",
	"åmot.no",
	"andebu.no",
	"andoy.no",
	"andøy.no",
	"andasuolo.no",
	"ardal.no",
	"årdal.no",
	"aremark.no",
	"arendal.no",
	"ås.no",
	"aseral.no",
	"åseral.no",
	"asker.no",
	"askim.no",
	"askvoll.no",
	"askoy.no",
	"askøy.no",
	"asnes.no",
	"åsnes.no",
	"audnedaln.no",
	"aukra.no",
	"aure.no",
	"aurland.no",
	"aurskog-holand.no",
	"aurskog-høland.no",
	"austevoll.no",
	"austrheim.no",
	"averoy.no",
	"averøy.no",
	"balestrand.no",
	"ballangen.no",
	"balat.no",
	"bálát.no",
	"balsfjord.no",
	"bahccavuotna.no",
	"báhccavuotna.no",
	"bamble.no",
	"bardu.no",
	"beardu.no",
	"beiarn.no",
	"bajddar.no",
	"bájddar.no",
	"baidar.no",
	"báidár.no",
	"berg.no",
	"bergen.no",
	"berlevag.no",
	"berlevåg.no",
	"bearalvahki.no",
	"bearalváhki.no",
	"bindal.no",
	"birkenes.no",
	"bjarkoy.no",
	"bjarkøy.no",
	"bjerkreim.no",
	"bjugn.no",
	"bodo.no",
	"bodø.no",
	"badaddja.no",
	"bådåddjå.no",
	"budejju.no",
	"bokn.no",
	"bremanger.no",
	"bronnoy.no",
	"brønnøy.no",
	"bygland.no",
	"bykle.no",
	"barum.no",
	"bærum.no",
	"bo.telemark.no",
	"bø.telemark.no",
	"bo.nordland.no",
	"bø.nordland.no",
	"bievat.no",
	"bievát.no",
	"bomlo.no",
	"bømlo.no",
	"batsfjord.no",
	"båtsfjord.no",
	"bahcavuotna.no",
	"báhcavuotna.no",
	"dovre.no",
	"drammen.no",
	"drangedal.no",
	"dyroy.no",
	"dyrøy.no",
	"donna.no",
	"dønna.no",
	"eid.no",
	"eidfjord.no",
	"eidsberg.no",
	"eidskog.no",
	"eidsvoll.no",
	"eigersund.no",
	"elverum.no",
	"enebakk.no",
	"engerdal.no",
	"etne.no",
	"etnedal.no",
	"evenes.no",
	"evenassi.no",
	"evenášši.no",
	"evje-og-hornnes.no",
	"farsund.no",
	"fauske.no",
	"fuossko.no",
	"fuoisku.no",
	"fedje.no",
	"fet.no",
	"finnoy.no",
	"finnøy.no",
	"fitjar.no",
	"fjaler.no",
	"fjell.no",
	"flakstad.no",
	"flatanger.no",
	"flekkefjord.no",
	"flesberg.no",
	"flora.no",
	"fla.no",
	"flå.no",
	"folldal.no",
	"forsand.no",
	"fosnes.no",
	"frei.no",
	"frogn.no",
	"froland.no",
	"frosta.no",
	"frana.no",
	"fræna.no",
	"froya.no",
	"frøya.no",
	"fusa.no",
	"fyresdal.no",
	"forde.no",
	"førde.no",
	"gamvik.no",
	"gangaviika.no",
	"gáŋgaviika.no",
	"gaular.no",
	"gausdal.no",
	"gildeskal.no",
	"gildeskål.no",
	"giske.no",
	"gjemnes.no",
	"gjerdrum.no",
	"gjerstad.no",
	"gjesdal.no",
	"gjovik.no",
	"gjøvik.no",
	"gloppen.no",
	"gol.no",
	"gran.no",
	"grane.no",
	"granvin.no",
	"gratangen.no",
	"grimstad.no",
	"grong.no",
	"kraanghke.no",
	"kråanghke.no",
	"grue.no",
	"gulen.no",
	"hadsel.no",
	"halden.no",
	"halsa.no",
	"hamar.no",
	"hamaroy.no",
	"habmer.no",
	"hábmer.no",
	"hapmir.no",
	"hápmir.no",
	"hammerfest.no",
	"hammarfeasta.no",
	"hámmárfeasta.no",
	"haram.no",
	"hareid.no",
	"harstad.no",
	"hasvik.no",
	"aknoluokta.no",
	"ákŋoluokta.no",
	"hattfjelldal.no",
	"aarborte.no",
	"haugesund.no",
	"hemne.no",
	"hemnes.no",
	"hemsedal.no",
	"heroy.more-og-romsdal.no",
	"herøy.møre-og-romsdal.no",
	"heroy.nordland.no",
	"herøy.nordland.no",
	"hitra.no",
	"hjartdal.no",
	"hjelmeland.no",
	"hobol.no",
	"hobøl.no",
	"hof.no",
	"hol.no",
	"hole.no",
	"holmestrand.no",
	"holtalen.no",
	"holtålen.no",
	"hornindal.no",
	"horten.no",
	"hurdal.no",
	"hurum.no",
	"hvaler.no",
	"hyllestad.no",
	"hagebostad.no",
	"hægebostad.no",
	"hoyanger.no",
	"høyanger.no",
	"hoylandet.no",
	"høylandet.no",
	"ha.no",
	"hå.no",
	"ibestad.no",
	"inderoy.no",
	"inderøy.no",
	"iveland.no",
	"jevnaker.no",
	"jondal.no",
	"jolster.no",
	"jølster.no",
	"karasjok.no",
	"karasjohka.no",
	"kárášjohka.no",
	"karlsoy.no",
	"galsa.no",
	"gálsá.no",
	"karmoy.no",
	"karmøy.no",
	"kautokeino.no",
	"guovdageaidnu.no",
	"klepp.no",
	"klabu.no",
	"klæbu.no",
	"kongsberg.no",
	"kongsvinger.no",
	"kragero.no",
	"kragerø.no",
	"kristiansand.no",
	"kristiansund.no",
	"krodsherad.no",
	"krødsherad.no",
	"kvalsund.no",
	"rahkkeravju.no",
	"ráhkkerávju.no",
	"kvam.no",
	"kvinesdal.no",
	"kvinnherad.no",
	"kviteseid.no",
	"kvitsoy.no",
	"kvitsøy.no",
	"kvafjord.no",
	"kvæfjord.no",
	"giehtavuoatna.no",
	"kvanangen.no",
	"kvænangen.no",
	"navuotna.no",
	"návuotna.no",
	"kafjord.no",
	"kåfjord.no",
	"gaivuotna.no",
	"gáivuotna.no",
	"larvik.no",
	"lavangen.no",
	"lavagis.no",
	"loabat.no",
	"loabát.no",
	"lebesby.no",
	"davvesiida.no",
	"leikanger.no",
	"leirfjord.no",
	"leka.no",
	"leksvik.no",
	"lenvik.no",
	"leangaviika.no",
	"leaŋgaviika.no",
	"lesja.no",
	"levanger.no",
	"lier.no",
	"lierne.no",
	"lillehammer.no",
	"lillesand.no",
	"lindesnes.no",
	"lindas.no",
	"lindås.no",
	"lom.no",
	"loppa.no",
	"lahppi.no",
	"láhppi.no",
	"lund.no",
	"lunner.no",
	"luroy.no",
	"lurøy.no",
	"luster.no",
	"lyngdal.no",
	"lyngen.no",
	"ivgu.no",
	"lardal.no",
	"lerdal.no",
	"lærdal.no",
	"lodingen.no",
	"lødingen.no",
	"lorenskog.no",
	"lørenskog.no",
	"loten.no",
	"løten.no",
	"malvik.no",
	"masoy.no",
	"måsøy.no",
	"muosat.no",
	"muosát.no",
	"mandal.no",
	"marker.no",
	"marnardal.no",
	"masfjorden.no",
	"meland.no",
	"meldal.no",
	"melhus.no",
	"meloy.no",
	"meløy.no",
	"meraker.no",
	"meråker.no",
	"moareke.no",
	"moåreke.no",
	"midsund.no",
	"midtre-gauldal.no",
	"modalen.no",
	"modum.no",
	"molde.no",
	"moskenes.no",
	"moss.no",
	"mosvik.no",
	"malselv.no",
	"målselv.no",
	"malatvuopmi.no",
	"málatvuopmi.no",
	"namdalseid.no",
	"aejrie.no",
	"namsos.no",
	"namsskogan.no",
	"naamesjevuemie.no",
	"nååmesjevuemie.no",
	"laakesvuemie.no",
	"nannestad.no",
	"narvik.no",
	"narviika.no",
	"naustdal.no",
	"nedre-eiker.no",
	"nes.akershus.no",
	"nes.buskerud.no",
	"nesna.no",
	"nesodden.no",
	"nesseby.no",
	"unjarga.no",
	"unjárga.no",
	"nesset.no",
	"nissedal.no",
	"nittedal.no",
	"nord-aurdal.no",
	"nord-fron.no",
	"nord-odal.no",
	"norddal.no",
	"nordkapp.no",
	"davvenjarga.no",
	"davvenjárga.no",
	"nordre-land.no",
	"nordreisa.no",
	"raisa.no",
	"ráisa.no",
	"nore-og-uvdal.no",
	"notodden.no",
	"naroy.no",
	"nærøy.no",
	"notteroy.no",
	"nøtterøy.no",
	"odda.no",
	"oksnes.no",
	"øksnes.no",
	"oppdal.no",
	"oppegard.no",
	"oppegård.no",
	"orkdal.no",
	"orland.no",
	"ørland.no",
	"orskog.no",
	"ørskog.no",
	"orsta.no",
	"ørsta.no",
	"os.hedmark.no",
	"os.hordaland.no",
	"osen.no",
	"osteroy.no",
	"osterøy.no",
	"ostre-toten.no",
	"østre-toten.no",
	"overhalla.no",
	"ovre-eiker.no",
	"øvre-eiker.no",
	"oyer.no",
	"øyer.no",
	"oygarden.no",
	"øygarden.no",
	"oystre-slidre.no",
	"øystre-slidre.no",
	"porsanger.no",
	"porsangu.no",
	"porsáŋgu.no",
	"porsgrunn.no",
	"radoy.no",
	"radøy.no",
	"rakkestad.no",
	"rana.no",
	"ruovat.no",
	"randaberg.no",
	"rauma.no",
	"rendalen.no",
	"rennebu.no",
	"rennesoy.no",
	"rennesøy.no",
	"rindal.no",
	"ringebu.no",
	"ringerike.no",
	"ringsaker.no",
	"rissa.no",
	"risor.no",
	"risør.no",
	"roan.no",
	"rollag.no",
	"rygge.no",
	"ralingen.no",
	"rælingen.no",
	"rodoy.no",
	"rødøy.no",
	"romskog.no",
	"rømskog.no",
	"roros.no",
	"røros.no",
	"rost.no",
	"røst.no",
	"royken.no",
	"røyken.no",
	"royrvik.no",
	"røyrvik.no",
	"rade.no",
	"råde.no",
	"salangen.no",
	"siellak.no",
	"saltdal.no",
	"salat.no",
	"sálát.no",
	"sálat.no",
	"samnanger.no",
	"sande.more-og-romsdal.no",
	"sande.møre-og-romsdal.no",
	"sande.vestfold.no",
	"sandefjord.no",
	"sandnes.no",
	"sandoy.no",
	"sandøy.no",
	"sarpsborg.no",
	"sauda.no",
	"sauherad.no",
	"sel.no",
	"selbu.no",
	"selje.no",
	"seljord.no",
	"sigdal.no",
	"siljan.no",
	"sirdal.no",
	"skaun.no",
	"skedsmo.no",
	"ski.no",
	"skien.no",
	"skiptvet.no",
	"skjervoy.no",
	"skjervøy.no",
	"skierva.no",
	"skiervá.no",
	"skjak.no",
	"skjåk.no",
	"skodje.no",
	"skanland.no",
	"skånland.no",
	"skanit.no",
	"skánit.no",
	"smola.no",
	"smøla.no",
	"snillfjord.no",
	"snasa.no",
	"snåsa.no",
	"snoasa.no",
	"snaase.no",
	"snåase.no",
	"sogndal.no",
	"sokndal.no",
	"sola.no",
	"solund.no",
	"songdalen.no",
	"sortland.no",
	"spydeberg.no",
	"stange.no",
	"stavanger.no",
	"steigen.no",
	"steinkjer.no",
	"stjordal.no",
	"stjørdal.no",
	"stokke.no",
	"stor-elvdal.no",
	"stord.no",
	"stordal.no",
	"storfjord.no",
	"omasvuotna.no",
	"strand.no",
	"stranda.no",
	"stryn.no",
	"sula.no",
	"suldal.no",
	"sund.no",
	"sunndal.no",
	"surnadal.no",
	"sveio.no",
	"svelvik.no",
	"sykkylven.no",
	"sogne.no",
	"søgne.no",
	"somna.no",
	"sømna.no",
	"sondre-land.no",
	"søndre-land.no",
	"sor-aurdal.no",
	"sør-aurdal.no",
	"sor-fron.no",
	"sør-fron.no",
	"sor-odal.no",
	"sør-odal.no",
	"sor-varanger.no",
	"sør-varanger.no",
	"matta-varjjat.no",
	"mátta-várjjat.no",
	"sorfold.no",
	"sørfold.no",
	"sorreisa.no",
	"sørreisa.no",
	"sorum.no",
	"sørum.no",
	"tana.no",
	"deatnu.no",
	"time.no",
	"tingvoll.no",
	"tinn.no",
	"tjeldsund.no",
	"dielddanuorri.no",
	"tjome.no",
	"tjøme.no",
	"tokke.no",
	"tolga.no",
	"torsken.no",
	"tranoy.no",
	"tranøy.no",
	"tromso.no",
	"tromsø.no",
	"tromsa.no",
	"romsa.no",
	"trondheim.no",
	"troandin.no",
	"trysil.no",
	"trana.no",
	"træna.no",
	"trogstad.no",
	"trøgstad.no",
	"tvedestrand.no",
	"tydal.no",
	"tynset.no",
	"tysfjord.no",
	"divtasvuodna.no",
	"divttasvuotna.no",
	"tysnes.no",
	"tysvar.no",
	"tysvær.no",
	"tonsberg.no",
	"tønsberg.no",
	"ullensaker.no",
	"ullensvang.no",
	"ulvik.no",
	"utsira.no",
	"vadso.no",
	"vadsø.no",
	"cahcesuolo.no",
	"čáhcesuolo.no",
	"vaksdal.no",
	"valle.no",
	"vang.no",
	"vanylven.no",
	"vardo.no",
	"vardø.no",
	"varggat.no",
	"várggát.no",
	"vefsn.no",
	"vaapste.no",
	"vega.no",
	"vegarshei.no",
	"vegårshei.no",
	"vennesla.no",
	"verdal.no",
	"verran.no",
	"vestby.no",
	"vestnes.no",
	"vestre-slidre.no",
	"vestre-toten.no",
	"vestvagoy.no",
	"vestvågøy.no",
	"vevelstad.no",
	"vik.no",
	"vikna.no",
	"vindafjord.no",
	"volda.no",
	"voss.no",
	"varoy.no",
	"værøy.no",
	"vagan.no",
	"vågan.no",
	"voagat.no",
	"vagsoy.no",
	"vågsøy.no",
	"vaga.no",
	"vågå.no",
	"valer.ostfold.no",
	"våler.østfold.no",
	"valer.hedmark.no",
	"våler.hedmark.no",
	"*.np",
	"nr",
	"biz.nr",
	"info.nr",
	"gov.nr",
	"edu.nr",
	"org.nr",
	"net.nr",
	"com.nr",
	"nu",
	"nz",
	"ac.nz",
	"co.nz",
	"cri.nz",
	"geek.nz",
	"gen.nz",
	"govt.nz",
	"health.nz",
	"iwi.nz",
	"kiwi.nz",
	"maori.nz",
	"mil.nz",
	"māori.nz",
	"net.nz",
	"org.nz",
	"parliament.nz",
	"school.nz",
	"om",
	"co.om",
	"com.om",
	"edu.om",
	"gov.om",
	"med.om",
	"museum.om",
	"net.om",
	"org.om",
	"pro.om",
	"onion",
	"org",
	"pa",
	"ac.pa",
	"gob.pa",
	"com.pa",
	"org.pa",
	"sld.pa",
	"edu.pa",
	"net.pa",
	"ing.pa",
	"abo.pa",
	"med.pa",
	"nom.pa",
	"pe",
	"edu.pe",
	"gob.pe",
	"nom.pe",
	"mil.pe",
	"org.pe",
	"com.pe",
	"net.pe",
	"pf",
	"com.pf",
	"org.pf",
	"edu.pf",
	"*.pg",
	"ph",
	"com.ph",
	"net.ph",
	"org.ph",
	"gov.ph",
	"edu.ph",
	"ngo.ph",
	"mil.ph",
	"i.ph",
	"pk",
	"com.pk",
	"net.pk",
	"edu.pk",
	"org.pk",
	"fam.pk",
	"biz.pk",
	"web.pk",
	"gov.pk",
	"gob.pk",
	"gok.pk",
	"gon.pk",
	"gop.pk",
	"gos.pk",
	"info.pk",
	"pl",
	"com.pl",
	"net.pl",
	"org.pl",
	"aid.pl",
	"agro.pl",
	"atm.pl",
	"auto.pl",
	"biz.pl",
	"edu.pl",
	"gmina.pl",
	"gsm.pl",
	"info.pl",
	"mail.pl",
	"miasta.pl",
	"media.pl",
	"mil.pl",
	"nieruchomosci.pl",
	"nom.pl",
	"pc.pl",
	"powiat.pl",
	"priv.pl",
	"realestate.pl",
	"rel.pl",
	"sex.pl",
	"shop.pl",
	"sklep.pl",
	"sos.pl",
	"szkola.pl",
	"targi.pl",
	"tm.pl",
	"tourism.pl",
	"travel.pl",
	"turystyka.pl",
	"gov.pl",
	"ap.gov.pl",
	"ic.gov.pl",
	"is.gov.pl",
	"us.gov.pl",
	"kmpsp.gov.pl",
	"kppsp.gov.pl",
	"kwpsp.gov.pl",
	"psp.gov.pl",
	"wskr.gov.pl",
	"kwp.gov.pl",
	"mw.gov.pl",
	"ug.gov.pl",
	"um.gov.pl",
	"umig.gov.pl",
	"ugim.gov.pl",
	"upow.gov.pl",
	"uw.gov.pl",
	"starostwo.gov.pl",
	"pa.gov.pl",
	"po.gov.pl",
	"psse.gov.pl",
	"pup.gov.pl",
	"rzgw.gov.pl",
	"sa.gov.pl",
	"so.gov.pl",
	"sr.gov.pl",
	"wsa.gov.pl",
	"sko.gov.pl",
	"uzs.gov.pl",
	"wiih.gov.pl",
	"winb.gov.pl",
	"pinb.gov.pl",
	"wios.gov.pl",
	"witd.gov.pl",
	"wzmiuw.gov.pl",
	"piw.gov.pl",
	"wiw.gov.pl",
	"griw.gov.pl",
	"wif.gov.pl",
	"oum.gov.pl",
	"sdn.gov.pl",
	"zp.gov.pl",
	"uppo.gov.pl",
	"mup.gov.pl",
	"wuoz.gov.pl",
	"konsulat.gov.pl",
	"oirm.gov.pl",
	"augustow.pl",
	"babia-gora.pl",
	"bedzin.pl",
	"beskidy.pl",
	"bialowieza.pl",
	"bialystok.pl",
	"bielawa.pl",
	"bieszczady.pl",
	"boleslawiec.pl",
	"bydgoszcz.pl",
	"bytom.pl",
	"cieszyn.pl",
	"czeladz.pl",
	"czest.pl",
	"dlugoleka.pl",
	"elblag.pl",
	"elk.pl",
	"glogow.pl",
	"gniezno.pl",
	"gorlice.pl",
	"grajewo.pl",
	"ilawa.pl",
	"jaworzno.pl",
	"jelenia-gora.pl",
	"jgora.pl",
	"kalisz.pl",
	"kazimierz-dolny.pl",
	"karpacz.pl",
	"kartuzy.pl",
	"kaszuby.pl",
	"katowice.pl",
	"kepno.pl",
	"ketrzyn.pl",
	"klodzko.pl",
	"kobierzyce.pl",
	"kolobrzeg.pl",
	"konin.pl",
	"konskowola.pl",
	"kutno.pl",
	"lapy.pl",
	"lebork.pl",
	"legnica.pl",
	"lezajsk.pl",
	"limanowa.pl",
	"lomza.pl",
	"lowicz.pl",
	"lubin.pl",
	"lukow.pl",
	"malbork.pl",
	"malopolska.pl",
	"mazowsze.pl",
	"mazury.pl",
	"mielec.pl",
	"mielno.pl",
	"mragowo.pl",
	"naklo.pl",
	"nowaruda.pl",
	"nysa.pl",
	"olawa.pl",
	"olecko.pl",
	"olkusz.pl",
	"olsztyn.pl",
	"opoczno.pl",
	"opole.pl",
	"ostroda.pl",
	"ostroleka.pl",
	"ostrowiec.pl",
	"ostrowwlkp.pl",
	"pila.pl",
	"pisz.pl",
	"podhale.pl",
	"podlasie.pl",
	"polkowice.pl",
	"pomorze.pl",
	"pomorskie.pl",
	"prochowice.pl",
	"pruszkow.pl",
	"przeworsk.pl",
	"pulawy.pl",
	"radom.pl",
	"rawa-maz.pl",
	"rybnik.pl",
	"rzeszow.pl",
	"sanok.pl",
	"sejny.pl",
	"slask.pl",
	"slupsk.pl",
	"sosnowiec.pl",
	"stalowa-wola.pl",
	"skoczow.pl",
	"starachowice.pl",
	"stargard.pl",
	"suwalki.pl",
	"swidnica.pl",
	"swiebodzin.pl",
	"swinoujscie.pl",
	"szczecin.pl",
	"szczytno.pl",
	"tarnobrzeg.pl",
	"tgory.pl",
	"turek.pl",
	"tychy.pl",
	"ustka.pl",
	"walbrzych.pl",
	"warmia.pl",
	"warszawa.pl",
	"waw.pl",
	"wegrow.pl",
	"wielun.pl",
	"wlocl.pl",
	"wloclawek.pl",
	"wodzislaw.pl",
	"wolomin.pl",
	"wroclaw.pl",
	"zachpomor.pl",
	"zagan.pl",
	"zarow.pl",
	"zgora.pl",
	"zgorzelec.pl",
	"pm",
	"pn",
	"gov.pn",
	"co.pn",
	"org.pn",
	"edu.pn",
	"net.pn",
	"post",
	"pr",
	"com.pr",
	"net.pr",
	"org.pr",
	"gov.pr",
	"edu.pr",
	"isla.pr",
	"pro.pr",
	"biz.pr",
	"info.pr",
	"name.pr",
	"est.pr",
	"prof.pr",
	"ac.pr",
	"pro",
	"aaa.pro",
	"aca.pro",
	"acct.pro",
	"avocat.pro",
	"bar.pro",
	"cpa.pro",
	"eng.pro",
	"jur.pro",
	"law.pro",
	"med.pro",
	"recht.pro",
	"ps",
	"edu.ps",
	"gov.ps",
	"sec.ps",
	"plo.ps",
	"com.ps",
	"org.ps",
	"net.ps",
	"pt",
	"net.pt",
	"gov.pt",
	"org.pt",
	"edu.pt",
	"int.pt",
	"publ.pt",
	"com.pt",
	"nome.pt",
	"pw",
	"co.pw",
	"ne.pw",
	"or.pw",
	"ed.pw",
	"go.pw",
	"belau.pw",
	"py",
	"com.py",
	"coop.py",
	"edu.py",
	"gov.py",
	"mil.py",
	"net.py",
	"org.py",
	"qa",
	"com.qa",
	"edu.qa",
	"gov.qa",
	"mil.qa",
	"name.qa",
	"net.qa",
	"org.qa",
	"sch.qa",
	"re",
	"asso.re",
	"com.re",
	"nom.re",
	"ro",
	"arts.ro",
	"com.ro",
	"firm.ro",
	"info.ro",
	"nom.ro",
	"nt.ro",
	"org.ro",
	"rec.ro",
	"store.ro",
	"tm.ro",
	"www.ro",
	"rs",
	"ac.rs",
	"co.rs",
	"edu.rs",
	"gov.rs",
	"in.rs",
	"org.rs",
	"ru",
	"ac.ru",
	"edu.ru",
	"gov.ru",
	"int.ru",
	"mil.ru",
	"test.ru",
	"rw",
	"ac.rw",
	"co.rw",
	"coop.rw",
	"gov.rw",
	"mil.rw",
	"net.rw",
	"org.rw",
	"sa",
	"com.sa",
	"net.sa",
	"org.sa",
	"gov.sa",
	"med.sa",
	"pub.sa",
	"edu.sa",
	"sch.sa",
	"sb",
	"com.sb",
	"edu.sb",
	"gov.sb",
	"net.sb",
	"org.sb",
	"sc",
	"com.sc",
	"gov.sc",
	"net.sc",
	"org.sc",
	"edu.sc",
	"sd",
	"com.sd",
	"net.sd",
	"org.sd",
	"edu.sd",
	"med.sd",
	"tv.sd",
	"gov.sd",
	"info.sd",
	"se",
	"a.se",
	"ac.se",
	"b.se",
	"bd.se",
	"brand.se",
	"c.se",
	"d.se",
	"e.se",
	"f.se",
	"fh.se",
	"fhsk.se",
	"fhv.se",
	"g.se",
	"h.se",
	"i.se",
	"k.se",
	"komforb.se",
	"kommunalforbund.se",
	"komvux.se",
	"l.se",
	"lanbib.se",
	"m.se",
	"n.se",
	"naturbruksgymn.se",
	"o.se",
	"org.se",
	"p.se",
	"parti.se",
	"pp.se",
	"press.se",
	"r.se",
	"s.se",
	"t.se",
	"tm.se",
	"u.se",
	"w.se",
	"x.se",
	"y.se",
	"z.se",
	"sg",
	"com.sg",
	"net.sg",
	"org.sg",
	"gov.sg",
	"edu.sg",
	"per.sg",
	"sh",
	"com.sh",
	"net.sh",
	"gov.sh",
	"org.sh",
	"mil.sh",
	"si",
	"sj",
	"sk",
	"sl",
	"com.sl",
	"net.sl",
	"edu.sl",
	"gov.sl",
	"org.sl",
	"sm",
	"sn",
	"art.sn",
	"com.sn",
	"edu.sn",
	"gouv.sn",
	"org.sn",
	"perso.sn",
	"univ.sn",
	"so",
	"com.so",
	"net.so",
	"org.so",
	"sr",
	"st",
	"co.st",
	"com.st",
	"consulado.st",
	"edu.st",
	"embaixada.st",
	"gov.st",
	"mil.st",
	"net.st",
	"org.st",
	"principe.st",
	"saotome.st",
	"store.st",
	"su",
	"sv",
	"com.sv",
	"edu.sv",
	"gob.sv",
	"org.sv",
	"red.sv",
	"sx",
	"gov.sx",
	"sy",
	"edu.sy",
	"gov.sy",
	"net.sy",
	"mil.sy",
	"com.sy",
	"org.sy",
	"sz",
	"co.sz",
	"ac.sz",
	"org.sz",
	"tc",
	"td",
	"tel",
	"tf",
	"tg",
	"th",
	"ac.th",
	"co.th",
	"go.th",
	"in.th",
	"mi.th",
	"net.th",
	"or.th",
	"tj",
	"ac.tj",
	"biz.tj",
	"co.tj",
	"com.tj",
	"edu.tj",
	"go.tj",
	"gov.tj",
	"int.tj",
	"mil.tj",
	"name.tj",
	"net.tj",
	"nic.tj",
	"org.tj",
	"test.tj",
	"web.tj",
	"tk",
	"tl",
	"gov.tl",
	"tm",
	"com.tm",
	"co.tm",
	"org.tm",
	"net.tm",
	"nom.tm",
	"gov.tm",
	"mil.tm",
	"edu.tm",
	"tn",
	"com.tn",
	"ens.tn",
	"fin.tn",
	"gov.tn",
	"ind.tn",
	"intl.tn",
	"nat.tn",
	"net.tn",
	"org.tn",
	"info.tn",
	"perso.tn",
	"tourism.tn",
	"edunet.tn",
	"rnrt.tn",
	"rns.tn",
	"rnu.tn",
	"mincom.tn",
	"agrinet.tn",
	"defense.tn",
	"turen.tn",
	"to",
	"com.to",
	"gov.to",
	"net.to",
	"org.to",
	"edu.to",
	"mil.to",
	"tr",
	"av.tr",
	"bbs.tr",
	"bel.tr",
	"biz.tr",
	"com.tr",
	"dr.tr",
	"edu.tr",
	"gen.tr",
	"gov.tr",
	"info.tr",
	"mil.tr",
	"k12.tr",
	"kep.tr",
	"name.tr",
	"net.tr",
	"org.tr",
	"pol.tr",
	"tel.tr",
	"tsk.tr",
	"tv.tr",
	"web.tr",
	"nc.tr",
	"gov.nc.tr",
	"tt",
	"co.tt",
	"com.tt",
	"org.tt",
	"net.tt",
	"biz.tt",
	"info.tt",
	"pro.tt",
	"int.tt",
	"coop.tt",
	"jobs.tt",
	"mobi.tt",
	"travel.tt",
	"museum.tt",
	"aero.tt",
	"name.tt",
	"gov.tt",
	"edu.tt",
	"tv",
	"tw",
	"edu.tw",
	"gov.tw",
	"mil.tw",
	"com.tw",
	"net.tw",
	"org.tw",
	"idv.tw",
	"game.tw",
	"ebiz.tw",
	"club.tw",
	"網路.tw",
	"組織.tw",
	"商業.tw",
	"tz",
	"ac.tz",
	"co.tz",
	"go.tz",
	"hotel.tz",
	"info.tz",
	"me.tz",
	"mil.tz",
	"mobi.tz",
	"ne.tz",
	"or.tz",
	"sc.tz",
	"tv.tz",
	"ua",
	"com.ua",
	"edu.ua",
	"gov.ua",
	"in.ua",
	"net.ua",
	"org.ua",
	"cherkassy.ua",
	"cherkasy.ua",
	"chernigov.ua",
	"chernihiv.ua",
	"chernivtsi.ua",
	"chernovtsy.ua",
	"ck.ua",
	"cn.ua",
	"cr.ua",
	"crimea.ua",
	"cv.ua",
	"dn.ua",
	"dnepropetrovsk.ua",
	"dnipropetrovsk.ua",
	"dominic.ua",
	"donetsk.ua",
	"dp.ua",
	"if.ua",
	"ivano-frankivsk.ua",
	"kh.ua",
	"kharkiv.ua",
	"kharkov.ua",
	"kherson.ua",
	"khmelnitskiy.ua",
	"khmelnytskyi.ua",
	"kiev.ua",
	"kirovograd.ua",
	"km.ua",
	"kr.ua",
	"krym.ua",
	"ks.ua",
	"kv.ua",
	"kyiv.ua",
	"lg.ua",
	"lt.ua",
	"lugansk.ua",
	"lutsk.ua",
	"lv.ua",
	"lviv.ua",
	"mk.ua",
	"mykolaiv.ua",
	"nikolaev.ua",
	"od.ua",
	"odesa.ua",
	"odessa.ua",
	"pl.ua",
	"poltava.ua",
	"rivne.ua",
	"rovno.ua",
	"rv.ua",
	"sb.ua",
	"sebastopol.ua",
	"sevastopol.ua",
	"sm.ua",
	"sumy.ua",
	"te.ua",
	"ternopil.ua",
	"uz.ua",
	"uzhgorod.ua",
	"vinnica.ua",
	"vinnytsia.ua",
	"vn.ua",
	"volyn.ua",
	"yalta.ua",
	"zaporizhzhe.ua",
	"zaporizhzhia.ua",
	"zhitomir.ua",
	"zhytomyr.ua",
	"zp.ua",
	"zt.ua",
	"ug",
	"co.ug",
	"or.ug",
	"ac.ug",
	"sc.ug",
	"go.ug",
	"ne.ug",
	"com.ug",
	"org.ug",
	"uk",
	"ac.uk",
	"co.uk",
	"gov.uk",
	"ltd.uk",
	"me.uk",
	"net.uk",
	"nhs.uk",
	"org.uk",
	"plc.uk",
	"police.uk",
	"*.sch.uk",
	"us",
	"dni.us",
	"fed.us",
	"isa.us",
	"kids.us",
	"nsn.us",
	"ak.us",
	"al.us",
	"ar.us",
	"as.us",
	"az.us",
	"ca.us",
	"co.us",
	"ct.us",
	"dc.us",
	"de.us",
	"fl.us",
	"ga.us",
	"gu.us",
	"hi.us",
	"ia.us",
	"id.us",
	"il.us",
	"in.us",
	"ks.us",
	"ky.us",
	"la.us",
	"ma.us",
	"md.us",
	"me.us",
	"mi.us",
	"mn.us",
	"mo.us",
	"ms.us",
	"mt.us",
	"nc.us",
	"nd.us",
	"ne.us",
	"nh.us",
	"nj.us",
	"nm.us",
	"nv.us",
	"ny.us",
	"oh.us",
	"ok.us",
	"or.us",
	"pa.us",
	"pr.us",
	"ri.us",
	"sc.us",
	"sd.us",
	"tn.us",
	"tx.us",
	"ut.us",
	"vi.us",
	"vt.us",
	"va.us",
	"wa.us",
	"wi.us",
	"wv.us",
	"wy.us",
	"k12.ak.us",
	"k12.al.us",
	"k12.ar.us",
	"k12.as.us",
	"k12.az.us",
	"k12.ca.us",
	"k12.co.us",
	"k12.ct.us",
	"k12.dc.us",
	"k12.de.us",
	"k12.fl.us",
	"k12.ga.us",
	"k12.gu.us",
	"k12.ia.us",
	"k12.id.us",
	"k12.il.us",
	"k12.in.us",
	"k12.ks.us",
	"k12.ky.us",
	"k12.la.us",
	"k12.ma.us",
	"k12.md.us",
	"k12.me.us",
	"k12.mi.us",
	"k12.mn.us",
	"k12.mo.us",
	"k12.ms.us",
	"k12.mt.us",
	"k12.nc.us",
	"k12.ne.us",
	"k12.nh.us",
	"k12.nj.us",
	"k12.nm.us",
	"k12.nv.us",
	"k12.ny.us",
	"k12.oh.us",
	"k12.ok.us",
	"k12.or.us",
	"k12.pa.us",
	"k12.pr.us",
	"k12.ri.us",
	"k12.sc.us",
	"k12.tn.us",
	"k12.tx.us",
	"k12.ut.us",
	"k12.vi.us",
	"k12.vt.us",
	"k12.va.us",
	"k12.wa.us",
	"k12.wi.us",
	"k12.wy.us",
	"cc.ak.us",
	"cc.al.us",
	"cc.ar.us",
	"cc.as.us",
	"cc.az.us",
	"cc.ca.us",
	"cc.co.us",
	"cc.ct.us",
	"cc.dc.us",
	"cc.de.us",
	"cc.fl.us",
	"cc.ga.us",
	"cc.gu.us",
	"cc.hi.us",
	"cc.ia.us",
	"cc.id.us",
	"cc.il.us",
	"cc.in.us",
	"cc.ks.us",
	"cc.ky.us",
	"cc.la.us",
	"cc.ma.us",
	"cc.md.us",
	"cc.me.us",
	"cc.mi.us",
	"cc.mn.us",
	"cc.mo.us",
	"cc.ms.us",
	"cc.mt.us",
	"cc.nc.us",
	"cc.nd.us",
	"cc.ne.us",
	"cc.nh.us",
	"cc.nj.us",
	"cc.nm.us",
	"cc.nv.us",
	"cc.ny.us",
	"cc.oh.us",
	"cc.ok.us",
	"cc.or.us",
	"cc.pa.us",
	"cc.pr.us",
	"cc.ri.us",
	"cc.sc.us",
	"cc.sd.us",
	"cc.tn.us",
	"cc.tx.us",
	"cc.ut.us",
	"cc.vi.us",
	"cc.vt.us",
	"cc.va.us",
	"cc.wa.us",
	"cc.wi.us",
	"cc.wv.us",
	"cc.wy.us",
	"lib.ak.us",
	"lib.al.us",
	"lib.ar.us",
	"lib.as.us",
	"lib.az.us",
	"lib.ca.us",
	"lib.co.us",
	"lib.ct.us",
	"lib.dc.us",
	"lib.fl.us",
	"lib.ga.us",
	"lib.gu.us",
	"lib.hi.us",
	"lib.ia.us",
	"lib.id.us",
	"lib.il.us",
	"lib.in.us",
	"lib.ks.us",
	"lib.ky.us",
	"lib.la.us",
	"lib.ma.us",
	"lib.md.us",
	"lib.me.us",
	"lib.mi.us",
	"lib.mn.us",
	"lib.mo.us",
	"lib.ms.us",
	"lib.mt.us",
	"lib.nc.us",
	"lib.nd.us",
	"lib.ne.us",
	"lib.nh.us",
	"lib.nj.us",
	"lib.nm.us",
	"lib.nv.us",
	"lib.ny.us",
	"lib.oh.us",
	"lib.ok.us",
	"lib.or.us",
	"lib.pa.us",
	"lib.pr.us",
	"lib.ri.us",
	"lib.sc.us",
	"lib.sd.us",
	"lib.tn.us",
	"lib.tx.us",
	"lib.ut.us",
	"lib.vi.us",
	"lib.vt.us",
	"lib.va.us",
	"lib.wa.us",
	"lib.wi.us",
	"lib.wy.us",
	"pvt.k12.ma.us",
	"chtr.k12.ma.us",
	"paroch.k12.ma.us",
	"ann-arbor.mi.us",
	"cog.mi.us",
	"dst.mi.us",
	"eaton.mi.us",
	"gen.mi.us",
	"mus.mi.us",
	"tec.mi.us",
	"washtenaw.mi.us",
	"uy",
	"com.uy",
	"edu.uy",
	"gub.uy",
	"mil.uy",
	"net.uy",
	"org.uy",
	"uz",
	"co.uz",
	"com.uz",
	"net.uz",
	"org.uz",
	"va",
	"vc",
	"com.vc",
	"net.vc",
	"org.vc",
	"gov.vc",
	"mil.vc",
	"edu.vc",
	"ve",
	"arts.ve",
	"co.ve",
	"com.ve",
	"e12.ve",
	"edu.ve",
	"firm.ve",
	"gob.ve",
	"gov.ve",
	"info.ve",
	"int.ve",
	"mil.ve",
	"net.ve",
	"org.ve",
	"rec.ve",
	"store.ve",
	"tec.ve",
	"web.ve",
	"vg",
	"vi",
	"co.vi",
	"com.vi",
	"k12.vi",
	"net.vi",
	"org.vi",
	"vn",
	"com.vn",
	"net.vn",
	"org.vn",
	"edu.vn",
	"gov.vn",
	"int.vn",
	"ac.vn",
	"biz.vn",
	"info.vn",
	"name.vn",
	"pro.vn",
	"health.vn",
	"vu",
	"com.vu",
	"edu.vu",
	"net.vu",
	"org.vu",
	"wf",
	"ws",
	"com.ws",
	"net.ws",
	"org.ws",
	"gov.ws",
	"edu.ws",
	"yt",
	"امارات",
	"հայ",
	"বাংলা",
	"бг",
	"бел",
	"中国",
	"中國",
	"الجزائر",
	"مصر",
	"ею",
	"გე",
	"ελ",
	"香港",
	"公司.香港",
	"教育.香港",
	"政府.香港",
	"個人.香港",
	"網絡.香港",
	"組織.香港",
	"ಭಾರತ",
	"ଭାରତ",
	"ভাৰত",
	"भारतम्",
	"भारोत",
	"ڀارت",
	"ഭാരതം",
	"भारत",
	"بارت",
	"بھارت",
	"భారత్",
	"ભારત",
	"ਭਾਰਤ",
	"ভারত",
	"இந்தியா",
	"ایران",
	"ايران",
	"عراق",
	"الاردن",
	"한국",
	"қаз",
	"ලංකා",
	"இலங்கை",
	"المغرب",
	"мкд",
	"мон",
	"澳門",
	"澳门",
	"مليسيا",
	"عمان",
	"پاکستان",
	"پاكستان",
	"فلسطين",
	"срб",
	"пр.срб",
	"орг.срб",
	"обр.срб",
	"од.срб",
	"упр.срб",
	"ак.срб",
	"рф",
	"قطر",
	"السعودية",
	"السعودیة",
	"السعودیۃ",
	"السعوديه",
	"سودان",
	"新加坡",
	"சிங்கப்பூர்",
	"سورية",
	"سوريا",
	"ไทย",
	"ศึกษา.ไทย",
	"ธุรกิจ.ไทย",
	"รัฐบาล.ไทย",
	"ทหาร.ไทย",
	"เน็ต.ไทย",
	"องค์กร.ไทย",
	"تونس",
	"台灣",
	"台湾",
	"臺灣",
	"укр",
	"اليمن",
	"xxx",
	"*.ye",
	"ac.za",
	"agric.za",
	"alt.za",
	"co.za",
	"edu.za",
	"gov.za",
	"grondar.za",
	"law.za",
	"mil.za",
	"net.za",
	"ngo.za",
	"nic.za",
	"nis.za",
	"nom.za",
	"org.za",
	"school.za",
	"tm.za",
	"web.za",
	"zm",
	"ac.zm",
	"biz.zm",
	"co.zm",
	"com.zm",
	"edu.zm",
	"gov.zm",
	"info.zm",
	"mil.zm",
	"net.zm",
	"org.zm",
	"sch.zm",
	"zw",
	"ac.zw",
	"co.zw",
	"gov.zw",
	"mil.zw",
	"org.zw",
	"aaa",
	"aarp",
	"abarth",
	"abb",
	"abbott",
	"abbvie",
	"abc",
	"able",
	"abogado",
	"abudhabi",
	"academy",
	"accenture",
	"accountant",
	"accountants",
	"aco",
	"actor",
	"adac",
	"ads",
	"adult",
	"aeg",
	"aetna",
	"afamilycompany",
	"afl",
	"africa",
	"agakhan",
	"agency",
	"aig",
	"aigo",
	"airbus",
	"airforce",
	"airtel",
	"akdn",
	"alfaromeo",
	"alibaba",
	"alipay",
	"allfinanz",
	"allstate",
	"ally",
	"alsace",
	"alstom",
	"americanexpress",
	"americanfamily",
	"amex",
	"amfam",
	"amica",
	"amsterdam",
	"analytics",
	"android",
	"anquan",
	"anz",
	"aol",
	"apartments",
	"app",
	"apple",
	"aquarelle",
	"arab",
	"aramco",
	"archi",
	"army",
	"art",
	"arte",
	"asda",
	"associates",
	"athleta",
	"attorney",
	"auction",
	"audi",
	"audible",
	"audio",
	"auspost",
	"author",
	"auto",
	"autos",
	"avianca",
	"aws",
	"axa",
	"azure",
	"baby",
	"baidu",
	"banamex",
	"bananarepublic",
	"band",
	"bank",
	"bar",
	"barcelona",
	"barclaycard",
	"barclays",
	"barefoot",
	"bargains",
	"baseball",
	"basketball",
	"bauhaus",
	"bayern",
	"bbc",
	"bbt",
	"bbva",
	"bcg",
	"bcn",
	"beats",
	"beauty",
	"beer",
	"bentley",
	"berlin",
	"best",
	"bestbuy",
	"bet",
	"bharti",
	"bible",
	"bid",
	"bike",
	"bing",
	"bingo",
	"bio",
	"black",
	"blackfriday",
	"blockbuster",
	"blog",
	"bloomberg",
	"blue",
	"bms",
	"bmw",
	"bnl",
	"bnpparibas",
	"boats",
	"boehringer",
	"bofa",
	"bom",
	"bond",
	"boo",
	"book",
	"booking",
	"bosch",
	"bostik",
	"boston",
	"bot",
	"boutique",
	"box",
	"bradesco",
	"bridgestone",
	"broadway",
	"broker",
	"brother",
	"brussels",
	"budapest",
	"bugatti",
	"build",
	"builders",
	"business",
	"buy",
	"buzz",
	"bzh",
	"cab",
	"cafe",
	"cal",
	"call",
	"calvinklein",
	"cam",
	"camera",
	"camp",
	"cancerresearch",
	"canon",
	"capetown",
	"capital",
	"capitalone",
	"car",
	"caravan",
	"cards",
	"care",
	"career",
	"careers",
	"cars",
	"cartier",
	"casa",
	"case",
	"caseih",
	"cash",
	"casino",
	"catering",
	"catholic",
	"cba",
	"cbn",
	"cbre",
	"cbs",
	"ceb",
	"center",
	"ceo",
	"cern",
	"cfa",
	"cfd",
	"chanel",
	"channel",
	"charity",
	"chase",
	"chat",
	"cheap",
	"chintai",
	"christmas",
	"chrome",
	"chrysler",
	"church",
	"cipriani",
	"circle",
	"cisco",
	"citadel",
	"citi",
	"citic",
	"city",
	"cityeats",
	"claims",
	"cleaning",
	"click",
	"clinic",
	"clinique",
	"clothing",
	"cloud",
	"club",
	"clubmed",
	"coach",
	"codes",
	"coffee",
	"college",
	"cologne",
	"comcast",
	"commbank",
	"community",
	"company",
	"compare",
	"computer",
	"comsec",
	"condos",
	"construction",
	"consulting",
	"contact",
	"contractors",
	"cooking",
	"cookingchannel",
	"cool",
	"corsica",
	"country",
	"coupon",
	"coupons",
	"courses",
	"cpa",
	"credit",
	"creditcard",
	"creditunion",
	"cricket",
	"crown",
	"crs",
	"cruise",
	"cruises",
	"csc",
	"cuisinella",
	"cymru",
	"cyou",
	"dabur",
	"dad",
	"dance",
	"data",
	"date",
	"dating",
	"datsun",
	"day",
	"dclk",
	"dds",
	"deal",
	"dealer",
	"deals",
	"degree",
	"delivery",
	"dell",
	"deloitte",
	"delta",
	"democrat",
	"dental",
	"dentist",
	"desi",
	"design",
	"dev",
	"dhl",
	"diamonds",
	"diet",
	"digital",
	"direct",
	"directory",
	"discount",
	"discover",
	"dish",
	"diy",
	"dnp",
	"docs",
	"doctor",
	"dodge",
	"dog",
	"domains",
	"dot",
	"download",
	"drive",
	"dtv",
	"dubai",
	"duck",
	"dunlop",
	"duns",
	"dupont",
	"durban",
	"dvag",
	"dvr",
	"earth",
	"eat",
	"eco",
	"edeka",
	"education",
	"email",
	"emerck",
	"energy",
	"engineer",
	"engineering",
	"enterprises",
	"epson",
	"equipment",
	"ericsson",
	"erni",
	"esq",
	"estate",
	"esurance",
	"etisalat",
	"eurovision",
	"eus",
	"events",
	"everbank",
	"exchange",
	"expert",
	"exposed",
	"express",
	"extraspace",
	"fage",
	"fail",
	"fairwinds",
	"faith",
	"family",
	"fan",
	"fans",
	"farm",
	"farmers",
	"fashion",
	"fast",
	"fedex",
	"feedback",
	"ferrari",
	"ferrero",
	"fiat",
	"fidelity",
	"fido",
	"film",
	"final",
	"finance",
	"financial",
	"fire",
	"firestone",
	"firmdale",
	"fish",
	"fishing",
	"fit",
	"fitness",
	"flickr",
	"flights",
	"flir",
	"florist",
	"flowers",
	"fly",
	"foo",
	"food",
	"foodnetwork",
	"football",
	"ford",
	"forex",
	"forsale",
	"forum",
	"foundation",
	"fox",
	"free",
	"fresenius",
	"frl",
	"frogans",
	"frontdoor",
	"frontier",
	"ftr",
	"fujitsu",
	"fujixerox",
	"fun",
	"fund",
	"furniture",
	"futbol",
	"fyi",
	"gal",
	"gallery",
	"gallo",
	"gallup",
	"game",
	"games",
	"gap",
	"garden",
	"gay",
	"gbiz",
	"gdn",
	"gea",
	"gent",
	"genting",
	"george",
	"ggee",
	"gift",
	"gifts",
	"gives",
	"giving",
	"glade",
	"glass",
	"gle",
	"global",
	"globo",
	"gmail",
	"gmbh",
	"gmo",
	"gmx",
	"godaddy",
	"gold",
	"goldpoint",
	"golf",
	"goo",
	"goodyear",
	"goog",
	"google",
	"gop",
	"got",
	"grainger",
	"graphics",
	"gratis",
	"green",
	"gripe",
	"grocery",
	"group",
	"guardian",
	"gucci",
	"guge",
	"guide",
	"guitars",
	"guru",
	"hair",
	"hamburg",
	"hangout",
	"haus",
	"hbo",
	"hdfc",
	"hdfcbank",
	"health",
	"healthcare",
	"help",
	"helsinki",
	"here",
	"hermes",
	"hgtv",
	"hiphop",
	"hisamitsu",
	"hitachi",
	"hiv",
	"hkt",
	"hockey",
	"holdings",
	"holiday",
	"homedepot",
	"homegoods",
	"homes",
	"homesense",
	"honda",
	"honeywell",
	"horse",
	"hospital",
	"host",
	"hosting",
	"hot",
	"hoteles",
	"hotels",
	"hotmail",
	"house",
	"how",
	"hsbc",
	"hughes",
	"hyatt",
	"hyundai",
	"ibm",
	"icbc",
	"ice",
	"icu",
	"ieee",
	"ifm",
	"ikano",
	"imamat",
	"imdb",
	"immo",
	"immobilien",
	"inc",
	"industries",
	"infiniti",
	"ing",
	"ink",
	"institute",
	"insurance",
	"insure",
	"intel",
	"international",
	"intuit",
	"investments",
	"ipiranga",
	"irish",
	"iselect",
	"ismaili",
	"ist",
	"istanbul",
	"itau",
	"itv",
	"iveco",
	"jaguar",
	"java",
	"jcb",
	"jcp",
	"jeep",
	"jetzt",
	"jewelry",
	"jio",
	"jll",
	"jmp",
	"jnj",
	"joburg",
	"jot",
	"joy",
	"jpmorgan",
	"jprs",
	"juegos",
	"juniper",
	"kaufen",
	"kddi",
	"kerryhotels",
	"kerrylogistics",
	"kerryproperties",
	"kfh",
	"kia",
	"kim",
	"kinder",
	"kindle",
	"kitchen",
	"kiwi",
	"koeln",
	"komatsu",
	"kosher",
	"kpmg",
	"kpn",
	"krd",
	"kred",
	"kuokgroup",
	"kyoto",
	"lacaixa",
	"ladbrokes",
	"lamborghini",
	"lamer",
	"lancaster",
	"lancia",
	"lancome",
	"land",
	"landrover",
	"lanxess",
	"lasalle",
	"lat",
	"latino",
	"latrobe",
	"law",
	"lawyer",
	"lds",
	"lease",
	"leclerc",
	"lefrak",
	"legal",
	"lego",
	"lexus",
	"lgbt",
	"liaison",
	"lidl",
	"life",
	"lifeinsurance",
	"lifestyle",
	"lighting",
	"like",
	"lilly",
	"limited",
	"limo",
	"lincoln",
	"linde",
	"link",
	"lipsy",
	"live",
	"living",
	"lixil",
	"llc",
	"loan",
	"loans",
	"locker",
	"locus",
	"loft",
	"lol",
	"london",
	"lotte",
	"lotto",
	"love",
	"lpl",
	"lplfinancial",
	"ltd",
	"ltda",
	"lundbeck",
	"lupin",
	"luxe",
	"luxury",
	"macys",
	"madrid",
	"maif",
	"maison",
	"makeup",
	"man",
	"management",
	"mango",
	"map",
	"market",
	"marketing",
	"markets",
	"marriott",
	"marshalls",
	"maserati",
	"mattel",
	"mba",
	"mckinsey",
	"med",
	"media",
	"meet",
	"melbourne",
	"meme",
	"memorial",
	"men",
	"menu",
	"merckmsd",
	"metlife",
	"miami",
	"microsoft",
	"mini",
	"mint",
	"mit",
	"mitsubishi",
	"mlb",
	"mls",
	"mma",
	"mobile",
	"mobily",
	"moda",
	"moe",
	"moi",
	"mom",
	"monash",
	"money",
	"monster",
	"mopar",
	"mormon",
	"mortgage",
	"moscow",
	"moto",
	"motorcycles",
	"mov",
	"movie",
	"movistar",
	"msd",
	"mtn",
	"mtr",
	"mutual",
	"nab",
	"nadex",
	"nagoya",
	"nationwide",
	"natura",
	"navy",
	"nba",
	"nec",
	"netbank",
	"netflix",
	"network",
	"neustar",
	"new",
	"newholland",
	"news",
	"next",
	"nextdirect",
	"nexus",
	"nfl",
	"ngo",
	"nhk",
	"nico",
	"nike",
	"nikon",
	"ninja",
	"nissan",
	"nissay",
	"nokia",
	"northwesternmutual",
	"norton",
	"now",
	"nowruz",
	"nowtv",
	"nra",
	"nrw",
	"ntt",
	"nyc",
	"obi",
	"observer",
	"off",
	"office",
	"okinawa",
	"olayan",
	"olayangroup",
	"oldnavy",
	"ollo",
	"omega",
	"one",
	"ong",
	"onl",
	"online",
	"onyourside",
	"ooo",
	"open",
	"oracle",
	"orange",
	"organic",
	"origins",
	"osaka",
	"otsuka",
	"ott",
	"ovh",
	"page",
	"panasonic",
	"paris",
	"pars",
	"partners",
	"parts",
	"party",
	"passagens",
	"pay",
	"pccw",
	"pet",
	"pfizer",
	"pharmacy",
	"phd",
	"philips",
	"phone",
	"photo",
	"photography",
	"photos",
	"physio",
	"piaget",
	"pics",
	"pictet",
	"pictures",
	"pid",
	"pin",
	"ping",
	"pink",
	"pioneer",
	"pizza",
	"place",
	"play",
	"playstation",
	"plumbing",
	"plus",
	"pnc",
	"pohl",
	"poker",
	"politie",
	"porn",
	"pramerica",
	"praxi",
	"press",
	"prime",
	"prod",
	"productions",
	"prof",
	"progressive",
	"promo",
	"properties",
	"property",
	"protection",
	"pru",
	"prudential",
	"pub",
	"pwc",
	"qpon",
	"quebec",
	"quest",
	"qvc",
	"racing",
	"radio",
	"raid",
	"read",
	"realestate",
	"realtor",
	"realty",
	"recipes",
	"red",
	"redstone",
	"redumbrella",
	"rehab",
	"reise",
	"reisen",
	"reit",
	"reliance",
	"ren",
	"rent",
	"rentals",
	"repair",
	"report",
	"republican",
	"rest",
	"restaurant",
	"review",
	"reviews",
	"rexroth",
	"rich",
	"richardli",
	"ricoh",
	"rightathome",
	"ril",
	"rio",
	"rip",
	"rmit",
	"rocher",
	"rocks",
	"rodeo",
	"rogers",
	"room",
	"rsvp",
	"rugby",
	"ruhr",
	"run",
	"rwe",
	"ryukyu",
	"saarland",
	"safe",
	"safety",
	"sakura",
	"sale",
	"salon",
	"samsclub",
	"samsung",
	"sandvik",
	"sandvikcoromant",
	"sanofi",
	"sap",
	"sarl",
	"sas",
	"save",
	"saxo",
	"sbi",
	"sbs",
	"sca",
	"scb",
	"schaeffler",
	"schmidt",
	"scholarships",
	"school",
	"schule",
	"schwarz",
	"science",
	"scjohnson",
	"scor",
	"scot",
	"search",
	"seat",
	"secure",
	"security",
	"seek",
	"select",
	"sener",
	"services",
	"ses",
	"seven",
	"sew",
	"sex",
	"sexy",
	"sfr",
	"shangrila",
	"sharp",
	"shaw",
	"shell",
	"shia",
	"shiksha",
	"shoes",
	"shop",
	"shopping",
	"shouji",
	"show",
	"showtime",
	"shriram",
	"silk",
	"sina",
	"singles",
	"site",
	"ski",
	"skin",
	"sky",
	"skype",
	"sling",
	"smart",
	"smile",
	"sncf",
	"soccer",
	"social",
	"softbank",
	"software",
	"sohu",
	"solar",
	"solutions",
	"song",
	"sony",
	"soy",
	"space",
	"sport",
	"spot",
	"spreadbetting",
	"srl",
	"srt",
	"stada",
	"staples",
	"star",
	"starhub",
	"statebank",
	"statefarm",
	"stc",
	"stcgroup",
	"stockholm",
	"storage",
	"store",
	"stream",
	"studio",
	"study",
	"style",
	"sucks",
	"supplies",
	"supply",
	"support",
	"surf",
	"surgery",
	"suzuki",
	"swatch",
	"swiftcover",
	"swiss",
	"sydney",
	"symantec",
	"systems",
	"tab",
	"taipei",
	"talk",
	"taobao",
	"target",
	"tatamotors",
	"tatar",
	"tattoo",
	"tax",
	"taxi",
	"tci",
	"tdk",
	"team",
	"tech",
	"technology",
	"telefonica",
	"temasek",
	"tennis",
	"teva",
	"thd",
	"theater",
	"theatre",
	"tiaa",
	"tickets",
	"tienda",
	"tiffany",
	"tips",
	"tires",
	"tirol",
	"tjmaxx",
	"tjx",
	"tkmaxx",
	"tmall",
	"today",
	"tokyo",
	"tools",
	"top",
	"toray",
	"toshiba",
	"total",
	"tours",
	"town",
	"toyota",
	"toys",
	"trade",
	"trading",
	"training",
	"travel",
	"travelchannel",
	"travelers",
	"travelersinsurance",
	"trust",
	"trv",
	"tube",
	"tui",
	"tunes",
	"tushu",
	"tvs",
	"ubank",
	"ubs",
	"uconnect",
	"unicom",
	"university",
	"uno",
	"uol",
	"ups",
	"vacations",
	"vana",
	"vanguard",
	"vegas",
	"ventures",
	"verisign",
	"versicherung",
	"vet",
	"viajes",
	"video",
	"vig",
	"viking",
	"villas",
	"vin",
	"vip",
	"virgin",
	"visa",
	"vision",
	"vistaprint",
	"viva",
	"vivo",
	"vlaanderen",
	"vodka",
	"volkswagen",
	"volvo",
	"vote",
	"voting",
	"voto",
	"voyage",
	"vuelos",
	"wales",
	"walmart",
	"walter",
	"wang",
	"wanggou",
	"warman",
	"watch",
	"watches",
	"weather",
	"weatherchannel",
	"webcam",
	"weber",
	"website",
	"wed",
	"wedding",
	"weibo",
	"weir",
	"whoswho",
	"wien",
	"wiki",
	"williamhill",
	"win",
	"windows",
	"wine",
	"winners",
	"wme",
	"wolterskluwer",
	"woodside",
	"work",
	"works",
	"world",
	"wow",
	"wtc",
	"wtf",
	"xbox",
	"xerox",
	"xfinity",
	"xihuan",
	"xin",
	"कॉम",
	"セール",
	"佛山",
	"慈善",
	"集团",
	"在线",
	"大众汽车",
	"点看",
	"คอม",
	"八卦",
	"موقع",
	"公益",
	"公司",
	"香格里拉",
	"网站",
	"移动",
	"我爱你",
	"москва",
	"католик",
	"онлайн",
	"сайт",
	"联通",
	"קום",
	"时尚",
	"微博",
	"淡马锡",
	"ファッション",
	"орг",
	"नेट",
	"ストア",
	"삼성",
	"商标",
	"商店",
	"商城",
	"дети",
	"ポイント",
	"新闻",
	"工行",
	"家電",
	"كوم",
	"中文网",
	"中信",
	"娱乐",
	"谷歌",
	"電訊盈科",
	"购物",
	"クラウド",
	"通販",
	"网店",
	"संगठन",
	"餐厅",
	"网络",
	"ком",
	"诺基亚",
	"食品",
	"飞利浦",
	"手表",
	"手机",
	"ارامكو",
	"العليان",
	"اتصالات",
	"بازار",
	"موبايلي",
	"ابوظبي",
	"كاثوليك",
	"همراه",
	"닷컴",
	"政府",
	"شبكة",
	"بيتك",
	"عرب",
	"机构",
	"组织机构",
	"健康",
	"招聘",
	"рус",
	"珠宝",
	"大拿",
	"みんな",
	"グーグル",
	"世界",
	"書籍",
	"网址",
	"닷넷",
	"コム",
	"天主教",
	"游戏",
	"vermögensberater",
	"vermögensberatung",
	"企业",
	"信息",
	"嘉里大酒店",
	"嘉里",
	"广东",
	"政务",
	"xyz",
	"yachts",
	"yahoo",
	"yamaxun",
	"yandex",
	"yodobashi",
	"yoga",
	"yokohama",
	"you",
	"youtube",
	"yun",
	"zappos",
	"zara",
	"zero",
	"zip",
	"zone",
	"zuerich",
	"cc.ua",
	"inf.ua",
	"ltd.ua",
	"beep.pl",
	"barsy.ca",
	"*.compute.estate",
	"*.alces.network",
	"alwaysdata.net",
	"cloudfront.net",
	"*.compute.amazonaws.com",
	"*.compute-1.amazonaws.com",
	"*.compute.amazonaws.com.cn",
	"us-east-1.amazonaws.com",
	"cn-north-1.eb.amazonaws.com.cn",
	"cn-northwest-1.eb.amazonaws.com.cn",
	"elasticbeanstalk.com",
	"ap-northeast-1.elasticbeanstalk.com",
	"ap-northeast-2.elasticbeanstalk.com",
	"ap-northeast-3.elasticbeanstalk.com",
	"ap-south-1.elasticbeanstalk.com",
	"ap-southeast-1.elasticbeanstalk.com",
	"ap-southeast-2.elasticbeanstalk.com",
	"ca-central-1.elasticbeanstalk.com",
	"eu-central-1.elasticbeanstalk.com",
	"eu-west-1.elasticbeanstalk.com",
	"eu-west-2.elasticbeanstalk.com",
	"eu-west-3.elasticbeanstalk.com",
	"sa-east-1.elasticbeanstalk.com",
	"us-east-1.elasticbeanstalk.com",
	"us-east-2.elasticbeanstalk.com",
	"us-gov-west-1.elasticbeanstalk.com",
	"us-west-1.elasticbeanstalk.com",
	"us-west-2.elasticbeanstalk.com",
	"*.elb.amazonaws.com",
	"*.elb.amazonaws.com.cn",
	"s3.amazonaws.com",
	"s3-ap-northeast-1.amazonaws.com",
	"s3-ap-northeast-2.amazonaws.com",
	"s3-ap-south-1.amazonaws.com",
	"s3-ap-southeast-1.amazonaws.com",
	"s3-ap-southeast-2.amazonaws.com",
	"s3-ca-central-1.amazonaws.com",
	"s3-eu-central-1.amazonaws.com",
	"s3-eu-west-1.amazonaws.com",
	"s3-eu-west-2.amazonaws.com",
	"s3-eu-west-3.amazonaws.com",
	"s3-external-1.amazonaws.com",
	"s3-fips-us-gov-west-1.amazonaws.com",
	"s3-sa-east-1.amazonaws.com",
	"s3-us-gov-west-1.amazonaws.com",
	"s3-us-east-2.amazonaws.com",
	"s3-us-west-1.amazonaws.com",
	"s3-us-west-2.amazonaws.com",
	"s3.ap-northeast-2.amazonaws.com",
	"s3.ap-south-1.amazonaws.com",
	"s3.cn-north-1.amazonaws.com.cn",
	"s3.ca-central-1.amazonaws.com",
	"s3.eu-central-1.amazonaws.com",
	"s3.eu-west-2.amazonaws.com",
	"s3.eu-west-3.amazonaws.com",
	"s3.us-east-2.amazonaws.com",
	"s3.dualstack.ap-northeast-1.amazonaws.com",
	"s3.dualstack.ap-northeast-2.amazonaws.com",
	"s3.dualstack.ap-south-1.amazonaws.com",
	"s3.dualstack.ap-southeast-1.amazonaws.com",
	"s3.dualstack.ap-southeast-2.amazonaws.com",
	"s3.dualstack.ca-central-1.amazonaws.com",
	"s3.dualstack.eu-central-1.amazonaws.com",
	"s3.dualstack.eu-west-1.amazonaws.com",
	"s3.dualstack.eu-west-2.amazonaws.com",
	"s3.dualstack.eu-west-3.amazonaws.com",
	"s3.dualstack.sa-east-1.amazonaws.com",
	"s3.dualstack.us-east-1.amazonaws.com",
	"s3.dualstack.us-east-2.amazonaws.com",
	"s3-website-us-east-1.amazonaws.com",
	"s3-website-us-west-1.amazonaws.com",
	"s3-website-us-west-2.amazonaws.com",
	"s3-website-ap-northeast-1.amazonaws.com",
	"s3-website-ap-southeast-1.amazonaws.com",
	"s3-website-ap-southeast-2.amazonaws.com",
	"s3-website-eu-west-1.amazonaws.com",
	"s3-website-sa-east-1.amazonaws.com",
	"s3-website.ap-northeast-2.amazonaws.com",
	"s3-website.ap-south-1.amazonaws.com",
	"s3-website.ca-central-1.amazonaws.com",
	"s3-website.eu-central-1.amazonaws.com",
	"s3-website.eu-west-2.amazonaws.com",
	"s3-website.eu-west-3.amazonaws.com",
	"s3-website.us-east-2.amazonaws.com",
	"t3l3p0rt.net",
	"tele.amune.org",
	"apigee.io",
	"on-aptible.com",
	"user.aseinet.ne.jp",
	"gv.vc",
	"d.gv.vc",
	"user.party.eus",
	"pimienta.org",
	"poivron.org",
	"potager.org",
	"sweetpepper.org",
	"myasustor.com",
	"go-vip.co",
	"go-vip.net",
	"wpcomstaging.com",
	"myfritz.net",
	"*.awdev.ca",
	"*.advisor.ws",
	"b-data.io",
	"backplaneapp.io",
	"balena-devices.com",
	"app.banzaicloud.io",
	"betainabox.com",
	"bnr.la",
	"blackbaudcdn.net",
	"boomla.net",
	"boxfuse.io",
	"square7.ch",
	"bplaced.com",
	"bplaced.de",
	"square7.de",
	"bplaced.net",
	"square7.net",
	"browsersafetymark.io",
	"uk0.bigv.io",
	"dh.bytemark.co.uk",
	"vm.bytemark.co.uk",
	"mycd.eu",
	"carrd.co",
	"crd.co",
	"uwu.ai",
	"ae.org",
	"ar.com",
	"br.com",
	"cn.com",
	"com.de",
	"com.se",
	"de.com",
	"eu.com",
	"gb.com",
	"gb.net",
	"hu.com",
	"hu.net",
	"jp.net",
	"jpn.com",
	"kr.com",
	"mex.com",
	"no.com",
	"qc.com",
	"ru.com",
	"sa.com",
	"se.net",
	"uk.com",
	"uk.net",
	"us.com",
	"uy.com",
	"za.bz",
	"za.com",
	"africa.com",
	"gr.com",
	"in.net",
	"us.org",
	"co.com",
	"c.la",
	"certmgr.org",
	"xenapponazure.com",
	"discourse.group",
	"virtueeldomein.nl",
	"cleverapps.io",
	"*.lcl.dev",
	"*.stg.dev",
	"c66.me",
	"cloud66.ws",
	"cloud66.zone",
	"jdevcloud.com",
	"wpdevcloud.com",
	"cloudaccess.host",
	"freesite.host",
	"cloudaccess.net",
	"cloudcontrolled.com",
	"cloudcontrolapp.com",
	"cloudera.site",
	"trycloudflare.com",
	"workers.dev",
	"wnext.app",
	"co.ca",
	"*.otap.co",
	"co.cz",
	"c.cdn77.org",
	"cdn77-ssl.net",
	"r.cdn77.net",
	"rsc.cdn77.org",
	"ssl.origin.cdn77-secure.org",
	"cloudns.asia",
	"cloudns.biz",
	"cloudns.club",
	"cloudns.cc",
	"cloudns.eu",
	"cloudns.in",
	"cloudns.info",
	"cloudns.org",
	"cloudns.pro",
	"cloudns.pw",
	"cloudns.us",
	"cloudeity.net",
	"cnpy.gdn",
	"co.nl",
	"co.no",
	"webhosting.be",
	"hosting-cluster.nl",
	"dyn.cosidns.de",
	"dynamisches-dns.de",
	"dnsupdater.de",
	"internet-dns.de",
	"l-o-g-i-n.de",
	"dynamic-dns.info",
	"feste-ip.net",
	"knx-server.net",
	"static-access.net",
	"realm.cz",
	"*.cryptonomic.net",
	"cupcake.is",
	"cyon.link",
	"cyon.site",
	"daplie.me",
	"localhost.daplie.me",
	"dattolocal.com",
	"dattorelay.com",
	"dattoweb.com",
	"mydatto.com",
	"dattolocal.net",
	"mydatto.net",
	"biz.dk",
	"co.dk",
	"firm.dk",
	"reg.dk",
	"store.dk",
	"*.dapps.earth",
	"*.bzz.dapps.earth",
	"debian.net",
	"dedyn.io",
	"dnshome.de",
	"online.th",
	"shop.th",
	"drayddns.com",
	"dreamhosters.com",
	"mydrobo.com",
	"drud.io",
	"drud.us",
	"duckdns.org",
	"dy.fi",
	"tunk.org",
	"dyndns-at-home.com",
	"dyndns-at-work.com",
	"dyndns-blog.com",
	"dyndns-free.com",
	"dyndns-home.com",
	"dyndns-ip.com",
	"dyndns-mail.com",
	"dyndns-office.com",
	"dyndns-pics.com",
	"dyndns-remote.com",
	"dyndns-server.com",
	"dyndns-web.com",
	"dyndns-wiki.com",
	"dyndns-work.com",
	"dyndns.biz",
	"dyndns.info",
	"dyndns.org",
	"dyndns.tv",
	"at-band-camp.net",
	"ath.cx",
	"barrel-of-knowledge.info",
	"barrell-of-knowledge.info",
	"better-than.tv",
	"blogdns.com",
	"blogdns.net",
	"blogdns.org",
	"blogsite.org",
	"boldlygoingnowhere.org",
	"broke-it.net",
	"buyshouses.net",
	"cechire.com",
	"dnsalias.com",
	"dnsalias.net",
	"dnsalias.org",
	"dnsdojo.com",
	"dnsdojo.net",
	"dnsdojo.org",
	"does-it.net",
	"doesntexist.com",
	"doesntexist.org",
	"dontexist.com",
	"dontexist.net",
	"dontexist.org",
	"doomdns.com",
	"doomdns.org",
	"dvrdns.org",
	"dyn-o-saur.com",
	"dynalias.com",
	"dynalias.net",
	"dynalias.org",
	"dynathome.net",
	"dyndns.ws",
	"endofinternet.net",
	"endofinternet.org",
	"endoftheinternet.org",
	"est-a-la-maison.com",
	"est-a-la-masion.com",
	"est-le-patron.com",
	"est-mon-blogueur.com",
	"for-better.biz",
	"for-more.biz",
	"for-our.info",
	"for-some.biz",
	"for-the.biz",
	"forgot.her.name",
	"forgot.his.name",
	"from-ak.com",
	"from-al.com",
	"from-ar.com",
	"from-az.net",
	"from-ca.com",
	"from-co.net",
	"from-ct.com",
	"from-dc.com",
	"from-de.com",
	"from-fl.com",
	"from-ga.com",
	"from-hi.com",
	"from-ia.com",
	"from-id.com",
	"from-il.com",
	"from-in.com",
	"from-ks.com",
	"from-ky.com",
	"from-la.net",
	"from-ma.com",
	"from-md.com",
	"from-me.org",
	"from-mi.com",
	"from-mn.com",
	"from-mo.com",
	"from-ms.com",
	"from-mt.com",
	"from-nc.com",
	"from-nd.com",
	"from-ne.com",
	"from-nh.com",
	"from-nj.com",
	"from-nm.com",
	"from-nv.com",
	"from-ny.net",
	"from-oh.com",
	"from-ok.com",
	"from-or.com",
	"from-pa.com",
	"from-pr.com",
	"from-ri.com",
	"from-sc.com",
	"from-sd.com",
	"from-tn.com",
	"from-tx.com",
	"from-ut.com",
	"from-va.com",
	"from-vt.com",
	"from-wa.com",
	"from-wi.com",
	"from-wv.com",
	"from-wy.com",
	"ftpaccess.cc",
	"fuettertdasnetz.de",
	"game-host.org",
	"game-server.cc",
	"getmyip.com",
	"gets-it.net",
	"go.dyndns.org",
	"gotdns.com",
	"gotdns.org",
	"groks-the.info",
	"groks-this.info",
	"ham-radio-op.net",
	"here-for-more.info",
	"hobby-site.com",
	"hobby-site.org",
	"home.dyndns.org",
	"homedns.org",
	"homeftp.net",
	"homeftp.org",
	"homeip.net",
	"homelinux.com",
	"homelinux.net",
	"homelinux.org",
	"homeunix.com",
	"homeunix.net",
	"homeunix.org",
	"iamallama.com",
	"in-the-band.net",
	"is-a-anarchist.com",
	"is-a-blogger.com",
	"is-a-bookkeeper.com",
	"is-a-bruinsfan.org",
	"is-a-bulls-fan.com",
	"is-a-candidate.org",
	"is-a-caterer.com",
	"is-a-celticsfan.org",
	"is-a-chef.com",
	"is-a-chef.net",
	"is-a-chef.org",
	"is-a-conservative.com",
	"is-a-cpa.com",
	"is-a-cubicle-slave.com",
	"is-a-democrat.com",
	"is-a-designer.com",
	"is-a-doctor.com",
	"is-a-financialadvisor.com",
	"is-a-geek.com",
	"is-a-geek.net",
	"is-a-geek.org",
	"is-a-green.com",
	"is-a-guru.com",
	"is-a-hard-worker.com",
	"is-a-hunter.com",
	"is-a-knight.org",
	"is-a-landscaper.com",
	"is-a-lawyer.com",
	"is-a-liberal.com",
	"is-a-libertarian.com",
	"is-a-linux-user.org",
	"is-a-llama.com",
	"is-a-musician.com",
	"is-a-nascarfan.com",
	"is-a-nurse.com",
	"is-a-painter.com",
	"is-a-patsfan.org",
	"is-a-personaltrainer.com",
	"is-a-photographer.com",
	"is-a-player.com",
	"is-a-republican.com",
	"is-a-rockstar.com",
	"is-a-socialist.com",
	"is-a-soxfan.org",
	"is-a-student.com",
	"is-a-teacher.com",
	"is-a-techie.com",
	"is-a-therapist.com",
	"is-an-accountant.com",
	"is-an-actor.com",
	"is-an-actress.com",
	"is-an-anarchist.com",
	"is-an-artist.com",
	"is-an-engineer.com",
	"is-an-entertainer.com",
	"is-by.us",
	"is-certified.com",
	"is-found.org",
	"is-gone.com",
	"is-into-anime.com",
	"is-into-cars.com",
	"is-into-cartoons.com",
	"is-into-games.com",
	"is-leet.com",
	"is-lost.org",
	"is-not-certified.com",
	"is-saved.org",
	"is-slick.com",
	"is-uberleet.com",
	"is-very-bad.org",
	"is-very-evil.org",
	"is-very-good.org",
	"is-very-nice.org",
	"is-very-sweet.org",
	"is-with-theband.com",
	"isa-geek.com",
	"isa-geek.net",
	"isa-geek.org",
	"isa-hockeynut.com",
	"issmarterthanyou.com",
	"isteingeek.de",
	"istmein.de",
	"kicks-ass.net",
	"kicks-ass.org",
	"knowsitall.info",
	"land-4-sale.us",
	"lebtimnetz.de",
	"leitungsen.de",
	"likes-pie.com",
	"likescandy.com",
	"merseine.nu",
	"mine.nu",
	"misconfused.org",
	"mypets.ws",
	"myphotos.cc",
	"neat-url.com",
	"office-on-the.net",
	"on-the-web.tv",
	"podzone.net",
	"podzone.org",
	"readmyblog.org",
	"saves-the-whales.com",
	"scrapper-site.net",
	"scrapping.cc",
	"selfip.biz",
	"selfip.com",
	"selfip.info",
	"selfip.net",
	"selfip.org",
	"sells-for-less.com",
	"sells-for-u.com",
	"sells-it.net",
	"sellsyourhome.org",
	"servebbs.com",
	"servebbs.net",
	"servebbs.org",
	"serveftp.net",
	"serveftp.org",
	"servegame.org",
	"shacknet.nu",
	"simple-url.com",
	"space-to-rent.com",
	"stuff-4-sale.org",
	"stuff-4-sale.us",
	"teaches-yoga.com",
	"thruhere.net",
	"traeumtgerade.de",
	"webhop.biz",
	"webhop.info",
	"webhop.net",
	"webhop.org",
	"worse-than.tv",
	"writesthisblog.com",
	"ddnss.de",
	"dyn.ddnss.de",
	"dyndns.ddnss.de",
	"dyndns1.de",
	"dyn-ip24.de",
	"home-webserver.de",
	"dyn.home-webserver.de",
	"myhome-server.de",
	"ddnss.org",
	"definima.net",
	"definima.io",
	"bci.dnstrace.pro",
	"ddnsfree.com",
	"ddnsgeek.com",
	"giize.com",
	"gleeze.com",
	"kozow.com",
	"loseyourip.com",
	"ooguy.com",
	"theworkpc.com",
	"casacam.net",
	"dynu.net",
	"accesscam.org",
	"camdvr.org",
	"freeddns.org",
	"mywire.org",
	"webredirect.org",
	"myddns.rocks",
	"blogsite.xyz",
	"dynv6.net",
	"e4.cz",
	"mytuleap.com",
	"onred.one",
	"staging.onred.one",
	"enonic.io",
	"customer.enonic.io",
	"eu.org",
	"al.eu.org",
	"asso.eu.org",
	"at.eu.org",
	"au.eu.org",
	"be.eu.org",
	"bg.eu.org",
	"ca.eu.org",
	"cd.eu.org",
	"ch.eu.org",
	"cn.eu.org",
	"cy.eu.org",
	"cz.eu.org",
	"de.eu.org",
	"dk.eu.org",
	"edu.eu.org",
	"ee.eu.org",
	"es.eu.org",
	"fi.eu.org",
	"fr.eu.org",
	"gr.eu.org",
	"hr.eu.org",
	"hu.eu.org",
	"ie.eu.org",
	"il.eu.org",
	"in.eu.org",
	"int.eu.org",
	"is.eu.org",
	"it.eu.org",
	"jp.eu.org",
	"kr.eu.org",
	"lt.eu.org",
	"lu.eu.org",
	"lv.eu.org",
	"mc.eu.org",
	"me.eu.org",
	"mk.eu.org",
	"mt.eu.org",
	"my.eu.org",
	"net.eu.org",
	"ng.eu.org",
	"nl.eu.org",
	"no.eu.org",
	"nz.eu.org",
	"paris.eu.org",
	"pl.eu.org",
	"pt.eu.org",
	"q-a.eu.org",
	"ro.eu.org",
	"ru.eu.org",
	"se.eu.org",
	"si.eu.org",
	"sk.eu.org",
	"tr.eu.org",
	"uk.eu.org",
	"us.eu.org",
	"eu-1.evennode.com",
	"eu-2.evennode.com",
	"eu-3.evennode.com",
	"eu-4.evennode.com",
	"us-1.evennode.com",
	"us-2.evennode.com",
	"us-3.evennode.com",
	"us-4.evennode.com",
	"twmail.cc",
	"twmail.net",
	"twmail.org",
	"mymailer.com.tw",
	"url.tw",
	"apps.fbsbx.com",
	"ru.net",
	"adygeya.ru",
	"bashkiria.ru",
	"bir.ru",
	"cbg.ru",
	"com.ru",
	"dagestan.ru",
	"grozny.ru",
	"kalmykia.ru",
	"kustanai.ru",
	"marine.ru",
	"mordovia.ru",
	"msk.ru",
	"mytis.ru",
	"nalchik.ru",
	"nov.ru",
	"pyatigorsk.ru",
	"spb.ru",
	"vladikavkaz.ru",
	"vladimir.ru",
	"abkhazia.su",
	"adygeya.su",
	"aktyubinsk.su",
	"arkhangelsk.su",
	"armenia.su",
	"ashgabad.su",
	"azerbaijan.su",
	"balashov.su",
	"bashkiria.su",
	"bryansk.su",
	"bukhara.su",
	"chimkent.su",
	"dagestan.su",
	"east-kazakhstan.su",
	"exnet.su",
	"georgia.su",
	"grozny.su",
	"ivanovo.su",
	"jambyl.su",
	"kalmykia.su",
	"kaluga.su",
	"karacol.su",
	"karaganda.su",
	"karelia.su",
	"khakassia.su",
	"krasnodar.su",
	"kurgan.su",
	"kustanai.su",
	"lenug.su",
	"mangyshlak.su",
	"mordovia.su",
	"msk.su",
	"murmansk.su",
	"nalchik.su",
	"navoi.su",
	"north-kazakhstan.su",
	"nov.su",
	"obninsk.su",
	"penza.su",
	"pokrovsk.su",
	"sochi.su",
	"spb.su",
	"tashkent.su",
	"termez.su",
	"togliatti.su",
	"troitsk.su",
	"tselinograd.su",
	"tula.su",
	"tuva.su",
	"vladikavkaz.su",
	"vladimir.su",
	"vologda.su",
	"channelsdvr.net",
	"fastly-terrarium.com",
	"fastlylb.net",
	"map.fastlylb.net",
	"freetls.fastly.net",
	"map.fastly.net",
	"a.prod.fastly.net",
	"global.prod.fastly.net",
	"a.ssl.fastly.net",
	"b.ssl.fastly.net",
	"global.ssl.fastly.net",
	"fastpanel.direct",
	"fastvps-server.com",
	"fhapp.xyz",
	"fedorainfracloud.org",
	"fedorapeople.org",
	"cloud.fedoraproject.org",
	"app.os.fedoraproject.org",
	"app.os.stg.fedoraproject.org",
	"mydobiss.com",
	"filegear.me",
	"filegear-au.me",
	"filegear-de.me",
	"filegear-gb.me",
	"filegear-ie.me",
	"filegear-jp.me",
	"filegear-sg.me",
	"firebaseapp.com",
	"flynnhub.com",
	"flynnhosting.net",
	"freebox-os.com",
	"freeboxos.com",
	"fbx-os.fr",
	"fbxos.fr",
	"freebox-os.fr",
	"freeboxos.fr",
	"freedesktop.org",
	"*.futurecms.at",
	"*.ex.futurecms.at",
	"*.in.futurecms.at",
	"futurehosting.at",
	"futuremailing.at",
	"*.ex.ortsinfo.at",
	"*.kunden.ortsinfo.at",
	"*.statics.cloud",
	"service.gov.uk",
	"gehirn.ne.jp",
	"usercontent.jp",
	"lab.ms",
	"github.io",
	"githubusercontent.com",
	"gitlab.io",
	"glitch.me",
	"cloudapps.digital",
	"london.cloudapps.digital",
	"homeoffice.gov.uk",
	"ro.im",
	"shop.ro",
	"goip.de",
	"run.app",
	"a.run.app",
	"web.app",
	"*.0emm.com",
	"appspot.com",
	"blogspot.ae",
	"blogspot.al",
	"blogspot.am",
	"blogspot.ba",
	"blogspot.be",
	"blogspot.bg",
	"blogspot.bj",
	"blogspot.ca",
	"blogspot.cf",
	"blogspot.ch",
	"blogspot.cl",
	"blogspot.co.at",
	"blogspot.co.id",
	"blogspot.co.il",
	"blogspot.co.ke",
	"blogspot.co.nz",
	"blogspot.co.uk",
	"blogspot.co.za",
	"blogspot.com",
	"blogspot.com.ar",
	"blogspot.com.au",
	"blogspot.com.br",
	"blogspot.com.by",
	"blogspot.com.co",
	"blogspot.com.cy",
	"blogspot.com.ee",
	"blogspot.com.eg",
	"blogspot.com.es",
	"blogspot.com.mt",
	"blogspot.com.ng",
	"blogspot.com.tr",
	"blogspot.com.uy",
	"blogspot.cv",
	"blogspot.cz",
	"blogspot.de",
	"blogspot.dk",
	"blogspot.fi",
	"blogspot.fr",
	"blogspot.gr",
	"blogspot.hk",
	"blogspot.hr",
	"blogspot.hu",
	"blogspot.ie",
	"blogspot.in",
	"blogspot.is",
	"blogspot.it",
	"blogspot.jp",
	"blogspot.kr",
	"blogspot.li",
	"blogspot.lt",
	"blogspot.lu",
	"blogspot.md",
	"blogspot.mk",
	"blogspot.mr",
	"blogspot.mx",
	"blogspot.my",
	"blogspot.nl",
	"blogspot.no",
	"blogspot.pe",
	"blogspot.pt",
	"blogspot.qa",
	"blogspot.re",
	"blogspot.ro",
	"blogspot.rs",
	"blogspot.ru",
	"blogspot.se",
	"blogspot.sg",
	"blogspot.si",
	"blogspot.sk",
	"blogspot.sn",
	"blogspot.td",
	"blogspot.tw",
	"blogspot.ug",
	"blogspot.vn",
	"cloudfunctions.net",
	"cloud.goog",
	"codespot.com",
	"googleapis.com",
	"googlecode.com",
	"pagespeedmobilizer.com",
	"publishproxy.com",
	"withgoogle.com",
	"withyoutube.com",
	"fin.ci",
	"free.hr",
	"caa.li",
	"ua.rs",
	"conf.se",
	"hs.zone",
	"hs.run",
	"hashbang.sh",
	"hasura.app",
	"hasura-app.io",
	"hepforge.org",
	"herokuapp.com",
	"herokussl.com",
	"myravendb.com",
	"ravendb.community",
	"ravendb.me",
	"development.run",
	"ravendb.run",
	"bpl.biz",
	"orx.biz",
	"ng.city",
	"biz.gl",
	"ng.ink",
	"col.ng",
	"firm.ng",
	"gen.ng",
	"ltd.ng",
	"ng.school",
	"sch.so",
	"häkkinen.fi",
	"*.moonscale.io",
	"moonscale.net",
	"iki.fi",
	"dyn-berlin.de",
	"in-berlin.de",
	"in-brb.de",
	"in-butter.de",
	"in-dsl.de",
	"in-dsl.net",
	"in-dsl.org",
	"in-vpn.de",
	"in-vpn.net",
	"in-vpn.org",
	"biz.at",
	"info.at",
	"info.cx",
	"ac.leg.br",
	"al.leg.br",
	"am.leg.br",
	"ap.leg.br",
	"ba.leg.br",
	"ce.leg.br",
	"df.leg.br",
	"es.leg.br",
	"go.leg.br",
	"ma.leg.br",
	"mg.leg.br",
	"ms.leg.br",
	"mt.leg.br",
	"pa.leg.br",
	"pb.leg.br",
	"pe.leg.br",
	"pi.leg.br",
	"pr.leg.br",
	"rj.leg.br",
	"rn.leg.br",
	"ro.leg.br",
	"rr.leg.br",
	"rs.leg.br",
	"sc.leg.br",
	"se.leg.br",
	"sp.leg.br",
	"to.leg.br",
	"pixolino.com",
	"ipifony.net",
	"mein-iserv.de",
	"test-iserv.de",
	"iserv.dev",
	"iobb.net",
	"myjino.ru",
	"*.hosting.myjino.ru",
	"*.landing.myjino.ru",
	"*.spectrum.myjino.ru",
	"*.vps.myjino.ru",
	"*.triton.zone",
	"*.cns.joyent.com",
	"js.org",
	"kaas.gg",
	"khplay.nl",
	"keymachine.de",
	"kinghost.net",
	"uni5.net",
	"knightpoint.systems",
	"co.krd",
	"edu.krd",
	"git-repos.de",
	"lcube-server.de",
	"svn-repos.de",
	"leadpages.co",
	"lpages.co",
	"lpusercontent.com",
	"lelux.site",
	"co.business",
	"co.education",
	"co.events",
	"co.financial",
	"co.network",
	"co.place",
	"co.technology",
	"app.lmpm.com",
	"linkitools.space",
	"linkyard.cloud",
	"linkyard-cloud.ch",
	"members.linode.com",
	"nodebalancer.linode.com",
	"we.bs",
	"loginline.app",
	"loginline.dev",
	"loginline.io",
	"loginline.services",
	"loginline.site",
	"krasnik.pl",
	"leczna.pl",
	"lubartow.pl",
	"lublin.pl",
	"poniatowa.pl",
	"swidnik.pl",
	"uklugs.org",
	"glug.org.uk",
	"lug.org.uk",
	"lugs.org.uk",
	"barsy.bg",
	"barsy.co.uk",
	"barsyonline.co.uk",
	"barsycenter.com",
	"barsyonline.com",
	"barsy.club",
	"barsy.de",
	"barsy.eu",
	"barsy.in",
	"barsy.info",
	"barsy.io",
	"barsy.me",
	"barsy.menu",
	"barsy.mobi",
	"barsy.net",
	"barsy.online",
	"barsy.org",
	"barsy.pro",
	"barsy.pub",
	"barsy.shop",
	"barsy.site",
	"barsy.support",
	"barsy.uk",
	"*.magentosite.cloud",
	"mayfirst.info",
	"mayfirst.org",
	"hb.cldmail.ru",
	"miniserver.com",
	"memset.net",
	"cloud.metacentrum.cz",
	"custom.metacentrum.cz",
	"flt.cloud.muni.cz",
	"usr.cloud.muni.cz",
	"meteorapp.com",
	"eu.meteorapp.com",
	"co.pl",
	"azurecontainer.io",
	"azurewebsites.net",
	"azure-mobile.net",
	"cloudapp.net",
	"mozilla-iot.org",
	"bmoattachments.org",
	"net.ru",
	"org.ru",
	"pp.ru",
	"ui.nabu.casa",
	"pony.club",
	"of.fashion",
	"on.fashion",
	"of.football",
	"in.london",
	"of.london",
	"for.men",
	"and.mom",
	"for.mom",
	"for.one",
	"for.sale",
	"of.work",
	"to.work",
	"nctu.me",
	"bitballoon.com",
	"netlify.com",
	"4u.com",
	"ngrok.io",
	"nh-serv.co.uk",
	"nfshost.com",
	"dnsking.ch",
	"mypi.co",
	"n4t.co",
	"001www.com",
	"ddnslive.com",
	"myiphost.com",
	"forumz.info",
	"16-b.it",
	"32-b.it",
	"64-b.it",
	"soundcast.me",
	"tcp4.me",
	"dnsup.net",
	"hicam.net",
	"now-dns.net",
	"ownip.net",
	"vpndns.net",
	"dynserv.org",
	"now-dns.org",
	"x443.pw",
	"now-dns.top",
	"ntdll.top",
	"freeddns.us",
	"crafting.xyz",
	"zapto.xyz",
	"nsupdate.info",
	"nerdpol.ovh",
	"blogsyte.com",
	"brasilia.me",
	"cable-modem.org",
	"ciscofreak.com",
	"collegefan.org",
	"couchpotatofries.org",
	"damnserver.com",
	"ddns.me",
	"ditchyourip.com",
	"dnsfor.me",
	"dnsiskinky.com",
	"dvrcam.info",
	"dynns.com",
	"eating-organic.net",
	"fantasyleague.cc",
	"geekgalaxy.com",
	"golffan.us",
	"health-carereform.com",
	"homesecuritymac.com",
	"homesecuritypc.com",
	"hopto.me",
	"ilovecollege.info",
	"loginto.me",
	"mlbfan.org",
	"mmafan.biz",
	"myactivedirectory.com",
	"mydissent.net",
	"myeffect.net",
	"mymediapc.net",
	"mypsx.net",
	"mysecuritycamera.com",
	"mysecuritycamera.net",
	"mysecuritycamera.org",
	"net-freaks.com",
	"nflfan.org",
	"nhlfan.net",
	"no-ip.ca",
	"no-ip.co.uk",
	"no-ip.net",
	"noip.us",
	"onthewifi.com",
	"pgafan.net",
	"point2this.com",
	"pointto.us",
	"privatizehealthinsurance.net",
	"quicksytes.com",
	"read-books.org",
	"securitytactics.com",
	"serveexchange.com",
	"servehumour.com",
	"servep2p.com",
	"servesarcasm.com",
	"stufftoread.com",
	"ufcfan.org",
	"unusualperson.com",
	"workisboring.com",
	"3utilities.com",
	"bounceme.net",
	"ddns.net",
	"ddnsking.com",
	"gotdns.ch",
	"hopto.org",
	"myftp.biz",
	"myftp.org",
	"myvnc.com",
	"no-ip.biz",
	"no-ip.info",
	"no-ip.org",
	"noip.me",
	"redirectme.net",
	"servebeer.com",
	"serveblog.net",
	"servecounterstrike.com",
	"serveftp.com",
	"servegame.com",
	"servehalflife.com",
	"servehttp.com",
	"serveirc.com",
	"serveminecraft.net",
	"servemp3.com",
	"servepics.com",
	"servequake.com",
	"sytes.net",
	"webhop.me",
	"zapto.org",
	"stage.nodeart.io",
	"nodum.co",
	"nodum.io",
	"pcloud.host",
	"nyc.mn",
	"nom.ae",
	"nom.af",
	"nom.ai",
	"nom.al",
	"nym.by",
	"nym.bz",
	"nom.cl",
	"nym.ec",
	"nom.gd",
	"nom.ge",
	"nom.gl",
	"nym.gr",
	"nom.gt",
	"nym.gy",
	"nym.hk",
	"nom.hn",
	"nym.ie",
	"nom.im",
	"nom.ke",
	"nym.kz",
	"nym.la",
	"nym.lc",
	"nom.li",
	"nym.li",
	"nym.lt",
	"nym.lu",
	"nym.me",
	"nom.mk",
	"nym.mn",
	"nym.mx",
	"nom.nu",
	"nym.nz",
	"nym.pe",
	"nym.pt",
	"nom.pw",
	"nom.qa",
	"nym.ro",
	"nom.rs",
	"nom.si",
	"nym.sk",
	"nom.st",
	"nym.su",
	"nym.sx",
	"nom.tj",
	"nym.tw",
	"nom.ug",
	"nom.uy",
	"nom.vc",
	"nom.vg",
	"cya.gg",
	"cloudycluster.net",
	"nid.io",
	"opencraft.hosting",
	"operaunite.com",
	"outsystemscloud.com",
	"ownprovider.com",
	"own.pm",
	"ox.rs",
	"oy.lc",
	"pgfog.com",
	"pagefrontapp.com",
	"art.pl",
	"gliwice.pl",
	"krakow.pl",
	"poznan.pl",
	"wroc.pl",
	"zakopane.pl",
	"pantheonsite.io",
	"gotpantheon.com",
	"mypep.link",
	"on-web.fr",
	"*.platform.sh",
	"*.platformsh.site",
	"dyn53.io",
	"co.bn",
	"xen.prgmr.com",
	"priv.at",
	"prvcy.page",
	"*.dweb.link",
	"protonet.io",
	"chirurgiens-dentistes-en-france.fr",
	"byen.site",
	"pubtls.org",
	"qualifioapp.com",
	"instantcloud.cn",
	"ras.ru",
	"qa2.com",
	"dev-myqnapcloud.com",
	"alpha-myqnapcloud.com",
	"myqnapcloud.com",
	"*.quipelements.com",
	"vapor.cloud",
	"vaporcloud.io",
	"rackmaze.com",
	"rackmaze.net",
	"*.on-rancher.cloud",
	"*.on-rio.io",
	"readthedocs.io",
	"rhcloud.com",
	"app.render.com",
	"onrender.com",
	"repl.co",
	"repl.run",
	"resindevice.io",
	"devices.resinstaging.io",
	"hzc.io",
	"wellbeingzone.eu",
	"ptplus.fit",
	"wellbeingzone.co.uk",
	"git-pages.rit.edu",
	"sandcats.io",
	"logoip.de",
	"logoip.com",
	"schokokeks.net",
	"scrysec.com",
	"firewall-gateway.com",
	"firewall-gateway.de",
	"my-gateway.de",
	"my-router.de",
	"spdns.de",
	"spdns.eu",
	"firewall-gateway.net",
	"my-firewall.org",
	"myfirewall.org",
	"spdns.org",
	"biz.ua",
	"co.ua",
	"pp.ua",
	"shiftedit.io",
	"myshopblocks.com",
	"shopitsite.com",
	"mo-siemens.io",
	"1kapp.com",
	"appchizi.com",
	"applinzi.com",
	"sinaapp.com",
	"vipsinaapp.com",
	"siteleaf.net",
	"bounty-full.com",
	"alpha.bounty-full.com",
	"beta.bounty-full.com",
	"stackhero-network.com",
	"static.land",
	"dev.static.land",
	"sites.static.land",
	"apps.lair.io",
	"*.stolos.io",
	"spacekit.io",
	"customer.speedpartner.de",
	"api.stdlib.com",
	"storj.farm",
	"utwente.io",
	"soc.srcf.net",
	"user.srcf.net",
	"temp-dns.com",
	"applicationcloud.io",
	"scapp.io",
	"*.s5y.io",
	"*.sensiosite.cloud",
	"syncloud.it",
	"diskstation.me",
	"dscloud.biz",
	"dscloud.me",
	"dscloud.mobi",
	"dsmynas.com",
	"dsmynas.net",
	"dsmynas.org",
	"familyds.com",
	"familyds.net",
	"familyds.org",
	"i234.me",
	"myds.me",
	"synology.me",
	"vpnplus.to",
	"taifun-dns.de",
	"gda.pl",
	"gdansk.pl",
	"gdynia.pl",
	"med.pl",
	"sopot.pl",
	"edugit.org",
	"telebit.app",
	"telebit.io",
	"*.telebit.xyz",
	"gwiddle.co.uk",
	"thingdustdata.com",
	"cust.dev.thingdust.io",
	"cust.disrec.thingdust.io",
	"cust.prod.thingdust.io",
	"cust.testing.thingdust.io",
	"arvo.network",
	"azimuth.network",
	"bloxcms.com",
	"townnews-staging.com",
	"12hp.at",
	"2ix.at",
	"4lima.at",
	"lima-city.at",
	"12hp.ch",
	"2ix.ch",
	"4lima.ch",
	"lima-city.ch",
	"trafficplex.cloud",
	"de.cool",
	"12hp.de",
	"2ix.de",
	"4lima.de",
	"lima-city.de",
	"1337.pictures",
	"clan.rip",
	"lima-city.rocks",
	"webspace.rocks",
	"lima.zone",
	"*.transurl.be",
	"*.transurl.eu",
	"*.transurl.nl",
	"tuxfamily.org",
	"dd-dns.de",
	"diskstation.eu",
	"diskstation.org",
	"dray-dns.de",
	"draydns.de",
	"dyn-vpn.de",
	"dynvpn.de",
	"mein-vigor.de",
	"my-vigor.de",
	"my-wan.de",
	"syno-ds.de",
	"synology-diskstation.de",
	"synology-ds.de",
	"uber.space",
	"*.uberspace.de",
	"hk.com",
	"hk.org",
	"ltd.hk",
	"inc.hk",
	"virtualuser.de",
	"virtual-user.de",
	"lib.de.us",
	"2038.io",
	"router.management",
	"v-info.info",
	"voorloper.cloud",
	"wafflecell.com",
	"*.webhare.dev",
	"wedeploy.io",
	"wedeploy.me",
	"wedeploy.sh",
	"remotewd.com",
	"wmflabs.org",
	"half.host",
	"xnbay.com",
	"u2.xnbay.com",
	"u2-local.xnbay.com",
	"cistron.nl",
	"demon.nl",
	"xs4all.space",
	"yandexcloud.net",
	"storage.yandexcloud.net",
	"website.yandexcloud.net",
	"official.academy",
	"yolasite.com",
	"ybo.faith",
	"yombo.me",
	"homelink.one",
	"ybo.party",
	"ybo.review",
	"ybo.science",
	"ybo.trade",
	"nohost.me",
	"noho.st",
	"za.net",
	"za.org",
	"now.sh",
	"bss.design",
	"basicserver.io",
	"virtualserver.io",
	"site.builder.nu",
	"enterprisecloud.nu",
	"zone.id"
];

var rules$1 = /*#__PURE__*/Object.freeze({
	'default': rules
});

var require$$0 = getCjsExportFromNamespace(rules$1);

var psl = createCommonjsModule(function (module, exports) {





var internals = {};


//
// Read rules from file.
//
internals.rules = require$$0.map(function (rule) {

  return {
    rule: rule,
    suffix: rule.replace(/^(\*\.|\!)/, ''),
    punySuffix: -1,
    wildcard: rule.charAt(0) === '*',
    exception: rule.charAt(0) === '!'
  };
});


//
// Check is given string ends with `suffix`.
//
internals.endsWith = function (str, suffix) {

  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};


//
// Find rule for a given domain.
//
internals.findRule = function (domain) {

  var punyDomain = punycode_1.toASCII(domain);
  return internals.rules.reduce(function (memo, rule) {

    if (rule.punySuffix === -1){
      rule.punySuffix = punycode_1.toASCII(rule.suffix);
    }
    if (!internals.endsWith(punyDomain, '.' + rule.punySuffix) && punyDomain !== rule.punySuffix) {
      return memo;
    }
    // This has been commented out as it never seems to run. This is because
    // sub tlds always appear after their parents and we never find a shorter
    // match.
    //if (memo) {
    //  var memoSuffix = Punycode.toASCII(memo.suffix);
    //  if (memoSuffix.length >= punySuffix.length) {
    //    return memo;
    //  }
    //}
    return rule;
  }, null);
};


//
// Error codes and messages.
//
exports.errorCodes = {
  DOMAIN_TOO_SHORT: 'Domain name too short.',
  DOMAIN_TOO_LONG: 'Domain name too long. It should be no more than 255 chars.',
  LABEL_STARTS_WITH_DASH: 'Domain name label can not start with a dash.',
  LABEL_ENDS_WITH_DASH: 'Domain name label can not end with a dash.',
  LABEL_TOO_LONG: 'Domain name label should be at most 63 chars long.',
  LABEL_TOO_SHORT: 'Domain name label should be at least 1 character long.',
  LABEL_INVALID_CHARS: 'Domain name label can only contain alphanumeric characters or dashes.'
};


//
// Validate domain name and throw if not valid.
//
// From wikipedia:
//
// Hostnames are composed of series of labels concatenated with dots, as are all
// domain names. Each label must be between 1 and 63 characters long, and the
// entire hostname (including the delimiting dots) has a maximum of 255 chars.
//
// Allowed chars:
//
// * `a-z`
// * `0-9`
// * `-` but not as a starting or ending character
// * `.` as a separator for the textual portions of a domain name
//
// * http://en.wikipedia.org/wiki/Domain_name
// * http://en.wikipedia.org/wiki/Hostname
//
internals.validate = function (input) {

  // Before we can validate we need to take care of IDNs with unicode chars.
  var ascii = punycode_1.toASCII(input);

  if (ascii.length < 1) {
    return 'DOMAIN_TOO_SHORT';
  }
  if (ascii.length > 255) {
    return 'DOMAIN_TOO_LONG';
  }

  // Check each part's length and allowed chars.
  var labels = ascii.split('.');
  var label;

  for (var i = 0; i < labels.length; ++i) {
    label = labels[i];
    if (!label.length) {
      return 'LABEL_TOO_SHORT';
    }
    if (label.length > 63) {
      return 'LABEL_TOO_LONG';
    }
    if (label.charAt(0) === '-') {
      return 'LABEL_STARTS_WITH_DASH';
    }
    if (label.charAt(label.length - 1) === '-') {
      return 'LABEL_ENDS_WITH_DASH';
    }
    if (!/^[a-z0-9\-]+$/.test(label)) {
      return 'LABEL_INVALID_CHARS';
    }
  }
};


//
// Public API
//


//
// Parse domain.
//
exports.parse = function (input) {

  if (typeof input !== 'string') {
    throw new TypeError('Domain name must be a string.');
  }

  // Force domain to lowercase.
  var domain = input.slice(0).toLowerCase();

  // Handle FQDN.
  // TODO: Simply remove trailing dot?
  if (domain.charAt(domain.length - 1) === '.') {
    domain = domain.slice(0, domain.length - 1);
  }

  // Validate and sanitise input.
  var error = internals.validate(domain);
  if (error) {
    return {
      input: input,
      error: {
        message: exports.errorCodes[error],
        code: error
      }
    };
  }

  var parsed = {
    input: input,
    tld: null,
    sld: null,
    domain: null,
    subdomain: null,
    listed: false
  };

  var domainParts = domain.split('.');

  // Non-Internet TLD
  if (domainParts[domainParts.length - 1] === 'local') {
    return parsed;
  }

  var handlePunycode = function () {

    if (!/xn--/.test(domain)) {
      return parsed;
    }
    if (parsed.domain) {
      parsed.domain = punycode_1.toASCII(parsed.domain);
    }
    if (parsed.subdomain) {
      parsed.subdomain = punycode_1.toASCII(parsed.subdomain);
    }
    return parsed;
  };

  var rule = internals.findRule(domain);

  // Unlisted tld.
  if (!rule) {
    if (domainParts.length < 2) {
      return parsed;
    }
    parsed.tld = domainParts.pop();
    parsed.sld = domainParts.pop();
    parsed.domain = [parsed.sld, parsed.tld].join('.');
    if (domainParts.length) {
      parsed.subdomain = domainParts.pop();
    }
    return handlePunycode();
  }

  // At this point we know the public suffix is listed.
  parsed.listed = true;

  var tldParts = rule.suffix.split('.');
  var privateParts = domainParts.slice(0, domainParts.length - tldParts.length);

  if (rule.exception) {
    privateParts.push(tldParts.shift());
  }

  parsed.tld = tldParts.join('.');

  if (!privateParts.length) {
    return handlePunycode();
  }

  if (rule.wildcard) {
    tldParts.unshift(privateParts.pop());
    parsed.tld = tldParts.join('.');
  }

  if (!privateParts.length) {
    return handlePunycode();
  }

  parsed.sld = privateParts.pop();
  parsed.domain = [parsed.sld,  parsed.tld].join('.');

  if (privateParts.length) {
    parsed.subdomain = privateParts.join('.');
  }

  return handlePunycode();
};


//
// Get domain.
//
exports.get = function (domain) {

  if (!domain) {
    return null;
  }
  return exports.parse(domain).domain || null;
};


//
// Check whether domain belongs to a known public suffix.
//
exports.isValid = function (domain) {

  var parsed = exports.parse(domain);
  return Boolean(parsed.domain && parsed.listed);
};
});
var psl_1 = psl.errorCodes;
var psl_2 = psl.parse;
var psl_3 = psl.get;
var psl_4 = psl.isValid;

function getPublicSuffix(domain) {
  return psl.get(domain);
}

var getPublicSuffix_1 = getPublicSuffix;

var pubsuffixPsl = {
	getPublicSuffix: getPublicSuffix_1
};

/*!
 * Copyright (c) 2015, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
/*jshint unused:false */

function Store() {
}
var Store_1 = Store;

// Stores may be synchronous, but are still required to use a
// Continuation-Passing Style API.  The CookieJar itself will expose a "*Sync"
// API that converts from synchronous-callbacks to imperative style.
Store.prototype.synchronous = false;

Store.prototype.findCookie = function(domain, path, key, cb) {
  throw new Error('findCookie is not implemented');
};

Store.prototype.findCookies = function(domain, path, cb) {
  throw new Error('findCookies is not implemented');
};

Store.prototype.putCookie = function(cookie, cb) {
  throw new Error('putCookie is not implemented');
};

Store.prototype.updateCookie = function(oldCookie, newCookie, cb) {
  // recommended default implementation:
  // return this.putCookie(newCookie, cb);
  throw new Error('updateCookie is not implemented');
};

Store.prototype.removeCookie = function(domain, path, key, cb) {
  throw new Error('removeCookie is not implemented');
};

Store.prototype.removeCookies = function(domain, path, cb) {
  throw new Error('removeCookies is not implemented');
};

Store.prototype.removeAllCookies = function(cb) {
  throw new Error('removeAllCookies is not implemented');
};

Store.prototype.getAllCookies = function(cb) {
  throw new Error('getAllCookies is not implemented (therefore jar cannot be serialized)');
};

var store = {
	Store: Store_1
};

// Gives the permutation of all possible domainMatch()es of a given domain. The
// array is in shortest-to-longest order.  Handy for indexing.
function permuteDomain (domain) {
  var pubSuf = pubsuffixPsl.getPublicSuffix(domain);
  if (!pubSuf) {
    return null;
  }
  if (pubSuf == domain) {
    return [domain];
  }

  var prefix = domain.slice(0, -(pubSuf.length + 1)); // ".example.com"
  var parts = prefix.split('.').reverse();
  var cur = pubSuf;
  var permutations = [cur];
  while (parts.length) {
    cur = parts.shift() + '.' + cur;
    permutations.push(cur);
  }
  return permutations;
}

var permuteDomain_2 = permuteDomain;

var permuteDomain_1 = {
	permuteDomain: permuteDomain_2
};

/*!
 * Copyright (c) 2015, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
/*
 * "A request-path path-matches a given cookie-path if at least one of the
 * following conditions holds:"
 */
function pathMatch (reqPath, cookiePath) {
  // "o  The cookie-path and the request-path are identical."
  if (cookiePath === reqPath) {
    return true;
  }

  var idx = reqPath.indexOf(cookiePath);
  if (idx === 0) {
    // "o  The cookie-path is a prefix of the request-path, and the last
    // character of the cookie-path is %x2F ("/")."
    if (cookiePath.substr(-1) === "/") {
      return true;
    }

    // " o  The cookie-path is a prefix of the request-path, and the first
    // character of the request-path that is not included in the cookie- path
    // is a %x2F ("/") character."
    if (reqPath.substr(cookiePath.length, 1) === "/") {
      return true;
    }
  }

  return false;
}

var pathMatch_2 = pathMatch;

var pathMatch_1 = {
	pathMatch: pathMatch_2
};

var Store$1 = store.Store;
var permuteDomain$1 = permuteDomain_1.permuteDomain;
var pathMatch$1 = pathMatch_1.pathMatch;


function MemoryCookieStore() {
  Store$1.call(this);
  this.idx = {};
}
util.inherits(MemoryCookieStore, Store$1);
var MemoryCookieStore_1 = MemoryCookieStore;
MemoryCookieStore.prototype.idx = null;

// Since it's just a struct in RAM, this Store is synchronous
MemoryCookieStore.prototype.synchronous = true;

// force a default depth:
MemoryCookieStore.prototype.inspect = function() {
  return "{ idx: "+util.inspect(this.idx, false, 2)+' }';
};

// Use the new custom inspection symbol to add the custom inspect function if
// available.
if (util.inspect.custom) {
  MemoryCookieStore.prototype[util.inspect.custom] = MemoryCookieStore.prototype.inspect;
}

MemoryCookieStore.prototype.findCookie = function(domain, path, key, cb) {
  if (!this.idx[domain]) {
    return cb(null,undefined);
  }
  if (!this.idx[domain][path]) {
    return cb(null,undefined);
  }
  return cb(null,this.idx[domain][path][key]||null);
};

MemoryCookieStore.prototype.findCookies = function(domain, path, cb) {
  var results = [];
  if (!domain) {
    return cb(null,[]);
  }

  var pathMatcher;
  if (!path) {
    // null means "all paths"
    pathMatcher = function matchAll(domainIndex) {
      for (var curPath in domainIndex) {
        var pathIndex = domainIndex[curPath];
        for (var key in pathIndex) {
          results.push(pathIndex[key]);
        }
      }
    };

  } else {
    pathMatcher = function matchRFC(domainIndex) {
       //NOTE: we should use path-match algorithm from S5.1.4 here
       //(see : https://github.com/ChromiumWebApps/chromium/blob/b3d3b4da8bb94c1b2e061600df106d590fda3620/net/cookies/canonical_cookie.cc#L299)
       Object.keys(domainIndex).forEach(function (cookiePath) {
         if (pathMatch$1(path, cookiePath)) {
           var pathIndex = domainIndex[cookiePath];

           for (var key in pathIndex) {
             results.push(pathIndex[key]);
           }
         }
       });
     };
  }

  var domains = permuteDomain$1(domain) || [domain];
  var idx = this.idx;
  domains.forEach(function(curDomain) {
    var domainIndex = idx[curDomain];
    if (!domainIndex) {
      return;
    }
    pathMatcher(domainIndex);
  });

  cb(null,results);
};

MemoryCookieStore.prototype.putCookie = function(cookie, cb) {
  if (!this.idx[cookie.domain]) {
    this.idx[cookie.domain] = {};
  }
  if (!this.idx[cookie.domain][cookie.path]) {
    this.idx[cookie.domain][cookie.path] = {};
  }
  this.idx[cookie.domain][cookie.path][cookie.key] = cookie;
  cb(null);
};

MemoryCookieStore.prototype.updateCookie = function(oldCookie, newCookie, cb) {
  // updateCookie() may avoid updating cookies that are identical.  For example,
  // lastAccessed may not be important to some stores and an equality
  // comparison could exclude that field.
  this.putCookie(newCookie,cb);
};

MemoryCookieStore.prototype.removeCookie = function(domain, path, key, cb) {
  if (this.idx[domain] && this.idx[domain][path] && this.idx[domain][path][key]) {
    delete this.idx[domain][path][key];
  }
  cb(null);
};

MemoryCookieStore.prototype.removeCookies = function(domain, path, cb) {
  if (this.idx[domain]) {
    if (path) {
      delete this.idx[domain][path];
    } else {
      delete this.idx[domain];
    }
  }
  return cb(null);
};

MemoryCookieStore.prototype.removeAllCookies = function(cb) {
  this.idx = {};
  return cb(null);
};

MemoryCookieStore.prototype.getAllCookies = function(cb) {
  var cookies = [];
  var idx = this.idx;

  var domains = Object.keys(idx);
  domains.forEach(function(domain) {
    var paths = Object.keys(idx[domain]);
    paths.forEach(function(path) {
      var keys = Object.keys(idx[domain][path]);
      keys.forEach(function(key) {
        if (key !== null) {
          cookies.push(idx[domain][path][key]);
        }
      });
    });
  });

  // Sort by creationIndex so deserializing retains the creation order.
  // When implementing your own store, this SHOULD retain the order too
  cookies.sort(function(a,b) {
    return (a.creationIndex||0) - (b.creationIndex||0);
  });

  cb(null, cookies);
};

var memstore = {
	MemoryCookieStore: MemoryCookieStore_1
};

// generated by genversion
var version = '3.0.1';

var urlParse = url.parse;

var ipRegex$1 = ipRegex({ exact: true });

var Store$2 = store.Store;
var MemoryCookieStore$1 = memstore.MemoryCookieStore;
var pathMatch$2 = pathMatch_1.pathMatch;


var punycode$1;
try {
  punycode$1 = punycode_1;
} catch(e) {
  console.warn("tough-cookie: can't load punycode; won't use punycode for domain normalization");
}

// From RFC6265 S4.1.1
// note that it excludes \x3B ";"
var COOKIE_OCTETS = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/;

var CONTROL_CHARS = /[\x00-\x1F]/;

// From Chromium // '\r', '\n' and '\0' should be treated as a terminator in
// the "relaxed" mode, see:
// https://github.com/ChromiumWebApps/chromium/blob/b3d3b4da8bb94c1b2e061600df106d590fda3620/net/cookies/parsed_cookie.cc#L60
var TERMINATORS = ['\n', '\r', '\0'];

// RFC6265 S4.1.1 defines path value as 'any CHAR except CTLs or ";"'
// Note ';' is \x3B
var PATH_VALUE = /[\x20-\x3A\x3C-\x7E]+/;

// date-time parsing constants (RFC6265 S5.1.1)

var DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;

var MONTH_TO_NUM = {
  jan:0, feb:1, mar:2, apr:3, may:4, jun:5,
  jul:6, aug:7, sep:8, oct:9, nov:10, dec:11
};
var NUM_TO_MONTH = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
];
var NUM_TO_DAY = [
  'Sun','Mon','Tue','Wed','Thu','Fri','Sat'
];

var MAX_TIME = 2147483647000; // 31-bit max
var MIN_TIME = 0; // 31-bit min

/*
 * Parses a Natural number (i.e., non-negative integer) with either the
 *    <min>*<max>DIGIT ( non-digit *OCTET )
 * or
 *    <min>*<max>DIGIT
 * grammar (RFC6265 S5.1.1).
 *
 * The "trailingOK" boolean controls if the grammar accepts a
 * "( non-digit *OCTET )" trailer.
 */
function parseDigits(token, minDigits, maxDigits, trailingOK) {
  var count = 0;
  while (count < token.length) {
    var c = token.charCodeAt(count);
    // "non-digit = %x00-2F / %x3A-FF"
    if (c <= 0x2F || c >= 0x3A) {
      break;
    }
    count++;
  }

  // constrain to a minimum and maximum number of digits.
  if (count < minDigits || count > maxDigits) {
    return null;
  }

  if (!trailingOK && count != token.length) {
    return null;
  }

  return parseInt(token.substr(0,count), 10);
}

function parseTime(token) {
  var parts = token.split(':');
  var result = [0,0,0];

  /* RF6256 S5.1.1:
   *      time            = hms-time ( non-digit *OCTET )
   *      hms-time        = time-field ":" time-field ":" time-field
   *      time-field      = 1*2DIGIT
   */

  if (parts.length !== 3) {
    return null;
  }

  for (var i = 0; i < 3; i++) {
    // "time-field" must be strictly "1*2DIGIT", HOWEVER, "hms-time" can be
    // followed by "( non-digit *OCTET )" so therefore the last time-field can
    // have a trailer
    var trailingOK = (i == 2);
    var num = parseDigits(parts[i], 1, 2, trailingOK);
    if (num === null) {
      return null;
    }
    result[i] = num;
  }

  return result;
}

function parseMonth(token) {
  token = String(token).substr(0,3).toLowerCase();
  var num = MONTH_TO_NUM[token];
  return num >= 0 ? num : null;
}

/*
 * RFC6265 S5.1.1 date parser (see RFC for full grammar)
 */
function parseDate(str) {
  if (!str) {
    return;
  }

  /* RFC6265 S5.1.1:
   * 2. Process each date-token sequentially in the order the date-tokens
   * appear in the cookie-date
   */
  var tokens = str.split(DATE_DELIM);
  if (!tokens) {
    return;
  }

  var hour = null;
  var minute = null;
  var second = null;
  var dayOfMonth = null;
  var month = null;
  var year = null;

  for (var i=0; i<tokens.length; i++) {
    var token = tokens[i].trim();
    if (!token.length) {
      continue;
    }

    var result;

    /* 2.1. If the found-time flag is not set and the token matches the time
     * production, set the found-time flag and set the hour- value,
     * minute-value, and second-value to the numbers denoted by the digits in
     * the date-token, respectively.  Skip the remaining sub-steps and continue
     * to the next date-token.
     */
    if (second === null) {
      result = parseTime(token);
      if (result) {
        hour = result[0];
        minute = result[1];
        second = result[2];
        continue;
      }
    }

    /* 2.2. If the found-day-of-month flag is not set and the date-token matches
     * the day-of-month production, set the found-day-of- month flag and set
     * the day-of-month-value to the number denoted by the date-token.  Skip
     * the remaining sub-steps and continue to the next date-token.
     */
    if (dayOfMonth === null) {
      // "day-of-month = 1*2DIGIT ( non-digit *OCTET )"
      result = parseDigits(token, 1, 2, true);
      if (result !== null) {
        dayOfMonth = result;
        continue;
      }
    }

    /* 2.3. If the found-month flag is not set and the date-token matches the
     * month production, set the found-month flag and set the month-value to
     * the month denoted by the date-token.  Skip the remaining sub-steps and
     * continue to the next date-token.
     */
    if (month === null) {
      result = parseMonth(token);
      if (result !== null) {
        month = result;
        continue;
      }
    }

    /* 2.4. If the found-year flag is not set and the date-token matches the
     * year production, set the found-year flag and set the year-value to the
     * number denoted by the date-token.  Skip the remaining sub-steps and
     * continue to the next date-token.
     */
    if (year === null) {
      // "year = 2*4DIGIT ( non-digit *OCTET )"
      result = parseDigits(token, 2, 4, true);
      if (result !== null) {
        year = result;
        /* From S5.1.1:
         * 3.  If the year-value is greater than or equal to 70 and less
         * than or equal to 99, increment the year-value by 1900.
         * 4.  If the year-value is greater than or equal to 0 and less
         * than or equal to 69, increment the year-value by 2000.
         */
        if (year >= 70 && year <= 99) {
          year += 1900;
        } else if (year >= 0 && year <= 69) {
          year += 2000;
        }
      }
    }
  }

  /* RFC 6265 S5.1.1
   * "5. Abort these steps and fail to parse the cookie-date if:
   *     *  at least one of the found-day-of-month, found-month, found-
   *        year, or found-time flags is not set,
   *     *  the day-of-month-value is less than 1 or greater than 31,
   *     *  the year-value is less than 1601,
   *     *  the hour-value is greater than 23,
   *     *  the minute-value is greater than 59, or
   *     *  the second-value is greater than 59.
   *     (Note that leap seconds cannot be represented in this syntax.)"
   *
   * So, in order as above:
   */
  if (
    dayOfMonth === null || month === null || year === null || second === null ||
    dayOfMonth < 1 || dayOfMonth > 31 ||
    year < 1601 ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return;
  }

  return new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second));
}

function formatDate(date) {
  var d = date.getUTCDate(); d = d >= 10 ? d : '0'+d;
  var h = date.getUTCHours(); h = h >= 10 ? h : '0'+h;
  var m = date.getUTCMinutes(); m = m >= 10 ? m : '0'+m;
  var s = date.getUTCSeconds(); s = s >= 10 ? s : '0'+s;
  return NUM_TO_DAY[date.getUTCDay()] + ', ' +
    d+' '+ NUM_TO_MONTH[date.getUTCMonth()] +' '+ date.getUTCFullYear() +' '+
    h+':'+m+':'+s+' GMT';
}

// S5.1.2 Canonicalized Host Names
function canonicalDomain(str) {
  if (str == null) {
    return null;
  }
  str = str.trim().replace(/^\./,''); // S4.1.2.3 & S5.2.3: ignore leading .

  // convert to IDN if any non-ASCII characters
  if (punycode$1 && /[^\u0001-\u007f]/.test(str)) {
    str = punycode$1.toASCII(str);
  }

  return str.toLowerCase();
}

// S5.1.3 Domain Matching
function domainMatch(str, domStr, canonicalize) {
  if (str == null || domStr == null) {
    return null;
  }
  if (canonicalize !== false) {
    str = canonicalDomain(str);
    domStr = canonicalDomain(domStr);
  }

  /*
   * "The domain string and the string are identical. (Note that both the
   * domain string and the string will have been canonicalized to lower case at
   * this point)"
   */
  if (str == domStr) {
    return true;
  }

  /* "All of the following [three] conditions hold:" (order adjusted from the RFC) */

  /* "* The string is a host name (i.e., not an IP address)." */
  if (ipRegex$1.test(str)) {
    return false;
  }

  /* "* The domain string is a suffix of the string" */
  var idx = str.indexOf(domStr);
  if (idx <= 0) {
    return false; // it's a non-match (-1) or prefix (0)
  }

  // e.g "a.b.c".indexOf("b.c") === 2
  // 5 === 3+2
  if (str.length !== domStr.length + idx) { // it's not a suffix
    return false;
  }

  /* "* The last character of the string that is not included in the domain
  * string is a %x2E (".") character." */
  if (str.substr(idx-1,1) !== '.') {
    return false;
  }

  return true;
}


// RFC6265 S5.1.4 Paths and Path-Match

/*
 * "The user agent MUST use an algorithm equivalent to the following algorithm
 * to compute the default-path of a cookie:"
 *
 * Assumption: the path (and not query part or absolute uri) is passed in.
 */
function defaultPath(path) {
  // "2. If the uri-path is empty or if the first character of the uri-path is not
  // a %x2F ("/") character, output %x2F ("/") and skip the remaining steps.
  if (!path || path.substr(0,1) !== "/") {
    return "/";
  }

  // "3. If the uri-path contains no more than one %x2F ("/") character, output
  // %x2F ("/") and skip the remaining step."
  if (path === "/") {
    return path;
  }

  var rightSlash = path.lastIndexOf("/");
  if (rightSlash === 0) {
    return "/";
  }

  // "4. Output the characters of the uri-path from the first character up to,
  // but not including, the right-most %x2F ("/")."
  return path.slice(0, rightSlash);
}

function trimTerminator(str) {
  for (var t = 0; t < TERMINATORS.length; t++) {
    var terminatorIdx = str.indexOf(TERMINATORS[t]);
    if (terminatorIdx !== -1) {
      str = str.substr(0,terminatorIdx);
    }
  }

  return str;
}

function parseCookiePair(cookiePair, looseMode) {
  cookiePair = trimTerminator(cookiePair);

  var firstEq = cookiePair.indexOf('=');
  if (looseMode) {
    if (firstEq === 0) { // '=' is immediately at start
      cookiePair = cookiePair.substr(1);
      firstEq = cookiePair.indexOf('='); // might still need to split on '='
    }
  } else { // non-loose mode
    if (firstEq <= 0) { // no '=' or is at start
      return; // needs to have non-empty "cookie-name"
    }
  }

  var cookieName, cookieValue;
  if (firstEq <= 0) {
    cookieName = "";
    cookieValue = cookiePair.trim();
  } else {
    cookieName = cookiePair.substr(0, firstEq).trim();
    cookieValue = cookiePair.substr(firstEq+1).trim();
  }

  if (CONTROL_CHARS.test(cookieName) || CONTROL_CHARS.test(cookieValue)) {
    return;
  }

  var c = new Cookie();
  c.key = cookieName;
  c.value = cookieValue;
  return c;
}

function parse$2(str, options) {
  if (!options || typeof options !== 'object') {
    options = {};
  }
  str = str.trim();

  // We use a regex to parse the "name-value-pair" part of S5.2
  var firstSemi = str.indexOf(';'); // S5.2 step 1
  var cookiePair = (firstSemi === -1) ? str : str.substr(0, firstSemi);
  var c = parseCookiePair(cookiePair, !!options.loose);
  if (!c) {
    return;
  }

  if (firstSemi === -1) {
    return c;
  }

  // S5.2.3 "unparsed-attributes consist of the remainder of the set-cookie-string
  // (including the %x3B (";") in question)." plus later on in the same section
  // "discard the first ";" and trim".
  var unparsed = str.slice(firstSemi + 1).trim();

  // "If the unparsed-attributes string is empty, skip the rest of these
  // steps."
  if (unparsed.length === 0) {
    return c;
  }

  /*
   * S5.2 says that when looping over the items "[p]rocess the attribute-name
   * and attribute-value according to the requirements in the following
   * subsections" for every item.  Plus, for many of the individual attributes
   * in S5.3 it says to use the "attribute-value of the last attribute in the
   * cookie-attribute-list".  Therefore, in this implementation, we overwrite
   * the previous value.
   */
  var cookie_avs = unparsed.split(';');
  while (cookie_avs.length) {
    var av = cookie_avs.shift().trim();
    if (av.length === 0) { // happens if ";;" appears
      continue;
    }
    var av_sep = av.indexOf('=');
    var av_key, av_value;

    if (av_sep === -1) {
      av_key = av;
      av_value = null;
    } else {
      av_key = av.substr(0,av_sep);
      av_value = av.substr(av_sep+1);
    }

    av_key = av_key.trim().toLowerCase();

    if (av_value) {
      av_value = av_value.trim();
    }

    switch(av_key) {
    case 'expires': // S5.2.1
      if (av_value) {
        var exp = parseDate(av_value);
        // "If the attribute-value failed to parse as a cookie date, ignore the
        // cookie-av."
        if (exp) {
          // over and underflow not realistically a concern: V8's getTime() seems to
          // store something larger than a 32-bit time_t (even with 32-bit node)
          c.expires = exp;
        }
      }
      break;

    case 'max-age': // S5.2.2
      if (av_value) {
        // "If the first character of the attribute-value is not a DIGIT or a "-"
        // character ...[or]... If the remainder of attribute-value contains a
        // non-DIGIT character, ignore the cookie-av."
        if (/^-?[0-9]+$/.test(av_value)) {
          var delta = parseInt(av_value, 10);
          // "If delta-seconds is less than or equal to zero (0), let expiry-time
          // be the earliest representable date and time."
          c.setMaxAge(delta);
        }
      }
      break;

    case 'domain': // S5.2.3
      // "If the attribute-value is empty, the behavior is undefined.  However,
      // the user agent SHOULD ignore the cookie-av entirely."
      if (av_value) {
        // S5.2.3 "Let cookie-domain be the attribute-value without the leading %x2E
        // (".") character."
        var domain = av_value.trim().replace(/^\./, '');
        if (domain) {
          // "Convert the cookie-domain to lower case."
          c.domain = domain.toLowerCase();
        }
      }
      break;

    case 'path': // S5.2.4
      /*
       * "If the attribute-value is empty or if the first character of the
       * attribute-value is not %x2F ("/"):
       *   Let cookie-path be the default-path.
       * Otherwise:
       *   Let cookie-path be the attribute-value."
       *
       * We'll represent the default-path as null since it depends on the
       * context of the parsing.
       */
      c.path = av_value && av_value[0] === "/" ? av_value : null;
      break;

    case 'secure': // S5.2.5
      /*
       * "If the attribute-name case-insensitively matches the string "Secure",
       * the user agent MUST append an attribute to the cookie-attribute-list
       * with an attribute-name of Secure and an empty attribute-value."
       */
      c.secure = true;
      break;

    case 'httponly': // S5.2.6 -- effectively the same as 'secure'
      c.httpOnly = true;
      break;

    default:
      c.extensions = c.extensions || [];
      c.extensions.push(av);
      break;
    }
  }

  return c;
}

// avoid the V8 deoptimization monster!
function jsonParse(str) {
  var obj;
  try {
    obj = JSON.parse(str);
  } catch (e) {
    return e;
  }
  return obj;
}

function fromJSON(str) {
  if (!str) {
    return null;
  }

  var obj;
  if (typeof str === 'string') {
    obj = jsonParse(str);
    if (obj instanceof Error) {
      return null;
    }
  } else {
    // assume it's an Object
    obj = str;
  }

  var c = new Cookie();
  for (var i=0; i<Cookie.serializableProperties.length; i++) {
    var prop = Cookie.serializableProperties[i];
    if (obj[prop] === undefined ||
        obj[prop] === Cookie.prototype[prop])
    {
      continue; // leave as prototype default
    }

    if (prop === 'expires' ||
        prop === 'creation' ||
        prop === 'lastAccessed')
    {
      if (obj[prop] === null) {
        c[prop] = null;
      } else {
        c[prop] = obj[prop] == "Infinity" ?
          "Infinity" : new Date(obj[prop]);
      }
    } else {
      c[prop] = obj[prop];
    }
  }

  return c;
}

/* Section 5.4 part 2:
 * "*  Cookies with longer paths are listed before cookies with
 *     shorter paths.
 *
 *  *  Among cookies that have equal-length path fields, cookies with
 *     earlier creation-times are listed before cookies with later
 *     creation-times."
 */

function cookieCompare(a,b) {
  var cmp = 0;

  // descending for length: b CMP a
  var aPathLen = a.path ? a.path.length : 0;
  var bPathLen = b.path ? b.path.length : 0;
  cmp = bPathLen - aPathLen;
  if (cmp !== 0) {
    return cmp;
  }

  // ascending for time: a CMP b
  var aTime = a.creation ? a.creation.getTime() : MAX_TIME;
  var bTime = b.creation ? b.creation.getTime() : MAX_TIME;
  cmp = aTime - bTime;
  if (cmp !== 0) {
    return cmp;
  }

  // break ties for the same millisecond (precision of JavaScript's clock)
  cmp = a.creationIndex - b.creationIndex;

  return cmp;
}

// Gives the permutation of all possible pathMatch()es of a given path. The
// array is in longest-to-shortest order.  Handy for indexing.
function permutePath(path) {
  if (path === '/') {
    return ['/'];
  }
  if (path.lastIndexOf('/') === path.length-1) {
    path = path.substr(0,path.length-1);
  }
  var permutations = [path];
  while (path.length > 1) {
    var lindex = path.lastIndexOf('/');
    if (lindex === 0) {
      break;
    }
    path = path.substr(0,lindex);
    permutations.push(path);
  }
  permutations.push('/');
  return permutations;
}

function getCookieContext(url) {
  if (url instanceof Object) {
    return url;
  }
  // NOTE: decodeURI will throw on malformed URIs (see GH-32).
  // Therefore, we will just skip decoding for such URIs.
  try {
    url = decodeURI(url);
  }
  catch(err) {
    // Silently swallow error
  }

  return urlParse(url);
}

function Cookie(options) {
  options = options || {};

  Object.keys(options).forEach(function(prop) {
    if (Cookie.prototype.hasOwnProperty(prop) &&
        Cookie.prototype[prop] !== options[prop] &&
        prop.substr(0,1) !== '_')
    {
      this[prop] = options[prop];
    }
  }, this);

  this.creation = this.creation || new Date();

  // used to break creation ties in cookieCompare():
  Object.defineProperty(this, 'creationIndex', {
    configurable: false,
    enumerable: false, // important for assert.deepEqual checks
    writable: true,
    value: ++Cookie.cookiesCreated
  });
}

Cookie.cookiesCreated = 0; // incremented each time a cookie is created

Cookie.parse = parse$2;
Cookie.fromJSON = fromJSON;

Cookie.prototype.key = "";
Cookie.prototype.value = "";

// the order in which the RFC has them:
Cookie.prototype.expires = "Infinity"; // coerces to literal Infinity
Cookie.prototype.maxAge = null; // takes precedence over expires for TTL
Cookie.prototype.domain = null;
Cookie.prototype.path = null;
Cookie.prototype.secure = false;
Cookie.prototype.httpOnly = false;
Cookie.prototype.extensions = null;

// set by the CookieJar:
Cookie.prototype.hostOnly = null; // boolean when set
Cookie.prototype.pathIsDefault = null; // boolean when set
Cookie.prototype.creation = null; // Date when set; defaulted by Cookie.parse
Cookie.prototype.lastAccessed = null; // Date when set
Object.defineProperty(Cookie.prototype, 'creationIndex', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: 0
});

Cookie.serializableProperties = Object.keys(Cookie.prototype)
  .filter(function(prop) {
    return !(
      Cookie.prototype[prop] instanceof Function ||
      prop === 'creationIndex' ||
      prop.substr(0,1) === '_'
    );
  });

Cookie.prototype.inspect = function inspect() {
  var now = Date.now();
  return 'Cookie="'+this.toString() +
    '; hostOnly='+(this.hostOnly != null ? this.hostOnly : '?') +
    '; aAge='+(this.lastAccessed ? (now-this.lastAccessed.getTime())+'ms' : '?') +
    '; cAge='+(this.creation ? (now-this.creation.getTime())+'ms' : '?') +
    '"';
};

// Use the new custom inspection symbol to add the custom inspect function if
// available.
if (util.inspect.custom) {
  Cookie.prototype[util.inspect.custom] = Cookie.prototype.inspect;
}

Cookie.prototype.toJSON = function() {
  var obj = {};

  var props = Cookie.serializableProperties;
  for (var i=0; i<props.length; i++) {
    var prop = props[i];
    if (this[prop] === Cookie.prototype[prop]) {
      continue; // leave as prototype default
    }

    if (prop === 'expires' ||
        prop === 'creation' ||
        prop === 'lastAccessed')
    {
      if (this[prop] === null) {
        obj[prop] = null;
      } else {
        obj[prop] = this[prop] == "Infinity" ? // intentionally not ===
          "Infinity" : this[prop].toISOString();
      }
    } else if (prop === 'maxAge') {
      if (this[prop] !== null) {
        // again, intentionally not ===
        obj[prop] = (this[prop] == Infinity || this[prop] == -Infinity) ?
          this[prop].toString() : this[prop];
      }
    } else {
      if (this[prop] !== Cookie.prototype[prop]) {
        obj[prop] = this[prop];
      }
    }
  }

  return obj;
};

Cookie.prototype.clone = function() {
  return fromJSON(this.toJSON());
};

Cookie.prototype.validate = function validate() {
  if (!COOKIE_OCTETS.test(this.value)) {
    return false;
  }
  if (this.expires != Infinity && !(this.expires instanceof Date) && !parseDate(this.expires)) {
    return false;
  }
  if (this.maxAge != null && this.maxAge <= 0) {
    return false; // "Max-Age=" non-zero-digit *DIGIT
  }
  if (this.path != null && !PATH_VALUE.test(this.path)) {
    return false;
  }

  var cdomain = this.cdomain();
  if (cdomain) {
    if (cdomain.match(/\.$/)) {
      return false; // S4.1.2.3 suggests that this is bad. domainMatch() tests confirm this
    }
    var suffix = pubsuffixPsl.getPublicSuffix(cdomain);
    if (suffix == null) { // it's a public suffix
      return false;
    }
  }
  return true;
};

Cookie.prototype.setExpires = function setExpires(exp) {
  if (exp instanceof Date) {
    this.expires = exp;
  } else {
    this.expires = parseDate(exp) || "Infinity";
  }
};

Cookie.prototype.setMaxAge = function setMaxAge(age) {
  if (age === Infinity || age === -Infinity) {
    this.maxAge = age.toString(); // so JSON.stringify() works
  } else {
    this.maxAge = age;
  }
};

// gives Cookie header format
Cookie.prototype.cookieString = function cookieString() {
  var val = this.value;
  if (val == null) {
    val = '';
  }
  if (this.key === '') {
    return val;
  }
  return this.key+'='+val;
};

// gives Set-Cookie header format
Cookie.prototype.toString = function toString() {
  var str = this.cookieString();

  if (this.expires != Infinity) {
    if (this.expires instanceof Date) {
      str += '; Expires='+formatDate(this.expires);
    } else {
      str += '; Expires='+this.expires;
    }
  }

  if (this.maxAge != null && this.maxAge != Infinity) {
    str += '; Max-Age='+this.maxAge;
  }

  if (this.domain && !this.hostOnly) {
    str += '; Domain='+this.domain;
  }
  if (this.path) {
    str += '; Path='+this.path;
  }

  if (this.secure) {
    str += '; Secure';
  }
  if (this.httpOnly) {
    str += '; HttpOnly';
  }
  if (this.extensions) {
    this.extensions.forEach(function(ext) {
      str += '; '+ext;
    });
  }

  return str;
};

// TTL() partially replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
// elsewhere)
// S5.3 says to give the "latest representable date" for which we use Infinity
// For "expired" we use 0
Cookie.prototype.TTL = function TTL(now) {
  /* RFC6265 S4.1.2.2 If a cookie has both the Max-Age and the Expires
   * attribute, the Max-Age attribute has precedence and controls the
   * expiration date of the cookie.
   * (Concurs with S5.3 step 3)
   */
  if (this.maxAge != null) {
    return this.maxAge<=0 ? 0 : this.maxAge*1000;
  }

  var expires = this.expires;
  if (expires != Infinity) {
    if (!(expires instanceof Date)) {
      expires = parseDate(expires) || Infinity;
    }

    if (expires == Infinity) {
      return Infinity;
    }

    return expires.getTime() - (now || Date.now());
  }

  return Infinity;
};

// expiryTime() replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
// elsewhere)
Cookie.prototype.expiryTime = function expiryTime(now) {
  if (this.maxAge != null) {
    var relativeTo = now || this.creation || new Date();
    var age = (this.maxAge <= 0) ? -Infinity : this.maxAge*1000;
    return relativeTo.getTime() + age;
  }

  if (this.expires == Infinity) {
    return Infinity;
  }
  return this.expires.getTime();
};

// expiryDate() replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
// elsewhere), except it returns a Date
Cookie.prototype.expiryDate = function expiryDate(now) {
  var millisec = this.expiryTime(now);
  if (millisec == Infinity) {
    return new Date(MAX_TIME);
  } else if (millisec == -Infinity) {
    return new Date(MIN_TIME);
  } else {
    return new Date(millisec);
  }
};

// This replaces the "persistent-flag" parts of S5.3 step 3
Cookie.prototype.isPersistent = function isPersistent() {
  return (this.maxAge != null || this.expires != Infinity);
};

// Mostly S5.1.2 and S5.2.3:
Cookie.prototype.cdomain =
Cookie.prototype.canonicalizedDomain = function canonicalizedDomain() {
  if (this.domain == null) {
    return null;
  }
  return canonicalDomain(this.domain);
};

function CookieJar(store, options) {
  if (typeof options === "boolean") {
    options = {rejectPublicSuffixes: options};
  } else if (options == null) {
    options = {};
  }
  if (options.rejectPublicSuffixes != null) {
    this.rejectPublicSuffixes = options.rejectPublicSuffixes;
  }
  if (options.looseMode != null) {
    this.enableLooseMode = options.looseMode;
  }

  if (!store) {
    store = new MemoryCookieStore$1();
  }
  this.store = store;
}
CookieJar.prototype.store = null;
CookieJar.prototype.rejectPublicSuffixes = true;
CookieJar.prototype.enableLooseMode = false;
var CAN_BE_SYNC = [];

CAN_BE_SYNC.push('setCookie');
CookieJar.prototype.setCookie = function(cookie, url, options, cb) {
  var err;
  var context = getCookieContext(url);
  if (options instanceof Function) {
    cb = options;
    options = {};
  }

  var host = canonicalDomain(context.hostname);
  var loose = this.enableLooseMode;
  if (options.loose != null) {
    loose = options.loose;
  }

  // S5.3 step 1
  if (typeof(cookie) === 'string' || cookie instanceof String) {
    cookie = Cookie.parse(cookie, { loose: loose });
    if (!cookie) {
      err = new Error("Cookie failed to parse");
      return cb(options.ignoreError ? null : err);
    }
  }
  else if (!(cookie instanceof Cookie)) {
    // If you're seeing this error, and are passing in a Cookie object, 
    // it *might* be a Cookie object from another loaded version of tough-cookie.
    err = new Error("First argument to setCookie must be a Cookie object or string");
    return cb(options.ignoreError ? null : err);
  }

  // S5.3 step 2
  var now = options.now || new Date(); // will assign later to save effort in the face of errors

  // S5.3 step 3: NOOP; persistent-flag and expiry-time is handled by getCookie()

  // S5.3 step 4: NOOP; domain is null by default

  // S5.3 step 5: public suffixes
  if (this.rejectPublicSuffixes && cookie.domain) {
    var suffix = pubsuffixPsl.getPublicSuffix(cookie.cdomain());
    if (suffix == null) { // e.g. "com"
      err = new Error("Cookie has domain set to a public suffix");
      return cb(options.ignoreError ? null : err);
    }
  }

  // S5.3 step 6:
  if (cookie.domain) {
    if (!domainMatch(host, cookie.cdomain(), false)) {
      err = new Error("Cookie not in this host's domain. Cookie:"+cookie.cdomain()+" Request:"+host);
      return cb(options.ignoreError ? null : err);
    }

    if (cookie.hostOnly == null) { // don't reset if already set
      cookie.hostOnly = false;
    }

  } else {
    cookie.hostOnly = true;
    cookie.domain = host;
  }

  //S5.2.4 If the attribute-value is empty or if the first character of the
  //attribute-value is not %x2F ("/"):
  //Let cookie-path be the default-path.
  if (!cookie.path || cookie.path[0] !== '/') {
    cookie.path = defaultPath(context.pathname);
    cookie.pathIsDefault = true;
  }

  // S5.3 step 8: NOOP; secure attribute
  // S5.3 step 9: NOOP; httpOnly attribute

  // S5.3 step 10
  if (options.http === false && cookie.httpOnly) {
    err = new Error("Cookie is HttpOnly and this isn't an HTTP API");
    return cb(options.ignoreError ? null : err);
  }

  var store = this.store;

  if (!store.updateCookie) {
    store.updateCookie = function(oldCookie, newCookie, cb) {
      this.putCookie(newCookie, cb);
    };
  }

  function withCookie(err, oldCookie) {
    if (err) {
      return cb(err);
    }

    var next = function(err) {
      if (err) {
        return cb(err);
      } else {
        cb(null, cookie);
      }
    };

    if (oldCookie) {
      // S5.3 step 11 - "If the cookie store contains a cookie with the same name,
      // domain, and path as the newly created cookie:"
      if (options.http === false && oldCookie.httpOnly) { // step 11.2
        err = new Error("old Cookie is HttpOnly and this isn't an HTTP API");
        return cb(options.ignoreError ? null : err);
      }
      cookie.creation = oldCookie.creation; // step 11.3
      cookie.creationIndex = oldCookie.creationIndex; // preserve tie-breaker
      cookie.lastAccessed = now;
      // Step 11.4 (delete cookie) is implied by just setting the new one:
      store.updateCookie(oldCookie, cookie, next); // step 12

    } else {
      cookie.creation = cookie.lastAccessed = now;
      store.putCookie(cookie, next); // step 12
    }
  }

  store.findCookie(cookie.domain, cookie.path, cookie.key, withCookie);
};

// RFC6365 S5.4
CAN_BE_SYNC.push('getCookies');
CookieJar.prototype.getCookies = function(url, options, cb) {
  var context = getCookieContext(url);
  if (options instanceof Function) {
    cb = options;
    options = {};
  }

  var host = canonicalDomain(context.hostname);
  var path = context.pathname || '/';

  var secure = options.secure;
  if (secure == null && context.protocol &&
      (context.protocol == 'https:' || context.protocol == 'wss:'))
  {
    secure = true;
  }

  var http = options.http;
  if (http == null) {
    http = true;
  }

  var now = options.now || Date.now();
  var expireCheck = options.expire !== false;
  var allPaths = !!options.allPaths;
  var store = this.store;

  function matchingCookie(c) {
    // "Either:
    //   The cookie's host-only-flag is true and the canonicalized
    //   request-host is identical to the cookie's domain.
    // Or:
    //   The cookie's host-only-flag is false and the canonicalized
    //   request-host domain-matches the cookie's domain."
    if (c.hostOnly) {
      if (c.domain != host) {
        return false;
      }
    } else {
      if (!domainMatch(host, c.domain, false)) {
        return false;
      }
    }

    // "The request-uri's path path-matches the cookie's path."
    if (!allPaths && !pathMatch$2(path, c.path)) {
      return false;
    }

    // "If the cookie's secure-only-flag is true, then the request-uri's
    // scheme must denote a "secure" protocol"
    if (c.secure && !secure) {
      return false;
    }

    // "If the cookie's http-only-flag is true, then exclude the cookie if the
    // cookie-string is being generated for a "non-HTTP" API"
    if (c.httpOnly && !http) {
      return false;
    }

    // deferred from S5.3
    // non-RFC: allow retention of expired cookies by choice
    if (expireCheck && c.expiryTime() <= now) {
      store.removeCookie(c.domain, c.path, c.key, function(){}); // result ignored
      return false;
    }

    return true;
  }

  store.findCookies(host, allPaths ? null : path, function(err,cookies) {
    if (err) {
      return cb(err);
    }

    cookies = cookies.filter(matchingCookie);

    // sorting of S5.4 part 2
    if (options.sort !== false) {
      cookies = cookies.sort(cookieCompare);
    }

    // S5.4 part 3
    var now = new Date();
    cookies.forEach(function(c) {
      c.lastAccessed = now;
    });
    // TODO persist lastAccessed

    cb(null,cookies);
  });
};

CAN_BE_SYNC.push('getCookieString');
CookieJar.prototype.getCookieString = function(/*..., cb*/) {
  var args = Array.prototype.slice.call(arguments,0);
  var cb = args.pop();
  var next = function(err,cookies) {
    if (err) {
      cb(err);
    } else {
      cb(null, cookies
        .sort(cookieCompare)
        .map(function(c){
          return c.cookieString();
        })
        .join('; '));
    }
  };
  args.push(next);
  this.getCookies.apply(this,args);
};

CAN_BE_SYNC.push('getSetCookieStrings');
CookieJar.prototype.getSetCookieStrings = function(/*..., cb*/) {
  var args = Array.prototype.slice.call(arguments,0);
  var cb = args.pop();
  var next = function(err,cookies) {
    if (err) {
      cb(err);
    } else {
      cb(null, cookies.map(function(c){
        return c.toString();
      }));
    }
  };
  args.push(next);
  this.getCookies.apply(this,args);
};

CAN_BE_SYNC.push('serialize');
CookieJar.prototype.serialize = function(cb) {
  var type = this.store.constructor.name;
  if (type === 'Object') {
    type = null;
  }

  // update README.md "Serialization Format" if you change this, please!
  var serialized = {
    // The version of tough-cookie that serialized this jar. Generally a good
    // practice since future versions can make data import decisions based on
    // known past behavior. When/if this matters, use `semver`.
    version: 'tough-cookie@'+version,

    // add the store type, to make humans happy:
    storeType: type,

    // CookieJar configuration:
    rejectPublicSuffixes: !!this.rejectPublicSuffixes,

    // this gets filled from getAllCookies:
    cookies: []
  };

  if (!(this.store.getAllCookies &&
        typeof this.store.getAllCookies === 'function'))
  {
    return cb(new Error('store does not support getAllCookies and cannot be serialized'));
  }

  this.store.getAllCookies(function(err,cookies) {
    if (err) {
      return cb(err);
    }

    serialized.cookies = cookies.map(function(cookie) {
      // convert to serialized 'raw' cookies
      cookie = (cookie instanceof Cookie) ? cookie.toJSON() : cookie;

      // Remove the index so new ones get assigned during deserialization
      delete cookie.creationIndex;

      return cookie;
    });

    return cb(null, serialized);
  });
};

// well-known name that JSON.stringify calls
CookieJar.prototype.toJSON = function() {
  return this.serializeSync();
};

// use the class method CookieJar.deserialize instead of calling this directly
CAN_BE_SYNC.push('_importCookies');
CookieJar.prototype._importCookies = function(serialized, cb) {
  var jar = this;
  var cookies = serialized.cookies;
  if (!cookies || !Array.isArray(cookies)) {
    return cb(new Error('serialized jar has no cookies array'));
  }
  cookies = cookies.slice(); // do not modify the original

  function putNext(err) {
    if (err) {
      return cb(err);
    }

    if (!cookies.length) {
      return cb(err, jar);
    }

    var cookie;
    try {
      cookie = fromJSON(cookies.shift());
    } catch (e) {
      return cb(e);
    }

    if (cookie === null) {
      return putNext(null); // skip this cookie
    }

    jar.store.putCookie(cookie, putNext);
  }

  putNext();
};

CookieJar.deserialize = function(strOrObj, store, cb) {
  if (arguments.length !== 3) {
    // store is optional
    cb = store;
    store = null;
  }

  var serialized;
  if (typeof strOrObj === 'string') {
    serialized = jsonParse(strOrObj);
    if (serialized instanceof Error) {
      return cb(serialized);
    }
  } else {
    serialized = strOrObj;
  }

  var jar = new CookieJar(store, serialized.rejectPublicSuffixes);
  jar._importCookies(serialized, function(err) {
    if (err) {
      return cb(err);
    }
    cb(null, jar);
  });
};

CookieJar.deserializeSync = function(strOrObj, store) {
  var serialized = typeof strOrObj === 'string' ?
    JSON.parse(strOrObj) : strOrObj;
  var jar = new CookieJar(store, serialized.rejectPublicSuffixes);

  // catch this mistake early:
  if (!jar.store.synchronous) {
    throw new Error('CookieJar store is not synchronous; use async API instead.');
  }

  jar._importCookiesSync(serialized);
  return jar;
};
CookieJar.fromJSON = CookieJar.deserializeSync;

CookieJar.prototype.clone = function(newStore, cb) {
  if (arguments.length === 1) {
    cb = newStore;
    newStore = null;
  }

  this.serialize(function(err,serialized) {
    if (err) {
      return cb(err);
    }
    CookieJar.deserialize(serialized, newStore, cb);
  });
};

CAN_BE_SYNC.push('removeAllCookies');
CookieJar.prototype.removeAllCookies = function(cb) {
  var store = this.store;

  // Check that the store implements its own removeAllCookies(). The default
  // implementation in Store will immediately call the callback with a "not
  // implemented" Error.
  if (store.removeAllCookies instanceof Function &&
      store.removeAllCookies !== Store$2.prototype.removeAllCookies)
  {
    return store.removeAllCookies(cb);
  }

  store.getAllCookies(function(err, cookies) {
    if (err) {
      return cb(err);
    }

    if (cookies.length === 0) {
      return cb(null);
    }

    var completedCount = 0;
    var removeErrors = [];

    function removeCookieCb(removeErr) {
      if (removeErr) {
        removeErrors.push(removeErr);
      }

      completedCount++;

      if (completedCount === cookies.length) {
        return cb(removeErrors.length ? removeErrors[0] : null);
      }
    }

    cookies.forEach(function(cookie) {
      store.removeCookie(cookie.domain, cookie.path, cookie.key, removeCookieCb);
    });
  });
};

CookieJar.prototype._cloneSync = syncWrap('clone');
CookieJar.prototype.cloneSync = function(newStore) {
  if (!newStore.synchronous) {
    throw new Error('CookieJar clone destination store is not synchronous; use async API instead.');
  }
  return this._cloneSync(newStore);
};

// Use a closure to provide a true imperative API for synchronous stores.
function syncWrap(method) {
  return function() {
    if (!this.store.synchronous) {
      throw new Error('CookieJar store is not synchronous; use async API instead.');
    }

    var args = Array.prototype.slice.call(arguments);
    var syncErr, syncResult;
    args.push(function syncCb(err, result) {
      syncErr = err;
      syncResult = result;
    });
    this[method].apply(this, args);

    if (syncErr) {
      throw syncErr;
    }
    return syncResult;
  };
}

// wrap all declared CAN_BE_SYNC methods in the sync wrapper
CAN_BE_SYNC.forEach(function(method) {
  CookieJar.prototype[method+'Sync'] = syncWrap(method);
});

var version$1 = version;
var CookieJar_1 = CookieJar;
var Cookie_1 = Cookie;
var Store_1$1 = Store$2;
var MemoryCookieStore_1$1 = MemoryCookieStore$1;
var parseDate_1 = parseDate;
var formatDate_1 = formatDate;
var parse_1 = parse$2;
var fromJSON_1 = fromJSON;
var domainMatch_1 = domainMatch;
var defaultPath_1 = defaultPath;
var pathMatch_1$1 = pathMatch$2;
var getPublicSuffix$1 = pubsuffixPsl.getPublicSuffix;
var cookieCompare_1 = cookieCompare;
var permuteDomain$2 = permuteDomain_1.permuteDomain;
var permutePath_1 = permutePath;
var canonicalDomain_1 = canonicalDomain;

var cookie = {
	version: version$1,
	CookieJar: CookieJar_1,
	Cookie: Cookie_1,
	Store: Store_1$1,
	MemoryCookieStore: MemoryCookieStore_1$1,
	parseDate: parseDate_1,
	formatDate: formatDate_1,
	parse: parse_1,
	fromJSON: fromJSON_1,
	domainMatch: domainMatch_1,
	defaultPath: defaultPath_1,
	pathMatch: pathMatch_1$1,
	getPublicSuffix: getPublicSuffix$1,
	cookieCompare: cookieCompare_1,
	permuteDomain: permuteDomain$2,
	permutePath: permutePath_1,
	canonicalDomain: canonicalDomain_1
};

function storeCookies (cookies, url, header) {
  if (header) {
    var headers =
      header instanceof Array
        ? header
        : [header];

    headers.forEach(function (setCookieHeader) {
      cookies.setCookieSync(setCookieHeader, url);
    });
  }
}

var cookies = middleware('cookies', function (request, next, client) {
  var cookies;

  if (client._options.cookies === true) {
    var toughCookie = cookie;
    cookies = request.options.cookies = client._options.cookies = new toughCookie.CookieJar();
  } else {
    cookies = request.options.cookies;
  }

  if (cookies) {
    request.headers.cookie = cookies.getCookieStringSync(request.url);
    return next().then(function (response) {
      storeCookies(cookies, response.url, response.headers['set-cookie']);
      return response
    })
  } else {
    return next()
  }
});

var db = {
	"application/1d-interleaved-parityfec": {
	source: "iana"
},
	"application/3gpdash-qoe-report+xml": {
	source: "iana",
	compressible: true
},
	"application/3gpp-ims+xml": {
	source: "iana",
	compressible: true
},
	"application/a2l": {
	source: "iana"
},
	"application/activemessage": {
	source: "iana"
},
	"application/activity+json": {
	source: "iana",
	compressible: true
},
	"application/alto-costmap+json": {
	source: "iana",
	compressible: true
},
	"application/alto-costmapfilter+json": {
	source: "iana",
	compressible: true
},
	"application/alto-directory+json": {
	source: "iana",
	compressible: true
},
	"application/alto-endpointcost+json": {
	source: "iana",
	compressible: true
},
	"application/alto-endpointcostparams+json": {
	source: "iana",
	compressible: true
},
	"application/alto-endpointprop+json": {
	source: "iana",
	compressible: true
},
	"application/alto-endpointpropparams+json": {
	source: "iana",
	compressible: true
},
	"application/alto-error+json": {
	source: "iana",
	compressible: true
},
	"application/alto-networkmap+json": {
	source: "iana",
	compressible: true
},
	"application/alto-networkmapfilter+json": {
	source: "iana",
	compressible: true
},
	"application/aml": {
	source: "iana"
},
	"application/andrew-inset": {
	source: "iana",
	extensions: [
		"ez"
	]
},
	"application/applefile": {
	source: "iana"
},
	"application/applixware": {
	source: "apache",
	extensions: [
		"aw"
	]
},
	"application/atf": {
	source: "iana"
},
	"application/atfx": {
	source: "iana"
},
	"application/atom+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"atom"
	]
},
	"application/atomcat+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"atomcat"
	]
},
	"application/atomdeleted+xml": {
	source: "iana",
	compressible: true
},
	"application/atomicmail": {
	source: "iana"
},
	"application/atomsvc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"atomsvc"
	]
},
	"application/atsc-dwd+xml": {
	source: "iana",
	compressible: true
},
	"application/atsc-held+xml": {
	source: "iana",
	compressible: true
},
	"application/atsc-rsat+xml": {
	source: "iana",
	compressible: true
},
	"application/atxml": {
	source: "iana"
},
	"application/auth-policy+xml": {
	source: "iana",
	compressible: true
},
	"application/bacnet-xdd+zip": {
	source: "iana",
	compressible: false
},
	"application/batch-smtp": {
	source: "iana"
},
	"application/bdoc": {
	compressible: false,
	extensions: [
		"bdoc"
	]
},
	"application/beep+xml": {
	source: "iana",
	compressible: true
},
	"application/calendar+json": {
	source: "iana",
	compressible: true
},
	"application/calendar+xml": {
	source: "iana",
	compressible: true
},
	"application/call-completion": {
	source: "iana"
},
	"application/cals-1840": {
	source: "iana"
},
	"application/cbor": {
	source: "iana"
},
	"application/cccex": {
	source: "iana"
},
	"application/ccmp+xml": {
	source: "iana",
	compressible: true
},
	"application/ccxml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ccxml"
	]
},
	"application/cdfx+xml": {
	source: "iana",
	compressible: true
},
	"application/cdmi-capability": {
	source: "iana",
	extensions: [
		"cdmia"
	]
},
	"application/cdmi-container": {
	source: "iana",
	extensions: [
		"cdmic"
	]
},
	"application/cdmi-domain": {
	source: "iana",
	extensions: [
		"cdmid"
	]
},
	"application/cdmi-object": {
	source: "iana",
	extensions: [
		"cdmio"
	]
},
	"application/cdmi-queue": {
	source: "iana",
	extensions: [
		"cdmiq"
	]
},
	"application/cdni": {
	source: "iana"
},
	"application/cea": {
	source: "iana"
},
	"application/cea-2018+xml": {
	source: "iana",
	compressible: true
},
	"application/cellml+xml": {
	source: "iana",
	compressible: true
},
	"application/cfw": {
	source: "iana"
},
	"application/clue_info+xml": {
	source: "iana",
	compressible: true
},
	"application/cms": {
	source: "iana"
},
	"application/cnrp+xml": {
	source: "iana",
	compressible: true
},
	"application/coap-group+json": {
	source: "iana",
	compressible: true
},
	"application/coap-payload": {
	source: "iana"
},
	"application/commonground": {
	source: "iana"
},
	"application/conference-info+xml": {
	source: "iana",
	compressible: true
},
	"application/cose": {
	source: "iana"
},
	"application/cose-key": {
	source: "iana"
},
	"application/cose-key-set": {
	source: "iana"
},
	"application/cpl+xml": {
	source: "iana",
	compressible: true
},
	"application/csrattrs": {
	source: "iana"
},
	"application/csta+xml": {
	source: "iana",
	compressible: true
},
	"application/cstadata+xml": {
	source: "iana",
	compressible: true
},
	"application/csvm+json": {
	source: "iana",
	compressible: true
},
	"application/cu-seeme": {
	source: "apache",
	extensions: [
		"cu"
	]
},
	"application/cwt": {
	source: "iana"
},
	"application/cybercash": {
	source: "iana"
},
	"application/dart": {
	compressible: true
},
	"application/dash+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mpd"
	]
},
	"application/dashdelta": {
	source: "iana"
},
	"application/davmount+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"davmount"
	]
},
	"application/dca-rft": {
	source: "iana"
},
	"application/dcd": {
	source: "iana"
},
	"application/dec-dx": {
	source: "iana"
},
	"application/dialog-info+xml": {
	source: "iana",
	compressible: true
},
	"application/dicom": {
	source: "iana"
},
	"application/dicom+json": {
	source: "iana",
	compressible: true
},
	"application/dicom+xml": {
	source: "iana",
	compressible: true
},
	"application/dii": {
	source: "iana"
},
	"application/dit": {
	source: "iana"
},
	"application/dns": {
	source: "iana"
},
	"application/dns+json": {
	source: "iana",
	compressible: true
},
	"application/dns-message": {
	source: "iana"
},
	"application/docbook+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"dbk"
	]
},
	"application/dskpp+xml": {
	source: "iana",
	compressible: true
},
	"application/dssc+der": {
	source: "iana",
	extensions: [
		"dssc"
	]
},
	"application/dssc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xdssc"
	]
},
	"application/dvcs": {
	source: "iana"
},
	"application/ecmascript": {
	source: "iana",
	compressible: true,
	extensions: [
		"ecma",
		"es"
	]
},
	"application/edi-consent": {
	source: "iana"
},
	"application/edi-x12": {
	source: "iana",
	compressible: false
},
	"application/edifact": {
	source: "iana",
	compressible: false
},
	"application/efi": {
	source: "iana"
},
	"application/emergencycalldata.comment+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.control+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.deviceinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.ecall.msd": {
	source: "iana"
},
	"application/emergencycalldata.providerinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.serviceinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.subscriberinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.veds+xml": {
	source: "iana",
	compressible: true
},
	"application/emma+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"emma"
	]
},
	"application/emotionml+xml": {
	source: "iana",
	compressible: true
},
	"application/encaprtp": {
	source: "iana"
},
	"application/epp+xml": {
	source: "iana",
	compressible: true
},
	"application/epub+zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"epub"
	]
},
	"application/eshop": {
	source: "iana"
},
	"application/exi": {
	source: "iana",
	extensions: [
		"exi"
	]
},
	"application/expect-ct-report+json": {
	source: "iana",
	compressible: true
},
	"application/fastinfoset": {
	source: "iana"
},
	"application/fastsoap": {
	source: "iana"
},
	"application/fdt+xml": {
	source: "iana",
	compressible: true
},
	"application/fhir+json": {
	source: "iana",
	compressible: true
},
	"application/fhir+xml": {
	source: "iana",
	compressible: true
},
	"application/fido.trusted-apps+json": {
	compressible: true
},
	"application/fits": {
	source: "iana"
},
	"application/font-sfnt": {
	source: "iana"
},
	"application/font-tdpfr": {
	source: "iana",
	extensions: [
		"pfr"
	]
},
	"application/font-woff": {
	source: "iana",
	compressible: false
},
	"application/framework-attributes+xml": {
	source: "iana",
	compressible: true
},
	"application/geo+json": {
	source: "iana",
	compressible: true,
	extensions: [
		"geojson"
	]
},
	"application/geo+json-seq": {
	source: "iana"
},
	"application/geopackage+sqlite3": {
	source: "iana"
},
	"application/geoxacml+xml": {
	source: "iana",
	compressible: true
},
	"application/gltf-buffer": {
	source: "iana"
},
	"application/gml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"gml"
	]
},
	"application/gpx+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"gpx"
	]
},
	"application/gxf": {
	source: "apache",
	extensions: [
		"gxf"
	]
},
	"application/gzip": {
	source: "iana",
	compressible: false,
	extensions: [
		"gz"
	]
},
	"application/h224": {
	source: "iana"
},
	"application/held+xml": {
	source: "iana",
	compressible: true
},
	"application/hjson": {
	extensions: [
		"hjson"
	]
},
	"application/http": {
	source: "iana"
},
	"application/hyperstudio": {
	source: "iana",
	extensions: [
		"stk"
	]
},
	"application/ibe-key-request+xml": {
	source: "iana",
	compressible: true
},
	"application/ibe-pkg-reply+xml": {
	source: "iana",
	compressible: true
},
	"application/ibe-pp-data": {
	source: "iana"
},
	"application/iges": {
	source: "iana"
},
	"application/im-iscomposing+xml": {
	source: "iana",
	compressible: true
},
	"application/index": {
	source: "iana"
},
	"application/index.cmd": {
	source: "iana"
},
	"application/index.obj": {
	source: "iana"
},
	"application/index.response": {
	source: "iana"
},
	"application/index.vnd": {
	source: "iana"
},
	"application/inkml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ink",
		"inkml"
	]
},
	"application/iotp": {
	source: "iana"
},
	"application/ipfix": {
	source: "iana",
	extensions: [
		"ipfix"
	]
},
	"application/ipp": {
	source: "iana"
},
	"application/isup": {
	source: "iana"
},
	"application/its+xml": {
	source: "iana",
	compressible: true
},
	"application/java-archive": {
	source: "apache",
	compressible: false,
	extensions: [
		"jar",
		"war",
		"ear"
	]
},
	"application/java-serialized-object": {
	source: "apache",
	compressible: false,
	extensions: [
		"ser"
	]
},
	"application/java-vm": {
	source: "apache",
	compressible: false,
	extensions: [
		"class"
	]
},
	"application/javascript": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"js",
		"mjs"
	]
},
	"application/jf2feed+json": {
	source: "iana",
	compressible: true
},
	"application/jose": {
	source: "iana"
},
	"application/jose+json": {
	source: "iana",
	compressible: true
},
	"application/jrd+json": {
	source: "iana",
	compressible: true
},
	"application/json": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"json",
		"map"
	]
},
	"application/json-patch+json": {
	source: "iana",
	compressible: true
},
	"application/json-seq": {
	source: "iana"
},
	"application/json5": {
	extensions: [
		"json5"
	]
},
	"application/jsonml+json": {
	source: "apache",
	compressible: true,
	extensions: [
		"jsonml"
	]
},
	"application/jwk+json": {
	source: "iana",
	compressible: true
},
	"application/jwk-set+json": {
	source: "iana",
	compressible: true
},
	"application/jwt": {
	source: "iana"
},
	"application/kpml-request+xml": {
	source: "iana",
	compressible: true
},
	"application/kpml-response+xml": {
	source: "iana",
	compressible: true
},
	"application/ld+json": {
	source: "iana",
	compressible: true,
	extensions: [
		"jsonld"
	]
},
	"application/lgr+xml": {
	source: "iana",
	compressible: true
},
	"application/link-format": {
	source: "iana"
},
	"application/load-control+xml": {
	source: "iana",
	compressible: true
},
	"application/lost+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"lostxml"
	]
},
	"application/lostsync+xml": {
	source: "iana",
	compressible: true
},
	"application/lxf": {
	source: "iana"
},
	"application/mac-binhex40": {
	source: "iana",
	extensions: [
		"hqx"
	]
},
	"application/mac-compactpro": {
	source: "apache",
	extensions: [
		"cpt"
	]
},
	"application/macwriteii": {
	source: "iana"
},
	"application/mads+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mads"
	]
},
	"application/manifest+json": {
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"webmanifest"
	]
},
	"application/marc": {
	source: "iana",
	extensions: [
		"mrc"
	]
},
	"application/marcxml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mrcx"
	]
},
	"application/mathematica": {
	source: "iana",
	extensions: [
		"ma",
		"nb",
		"mb"
	]
},
	"application/mathml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mathml"
	]
},
	"application/mathml-content+xml": {
	source: "iana",
	compressible: true
},
	"application/mathml-presentation+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-associated-procedure-description+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-deregister+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-envelope+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-msk+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-msk-response+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-protection-description+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-reception-report+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-register+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-register-response+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-schedule+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-user-service-description+xml": {
	source: "iana",
	compressible: true
},
	"application/mbox": {
	source: "iana",
	extensions: [
		"mbox"
	]
},
	"application/media-policy-dataset+xml": {
	source: "iana",
	compressible: true
},
	"application/media_control+xml": {
	source: "iana",
	compressible: true
},
	"application/mediaservercontrol+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mscml"
	]
},
	"application/merge-patch+json": {
	source: "iana",
	compressible: true
},
	"application/metalink+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"metalink"
	]
},
	"application/metalink4+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"meta4"
	]
},
	"application/mets+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mets"
	]
},
	"application/mf4": {
	source: "iana"
},
	"application/mikey": {
	source: "iana"
},
	"application/mmt-aei+xml": {
	source: "iana",
	compressible: true
},
	"application/mmt-usd+xml": {
	source: "iana",
	compressible: true
},
	"application/mods+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mods"
	]
},
	"application/moss-keys": {
	source: "iana"
},
	"application/moss-signature": {
	source: "iana"
},
	"application/mosskey-data": {
	source: "iana"
},
	"application/mosskey-request": {
	source: "iana"
},
	"application/mp21": {
	source: "iana",
	extensions: [
		"m21",
		"mp21"
	]
},
	"application/mp4": {
	source: "iana",
	extensions: [
		"mp4s",
		"m4p"
	]
},
	"application/mpeg4-generic": {
	source: "iana"
},
	"application/mpeg4-iod": {
	source: "iana"
},
	"application/mpeg4-iod-xmt": {
	source: "iana"
},
	"application/mrb-consumer+xml": {
	source: "iana",
	compressible: true
},
	"application/mrb-publish+xml": {
	source: "iana",
	compressible: true
},
	"application/msc-ivr+xml": {
	source: "iana",
	compressible: true
},
	"application/msc-mixer+xml": {
	source: "iana",
	compressible: true
},
	"application/msword": {
	source: "iana",
	compressible: false,
	extensions: [
		"doc",
		"dot"
	]
},
	"application/mud+json": {
	source: "iana",
	compressible: true
},
	"application/mxf": {
	source: "iana",
	extensions: [
		"mxf"
	]
},
	"application/n-quads": {
	source: "iana",
	extensions: [
		"nq"
	]
},
	"application/n-triples": {
	source: "iana",
	extensions: [
		"nt"
	]
},
	"application/nasdata": {
	source: "iana"
},
	"application/news-checkgroups": {
	source: "iana"
},
	"application/news-groupinfo": {
	source: "iana"
},
	"application/news-transmission": {
	source: "iana"
},
	"application/nlsml+xml": {
	source: "iana",
	compressible: true
},
	"application/node": {
	source: "iana"
},
	"application/nss": {
	source: "iana"
},
	"application/ocsp-request": {
	source: "iana"
},
	"application/ocsp-response": {
	source: "iana"
},
	"application/octet-stream": {
	source: "iana",
	compressible: false,
	extensions: [
		"bin",
		"dms",
		"lrf",
		"mar",
		"so",
		"dist",
		"distz",
		"pkg",
		"bpk",
		"dump",
		"elc",
		"deploy",
		"exe",
		"dll",
		"deb",
		"dmg",
		"iso",
		"img",
		"msi",
		"msp",
		"msm",
		"buffer"
	]
},
	"application/oda": {
	source: "iana",
	extensions: [
		"oda"
	]
},
	"application/odm+xml": {
	source: "iana",
	compressible: true
},
	"application/odx": {
	source: "iana"
},
	"application/oebps-package+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"opf"
	]
},
	"application/ogg": {
	source: "iana",
	compressible: false,
	extensions: [
		"ogx"
	]
},
	"application/omdoc+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"omdoc"
	]
},
	"application/onenote": {
	source: "apache",
	extensions: [
		"onetoc",
		"onetoc2",
		"onetmp",
		"onepkg"
	]
},
	"application/oscore": {
	source: "iana"
},
	"application/oxps": {
	source: "iana",
	extensions: [
		"oxps"
	]
},
	"application/p2p-overlay+xml": {
	source: "iana",
	compressible: true
},
	"application/parityfec": {
	source: "iana"
},
	"application/passport": {
	source: "iana"
},
	"application/patch-ops-error+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xer"
	]
},
	"application/pdf": {
	source: "iana",
	compressible: false,
	extensions: [
		"pdf"
	]
},
	"application/pdx": {
	source: "iana"
},
	"application/pem-certificate-chain": {
	source: "iana"
},
	"application/pgp-encrypted": {
	source: "iana",
	compressible: false,
	extensions: [
		"pgp"
	]
},
	"application/pgp-keys": {
	source: "iana"
},
	"application/pgp-signature": {
	source: "iana",
	extensions: [
		"asc",
		"sig"
	]
},
	"application/pics-rules": {
	source: "apache",
	extensions: [
		"prf"
	]
},
	"application/pidf+xml": {
	source: "iana",
	compressible: true
},
	"application/pidf-diff+xml": {
	source: "iana",
	compressible: true
},
	"application/pkcs10": {
	source: "iana",
	extensions: [
		"p10"
	]
},
	"application/pkcs12": {
	source: "iana"
},
	"application/pkcs7-mime": {
	source: "iana",
	extensions: [
		"p7m",
		"p7c"
	]
},
	"application/pkcs7-signature": {
	source: "iana",
	extensions: [
		"p7s"
	]
},
	"application/pkcs8": {
	source: "iana",
	extensions: [
		"p8"
	]
},
	"application/pkcs8-encrypted": {
	source: "iana"
},
	"application/pkix-attr-cert": {
	source: "iana",
	extensions: [
		"ac"
	]
},
	"application/pkix-cert": {
	source: "iana",
	extensions: [
		"cer"
	]
},
	"application/pkix-crl": {
	source: "iana",
	extensions: [
		"crl"
	]
},
	"application/pkix-pkipath": {
	source: "iana",
	extensions: [
		"pkipath"
	]
},
	"application/pkixcmp": {
	source: "iana",
	extensions: [
		"pki"
	]
},
	"application/pls+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"pls"
	]
},
	"application/poc-settings+xml": {
	source: "iana",
	compressible: true
},
	"application/postscript": {
	source: "iana",
	compressible: true,
	extensions: [
		"ai",
		"eps",
		"ps"
	]
},
	"application/ppsp-tracker+json": {
	source: "iana",
	compressible: true
},
	"application/problem+json": {
	source: "iana",
	compressible: true
},
	"application/problem+xml": {
	source: "iana",
	compressible: true
},
	"application/provenance+xml": {
	source: "iana",
	compressible: true
},
	"application/prs.alvestrand.titrax-sheet": {
	source: "iana"
},
	"application/prs.cww": {
	source: "iana",
	extensions: [
		"cww"
	]
},
	"application/prs.hpub+zip": {
	source: "iana",
	compressible: false
},
	"application/prs.nprend": {
	source: "iana"
},
	"application/prs.plucker": {
	source: "iana"
},
	"application/prs.rdf-xml-crypt": {
	source: "iana"
},
	"application/prs.xsf+xml": {
	source: "iana",
	compressible: true
},
	"application/pskc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"pskcxml"
	]
},
	"application/qsig": {
	source: "iana"
},
	"application/raml+yaml": {
	compressible: true,
	extensions: [
		"raml"
	]
},
	"application/raptorfec": {
	source: "iana"
},
	"application/rdap+json": {
	source: "iana",
	compressible: true
},
	"application/rdf+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rdf",
		"owl"
	]
},
	"application/reginfo+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rif"
	]
},
	"application/relax-ng-compact-syntax": {
	source: "iana",
	extensions: [
		"rnc"
	]
},
	"application/remote-printing": {
	source: "iana"
},
	"application/reputon+json": {
	source: "iana",
	compressible: true
},
	"application/resource-lists+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rl"
	]
},
	"application/resource-lists-diff+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rld"
	]
},
	"application/rfc+xml": {
	source: "iana",
	compressible: true
},
	"application/riscos": {
	source: "iana"
},
	"application/rlmi+xml": {
	source: "iana",
	compressible: true
},
	"application/rls-services+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rs"
	]
},
	"application/route-apd+xml": {
	source: "iana",
	compressible: true
},
	"application/route-s-tsid+xml": {
	source: "iana",
	compressible: true
},
	"application/route-usd+xml": {
	source: "iana",
	compressible: true
},
	"application/rpki-ghostbusters": {
	source: "iana",
	extensions: [
		"gbr"
	]
},
	"application/rpki-manifest": {
	source: "iana",
	extensions: [
		"mft"
	]
},
	"application/rpki-publication": {
	source: "iana"
},
	"application/rpki-roa": {
	source: "iana",
	extensions: [
		"roa"
	]
},
	"application/rpki-updown": {
	source: "iana"
},
	"application/rsd+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"rsd"
	]
},
	"application/rss+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"rss"
	]
},
	"application/rtf": {
	source: "iana",
	compressible: true,
	extensions: [
		"rtf"
	]
},
	"application/rtploopback": {
	source: "iana"
},
	"application/rtx": {
	source: "iana"
},
	"application/samlassertion+xml": {
	source: "iana",
	compressible: true
},
	"application/samlmetadata+xml": {
	source: "iana",
	compressible: true
},
	"application/sbml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sbml"
	]
},
	"application/scaip+xml": {
	source: "iana",
	compressible: true
},
	"application/scim+json": {
	source: "iana",
	compressible: true
},
	"application/scvp-cv-request": {
	source: "iana",
	extensions: [
		"scq"
	]
},
	"application/scvp-cv-response": {
	source: "iana",
	extensions: [
		"scs"
	]
},
	"application/scvp-vp-request": {
	source: "iana",
	extensions: [
		"spq"
	]
},
	"application/scvp-vp-response": {
	source: "iana",
	extensions: [
		"spp"
	]
},
	"application/sdp": {
	source: "iana",
	extensions: [
		"sdp"
	]
},
	"application/secevent+jwt": {
	source: "iana"
},
	"application/senml+cbor": {
	source: "iana"
},
	"application/senml+json": {
	source: "iana",
	compressible: true
},
	"application/senml+xml": {
	source: "iana",
	compressible: true
},
	"application/senml-exi": {
	source: "iana"
},
	"application/sensml+cbor": {
	source: "iana"
},
	"application/sensml+json": {
	source: "iana",
	compressible: true
},
	"application/sensml+xml": {
	source: "iana",
	compressible: true
},
	"application/sensml-exi": {
	source: "iana"
},
	"application/sep+xml": {
	source: "iana",
	compressible: true
},
	"application/sep-exi": {
	source: "iana"
},
	"application/session-info": {
	source: "iana"
},
	"application/set-payment": {
	source: "iana"
},
	"application/set-payment-initiation": {
	source: "iana",
	extensions: [
		"setpay"
	]
},
	"application/set-registration": {
	source: "iana"
},
	"application/set-registration-initiation": {
	source: "iana",
	extensions: [
		"setreg"
	]
},
	"application/sgml": {
	source: "iana"
},
	"application/sgml-open-catalog": {
	source: "iana"
},
	"application/shf+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"shf"
	]
},
	"application/sieve": {
	source: "iana",
	extensions: [
		"siv",
		"sieve"
	]
},
	"application/simple-filter+xml": {
	source: "iana",
	compressible: true
},
	"application/simple-message-summary": {
	source: "iana"
},
	"application/simplesymbolcontainer": {
	source: "iana"
},
	"application/slate": {
	source: "iana"
},
	"application/smil": {
	source: "iana"
},
	"application/smil+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"smi",
		"smil"
	]
},
	"application/smpte336m": {
	source: "iana"
},
	"application/soap+fastinfoset": {
	source: "iana"
},
	"application/soap+xml": {
	source: "iana",
	compressible: true
},
	"application/sparql-query": {
	source: "iana",
	extensions: [
		"rq"
	]
},
	"application/sparql-results+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"srx"
	]
},
	"application/spirits-event+xml": {
	source: "iana",
	compressible: true
},
	"application/sql": {
	source: "iana"
},
	"application/srgs": {
	source: "iana",
	extensions: [
		"gram"
	]
},
	"application/srgs+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"grxml"
	]
},
	"application/sru+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sru"
	]
},
	"application/ssdl+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"ssdl"
	]
},
	"application/ssml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ssml"
	]
},
	"application/stix+json": {
	source: "iana",
	compressible: true
},
	"application/tamp-apex-update": {
	source: "iana"
},
	"application/tamp-apex-update-confirm": {
	source: "iana"
},
	"application/tamp-community-update": {
	source: "iana"
},
	"application/tamp-community-update-confirm": {
	source: "iana"
},
	"application/tamp-error": {
	source: "iana"
},
	"application/tamp-sequence-adjust": {
	source: "iana"
},
	"application/tamp-sequence-adjust-confirm": {
	source: "iana"
},
	"application/tamp-status-query": {
	source: "iana"
},
	"application/tamp-status-response": {
	source: "iana"
},
	"application/tamp-update": {
	source: "iana"
},
	"application/tamp-update-confirm": {
	source: "iana"
},
	"application/tar": {
	compressible: true
},
	"application/taxii+json": {
	source: "iana",
	compressible: true
},
	"application/tei+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"tei",
		"teicorpus"
	]
},
	"application/tetra_isi": {
	source: "iana"
},
	"application/thraud+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"tfi"
	]
},
	"application/timestamp-query": {
	source: "iana"
},
	"application/timestamp-reply": {
	source: "iana"
},
	"application/timestamped-data": {
	source: "iana",
	extensions: [
		"tsd"
	]
},
	"application/tlsrpt+gzip": {
	source: "iana"
},
	"application/tlsrpt+json": {
	source: "iana",
	compressible: true
},
	"application/tnauthlist": {
	source: "iana"
},
	"application/trickle-ice-sdpfrag": {
	source: "iana"
},
	"application/trig": {
	source: "iana"
},
	"application/ttml+xml": {
	source: "iana",
	compressible: true
},
	"application/tve-trigger": {
	source: "iana"
},
	"application/tzif": {
	source: "iana"
},
	"application/tzif-leap": {
	source: "iana"
},
	"application/ulpfec": {
	source: "iana"
},
	"application/urc-grpsheet+xml": {
	source: "iana",
	compressible: true
},
	"application/urc-ressheet+xml": {
	source: "iana",
	compressible: true
},
	"application/urc-targetdesc+xml": {
	source: "iana",
	compressible: true
},
	"application/urc-uisocketdesc+xml": {
	source: "iana",
	compressible: true
},
	"application/vcard+json": {
	source: "iana",
	compressible: true
},
	"application/vcard+xml": {
	source: "iana",
	compressible: true
},
	"application/vemmi": {
	source: "iana"
},
	"application/vividence.scriptfile": {
	source: "apache"
},
	"application/vnd.1000minds.decision-model+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp-prose+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp-prose-pc3ch+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp-v2x-local-service-information": {
	source: "iana"
},
	"application/vnd.3gpp.access-transfer-events+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.bsf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.gmop+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mc-signalling-ear": {
	source: "iana"
},
	"application/vnd.3gpp.mcdata-affiliation-command+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcdata-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcdata-payload": {
	source: "iana"
},
	"application/vnd.3gpp.mcdata-service-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcdata-signalling": {
	source: "iana"
},
	"application/vnd.3gpp.mcdata-ue-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcdata-user-profile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-affiliation-command+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-floor-request+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-location-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-service-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-signed+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-ue-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-ue-init-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-user-profile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-affiliation-command+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-affiliation-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-location-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-service-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-transmission-request+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-ue-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-user-profile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mid-call+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.pic-bw-large": {
	source: "iana",
	extensions: [
		"plb"
	]
},
	"application/vnd.3gpp.pic-bw-small": {
	source: "iana",
	extensions: [
		"psb"
	]
},
	"application/vnd.3gpp.pic-bw-var": {
	source: "iana",
	extensions: [
		"pvb"
	]
},
	"application/vnd.3gpp.sms": {
	source: "iana"
},
	"application/vnd.3gpp.sms+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.srvcc-ext+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.srvcc-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.state-and-event-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.ussd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp2.bcmcsinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp2.sms": {
	source: "iana"
},
	"application/vnd.3gpp2.tcap": {
	source: "iana",
	extensions: [
		"tcap"
	]
},
	"application/vnd.3lightssoftware.imagescal": {
	source: "iana"
},
	"application/vnd.3m.post-it-notes": {
	source: "iana",
	extensions: [
		"pwn"
	]
},
	"application/vnd.accpac.simply.aso": {
	source: "iana",
	extensions: [
		"aso"
	]
},
	"application/vnd.accpac.simply.imp": {
	source: "iana",
	extensions: [
		"imp"
	]
},
	"application/vnd.acucobol": {
	source: "iana",
	extensions: [
		"acu"
	]
},
	"application/vnd.acucorp": {
	source: "iana",
	extensions: [
		"atc",
		"acutc"
	]
},
	"application/vnd.adobe.air-application-installer-package+zip": {
	source: "apache",
	compressible: false,
	extensions: [
		"air"
	]
},
	"application/vnd.adobe.flash.movie": {
	source: "iana"
},
	"application/vnd.adobe.formscentral.fcdt": {
	source: "iana",
	extensions: [
		"fcdt"
	]
},
	"application/vnd.adobe.fxp": {
	source: "iana",
	extensions: [
		"fxp",
		"fxpl"
	]
},
	"application/vnd.adobe.partial-upload": {
	source: "iana"
},
	"application/vnd.adobe.xdp+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xdp"
	]
},
	"application/vnd.adobe.xfdf": {
	source: "iana",
	extensions: [
		"xfdf"
	]
},
	"application/vnd.aether.imp": {
	source: "iana"
},
	"application/vnd.afpc.afplinedata": {
	source: "iana"
},
	"application/vnd.afpc.modca": {
	source: "iana"
},
	"application/vnd.ah-barcode": {
	source: "iana"
},
	"application/vnd.ahead.space": {
	source: "iana",
	extensions: [
		"ahead"
	]
},
	"application/vnd.airzip.filesecure.azf": {
	source: "iana",
	extensions: [
		"azf"
	]
},
	"application/vnd.airzip.filesecure.azs": {
	source: "iana",
	extensions: [
		"azs"
	]
},
	"application/vnd.amadeus+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.amazon.ebook": {
	source: "apache",
	extensions: [
		"azw"
	]
},
	"application/vnd.amazon.mobi8-ebook": {
	source: "iana"
},
	"application/vnd.americandynamics.acc": {
	source: "iana",
	extensions: [
		"acc"
	]
},
	"application/vnd.amiga.ami": {
	source: "iana",
	extensions: [
		"ami"
	]
},
	"application/vnd.amundsen.maze+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.android.package-archive": {
	source: "apache",
	compressible: false,
	extensions: [
		"apk"
	]
},
	"application/vnd.anki": {
	source: "iana"
},
	"application/vnd.anser-web-certificate-issue-initiation": {
	source: "iana",
	extensions: [
		"cii"
	]
},
	"application/vnd.anser-web-funds-transfer-initiation": {
	source: "apache",
	extensions: [
		"fti"
	]
},
	"application/vnd.antix.game-component": {
	source: "iana",
	extensions: [
		"atx"
	]
},
	"application/vnd.apache.thrift.binary": {
	source: "iana"
},
	"application/vnd.apache.thrift.compact": {
	source: "iana"
},
	"application/vnd.apache.thrift.json": {
	source: "iana"
},
	"application/vnd.api+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.apothekende.reservation+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.apple.installer+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mpkg"
	]
},
	"application/vnd.apple.keynote": {
	source: "iana",
	extensions: [
		"keynote"
	]
},
	"application/vnd.apple.mpegurl": {
	source: "iana",
	extensions: [
		"m3u8"
	]
},
	"application/vnd.apple.numbers": {
	source: "iana",
	extensions: [
		"numbers"
	]
},
	"application/vnd.apple.pages": {
	source: "iana",
	extensions: [
		"pages"
	]
},
	"application/vnd.apple.pkpass": {
	compressible: false,
	extensions: [
		"pkpass"
	]
},
	"application/vnd.arastra.swi": {
	source: "iana"
},
	"application/vnd.aristanetworks.swi": {
	source: "iana",
	extensions: [
		"swi"
	]
},
	"application/vnd.artisan+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.artsquare": {
	source: "iana"
},
	"application/vnd.astraea-software.iota": {
	source: "iana",
	extensions: [
		"iota"
	]
},
	"application/vnd.audiograph": {
	source: "iana",
	extensions: [
		"aep"
	]
},
	"application/vnd.autopackage": {
	source: "iana"
},
	"application/vnd.avalon+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.avistar+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.balsamiq.bmml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.balsamiq.bmpr": {
	source: "iana"
},
	"application/vnd.banana-accounting": {
	source: "iana"
},
	"application/vnd.bbf.usp.msg": {
	source: "iana"
},
	"application/vnd.bbf.usp.msg+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.bekitzur-stech+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.bint.med-content": {
	source: "iana"
},
	"application/vnd.biopax.rdf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.blink-idb-value-wrapper": {
	source: "iana"
},
	"application/vnd.blueice.multipass": {
	source: "iana",
	extensions: [
		"mpm"
	]
},
	"application/vnd.bluetooth.ep.oob": {
	source: "iana"
},
	"application/vnd.bluetooth.le.oob": {
	source: "iana"
},
	"application/vnd.bmi": {
	source: "iana",
	extensions: [
		"bmi"
	]
},
	"application/vnd.businessobjects": {
	source: "iana",
	extensions: [
		"rep"
	]
},
	"application/vnd.byu.uapi+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.cab-jscript": {
	source: "iana"
},
	"application/vnd.canon-cpdl": {
	source: "iana"
},
	"application/vnd.canon-lips": {
	source: "iana"
},
	"application/vnd.capasystems-pg+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.cendio.thinlinc.clientconf": {
	source: "iana"
},
	"application/vnd.century-systems.tcp_stream": {
	source: "iana"
},
	"application/vnd.chemdraw+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"cdxml"
	]
},
	"application/vnd.chess-pgn": {
	source: "iana"
},
	"application/vnd.chipnuts.karaoke-mmd": {
	source: "iana",
	extensions: [
		"mmd"
	]
},
	"application/vnd.cinderella": {
	source: "iana",
	extensions: [
		"cdy"
	]
},
	"application/vnd.cirpack.isdn-ext": {
	source: "iana"
},
	"application/vnd.citationstyles.style+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"csl"
	]
},
	"application/vnd.claymore": {
	source: "iana",
	extensions: [
		"cla"
	]
},
	"application/vnd.cloanto.rp9": {
	source: "iana",
	extensions: [
		"rp9"
	]
},
	"application/vnd.clonk.c4group": {
	source: "iana",
	extensions: [
		"c4g",
		"c4d",
		"c4f",
		"c4p",
		"c4u"
	]
},
	"application/vnd.cluetrust.cartomobile-config": {
	source: "iana",
	extensions: [
		"c11amc"
	]
},
	"application/vnd.cluetrust.cartomobile-config-pkg": {
	source: "iana",
	extensions: [
		"c11amz"
	]
},
	"application/vnd.coffeescript": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.document": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.document-template": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.presentation": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.presentation-template": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.spreadsheet": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.spreadsheet-template": {
	source: "iana"
},
	"application/vnd.collection+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.collection.doc+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.collection.next+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.comicbook+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.comicbook-rar": {
	source: "iana"
},
	"application/vnd.commerce-battelle": {
	source: "iana"
},
	"application/vnd.commonspace": {
	source: "iana",
	extensions: [
		"csp"
	]
},
	"application/vnd.contact.cmsg": {
	source: "iana",
	extensions: [
		"cdbcmsg"
	]
},
	"application/vnd.coreos.ignition+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.cosmocaller": {
	source: "iana",
	extensions: [
		"cmc"
	]
},
	"application/vnd.crick.clicker": {
	source: "iana",
	extensions: [
		"clkx"
	]
},
	"application/vnd.crick.clicker.keyboard": {
	source: "iana",
	extensions: [
		"clkk"
	]
},
	"application/vnd.crick.clicker.palette": {
	source: "iana",
	extensions: [
		"clkp"
	]
},
	"application/vnd.crick.clicker.template": {
	source: "iana",
	extensions: [
		"clkt"
	]
},
	"application/vnd.crick.clicker.wordbank": {
	source: "iana",
	extensions: [
		"clkw"
	]
},
	"application/vnd.criticaltools.wbs+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wbs"
	]
},
	"application/vnd.ctc-posml": {
	source: "iana",
	extensions: [
		"pml"
	]
},
	"application/vnd.ctct.ws+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.cups-pdf": {
	source: "iana"
},
	"application/vnd.cups-postscript": {
	source: "iana"
},
	"application/vnd.cups-ppd": {
	source: "iana",
	extensions: [
		"ppd"
	]
},
	"application/vnd.cups-raster": {
	source: "iana"
},
	"application/vnd.cups-raw": {
	source: "iana"
},
	"application/vnd.curl": {
	source: "iana"
},
	"application/vnd.curl.car": {
	source: "apache",
	extensions: [
		"car"
	]
},
	"application/vnd.curl.pcurl": {
	source: "apache",
	extensions: [
		"pcurl"
	]
},
	"application/vnd.cyan.dean.root+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.cybank": {
	source: "iana"
},
	"application/vnd.d2l.coursepackage1p0+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.dart": {
	source: "iana",
	compressible: true,
	extensions: [
		"dart"
	]
},
	"application/vnd.data-vision.rdz": {
	source: "iana",
	extensions: [
		"rdz"
	]
},
	"application/vnd.datapackage+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.dataresource+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.debian.binary-package": {
	source: "iana"
},
	"application/vnd.dece.data": {
	source: "iana",
	extensions: [
		"uvf",
		"uvvf",
		"uvd",
		"uvvd"
	]
},
	"application/vnd.dece.ttml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"uvt",
		"uvvt"
	]
},
	"application/vnd.dece.unspecified": {
	source: "iana",
	extensions: [
		"uvx",
		"uvvx"
	]
},
	"application/vnd.dece.zip": {
	source: "iana",
	extensions: [
		"uvz",
		"uvvz"
	]
},
	"application/vnd.denovo.fcselayout-link": {
	source: "iana",
	extensions: [
		"fe_launch"
	]
},
	"application/vnd.desmume.movie": {
	source: "iana"
},
	"application/vnd.dir-bi.plate-dl-nosuffix": {
	source: "iana"
},
	"application/vnd.dm.delegation+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dna": {
	source: "iana",
	extensions: [
		"dna"
	]
},
	"application/vnd.document+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.dolby.mlp": {
	source: "apache",
	extensions: [
		"mlp"
	]
},
	"application/vnd.dolby.mobile.1": {
	source: "iana"
},
	"application/vnd.dolby.mobile.2": {
	source: "iana"
},
	"application/vnd.doremir.scorecloud-binary-document": {
	source: "iana"
},
	"application/vnd.dpgraph": {
	source: "iana",
	extensions: [
		"dpg"
	]
},
	"application/vnd.dreamfactory": {
	source: "iana",
	extensions: [
		"dfac"
	]
},
	"application/vnd.drive+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ds-keypoint": {
	source: "apache",
	extensions: [
		"kpxx"
	]
},
	"application/vnd.dtg.local": {
	source: "iana"
},
	"application/vnd.dtg.local.flash": {
	source: "iana"
},
	"application/vnd.dtg.local.html": {
	source: "iana"
},
	"application/vnd.dvb.ait": {
	source: "iana",
	extensions: [
		"ait"
	]
},
	"application/vnd.dvb.dvbj": {
	source: "iana"
},
	"application/vnd.dvb.esgcontainer": {
	source: "iana"
},
	"application/vnd.dvb.ipdcdftnotifaccess": {
	source: "iana"
},
	"application/vnd.dvb.ipdcesgaccess": {
	source: "iana"
},
	"application/vnd.dvb.ipdcesgaccess2": {
	source: "iana"
},
	"application/vnd.dvb.ipdcesgpdd": {
	source: "iana"
},
	"application/vnd.dvb.ipdcroaming": {
	source: "iana"
},
	"application/vnd.dvb.iptv.alfec-base": {
	source: "iana"
},
	"application/vnd.dvb.iptv.alfec-enhancement": {
	source: "iana"
},
	"application/vnd.dvb.notif-aggregate-root+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-container+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-generic+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-ia-msglist+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-ia-registration-request+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-ia-registration-response+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-init+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.pfr": {
	source: "iana"
},
	"application/vnd.dvb.service": {
	source: "iana",
	extensions: [
		"svc"
	]
},
	"application/vnd.dxr": {
	source: "iana"
},
	"application/vnd.dynageo": {
	source: "iana",
	extensions: [
		"geo"
	]
},
	"application/vnd.dzr": {
	source: "iana"
},
	"application/vnd.easykaraoke.cdgdownload": {
	source: "iana"
},
	"application/vnd.ecdis-update": {
	source: "iana"
},
	"application/vnd.ecip.rlp": {
	source: "iana"
},
	"application/vnd.ecowin.chart": {
	source: "iana",
	extensions: [
		"mag"
	]
},
	"application/vnd.ecowin.filerequest": {
	source: "iana"
},
	"application/vnd.ecowin.fileupdate": {
	source: "iana"
},
	"application/vnd.ecowin.series": {
	source: "iana"
},
	"application/vnd.ecowin.seriesrequest": {
	source: "iana"
},
	"application/vnd.ecowin.seriesupdate": {
	source: "iana"
},
	"application/vnd.efi.img": {
	source: "iana"
},
	"application/vnd.efi.iso": {
	source: "iana"
},
	"application/vnd.emclient.accessrequest+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.enliven": {
	source: "iana",
	extensions: [
		"nml"
	]
},
	"application/vnd.enphase.envoy": {
	source: "iana"
},
	"application/vnd.eprints.data+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.epson.esf": {
	source: "iana",
	extensions: [
		"esf"
	]
},
	"application/vnd.epson.msf": {
	source: "iana",
	extensions: [
		"msf"
	]
},
	"application/vnd.epson.quickanime": {
	source: "iana",
	extensions: [
		"qam"
	]
},
	"application/vnd.epson.salt": {
	source: "iana",
	extensions: [
		"slt"
	]
},
	"application/vnd.epson.ssf": {
	source: "iana",
	extensions: [
		"ssf"
	]
},
	"application/vnd.ericsson.quickcall": {
	source: "iana"
},
	"application/vnd.espass-espass+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.eszigno3+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"es3",
		"et3"
	]
},
	"application/vnd.etsi.aoc+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.asic-e+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.etsi.asic-s+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.etsi.cug+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvcommand+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvdiscovery+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvprofile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvsad-bc+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvsad-cod+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvsad-npvr+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvservice+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvsync+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvueprofile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.mcid+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.mheg5": {
	source: "iana"
},
	"application/vnd.etsi.overload-control-policy-dataset+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.pstn+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.sci+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.simservs+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.timestamp-token": {
	source: "iana"
},
	"application/vnd.etsi.tsl+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.tsl.der": {
	source: "iana"
},
	"application/vnd.eudora.data": {
	source: "iana"
},
	"application/vnd.evolv.ecig.profile": {
	source: "iana"
},
	"application/vnd.evolv.ecig.settings": {
	source: "iana"
},
	"application/vnd.evolv.ecig.theme": {
	source: "iana"
},
	"application/vnd.exstream-empower+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.exstream-package": {
	source: "iana"
},
	"application/vnd.ezpix-album": {
	source: "iana",
	extensions: [
		"ez2"
	]
},
	"application/vnd.ezpix-package": {
	source: "iana",
	extensions: [
		"ez3"
	]
},
	"application/vnd.f-secure.mobile": {
	source: "iana"
},
	"application/vnd.fastcopy-disk-image": {
	source: "iana"
},
	"application/vnd.fdf": {
	source: "iana",
	extensions: [
		"fdf"
	]
},
	"application/vnd.fdsn.mseed": {
	source: "iana",
	extensions: [
		"mseed"
	]
},
	"application/vnd.fdsn.seed": {
	source: "iana",
	extensions: [
		"seed",
		"dataless"
	]
},
	"application/vnd.ffsns": {
	source: "iana"
},
	"application/vnd.filmit.zfc": {
	source: "iana"
},
	"application/vnd.fints": {
	source: "iana"
},
	"application/vnd.firemonkeys.cloudcell": {
	source: "iana"
},
	"application/vnd.flographit": {
	source: "iana",
	extensions: [
		"gph"
	]
},
	"application/vnd.fluxtime.clip": {
	source: "iana",
	extensions: [
		"ftc"
	]
},
	"application/vnd.font-fontforge-sfd": {
	source: "iana"
},
	"application/vnd.framemaker": {
	source: "iana",
	extensions: [
		"fm",
		"frame",
		"maker",
		"book"
	]
},
	"application/vnd.frogans.fnc": {
	source: "iana",
	extensions: [
		"fnc"
	]
},
	"application/vnd.frogans.ltf": {
	source: "iana",
	extensions: [
		"ltf"
	]
},
	"application/vnd.fsc.weblaunch": {
	source: "iana",
	extensions: [
		"fsc"
	]
},
	"application/vnd.fujitsu.oasys": {
	source: "iana",
	extensions: [
		"oas"
	]
},
	"application/vnd.fujitsu.oasys2": {
	source: "iana",
	extensions: [
		"oa2"
	]
},
	"application/vnd.fujitsu.oasys3": {
	source: "iana",
	extensions: [
		"oa3"
	]
},
	"application/vnd.fujitsu.oasysgp": {
	source: "iana",
	extensions: [
		"fg5"
	]
},
	"application/vnd.fujitsu.oasysprs": {
	source: "iana",
	extensions: [
		"bh2"
	]
},
	"application/vnd.fujixerox.art-ex": {
	source: "iana"
},
	"application/vnd.fujixerox.art4": {
	source: "iana"
},
	"application/vnd.fujixerox.ddd": {
	source: "iana",
	extensions: [
		"ddd"
	]
},
	"application/vnd.fujixerox.docuworks": {
	source: "iana",
	extensions: [
		"xdw"
	]
},
	"application/vnd.fujixerox.docuworks.binder": {
	source: "iana",
	extensions: [
		"xbd"
	]
},
	"application/vnd.fujixerox.docuworks.container": {
	source: "iana"
},
	"application/vnd.fujixerox.hbpl": {
	source: "iana"
},
	"application/vnd.fut-misnet": {
	source: "iana"
},
	"application/vnd.futoin+cbor": {
	source: "iana"
},
	"application/vnd.futoin+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.fuzzysheet": {
	source: "iana",
	extensions: [
		"fzs"
	]
},
	"application/vnd.genomatix.tuxedo": {
	source: "iana",
	extensions: [
		"txd"
	]
},
	"application/vnd.geo+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.geocube+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.geogebra.file": {
	source: "iana",
	extensions: [
		"ggb"
	]
},
	"application/vnd.geogebra.tool": {
	source: "iana",
	extensions: [
		"ggt"
	]
},
	"application/vnd.geometry-explorer": {
	source: "iana",
	extensions: [
		"gex",
		"gre"
	]
},
	"application/vnd.geonext": {
	source: "iana",
	extensions: [
		"gxt"
	]
},
	"application/vnd.geoplan": {
	source: "iana",
	extensions: [
		"g2w"
	]
},
	"application/vnd.geospace": {
	source: "iana",
	extensions: [
		"g3w"
	]
},
	"application/vnd.gerber": {
	source: "iana"
},
	"application/vnd.globalplatform.card-content-mgt": {
	source: "iana"
},
	"application/vnd.globalplatform.card-content-mgt-response": {
	source: "iana"
},
	"application/vnd.gmx": {
	source: "iana",
	extensions: [
		"gmx"
	]
},
	"application/vnd.google-apps.document": {
	compressible: false,
	extensions: [
		"gdoc"
	]
},
	"application/vnd.google-apps.presentation": {
	compressible: false,
	extensions: [
		"gslides"
	]
},
	"application/vnd.google-apps.spreadsheet": {
	compressible: false,
	extensions: [
		"gsheet"
	]
},
	"application/vnd.google-earth.kml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"kml"
	]
},
	"application/vnd.google-earth.kmz": {
	source: "iana",
	compressible: false,
	extensions: [
		"kmz"
	]
},
	"application/vnd.gov.sk.e-form+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.gov.sk.e-form+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.gov.sk.xmldatacontainer+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.grafeq": {
	source: "iana",
	extensions: [
		"gqf",
		"gqs"
	]
},
	"application/vnd.gridmp": {
	source: "iana"
},
	"application/vnd.groove-account": {
	source: "iana",
	extensions: [
		"gac"
	]
},
	"application/vnd.groove-help": {
	source: "iana",
	extensions: [
		"ghf"
	]
},
	"application/vnd.groove-identity-message": {
	source: "iana",
	extensions: [
		"gim"
	]
},
	"application/vnd.groove-injector": {
	source: "iana",
	extensions: [
		"grv"
	]
},
	"application/vnd.groove-tool-message": {
	source: "iana",
	extensions: [
		"gtm"
	]
},
	"application/vnd.groove-tool-template": {
	source: "iana",
	extensions: [
		"tpl"
	]
},
	"application/vnd.groove-vcard": {
	source: "iana",
	extensions: [
		"vcg"
	]
},
	"application/vnd.hal+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hal+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"hal"
	]
},
	"application/vnd.handheld-entertainment+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"zmm"
	]
},
	"application/vnd.hbci": {
	source: "iana",
	extensions: [
		"hbci"
	]
},
	"application/vnd.hc+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hcl-bireports": {
	source: "iana"
},
	"application/vnd.hdt": {
	source: "iana"
},
	"application/vnd.heroku+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hhe.lesson-player": {
	source: "iana",
	extensions: [
		"les"
	]
},
	"application/vnd.hp-hpgl": {
	source: "iana",
	extensions: [
		"hpgl"
	]
},
	"application/vnd.hp-hpid": {
	source: "iana",
	extensions: [
		"hpid"
	]
},
	"application/vnd.hp-hps": {
	source: "iana",
	extensions: [
		"hps"
	]
},
	"application/vnd.hp-jlyt": {
	source: "iana",
	extensions: [
		"jlt"
	]
},
	"application/vnd.hp-pcl": {
	source: "iana",
	extensions: [
		"pcl"
	]
},
	"application/vnd.hp-pclxl": {
	source: "iana",
	extensions: [
		"pclxl"
	]
},
	"application/vnd.httphone": {
	source: "iana"
},
	"application/vnd.hydrostatix.sof-data": {
	source: "iana",
	extensions: [
		"sfd-hdstx"
	]
},
	"application/vnd.hyper+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hyper-item+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hyperdrive+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hzn-3d-crossword": {
	source: "iana"
},
	"application/vnd.ibm.afplinedata": {
	source: "iana"
},
	"application/vnd.ibm.electronic-media": {
	source: "iana"
},
	"application/vnd.ibm.minipay": {
	source: "iana",
	extensions: [
		"mpy"
	]
},
	"application/vnd.ibm.modcap": {
	source: "iana",
	extensions: [
		"afp",
		"listafp",
		"list3820"
	]
},
	"application/vnd.ibm.rights-management": {
	source: "iana",
	extensions: [
		"irm"
	]
},
	"application/vnd.ibm.secure-container": {
	source: "iana",
	extensions: [
		"sc"
	]
},
	"application/vnd.iccprofile": {
	source: "iana",
	extensions: [
		"icc",
		"icm"
	]
},
	"application/vnd.ieee.1905": {
	source: "iana"
},
	"application/vnd.igloader": {
	source: "iana",
	extensions: [
		"igl"
	]
},
	"application/vnd.imagemeter.folder+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.imagemeter.image+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.immervision-ivp": {
	source: "iana",
	extensions: [
		"ivp"
	]
},
	"application/vnd.immervision-ivu": {
	source: "iana",
	extensions: [
		"ivu"
	]
},
	"application/vnd.ims.imsccv1p1": {
	source: "iana"
},
	"application/vnd.ims.imsccv1p2": {
	source: "iana"
},
	"application/vnd.ims.imsccv1p3": {
	source: "iana"
},
	"application/vnd.ims.lis.v2.result+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolconsumerprofile+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolproxy+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolproxy.id+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolsettings+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolsettings.simple+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.informedcontrol.rms+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.informix-visionary": {
	source: "iana"
},
	"application/vnd.infotech.project": {
	source: "iana"
},
	"application/vnd.infotech.project+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.innopath.wamp.notification": {
	source: "iana"
},
	"application/vnd.insors.igm": {
	source: "iana",
	extensions: [
		"igm"
	]
},
	"application/vnd.intercon.formnet": {
	source: "iana",
	extensions: [
		"xpw",
		"xpx"
	]
},
	"application/vnd.intergeo": {
	source: "iana",
	extensions: [
		"i2g"
	]
},
	"application/vnd.intertrust.digibox": {
	source: "iana"
},
	"application/vnd.intertrust.nncp": {
	source: "iana"
},
	"application/vnd.intu.qbo": {
	source: "iana",
	extensions: [
		"qbo"
	]
},
	"application/vnd.intu.qfx": {
	source: "iana",
	extensions: [
		"qfx"
	]
},
	"application/vnd.iptc.g2.catalogitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.conceptitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.knowledgeitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.newsitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.newsmessage+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.packageitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.planningitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ipunplugged.rcprofile": {
	source: "iana",
	extensions: [
		"rcprofile"
	]
},
	"application/vnd.irepository.package+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"irp"
	]
},
	"application/vnd.is-xpr": {
	source: "iana",
	extensions: [
		"xpr"
	]
},
	"application/vnd.isac.fcs": {
	source: "iana",
	extensions: [
		"fcs"
	]
},
	"application/vnd.jam": {
	source: "iana",
	extensions: [
		"jam"
	]
},
	"application/vnd.japannet-directory-service": {
	source: "iana"
},
	"application/vnd.japannet-jpnstore-wakeup": {
	source: "iana"
},
	"application/vnd.japannet-payment-wakeup": {
	source: "iana"
},
	"application/vnd.japannet-registration": {
	source: "iana"
},
	"application/vnd.japannet-registration-wakeup": {
	source: "iana"
},
	"application/vnd.japannet-setstore-wakeup": {
	source: "iana"
},
	"application/vnd.japannet-verification": {
	source: "iana"
},
	"application/vnd.japannet-verification-wakeup": {
	source: "iana"
},
	"application/vnd.jcp.javame.midlet-rms": {
	source: "iana",
	extensions: [
		"rms"
	]
},
	"application/vnd.jisp": {
	source: "iana",
	extensions: [
		"jisp"
	]
},
	"application/vnd.joost.joda-archive": {
	source: "iana",
	extensions: [
		"joda"
	]
},
	"application/vnd.jsk.isdn-ngn": {
	source: "iana"
},
	"application/vnd.kahootz": {
	source: "iana",
	extensions: [
		"ktz",
		"ktr"
	]
},
	"application/vnd.kde.karbon": {
	source: "iana",
	extensions: [
		"karbon"
	]
},
	"application/vnd.kde.kchart": {
	source: "iana",
	extensions: [
		"chrt"
	]
},
	"application/vnd.kde.kformula": {
	source: "iana",
	extensions: [
		"kfo"
	]
},
	"application/vnd.kde.kivio": {
	source: "iana",
	extensions: [
		"flw"
	]
},
	"application/vnd.kde.kontour": {
	source: "iana",
	extensions: [
		"kon"
	]
},
	"application/vnd.kde.kpresenter": {
	source: "iana",
	extensions: [
		"kpr",
		"kpt"
	]
},
	"application/vnd.kde.kspread": {
	source: "iana",
	extensions: [
		"ksp"
	]
},
	"application/vnd.kde.kword": {
	source: "iana",
	extensions: [
		"kwd",
		"kwt"
	]
},
	"application/vnd.kenameaapp": {
	source: "iana",
	extensions: [
		"htke"
	]
},
	"application/vnd.kidspiration": {
	source: "iana",
	extensions: [
		"kia"
	]
},
	"application/vnd.kinar": {
	source: "iana",
	extensions: [
		"kne",
		"knp"
	]
},
	"application/vnd.koan": {
	source: "iana",
	extensions: [
		"skp",
		"skd",
		"skt",
		"skm"
	]
},
	"application/vnd.kodak-descriptor": {
	source: "iana",
	extensions: [
		"sse"
	]
},
	"application/vnd.las.las+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.las.las+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"lasxml"
	]
},
	"application/vnd.leap+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.liberty-request+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.llamagraphics.life-balance.desktop": {
	source: "iana",
	extensions: [
		"lbd"
	]
},
	"application/vnd.llamagraphics.life-balance.exchange+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"lbe"
	]
},
	"application/vnd.lotus-1-2-3": {
	source: "iana",
	extensions: [
		"123"
	]
},
	"application/vnd.lotus-approach": {
	source: "iana",
	extensions: [
		"apr"
	]
},
	"application/vnd.lotus-freelance": {
	source: "iana",
	extensions: [
		"pre"
	]
},
	"application/vnd.lotus-notes": {
	source: "iana",
	extensions: [
		"nsf"
	]
},
	"application/vnd.lotus-organizer": {
	source: "iana",
	extensions: [
		"org"
	]
},
	"application/vnd.lotus-screencam": {
	source: "iana",
	extensions: [
		"scm"
	]
},
	"application/vnd.lotus-wordpro": {
	source: "iana",
	extensions: [
		"lwp"
	]
},
	"application/vnd.macports.portpkg": {
	source: "iana",
	extensions: [
		"portpkg"
	]
},
	"application/vnd.mapbox-vector-tile": {
	source: "iana"
},
	"application/vnd.marlin.drm.actiontoken+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.marlin.drm.conftoken+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.marlin.drm.license+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.marlin.drm.mdcf": {
	source: "iana"
},
	"application/vnd.mason+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.maxmind.maxmind-db": {
	source: "iana"
},
	"application/vnd.mcd": {
	source: "iana",
	extensions: [
		"mcd"
	]
},
	"application/vnd.medcalcdata": {
	source: "iana",
	extensions: [
		"mc1"
	]
},
	"application/vnd.mediastation.cdkey": {
	source: "iana",
	extensions: [
		"cdkey"
	]
},
	"application/vnd.meridian-slingshot": {
	source: "iana"
},
	"application/vnd.mfer": {
	source: "iana",
	extensions: [
		"mwf"
	]
},
	"application/vnd.mfmp": {
	source: "iana",
	extensions: [
		"mfm"
	]
},
	"application/vnd.micro+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.micrografx.flo": {
	source: "iana",
	extensions: [
		"flo"
	]
},
	"application/vnd.micrografx.igx": {
	source: "iana",
	extensions: [
		"igx"
	]
},
	"application/vnd.microsoft.portable-executable": {
	source: "iana"
},
	"application/vnd.microsoft.windows.thumbnail-cache": {
	source: "iana"
},
	"application/vnd.miele+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.mif": {
	source: "iana",
	extensions: [
		"mif"
	]
},
	"application/vnd.minisoft-hp3000-save": {
	source: "iana"
},
	"application/vnd.mitsubishi.misty-guard.trustweb": {
	source: "iana"
},
	"application/vnd.mobius.daf": {
	source: "iana",
	extensions: [
		"daf"
	]
},
	"application/vnd.mobius.dis": {
	source: "iana",
	extensions: [
		"dis"
	]
},
	"application/vnd.mobius.mbk": {
	source: "iana",
	extensions: [
		"mbk"
	]
},
	"application/vnd.mobius.mqy": {
	source: "iana",
	extensions: [
		"mqy"
	]
},
	"application/vnd.mobius.msl": {
	source: "iana",
	extensions: [
		"msl"
	]
},
	"application/vnd.mobius.plc": {
	source: "iana",
	extensions: [
		"plc"
	]
},
	"application/vnd.mobius.txf": {
	source: "iana",
	extensions: [
		"txf"
	]
},
	"application/vnd.mophun.application": {
	source: "iana",
	extensions: [
		"mpn"
	]
},
	"application/vnd.mophun.certificate": {
	source: "iana",
	extensions: [
		"mpc"
	]
},
	"application/vnd.motorola.flexsuite": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.adsi": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.fis": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.gotap": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.kmr": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.ttc": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.wem": {
	source: "iana"
},
	"application/vnd.motorola.iprm": {
	source: "iana"
},
	"application/vnd.mozilla.xul+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xul"
	]
},
	"application/vnd.ms-3mfdocument": {
	source: "iana"
},
	"application/vnd.ms-artgalry": {
	source: "iana",
	extensions: [
		"cil"
	]
},
	"application/vnd.ms-asf": {
	source: "iana"
},
	"application/vnd.ms-cab-compressed": {
	source: "iana",
	extensions: [
		"cab"
	]
},
	"application/vnd.ms-color.iccprofile": {
	source: "apache"
},
	"application/vnd.ms-excel": {
	source: "iana",
	compressible: false,
	extensions: [
		"xls",
		"xlm",
		"xla",
		"xlc",
		"xlt",
		"xlw"
	]
},
	"application/vnd.ms-excel.addin.macroenabled.12": {
	source: "iana",
	extensions: [
		"xlam"
	]
},
	"application/vnd.ms-excel.sheet.binary.macroenabled.12": {
	source: "iana",
	extensions: [
		"xlsb"
	]
},
	"application/vnd.ms-excel.sheet.macroenabled.12": {
	source: "iana",
	extensions: [
		"xlsm"
	]
},
	"application/vnd.ms-excel.template.macroenabled.12": {
	source: "iana",
	extensions: [
		"xltm"
	]
},
	"application/vnd.ms-fontobject": {
	source: "iana",
	compressible: true,
	extensions: [
		"eot"
	]
},
	"application/vnd.ms-htmlhelp": {
	source: "iana",
	extensions: [
		"chm"
	]
},
	"application/vnd.ms-ims": {
	source: "iana",
	extensions: [
		"ims"
	]
},
	"application/vnd.ms-lrm": {
	source: "iana",
	extensions: [
		"lrm"
	]
},
	"application/vnd.ms-office.activex+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ms-officetheme": {
	source: "iana",
	extensions: [
		"thmx"
	]
},
	"application/vnd.ms-opentype": {
	source: "apache",
	compressible: true
},
	"application/vnd.ms-outlook": {
	compressible: false,
	extensions: [
		"msg"
	]
},
	"application/vnd.ms-package.obfuscated-opentype": {
	source: "apache"
},
	"application/vnd.ms-pki.seccat": {
	source: "apache",
	extensions: [
		"cat"
	]
},
	"application/vnd.ms-pki.stl": {
	source: "apache",
	extensions: [
		"stl"
	]
},
	"application/vnd.ms-playready.initiator+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ms-powerpoint": {
	source: "iana",
	compressible: false,
	extensions: [
		"ppt",
		"pps",
		"pot"
	]
},
	"application/vnd.ms-powerpoint.addin.macroenabled.12": {
	source: "iana",
	extensions: [
		"ppam"
	]
},
	"application/vnd.ms-powerpoint.presentation.macroenabled.12": {
	source: "iana",
	extensions: [
		"pptm"
	]
},
	"application/vnd.ms-powerpoint.slide.macroenabled.12": {
	source: "iana",
	extensions: [
		"sldm"
	]
},
	"application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
	source: "iana",
	extensions: [
		"ppsm"
	]
},
	"application/vnd.ms-powerpoint.template.macroenabled.12": {
	source: "iana",
	extensions: [
		"potm"
	]
},
	"application/vnd.ms-printdevicecapabilities+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ms-printing.printticket+xml": {
	source: "apache",
	compressible: true
},
	"application/vnd.ms-printschematicket+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ms-project": {
	source: "iana",
	extensions: [
		"mpp",
		"mpt"
	]
},
	"application/vnd.ms-tnef": {
	source: "iana"
},
	"application/vnd.ms-windows.devicepairing": {
	source: "iana"
},
	"application/vnd.ms-windows.nwprinting.oob": {
	source: "iana"
},
	"application/vnd.ms-windows.printerpairing": {
	source: "iana"
},
	"application/vnd.ms-windows.wsd.oob": {
	source: "iana"
},
	"application/vnd.ms-wmdrm.lic-chlg-req": {
	source: "iana"
},
	"application/vnd.ms-wmdrm.lic-resp": {
	source: "iana"
},
	"application/vnd.ms-wmdrm.meter-chlg-req": {
	source: "iana"
},
	"application/vnd.ms-wmdrm.meter-resp": {
	source: "iana"
},
	"application/vnd.ms-word.document.macroenabled.12": {
	source: "iana",
	extensions: [
		"docm"
	]
},
	"application/vnd.ms-word.template.macroenabled.12": {
	source: "iana",
	extensions: [
		"dotm"
	]
},
	"application/vnd.ms-works": {
	source: "iana",
	extensions: [
		"wps",
		"wks",
		"wcm",
		"wdb"
	]
},
	"application/vnd.ms-wpl": {
	source: "iana",
	extensions: [
		"wpl"
	]
},
	"application/vnd.ms-xpsdocument": {
	source: "iana",
	compressible: false,
	extensions: [
		"xps"
	]
},
	"application/vnd.msa-disk-image": {
	source: "iana"
},
	"application/vnd.mseq": {
	source: "iana",
	extensions: [
		"mseq"
	]
},
	"application/vnd.msign": {
	source: "iana"
},
	"application/vnd.multiad.creator": {
	source: "iana"
},
	"application/vnd.multiad.creator.cif": {
	source: "iana"
},
	"application/vnd.music-niff": {
	source: "iana"
},
	"application/vnd.musician": {
	source: "iana",
	extensions: [
		"mus"
	]
},
	"application/vnd.muvee.style": {
	source: "iana",
	extensions: [
		"msty"
	]
},
	"application/vnd.mynfc": {
	source: "iana",
	extensions: [
		"taglet"
	]
},
	"application/vnd.ncd.control": {
	source: "iana"
},
	"application/vnd.ncd.reference": {
	source: "iana"
},
	"application/vnd.nearst.inv+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.nervana": {
	source: "iana"
},
	"application/vnd.netfpx": {
	source: "iana"
},
	"application/vnd.neurolanguage.nlu": {
	source: "iana",
	extensions: [
		"nlu"
	]
},
	"application/vnd.nimn": {
	source: "iana"
},
	"application/vnd.nintendo.nitro.rom": {
	source: "iana"
},
	"application/vnd.nintendo.snes.rom": {
	source: "iana"
},
	"application/vnd.nitf": {
	source: "iana",
	extensions: [
		"ntf",
		"nitf"
	]
},
	"application/vnd.noblenet-directory": {
	source: "iana",
	extensions: [
		"nnd"
	]
},
	"application/vnd.noblenet-sealer": {
	source: "iana",
	extensions: [
		"nns"
	]
},
	"application/vnd.noblenet-web": {
	source: "iana",
	extensions: [
		"nnw"
	]
},
	"application/vnd.nokia.catalogs": {
	source: "iana"
},
	"application/vnd.nokia.conml+wbxml": {
	source: "iana"
},
	"application/vnd.nokia.conml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.iptv.config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.isds-radio-presets": {
	source: "iana"
},
	"application/vnd.nokia.landmark+wbxml": {
	source: "iana"
},
	"application/vnd.nokia.landmark+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.landmarkcollection+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.n-gage.ac+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.n-gage.data": {
	source: "iana",
	extensions: [
		"ngdat"
	]
},
	"application/vnd.nokia.n-gage.symbian.install": {
	source: "iana",
	extensions: [
		"n-gage"
	]
},
	"application/vnd.nokia.ncd": {
	source: "iana"
},
	"application/vnd.nokia.pcd+wbxml": {
	source: "iana"
},
	"application/vnd.nokia.pcd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.radio-preset": {
	source: "iana",
	extensions: [
		"rpst"
	]
},
	"application/vnd.nokia.radio-presets": {
	source: "iana",
	extensions: [
		"rpss"
	]
},
	"application/vnd.novadigm.edm": {
	source: "iana",
	extensions: [
		"edm"
	]
},
	"application/vnd.novadigm.edx": {
	source: "iana",
	extensions: [
		"edx"
	]
},
	"application/vnd.novadigm.ext": {
	source: "iana",
	extensions: [
		"ext"
	]
},
	"application/vnd.ntt-local.content-share": {
	source: "iana"
},
	"application/vnd.ntt-local.file-transfer": {
	source: "iana"
},
	"application/vnd.ntt-local.ogw_remote-access": {
	source: "iana"
},
	"application/vnd.ntt-local.sip-ta_remote": {
	source: "iana"
},
	"application/vnd.ntt-local.sip-ta_tcp_stream": {
	source: "iana"
},
	"application/vnd.oasis.opendocument.chart": {
	source: "iana",
	extensions: [
		"odc"
	]
},
	"application/vnd.oasis.opendocument.chart-template": {
	source: "iana",
	extensions: [
		"otc"
	]
},
	"application/vnd.oasis.opendocument.database": {
	source: "iana",
	extensions: [
		"odb"
	]
},
	"application/vnd.oasis.opendocument.formula": {
	source: "iana",
	extensions: [
		"odf"
	]
},
	"application/vnd.oasis.opendocument.formula-template": {
	source: "iana",
	extensions: [
		"odft"
	]
},
	"application/vnd.oasis.opendocument.graphics": {
	source: "iana",
	compressible: false,
	extensions: [
		"odg"
	]
},
	"application/vnd.oasis.opendocument.graphics-template": {
	source: "iana",
	extensions: [
		"otg"
	]
},
	"application/vnd.oasis.opendocument.image": {
	source: "iana",
	extensions: [
		"odi"
	]
},
	"application/vnd.oasis.opendocument.image-template": {
	source: "iana",
	extensions: [
		"oti"
	]
},
	"application/vnd.oasis.opendocument.presentation": {
	source: "iana",
	compressible: false,
	extensions: [
		"odp"
	]
},
	"application/vnd.oasis.opendocument.presentation-template": {
	source: "iana",
	extensions: [
		"otp"
	]
},
	"application/vnd.oasis.opendocument.spreadsheet": {
	source: "iana",
	compressible: false,
	extensions: [
		"ods"
	]
},
	"application/vnd.oasis.opendocument.spreadsheet-template": {
	source: "iana",
	extensions: [
		"ots"
	]
},
	"application/vnd.oasis.opendocument.text": {
	source: "iana",
	compressible: false,
	extensions: [
		"odt"
	]
},
	"application/vnd.oasis.opendocument.text-master": {
	source: "iana",
	extensions: [
		"odm"
	]
},
	"application/vnd.oasis.opendocument.text-template": {
	source: "iana",
	extensions: [
		"ott"
	]
},
	"application/vnd.oasis.opendocument.text-web": {
	source: "iana",
	extensions: [
		"oth"
	]
},
	"application/vnd.obn": {
	source: "iana"
},
	"application/vnd.ocf+cbor": {
	source: "iana"
},
	"application/vnd.oftn.l10n+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.contentaccessdownload+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.contentaccessstreaming+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.cspg-hexbinary": {
	source: "iana"
},
	"application/vnd.oipf.dae.svg+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.dae.xhtml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.mippvcontrolmessage+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.pae.gem": {
	source: "iana"
},
	"application/vnd.oipf.spdiscovery+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.spdlist+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.ueprofile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.userprofile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.olpc-sugar": {
	source: "iana",
	extensions: [
		"xo"
	]
},
	"application/vnd.oma-scws-config": {
	source: "iana"
},
	"application/vnd.oma-scws-http-request": {
	source: "iana"
},
	"application/vnd.oma-scws-http-response": {
	source: "iana"
},
	"application/vnd.oma.bcast.associated-procedure-parameter+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.drm-trigger+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.imd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.ltkm": {
	source: "iana"
},
	"application/vnd.oma.bcast.notification+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.provisioningtrigger": {
	source: "iana"
},
	"application/vnd.oma.bcast.sgboot": {
	source: "iana"
},
	"application/vnd.oma.bcast.sgdd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.sgdu": {
	source: "iana"
},
	"application/vnd.oma.bcast.simple-symbol-container": {
	source: "iana"
},
	"application/vnd.oma.bcast.smartcard-trigger+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.sprov+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.stkm": {
	source: "iana"
},
	"application/vnd.oma.cab-address-book+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.cab-feature-handler+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.cab-pcc+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.cab-subs-invite+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.cab-user-prefs+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.dcd": {
	source: "iana"
},
	"application/vnd.oma.dcdc": {
	source: "iana"
},
	"application/vnd.oma.dd2+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"dd2"
	]
},
	"application/vnd.oma.drm.risd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.group-usage-list+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.lwm2m+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.lwm2m+tlv": {
	source: "iana"
},
	"application/vnd.oma.pal+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.detailed-progress-report+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.final-report+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.groups+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.invocation-descriptor+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.optimized-progress-report+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.push": {
	source: "iana"
},
	"application/vnd.oma.scidm.messages+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.xcap-directory+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.omads-email+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.omads-file+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.omads-folder+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.omaloc-supl-init": {
	source: "iana"
},
	"application/vnd.onepager": {
	source: "iana"
},
	"application/vnd.onepagertamp": {
	source: "iana"
},
	"application/vnd.onepagertamx": {
	source: "iana"
},
	"application/vnd.onepagertat": {
	source: "iana"
},
	"application/vnd.onepagertatp": {
	source: "iana"
},
	"application/vnd.onepagertatx": {
	source: "iana"
},
	"application/vnd.openblox.game+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openblox.game-binary": {
	source: "iana"
},
	"application/vnd.openeye.oeb": {
	source: "iana"
},
	"application/vnd.openofficeorg.extension": {
	source: "apache",
	extensions: [
		"oxt"
	]
},
	"application/vnd.openstreetmap.data+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.custom-properties+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawing+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.extended-properties+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": {
	source: "iana",
	compressible: false,
	extensions: [
		"pptx"
	]
},
	"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slide": {
	source: "iana",
	extensions: [
		"sldx"
	]
},
	"application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
	source: "iana",
	extensions: [
		"ppsx"
	]
},
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.template": {
	source: "iana",
	extensions: [
		"potx"
	]
},
	"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
	source: "iana",
	compressible: false,
	extensions: [
		"xlsx"
	]
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
	source: "iana",
	extensions: [
		"xltx"
	]
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.theme+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.themeoverride+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.vmldrawing": {
	source: "iana"
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
	source: "iana",
	compressible: false,
	extensions: [
		"docx"
	]
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
	source: "iana",
	extensions: [
		"dotx"
	]
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-package.core-properties+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-package.relationships+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oracle.resource+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.orange.indata": {
	source: "iana"
},
	"application/vnd.osa.netdeploy": {
	source: "iana"
},
	"application/vnd.osgeo.mapguide.package": {
	source: "iana",
	extensions: [
		"mgp"
	]
},
	"application/vnd.osgi.bundle": {
	source: "iana"
},
	"application/vnd.osgi.dp": {
	source: "iana",
	extensions: [
		"dp"
	]
},
	"application/vnd.osgi.subsystem": {
	source: "iana",
	extensions: [
		"esa"
	]
},
	"application/vnd.otps.ct-kip+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oxli.countgraph": {
	source: "iana"
},
	"application/vnd.pagerduty+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.palm": {
	source: "iana",
	extensions: [
		"pdb",
		"pqa",
		"oprc"
	]
},
	"application/vnd.panoply": {
	source: "iana"
},
	"application/vnd.paos.xml": {
	source: "iana"
},
	"application/vnd.patentdive": {
	source: "iana"
},
	"application/vnd.patientecommsdoc": {
	source: "iana"
},
	"application/vnd.pawaafile": {
	source: "iana",
	extensions: [
		"paw"
	]
},
	"application/vnd.pcos": {
	source: "iana"
},
	"application/vnd.pg.format": {
	source: "iana",
	extensions: [
		"str"
	]
},
	"application/vnd.pg.osasli": {
	source: "iana",
	extensions: [
		"ei6"
	]
},
	"application/vnd.piaccess.application-licence": {
	source: "iana"
},
	"application/vnd.picsel": {
	source: "iana",
	extensions: [
		"efif"
	]
},
	"application/vnd.pmi.widget": {
	source: "iana",
	extensions: [
		"wg"
	]
},
	"application/vnd.poc.group-advertisement+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.pocketlearn": {
	source: "iana",
	extensions: [
		"plf"
	]
},
	"application/vnd.powerbuilder6": {
	source: "iana",
	extensions: [
		"pbd"
	]
},
	"application/vnd.powerbuilder6-s": {
	source: "iana"
},
	"application/vnd.powerbuilder7": {
	source: "iana"
},
	"application/vnd.powerbuilder7-s": {
	source: "iana"
},
	"application/vnd.powerbuilder75": {
	source: "iana"
},
	"application/vnd.powerbuilder75-s": {
	source: "iana"
},
	"application/vnd.preminet": {
	source: "iana"
},
	"application/vnd.previewsystems.box": {
	source: "iana",
	extensions: [
		"box"
	]
},
	"application/vnd.proteus.magazine": {
	source: "iana",
	extensions: [
		"mgz"
	]
},
	"application/vnd.psfs": {
	source: "iana"
},
	"application/vnd.publishare-delta-tree": {
	source: "iana",
	extensions: [
		"qps"
	]
},
	"application/vnd.pvi.ptid1": {
	source: "iana",
	extensions: [
		"ptid"
	]
},
	"application/vnd.pwg-multiplexed": {
	source: "iana"
},
	"application/vnd.pwg-xhtml-print+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.qualcomm.brew-app-res": {
	source: "iana"
},
	"application/vnd.quarantainenet": {
	source: "iana"
},
	"application/vnd.quark.quarkxpress": {
	source: "iana",
	extensions: [
		"qxd",
		"qxt",
		"qwd",
		"qwt",
		"qxl",
		"qxb"
	]
},
	"application/vnd.quobject-quoxdocument": {
	source: "iana"
},
	"application/vnd.radisys.moml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit-conf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit-conn+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit-dialog+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit-stream+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-conf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-base+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-fax-detect+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-group+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-speech+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-transform+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.rainstor.data": {
	source: "iana"
},
	"application/vnd.rapid": {
	source: "iana"
},
	"application/vnd.rar": {
	source: "iana"
},
	"application/vnd.realvnc.bed": {
	source: "iana",
	extensions: [
		"bed"
	]
},
	"application/vnd.recordare.musicxml": {
	source: "iana",
	extensions: [
		"mxl"
	]
},
	"application/vnd.recordare.musicxml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"musicxml"
	]
},
	"application/vnd.renlearn.rlprint": {
	source: "iana"
},
	"application/vnd.restful+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.rig.cryptonote": {
	source: "iana",
	extensions: [
		"cryptonote"
	]
},
	"application/vnd.rim.cod": {
	source: "apache",
	extensions: [
		"cod"
	]
},
	"application/vnd.rn-realmedia": {
	source: "apache",
	extensions: [
		"rm"
	]
},
	"application/vnd.rn-realmedia-vbr": {
	source: "apache",
	extensions: [
		"rmvb"
	]
},
	"application/vnd.route66.link66+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"link66"
	]
},
	"application/vnd.rs-274x": {
	source: "iana"
},
	"application/vnd.ruckus.download": {
	source: "iana"
},
	"application/vnd.s3sms": {
	source: "iana"
},
	"application/vnd.sailingtracker.track": {
	source: "iana",
	extensions: [
		"st"
	]
},
	"application/vnd.sbm.cid": {
	source: "iana"
},
	"application/vnd.sbm.mid2": {
	source: "iana"
},
	"application/vnd.scribus": {
	source: "iana"
},
	"application/vnd.sealed.3df": {
	source: "iana"
},
	"application/vnd.sealed.csf": {
	source: "iana"
},
	"application/vnd.sealed.doc": {
	source: "iana"
},
	"application/vnd.sealed.eml": {
	source: "iana"
},
	"application/vnd.sealed.mht": {
	source: "iana"
},
	"application/vnd.sealed.net": {
	source: "iana"
},
	"application/vnd.sealed.ppt": {
	source: "iana"
},
	"application/vnd.sealed.tiff": {
	source: "iana"
},
	"application/vnd.sealed.xls": {
	source: "iana"
},
	"application/vnd.sealedmedia.softseal.html": {
	source: "iana"
},
	"application/vnd.sealedmedia.softseal.pdf": {
	source: "iana"
},
	"application/vnd.seemail": {
	source: "iana",
	extensions: [
		"see"
	]
},
	"application/vnd.sema": {
	source: "iana",
	extensions: [
		"sema"
	]
},
	"application/vnd.semd": {
	source: "iana",
	extensions: [
		"semd"
	]
},
	"application/vnd.semf": {
	source: "iana",
	extensions: [
		"semf"
	]
},
	"application/vnd.shana.informed.formdata": {
	source: "iana",
	extensions: [
		"ifm"
	]
},
	"application/vnd.shana.informed.formtemplate": {
	source: "iana",
	extensions: [
		"itp"
	]
},
	"application/vnd.shana.informed.interchange": {
	source: "iana",
	extensions: [
		"iif"
	]
},
	"application/vnd.shana.informed.package": {
	source: "iana",
	extensions: [
		"ipk"
	]
},
	"application/vnd.shootproof+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.sigrok.session": {
	source: "iana"
},
	"application/vnd.simtech-mindmapper": {
	source: "iana",
	extensions: [
		"twd",
		"twds"
	]
},
	"application/vnd.siren+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.smaf": {
	source: "iana",
	extensions: [
		"mmf"
	]
},
	"application/vnd.smart.notebook": {
	source: "iana"
},
	"application/vnd.smart.teacher": {
	source: "iana",
	extensions: [
		"teacher"
	]
},
	"application/vnd.software602.filler.form+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.software602.filler.form-xml-zip": {
	source: "iana"
},
	"application/vnd.solent.sdkm+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sdkm",
		"sdkd"
	]
},
	"application/vnd.spotfire.dxp": {
	source: "iana",
	extensions: [
		"dxp"
	]
},
	"application/vnd.spotfire.sfs": {
	source: "iana",
	extensions: [
		"sfs"
	]
},
	"application/vnd.sqlite3": {
	source: "iana"
},
	"application/vnd.sss-cod": {
	source: "iana"
},
	"application/vnd.sss-dtf": {
	source: "iana"
},
	"application/vnd.sss-ntf": {
	source: "iana"
},
	"application/vnd.stardivision.calc": {
	source: "apache",
	extensions: [
		"sdc"
	]
},
	"application/vnd.stardivision.draw": {
	source: "apache",
	extensions: [
		"sda"
	]
},
	"application/vnd.stardivision.impress": {
	source: "apache",
	extensions: [
		"sdd"
	]
},
	"application/vnd.stardivision.math": {
	source: "apache",
	extensions: [
		"smf"
	]
},
	"application/vnd.stardivision.writer": {
	source: "apache",
	extensions: [
		"sdw",
		"vor"
	]
},
	"application/vnd.stardivision.writer-global": {
	source: "apache",
	extensions: [
		"sgl"
	]
},
	"application/vnd.stepmania.package": {
	source: "iana",
	extensions: [
		"smzip"
	]
},
	"application/vnd.stepmania.stepchart": {
	source: "iana",
	extensions: [
		"sm"
	]
},
	"application/vnd.street-stream": {
	source: "iana"
},
	"application/vnd.sun.wadl+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wadl"
	]
},
	"application/vnd.sun.xml.calc": {
	source: "apache",
	extensions: [
		"sxc"
	]
},
	"application/vnd.sun.xml.calc.template": {
	source: "apache",
	extensions: [
		"stc"
	]
},
	"application/vnd.sun.xml.draw": {
	source: "apache",
	extensions: [
		"sxd"
	]
},
	"application/vnd.sun.xml.draw.template": {
	source: "apache",
	extensions: [
		"std"
	]
},
	"application/vnd.sun.xml.impress": {
	source: "apache",
	extensions: [
		"sxi"
	]
},
	"application/vnd.sun.xml.impress.template": {
	source: "apache",
	extensions: [
		"sti"
	]
},
	"application/vnd.sun.xml.math": {
	source: "apache",
	extensions: [
		"sxm"
	]
},
	"application/vnd.sun.xml.writer": {
	source: "apache",
	extensions: [
		"sxw"
	]
},
	"application/vnd.sun.xml.writer.global": {
	source: "apache",
	extensions: [
		"sxg"
	]
},
	"application/vnd.sun.xml.writer.template": {
	source: "apache",
	extensions: [
		"stw"
	]
},
	"application/vnd.sus-calendar": {
	source: "iana",
	extensions: [
		"sus",
		"susp"
	]
},
	"application/vnd.svd": {
	source: "iana",
	extensions: [
		"svd"
	]
},
	"application/vnd.swiftview-ics": {
	source: "iana"
},
	"application/vnd.symbian.install": {
	source: "apache",
	extensions: [
		"sis",
		"sisx"
	]
},
	"application/vnd.syncml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xsm"
	]
},
	"application/vnd.syncml.dm+wbxml": {
	source: "iana",
	extensions: [
		"bdm"
	]
},
	"application/vnd.syncml.dm+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xdm"
	]
},
	"application/vnd.syncml.dm.notification": {
	source: "iana"
},
	"application/vnd.syncml.dmddf+wbxml": {
	source: "iana"
},
	"application/vnd.syncml.dmddf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.syncml.dmtnds+wbxml": {
	source: "iana"
},
	"application/vnd.syncml.dmtnds+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.syncml.ds.notification": {
	source: "iana"
},
	"application/vnd.tableschema+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.tao.intent-module-archive": {
	source: "iana",
	extensions: [
		"tao"
	]
},
	"application/vnd.tcpdump.pcap": {
	source: "iana",
	extensions: [
		"pcap",
		"cap",
		"dmp"
	]
},
	"application/vnd.think-cell.ppttc+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.tmd.mediaflex.api+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.tml": {
	source: "iana"
},
	"application/vnd.tmobile-livetv": {
	source: "iana",
	extensions: [
		"tmo"
	]
},
	"application/vnd.tri.onesource": {
	source: "iana"
},
	"application/vnd.trid.tpt": {
	source: "iana",
	extensions: [
		"tpt"
	]
},
	"application/vnd.triscape.mxs": {
	source: "iana",
	extensions: [
		"mxs"
	]
},
	"application/vnd.trueapp": {
	source: "iana",
	extensions: [
		"tra"
	]
},
	"application/vnd.truedoc": {
	source: "iana"
},
	"application/vnd.ubisoft.webplayer": {
	source: "iana"
},
	"application/vnd.ufdl": {
	source: "iana",
	extensions: [
		"ufd",
		"ufdl"
	]
},
	"application/vnd.uiq.theme": {
	source: "iana",
	extensions: [
		"utz"
	]
},
	"application/vnd.umajin": {
	source: "iana",
	extensions: [
		"umj"
	]
},
	"application/vnd.unity": {
	source: "iana",
	extensions: [
		"unityweb"
	]
},
	"application/vnd.uoml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"uoml"
	]
},
	"application/vnd.uplanet.alert": {
	source: "iana"
},
	"application/vnd.uplanet.alert-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.bearer-choice": {
	source: "iana"
},
	"application/vnd.uplanet.bearer-choice-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.cacheop": {
	source: "iana"
},
	"application/vnd.uplanet.cacheop-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.channel": {
	source: "iana"
},
	"application/vnd.uplanet.channel-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.list": {
	source: "iana"
},
	"application/vnd.uplanet.list-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.listcmd": {
	source: "iana"
},
	"application/vnd.uplanet.listcmd-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.signal": {
	source: "iana"
},
	"application/vnd.uri-map": {
	source: "iana"
},
	"application/vnd.valve.source.material": {
	source: "iana"
},
	"application/vnd.vcx": {
	source: "iana",
	extensions: [
		"vcx"
	]
},
	"application/vnd.vd-study": {
	source: "iana"
},
	"application/vnd.vectorworks": {
	source: "iana"
},
	"application/vnd.vel+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.verimatrix.vcas": {
	source: "iana"
},
	"application/vnd.veryant.thin": {
	source: "iana"
},
	"application/vnd.vidsoft.vidconference": {
	source: "iana"
},
	"application/vnd.visio": {
	source: "iana",
	extensions: [
		"vsd",
		"vst",
		"vss",
		"vsw"
	]
},
	"application/vnd.visionary": {
	source: "iana",
	extensions: [
		"vis"
	]
},
	"application/vnd.vividence.scriptfile": {
	source: "iana"
},
	"application/vnd.vsf": {
	source: "iana",
	extensions: [
		"vsf"
	]
},
	"application/vnd.wap.sic": {
	source: "iana"
},
	"application/vnd.wap.slc": {
	source: "iana"
},
	"application/vnd.wap.wbxml": {
	source: "iana",
	extensions: [
		"wbxml"
	]
},
	"application/vnd.wap.wmlc": {
	source: "iana",
	extensions: [
		"wmlc"
	]
},
	"application/vnd.wap.wmlscriptc": {
	source: "iana",
	extensions: [
		"wmlsc"
	]
},
	"application/vnd.webturbo": {
	source: "iana",
	extensions: [
		"wtb"
	]
},
	"application/vnd.wfa.p2p": {
	source: "iana"
},
	"application/vnd.wfa.wsc": {
	source: "iana"
},
	"application/vnd.windows.devicepairing": {
	source: "iana"
},
	"application/vnd.wmc": {
	source: "iana"
},
	"application/vnd.wmf.bootstrap": {
	source: "iana"
},
	"application/vnd.wolfram.mathematica": {
	source: "iana"
},
	"application/vnd.wolfram.mathematica.package": {
	source: "iana"
},
	"application/vnd.wolfram.player": {
	source: "iana",
	extensions: [
		"nbp"
	]
},
	"application/vnd.wordperfect": {
	source: "iana",
	extensions: [
		"wpd"
	]
},
	"application/vnd.wqd": {
	source: "iana",
	extensions: [
		"wqd"
	]
},
	"application/vnd.wrq-hp3000-labelled": {
	source: "iana"
},
	"application/vnd.wt.stf": {
	source: "iana",
	extensions: [
		"stf"
	]
},
	"application/vnd.wv.csp+wbxml": {
	source: "iana"
},
	"application/vnd.wv.csp+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.wv.ssp+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.xacml+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.xara": {
	source: "iana",
	extensions: [
		"xar"
	]
},
	"application/vnd.xfdl": {
	source: "iana",
	extensions: [
		"xfdl"
	]
},
	"application/vnd.xfdl.webform": {
	source: "iana"
},
	"application/vnd.xmi+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.xmpie.cpkg": {
	source: "iana"
},
	"application/vnd.xmpie.dpkg": {
	source: "iana"
},
	"application/vnd.xmpie.plan": {
	source: "iana"
},
	"application/vnd.xmpie.ppkg": {
	source: "iana"
},
	"application/vnd.xmpie.xlim": {
	source: "iana"
},
	"application/vnd.yamaha.hv-dic": {
	source: "iana",
	extensions: [
		"hvd"
	]
},
	"application/vnd.yamaha.hv-script": {
	source: "iana",
	extensions: [
		"hvs"
	]
},
	"application/vnd.yamaha.hv-voice": {
	source: "iana",
	extensions: [
		"hvp"
	]
},
	"application/vnd.yamaha.openscoreformat": {
	source: "iana",
	extensions: [
		"osf"
	]
},
	"application/vnd.yamaha.openscoreformat.osfpvg+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"osfpvg"
	]
},
	"application/vnd.yamaha.remote-setup": {
	source: "iana"
},
	"application/vnd.yamaha.smaf-audio": {
	source: "iana",
	extensions: [
		"saf"
	]
},
	"application/vnd.yamaha.smaf-phrase": {
	source: "iana",
	extensions: [
		"spf"
	]
},
	"application/vnd.yamaha.through-ngn": {
	source: "iana"
},
	"application/vnd.yamaha.tunnel-udpencap": {
	source: "iana"
},
	"application/vnd.yaoweme": {
	source: "iana"
},
	"application/vnd.yellowriver-custom-menu": {
	source: "iana",
	extensions: [
		"cmp"
	]
},
	"application/vnd.youtube.yt": {
	source: "iana"
},
	"application/vnd.zul": {
	source: "iana",
	extensions: [
		"zir",
		"zirz"
	]
},
	"application/vnd.zzazz.deck+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"zaz"
	]
},
	"application/voicexml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"vxml"
	]
},
	"application/voucher-cms+json": {
	source: "iana",
	compressible: true
},
	"application/vq-rtcpxr": {
	source: "iana"
},
	"application/wasm": {
	compressible: true,
	extensions: [
		"wasm"
	]
},
	"application/watcherinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/webpush-options+json": {
	source: "iana",
	compressible: true
},
	"application/whoispp-query": {
	source: "iana"
},
	"application/whoispp-response": {
	source: "iana"
},
	"application/widget": {
	source: "iana",
	extensions: [
		"wgt"
	]
},
	"application/winhlp": {
	source: "apache",
	extensions: [
		"hlp"
	]
},
	"application/wita": {
	source: "iana"
},
	"application/wordperfect5.1": {
	source: "iana"
},
	"application/wsdl+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wsdl"
	]
},
	"application/wspolicy+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wspolicy"
	]
},
	"application/x-7z-compressed": {
	source: "apache",
	compressible: false,
	extensions: [
		"7z"
	]
},
	"application/x-abiword": {
	source: "apache",
	extensions: [
		"abw"
	]
},
	"application/x-ace-compressed": {
	source: "apache",
	extensions: [
		"ace"
	]
},
	"application/x-amf": {
	source: "apache"
},
	"application/x-apple-diskimage": {
	source: "apache",
	extensions: [
		"dmg"
	]
},
	"application/x-arj": {
	compressible: false,
	extensions: [
		"arj"
	]
},
	"application/x-authorware-bin": {
	source: "apache",
	extensions: [
		"aab",
		"x32",
		"u32",
		"vox"
	]
},
	"application/x-authorware-map": {
	source: "apache",
	extensions: [
		"aam"
	]
},
	"application/x-authorware-seg": {
	source: "apache",
	extensions: [
		"aas"
	]
},
	"application/x-bcpio": {
	source: "apache",
	extensions: [
		"bcpio"
	]
},
	"application/x-bdoc": {
	compressible: false,
	extensions: [
		"bdoc"
	]
},
	"application/x-bittorrent": {
	source: "apache",
	extensions: [
		"torrent"
	]
},
	"application/x-blorb": {
	source: "apache",
	extensions: [
		"blb",
		"blorb"
	]
},
	"application/x-bzip": {
	source: "apache",
	compressible: false,
	extensions: [
		"bz"
	]
},
	"application/x-bzip2": {
	source: "apache",
	compressible: false,
	extensions: [
		"bz2",
		"boz"
	]
},
	"application/x-cbr": {
	source: "apache",
	extensions: [
		"cbr",
		"cba",
		"cbt",
		"cbz",
		"cb7"
	]
},
	"application/x-cdlink": {
	source: "apache",
	extensions: [
		"vcd"
	]
},
	"application/x-cfs-compressed": {
	source: "apache",
	extensions: [
		"cfs"
	]
},
	"application/x-chat": {
	source: "apache",
	extensions: [
		"chat"
	]
},
	"application/x-chess-pgn": {
	source: "apache",
	extensions: [
		"pgn"
	]
},
	"application/x-chrome-extension": {
	extensions: [
		"crx"
	]
},
	"application/x-cocoa": {
	source: "nginx",
	extensions: [
		"cco"
	]
},
	"application/x-compress": {
	source: "apache"
},
	"application/x-conference": {
	source: "apache",
	extensions: [
		"nsc"
	]
},
	"application/x-cpio": {
	source: "apache",
	extensions: [
		"cpio"
	]
},
	"application/x-csh": {
	source: "apache",
	extensions: [
		"csh"
	]
},
	"application/x-deb": {
	compressible: false
},
	"application/x-debian-package": {
	source: "apache",
	extensions: [
		"deb",
		"udeb"
	]
},
	"application/x-dgc-compressed": {
	source: "apache",
	extensions: [
		"dgc"
	]
},
	"application/x-director": {
	source: "apache",
	extensions: [
		"dir",
		"dcr",
		"dxr",
		"cst",
		"cct",
		"cxt",
		"w3d",
		"fgd",
		"swa"
	]
},
	"application/x-doom": {
	source: "apache",
	extensions: [
		"wad"
	]
},
	"application/x-dtbncx+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"ncx"
	]
},
	"application/x-dtbook+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"dtb"
	]
},
	"application/x-dtbresource+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"res"
	]
},
	"application/x-dvi": {
	source: "apache",
	compressible: false,
	extensions: [
		"dvi"
	]
},
	"application/x-envoy": {
	source: "apache",
	extensions: [
		"evy"
	]
},
	"application/x-eva": {
	source: "apache",
	extensions: [
		"eva"
	]
},
	"application/x-font-bdf": {
	source: "apache",
	extensions: [
		"bdf"
	]
},
	"application/x-font-dos": {
	source: "apache"
},
	"application/x-font-framemaker": {
	source: "apache"
},
	"application/x-font-ghostscript": {
	source: "apache",
	extensions: [
		"gsf"
	]
},
	"application/x-font-libgrx": {
	source: "apache"
},
	"application/x-font-linux-psf": {
	source: "apache",
	extensions: [
		"psf"
	]
},
	"application/x-font-pcf": {
	source: "apache",
	extensions: [
		"pcf"
	]
},
	"application/x-font-snf": {
	source: "apache",
	extensions: [
		"snf"
	]
},
	"application/x-font-speedo": {
	source: "apache"
},
	"application/x-font-sunos-news": {
	source: "apache"
},
	"application/x-font-type1": {
	source: "apache",
	extensions: [
		"pfa",
		"pfb",
		"pfm",
		"afm"
	]
},
	"application/x-font-vfont": {
	source: "apache"
},
	"application/x-freearc": {
	source: "apache",
	extensions: [
		"arc"
	]
},
	"application/x-futuresplash": {
	source: "apache",
	extensions: [
		"spl"
	]
},
	"application/x-gca-compressed": {
	source: "apache",
	extensions: [
		"gca"
	]
},
	"application/x-glulx": {
	source: "apache",
	extensions: [
		"ulx"
	]
},
	"application/x-gnumeric": {
	source: "apache",
	extensions: [
		"gnumeric"
	]
},
	"application/x-gramps-xml": {
	source: "apache",
	extensions: [
		"gramps"
	]
},
	"application/x-gtar": {
	source: "apache",
	extensions: [
		"gtar"
	]
},
	"application/x-gzip": {
	source: "apache"
},
	"application/x-hdf": {
	source: "apache",
	extensions: [
		"hdf"
	]
},
	"application/x-httpd-php": {
	compressible: true,
	extensions: [
		"php"
	]
},
	"application/x-install-instructions": {
	source: "apache",
	extensions: [
		"install"
	]
},
	"application/x-iso9660-image": {
	source: "apache",
	extensions: [
		"iso"
	]
},
	"application/x-java-archive-diff": {
	source: "nginx",
	extensions: [
		"jardiff"
	]
},
	"application/x-java-jnlp-file": {
	source: "apache",
	compressible: false,
	extensions: [
		"jnlp"
	]
},
	"application/x-javascript": {
	compressible: true
},
	"application/x-latex": {
	source: "apache",
	compressible: false,
	extensions: [
		"latex"
	]
},
	"application/x-lua-bytecode": {
	extensions: [
		"luac"
	]
},
	"application/x-lzh-compressed": {
	source: "apache",
	extensions: [
		"lzh",
		"lha"
	]
},
	"application/x-makeself": {
	source: "nginx",
	extensions: [
		"run"
	]
},
	"application/x-mie": {
	source: "apache",
	extensions: [
		"mie"
	]
},
	"application/x-mobipocket-ebook": {
	source: "apache",
	extensions: [
		"prc",
		"mobi"
	]
},
	"application/x-mpegurl": {
	compressible: false
},
	"application/x-ms-application": {
	source: "apache",
	extensions: [
		"application"
	]
},
	"application/x-ms-shortcut": {
	source: "apache",
	extensions: [
		"lnk"
	]
},
	"application/x-ms-wmd": {
	source: "apache",
	extensions: [
		"wmd"
	]
},
	"application/x-ms-wmz": {
	source: "apache",
	extensions: [
		"wmz"
	]
},
	"application/x-ms-xbap": {
	source: "apache",
	extensions: [
		"xbap"
	]
},
	"application/x-msaccess": {
	source: "apache",
	extensions: [
		"mdb"
	]
},
	"application/x-msbinder": {
	source: "apache",
	extensions: [
		"obd"
	]
},
	"application/x-mscardfile": {
	source: "apache",
	extensions: [
		"crd"
	]
},
	"application/x-msclip": {
	source: "apache",
	extensions: [
		"clp"
	]
},
	"application/x-msdos-program": {
	extensions: [
		"exe"
	]
},
	"application/x-msdownload": {
	source: "apache",
	extensions: [
		"exe",
		"dll",
		"com",
		"bat",
		"msi"
	]
},
	"application/x-msmediaview": {
	source: "apache",
	extensions: [
		"mvb",
		"m13",
		"m14"
	]
},
	"application/x-msmetafile": {
	source: "apache",
	extensions: [
		"wmf",
		"wmz",
		"emf",
		"emz"
	]
},
	"application/x-msmoney": {
	source: "apache",
	extensions: [
		"mny"
	]
},
	"application/x-mspublisher": {
	source: "apache",
	extensions: [
		"pub"
	]
},
	"application/x-msschedule": {
	source: "apache",
	extensions: [
		"scd"
	]
},
	"application/x-msterminal": {
	source: "apache",
	extensions: [
		"trm"
	]
},
	"application/x-mswrite": {
	source: "apache",
	extensions: [
		"wri"
	]
},
	"application/x-netcdf": {
	source: "apache",
	extensions: [
		"nc",
		"cdf"
	]
},
	"application/x-ns-proxy-autoconfig": {
	compressible: true,
	extensions: [
		"pac"
	]
},
	"application/x-nzb": {
	source: "apache",
	extensions: [
		"nzb"
	]
},
	"application/x-perl": {
	source: "nginx",
	extensions: [
		"pl",
		"pm"
	]
},
	"application/x-pilot": {
	source: "nginx",
	extensions: [
		"prc",
		"pdb"
	]
},
	"application/x-pkcs12": {
	source: "apache",
	compressible: false,
	extensions: [
		"p12",
		"pfx"
	]
},
	"application/x-pkcs7-certificates": {
	source: "apache",
	extensions: [
		"p7b",
		"spc"
	]
},
	"application/x-pkcs7-certreqresp": {
	source: "apache",
	extensions: [
		"p7r"
	]
},
	"application/x-rar-compressed": {
	source: "apache",
	compressible: false,
	extensions: [
		"rar"
	]
},
	"application/x-redhat-package-manager": {
	source: "nginx",
	extensions: [
		"rpm"
	]
},
	"application/x-research-info-systems": {
	source: "apache",
	extensions: [
		"ris"
	]
},
	"application/x-sea": {
	source: "nginx",
	extensions: [
		"sea"
	]
},
	"application/x-sh": {
	source: "apache",
	compressible: true,
	extensions: [
		"sh"
	]
},
	"application/x-shar": {
	source: "apache",
	extensions: [
		"shar"
	]
},
	"application/x-shockwave-flash": {
	source: "apache",
	compressible: false,
	extensions: [
		"swf"
	]
},
	"application/x-silverlight-app": {
	source: "apache",
	extensions: [
		"xap"
	]
},
	"application/x-sql": {
	source: "apache",
	extensions: [
		"sql"
	]
},
	"application/x-stuffit": {
	source: "apache",
	compressible: false,
	extensions: [
		"sit"
	]
},
	"application/x-stuffitx": {
	source: "apache",
	extensions: [
		"sitx"
	]
},
	"application/x-subrip": {
	source: "apache",
	extensions: [
		"srt"
	]
},
	"application/x-sv4cpio": {
	source: "apache",
	extensions: [
		"sv4cpio"
	]
},
	"application/x-sv4crc": {
	source: "apache",
	extensions: [
		"sv4crc"
	]
},
	"application/x-t3vm-image": {
	source: "apache",
	extensions: [
		"t3"
	]
},
	"application/x-tads": {
	source: "apache",
	extensions: [
		"gam"
	]
},
	"application/x-tar": {
	source: "apache",
	compressible: true,
	extensions: [
		"tar"
	]
},
	"application/x-tcl": {
	source: "apache",
	extensions: [
		"tcl",
		"tk"
	]
},
	"application/x-tex": {
	source: "apache",
	extensions: [
		"tex"
	]
},
	"application/x-tex-tfm": {
	source: "apache",
	extensions: [
		"tfm"
	]
},
	"application/x-texinfo": {
	source: "apache",
	extensions: [
		"texinfo",
		"texi"
	]
},
	"application/x-tgif": {
	source: "apache",
	extensions: [
		"obj"
	]
},
	"application/x-ustar": {
	source: "apache",
	extensions: [
		"ustar"
	]
},
	"application/x-virtualbox-hdd": {
	compressible: true,
	extensions: [
		"hdd"
	]
},
	"application/x-virtualbox-ova": {
	compressible: true,
	extensions: [
		"ova"
	]
},
	"application/x-virtualbox-ovf": {
	compressible: true,
	extensions: [
		"ovf"
	]
},
	"application/x-virtualbox-vbox": {
	compressible: true,
	extensions: [
		"vbox"
	]
},
	"application/x-virtualbox-vbox-extpack": {
	compressible: false,
	extensions: [
		"vbox-extpack"
	]
},
	"application/x-virtualbox-vdi": {
	compressible: true,
	extensions: [
		"vdi"
	]
},
	"application/x-virtualbox-vhd": {
	compressible: true,
	extensions: [
		"vhd"
	]
},
	"application/x-virtualbox-vmdk": {
	compressible: true,
	extensions: [
		"vmdk"
	]
},
	"application/x-wais-source": {
	source: "apache",
	extensions: [
		"src"
	]
},
	"application/x-web-app-manifest+json": {
	compressible: true,
	extensions: [
		"webapp"
	]
},
	"application/x-www-form-urlencoded": {
	source: "iana",
	compressible: true
},
	"application/x-x509-ca-cert": {
	source: "apache",
	extensions: [
		"der",
		"crt",
		"pem"
	]
},
	"application/x-xfig": {
	source: "apache",
	extensions: [
		"fig"
	]
},
	"application/x-xliff+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"xlf"
	]
},
	"application/x-xpinstall": {
	source: "apache",
	compressible: false,
	extensions: [
		"xpi"
	]
},
	"application/x-xz": {
	source: "apache",
	extensions: [
		"xz"
	]
},
	"application/x-zmachine": {
	source: "apache",
	extensions: [
		"z1",
		"z2",
		"z3",
		"z4",
		"z5",
		"z6",
		"z7",
		"z8"
	]
},
	"application/x400-bp": {
	source: "iana"
},
	"application/xacml+xml": {
	source: "iana",
	compressible: true
},
	"application/xaml+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"xaml"
	]
},
	"application/xcap-att+xml": {
	source: "iana",
	compressible: true
},
	"application/xcap-caps+xml": {
	source: "iana",
	compressible: true
},
	"application/xcap-diff+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xdf"
	]
},
	"application/xcap-el+xml": {
	source: "iana",
	compressible: true
},
	"application/xcap-error+xml": {
	source: "iana",
	compressible: true
},
	"application/xcap-ns+xml": {
	source: "iana",
	compressible: true
},
	"application/xcon-conference-info+xml": {
	source: "iana",
	compressible: true
},
	"application/xcon-conference-info-diff+xml": {
	source: "iana",
	compressible: true
},
	"application/xenc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xenc"
	]
},
	"application/xhtml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xhtml",
		"xht"
	]
},
	"application/xhtml-voice+xml": {
	source: "apache",
	compressible: true
},
	"application/xliff+xml": {
	source: "iana",
	compressible: true
},
	"application/xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xml",
		"xsl",
		"xsd",
		"rng"
	]
},
	"application/xml-dtd": {
	source: "iana",
	compressible: true,
	extensions: [
		"dtd"
	]
},
	"application/xml-external-parsed-entity": {
	source: "iana"
},
	"application/xml-patch+xml": {
	source: "iana",
	compressible: true
},
	"application/xmpp+xml": {
	source: "iana",
	compressible: true
},
	"application/xop+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xop"
	]
},
	"application/xproc+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"xpl"
	]
},
	"application/xslt+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xslt"
	]
},
	"application/xspf+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"xspf"
	]
},
	"application/xv+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mxml",
		"xhvml",
		"xvml",
		"xvm"
	]
},
	"application/yang": {
	source: "iana",
	extensions: [
		"yang"
	]
},
	"application/yang-data+json": {
	source: "iana",
	compressible: true
},
	"application/yang-data+xml": {
	source: "iana",
	compressible: true
},
	"application/yang-patch+json": {
	source: "iana",
	compressible: true
},
	"application/yang-patch+xml": {
	source: "iana",
	compressible: true
},
	"application/yin+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"yin"
	]
},
	"application/zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"zip"
	]
},
	"application/zlib": {
	source: "iana"
},
	"application/zstd": {
	source: "iana"
},
	"audio/1d-interleaved-parityfec": {
	source: "iana"
},
	"audio/32kadpcm": {
	source: "iana"
},
	"audio/3gpp": {
	source: "iana",
	compressible: false,
	extensions: [
		"3gpp"
	]
},
	"audio/3gpp2": {
	source: "iana"
},
	"audio/aac": {
	source: "iana"
},
	"audio/ac3": {
	source: "iana"
},
	"audio/adpcm": {
	source: "apache",
	extensions: [
		"adp"
	]
},
	"audio/amr": {
	source: "iana"
},
	"audio/amr-wb": {
	source: "iana"
},
	"audio/amr-wb+": {
	source: "iana"
},
	"audio/aptx": {
	source: "iana"
},
	"audio/asc": {
	source: "iana"
},
	"audio/atrac-advanced-lossless": {
	source: "iana"
},
	"audio/atrac-x": {
	source: "iana"
},
	"audio/atrac3": {
	source: "iana"
},
	"audio/basic": {
	source: "iana",
	compressible: false,
	extensions: [
		"au",
		"snd"
	]
},
	"audio/bv16": {
	source: "iana"
},
	"audio/bv32": {
	source: "iana"
},
	"audio/clearmode": {
	source: "iana"
},
	"audio/cn": {
	source: "iana"
},
	"audio/dat12": {
	source: "iana"
},
	"audio/dls": {
	source: "iana"
},
	"audio/dsr-es201108": {
	source: "iana"
},
	"audio/dsr-es202050": {
	source: "iana"
},
	"audio/dsr-es202211": {
	source: "iana"
},
	"audio/dsr-es202212": {
	source: "iana"
},
	"audio/dv": {
	source: "iana"
},
	"audio/dvi4": {
	source: "iana"
},
	"audio/eac3": {
	source: "iana"
},
	"audio/encaprtp": {
	source: "iana"
},
	"audio/evrc": {
	source: "iana"
},
	"audio/evrc-qcp": {
	source: "iana"
},
	"audio/evrc0": {
	source: "iana"
},
	"audio/evrc1": {
	source: "iana"
},
	"audio/evrcb": {
	source: "iana"
},
	"audio/evrcb0": {
	source: "iana"
},
	"audio/evrcb1": {
	source: "iana"
},
	"audio/evrcnw": {
	source: "iana"
},
	"audio/evrcnw0": {
	source: "iana"
},
	"audio/evrcnw1": {
	source: "iana"
},
	"audio/evrcwb": {
	source: "iana"
},
	"audio/evrcwb0": {
	source: "iana"
},
	"audio/evrcwb1": {
	source: "iana"
},
	"audio/evs": {
	source: "iana"
},
	"audio/fwdred": {
	source: "iana"
},
	"audio/g711-0": {
	source: "iana"
},
	"audio/g719": {
	source: "iana"
},
	"audio/g722": {
	source: "iana"
},
	"audio/g7221": {
	source: "iana"
},
	"audio/g723": {
	source: "iana"
},
	"audio/g726-16": {
	source: "iana"
},
	"audio/g726-24": {
	source: "iana"
},
	"audio/g726-32": {
	source: "iana"
},
	"audio/g726-40": {
	source: "iana"
},
	"audio/g728": {
	source: "iana"
},
	"audio/g729": {
	source: "iana"
},
	"audio/g7291": {
	source: "iana"
},
	"audio/g729d": {
	source: "iana"
},
	"audio/g729e": {
	source: "iana"
},
	"audio/gsm": {
	source: "iana"
},
	"audio/gsm-efr": {
	source: "iana"
},
	"audio/gsm-hr-08": {
	source: "iana"
},
	"audio/ilbc": {
	source: "iana"
},
	"audio/ip-mr_v2.5": {
	source: "iana"
},
	"audio/isac": {
	source: "apache"
},
	"audio/l16": {
	source: "iana"
},
	"audio/l20": {
	source: "iana"
},
	"audio/l24": {
	source: "iana",
	compressible: false
},
	"audio/l8": {
	source: "iana"
},
	"audio/lpc": {
	source: "iana"
},
	"audio/melp": {
	source: "iana"
},
	"audio/melp1200": {
	source: "iana"
},
	"audio/melp2400": {
	source: "iana"
},
	"audio/melp600": {
	source: "iana"
},
	"audio/midi": {
	source: "apache",
	extensions: [
		"mid",
		"midi",
		"kar",
		"rmi"
	]
},
	"audio/mobile-xmf": {
	source: "iana"
},
	"audio/mp3": {
	compressible: false,
	extensions: [
		"mp3"
	]
},
	"audio/mp4": {
	source: "iana",
	compressible: false,
	extensions: [
		"m4a",
		"mp4a"
	]
},
	"audio/mp4a-latm": {
	source: "iana"
},
	"audio/mpa": {
	source: "iana"
},
	"audio/mpa-robust": {
	source: "iana"
},
	"audio/mpeg": {
	source: "iana",
	compressible: false,
	extensions: [
		"mpga",
		"mp2",
		"mp2a",
		"mp3",
		"m2a",
		"m3a"
	]
},
	"audio/mpeg4-generic": {
	source: "iana"
},
	"audio/musepack": {
	source: "apache"
},
	"audio/ogg": {
	source: "iana",
	compressible: false,
	extensions: [
		"oga",
		"ogg",
		"spx"
	]
},
	"audio/opus": {
	source: "iana"
},
	"audio/parityfec": {
	source: "iana"
},
	"audio/pcma": {
	source: "iana"
},
	"audio/pcma-wb": {
	source: "iana"
},
	"audio/pcmu": {
	source: "iana"
},
	"audio/pcmu-wb": {
	source: "iana"
},
	"audio/prs.sid": {
	source: "iana"
},
	"audio/qcelp": {
	source: "iana"
},
	"audio/raptorfec": {
	source: "iana"
},
	"audio/red": {
	source: "iana"
},
	"audio/rtp-enc-aescm128": {
	source: "iana"
},
	"audio/rtp-midi": {
	source: "iana"
},
	"audio/rtploopback": {
	source: "iana"
},
	"audio/rtx": {
	source: "iana"
},
	"audio/s3m": {
	source: "apache",
	extensions: [
		"s3m"
	]
},
	"audio/silk": {
	source: "apache",
	extensions: [
		"sil"
	]
},
	"audio/smv": {
	source: "iana"
},
	"audio/smv-qcp": {
	source: "iana"
},
	"audio/smv0": {
	source: "iana"
},
	"audio/sp-midi": {
	source: "iana"
},
	"audio/speex": {
	source: "iana"
},
	"audio/t140c": {
	source: "iana"
},
	"audio/t38": {
	source: "iana"
},
	"audio/telephone-event": {
	source: "iana"
},
	"audio/tetra_acelp": {
	source: "iana"
},
	"audio/tone": {
	source: "iana"
},
	"audio/uemclip": {
	source: "iana"
},
	"audio/ulpfec": {
	source: "iana"
},
	"audio/usac": {
	source: "iana"
},
	"audio/vdvi": {
	source: "iana"
},
	"audio/vmr-wb": {
	source: "iana"
},
	"audio/vnd.3gpp.iufp": {
	source: "iana"
},
	"audio/vnd.4sb": {
	source: "iana"
},
	"audio/vnd.audiokoz": {
	source: "iana"
},
	"audio/vnd.celp": {
	source: "iana"
},
	"audio/vnd.cisco.nse": {
	source: "iana"
},
	"audio/vnd.cmles.radio-events": {
	source: "iana"
},
	"audio/vnd.cns.anp1": {
	source: "iana"
},
	"audio/vnd.cns.inf1": {
	source: "iana"
},
	"audio/vnd.dece.audio": {
	source: "iana",
	extensions: [
		"uva",
		"uvva"
	]
},
	"audio/vnd.digital-winds": {
	source: "iana",
	extensions: [
		"eol"
	]
},
	"audio/vnd.dlna.adts": {
	source: "iana"
},
	"audio/vnd.dolby.heaac.1": {
	source: "iana"
},
	"audio/vnd.dolby.heaac.2": {
	source: "iana"
},
	"audio/vnd.dolby.mlp": {
	source: "iana"
},
	"audio/vnd.dolby.mps": {
	source: "iana"
},
	"audio/vnd.dolby.pl2": {
	source: "iana"
},
	"audio/vnd.dolby.pl2x": {
	source: "iana"
},
	"audio/vnd.dolby.pl2z": {
	source: "iana"
},
	"audio/vnd.dolby.pulse.1": {
	source: "iana"
},
	"audio/vnd.dra": {
	source: "iana",
	extensions: [
		"dra"
	]
},
	"audio/vnd.dts": {
	source: "iana",
	extensions: [
		"dts"
	]
},
	"audio/vnd.dts.hd": {
	source: "iana",
	extensions: [
		"dtshd"
	]
},
	"audio/vnd.dts.uhd": {
	source: "iana"
},
	"audio/vnd.dvb.file": {
	source: "iana"
},
	"audio/vnd.everad.plj": {
	source: "iana"
},
	"audio/vnd.hns.audio": {
	source: "iana"
},
	"audio/vnd.lucent.voice": {
	source: "iana",
	extensions: [
		"lvp"
	]
},
	"audio/vnd.ms-playready.media.pya": {
	source: "iana",
	extensions: [
		"pya"
	]
},
	"audio/vnd.nokia.mobile-xmf": {
	source: "iana"
},
	"audio/vnd.nortel.vbk": {
	source: "iana"
},
	"audio/vnd.nuera.ecelp4800": {
	source: "iana",
	extensions: [
		"ecelp4800"
	]
},
	"audio/vnd.nuera.ecelp7470": {
	source: "iana",
	extensions: [
		"ecelp7470"
	]
},
	"audio/vnd.nuera.ecelp9600": {
	source: "iana",
	extensions: [
		"ecelp9600"
	]
},
	"audio/vnd.octel.sbc": {
	source: "iana"
},
	"audio/vnd.presonus.multitrack": {
	source: "iana"
},
	"audio/vnd.qcelp": {
	source: "iana"
},
	"audio/vnd.rhetorex.32kadpcm": {
	source: "iana"
},
	"audio/vnd.rip": {
	source: "iana",
	extensions: [
		"rip"
	]
},
	"audio/vnd.rn-realaudio": {
	compressible: false
},
	"audio/vnd.sealedmedia.softseal.mpeg": {
	source: "iana"
},
	"audio/vnd.vmx.cvsd": {
	source: "iana"
},
	"audio/vnd.wave": {
	compressible: false
},
	"audio/vorbis": {
	source: "iana",
	compressible: false
},
	"audio/vorbis-config": {
	source: "iana"
},
	"audio/wav": {
	compressible: false,
	extensions: [
		"wav"
	]
},
	"audio/wave": {
	compressible: false,
	extensions: [
		"wav"
	]
},
	"audio/webm": {
	source: "apache",
	compressible: false,
	extensions: [
		"weba"
	]
},
	"audio/x-aac": {
	source: "apache",
	compressible: false,
	extensions: [
		"aac"
	]
},
	"audio/x-aiff": {
	source: "apache",
	extensions: [
		"aif",
		"aiff",
		"aifc"
	]
},
	"audio/x-caf": {
	source: "apache",
	compressible: false,
	extensions: [
		"caf"
	]
},
	"audio/x-flac": {
	source: "apache",
	extensions: [
		"flac"
	]
},
	"audio/x-m4a": {
	source: "nginx",
	extensions: [
		"m4a"
	]
},
	"audio/x-matroska": {
	source: "apache",
	extensions: [
		"mka"
	]
},
	"audio/x-mpegurl": {
	source: "apache",
	extensions: [
		"m3u"
	]
},
	"audio/x-ms-wax": {
	source: "apache",
	extensions: [
		"wax"
	]
},
	"audio/x-ms-wma": {
	source: "apache",
	extensions: [
		"wma"
	]
},
	"audio/x-pn-realaudio": {
	source: "apache",
	extensions: [
		"ram",
		"ra"
	]
},
	"audio/x-pn-realaudio-plugin": {
	source: "apache",
	extensions: [
		"rmp"
	]
},
	"audio/x-realaudio": {
	source: "nginx",
	extensions: [
		"ra"
	]
},
	"audio/x-tta": {
	source: "apache"
},
	"audio/x-wav": {
	source: "apache",
	extensions: [
		"wav"
	]
},
	"audio/xm": {
	source: "apache",
	extensions: [
		"xm"
	]
},
	"chemical/x-cdx": {
	source: "apache",
	extensions: [
		"cdx"
	]
},
	"chemical/x-cif": {
	source: "apache",
	extensions: [
		"cif"
	]
},
	"chemical/x-cmdf": {
	source: "apache",
	extensions: [
		"cmdf"
	]
},
	"chemical/x-cml": {
	source: "apache",
	extensions: [
		"cml"
	]
},
	"chemical/x-csml": {
	source: "apache",
	extensions: [
		"csml"
	]
},
	"chemical/x-pdb": {
	source: "apache"
},
	"chemical/x-xyz": {
	source: "apache",
	extensions: [
		"xyz"
	]
},
	"font/collection": {
	source: "iana",
	extensions: [
		"ttc"
	]
},
	"font/otf": {
	source: "iana",
	compressible: true,
	extensions: [
		"otf"
	]
},
	"font/sfnt": {
	source: "iana"
},
	"font/ttf": {
	source: "iana",
	extensions: [
		"ttf"
	]
},
	"font/woff": {
	source: "iana",
	extensions: [
		"woff"
	]
},
	"font/woff2": {
	source: "iana",
	extensions: [
		"woff2"
	]
},
	"image/aces": {
	source: "iana",
	extensions: [
		"exr"
	]
},
	"image/apng": {
	compressible: false,
	extensions: [
		"apng"
	]
},
	"image/avci": {
	source: "iana"
},
	"image/avcs": {
	source: "iana"
},
	"image/bmp": {
	source: "iana",
	compressible: true,
	extensions: [
		"bmp"
	]
},
	"image/cgm": {
	source: "iana",
	extensions: [
		"cgm"
	]
},
	"image/dicom-rle": {
	source: "iana",
	extensions: [
		"drle"
	]
},
	"image/emf": {
	source: "iana",
	extensions: [
		"emf"
	]
},
	"image/fits": {
	source: "iana",
	extensions: [
		"fits"
	]
},
	"image/g3fax": {
	source: "iana",
	extensions: [
		"g3"
	]
},
	"image/gif": {
	source: "iana",
	compressible: false,
	extensions: [
		"gif"
	]
},
	"image/heic": {
	source: "iana",
	extensions: [
		"heic"
	]
},
	"image/heic-sequence": {
	source: "iana",
	extensions: [
		"heics"
	]
},
	"image/heif": {
	source: "iana",
	extensions: [
		"heif"
	]
},
	"image/heif-sequence": {
	source: "iana",
	extensions: [
		"heifs"
	]
},
	"image/ief": {
	source: "iana",
	extensions: [
		"ief"
	]
},
	"image/jls": {
	source: "iana",
	extensions: [
		"jls"
	]
},
	"image/jp2": {
	source: "iana",
	compressible: false,
	extensions: [
		"jp2",
		"jpg2"
	]
},
	"image/jpeg": {
	source: "iana",
	compressible: false,
	extensions: [
		"jpeg",
		"jpg",
		"jpe"
	]
},
	"image/jpm": {
	source: "iana",
	compressible: false,
	extensions: [
		"jpm"
	]
},
	"image/jpx": {
	source: "iana",
	compressible: false,
	extensions: [
		"jpx",
		"jpf"
	]
},
	"image/jxr": {
	source: "iana",
	extensions: [
		"jxr"
	]
},
	"image/ktx": {
	source: "iana",
	extensions: [
		"ktx"
	]
},
	"image/naplps": {
	source: "iana"
},
	"image/pjpeg": {
	compressible: false
},
	"image/png": {
	source: "iana",
	compressible: false,
	extensions: [
		"png"
	]
},
	"image/prs.btif": {
	source: "iana",
	extensions: [
		"btif"
	]
},
	"image/prs.pti": {
	source: "iana",
	extensions: [
		"pti"
	]
},
	"image/pwg-raster": {
	source: "iana"
},
	"image/sgi": {
	source: "apache",
	extensions: [
		"sgi"
	]
},
	"image/svg+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"svg",
		"svgz"
	]
},
	"image/t38": {
	source: "iana",
	extensions: [
		"t38"
	]
},
	"image/tiff": {
	source: "iana",
	compressible: false,
	extensions: [
		"tif",
		"tiff"
	]
},
	"image/tiff-fx": {
	source: "iana",
	extensions: [
		"tfx"
	]
},
	"image/vnd.adobe.photoshop": {
	source: "iana",
	compressible: true,
	extensions: [
		"psd"
	]
},
	"image/vnd.airzip.accelerator.azv": {
	source: "iana",
	extensions: [
		"azv"
	]
},
	"image/vnd.cns.inf2": {
	source: "iana"
},
	"image/vnd.dece.graphic": {
	source: "iana",
	extensions: [
		"uvi",
		"uvvi",
		"uvg",
		"uvvg"
	]
},
	"image/vnd.djvu": {
	source: "iana",
	extensions: [
		"djvu",
		"djv"
	]
},
	"image/vnd.dvb.subtitle": {
	source: "iana",
	extensions: [
		"sub"
	]
},
	"image/vnd.dwg": {
	source: "iana",
	extensions: [
		"dwg"
	]
},
	"image/vnd.dxf": {
	source: "iana",
	extensions: [
		"dxf"
	]
},
	"image/vnd.fastbidsheet": {
	source: "iana",
	extensions: [
		"fbs"
	]
},
	"image/vnd.fpx": {
	source: "iana",
	extensions: [
		"fpx"
	]
},
	"image/vnd.fst": {
	source: "iana",
	extensions: [
		"fst"
	]
},
	"image/vnd.fujixerox.edmics-mmr": {
	source: "iana",
	extensions: [
		"mmr"
	]
},
	"image/vnd.fujixerox.edmics-rlc": {
	source: "iana",
	extensions: [
		"rlc"
	]
},
	"image/vnd.globalgraphics.pgb": {
	source: "iana"
},
	"image/vnd.microsoft.icon": {
	source: "iana",
	extensions: [
		"ico"
	]
},
	"image/vnd.mix": {
	source: "iana"
},
	"image/vnd.mozilla.apng": {
	source: "iana"
},
	"image/vnd.ms-modi": {
	source: "iana",
	extensions: [
		"mdi"
	]
},
	"image/vnd.ms-photo": {
	source: "apache",
	extensions: [
		"wdp"
	]
},
	"image/vnd.net-fpx": {
	source: "iana",
	extensions: [
		"npx"
	]
},
	"image/vnd.radiance": {
	source: "iana"
},
	"image/vnd.sealed.png": {
	source: "iana"
},
	"image/vnd.sealedmedia.softseal.gif": {
	source: "iana"
},
	"image/vnd.sealedmedia.softseal.jpg": {
	source: "iana"
},
	"image/vnd.svf": {
	source: "iana"
},
	"image/vnd.tencent.tap": {
	source: "iana",
	extensions: [
		"tap"
	]
},
	"image/vnd.valve.source.texture": {
	source: "iana",
	extensions: [
		"vtf"
	]
},
	"image/vnd.wap.wbmp": {
	source: "iana",
	extensions: [
		"wbmp"
	]
},
	"image/vnd.xiff": {
	source: "iana",
	extensions: [
		"xif"
	]
},
	"image/vnd.zbrush.pcx": {
	source: "iana",
	extensions: [
		"pcx"
	]
},
	"image/webp": {
	source: "apache",
	extensions: [
		"webp"
	]
},
	"image/wmf": {
	source: "iana",
	extensions: [
		"wmf"
	]
},
	"image/x-3ds": {
	source: "apache",
	extensions: [
		"3ds"
	]
},
	"image/x-cmu-raster": {
	source: "apache",
	extensions: [
		"ras"
	]
},
	"image/x-cmx": {
	source: "apache",
	extensions: [
		"cmx"
	]
},
	"image/x-freehand": {
	source: "apache",
	extensions: [
		"fh",
		"fhc",
		"fh4",
		"fh5",
		"fh7"
	]
},
	"image/x-icon": {
	source: "apache",
	compressible: true,
	extensions: [
		"ico"
	]
},
	"image/x-jng": {
	source: "nginx",
	extensions: [
		"jng"
	]
},
	"image/x-mrsid-image": {
	source: "apache",
	extensions: [
		"sid"
	]
},
	"image/x-ms-bmp": {
	source: "nginx",
	compressible: true,
	extensions: [
		"bmp"
	]
},
	"image/x-pcx": {
	source: "apache",
	extensions: [
		"pcx"
	]
},
	"image/x-pict": {
	source: "apache",
	extensions: [
		"pic",
		"pct"
	]
},
	"image/x-portable-anymap": {
	source: "apache",
	extensions: [
		"pnm"
	]
},
	"image/x-portable-bitmap": {
	source: "apache",
	extensions: [
		"pbm"
	]
},
	"image/x-portable-graymap": {
	source: "apache",
	extensions: [
		"pgm"
	]
},
	"image/x-portable-pixmap": {
	source: "apache",
	extensions: [
		"ppm"
	]
},
	"image/x-rgb": {
	source: "apache",
	extensions: [
		"rgb"
	]
},
	"image/x-tga": {
	source: "apache",
	extensions: [
		"tga"
	]
},
	"image/x-xbitmap": {
	source: "apache",
	extensions: [
		"xbm"
	]
},
	"image/x-xcf": {
	compressible: false
},
	"image/x-xpixmap": {
	source: "apache",
	extensions: [
		"xpm"
	]
},
	"image/x-xwindowdump": {
	source: "apache",
	extensions: [
		"xwd"
	]
},
	"message/cpim": {
	source: "iana"
},
	"message/delivery-status": {
	source: "iana"
},
	"message/disposition-notification": {
	source: "iana",
	extensions: [
		"disposition-notification"
	]
},
	"message/external-body": {
	source: "iana"
},
	"message/feedback-report": {
	source: "iana"
},
	"message/global": {
	source: "iana",
	extensions: [
		"u8msg"
	]
},
	"message/global-delivery-status": {
	source: "iana",
	extensions: [
		"u8dsn"
	]
},
	"message/global-disposition-notification": {
	source: "iana",
	extensions: [
		"u8mdn"
	]
},
	"message/global-headers": {
	source: "iana",
	extensions: [
		"u8hdr"
	]
},
	"message/http": {
	source: "iana",
	compressible: false
},
	"message/imdn+xml": {
	source: "iana",
	compressible: true
},
	"message/news": {
	source: "iana"
},
	"message/partial": {
	source: "iana",
	compressible: false
},
	"message/rfc822": {
	source: "iana",
	compressible: true,
	extensions: [
		"eml",
		"mime"
	]
},
	"message/s-http": {
	source: "iana"
},
	"message/sip": {
	source: "iana"
},
	"message/sipfrag": {
	source: "iana"
},
	"message/tracking-status": {
	source: "iana"
},
	"message/vnd.si.simp": {
	source: "iana"
},
	"message/vnd.wfa.wsc": {
	source: "iana",
	extensions: [
		"wsc"
	]
},
	"model/3mf": {
	source: "iana",
	extensions: [
		"3mf"
	]
},
	"model/gltf+json": {
	source: "iana",
	compressible: true,
	extensions: [
		"gltf"
	]
},
	"model/gltf-binary": {
	source: "iana",
	compressible: true,
	extensions: [
		"glb"
	]
},
	"model/iges": {
	source: "iana",
	compressible: false,
	extensions: [
		"igs",
		"iges"
	]
},
	"model/mesh": {
	source: "iana",
	compressible: false,
	extensions: [
		"msh",
		"mesh",
		"silo"
	]
},
	"model/stl": {
	source: "iana",
	extensions: [
		"stl"
	]
},
	"model/vnd.collada+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"dae"
	]
},
	"model/vnd.dwf": {
	source: "iana",
	extensions: [
		"dwf"
	]
},
	"model/vnd.flatland.3dml": {
	source: "iana"
},
	"model/vnd.gdl": {
	source: "iana",
	extensions: [
		"gdl"
	]
},
	"model/vnd.gs-gdl": {
	source: "apache"
},
	"model/vnd.gs.gdl": {
	source: "iana"
},
	"model/vnd.gtw": {
	source: "iana",
	extensions: [
		"gtw"
	]
},
	"model/vnd.moml+xml": {
	source: "iana",
	compressible: true
},
	"model/vnd.mts": {
	source: "iana",
	extensions: [
		"mts"
	]
},
	"model/vnd.opengex": {
	source: "iana",
	extensions: [
		"ogex"
	]
},
	"model/vnd.parasolid.transmit.binary": {
	source: "iana",
	extensions: [
		"x_b"
	]
},
	"model/vnd.parasolid.transmit.text": {
	source: "iana",
	extensions: [
		"x_t"
	]
},
	"model/vnd.rosette.annotated-data-model": {
	source: "iana"
},
	"model/vnd.usdz+zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"usdz"
	]
},
	"model/vnd.valve.source.compiled-map": {
	source: "iana",
	extensions: [
		"bsp"
	]
},
	"model/vnd.vtu": {
	source: "iana",
	extensions: [
		"vtu"
	]
},
	"model/vrml": {
	source: "iana",
	compressible: false,
	extensions: [
		"wrl",
		"vrml"
	]
},
	"model/x3d+binary": {
	source: "apache",
	compressible: false,
	extensions: [
		"x3db",
		"x3dbz"
	]
},
	"model/x3d+fastinfoset": {
	source: "iana",
	extensions: [
		"x3db"
	]
},
	"model/x3d+vrml": {
	source: "apache",
	compressible: false,
	extensions: [
		"x3dv",
		"x3dvz"
	]
},
	"model/x3d+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"x3d",
		"x3dz"
	]
},
	"model/x3d-vrml": {
	source: "iana",
	extensions: [
		"x3dv"
	]
},
	"multipart/alternative": {
	source: "iana",
	compressible: false
},
	"multipart/appledouble": {
	source: "iana"
},
	"multipart/byteranges": {
	source: "iana"
},
	"multipart/digest": {
	source: "iana"
},
	"multipart/encrypted": {
	source: "iana",
	compressible: false
},
	"multipart/form-data": {
	source: "iana",
	compressible: false
},
	"multipart/header-set": {
	source: "iana"
},
	"multipart/mixed": {
	source: "iana",
	compressible: false
},
	"multipart/multilingual": {
	source: "iana"
},
	"multipart/parallel": {
	source: "iana"
},
	"multipart/related": {
	source: "iana",
	compressible: false
},
	"multipart/report": {
	source: "iana"
},
	"multipart/signed": {
	source: "iana",
	compressible: false
},
	"multipart/vnd.bint.med-plus": {
	source: "iana"
},
	"multipart/voice-message": {
	source: "iana"
},
	"multipart/x-mixed-replace": {
	source: "iana"
},
	"text/1d-interleaved-parityfec": {
	source: "iana"
},
	"text/cache-manifest": {
	source: "iana",
	compressible: true,
	extensions: [
		"appcache",
		"manifest"
	]
},
	"text/calendar": {
	source: "iana",
	extensions: [
		"ics",
		"ifb"
	]
},
	"text/calender": {
	compressible: true
},
	"text/cmd": {
	compressible: true
},
	"text/coffeescript": {
	extensions: [
		"coffee",
		"litcoffee"
	]
},
	"text/css": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"css"
	]
},
	"text/csv": {
	source: "iana",
	compressible: true,
	extensions: [
		"csv"
	]
},
	"text/csv-schema": {
	source: "iana"
},
	"text/directory": {
	source: "iana"
},
	"text/dns": {
	source: "iana"
},
	"text/ecmascript": {
	source: "iana"
},
	"text/encaprtp": {
	source: "iana"
},
	"text/enriched": {
	source: "iana"
},
	"text/fwdred": {
	source: "iana"
},
	"text/grammar-ref-list": {
	source: "iana"
},
	"text/html": {
	source: "iana",
	compressible: true,
	extensions: [
		"html",
		"htm",
		"shtml"
	]
},
	"text/jade": {
	extensions: [
		"jade"
	]
},
	"text/javascript": {
	source: "iana",
	compressible: true
},
	"text/jcr-cnd": {
	source: "iana"
},
	"text/jsx": {
	compressible: true,
	extensions: [
		"jsx"
	]
},
	"text/less": {
	compressible: true,
	extensions: [
		"less"
	]
},
	"text/markdown": {
	source: "iana",
	compressible: true,
	extensions: [
		"markdown",
		"md"
	]
},
	"text/mathml": {
	source: "nginx",
	extensions: [
		"mml"
	]
},
	"text/mdx": {
	compressible: true,
	extensions: [
		"mdx"
	]
},
	"text/mizar": {
	source: "iana"
},
	"text/n3": {
	source: "iana",
	compressible: true,
	extensions: [
		"n3"
	]
},
	"text/parameters": {
	source: "iana"
},
	"text/parityfec": {
	source: "iana"
},
	"text/plain": {
	source: "iana",
	compressible: true,
	extensions: [
		"txt",
		"text",
		"conf",
		"def",
		"list",
		"log",
		"in",
		"ini"
	]
},
	"text/provenance-notation": {
	source: "iana"
},
	"text/prs.fallenstein.rst": {
	source: "iana"
},
	"text/prs.lines.tag": {
	source: "iana",
	extensions: [
		"dsc"
	]
},
	"text/prs.prop.logic": {
	source: "iana"
},
	"text/raptorfec": {
	source: "iana"
},
	"text/red": {
	source: "iana"
},
	"text/rfc822-headers": {
	source: "iana"
},
	"text/richtext": {
	source: "iana",
	compressible: true,
	extensions: [
		"rtx"
	]
},
	"text/rtf": {
	source: "iana",
	compressible: true,
	extensions: [
		"rtf"
	]
},
	"text/rtp-enc-aescm128": {
	source: "iana"
},
	"text/rtploopback": {
	source: "iana"
},
	"text/rtx": {
	source: "iana"
},
	"text/sgml": {
	source: "iana",
	extensions: [
		"sgml",
		"sgm"
	]
},
	"text/shex": {
	extensions: [
		"shex"
	]
},
	"text/slim": {
	extensions: [
		"slim",
		"slm"
	]
},
	"text/strings": {
	source: "iana"
},
	"text/stylus": {
	extensions: [
		"stylus",
		"styl"
	]
},
	"text/t140": {
	source: "iana"
},
	"text/tab-separated-values": {
	source: "iana",
	compressible: true,
	extensions: [
		"tsv"
	]
},
	"text/troff": {
	source: "iana",
	extensions: [
		"t",
		"tr",
		"roff",
		"man",
		"me",
		"ms"
	]
},
	"text/turtle": {
	source: "iana",
	charset: "UTF-8",
	extensions: [
		"ttl"
	]
},
	"text/ulpfec": {
	source: "iana"
},
	"text/uri-list": {
	source: "iana",
	compressible: true,
	extensions: [
		"uri",
		"uris",
		"urls"
	]
},
	"text/vcard": {
	source: "iana",
	compressible: true,
	extensions: [
		"vcard"
	]
},
	"text/vnd.a": {
	source: "iana"
},
	"text/vnd.abc": {
	source: "iana"
},
	"text/vnd.ascii-art": {
	source: "iana"
},
	"text/vnd.curl": {
	source: "iana",
	extensions: [
		"curl"
	]
},
	"text/vnd.curl.dcurl": {
	source: "apache",
	extensions: [
		"dcurl"
	]
},
	"text/vnd.curl.mcurl": {
	source: "apache",
	extensions: [
		"mcurl"
	]
},
	"text/vnd.curl.scurl": {
	source: "apache",
	extensions: [
		"scurl"
	]
},
	"text/vnd.debian.copyright": {
	source: "iana"
},
	"text/vnd.dmclientscript": {
	source: "iana"
},
	"text/vnd.dvb.subtitle": {
	source: "iana",
	extensions: [
		"sub"
	]
},
	"text/vnd.esmertec.theme-descriptor": {
	source: "iana"
},
	"text/vnd.fly": {
	source: "iana",
	extensions: [
		"fly"
	]
},
	"text/vnd.fmi.flexstor": {
	source: "iana",
	extensions: [
		"flx"
	]
},
	"text/vnd.gml": {
	source: "iana"
},
	"text/vnd.graphviz": {
	source: "iana",
	extensions: [
		"gv"
	]
},
	"text/vnd.hgl": {
	source: "iana"
},
	"text/vnd.in3d.3dml": {
	source: "iana",
	extensions: [
		"3dml"
	]
},
	"text/vnd.in3d.spot": {
	source: "iana",
	extensions: [
		"spot"
	]
},
	"text/vnd.iptc.newsml": {
	source: "iana"
},
	"text/vnd.iptc.nitf": {
	source: "iana"
},
	"text/vnd.latex-z": {
	source: "iana"
},
	"text/vnd.motorola.reflex": {
	source: "iana"
},
	"text/vnd.ms-mediapackage": {
	source: "iana"
},
	"text/vnd.net2phone.commcenter.command": {
	source: "iana"
},
	"text/vnd.radisys.msml-basic-layout": {
	source: "iana"
},
	"text/vnd.senx.warpscript": {
	source: "iana"
},
	"text/vnd.si.uricatalogue": {
	source: "iana"
},
	"text/vnd.sun.j2me.app-descriptor": {
	source: "iana",
	extensions: [
		"jad"
	]
},
	"text/vnd.trolltech.linguist": {
	source: "iana"
},
	"text/vnd.wap.si": {
	source: "iana"
},
	"text/vnd.wap.sl": {
	source: "iana"
},
	"text/vnd.wap.wml": {
	source: "iana",
	extensions: [
		"wml"
	]
},
	"text/vnd.wap.wmlscript": {
	source: "iana",
	extensions: [
		"wmls"
	]
},
	"text/vtt": {
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"vtt"
	]
},
	"text/x-asm": {
	source: "apache",
	extensions: [
		"s",
		"asm"
	]
},
	"text/x-c": {
	source: "apache",
	extensions: [
		"c",
		"cc",
		"cxx",
		"cpp",
		"h",
		"hh",
		"dic"
	]
},
	"text/x-component": {
	source: "nginx",
	extensions: [
		"htc"
	]
},
	"text/x-fortran": {
	source: "apache",
	extensions: [
		"f",
		"for",
		"f77",
		"f90"
	]
},
	"text/x-gwt-rpc": {
	compressible: true
},
	"text/x-handlebars-template": {
	extensions: [
		"hbs"
	]
},
	"text/x-java-source": {
	source: "apache",
	extensions: [
		"java"
	]
},
	"text/x-jquery-tmpl": {
	compressible: true
},
	"text/x-lua": {
	extensions: [
		"lua"
	]
},
	"text/x-markdown": {
	compressible: true,
	extensions: [
		"mkd"
	]
},
	"text/x-nfo": {
	source: "apache",
	extensions: [
		"nfo"
	]
},
	"text/x-opml": {
	source: "apache",
	extensions: [
		"opml"
	]
},
	"text/x-org": {
	compressible: true,
	extensions: [
		"org"
	]
},
	"text/x-pascal": {
	source: "apache",
	extensions: [
		"p",
		"pas"
	]
},
	"text/x-processing": {
	compressible: true,
	extensions: [
		"pde"
	]
},
	"text/x-sass": {
	extensions: [
		"sass"
	]
},
	"text/x-scss": {
	extensions: [
		"scss"
	]
},
	"text/x-setext": {
	source: "apache",
	extensions: [
		"etx"
	]
},
	"text/x-sfv": {
	source: "apache",
	extensions: [
		"sfv"
	]
},
	"text/x-suse-ymp": {
	compressible: true,
	extensions: [
		"ymp"
	]
},
	"text/x-uuencode": {
	source: "apache",
	extensions: [
		"uu"
	]
},
	"text/x-vcalendar": {
	source: "apache",
	extensions: [
		"vcs"
	]
},
	"text/x-vcard": {
	source: "apache",
	extensions: [
		"vcf"
	]
},
	"text/xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xml"
	]
},
	"text/xml-external-parsed-entity": {
	source: "iana"
},
	"text/yaml": {
	extensions: [
		"yaml",
		"yml"
	]
},
	"video/1d-interleaved-parityfec": {
	source: "iana"
},
	"video/3gpp": {
	source: "iana",
	extensions: [
		"3gp",
		"3gpp"
	]
},
	"video/3gpp-tt": {
	source: "iana"
},
	"video/3gpp2": {
	source: "iana",
	extensions: [
		"3g2"
	]
},
	"video/bmpeg": {
	source: "iana"
},
	"video/bt656": {
	source: "iana"
},
	"video/celb": {
	source: "iana"
},
	"video/dv": {
	source: "iana"
},
	"video/encaprtp": {
	source: "iana"
},
	"video/h261": {
	source: "iana",
	extensions: [
		"h261"
	]
},
	"video/h263": {
	source: "iana",
	extensions: [
		"h263"
	]
},
	"video/h263-1998": {
	source: "iana"
},
	"video/h263-2000": {
	source: "iana"
},
	"video/h264": {
	source: "iana",
	extensions: [
		"h264"
	]
},
	"video/h264-rcdo": {
	source: "iana"
},
	"video/h264-svc": {
	source: "iana"
},
	"video/h265": {
	source: "iana"
},
	"video/iso.segment": {
	source: "iana"
},
	"video/jpeg": {
	source: "iana",
	extensions: [
		"jpgv"
	]
},
	"video/jpeg2000": {
	source: "iana"
},
	"video/jpm": {
	source: "apache",
	extensions: [
		"jpm",
		"jpgm"
	]
},
	"video/mj2": {
	source: "iana",
	extensions: [
		"mj2",
		"mjp2"
	]
},
	"video/mp1s": {
	source: "iana"
},
	"video/mp2p": {
	source: "iana"
},
	"video/mp2t": {
	source: "iana",
	extensions: [
		"ts"
	]
},
	"video/mp4": {
	source: "iana",
	compressible: false,
	extensions: [
		"mp4",
		"mp4v",
		"mpg4"
	]
},
	"video/mp4v-es": {
	source: "iana"
},
	"video/mpeg": {
	source: "iana",
	compressible: false,
	extensions: [
		"mpeg",
		"mpg",
		"mpe",
		"m1v",
		"m2v"
	]
},
	"video/mpeg4-generic": {
	source: "iana"
},
	"video/mpv": {
	source: "iana"
},
	"video/nv": {
	source: "iana"
},
	"video/ogg": {
	source: "iana",
	compressible: false,
	extensions: [
		"ogv"
	]
},
	"video/parityfec": {
	source: "iana"
},
	"video/pointer": {
	source: "iana"
},
	"video/quicktime": {
	source: "iana",
	compressible: false,
	extensions: [
		"qt",
		"mov"
	]
},
	"video/raptorfec": {
	source: "iana"
},
	"video/raw": {
	source: "iana"
},
	"video/rtp-enc-aescm128": {
	source: "iana"
},
	"video/rtploopback": {
	source: "iana"
},
	"video/rtx": {
	source: "iana"
},
	"video/smpte291": {
	source: "iana"
},
	"video/smpte292m": {
	source: "iana"
},
	"video/ulpfec": {
	source: "iana"
},
	"video/vc1": {
	source: "iana"
},
	"video/vc2": {
	source: "iana"
},
	"video/vnd.cctv": {
	source: "iana"
},
	"video/vnd.dece.hd": {
	source: "iana",
	extensions: [
		"uvh",
		"uvvh"
	]
},
	"video/vnd.dece.mobile": {
	source: "iana",
	extensions: [
		"uvm",
		"uvvm"
	]
},
	"video/vnd.dece.mp4": {
	source: "iana"
},
	"video/vnd.dece.pd": {
	source: "iana",
	extensions: [
		"uvp",
		"uvvp"
	]
},
	"video/vnd.dece.sd": {
	source: "iana",
	extensions: [
		"uvs",
		"uvvs"
	]
},
	"video/vnd.dece.video": {
	source: "iana",
	extensions: [
		"uvv",
		"uvvv"
	]
},
	"video/vnd.directv.mpeg": {
	source: "iana"
},
	"video/vnd.directv.mpeg-tts": {
	source: "iana"
},
	"video/vnd.dlna.mpeg-tts": {
	source: "iana"
},
	"video/vnd.dvb.file": {
	source: "iana",
	extensions: [
		"dvb"
	]
},
	"video/vnd.fvt": {
	source: "iana",
	extensions: [
		"fvt"
	]
},
	"video/vnd.hns.video": {
	source: "iana"
},
	"video/vnd.iptvforum.1dparityfec-1010": {
	source: "iana"
},
	"video/vnd.iptvforum.1dparityfec-2005": {
	source: "iana"
},
	"video/vnd.iptvforum.2dparityfec-1010": {
	source: "iana"
},
	"video/vnd.iptvforum.2dparityfec-2005": {
	source: "iana"
},
	"video/vnd.iptvforum.ttsavc": {
	source: "iana"
},
	"video/vnd.iptvforum.ttsmpeg2": {
	source: "iana"
},
	"video/vnd.motorola.video": {
	source: "iana"
},
	"video/vnd.motorola.videop": {
	source: "iana"
},
	"video/vnd.mpegurl": {
	source: "iana",
	extensions: [
		"mxu",
		"m4u"
	]
},
	"video/vnd.ms-playready.media.pyv": {
	source: "iana",
	extensions: [
		"pyv"
	]
},
	"video/vnd.nokia.interleaved-multimedia": {
	source: "iana"
},
	"video/vnd.nokia.mp4vr": {
	source: "iana"
},
	"video/vnd.nokia.videovoip": {
	source: "iana"
},
	"video/vnd.objectvideo": {
	source: "iana"
},
	"video/vnd.radgamettools.bink": {
	source: "iana"
},
	"video/vnd.radgamettools.smacker": {
	source: "iana"
},
	"video/vnd.sealed.mpeg1": {
	source: "iana"
},
	"video/vnd.sealed.mpeg4": {
	source: "iana"
},
	"video/vnd.sealed.swf": {
	source: "iana"
},
	"video/vnd.sealedmedia.softseal.mov": {
	source: "iana"
},
	"video/vnd.uvvu.mp4": {
	source: "iana",
	extensions: [
		"uvu",
		"uvvu"
	]
},
	"video/vnd.vivo": {
	source: "iana",
	extensions: [
		"viv"
	]
},
	"video/vp8": {
	source: "iana"
},
	"video/webm": {
	source: "apache",
	compressible: false,
	extensions: [
		"webm"
	]
},
	"video/x-f4v": {
	source: "apache",
	extensions: [
		"f4v"
	]
},
	"video/x-fli": {
	source: "apache",
	extensions: [
		"fli"
	]
},
	"video/x-flv": {
	source: "apache",
	compressible: false,
	extensions: [
		"flv"
	]
},
	"video/x-m4v": {
	source: "apache",
	extensions: [
		"m4v"
	]
},
	"video/x-matroska": {
	source: "apache",
	compressible: false,
	extensions: [
		"mkv",
		"mk3d",
		"mks"
	]
},
	"video/x-mng": {
	source: "apache",
	extensions: [
		"mng"
	]
},
	"video/x-ms-asf": {
	source: "apache",
	extensions: [
		"asf",
		"asx"
	]
},
	"video/x-ms-vob": {
	source: "apache",
	extensions: [
		"vob"
	]
},
	"video/x-ms-wm": {
	source: "apache",
	extensions: [
		"wm"
	]
},
	"video/x-ms-wmv": {
	source: "apache",
	compressible: false,
	extensions: [
		"wmv"
	]
},
	"video/x-ms-wmx": {
	source: "apache",
	extensions: [
		"wmx"
	]
},
	"video/x-ms-wvx": {
	source: "apache",
	extensions: [
		"wvx"
	]
},
	"video/x-msvideo": {
	source: "apache",
	extensions: [
		"avi"
	]
},
	"video/x-sgi-movie": {
	source: "apache",
	extensions: [
		"movie"
	]
},
	"video/x-smv": {
	source: "apache",
	extensions: [
		"smv"
	]
},
	"x-conference/x-cooltalk": {
	source: "apache",
	extensions: [
		"ice"
	]
},
	"x-shader/x-fragment": {
	compressible: true
},
	"x-shader/x-vertex": {
	compressible: true
}
};

var db$1 = /*#__PURE__*/Object.freeze({
	'default': db
});

var require$$0$1 = getCjsExportFromNamespace(db$1);

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */

/**
 * Module exports.
 */

var mimeDb = require$$0$1;

var mimeTypes = createCommonjsModule(function (module, exports) {

/**
 * Module dependencies.
 * @private
 */


var extname = path.extname;

/**
 * Module variables.
 * @private
 */

var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
var TEXT_TYPE_REGEXP = /^text\//i;

/**
 * Module exports.
 * @public
 */

exports.charset = charset;
exports.charsets = { lookup: charset };
exports.contentType = contentType;
exports.extension = extension;
exports.extensions = Object.create(null);
exports.lookup = lookup;
exports.types = Object.create(null);

// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types);

/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type);
  var mime = match && mimeDb[match[1].toLowerCase()];

  if (mime && mime.charset) {
    return mime.charset
  }

  // default text/* to utf-8
  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
    return 'UTF-8'
  }

  return false
}

/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */

function contentType (str) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false
  }

  var mime = str.indexOf('/') === -1
    ? exports.lookup(str)
    : str;

  if (!mime) {
    return false
  }

  // TODO: use content-type or other module
  if (mime.indexOf('charset') === -1) {
    var charset = exports.charset(mime);
    if (charset) mime += '; charset=' + charset.toLowerCase();
  }

  return mime
}

/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function extension (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type);

  // get extensions
  var exts = match && exports.extensions[match[1].toLowerCase()];

  if (!exts || !exts.length) {
    return false
  }

  return exts[0]
}

/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */

function lookup (path) {
  if (!path || typeof path !== 'string') {
    return false
  }

  // get the extension ("ext" or ".ext" or full path)
  var extension = extname('x.' + path)
    .toLowerCase()
    .substr(1);

  if (!extension) {
    return false
  }

  return exports.types[extension] || false
}

/**
 * Populate the extensions and types maps.
 * @private
 */

function populateMaps (extensions, types) {
  // source preference (least -> most)
  var preference = ['nginx', 'apache', undefined, 'iana'];

  Object.keys(mimeDb).forEach(function forEachMimeType (type) {
    var mime = mimeDb[type];
    var exts = mime.extensions;

    if (!exts || !exts.length) {
      return
    }

    // mime -> extensions
    extensions[type] = exts;

    // extension -> mime
    for (var i = 0; i < exts.length; i++) {
      var extension = exts[i];

      if (types[extension]) {
        var from = preference.indexOf(mimeDb[types[extension]].source);
        var to = preference.indexOf(mime.source);

        if (types[extension] !== 'application/octet-stream' &&
          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
          // skip the remapping
          continue
        }
      }

      // set the extension -> mime
      types[extension] = type;
    }
  });
}
});
var mimeTypes_1 = mimeTypes.charset;
var mimeTypes_2 = mimeTypes.charsets;
var mimeTypes_3 = mimeTypes.contentType;
var mimeTypes_4 = mimeTypes.extension;
var mimeTypes_5 = mimeTypes.extensions;
var mimeTypes_6 = mimeTypes.lookup;
var mimeTypes_7 = mimeTypes.types;

function contentTypeOfStream (stream) {
  if (typeof stream.getHeaders === 'function') {
    return stream.getHeaders()['content-type']
  } else if (stream.path) {
    return mimeTypes.lookup(stream.path)
  }
}

var streamContentType = middleware('streamContentType', function (request, next) {
  if (isStream(request.body) && !request.headers['content-type']) {
    var contentType = contentTypeOfStream(request.body);
    if (contentType) {
      request.headers['content-type'] = contentType;
    }
  }
  return next()
});

var debug$1 = src$1('httpism');

var createDebug = src$1;
var debugRequest = createDebug('httpism:request');


var debugLog = middleware('debugLog', function (request, next) {
  if (debugRequest.enabled) {
    debugRequest(prepareForLogging(request));
  }
  if (debug$1.enabled) {
    var startTime = Date.now();
    return next().then(function (response) {
      var headerTime = Date.now() - startTime;
      response.body.on('end', function () {
        var bodyTime = Date.now() - startTime;
        debug$1(request.method.toUpperCase() + ' ' + obfuscateUrlPassword(request.url) + ' => ' + response.statusCode + ' (' + headerTime + 'ms, ' + bodyTime + 'ms)');
      });
      return response
    }, function (error) {
      var headerTime = Date.now() - startTime;
      debug$1(request.method.toUpperCase() + ' ' + obfuscateUrlPassword(request.url) + ' => ' + error.message + ' (' + headerTime + 'ms)');
      throw error
    })
  } else {
    return next()
  }
});

var httpism = client_1([
  log,
  exception,
  textServer,
  formServer,
  jsonServer,
  params,
  querystring,
  basicAuth,
  output,
  redirect,
  cookies,
  streamContentType,
  debugLog,
  http_1
]);

var raw = client_1(http_1);
httpism.raw = raw;

async function run() {
    try {
        const args = readArgs();
        console.log("Triggering CircleCI Pipeline with details:");
        console.dir(args, { color: true }); // rely on GitHub to mask token secret
        const resp = await postRequest(args);
        core_6("pipeline_number", String(resp.number));
        core_6("pipeline_id", resp.id);
        console.log("CircleCI Pipeline Created");
        console.dir(resp, { color: true });
    }
    catch (ex) {
        core_7(ex.message);
    }
}
function readArgs() {
    try {
        const token = core_5("token", { required: true });
        const vcs = core_5("vcs") || "github";
        const org = readArg("org", "organization.login");
        const repo = readArg("repo", "repository.name");
        const branch = readArg("repo", "pull_request.head.ref");
        const parameters = JSON.parse(core_5("parameters_json") || "{}");
        return { token, vcs, org, repo, branch, parameters };
    }
    catch (ex) {
        console.log("Failed to read args");
        console.dir(process.env, { depth: Infinity, color: true });
        console.dir(getEvent(), { depth: Infinity, color: true });
        throw ex;
    }
}
async function postRequest(args) {
    const client = httpism.client("https://circleci.com/api/v2/", {
        headers: {
            "user-agent": "trigger-pipeline GitHub Action",
            "Circle-Token": args.token
        },
        responseBody: "json"
    });
    const resp = await client.post("project/:vcs/:org/:project/pipeline", {
        branch: args.branch,
        parameters: args.parameters
    }, {
        params: {
            vcs: args.vcs,
            org: args.org,
            project: args.repo
        }
    });
    return resp;
}
function readArg(input, fallback) {
    const val = core_5(input);
    if (val) {
        return val;
    }
    const event = getEvent();
    if (dotProp.has(event, fallback)) {
        return dotProp.get(event, fallback);
    }
    throw new Error(`Missing '${input}' argument`);
}
function getEvent() {
    if (process.env.GITHUB_EVENT_PATH) {
        return require(process.env.GITHUB_EVENT_PATH);
    }
    return {};
}
run();
