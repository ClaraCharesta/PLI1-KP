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

const shiftData = [
  "01 (07:00-15:00)",
  "02 (15:00-22:00)",
  "03 (22:00-07:00)",
  "A (07:00-19:00)",
  "B (19:00-07:00)",
  "LIBUR"
];

/* ================= PERSONIL SELECT + LAINNYA ================= */
document.querySelectorAll(".personil").forEach(select => {
    personilData.forEach(p => {
    select.add(new Option(p, p));
  });

  select.add(new Option("➕ Lainnya...", "LAINNYA"));

  select.addEventListener("change", function () {
    if (this.value === "LAINNYA") {
      const nama = prompt("Masukkan nama personil:");
      if (nama && nama.trim() !== "") {
        const opt = new Option(nama, nama, true, true);
        this.add(opt, this.options.length - 1);
      } else {
        this.selectedIndex = 0;
      }
    }
  });
});

/* ================= SHIFT ================= */
const shiftUtama = document.getElementById("shiftUtama");

shiftData.forEach(s => {
  shiftUtama.add(new Option(s, s));
});

/* shift per personil (841, 842A, dst) */
document.querySelectorAll(".shift").forEach(select => {
  shiftData.forEach(s => {
    select.add(new Option(s, s));
  });
});




/* ================= NO REF ================= */
function generateNoRef() {
  const d = new Date();
  const bulan = d.getMonth() + 1;
  const tahun = d.getFullYear();
  const urut = "0001"; // nanti dari DB
  return `${urut}/SHIFT.PLI1-KCM5/${bulan}.${tahun}`;
}

const cutiBox = document.getElementById("cutiBox");
const cutiResult = document.getElementById("cutiResult");

/* render checkbox cuti */
function renderCuti(name) {
  const div = document.createElement("div");
  div.className = "cuti-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = name;

  checkbox.addEventListener("change", updateCutiResult);

  const label = document.createElement("label");
  label.innerText = name;

  div.appendChild(checkbox);
  div.appendChild(label);

  cutiBox.appendChild(div);
}

/* data awal */
personilData.forEach(p => renderCuti(p));

/* checkbox Lainnya */
const lainnyaDiv = document.createElement("div");
lainnyaDiv.className = "cuti-item";

const lainnyaCheckbox = document.createElement("input");
lainnyaCheckbox.type = "checkbox";

const lainnyaLabel = document.createElement("label");
lainnyaLabel.innerText = "➕ Lainnya";

lainnyaCheckbox.addEventListener("change", () => {
  if (lainnyaCheckbox.checked) {
    const nama = prompt("Masukkan nama personil cuti:");
    if (nama && nama.trim() !== "") {
      renderCuti(nama);
      updateCutiResult();
    }
    lainnyaCheckbox.checked = false;
  }
});

lainnyaDiv.appendChild(lainnyaCheckbox);
lainnyaDiv.appendChild(lainnyaLabel);
cutiBox.appendChild(lainnyaDiv);

/* simpan hasil cuti */
function updateCutiResult() {
  const selected = Array.from(
    cutiBox.querySelectorAll("input[type='checkbox']:checked")
  ).map(c => c.value);

  cutiResult.value = selected.join(", ");
}

function clearForm() {
  // reset input & select
  document.querySelectorAll("input[type='date'], select").forEach(el => {
    el.value = "";
  });

  // reset checkbox cuti
  document
    .querySelectorAll("#cutiBox input[type='checkbox']")
    .forEach(cb => cb.checked = false);

  cutiResult.value = "";
}


document.getElementById("noref").value = generateNoRef();

document.getElementById("tanggal").addEventListener("change", () => {
  document.getElementById("noref").value = generateNoRef();
});
