$(document).ready(function() {

    $.get("/api/scrape").then(function(data) {    
        createCard(data)
    })

    $.get("/api/articles").then(function(data) {    
        createCard(data)
    })

});