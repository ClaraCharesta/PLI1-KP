// CLEAR
document.querySelector(".clear").onclick = () => {
  document.getElementById("catatan").value = "";
};

// BACK → arahkan ke halaman laporan KCM5
document.querySelector(".back").onclick = ()=>{
  window.location.href = "/laporanKCM5"; // nanti buat filenya
};

// SAVE (dummy dulu)
document.querySelector(".save").onclick = () => {
  const catatan = document.getElementById("catatan").value.trim();

  if (!catatan) {
    alert("Catatan tidak boleh kosong");
    return;
  }

  alert("Catatan KCM 5 siap disimpan");
};
