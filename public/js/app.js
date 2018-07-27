$(document).ready(function(){
  console.log("DOM ready");
  $("#scrapeModal").modal();

  $(document).on("click", "#scrapeBtn", function() {
    $.get("/scrape", function(data) {
      if (data.count) {
        $("#articleCount").text("You just scraped " + data.count + " new articles");
      } else {
        $("#articleCount").text("No new articles found");
      }

    });
  });

  $(document).on("click", "#saveBtn" ,function() {
    var id = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/savearticle/" + id
    })
    .then(function(data){
      console.log(data);
    });
  });




});