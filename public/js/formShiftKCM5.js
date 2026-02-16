/* ================= DATA ================= */
const personilData = [
  "[ISD] Irsyadunnas",
  "[RKB] Rafki Budiman",
  "[SLM] Salman",
  "[RKS] Riki Sulaiman",
  "[WIK] Wahyu Ikhsan",
  "[MFS] Meri Fernandes",
  "[MTR] Martu Rizal",
  "[SEP] Sepriadi"
];

const shiftData = ["01","02","03","A","B","LIBUR"];
let personilMaster = [...personilData];

/* ================= INIT ELEMENTS ================= */
const shiftUtama = document.getElementById("shiftUtama");
const noref = document.getElementById("noref");
const tanggalInput = document.getElementById("tanggal");
const cutiBox = document.getElementById("cutiBox");
const cutiResult = document.getElementById("cutiResult");

/* ================= GENERATE NO REF ================= */
function generateNoRef() {
  const d = tanggalInput.value ? new Date(tanggalInput.value) : new Date();
  const bulan = d.getMonth() + 1;
  const tahun = d.getFullYear();
  const urut = "0001";
  return `${urut}/SHIFT.PLI1-KCM5/${bulan}.${tahun}`;
}

/* ❗ Jangan overwrite saat edit */
if(!window.formData?.no_ref){
  noref.value = generateNoRef();
}

tanggalInput.addEventListener("change", () => {
  if(!window.formData?.no_ref){
    noref.value = generateNoRef();
  }
});

/* ================= SHIFT UTAMA ================= */
/* ❗ Jangan recreate option — pakai dari EJS */
if(window.formData?.shift_kode){
  shiftUtama.value = window.formData.shift_kode;
}

/* ================= PERSONIL SELECT ================= */
document.querySelectorAll(".personil").forEach(select => {

  const key = select.dataset.key;
  const existing = window.formData?.["personil_" + key];

  /* Tambah ke master kalau belum ada */
  if(existing && !personilMaster.includes(existing)){
    personilMaster.push(existing);
  }

  /* Isi option */
  select.innerHTML = "<option value=''>-- Pilih Personil --</option>";
  personilMaster.forEach(p => select.add(new Option(p,p)));
  select.add(new Option("LAINNYA","LAINNYA"));

  /* Set selected */
  if(existing){
    select.value = existing;
  }

  /* Input lainnya */
  const lainnyaDiv = document.createElement("div");
  lainnyaDiv.className = "lainnya-input";
  lainnyaDiv.style.display = select.value === "LAINNYA" ? "block" : "none";

  const lainnyaInput = document.createElement("input");
  lainnyaInput.type = "text";
  lainnyaInput.placeholder = "Masukkan nama personil baru...";
  lainnyaDiv.appendChild(lainnyaInput);

  select.parentNode.appendChild(lainnyaDiv);

  select.addEventListener("change", () => {
    lainnyaDiv.style.display =
      select.value === "LAINNYA" ? "block" : "none";
  });

});

/* ================= SHIFT PER PERSONIL ================= */
document.querySelectorAll(".shift").forEach(select => {

  const key = select.dataset.key;

  select.innerHTML = "<option value=''>-- Pilih Shift --</option>";
  shiftData.forEach(s => select.add(new Option(s,s)));

  const existing = window.formData?.["shift_" + key];
  if(existing){
    select.value = existing;
  }

});

/* ================= CUTI ================= */
cutiBox.innerHTML = "";

function renderCuti(name, checked=false){
  const div = document.createElement("div");
  div.className = "cuti-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = name;
  checkbox.checked = checked;
  checkbox.addEventListener("change", updateCutiResult);

  const label = document.createElement("label");
  label.textContent = name;

  div.appendChild(checkbox);
  div.appendChild(label);
  cutiBox.appendChild(div);
}

/* render list */
personilMaster.forEach(name => {
  const checked = window.formData?.cuti?.split(", ").includes(name);
  renderCuti(name, checked);
});

/* update hasil */
function updateCutiResult(){
  const selected = Array.from(
    cutiBox.querySelectorAll("input[type='checkbox']:checked")
  ).map(cb => cb.value);

  cutiResult.value = selected.join(", ");
}

/* ================= CLEAR ================= */
document.querySelector(".clear").onclick = () => {
  document.querySelectorAll("select").forEach(el => el.value = "");
  document.querySelectorAll("input[type='text']").forEach(el => el.value = "");
  cutiResult.value = "";
  noref.value = generateNoRef();
  document.querySelectorAll("#cutiBox input[type='checkbox']")
    .forEach(cb => cb.checked = false);
};

/* ================= SUBMIT ================= */
/* ❗ BIARKAN FORM SUBMIT NORMAL */
/* HAPUS FETCH — tidak perlu JS submit */
