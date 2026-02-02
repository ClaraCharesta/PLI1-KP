// ================= DATA =================
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

let personilMaster = [...personilData]; // dynamic

// ================= PERSONIL INPUT =================
document.querySelectorAll(".personil").forEach((input) => {
  input.addEventListener("blur", () => {
    if (input.value && !personilMaster.includes(input.value)) {
      personilMaster.push(input.value);
    }
  });
});

// ================= CUTI =================
const cutiBox = document.getElementById("cutiBox");
const cutiResult = document.getElementById("cutiResult");

function renderCuti(name) {
  const div = document.createElement("div");
  div.className = "cuti-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = name;
  checkbox.checked = cutiResult.value.split(", ").includes(name);
  checkbox.addEventListener("change", updateCutiResult);

  const label = document.createElement("label");
  label.textContent = name;

  div.appendChild(checkbox);
  div.appendChild(label);
  cutiBox.appendChild(div);
}

function updateCutiResult() {
  const selected = Array.from(
    cutiBox.querySelectorAll("input[type='checkbox']:checked")
  ).map(cb => cb.value);
  cutiResult.value = selected.join(", ");
}

personilData.forEach(renderCuti);

// ================= SUBMIT FORM =================
document.getElementById("kcm5Form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Validasi tanggal YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.tanggal)) {
    alert("Tanggal tidak valid");
    return;
  }

  const url = form.action;
  const method = "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.success) {
      alert(result.message);
      window.location.href = "/laporan-shift/kcm5";
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat menyimpan data");
  }
});
