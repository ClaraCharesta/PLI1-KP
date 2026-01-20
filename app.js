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

app.get("/home", (req, res) => {
  res.render("home", { active: "home" });
});

app.get("/chart", (req, res) => {
  res.render("chart", { active: "chart" });
});

app.get("/kelola-user", (req, res) => {
  res.render("kelolaUser", { active: "user" });
});

app.get("/about", (req, res) => {
  res.render("about", { active: "about" });
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
