maxPages = 10;

pagesMediaTypes = [
  "video", "gif", "audio", "image"
];

pagesOrdering = [];

for (var i = 0; i <= 9; i++) {
  tmpOrder = ["paragraph"].concat(pagesMediaTypes);
  pagesOrdering = pagesOrdering.concat(
    tmpOrder.map(function(curVar) { return curVar + i })
  );
}

pagesOrdering = pagesOrdering.concat(["question"]);

pageIndex = 1;

nextQuestion = undefined;

gifLoaded = {};
gifIntervals = {};
gifProgresses = {};
gifPlaytimes = {};

function loadGIF(gifID, sequence, playtime) {
  if ( gifLoaded[[gifID, sequence]] === true ) { return; }
  gifLoaded[[gifID, sequence]] = true;

  if ( sequence === 1 ) {
    if ( typeof gifLoaded[[gifID, 2]] === "undefined" ) { return; }
  } else if ( sequence === 2 ) {
    gifPlaytimes[gifID] = playtime;
    if ( typeof gifLoaded[[gifID, 1]] === "undefined" ) { return; }
  } else {
    alert("Invalid sequence for loadGIF")
  }

  var manual = new Freezeframe("#" + gifID + " img", {
    trigger: false, responsive: false
  });

  $("#" + gifID + " .cs-row:last-child .cs-col:last-child").width(
    $("#" + gifID + " .cs-row:first-child .cs-col:last-child").width()
  );

  var curAudio = $("#" + gifID + " audio")[0];

  $("#" + gifID + " .js-play-button").click(function(curEvent) {
    if ( curEvent.target.firstChild.textContent == "▶️" ) {
      curEvent.target.firstChild.textContent = "⏹️";
      manual.start();
      if ( typeof curAudio !== "undefined" ) { curAudio.play(); }

      gifProgresses[gifID] = 0;

      intervalLength = 0.05;
      gifIntervals[gifID] = setInterval(function(){
        gifProgresses[gifID] += intervalLength;

        if ( gifProgresses[gifID] >= gifPlaytimes[gifID] ) {
          curEvent.target.click();
        } else {
          $("#" + gifID + " progress")[0].value = String(parseInt(Math.ceil(100*gifProgresses[gifID]/gifPlaytimes[gifID])));
        }
      },1000*intervalLength);

    } else {
      curEvent.target.firstChild.textContent = "▶️";
      manual.stop();
      if ( typeof curAudio !== "undefined" ) {
        curAudio.pause();
        curAudio.currentTime = 0;
      }

      if ( typeof gifIntervals[gifID] !== "undefined" ) {
        clearInterval(gifIntervals[gifID]);
        gifIntervals[gifID] = undefined;

        gifProgresses[gifID] = 0;
        $("#" + gifID + " progress")[0].value = "0";
      }
    }
  })

  $("#" + gifID + " .js-sound-button").click(function(curEvent) {
    if ( curEvent.target.firstChild.textContent == "🔈" ) {
      curEvent.target.firstChild.textContent = "🔇";
      curAudio.muted = true;
    } else {
      curEvent.target.firstChild.textContent = "🔈";
      curAudio.muted = false;
    }
  })
}

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
        splitValues = curValue.trim().split("\n");
        for (var j = 0; j < splitValues.length; j++) {
          $("#" + pageId).append("<p>" + splitValues[j].trim() + "</p>");
        }
        continue;
      }

      if ( cleanParam === "image" ) {
        $("#" + pageId).append("<img src='./DATA/media/" + curValue + "'>");
        continue;
      }

      if ( cleanParam === "gif" ) {
        var gifID = "js-gif__" + pageCount + "-" + i;
        var gifDiv = `<div class="cs-gif" id="` + gifID + `">`

        var audioParam = pageData[curPage][curParam.replace('gif', 'audio')];
        var playtimeParam = pageData[curPage][curParam.replace('gif', 'playtime')];

        gifDiv += `<div class="cs-row"><div class="cs-col">`;

        if ( !isEmpty(audioParam) ) {
          gifDiv += `
            <button class="cs-button js-sound-button"><h1>🔈</h1></button>

            <audio>
              <source src="./DATA/media/` + audioParam + `" type="audio/mpeg">
            </audio>
          `;
        } else {
          gifDiv += `
            <button class="cs-button js-sound-button" style="visibility: hidden;"><h1>🔈</h1></button>
          `;
        }

        gifDiv += `</div><div class="cs-col"><img onload="loadGIF('` + gifID + `', 1)" src='./DATA/media/` + curValue + `'></div></div>`;
        gifDiv += `<div class="cs-row"><div class="cs-col"><button class="cs-button js-play-button"><h1>▶️</h1></button></div><div class="cs-col"><progress class="cs-gif-progress" value="0" max="100"></progress></div></div>`;

        gifDiv += `</div>`;

        $("#" + pageId).append(gifDiv);

        if ( !isEmpty(audioParam) ) {
          if ( playtimeParam !== -1 ) { alert("Redundant playtime information for gif!"); }
          if ( !audioParam.endsWith(".mp3") ) { alert(audioParam); }

          $("#" + pageId + " audio")[0].addEventListener("loadeddata", function(curEvent) {
            loadGIF(gifID, 2, curEvent.target.duration);
          })
        } else {
          if ( playtimeParam === -1 ) { alert("Missing playtime information for gif!"); }
          loadGIF(gifID, 2, playtimeParam)
        }

        continue;
      } else if ( cleanParam === "audio" ) {
        var gifParam = pageData[curPage][curParam.replace('audio', 'gif')];

        if ( isEmpty(gifParam) ) {
          if ( !curValue.endsWith(".mp3") ) { alert(curValue); }

          $("#" + pageId).append(`
            <audio controls>
              <source src="./DATA/media/` + curValue + `" type="audio/mpeg">
            </audio>
          `)
        }

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
            $("#" + pageId).append(`<div><button style="font-weight: bold; font-size: large;" class="js-answer ` + (questionClass) + `">` + questionChoices[j][0] + `</button>&nbsp;&nbsp;&nbsp;<span class="js-reason"></span></div><br><br>`)

            $("#" + pageId + " ." + questionClass).on("click", tmpFunction(questionChoices[j][1]))
          } else {
            $("#" + pageId).append(`<div><button style="font-weight: bold; font-size: large;" class="js-answer ` + (questionClass) + `">` + questionChoices[j] + `</button>&nbsp;&nbsp;&nbsp;<span class="js-reason"></span></div><br><br>`)

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
