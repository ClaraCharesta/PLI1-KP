// ===============================
// IMPORT
// ===============================
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./models");

// ===============================
// ROUTES
// ===============================
const laporanShiftRoutes = require("./routes/laporanShiftRoutes");

const dataBMCMRoutes = require("./routes/dataBMCMRoutes");
const dataBMCMPPIRoutes = require("./routes/dataBMCMPPIRoutes");

const tsKCM5Routes = require("./routes/tsKCM5Routes");
const monitoringRoutes = require("./routes/monitoringRoutes");
const sttRoutes = require("./routes/sttRoutes");
const catatanRoutes = require("./routes/catatanRoutes");
const basicMaintenanceRoutes = require("./routes/basicMaintenanceRoutes");
const dataAbnormalitasRoutes = require("./routes/dataAbnormalitasRoutes");
const chartBMCMRoutes = require("./routes/chartBMCMRoutes");
const chartBMCMPPIRoutes = require("./routes/chartBMCMPPIRoutes");
const chartAbnormalitasRoutes = require("./routes/chartAbnormalitasRoutes");


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
app.use(
  session({
    secret: "pli1-secret",
    resave: false,
    saveUninitialized: false,
  })
);

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
      include: {
        model: Role,
        include: RolePermission,
      },
    });

    if (!user) {
      return res.render("login", { error: "Email tidak terdaftar" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render("login", { error: "Password salah" });
    }

    req.session.user = {
      id: user.user_id,
      nama: user.nama,
      role: user.Role.role_name,
    };

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
// ROUTES MODULAR
// ===============================
app.use("/laporan-shift", auth, laporanShiftRoutes);
app.use("/ts", auth, tsKCM5Routes);






app.use("/monitoring", auth, monitoringRoutes);
app.use("/catatan", auth, catatanRoutes);
app.use("/stt", auth, sttRoutes);
app.use("/maintenance", auth, basicMaintenanceRoutes);

app.use("/dataBMCM", auth, dataBMCMRoutes);
app.use("/dataAbnormalitas", auth, dataAbnormalitasRoutes);
app.use("/uploads", express.static("public/uploads"));

// sub chart
app.use("/chart/bmcm", auth, chartBMCMRoutes);
app.use("/chart/ppi", auth, chartBMCMPPIRoutes);
app.use("/chart/abnormal", auth, chartAbnormalitasRoutes);

// pivot chart kamu
app.use("/chart/pivot", auth, require("./routes/pivotChartRoutes"));
app.use("/dataBMCMPPI", auth, dataBMCMPPIRoutes);

// ===============================
// ALIAS MENU / REDIRECT
// ===============================
app.get("/KCM5", auth, (req, res) => {
  res.redirect("/laporan-shift/kcm5");
});

app.get("/RMFM5", auth, (req, res) => {
  res.redirect("/laporan-shift/rmfm5");
});



// ===============================
// ROUTE NON LAPORAN
// ===============================
app.get("/home", auth, (req, res) => {
  res.render("home", { title: "Home", active: "home" });
});

// menu utama
app.get("/chart", auth, (req, res) => {
  res.render("chartMenu");
});



app.get("/kelola-user", auth, (req, res) => {
  res.render("kelolaUser", { title: "Kelola User", active: "user" });
});

app.get("/ubahPassword", auth, (req, res) => {
  res.render("ubahPassword", {
    title: "Ganti Password",
    active: "about",
  });
});

app.get("/about", auth, (req, res) => {
  res.render("about", { title: "About", active: "about" });
});

app.get("/feedback", auth, (req, res) => {
  res.render("feedback", { title: "Feedback", active: "feedback" });
});

// ===============================
// LAPORAN PAGES (DYNAMIC)
// ===============================
const laporanPages = [
  // KCM5 & RMFM5
  {
    path: "/laporanShiftKCM5",
    file: "laporanShiftKCM5",
    title: "Laporan Shift KCM 5",
    active: "laporan",
  },
  {
    path: "/laporanShiftRMFM5",
    file: "laporanShiftRMFM5",
    title: "Laporan Shift RM FM 5",
    active: "laporan",
  },
  
  {
    path: "/tsRMFM5",
    file: "tsRMFM5",
    title: "Trouble Shooting RM FM 5",
    active: "trouble shooting",
  },
  {
    path: "/maintenanceKCM5",
    file: "maintenanceKCM5",
    title: "Maintenance KCM 5",
    active: "maintenance",
  },
  {
    path: "/maintenanceRMFM5",
    file: "maintenanceRMFM5",
    title: "Maintenance RM FM 5",
    active: "maintenance",
  },
  {
    path: "/pcKCM5",
    file: "pcKCM5",
    title: "Produksi Clinker KCM 5",
    active: "produksi clinker",
  },
  {
    path: "/pcRMFM5",
    file: "pcRMFM5",
    title: "Produksi Clinker RM FM 5",
    active: "produksi clinker",
  },
  {
    path: "/sttKCM5",
    file: "sttKCM5",
    title: "Serah Terima Tool KCM 5",
    active: "serah terima tool",
  },
  {
    path: "/sttRMFM5",
    file: "sttRMFM5",
    title: "Serah Terima Tool RM FM 5",
    active: "serah terima tool",
  },
  {
    path: "/catatanKCM5",
    file: "catatanKCM5",
    title: "Catatan KCM 5",
    active: "catatan",
  },
  {
    path: "/catatanRMFM5",
    file: "catatanRMFM5",
    title: "Catatan RM FM 5",
    active: "catatan",
  },
  {
    path: "/laporanKCM5",
    file: "laporanKCM5",
    title: "Laporan KCM 5",
    active: "laporan",
  },
  {
    path: "/laporanRMFM5",
    file: "laporanRMFM5",
    title: "Laporan RM FM 5",
    active: "laporan",
  },

  // Data BM & CM
 

  // Data Abnormalitas

  {
    path: "/formDataAbnormalitas",
    file: "formDataAbnormalitas",
    title: "Add Data Abnormalitas",
    active: "dataAbnormalitas",
  },
  {
    path: "/updateDataAbnormalitas",
    file: "formUpdateDataAbnormalitas",
    title: "Update Data Abnormalitas",
    active: "dataAbnormalitas",
  },
];

// Loop route
laporanPages.forEach((page) => {
  app.get(page.path, auth, (req, res) => {
    const noRef = req.query.noref || "";

    res.render(page.file, {
      title: page.title,
      active: page.active,
      no_ref: noRef,
    });
  });
});

// ===============================
// SYNC DATABASE + DEFAULT ADMIN
// ===============================
(async () => {
  try {
    await db.sequelize.sync();

    const { Role, User } = db;

    const [adminRole] = await Role.findOrCreate({
      where: { role_name: "Admin" },
    });

    const hash = await bcrypt.hash("admin123", 10);

    await User.findOrCreate({
      where: { email: "admin@gmail.com" },
      defaults: {
        nama: "Admin PLI 1",
        password: hash,
        role_id: adminRole.role_id,
        is_active: true,
      },
    });

    console.log("✅ Database & admin siap login");
  } catch (err) {
    console.error(err);
  }
})();

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
});
