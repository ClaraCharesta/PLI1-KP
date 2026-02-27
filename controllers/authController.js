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
    // Simpan both `id` and `user_id` and include profile_picture to keep session consistent
    req.session.user = {
      id: user.user_id,
      user_id: user.user_id, // backward compatibility
      nama: user.nama,
      email: user.email,
      role_id: user.role_id,
      profile_picture: user.profile_picture || null
    };

    req.session.permissions = user.Role.RolePermissions;

    console.log("Login session created:", req.session.user);

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
