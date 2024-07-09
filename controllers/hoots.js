const Hoot = require("../models/hoot.js");

const index = async (req, res) => {
  try {
    const hoots = await Hoot.find({})
      .populate("author")
      .sort({ createdAt: "desc" });
    res.status(200).json(hoots);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const show = async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId)
      .populate("author")
      .populate("comments.author");
    res.status(200).json(hoot);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const create = async (req, res) => {
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.create(req.body);
    hoot._doc.author = req.user;
    res.status(201).json(hoot);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const update = async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId).populate("author");
    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("Invalid permissions");
    }

    const updatedHoot = await Hoot.findByIdAndUpdate(
      req.params.hootId,
      req.body,
      { new: true }
    );

    updatedHoot._doc.author = req.user;

    res.status(200).json(updatedHoot);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteHoot = async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId).populate("author");
    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("Invalid permissions");
    }
    const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId);
    res.status(200).json(deletedHoot);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const createComment = async (req, res) => {
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.findById(req.params.hootId);
    hoot.comments.push(req.body);
    await hoot.save();
    const newComment = hoot.comments[hoot.comments.length - 1];
    newComment._doc.author = req.user;
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const updateComment = async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    const comment = hoot.comments.id(req.params.commentId);
    if (!comment.author.equals(req.user._id)) {
      return res.status(403).send("Invalid Permissions");
    }
    comment.text = req.body.text;
    await hoot.save();
    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteComment = async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    const comment = hoot.comments.id(req.params.commentId);
    if (!comment.author.equals(req.user._id)) {
      return res.status(403).send("Invalid Permissions");
    }
    hoot.comments.remove({ _id: req.params.commentId });
    await hoot.save();
    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  create,
  index,
  show,
  update,
  delete: deleteHoot,
  createComment,
  updateComment,
  deleteComment,
};
