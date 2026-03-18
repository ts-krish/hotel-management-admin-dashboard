exports.up = (pgm) => {
  pgm.dropColumn("users", "role");
  pgm.dropType("user_role");
};

exports.down = (pgm) => {
  pgm.createType("user_role", ["admin", "guest"]);

  pgm.addColumn("users", {
    role: {
      type: "user_role",
      default: "guest",
    },
  });
};