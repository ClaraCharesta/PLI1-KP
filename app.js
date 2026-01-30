// app.js
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./models"); // sequelize + semua model
const laporanRoutes = require("./routes/laporanShiftRoutes");
const dataBMCMRoutes = require("./routes/dataBMCMRoutes");

const app = express();

// ===============================
// VIEW ENGINE
// ===============================
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));

// ===============================
// BODY PARSER
// ===============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===============================
// SESSION
// ===============================
app.use(session({
  secret: "pli1-secret",
  resave: false,
  saveUninitialized: false
}));

// ===============================
// AUTH MIDDLEWARE
// ===============================
const auth = (req, res, next) => {
  if (!req.session.user) return res.redirect("/");
  next();
};

// ===============================
// LOGIN PAGE
// ===============================
app.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/home");
  res.render("login");
});

// ===============================
// POST LOGIN
// ===============================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { User, Role, RolePermission } = db;

    const user = await User.findOne({
      where: { email, is_active: true },
      include: { model: Role, include: RolePermission }
    });

    if (!user) return res.render("login", { error: "Email tidak terdaftar" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render("login", { error: "Password salah" });

    req.session.user = { id: user.user_id, nama: user.nama, role: user.Role.role_name };
    req.session.permissions = user.Role.RolePermissions;

    res.redirect("/home");
  } catch (err) {
    console.error(err);
    res.render("login", { error: "Terjadi kesalahan sistem" });
  }
});

// ===============================
// LOGOUT
// ===============================
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// ===============================
// LAPORAN SHIFT ROUTES (KCM5, RMFM5, CRUD, APPROVE)
// ===============================
app.use("/laporan-shift", auth, laporanRoutes);

// Temporary DEBUG route (NO auth) to test POST from client and session cookie
app.post('/debug/data-bmcm', (req, res) => {
  console.log('▶ DEBUG POST /debug/data-bmcm - session user:', req.session?.user ?? null, 'body:', req.body);
  res.json({ ok: true, session: req.session?.user ?? null, body: req.body });
});
// Log requests to /data-bmcm to help debug frontend submit issues
app.use("/data-bmcm", (req, res, next) => {
  console.log('▶ /data-bmcm', req.method, req.originalUrl, 'session:', !!req.session.user);
  next();
}, auth, dataBMCMRoutes);

// ===============================
// ROUTE NON-LAPORAN (HOME, CHART, USER, ABOUT, DLL)
// ===============================
app.get("/home", auth, (req, res) => res.render("home", { title: "Home", active: "home" }));
app.get("/chart", auth, (req, res) => res.render("chart", { active: "chart" }));
app.get("/kelola-user", auth, (req, res) => res.render("kelolaUser", { title: "Kelola User", active: "user" }));
app.get("/ubahPassword", auth, (req, res) => res.render("ubahPassword", { title: "Ganti Password", active: "about" }));
app.get("/about", auth, (req, res) => res.render("about", { title: "About", active: "about" }));
app.get("/feedback", auth, (req, res) => res.render("feedback", { active: "feedback" }));
app.get("/KCM5", auth, (req, res) => res.redirect("/laporan-shift/kcm5"));
app.get("/RMFM5", auth, (req, res) => res.redirect("/laporan-shift/rmfm5"));


// ===============================
// ROUTE LAPORAN LAIN (EJS PAGE VIEW)
// ===============================
const laporanPages = [
  { path: "/laporanShiftKCM5", file: "laporanShiftKCM5", title: "Laporan Shift KCM 5", active: "laporan" },
  { path: "/laporanShiftRMFM5", file: "laporanShiftRMFM5", title: "Laporan Shift RM FM 5", active: "laporan" },
  { path: "/tsKCM5", file: "tsKCM5", title: "Laporan Shift KCM 5", active: "trouble shooting" },
  { path: "/tsRMFM5", file: "tsRMFM5", title: "Laporan Shift RM FM 5", active: "trouble shooting RM FM" },
  { path: "/maintenanceKCM5", file: "maintenanceKCM5", title: "Laporan Shift KCM 5", active: "maintenance" },
  { path: "/maintenanceRMFM5", file: "maintenanceRMFM5", title: "Laporan Shift RM FM 5", active: "maintenance RM FM" },
  { path: "/pcKCM5", file: "pcKCM5", title: "Laporan Shift KCM 5", active: "produksi clinker kcm 5" },
  { path: "/pcRMFM5", file: "pcRMFM5", title: "Laporan Shift RM FM 5", active: "produksi clinker RMFM 5" },
  { path: "/sttKCM5", file: "sttKCM5", title: "Laporan Shift KCM 5", active: "serah terima tool kcm 5" },
  { path: "/sttRMFM5", file: "sttRMFM5", title: "Laporan Shift RM FM 5", active: "serah terima tool RM FM 5" },
  { path: "/catatanKCM5", file: "catatanKCM5", title: "Laporan Shift KCM 5", active: "catatan kcm 5" },
  { path: "/catatanRMFM5", file: "catatanRMFM5", title: "Laporan Shift RM FM 5", active: "catatan RM FM 5" },
  { path: "/laporanKCM5", file: "laporanKCM5", title: "Laporan Shift KCM 5", active: "laporanKCM5" },
  { path: "/laporanRMFM5", file: "laporanRMFM5", title: "Laporan Shift RM FM 5", active: "laporanRMFM5" },
  { path: "/RMFM5", file: "RMFM5", title: "Laporan Shift RM FM 5", active: "RMFM5" },
  { path: "/dataBMCM", file: "dataBMCM", title: "Realisasi PK Harian", active: "dataBMCM" },
  { path: "/addDataBMCM", file: "addDataBMCM", title: "Tambah Data BM & CM", active: "dataBMCM" },
  { path: "/formDataBMCM", file: "formDataBMCM", title: "Add Realisasi PK Harian", active: "dataBMCM" },
  { path: "/updateDataBMCM", file: "formUpdateDataBMCM", title: "Update Realisasi PK Harian", active: "dataBMCM" },
  { path: "/dataBMCMPPI", file: "dataBMCMPPI", title: "Data BM & CM PPI", active: "dataBMCMPPI" },
  { path: "/formDataBMCMPPI", file: "formDataBMCMPPI", title: "Add Realisasi PK Harian PPI", active: "dataBMCMPPI" },
  { path: "/formUpdateDataBMCMPPI", file: "formUpdateDataBMCMPPI", title: "Update Realisasi PK Harian PPI", active: "dataBMCMPPI" },
  { path: "/updateDataBMCMPPI", file: "formUpdateDataBMCMPPI", title: "Update Realisasi PK Harian PPI", active: "dataBMCMPPI" },
  { path: "/dataAbnormalitas", file: "dataAbnormalitas", title: "Data Abnormalitas", active: "dataAbnormalitas" },
  { path: "/formDataAbnormalitas", file: "formDataAbnormalitas", title: "Add Data Abnormalitas", active: "dataAbnormalitas" },
  { path: "/updateDataAbnormalitas", file: "formUpdateDataAbnormalitas", title: "Update Data Abnormalitas", active: "dataAbnormalitas" },
];

laporanPages.forEach(page => {
  app.get(page.path, auth, (req, res) => {
    res.render(page.file, { title: page.title, active: page.active });
  });
});

// ===============================
// SYNC DATABASE & CREATE ADMIN DEFAULT
// ===============================
(async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("✅ Semua tabel tersinkronisasi");

    const { Role, User } = db;
    const [adminRole] = await Role.findOrCreate({ where: { role_name: "Admin" } });
    const hash = await bcrypt.hash("admin123", 10);

    await User.findOrCreate({
      where: { email: "admin@gmail.com" },
      defaults: { nama: "Admin PLI 1", password: hash, role_id: adminRole.role_id, is_active: true }
    });

    console.log("✅ Role & User admin siap login");
  } catch (err) {
    console.error("❌ Gagal sync database / create admin:", err);
  }
})();

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server jalan di http://localhost:${PORT}`))
   .on("error", (err) => console.error("❌ SERVER ERROR:", err.message));

// ===============================
// KEEP ALIVE LOG
// ===============================
// setInterval(() => console.log("🟢 SERVER MASIH HIDUP"), 5000);
process.on("uncaughtException", (err) => console.error("❌ UNCAUGHT EXCEPTION:", err));
process.on("unhandledRejection", (reason) => console.error("❌ UNHANDLED REJECTION:", reason));
