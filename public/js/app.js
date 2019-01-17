$(document).ready(function () {

    $("#scraped-article").on("click", function () {
        $("tbody").empty();
        $.getJSON("/scraping-articles")
    })



})
