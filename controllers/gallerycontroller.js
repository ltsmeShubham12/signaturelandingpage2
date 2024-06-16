import { galleryData } from "../models/gallery.js";
import fs from "fs";

const Gallery = galleryData;

export const POST_GALLERY = async (req, res) => {
  try {
    console.log(req.files);
    const imgs = req.files.map((file) => file.filename);

    const galleryUpload = new Gallery({
      galleryimg: imgs,
    });
    const addedimg = await galleryUpload.save();
    res.status(200).json(addedimg);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to upload gallery");
  }
};

export const GET_GALLERY = async (req, res) => {
  try {
    const foundgallery = await Gallery.find();
    if (!foundgallery) {
      return res.status(404).json("Error");
    }
    res.status(200).json(foundgallery);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to get gallery");
  }
};

export const GET_UPDATEGALLERY = async (req, res) => {
  try {
    const id = req.params.id;
    const foundgallery = await Gallery.findById(id);
    if (!foundgallery) {
      return res.status(404).json("Gallery not found");
    }
    res.status(200).json(foundgallery);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to get gallery");
  }
};

export const PUT_GALLERY = async (req, res) => {
  try {
    const id = req.params.id;
    const existingGallery = await Gallery.findById(id);

    if (!existingGallery) {
      return res.status(404).json("Gallery not found");
    }

    const imgs = req.files ? req.files.map((file) => file.filename) : [];

    if (imgs.length > 0) {
      existingGallery.galleryimg.forEach((img) => {
        try {
          fs.unlinkSync(`./public/uploads/${img}`);
        } catch (err) {
          console.log(`Failed to delete old image: ${img}`, err);
        }
      });
      existingGallery.galleryimg = imgs;
    }

    existingGallery.save();
    res.status(200).json(existingGallery);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to update gallery");
  }
};

export const DELETE_GALLERY = async (req, res) => {
  try {
    const id = req.params.id;
    const galleryToDelete = await Gallery.findById(id);
    if (!galleryToDelete) {
      return res.status(404).json("Gallery not found");
    }

    galleryToDelete.galleryimg.forEach((img) => {
      try {
        fs.unlinkSync(`./public/uploads/${img}`);
      } catch (err) {
        console.log(`Failed to delete image: ${img}`, err);
      }
    });

    await Gallery.findByIdAndDelete(id);
    res.status(200).json({ msg: "Gallery deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to delete gallery");
  }
};
