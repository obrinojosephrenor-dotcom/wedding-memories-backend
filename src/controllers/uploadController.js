const uploadToCloudinary = require("../utils/cloudinaryUpload");
const supabase = require("../config/supabase");

const {
  getGuestById,
  savePhoto,
  incrementUploadCount,
} = require("../services/uploadService");

/*
|--------------------------------------------------------------------------
| UPLOAD PHOTO
|--------------------------------------------------------------------------
*/
const uploadPhoto = async (req, res) => {
  try {
    const guestId = req.user.id;

    const guest = await getGuestById(guestId);

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });
    }

    if (guest.upload_count >= 25) {
      return res.status(403).json({
        success: false,
        message:
          "You have reached the maximum upload limit of 25 photos.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const result = await uploadToCloudinary(
      req.file.buffer
    );

    const photo = await savePhoto({
      guest_id: guestId,
      image_url: result.image_url,
      public_id: result.public_id,
    });

    await incrementUploadCount(
      guestId
    );

    return res.status(201).json({
      success: true,
      message:
        "Photo uploaded successfully",
      photo,
    });
  } catch (error) {
    console.error(
      "UPLOAD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET MY PHOTOS
|--------------------------------------------------------------------------
*/
const getMyPhotos = async (
  req,
  res
) => {
  try {
    const guestId = req.user.id;

    const { data, error } =
      await supabase
        .from("photos")
        .select("*")
        .eq("guest_id", guestId)
        .order("uploaded_at", {
          ascending: false,
        });

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      photos: data,
    });
  } catch (error) {
    console.error(
      "GET PHOTOS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadPhoto,
  getMyPhotos,
};