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

const shiftData = [
  "01 (07:00-15:00)",
  "02 (15:00-22:00)",
  "03 (22:00-07:00)",
  "A (07:00-19:00)",
  "B (19:00-07:00)",
  "LIBUR"
];

/* ================= BACK ================= */
document.querySelector(".back").onclick = () => {
  window.location.href = "/laporanKCM5";
};


document.getElementById("tanggal").addEventListener("change", () => {
  document.getElementById("noref").value = generateNoRef();
});

/* ================= CLEAR ================= */
document.querySelector(".clear").onclick = () => {
  document.querySelectorAll("input, select, textarea").forEach(el => {
    if (el.type !== "button" && el.type !== "submit") {
      el.value = "";
    }
  });

  document
    .querySelectorAll("#cutiBox input[type='checkbox']")
    .forEach(cb => cb.checked = false);

  cutiResult.value = "";
  document.getElementById("noref").value = generateNoRef();
};

/* ================= PERSONIL SELECT ================= */
document.querySelectorAll(".personil").forEach(select => {
  select.innerHTML = "";
  select.add(new Option("None", ""));

  personilData.forEach(p => {
    select.add(new Option(p, p));
  });

  select.add(new Option("Lainnya", "LAINNYA"));
});

/* ================= SHIFT ================= */
const shiftUtama = document.getElementById("shiftUtama");
shiftUtama.innerHTML = "<option value=''>None</option>";

shiftData.forEach(s => {
  shiftUtama.add(new Option(s, s));
});

document.querySelectorAll(".shift").forEach(select => {
  select.innerHTML = "<option value=''>None</option>";
  shiftData.forEach(s => {
    select.add(new Option(s, s));
  });
});

/* ================= CUTI ================= */
const cutiBox = document.getElementById("cutiBox");
const cutiResult = document.getElementById("cutiResult");

cutiBox.innerHTML = "";

/* render checkbox cuti */
function renderCuti(name) {
  const div = document.createElement("div");
  div.className = "cuti-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = name;
  checkbox.addEventListener("change", updateCutiResult);

  const label = document.createElement("label");
  label.textContent = name;

  div.appendChild(checkbox);
  div.appendChild(label);
  cutiBox.appendChild(div);
}

/* data utama */
personilData.forEach(p => renderCuti(p));

/* ================= LAINNYA CUTI (TANPA PROMPT) ================= */
const lainnyaDiv = document.createElement("div");
lainnyaDiv.className = "cuti-item";

const lainnyaCheckbox = document.createElement("input");
lainnyaCheckbox.type = "checkbox";

const lainnyaLabel = document.createElement("label");
lainnyaLabel.textContent = "Lainnya";

lainnyaDiv.appendChild(lainnyaCheckbox);
lainnyaDiv.appendChild(lainnyaLabel);
cutiBox.appendChild(lainnyaDiv);

/* input text lainnya */
const lainnyaInputBox = document.createElement("div");
lainnyaInputBox.style.display = "none";
lainnyaInputBox.style.marginTop = "6px";

const lainnyaInput = document.createElement("input");
lainnyaInput.type = "text";
lainnyaInput.placeholder = "Nama personil cuti lainnya...";
lainnyaInput.style.width = "100%";

lainnyaInputBox.appendChild(lainnyaInput);
cutiBox.appendChild(lainnyaInputBox);

/* toggle input */
lainnyaCheckbox.addEventListener("change", () => {
  lainnyaInputBox.style.display = lainnyaCheckbox.checked ? "block" : "none";
  if (lainnyaCheckbox.checked) lainnyaInput.focus();
});

/* enter → jadi checkbox */
lainnyaInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const nama = lainnyaInput.value.trim();
    if (!nama) return;

    renderCuti(nama);
    updateCutiResult();

    lainnyaInput.value = "";
    lainnyaInputBox.style.display = "none";
    lainnyaCheckbox.checked = false;
  }
});

/* ================= SIMPAN HASIL CUTI ================= */
function updateCutiResult() {
  const selected = Array.from(
    cutiBox.querySelectorAll("input[type='checkbox']:checked")
  ).map(cb => cb.value);

  cutiResult.value = selected.join(", ");
}

/* ================= SAVE ================= */
document.querySelector(".save").onclick = async () => {
  const body = {
    tanggal: document.getElementById("tanggal").value,
    shiftUtama: document.getElementById("shiftUtama").value,
    no_ref: document.getElementById("noref").value,
    cuti: document.getElementById("cutiResult").value,

    personil_841: document.querySelectorAll(".personil")[0].value,
    shift_841: document.querySelectorAll(".shift")[0].value,

    personil_842a: document.querySelectorAll(".personil")[1].value,
    shift_842a: document.querySelectorAll(".shift")[1].value,

    personil_842b: document.querySelectorAll(".personil")[2].value,
    shift_842b: document.querySelectorAll(".shift")[2].value
  };

  try {
    const res = await fetch("/form-laporan-shift/kcm5", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await res.json();

    if (!result.success) throw new Error(result.message);

    alert("Data berhasil disimpan");
    window.location.href = "/laporan-shift/KCM5";

  } catch (err) {
    console.error(err);
    alert("Gagal menyimpan data");
  }
};

alert("Berhasil disimpan\nNo.Ref: " + result.data.no_ref);
