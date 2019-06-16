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
    throw err;
  }
};

const filterToolsById = async (req, res) => {
  try {
    const id = req.params.toolID;
    const tool = await Tools.find({ _id: id });
    return res.status(200).json(tool);
  } catch (err) {
    throw err;
  }
};

const createNewTool = async (req, res) => {
  try {
    const newTool = new Tools({ ...req.body });
    await newTool.save();
    return res.status(201).json(newTool);
  } catch (err) {
    throw err;
  }
};

const updateToolById = async (req, res) => {
  try {
    const id = req.params.toolID;
    const updatedTool = { ...req.body };
    await Tools.updateOne({ _id: id }, updatedTool);
    return res.status(200).json(updatedTool);
  } catch (err) {
    throw err;
  }
};

const deleteToolById = async (req, res) => {
  try {
    const id = req.params.toolID;
    await Tools.deleteOne({ _id: id });
    return res.status(200).json({});
  } catch (err) {
    throw err;
  }
};

module.exports = {
  filterToolsByTag,
  filterToolsById,
  createNewTool,
  updateToolById,
  deleteToolById
};
