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

nextQuestion = undefined;

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
        if ( typeof nextQuestion === "undefined" ) {
          nextQuestion = pageCount;
        }

        var questionChoices = pageData[curPage]["questionChoices"];
        if ( isEmpty(questionChoices) ) { alert(curValue) }

        $("#" + pageId).append(`
          <br><br><br><hr><br><h3> Q: &nbsp; ` + curValue + `</h3>
        `)

        var tmpFunction = function (curChoice) {
          return function(curEvent) {
            $(curEvent.target.parentElement.parentElement).children("div").children("button").css("backgroundColor", "");
            curEvent.target.style["backgroundColor"] = "coral";

            $(curEvent.target.parentElement).children("span").css("color", "red");
            $(curEvent.target.parentElement.parentElement).children("div").children("span").text("");
            $(curEvent.target.parentElement).children("span").text(curChoice);
          }
        }

        for (var j = 0; j < questionChoices.length; j++) {
          var questionClass = "js-answer__" + (1+j);

          if ( Array.isArray(questionChoices[j]) ) {
            $("#" + pageId).append(`<div><button style="font-weight: bold;" class="js-answer ` + (questionClass) + `">` + questionChoices[j][0] + `</button>&nbsp;&nbsp;&nbsp;<span class="js-reason"></span></div><br><br>`)

            $("#" + pageId + " ." + questionClass).on("click", tmpFunction(questionChoices[j][1]))
          } else {
            $("#" + pageId).append(`<div><button style="font-weight: bold;" class="js-answer ` + (questionClass) + `">` + questionChoices[j] + `</button>&nbsp;&nbsp;&nbsp;<span class="js-reason"></span></div><br><br>`)

            $("#" + pageId + " ." + questionClass).on("click", function(curEvent) {
              $(curEvent.target.parentElement.parentElement).children("div").children("button").css("backgroundColor", "");
              curEvent.target.style["backgroundColor"] = "lightgreen";

              $(curEvent.target.parentElement).children("span").css("color", "green");
              $(curEvent.target.parentElement.parentElement).children("div").children("span").text("");
              $(curEvent.target.parentElement).children("span").text("Correct!")

              otherId = curEvent.target.parentElement.parentElement.id;
              for (var k = 0; k < questionChoices.length; k++) {
                var otherClass = "js-answer__" + (1+k);
                $("#" + otherId + " ." + otherClass).off("click")
              }

              $("#js-right-button").on("click", rightButtonClick);
              $("#js-right-button").removeClass("cs-disable");

              nextQuestion = $(".js-question-page").map(function() { return parseInt(this.id.match(/\d+/)[0]); }).get().filter(function(curIndex) { return curIndex > nextQuestion; })[0];
            })
          }
        }

        $("#" + pageId).addClass("js-question-page");

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

    if ( pageIndex > nextQuestion ) { alert("You skipped a question!"); }

    if ( $("#js-page__" + pageIndex).hasClass("js-question-page") && pageIndex == nextQuestion ) {

      $("#js-right-button").off("click");
      $("#js-right-button").addClass("cs-disable");
    }
  }

  function leftButtonClick() {
    pageIndex -= 1;
    if ( pageIndex < 1 ) { pageIndex = 1; }
    if ( pageIndex == 1 ) {
      $("#js-left-button").addClass("cs-disable");
    }

    slidePage(pageIndex)

    $("#js-right-button").off("click");
    $("#js-right-button").on("click", rightButtonClick);
    $("#js-right-button").removeClass("cs-disable");
  }

  function rightButtonClick() {
    $(".js-reason:contains('Correct!')").text("");

    $("#js-left-button").off("click");
    $("#js-left-button").on("click", leftButtonClick);
    $("#js-left-button").removeClass("cs-disable");

    pageIndex += 1;

    pageLimit = nextQuestion || pageCount;
    if ( pageIndex >= pageLimit ) {
      pageIndex = pageLimit;
      $("#js-right-button").off("click");
      $("#js-right-button").addClass("cs-disable");
    }

    slidePage(pageIndex)
  }

  if ( ( nextQuestion || pageCount ) == 1 ) {
    $("#js-right-button").addClass("cs-disable");
  } else {
    $("#js-right-button").on("click", rightButtonClick);
  }
};
