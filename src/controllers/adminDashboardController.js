const supabase = require("../config/supabase");

const getDashboardStats = async (
  req,
  res
) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | TOTAL GUESTS
    |--------------------------------------------------------------------------
    */
    const {
      count: totalGuests,
    } = await supabase
      .from("guests")
      .select("*", {
        count: "exact",
        head: true,
      });

    /*
    |--------------------------------------------------------------------------
    | TOTAL PHOTOS
    |--------------------------------------------------------------------------
    */
    const {
      count: totalPhotos,
    } = await supabase
      .from("photos")
      .select("*", {
        count: "exact",
        head: true,
      });

    /*
    |--------------------------------------------------------------------------
    | GUEST LIST
    |--------------------------------------------------------------------------
    */
    const {
      data: guests,
      error: guestsError,
    } = await supabase
      .from("guests")
      .select(
        "id, name, mobile, upload_count"
      )
      .order("name");

    if (guestsError) {
      throw guestsError;
    }

    /*
    |--------------------------------------------------------------------------
    | RECENT PHOTOS
    |--------------------------------------------------------------------------
    */
    const {
      data: photos,
      error: photosError,
    } = await supabase
      .from("photos")
      .select("*")
      .order(
        "uploaded_at",
        {
          ascending: false,
        }
      )
      .limit(20);

    if (photosError) {
      throw photosError;
    }

    return res.status(200).json({
      success: true,

      stats: {
        totalGuests,
        totalPhotos,
      },

      guests,
      photos,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};