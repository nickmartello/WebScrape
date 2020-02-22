$(document).ready(function() {

    $.get("/api/saved").then(function(data) {    
        createCard(data)
    })
});