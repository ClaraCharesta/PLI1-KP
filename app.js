const express = require("express");
const app = express();


app.set("view engine", "ejs");
app.set("views", "views");


app.use(express.static("public"));


app.get("/", (req, res) => {
  res.render("login");
});


app.get("/laporanShiftKCM5", (req, res) => {
  res.render("laporanShiftKCM5", {
    title: "Laporan Shift KCM 5",
    active: "laporan"
  });
});

app.get("/laporanShiftRMFM5", (req, res) => {
  res.render("laporanShiftRMFM5", {
    title: "Laporan Shift RM FM 5",
    active: "laporan"
  });
});


app.get("/tsKCM5", (req, res) => {
  res.render("tsKCM5", {
    title: "Laporan Shift KCM 5",
    active: "trouble shooting"
  });
});

app.get("/tsRMFM5", (req, res) => {
  res.render("tsRMFM5", {
    title: "Laporan Shift RM FM 5",
    active: "trouble shooting RM FM"
  });
});


app.get("/maintenanceKCM5", (req, res) => {
  res.render("maintenanceKCM5", {
    title: "Laporan Shift KCM 5",
    active: "maintenance"
  });
});

app.get("/maintenanceRMFM5", (req, res) => {
  res.render("maintenanceRMFM5", {
    title: "Laporan Shift RM FM 5",
    active: "maintenance RM FM"
  });
});

app.get("/pcKCM5", (req, res) => {
  res.render("pcKCM5", {
    title: "Laporan Shift KCM 5",
    active: "produksi clinker kcm 5"
  });
});

app.get("/pcRMFM5", (req, res) => {
  res.render("pcRMFM5", {
    title: "Laporan Shift RM FM 5",
    active: "produksi clinker RMFM 5"
  });
});

app.get("/sttKCM5", (req, res) => {
  res.render("sttKCM5", {
    title: "Laporan Shift KCM 5",
    active: "serah terima tool kcm 5"
  });
});

app.get("/sttRMFM5", (req, res) => {
  res.render("sttRMFM5", {
    title: "Laporan Shift RM FM 5",
    active: "serah terima tool RM FM 5"
  });
});

app.get("/catatanKCM5", (req, res) => {
  res.render("catatanKCM5", {
    title: "Laporan Shift KCM 5",
    active: "catatan kcm 5"
  });
});

app.get("/catatanRMFM5", (req, res) => {
  res.render("catatanRMFM5", {
    title: "Laporan Shift RM FM 5",
    active: "catatan RM FM 5"
  });
});

app.get("/laporanKCM5", (req, res) => {
  res.render("laporanKCM5", {
    title: "Laporan Shift KCM 5",
    active: "laporanKCM5"
  });
});

app.get("/laporanRMFM5", (req, res) => {
  res.render("laporanRMFM5", {
    title: "Laporan Shift RM FM 5",
    active: "laporanRMFM5"
  });
});

app.get("/KCM5", (req, res) => {
  res.render("KCM5", {
    title: "Laporan Shift KCM 5",
    active: "KCM5"
  });
});

app.get("/RMFM5", (req, res) => {
  res.render("RMFM5", {
    title: "Laporan Shift RM FM 5",
    active: "RMFM5"
  });
});

app.get("/dataBMCM", (req, res) => {
  res.render("dataBMCM", {
    title: "Realisasi PK Harian",
    active: "dataBMCM"
  });
});

app.get("/addDataBMCM", (req, res) => {
  res.render("addDataBMCM", {
    title: "Tambah Data BM & CM",
    active: "dataBMCM"
  });
});

app.get("/formDataBMCM", (req, res) => {
  res.render("formDataBMCM", {
    title: "Add Realisasi PK Harian",
    active: "dataBMCM"
  });
});

app.get("/updateDataBMCM", (req, res) => {
  res.render("formUpdateDataBMCM", {
    title: "Update Realisasi PK Harian",
    active: "dataBMCM"
  });
});

app.get("/dataAbnormalitas", (req, res) => {
  res.render("dataAbnormalitas", {
    title: "Data Abnormalitas",
    active: "dataAbnormalitas"
  });
});

app.get("/formDataAbnormalitas", (req, res) => {
  res.render("formDataAbnormalitas", {
    title: "Add Data Abnormalitas",
    active: "dataAbnormalitas"
  });
});

app.get("/updateDataAbnormalitas", (req, res) => {
  res.render("formUpdateDataAbnormalitas", {
    title: "Update Data Abnormalitas",
    active: "dataAbnormalitas"
  });
});

app.get("/home", (req, res) => {
  res.render("home", { title: "Home", active: "home" });
});

app.get("/chart", (req, res) => {
  res.render("chart", { active: "chart" });
});

app.get("/kelola-user", (req, res) => {
  res.render("kelolaUser", { title: "Kelola User", active: "user" });
});

app.get("/history-nomenclature", (req, res) => {
  res.render("historyNomenclature", { title: "History Nomenclature", active: "history" });
});

app.get("/formKelolaUser", (req, res) => {
  res.render("formKelolaUser", { title: "Add User", active: "user" });
});

app.get("/formUpdateKelolaUser", (req, res) => {
  res.render("formUpdateKelolaUser", { title: "Update User", active: "user" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About", active: "about" });
});

app.get("/ubahPassword", (req, res) => {
  res.render("ubahPassword", { title: "Ganti Password", active: "about" });
});

app.get("/logout", (req, res) => {
  res.redirect("/home");
});

app.get("/feedback", (req, res) => {
  res.render("feedback", { active: "feedback" });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
})
.on("error", (err) => {
  console.error("❌ SERVER ERROR:", err.message);
});


setInterval(() => {
  console.log("🟢 SERVER MASIH HIDUP");
}, 5000);


process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ UNHANDLED REJECTION:", reason);
});
