// SAVE
document.querySelector(".save").onclick = () => {
  const RM1Feeding = document.getElementById("RM1Feeding").value;
  const RM2Feeding = document.getElementById("RM2Feeding").value;
  const CM1Feeding = document.getElementById("CM1Feeding").value;
  const CM2Feeding = document.getElementById("CM2Feeding").value;

  if (!RM1Feeding || !RM2Feeding || !CM1Feeding || !CM2Feeding) {
    alert("Silakan isi semua field!");
    return;
  }

  alert(
    "Data berhasil disimpan:\n" +
    "Raw Mill 1 Feeding: " + RM1Feeding + "\n" +
    "Raw Mill 2 Feeding: " + RM2Feeding + "\n" +
    "Cement Mill 1 Feeding: " + CM1Feeding + "\n" +
    "Cement Mill 2 Feeding: " + CM2Feeding
  );

  // nanti bisa tambah fetch/ajax untuk kirim ke backend
};

// BACK
document.querySelector(".back").onclick = () => {
  window.location.href = "/laporanPC_RM_FM5"; // sesuaikan rute kalau beda
};

// CLEAR
document.querySelector(".clear").onclick = () => {
  document.querySelectorAll("input").forEach(input => {
    input.value = "";
  });
};
