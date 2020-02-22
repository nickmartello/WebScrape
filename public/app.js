$(document).on("click", ".save", function() {

  var thisId = $(this).attr("id");

  $.ajax({
    method: "PUT",
    url: "/api/articles/" + thisId,
    data: {
      id: $(this).attr("id"),
      saved: $(this).attr("saved")
    }
  })
    .then(function(data) {
      console.log(data);
    });
});

$(document).on("click", ".read", function() {
});

$(document).on("click", ".note", function() {

  var thisId = $(this).attr("id");
  $(".submitNote").attr("note-id", thisId)

  $.ajax({
    method: "GET",
    url: "/api/articles/" + thisId
  })
    .then(function(data) {
      createModal(data)
    });
});

$(document).on("click", ".submitNote", function() {
  event.preventDefault()
  console.log("this works")

  var thisId = $(this).attr("note-id");
  console.log("*-*-*-*-")
  console.log(thisId)
  console.log("*-*-*-*-")  

  $.ajax({
    method: "POST",
    url: "/api/articles/" + thisId,
    data: {
      title: $(".noteTitle").val(),
      body: $(".articleNote").val()
    }
  })
    .then(function(data) {
      $("#notes").hide()
      $(".noteTitle").val("")
      $(".articleNote").val("")
    });

});


function createCard(data) {

  for (let i = 0; i < data.length; i++) {  

      let mydiv = $("<div>")
        .addClass("card w-100 m-3 p-3")
        .addClass("theCard")
        .addClass("align-top")
        .attr("style", "width: 18rem;")
        .attr("id", "cardBody")

      let divBody = $("<div>").addClass("card-body");

      let theTitle = $("<p>")
        .addClass("card-text")
        .html(`<h2>${data[i].title}</h2>`)

      let theBody = $("<p>")
        .addClass("card-text")
        .html(data[i].blurb ? `${data[i].blurb}` : `<p>Sorry - No Summary Available</p> `)

      var saveBtn = $("<button>")
        .attr("id", data[i]._id)
        .attr("saved", data[i].saved)
        .addClass("save")
        .addClass("btn btn-warning")
        .addClass("btn-sm")
        .html(data[i].saved ? " Remove Article " :  " Save Article ")
    
      var noteBtn = $("<button>")
        .attr("id", data[i]._id)
        .addClass("note")
        .addClass("btn btn-warning")
        .addClass("btn-sm")
        .html(" Create Note ")
 
      let applySave = $("<td class='align-middle'>").html(saveBtn);
      let applyNote = $("<td class='align-middle'>").html(noteBtn);
      
      mydiv.append(divBody);
      // mydiv.append(theImg);
      mydiv.append(theTitle);
      mydiv.append(theBody);
      mydiv.append(applySave);
      mydiv.append(applyNote);
      $(".articles").append(mydiv)
      }   
  };
  


function createModal(project) {
  console.log(project)

  $("#project-modal").remove()

      let modal = $("<div>").addClass("modal fade")
          .attr("id" , "project-modal")
          .attr("tabindex", "-1")
          .attr("role", "dialog")
          .attr("aria-labelledby", "exampleModalCenterTitle")
          .attr("aria-hidden", "true")
      let modalDialog = $("<div>").addClass("modal-dialog modal-dialog-centered")
          .attr("role", "document")
      let modalContent = $("<div>").addClass("modal-content")
      let modalHeader = $("<div>").addClass("modal-header theModal")
          .html(`<h5 class="modal-title" id="exampleModalLongTitle">${project.title}</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                      </button>`)
      let modalBody = $("<div>").addClass("modal-body")

      

                      
      let modalFooter = $("<div>").addClass("modal-footer theModal")
          .html(`
          <button type="button" class="btn btn-secondary submitNote" data-dismiss="modal" note-id=${project._id}>Submit</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          `)
       
      modalContent.append(modalHeader)
      modalContent.append(modalBody)
      modalContent.append(modalFooter)
      modalDialog.append(modalContent)
      modal.append(modalDialog)
      $("body").append(modal)

      if (project.note) {
        $(".noteTitle").val(project.note.title);
        $(".articleNote").val(project.note.body);
      }

      $("#project-modal").modal('show')
}