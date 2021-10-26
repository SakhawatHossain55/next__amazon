/* eslint-disable no-undef */
import nextConnect from "next-connect";
import { isAuth } from "../../../utils/auth";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
console.log("cloudinary", process.env.CLOUDINARY_NAME);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect();
const upload = multer();

handler.use(isAuth, upload.single("file")).post(async (req, res) => {
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  const result = await streamUpload(req);
  res.send(result);
});

export default handler;
