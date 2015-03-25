window.namespace = function(context, namespaceStr) {
  // Context is optional, defaults to window.
  if (namespaceStr === undefined) {
    namespaceStr = context;
    context = window;
  }

  var curPart = context;
  var parts = namespaceStr.split('.');

  while (parts.length > 0) {
    var nextPart = parts.shift();
    if (!(nextPart in curPart)) {
      curPart[nextPart] = {};
    }
    curPart = curPart[nextPart];
  }
  return curPart;
};
