const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");

// get management user
const managementUsers = async (req, res) => {
  try {
    const managementUsers = await User.find({ role: "management_admin" });
    return res.json({ managementUsers });
  } catch (error) {
    console.log("admin.user-management => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

const managementAddUsers = async (req, res) => {
  const { first_name, email, number, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({ msg: "Email and password are required" });

    if (await User.findOne({ email }))
      return res.json({ msg: "User Already Exists!" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name,
      email,
      number,
      password: hashPassword,
      role: "management_admin"
    });

    await newUser.save();
    return res.json({ msg: "User Created!" });
  } catch (error) {
    console.log("admin.user-management-add => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

const managementDeleteUsers = async (req, res) => {
  // const user = await Users.find({email: req.body.email});
  const ress = await User.deleteOne({ email: req.body.email });
  if (ress.acknowledged) {
    return res.json({ msg: "User Deleted Successfully!" });
  } else {
    return res.json({ msg: "Error While Deleting User!" });
  }
}

module.exports = {
  managementUsers,
  managementAddUsers,
  managementDeleteUsers
};