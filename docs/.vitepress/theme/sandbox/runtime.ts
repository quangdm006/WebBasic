// Mã chạy bên trong iframe sandbox, TRƯỚC code của người học. Nhiệm vụ:
//   • chuyển console.log/info/warn/error/table... và lỗi chưa bắt về trang cha (postMessage);
//   • báo chiều cao nội dung để trang cha co giãn iframe (ví dụ trong bài học);
//   • giả lập localStorage/sessionStorage (iframe sandbox không có origin nên không dùng được bản thật);
//   • chạy các bài kiểm tra của Playground và gửi kết quả về.
//
// Quy tắc khi sửa: viết JavaScript thuần kiểu ES5, KHÔNG dùng comment `//`, template literal hay
// chuỗi `${`, và luôn kết thúc câu lệnh bằng dấu chấm phẩy. Đoạn mã được nhúng nguyên văn và gộp
// thành MỘT dòng để số dòng báo lỗi trong code của người học không bị lệch.
export const RUNTIME = String.raw`(function (cfg) {
  var TOKEN = cfg.token;
  var send = function (msg) {
    msg.__wb = TOKEN;
    try { window.parent.postMessage(msg, '*'); } catch (e) {}
  };

  var IDENT = /^[\p{L}_$][\p{L}\p{N}_$]*$/u;
  var quote = function (s) {
    return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
  };

  var fmtNode = function (node) {
    if (node.nodeType === 1) {
      var html = node.outerHTML;
      if (html.length <= 80) return html;
      var open = html.slice(0, html.indexOf('>') + 1);
      var close = '</' + node.localName + '>';
      return html.slice(-close.length) === close ? open + '…' + close : open;
    }
    if (node.nodeType === 3) return '"' + node.textContent + '"';
    if (node.nodeType === 8) return '<!--' + node.textContent + '-->';
    if (node.nodeType === 9) return '#document';
    return node.nodeName;
  };

  var fmt = function (v, depth, seen) {
    var t = typeof v;
    if (v === null) return 'null';
    if (t === 'undefined') return 'undefined';
    if (t === 'string') return depth === 0 ? v : quote(v);
    if (t === 'number') return v === 0 && 1 / v < 0 ? '-0' : String(v);
    if (t === 'bigint') return String(v) + 'n';
    if (t === 'boolean' || t === 'symbol') return v.toString();
    if (t === 'function') {
      var src = Function.prototype.toString.call(v);
      return /^class\b/.test(src) ? 'class ' + (v.name || '(anonymous)') : 'ƒ ' + (v.name || '') + '()';
    }
    if (v instanceof Error) return v.name + ': ' + v.message;
    if (v instanceof Date) return isNaN(v.getTime()) ? 'Invalid Date' : v.toString();
    if (v instanceof RegExp) return String(v);
    if (typeof Node === 'function' && v instanceof Node) return fmtNode(v);
    if (typeof Promise === 'function' && v instanceof Promise) return 'Promise {…}';
    if (seen.indexOf(v) !== -1) return '[Circular]';
    if (depth > 2) return Array.isArray(v) ? '[…]' : '{…}';
    seen = seen.concat([v]);
    var items = [];
    var i;
    if (Array.isArray(v)) {
      for (i = 0; i < v.length && i < 100; i++) items.push(i in v ? fmt(v[i], depth + 1, seen) : 'empty');
      if (v.length > 100) items.push('… thêm ' + (v.length - 100) + ' phần tử');
      return '[' + items.join(', ') + ']';
    }
    if (v instanceof Map) {
      v.forEach(function (val, key) {
        if (items.length < 100) items.push(fmt(key, depth + 1, seen) + ' => ' + fmt(val, depth + 1, seen));
      });
      return 'Map(' + v.size + ') {' + items.join(', ') + '}';
    }
    if (v instanceof Set) {
      v.forEach(function (val) {
        if (items.length < 100) items.push(fmt(val, depth + 1, seen));
      });
      return 'Set(' + v.size + ') {' + items.join(', ') + '}';
    }
    if (typeof NodeList === 'function' && (v instanceof NodeList || v instanceof HTMLCollection)) {
      for (i = 0; i < v.length && i < 100; i++) items.push(fmtNode(v[i]));
      return (v instanceof NodeList ? 'NodeList' : 'HTMLCollection') + '(' + v.length + ') [' + items.join(', ') + ']';
    }
    var proto = Object.getPrototypeOf(v);
    var name = proto && proto.constructor && proto.constructor.name;
    var keys = Object.keys(v);
    for (i = 0; i < keys.length && i < 100; i++) {
      var shown;
      try { shown = fmt(v[keys[i]], depth + 1, seen); } catch (e) { shown = '(không đọc được)'; }
      items.push((IDENT.test(keys[i]) ? keys[i] : quote(keys[i])) + ': ' + shown);
    }
    if (keys.length > 100) items.push('…');
    return (name && name !== 'Object' ? name + ' ' : '') + '{' + items.join(', ') + '}';
  };

  var format = function (list) {
    var args = Array.prototype.slice.call(list);
    var out = [];
    if (typeof args[0] === 'string' && args[0].indexOf('%') !== -1) {
      out.push(args.shift().replace(/%([sdifoOc%])/g, function (m, f) {
        if (f === '%') return '%';
        if (!args.length) return m;
        var a = args.shift();
        if (f === 's') return typeof a === 'string' ? a : fmt(a, 1, []);
        if (f === 'd' || f === 'i') return String(parseInt(a, 10));
        if (f === 'f') return String(parseFloat(a));
        if (f === 'c') return '';
        return fmt(a, 1, []);
      }));
    }
    for (var i = 0; i < args.length; i++) out.push(fmt(args[i], 0, []));
    return out.join(' ');
  };

  var table = function (data) {
    var rows = Array.isArray(data)
      ? data.map(function (r, i) { return [String(i), r]; })
      : Object.keys(data).map(function (k) { return [k, data[k]]; });
    var isObj = function (x) { return x !== null && typeof x === 'object'; };
    var cols = [];
    var hasValue = false;
    rows.forEach(function (r) {
      if (isObj(r[1])) Object.keys(r[1]).forEach(function (k) { if (cols.indexOf(k) === -1) cols.push(k); });
      else hasValue = true;
    });
    var header = ['(index)'].concat(cols);
    if (hasValue) header.push('Value');
    var body = rows.map(function (r) {
      var line = [r[0]];
      cols.forEach(function (c) { line.push(isObj(r[1]) && c in r[1] ? fmt(r[1][c], 1, []) : ''); });
      if (hasValue) line.push(isObj(r[1]) ? '' : fmt(r[1], 1, []));
      return line;
    });
    var all = [header].concat(body);
    var widths = header.map(function (h, i) {
      return Math.max.apply(null, all.map(function (l) { return l[i].length; }));
    });
    var pad = function (s, w) { return s + new Array(w - s.length + 1).join(' '); };
    var line = function (cells) {
      return '│ ' + cells.map(function (c, i) { return pad(c, widths[i]); }).join(' │ ') + ' │';
    };
    var rule = function (l, m, r) {
      return l + widths.map(function (w) { return new Array(w + 3).join('─'); }).join(m) + r;
    };
    return [rule('┌', '┬', '┐'), line(header), rule('├', '┼', '┤')]
      .concat(body.map(line), [rule('└', '┴', '┘')]).join('\n');
  };

  var logs = [];
  var indent = '';
  var emit = function (level, text) {
    text = indent + text;
    logs.push(text);
    send({ type: 'console', level: level, text: text });
  };
  var native = {};
  ['log', 'info', 'warn', 'error', 'debug'].forEach(function (level) {
    native[level] = console[level];
    console[level] = function () {
      emit(level, format(arguments));
      if (native[level]) native[level].apply(console, arguments);
    };
  });
  console.clear = function () { send({ type: 'clear' }); };
  console.table = function (data) {
    emit('log', data !== null && typeof data === 'object' ? table(data) : format(arguments));
  };
  console.group = console.groupCollapsed = function () {
    if (arguments.length) emit('log', format(arguments));
    indent += '  ';
  };
  console.groupEnd = function () { indent = indent.slice(2); };
  console.assert = function (ok) {
    if (ok) return;
    var rest = Array.prototype.slice.call(arguments, 1);
    emit('error', 'Assertion failed' + (rest.length ? ': ' + format(rest) : ''));
  };
  var counts = {};
  var timers = {};
  var label = function (l) { return l === undefined ? 'default' : String(l); };
  console.count = function (l) {
    l = label(l);
    counts[l] = (counts[l] || 0) + 1;
    emit('log', l + ': ' + counts[l]);
  };
  console.countReset = function (l) { counts[label(l)] = 0; };
  console.time = function (l) { timers[label(l)] = performance.now(); };
  var elapsed = function (l) {
    return l + ': ' + Math.round((performance.now() - timers[l]) * 1000) / 1000 + ' ms';
  };
  console.timeLog = function (l) {
    l = label(l);
    if (l in timers) emit('log', elapsed(l));
  };
  console.timeEnd = function (l) {
    l = label(l);
    if (!(l in timers)) return;
    emit('log', elapsed(l));
    delete timers[l];
  };

  window.addEventListener('error', function (e) {
    var err = e.error;
    var text;
    if (err instanceof Error) text = err.name + ': ' + err.message;
    else if (err !== undefined && err !== null) text = fmt(err, 0, []);
    else text = String(e.message || 'Script error').replace(/^Uncaught /, '');
    send({ type: 'console', level: 'error', text: 'Uncaught ' + text, line: e.lineno || 0 });
  });
  window.addEventListener('unhandledrejection', function (e) {
    var r = e.reason;
    send({
      type: 'console',
      level: 'error',
      text: 'Uncaught (in promise) ' + (r instanceof Error ? r.name + ': ' + r.message : fmt(r, 0, []))
    });
  });

  var makeStorage = function (area, initial) {
    var data = {};
    Object.keys(initial || {}).forEach(function (k) { data[k] = String(initial[k]); });
    var sync = function () { send({ type: 'storage', area: area, data: data }); };
    var store = {
      getItem: function (k) {
        k = String(k);
        return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null;
      },
      setItem: function (k, v) { data[String(k)] = String(v); sync(); },
      removeItem: function (k) { delete data[String(k)]; sync(); },
      clear: function () { data = {}; sync(); },
      key: function (i) {
        var keys = Object.keys(data);
        return i >= 0 && i < keys.length ? keys[i] : null;
      }
    };
    Object.defineProperty(store, 'length', { get: function () { return Object.keys(data).length; } });
    return store;
  };
  [['localStorage', 'local'], ['sessionStorage', 'session']].forEach(function (pair) {
    var usable = false;
    try { usable = !!window[pair[0]]; } catch (e) { usable = false; }
    if (usable) return;
    try {
      Object.defineProperty(window, pair[0], {
        value: makeStorage(pair[1], (cfg.storage || {})[pair[1]]),
        configurable: true,
        enumerable: true
      });
    } catch (e) {}
  });

  var loopCount = 0;
  var loopStart = 0;
  window.__wbLoop = function () {
    if (loopCount++ === 0) {
      loopStart = Date.now();
      setTimeout(function () { loopCount = 0; }, 0);
    }
    if (loopCount % 10000 === 0 && Date.now() - loopStart > 2000) {
      loopCount = 0;
      throw new RangeError('Vòng lặp chạy quá 2 giây, có thể là vòng lặp vô hạn. Playground đã dừng nó.');
    }
  };

  if (cfg.autoHeight) {
    var lastHeight = -1;
    var report = function () {
      var h = Math.ceil(document.documentElement.getBoundingClientRect().height);
      if (h !== lastHeight) {
        lastHeight = h;
        send({ type: 'height', value: h });
      }
    };
    if (typeof ResizeObserver === 'function') new ResizeObserver(report).observe(document.documentElement);
    window.addEventListener('load', report);
  }

  var resizeDone = null;
  var runTests = function (tests) {
    var helpers = {
      $: function (s) { return document.querySelector(s); },
      $$: function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); },
      css: function (el, prop) {
        if (typeof el === 'string') el = document.querySelector(el);
        return el ? getComputedStyle(el).getPropertyValue(prop).trim() : '';
      },
      text: function (el) {
        if (typeof el === 'string') el = document.querySelector(el);
        return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
      },
      sleep: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); },
      resize: function (width) {
        return new Promise(function (r) {
          resizeDone = r;
          send({ type: 'resize', width: width });
        });
      },
      logs: logs
    };
    var names = Object.keys(helpers);
    var values = names.map(function (n) { return helpers[n]; });
    var results = [];
    var index = 0;
    var next = function () {
      if (index >= tests.length) {
        send({ type: 'results', results: results });
        return;
      }
      var code = tests[index++];
      var settled = false;
      var timer = setTimeout(function () { finish(false, 'Quá 3 giây vẫn chưa chạy xong.'); }, 3000);
      var finish = function (pass, message) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        results.push({ pass: pass, message: message || '' });
        setTimeout(next, 0);
      };
      var fail = function (err) { finish(false, err && err.message ? err.message : String(err)); };
      try {
        var fn = Function.apply(null, names.concat(['return (async function () {\n' + code + '\n})();']));
        fn.apply(null, values).then(function (r) {
          finish(r === true, typeof r === 'string' ? r : '');
        }, fail);
      } catch (err) {
        fail(err);
      }
    };
    next();
  };

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.__wb !== TOKEN || e.source !== window.parent) return;
    if (d.type === 'run-tests') runTests(d.tests || []);
    else if (d.type === 'resized' && resizeDone) {
      var done = resizeDone;
      resizeDone = null;
      done();
    }
  });
  window.addEventListener('load', function () {
    setTimeout(function () { send({ type: 'ready' }); }, 30);
  });
})`
