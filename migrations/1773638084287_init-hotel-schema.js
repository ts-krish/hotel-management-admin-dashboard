exports.up = (pgm) => {
  /* ENUM TYPES */

  pgm.createType("room_status", ["available", "booked", "maintenance"]);

  pgm.createType("room_category", ["single", "double", "deluxe"]);

  pgm.createType("booking_status", [
    "booked",
    "checked_in",
    "checked_out",
    "cancelled",
  ]);

  /* ROOM TABLE */

  pgm.createTable("room", {
    room_id: {
      type: "int",
      primaryKey: true,
      generatedAlwaysAsIdentity: true,
    },

    room_number: {
      type: "int",
      notNull: true,
      unique: true,
    },

    price_per_night: {
      type: "numeric(10,2)",
      notNull: true,
      check: "price_per_night >= 0",
    },

    status: {
      type: "room_status",
      notNull: true,
      default: "available",
    },

    room_type: {
      type: "room_category",
      notNull: true,
      default: "single",
    },
  });

  /* GUEST TABLE */

  pgm.createTable("guest", {
    guest_id: {
      type: "int",
      primaryKey: true,
      generatedAlwaysAsIdentity: true,
    },

    full_name: {
      type: "text",
      notNull: true,
    },

    email: {
      type: "text",
      unique: true,
      notNull: true,
    },

    phone_number: {
      type: "varchar(20)",
    },
  });

  /* BOOKING TABLE */

  pgm.createTable(
    "booking",
    {
      booking_id: {
        type: "int",
        primaryKey: true,
        generatedAlwaysAsIdentity: true,
      },

      guest_id: {
        type: "int",
        notNull: true,
        references: "guest",
      },

      room_id: {
        type: "int",
        notNull: true,
        references: "room",
      },

      check_in_date: {
        type: "date",
        notNull: true,
      },

      check_out_date: {
        type: "date",
        notNull: true,
      },

      status: {
        type: "booking_status",
        notNull: true,
        default: "booked",
      },
    },
    {
      constraints: {
        check_date_valid: "check_out_date > check_in_date",
      },
    },
  );
};
exports.down = (pgm) => {
  pgm.dropTable("booking");
  pgm.dropTable("guest");
  pgm.dropTable("room");

  pgm.dropType("booking_status");
  pgm.dropType("room_category");
  pgm.dropType("room_status");
};
