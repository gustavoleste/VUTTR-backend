const { Tools } = require("../../database/index");

const filterToolsByTag = async (req, res) => {
  try {
    if (req.query.tag) {
      const tool = await Tools.find({ tags: req.query.tag });
      return res.status(200).json(tool);
    }
    const tools = await Tools.find();
    return res.status(200).json(tools);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const filterToolsById = async (req, res) => {
  try {
    const id = req.params.toolID;
    const tool = await Tools.find({ _id: id });
    return res.status(200).json(tool);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const createNewTool = async (req, res) => {
  try {
    if (!req.isAuth) {
      return res.status(401).json({ message: "Not Authenticate." });
    }
    const newTool = new Tools({ ...req.body });
    await newTool.save();
    return res.status(201).json(newTool);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const updateToolById = async (req, res) => {
  try {
    if (!req.isAuth) {
      return res.status(401).json({ message: "Not Authenticate." });
    }
    const tool = await Tools.findOne({ _id: req.params.toolID });
    if (req.user.id == tool.user || req.user.role === "admin") {
      const updatedTool = { ...req.body };
      await Tools.updateOne({ _id: req.params.toolID }, updatedTool);
      return res.status(200).json(updatedTool);
    }
    return res.status(403).json({ msg: "Access not allowed" });
  } catch (err) {
    res.status(500).json({ err });
  }
};

const deleteToolById = async (req, res) => {
  try {
    if (!req.isAuth) {
      return res.status(401).json({ message: "Not Authenticate." });
    }
    const tool = await Tools.findOne({ _id: req.params.toolID });
    if (req.user.id == tool.user || req.user.role === "admin") {
      await Tools.deleteOne({ _id: req.params.toolID });
      return res.status(200).json({});
    }
    return res.status(403).json({ msg: "Access not allowed" });
  } catch (err) {
    res.status(500).json({ err });
  }
};

module.exports = {
  filterToolsByTag,
  filterToolsById,
  createNewTool,
  updateToolById,
  deleteToolById
};
