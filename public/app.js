$(document).ready(function () {
  $(document).on("click", ".scrape-new", scrapeArticle);
  $(document).on("click", ".clear", clearArticle);
  $(document).on("click", ".clear-saved", clearSavedArticle);
  $(document).on("click", ".save", saveArticle);
  $(document).on("click", ".delete", deleteSavedArticle);
  $(document).on("click", ".notes", addNotesToArticle);
  $(document).on("click", ".note-save", saveNote);
  $(document).on("click", ".note-delete", deleteNote);

  function scrapeArticle() {
      $(".article-container").prepend('<div class="loader"></div>');
      $.get("/api/fetch").then(function (data) {
          console.log(data)
          setTimeout(
              function () {
                  window.location.href = "/";
              }, 2000);
      });
  }

  function clearArticle() {
      $.get("/api/clear").then(function (data) {
          console.log(data)
          $(".articleContainer").empty();
          location.reload();
      });
  }

  function clearSavedArticle() {
      $.get("/api/clear/saved").then(function (data) {
          console.log(data)
          $(".articleContainer").empty();
          location.reload();
      });
  }

  function saveArticle() {
      let articleID = $(this)
          .parents(".card")
          .data();

      $(this)
          .parents(".card")
          .remove();

      $.ajax({
          method: "PUT",
          url: "/api/save/" + articleID._id
      }).then(function (data) {
          console.log(data);
      });
  }

  function deleteSavedArticle() {
      let articleID = $(this)
          .parents(".card")
          .data();

      $(this)
          .parents(".card")
          .remove();

      $.get("/api/deleteSaved/" + articleID._id);
  }

  function addNotesToArticle() {
      let articleID = $(this)
          .parents(".card")
          .data();

      $.get("/api/notes/" + articleID._id).then(function (data) {
          console.log(data)
          let modalText = $("<div class='container-fluid text-center'>").append(
              $("<h4>").text("Notes For Article: " + articleID._id),
              $("<hr>"),
              $("<ul class='list-group note-container'>"),
              $("<textarea placeholder='New Note' rows='4' cols='50'>"),
              $("<button class='btn btn-success note-save'>Save Note</button>")
          );
          console.log(modalText)
          bootbox.dialog({
              message: modalText,
              closeButton: true
          });
          let noteData = {
              _id: articleID._id,
              notes: data || []
          };
          console.log('noteData:' + JSON.stringify(noteData))
          $(".note-save").data("article", noteData);
          getAllNotes(noteData);
      });
  }

  function deleteNote() {
      let noteID = $(this).data("_id");
      $.ajax({
          url: "/api/notes/" + noteID,
          method: "DELETE"
      }).then(function () {
          bootbox.hideAll();
      });
  }

  function saveNote() {
      let noteData;
      let newNote = $(".bootbox-body textarea")
          .val()
          .trim();
      console.log(newNote);
      if (newNote) {
          noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
          console.log(noteData);
          $.post("/api/notes", noteData).then(function () {
              bootbox.hideAll();
          });
      }
  }

  function getAllNotes(data) {
      let notesToRender = [];
      let currentNote;
      if (!data.notes.length) {
          currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
          notesToRender.push(currentNote);
      } else {
          for (let i = 0; i < data.notes.length; i++) {
              currentNote = $("<li class='list-group-item note'>")
                  .text(data.notes[i].noteText)
                  .append($("<button class='btn btn-danger note-delete'>x</button>"));
              currentNote.children("button").data("_id", data.notes[i]._id);
              notesToRender.push(currentNote);
          }
      }
      $(".note-container").append(notesToRender);
  }
});