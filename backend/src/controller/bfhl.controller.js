const { processGraph } = require('../service/graph.service');

const handleBFHL = (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid input format" });
    }

    const result = processGraph(data);

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { handleBFHL };