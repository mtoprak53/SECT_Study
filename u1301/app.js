// -------------------
// jQuery DOM Practice
// -------------------

/* PART-I */
// ---------

// #1
$(document).ready(function() {
  console.log("Let's get ready to party with jQuery!");
});

// #2
$('article img').addClass('image-center');

// #3
$('p:last').remove();

// #4
$('#title').css('font-size', `${Math.floor(101 * Math.random())}px`);

// #5
$('ol').append("<li>Hey I am added to the list!!!</li>");

// #6
$('aside').empty();
$('aside').append("<p>We apologize for the disturbance of former silly ordered list. It will not be repreated.</p>");

// #7
$('.form-control').change(function() {
  const rgb = [];
  for(el of $('.form-control').get()) {
    rgb.push(el.value);
  }
  $('body').css('background-color', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
});

// #8
$('img').on('click', function() {
  $(this).remove();
});