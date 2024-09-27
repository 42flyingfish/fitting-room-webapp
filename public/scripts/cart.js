function postRequest(id){
  $.post(document.URL,
  {
    id: id,
  },
  function(data, status){
    window.location.href = "http://localhost:3000/basket";
  });
}