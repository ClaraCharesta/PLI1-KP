/* ================= DATA ================= */
const personilData = [
  "[NFJ] Nofriza Juanda",
  "[HRT] Harto",
  "[HMN] Harmen",
  "[EDW] Edward",
  "[WAP] Wahyu Arisal Putra, ST",
  "[DRO] Desrianto",
  "[AFZ] Afrizal",
  "[JMB] Jumaidi Bakri",
  "[AOP] Astoria Prima",
  "[WSD] Willy Surya Dinata",
  "[AGW] Angga Wahyudi",
  "[SFL] Syafril",
  "[RDP] Randi Pratama"
];

const shiftData = [
  "01 (07:00-15:00)",
  "02 (15:00-22:00)",
  "03 (22:00-07:00)",
  "A (07:00-19:00)",
  "B (19:00-07:00)",
  "LIBUR"
];

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
  const urut = "0001"; // bisa nanti ambil dari DB
  return `${urut}/SHIFT.PLI1-RMFM5/${bulan}.${tahun}`;
}
noref.value = generateNoRef();
tanggalInput.addEventListener("change", () => {
  noref.value = generateNoRef();
});

/* ================= INIT SHIFT UTAMA ================= */
shiftUtama.innerHTML = "<option value=''>-- Pilih Shift --</option>";
shiftData.forEach(s => shiftUtama.add(new Option(s, s)));
if(window.formData?.shiftUtama) shiftUtama.value = window.formData.shiftUtama;

/* ================= PERSONIL SELECT DENGAN LAINNYA ================= */
document.querySelectorAll(".personil").forEach(select => {
  const key = select.dataset.key;
  select.innerHTML = "<option value=''>-- Pilih Personil --</option>";

  const existing = window.formData?.["personil_" + key.toLowerCase()];

  // tambah ke master kalau belum ada dan bukan "LAINNYA"
  if(existing && !personilMaster.includes(existing) && existing !== "LAINNYA"){
    personilMaster.push(existing);
  }

  // buat semua option
  personilMaster.forEach(p => select.add(new Option(p,p)));
  select.add(new Option("LAINNYA","LAINNYA"));

  // === set value AFTER semua option ada ===
  if(existing) select.value = existing;

  // ==== input text untuk LAINNYA ====
  const lainnyaDiv = document.createElement("div");
  lainnyaDiv.className = "lainnya-input";
  lainnyaDiv.style.display = existing === "LAINNYA" ? "block" : "none";

  const lainnyaInput = document.createElement("input");
  lainnyaInput.type = "text";
  lainnyaInput.placeholder = "Masukkan nama personil baru...";
  lainnyaInput.value = window.formData?.["personil_" + key.toLowerCase()+"_lainnya"] || "";

  lainnyaDiv.appendChild(lainnyaInput);
  select.parentNode.appendChild(lainnyaDiv);

  select.addEventListener("change", () => {
    if(select.value === "LAINNYA"){
      lainnyaDiv.style.display = "block";
      lainnyaInput.focus();
    } else {
      lainnyaDiv.style.display = "none";
    }
  });
});

/* ================= SHIFT PER PERSONIL ================= */
document.querySelectorAll(".shift").forEach(select => {
  const key = select.dataset.key;
  select.innerHTML = "<option value=''>-- Pilih Shift --</option>";
  shiftData.forEach(s => select.add(new Option(s,s)));

  if(window.formData?.["shift_" + key.toLowerCase()]){
    select.value = window.formData["shift_" + key.toLowerCase()];
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

// render semua personil + pre-fill edit
personilMaster.forEach(name => {
  const checked = window.formData?.cuti?.split(", ").includes(name);
  renderCuti(name, checked);
});

// opsi LAINNYA cuti
const cutiLainnyaDiv = document.createElement("div");
cutiLainnyaDiv.className = "cuti-item";

const cutiLainnyaCheckbox = document.createElement("input");
cutiLainnyaCheckbox.type = "checkbox";

const cutiLainnyaLabel = document.createElement("label");
cutiLainnyaLabel.textContent = "Lainnya";

cutiLainnyaDiv.appendChild(cutiLainnyaCheckbox);
cutiLainnyaDiv.appendChild(cutiLainnyaLabel);
cutiBox.appendChild(cutiLainnyaDiv);

const cutiLainnyaInputBox = document.createElement("div");
cutiLainnyaInputBox.style.display = "none";
cutiLainnyaInputBox.style.marginTop = "6px";

const cutiLainnyaInput = document.createElement("input");
cutiLainnyaInput.type = "text";
cutiLainnyaInput.placeholder = "Nama personil cuti lainnya...";
cutiLainnyaInputBox.appendChild(cutiLainnyaInput);
cutiBox.appendChild(cutiLainnyaInputBox);

// toggle input cuti lainnya
cutiLainnyaCheckbox.addEventListener("change", () => {
  cutiLainnyaInputBox.style.display = cutiLainnyaCheckbox.checked ? "block" : "none";
  if(cutiLainnyaCheckbox.checked) cutiLainnyaInput.focus();
});

// input enter → tambah cuti baru
cutiLainnyaInput.addEventListener("keydown", e => {
  if(e.key === "Enter"){
    const nama = cutiLainnyaInput.value.trim();
    if(!nama) return;
    renderCuti(nama, true);
    updateCutiResult();
    cutiLainnyaInput.value = "";
    cutiLainnyaInputBox.style.display = "none";
    cutiLainnyaCheckbox.checked = false;
  }
});

/* ================= UPDATE CUTI RESULT ================= */
function updateCutiResult(){
  const selected = Array.from(
    cutiBox.querySelectorAll("input[type='checkbox']:checked")
  ).map(cb => cb.value);
  cutiResult.value = selected.join(", ");
}

/* ================= CLEAR ================= */
document.querySelector(".clear").onclick = () => {
  document.querySelectorAll("select, input[type='text']").forEach(el => el.value = "");
  cutiResult.value = "";
  noref.value = generateNoRef();
  document.querySelectorAll("#cutiBox input[type='checkbox']").forEach(cb => cb.checked = false);
};

/* ================= FORM SUBMIT ================= */
document.querySelector(".save").onclick = async () => {
  const idInput = document.getElementById("id");
  const id = idInput ? idInput.value : null;

  const data = {
    id,
    tanggal: tanggalInput.value,
    shiftUtama: shiftUtama.value,
    no_ref: noref.value,
    cuti: cutiResult.value
  };

  // personil
  document.querySelectorAll(".personil").forEach(select => {
    const key = select.dataset.key;
    if(select.value === "LAINNYA"){
      const inputText = select.parentNode.querySelector(".lainnya-input input");
      data["personil_"+key.toLowerCase()] = inputText.value;
    } else {
      data["personil_"+key.toLowerCase()] = select.value;
    }
  });

  // shift per personil
  document.querySelectorAll(".shift").forEach(select => {
    const key = select.dataset.key;
    data["shift_"+key.toLowerCase()] = select.value;
  });

  const url = id ? `/laporan-shift/rmfm5/edit/${id}` : "/laporan-shift/rmfm5/add";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if(result.success){
      alert(result.message);
      window.location.href = "/laporan-shift/rmfm5";
    } else {
      alert(result.message);
    }
  } catch(err){
    console.error(err);
    alert("Terjadi kesalahan saat menyimpan data");
  }
};
