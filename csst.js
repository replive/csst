(function(exportName) {
  var exports = exports || {};
  /**
   * @file csst
   *
   * CSS Text Transformation
   * @author
   *   zswang (http://weibo.com/zswang)
   * @version 0.0.2
   * @date 2016-05-06
   */
  var count = 0;
  /**
   * 调用 CSST
   *
   * @param {string} url 服务连接
   * @param {Object|Function} opts/fn 配置项
   * @param {Function} fn 回调函数
   * @see https://github.com/webmodules/jsonp
   */
  function csst(url, opts, fn) {
    if ('function' == typeof opts) {
      fn = opts;
      opts = {};
    }
    opts = opts || {};
    var prefix = opts.prefix || '__csst';
    // use the className name that was passed if one was provided.
    // otherwise generate a unique name by incrementing our counter.
    var id = opts.name || (prefix + (count++));
    var param = opts.param || 'id';
    var timeout = typeof opts.timeout !== 'undefined' ? timeout : null;
    var timer;
    if (timeout) {
      timer = setTimeout(function() {
        cleanup();
        if (fn) {
          fn(new Error('Timeout'));
        }
      }, timeout);
    }
    function cleanup() {
      if (link && link.parentNode) {
        link.parentNode.removeChild(link);
        link = null;
      }
      if (span && span.parentNode) {
        span.parentNode.removeChild(span);
        span = null;
      }
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn = null;
    }
    function handler() {
      if (fn) {
        var content = getComputedStyle(span, false).content;
        // 移除两边引号
        content = content.replace(/^("|')([^]*)\1$/, "$2");
        fn(null, content);
      }
      cleanup();
    }
    var head = document.querySelector('head');
    var link = document.createElement('link');
    var span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.top = '-100px';
    span.id = id;
    document.documentElement.appendChild(span);
    span.addEventListener('animationstart', handler, false);
    span.addEventListener('webkitAnimationStart', handler, false);
    url += (url.indexOf('?') >= 0 ? '&' : '?') + param + '=' + encodeURIComponent(id);
    url = url.replace('?&', '?');
    link.href = url;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
    return cleanup;
  }
  var exports = csst;
  if (typeof define === 'function') {
    if (define.amd) {
      define(function() {
        return exports;
      });
    }
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  } else {
    window[exportName] = exports;
  }
})('csst');