maxPages = 10;

pagesMediaTypes = [
  "video", "gif", "audio", "image"
];

pagesOrdering = [
  "paragraph0",
  "paragraph1", "video1", "gif1", "audio1", "image1",
  "paragraph2", "video2", "gif2", "audio2", "image2",
  "paragraph3",
  "question"
];

pageIndex = 1;

function initPages() {
  var pageCount = 0;
  for (var curPage = 0; curPage <= maxPages; curPage++) {
    if ( typeof pageData[curPage] === "undefined" ) { continue; }
    pageCount += 1;

    pageId = "js-page__" + pageCount;

    pageDiv = "<div class='cs-page'" + " id='" + pageId + "' style='";

    if ( pageCount == 1 ) {
      pageDiv += "transform: translateX(0%);'>"
    } else {
      pageDiv += "transform: translateX(calc(48px + 100%));'>"
    }

    pageDiv += `
        <h2>` + pageData[curPage]["chapter"] + `.` +
        pageData[curPage]["unit"] + ` &nbsp; ` +
        pageData[curPage]["pageTitle"] + `</h2>
        </div>`;

    $("#js-pages").append(pageDiv);

    for (var i = 0; i <= pagesOrdering.length; i++) {
      var curParam = pagesOrdering[i];
      var curValue = pageData[curPage][curParam];

      if (isEmpty(curValue)) { continue; }
      var cleanParam = curParam.replace(/[0-9]/g, '');

      if ( cleanParam === "paragraph" ) {
        $("#" + pageId).append("<p>" + curValue + "</p>");
        continue;
      }

      if ( cleanParam === "image" ) {
        $("#" + pageId).append("<img src='./DATA/media/" + curValue + "'>");
        continue;
      }

      if ( cleanParam === "gif" ) {
        $("#" + pageId).append("<img src='./DATA/media/" + curValue + "'>");
        continue;
      }

      if ( cleanParam === "video" ) {
        if ( !curValue.endsWith(".mp4") ) { alert(curValue); }

        $("#" + pageId).append(`
          <video controls>
            <source src="./DATA/media/` + curValue + `" type="video/mp4">
          </video>
        `)
        continue;
      }

      if ( cleanParam === "audio" ) {
        if ( !curValue.endsWith(".mp3") ) { alert(curValue); }

        $("#" + pageId).append(`
          <audio controls>
            <source src="./DATA/media/` + curValue + `" type="audio/mpeg">
          </audio>
        `)
        continue;
      }

      if ( cleanParam == "question" ) {
        var questionChoices = pageData[curPage]["questionChoices"];
        var correctAnswer = pageData[curPage]["correctAnswer"];

        if ( isEmpty(questionChoices) ) { alert(curValue) }
        if ( isEmpty(correctAnswer) || correctAnswer == -1 ) { alert(curValue) }

        $("#" + pageId).append(`
          <br><br><br><hr><br><h3> Q: &nbsp; ` + curValue + `</h3>
        `)

        for (var j = 0; j < questionChoices.length; j++) {
          $("#" + pageId).append(`<button style="font-weight: bold;" class="js-answer__` + (1+j) + `">` + questionChoices[j] + `</button> <br><br>`)
        }

        $("#" + pageId + " button").on("click", function(curEvent) {
          tmpAnswer = parseInt(curEvent.target.className.match(/\d+/)[0]);

          if ( tmpAnswer == correctAnswer ) {
            curEvent.target.style["backgroundColor"] = "lightgreen";
          } else {
            curEvent.target.style["backgroundColor"] = "coral";
          }
        })

        continue;
      }

      console.log(cleanParam)
    }

    $("#" + pageId).append("<br><br>");
  }

  for (var k = 1; k <= pageCount; k++) {
    if ( k == 1 ) {
      $("#js-pagination-boxes").append(`
        <div class='cs-pagination-box cs-active' id='js-pagination-box__` + k + `'>&nbsp;</div>
      `)
    } else {
      $("#js-pagination-boxes").append(`
        <div class='cs-pagination-box' id='js-pagination-box__` + k + `'>&nbsp;</div>
      `)
    }
  }

  $("#js-left-button").off("click");
  $("#js-right-button").off("click");

  function slidePage(pageIndex) {
    $(".cs-pagination-box").removeClass("cs-active");
    $("#js-pagination-box__" + pageIndex).addClass("cs-active");

    for (var curPage = 1; curPage < pageIndex; curPage++) {
      $("#js-page__" + curPage).css("transform", " translateX(calc(-48px - 100%))");
    }

    $("#js-page__" + pageIndex).css("transform", " translateX(0%)");

    for (var curPage = 1+pageIndex; curPage <= pageCount; curPage++) {
      $("#js-page__" + curPage).css("transform", " translateX(calc(+48px + 100%))");
    }
  }

  $("#js-left-button").on("click", function() {
    pageIndex -= 1;
    if ( pageIndex < 1 ) { pageIndex = 1; }
    slidePage(pageIndex)
  });

  $("#js-right-button").on("click", function() {
    pageIndex += 1;
    if ( pageIndex > pageCount ) { pageIndex = pageCount; }
    slidePage(pageIndex)
  });
};
