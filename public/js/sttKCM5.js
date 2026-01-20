// ENUM DATA
const enumAda = ["Ada", "Tidak Ada"];
const enumLengkap = ["Lengkap", "Tidak Lengkap"];

// helper isi select TANPA None
function fillSelect(id, values) {
  const el = document.getElementById(id);

  values.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    el.appendChild(opt);
  });
}

// isi dropdown
fillSelect("kunciMobil", enumAda);
fillSelect("kunciMotor", enumAda);
fillSelect("kunciSubst", enumLengkap);
fillSelect("toolset", enumLengkap);

// CLEAR
document.querySelector(".clear").onclick = ()=>{
  document.querySelectorAll("input, select, textarea").forEach(el=>{
    if(el.type !== "button") el.value = "";
  });
  ruteLainnya.hidden = true;
};

// BACK → arahkan ke halaman laporan KCM5
document.querySelector(".back").onclick = ()=>{
  window.location.href = "/laporanKCM5"; // nanti buat filenya
};

// SAVE (dummy)
document.querySelector(".save").onclick = () => {
  alert("Data STT KCM 5 siap disimpan");
};
