const express = require("express");
const app = express();

// setting ejs
app.set("view engine", "ejs");
app.set("views", "views");

// biar bisa akses folder public
app.use(express.static("public"));

// route halaman login
app.get("/", (req, res) => {
  res.render("login");
});

app.get('/laporanShiftKCM5', (req, res) => {
  res.render('laporanShiftKCM5', {
    title: 'Laporan Shift KCM 5',
    active: 'laporan'
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



// jalankan server
app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});
