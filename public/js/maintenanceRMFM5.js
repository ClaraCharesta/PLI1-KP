// ENUM RUTE BM
const ruteEnum = [
  "EP Fan, SS 428 & Compressor GCT",
  "Grate Cooler, Roller Breaker & Kiln Hood",
  "CE Fan & Cooler Fan",
  "Kiln Drive & ID Fan",
  "Lt.1 Coal Mill & Booster Fan",
  "SS 448 & SS 468"
];

const ruteBM = document.getElementById("ruteBM");
const ruteLainnya = document.getElementById("ruteLainnya");

// isi enum
ruteEnum.forEach(r=>{
  const opt = document.createElement("option");
  opt.value = r;
  opt.textContent = r;
  ruteBM.appendChild(opt);
});

// option lainnya
const optLain = document.createElement("option");
optLain.value = "LAINNYA";
optLain.textContent = "Lainnya";
ruteBM.appendChild(optLain);

ruteBM.addEventListener("change",()=>{
  ruteLainnya.hidden = ruteBM.value !== "LAINNYA";
  if(ruteBM.value !== "LAINNYA") ruteLainnya.value = "";
});

// CLEAR
document.querySelector(".clear").onclick = ()=>{
  document.querySelectorAll("input, select, textarea").forEach(el=>{
    if(el.type !== "button") el.value = "";
  });
  ruteLainnya.hidden = true;
};

// BACK → arahkan ke halaman laporan KCM5
document.querySelector(".back").onclick = ()=>{
  window.location.href = "/laporanRMFM5"; // nanti buat filenya
};

