exports.up = (pgm) => {
  pgm.createType("user_role", ["admin", "guest"]);

  pgm.createTable("users", {
    user_id: "id",

    role: {
      type: "user_role",
      default: "guest",
    },

    email: {
      type: "text",
      unique: true,
      notNull: true,
    },

    password: {
      type: "text",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");

  pgm.dropType("user_role");
};
