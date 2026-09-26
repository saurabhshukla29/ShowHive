const cloudinary = require('cloudinary').v2
exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    //console.log("File data:", file); // Log to see what file contains

    const options = { folder };
    if (height) options.height = height;
    if (quality) options.quality = quality;
    options.resource_type = "image"; // For handling base64-encoded images

    // Check if the file is a base64-encoded string
    if (typeof file === "string" && file.startsWith("data:image")) {
        return await cloudinary.uploader.upload(file, options);
    } else if (file && file.tempFilePath) {
        // Use the tempFilePath if it’s a file path
        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } else {
        throw new Error("Invalid file input: must be a base64 string or an object with tempFilePath");
    }
};