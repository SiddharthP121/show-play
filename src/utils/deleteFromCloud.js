// import { v2 as cloudinary } from "cloudinary";
// import { ApiError } from "./ApiError";

// // Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
// });

// const deleteFromCloud = async (cloudUrl) => {
//   try {
//     const publicId = cloudUrl.spilt("/").pop().spilt(".")[0];
//     if (!publicId) {
//       throw new ApiError(404, "Unable to fetch the details");
//     }

//     const deletedData = await cloudinary.uploader.destroy(publicId);
//     if (!deletedData) {
//         throw new ApiError(401, "Something went wrong while deleting the file")
//     }

//   } catch (error) {
//     throw new ApiError(401, error?.message || "Something went wrong while deleting the file")
//   }
// };

// export {deleteFromCloud};
