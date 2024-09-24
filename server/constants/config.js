const corsOptions = {
  origin: [process.env.CLIENT_URI, "http://localhost:5173"],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
};

module.exports = { corsOptions };
