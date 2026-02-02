// app.js
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./models"); // sequelize + semua model

// ===== ROUTES =====
const laporanShiftRoutes = require("./routes/laporanShiftRoutes");
const formLaporanShiftRoutes = require("./routes/formLaporanShiftRoutes");
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
// ROUTES: LAPORAN SHIFT / FORM / DATA BM CM
// ===============================
app.use("/laporan-shift", auth, laporanShiftRoutes);
app.use("/form-laporan-shift", auth, formLaporanShiftRoutes);
app.use("/form-laporan-shift", require("./routes/formLaporanShiftRoutes"));
app.use("/data-bmcm", auth, dataBMCMRoutes);

// ===============================
// DEBUG TEMPORARY ROUTE
// ===============================
app.post('/debug/data-bmcm', (req, res) => {
  console.log('▶ DEBUG POST /debug/data-bmcm - session user:', req.session?.user ?? null, 'body:', req.body);
  res.json({ ok: true, session: req.session?.user ?? null, body: req.body });
});

// ===============================
// ROUTE NON-LAPORAN (HOME, CHART, USER, ABOUT, DLL)
// ===============================
app.get("/home", auth, (req, res) => res.render("home", { title: "Home", active: "home" }));
app.get("/chart", auth, (req, res) => res.render("chart", { active: "chart" }));
app.get("/kelola-user", auth, (req, res) => res.render("kelolaUser", { title: "Kelola User", active: "user" }));
app.get("/ubahPassword", auth, (req, res) => res.render("ubahPassword", { title: "Ganti Password", active: "about" }));
app.get("/about", auth, (req, res) => res.render("about", { title: "About", active: "about" }));
app.get("/feedback", auth, (req, res) => res.render("feedback", { active: "feedback" }));
app.get("/KCM5", auth, (req, res) => res.redirect("/laporan-shift/KCM5"));
app.get("/RMFM5", auth, (req, res) => res.redirect("/laporan-shift/RMFM5"));

// ===============================
// ROUTE LAPORAN PAGE STATIC
// ===============================
const laporanPages = [
  { path: "/laporanShiftKCM5", file: "laporanShiftKCM5", title: "Laporan Shift KCM 5", active: "laporan" },
  { path: "/laporanShiftRMFM5", file: "laporanShiftRMFM5", title: "Laporan Shift RM FM 5", active: "laporan" },
  { path: "/tsKCM5", file: "tsKCM5", title: "Laporan Shift KCM 5", active: "trouble shooting" },
  { path: "/tsRMFM5", file: "tsRMFM5", title: "Laporan Shift RM FM 5", active: "trouble shooting RM FM" },
  // ... tambahkan semua page lain yang sebelumnya ada
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
    await db.sequelize.sync();
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
process.on("uncaughtException", (err) => console.error("❌ UNCAUGHT EXCEPTION:", err));
process.on("unhandledRejection", (reason) => console.error("❌ UNHANDLED REJECTION:", reason));
