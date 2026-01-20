// SAVE
document.querySelector(".save").onclick = ()=>{
  const kilnFeeding = document.getElementById("kilnFeeding").value;
  const kilnSpeed = document.getElementById("kilnSpeed").value;

  if(!kilnFeeding || !kilnSpeed){
    alert("Silakan isi semua field!");
    return;
  }

  alert("Data berhasil disimpan:\nKiln Feeding: "+kilnFeeding+"\nKiln Speed: "+kilnSpeed);
  // nanti bisa tambah fetch/ajax untuk kirim ke backend
};

// BACK → arahkan ke halaman laporan KCM5
document.querySelector(".back").onclick = ()=>{
  window.location.href = "/laporanRMFM5"; // nanti buat filenya
};

// CLEAR
document.querySelector(".clear").onclick = ()=>{
  document.querySelectorAll("input, select, textarea").forEach(el=>{
    if(el.type !== "button") el.value = "";
  });
  ruteLainnya.hidden = true;
};