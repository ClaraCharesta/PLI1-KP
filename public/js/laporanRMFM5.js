// =================== NO REF ===================
const noRef = window.NO_REF || "0001/SHIFT.PLI1-KCM5/1.2026";
document.getElementById("noRefText").textContent = noRef;

// =================== TROUBLESHOOTING ===================
const tsBody = document.querySelector("#tsTable tbody");
tsBody.innerHTML = "";

if (!window.TS || window.TS.length === 0) {
  tsBody.innerHTML = `
    <tr>
      <td colspan="18" style="text-align:center;">Data belum tersedia</td>
    </tr>
  `;
} else {
  window.TS.forEach(t => {
    tsBody.innerHTML += `
      <tr>
        <td>${noRef}</td>
        <td>${t.tanggal || "-"}</td>
        <td>${t.week || "-"}</td>
        <td>${t.area || "-"}</td>
        <td>${t.nomenclature || "-"}</td>
        <td>${t.mulai || "-"}</td>
        <td>${t.selesai || "-"}</td>
        <td>${t.durasi || "-"}</td>
        <td>${t.alarm || "-"}</td>
        <td>${t.indikasi_masalah || "-"}</td>
        <td>${t.klasifikasi_peralatan || "-"}</td>
        <td>${t.klasifikasi_pekerjaan || "-"}</td>
        <td>${t.tindakan || "-"}</td>
        <td>${t.pic || "-"}</td>
        <td>${t.status || "-"}</td>
        <td>${t.keterangan || "-"}</td>
        <td>${t.stop_alat_utama || "-"}</td>
        <td>
          <button class="edit">Edit</button>
          <button class="delete">Hapus</button>
        </td>
      </tr>
    `;
  });
}

// =================== BASIC MAINTENANCE ===================
const bmBody = document.querySelector("#maintenanceKCM5 tbody");
bmBody.innerHTML = "";

if (!window.MAINTENANCE || window.MAINTENANCE.length === 0) {
  bmBody.innerHTML = `
    <tr>
      <td colspan="11" style="text-align:center;">Data belum tersedia</td>
    </tr>
  `;
} else {
  window.MAINTENANCE.forEach(m => {
    bmBody.innerHTML += `
      <tr>
        <td>${noRef}</td>
        <td>${m.tanggal || "-"}</td>
        <td>${m.week || "-"}</td>
        <td>${m.mulai || "-"}</td>
        <td>${m.selesai || "-"}</td>
        <td>${m.durasi || "-"}</td>
        <td>${m.rute || "-"}</td>
        <td>${m.area || "-"}</td>
        <td>${m.status || "-"}</td>
        <td>${m.kendala || "-"}</td>
        <td>
          <button class="edit">Edit</button>
          <button class="delete">Hapus</button>
        </td>
      </tr>
    `;
  });
}

// =================== MONITORING ===================
const pcBody = document.querySelector("#pcKCM5 tbody");
pcBody.innerHTML = "";

if (!window.CLINKER || window.CLINKER.length === 0) {
  pcBody.innerHTML = `
    <tr>
      <td colspan="3" style="text-align:center;">Data belum tersedia</td>
    </tr>
  `;
} else {
  window.CLINKER.forEach(c => {
    pcBody.innerHTML += `
      <tr>
        <td class="noref-cell">${noRef}</td>
        <td>${c.monitoring || "-"}</td>
        <td>
          <button class="edit">Edit</button>
          <button class="delete">Hapus</button>
        </td>
      </tr>
    `;
  });
}


// =================== SERAH TERIMA TOOL ===================
const sttBody = document.querySelector("#sttKCM5 tbody");
sttBody.innerHTML = "";

if (!window.STT || window.STT.length === 0) {
  sttBody.innerHTML = `
    <tr>
      <td colspan="7" style="text-align:center;">Data belum tersedia</td>
    </tr>
  `;
} else {
  window.STT.forEach(s => {
    sttBody.innerHTML += `
      <tr>
        <td class="noref-cell">${noRef}</td>
        <td>${s.radio ? "✔" : "✘"}</td>
        <td>${s.kunciMobil ? "✔" : "✘"}</td>
        <td>${s.kunciMotor ? "✔" : "✘"}</td>
        <td>${s.kunciSubst ? "✔" : "✘"}</td>
        <td>${s.toolset ? "✔" : "✘"}</td>
        <td>
          <button class="edit">Edit</button>
          <button class="delete">Hapus</button>
        </td>
      </tr>
    `;
  });
}

// =================== CATATAN ===================
const catBody = document.querySelector("#catatanKCM5 tbody");
catBody.innerHTML = "";

if (!window.CATATAN || window.CATATAN.length === 0) {
  catBody.innerHTML = `
    <tr>
      <td colspan="3" style="text-align:center;">Data belum tersedia</td>
    </tr>
  `;
} else {
  window.CATATAN.forEach(ct => {
    catBody.innerHTML += `
      <tr>
        <td class="noref-cell">${noRef}</td>
        <td>${ct.text || "-"}</td>
        <td>
          <button class="edit">Edit</button>
          <button class="delete">Hapus</button>
        </td>
      </tr>
    `;
  });
}


// =================== BUTTON ADD ===================
document.querySelectorAll(".btn-add").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    window.location.href = `/${target}?noref=${encodeURIComponent(noRef)}`;
  });
});

// =================== PDF ===================
const btnPdf = document.getElementById("btnPdf");
if (btnPdf) {
  btnPdf.addEventListener("click", () => {
    const content = document.querySelector(".content");
    html2pdf().set({
      margin: 0.3,
      filename: `Laporan_${noRef.replaceAll("/", "_")}.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
    }).from(content).save();
  });
}
