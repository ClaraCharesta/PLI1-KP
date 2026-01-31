const bcrypt = require("bcrypt");
const { User, Role, RolePermission } = require("../models");

exports.viewLogin = (req, res) => {
  res.render("auth/login");
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email, is_active: true },
      include: {
        model: Role,
        include: RolePermission
      }
    });

    if (!user) {
      return res.render("auth/login", {
        error: "Email tidak terdaftar"
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("auth/login", {
        error: "Password salah"
      });
    }

    // SIMPAN KE SESSION
    req.session.user = {
      id: user.user_id,
      nama: user.nama,
      email: user.email,   // ⬅️ TAMBAH INI
      role: user.Role.role_name
    };


    req.session.permissions = user.Role.RolePermissions;

    res.redirect("/dashboard");

  } catch (err) {
    console.error(err);
    res.render("auth/login", {
      error: "Terjadi kesalahan sistem"
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
