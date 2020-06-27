function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]"
}

function isEmpty(x) {
  if ( typeof x === "undefined" ) { return true; }

  if ( isString(x) ) {
    if ( x === "" ) { return true; }
  } else if ( Array.isArray(x) ) {
    if ( x.length == 0 ) { return true; }
  } else {
    if ( isNaN(x) ) { return true; }
  }

  return false;
}

pageData = {};
pageLoaded = {};
