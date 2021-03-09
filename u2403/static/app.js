
const submitForm = async () => {
  const flavor = $('#flavor').val();
  const size = $('#size').val();
  const rating = $('#rating').val();
  const image = $('#image').val();

  const params = { flavor, size, rating, image }
  const response = await axios.post("/api/cupcakes", params);
  const id = response.data.cupcake.id;

  const $button = $("<button>").addClass("delete-cupcake badge badge-danger").data("id", `${id}`).text("X");
  const $li = $("<li>").text(`${flavor} / ${size} / ${rating}`).append($button);
  $('#cupcake-list').append($li);
}

$('#add-cupcake-form').on("submit", function(event) {
  event.preventDefault();
  submitForm();
});

$('.delete-cupcake').click(deleteCupcake);

async function deleteCupcake() {
  const id = $(this).data('id');
  await axios.delete(`/api/cupcakes/${id}`);
  $(this).parent().parent().remove();
}