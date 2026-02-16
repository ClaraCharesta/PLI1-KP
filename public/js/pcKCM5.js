// BACK
document.querySelector(".back").onclick = () => {
  window.history.back();
};

// CLEAR
document.querySelector(".clear").onclick = () => {
  document.getElementById("monitoring").value = "";
};

// VALIDASI
document.querySelector(".form-card")
.addEventListener("submit", function(e){

  const text = document
    .getElementById("monitoring")
    .value.trim();

  if(text.length < 3){
    e.preventDefault();
    alert("Isi monitoring terlalu pendek");
  }

});
