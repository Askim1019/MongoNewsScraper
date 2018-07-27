$(document).ready(function () {
  console.log("DOM ready");
  $("#scrapeModal").modal();
  $("#commentModal").modal();
  
  $(document).on("click", "#scrapeBtn", function () {
    $.get("/scrape", function (data) {
      if (data.count) {
        $("#articleCount").text("You just scraped " + data.count + " new articles");
      } else {
        $("#articleCount").text("No new articles found");
      }

    });
  });

  $(document).on("click", "#saveBtn", function () {
    var id = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/savearticle/" + id
    })
      .then(function (data) {
        console.log(data);
      });
  });



  $(document).on("click", "#viewNotes", function () {
    var articleId = $(this).attr("data-id");
    getComments(articleId);
  });

  // Delete an article
  $(document).on("click", "#deleteArticle", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
      method: "POST",
      url: "/deletearticle/" + thisId
    })
      .then(function () {
        $(this).remove();
      });
  });

  // Delete a note
  $(document).on("click", "#deletecomment", function () {
    var commentId = $(this).attr("data-id");
    var articleId = $(this).attr("data-article-id");

    $.ajax({
      method: "POST",
      url: "/deletecomment/" + commentId
    })
      .then(function () {
        getComments(articleId);
      });
  });

  // Save comment
  $(document).on("click", "saveComment", function () {
    var articleId = $(this).attr("data-id");
    var newComment = $("#bodyinput").val();

    $.ajax({
      method: "POST",
      url: "/articles/" + articleId,
      data: { body: newComment }
    })
      .then(function (data) {
        getComments(articleId);
      });

    $("#bodyinput").val("");
  });


  function getComments(articleId) {
    $("#commentModalTitle").text("Article: " + data.headline);
    $("#saveCommentBtn").attr("data-id", data._id);
    $("#displayComments").empty();

    if (data.comments.length) {
      for (var i = 0; i < data.comment.length; i++) {
        var card = $("<div>").addClass("card mb-2");
        var cardBody = $("<div>").addClass("card-body").text(data.comment[i].body);

        // Delete button
        var deleteButton = $("<button>").addClass("waves-effect waves-light btn");
        deleteButton.attr("id", "deletecomment");
        deleteButton.attr("data-id", data.comment[i]._id);
        deleteButton.attr("data-article-id", data._id);
        deleteButton.text("Delete");

        cardBody.append(deleteButton);
        card.append(cardBody);
        $("#displayComments").append(card);
      }
    } else {
      $("#displayComments").text("There are no comments here");
    }

    $('#viewComments[data-id="' + data._id + '"]').text("Comments (" + data.comment.length + ")");
  }


});