// -------------------
// jQuery DOM Practice
// -------------------

/* PART-II */
//-----------

$('form').submit(function(event) {
  event.preventDefault();
  const movieTitle = event.target[0].value;
  const movieRating = event.target[1].value;

  $("ul").append(`<li>${movieTitle} ${movieRating}  <button class='delete'>DELETE</button></li>`).append("");
})

$('ul').on('click', '.delete', function(event) {
  $(this).parent().remove();
});