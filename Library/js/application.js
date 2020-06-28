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

pageData = [];
pageLoaded = [];

lessonHeader = undefined;

function addLesson(inputLessonHeader) {
  lessonHeader = inputLessonHeader;

  for (var curPage = 0; curPage <= maxPages; curPage++) {
    pageData.push(undefined);
    pageLoaded.push(false);
  }

  for (var curPage = 0; curPage <= maxPages; curPage++) {
    addLessonScript(curPage)
  }
}

function _addLessonScript(curPage) {
  return function () {
    pageLoaded[curPage] = true;
    if ( pageLoaded.every(Boolean) ) {
      $(document).ready(function() {
        initPages();
      })
    }
  }
}

function addLessonScript(curPage) {
  var script = document.createElement('script');
  script.src = "DATA/pages/page-" + curPage + ".js";

  script.onload = _addLessonScript(curPage);
  script.onerror = _addLessonScript(curPage);

  document.head.appendChild(script);
}
