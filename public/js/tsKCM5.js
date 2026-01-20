// WEEK OTOMATIS
document.getElementById('tanggal').addEventListener('change', e => {
  const d = new Date(e.target.value);
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = (d - start) / 86400000;
  document.getElementById('week').value = Math.ceil((diff + 1) / 7);
});

//klasifikasi
const klasifikasiEnum = [
'AFR','ANALYZER','BCE','BELUM DIKETAHUI','BS RAW COAL','DBA','DBB',
'EMERGENCY SWITCH','EPDC','Feeder','Gate','GCT','GRATE COOLER','HMI',
'Hoist','HTDB','KOMPRESSOR','LCP Lubrication','LIFT','LRS','MCC',
'ME Problem','Motor LV','Motor MV','PMC','PROBLEM ME','PROBLEM PROD',
'PROGRAM PLC','ROLLER BREAKER','SENSOR','SIDE SCRAPER','SLIDE GATE',
'START STOP BUTTON','TANGKI CO','VSD','WELDING PANEL','Lainnya'
];

const klasifikasi = document.getElementById('klasifikasi');
klasifikasiEnum.forEach(k => {
  klasifikasi.innerHTML += `<option value="${k}">${k}</option>`;
});

klasifikasi.addEventListener('change', () => {
  document.getElementById('klasifikasiLainnya').hidden =
    klasifikasi.value !== 'Lainnya';
});

//indikasi masalah 2
const indikasi2Enum = [
'Material block','ME Problem','Monitoring','ORDER 81','Order 82',
'Order KS','Order ME','Order prod','Order PUP','PMC',
'Problem ME','Problem prod','Troubleshooting','Lainnya'
];

const indikasi2 = document.getElementById('indikasi2');
indikasi2Enum.forEach(i => {
  indikasi2.innerHTML += `<option value="${i}">${i}</option>`;
});

indikasi2.addEventListener('change', () => {
  document.getElementById('indikasi2Lainnya').hidden =
    indikasi2.value !== 'Lainnya';
});


// DURASI
function hitungDurasi(){
  const mulai = document.getElementById('mulai').value;
  const selesai = document.getElementById('selesai').value;
  if(!mulai || !selesai) return;

  const t1 = new Date(`1970-01-01T${mulai}`);
  const t2 = new Date(`1970-01-01T${selesai}`);
  const jam = (t2 - t1) / 3600000;
  document.getElementById('durasi').value = jam.toFixed(2);
}
document.getElementById('mulai').onchange = hitungDurasi;
document.getElementById('selesai').onchange = hitungDurasi;

// ENUM AREA
const areaEnum = [
'5A1','5C1','5K1','5R','5R1','5R2','5U1','5W','5W1',
'5Z','5Z1','5Z2','KCM 5','RM FM 5','PPI','Lainnya'
];
const area = document.getElementById('area');
areaEnum.forEach(a=>{
  area.innerHTML += `<option>${a}</option>`;
});
area.onchange = () =>{
  document.getElementById('areaLainnya').hidden = area.value !== 'Lainnya';
};

// PIC MULTI + LAINNYA (CASE INSENSITIVE)
const picList = [
'[ISD] Irsyadunnas','[RKB] Rafki Budiman','[SLM] Salman',
'[RKS] Riki Sulaiman','[WIK] Wahyu Ikhsan','[MFS] Meri Fernandes',
'[MTR] Martu Rizal','[SEP] Sepriadi'
];
const picBox = document.getElementById('picBox');
picList.forEach(p=>{
  picBox.innerHTML += `
    <div class="cuti-item">
      <input type="checkbox" value="${p}">
      <label>${p}</label>
    </div>`;
});

// PIC LAINNYA
const picLain = document.getElementById('picLainnya');
picLain.addEventListener('blur',()=>{
  const val = picLain.value.trim();
  if(!val) return;

  const exists = [...document.querySelectorAll('#picBox label')]
    .some(l=>l.innerText.toLowerCase()===val.toLowerCase());

  if(!exists){
    picBox.innerHTML += `
      <div class="cuti-item">
        <input type="checkbox" checked value="${val}">
        <label>${val}</label>
      </div>`;
  }
  picLain.value = '';
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
  window.location.href = "/laporanKCM5"; // nanti buat filenya
};