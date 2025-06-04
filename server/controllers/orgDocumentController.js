const OrgDocument = require("../models/orgDocumentModel");
const User = require("../models/userSchema");
class orgDocumentController {

    static uploadOrgDocument = async (req, res) => {
        try {
            const uploaderId = req.user._id; // Assuming auth middleware sets req.user
            const {
                title,
                description,
                filePath,
                categoryId,
                isTemplate = false,
            } = req.body;

            // Step 1: Get uploader
            const uploader = await User.findById(uploaderId);
            if (!uploader) return res.status(404).json({ message: "Uploader not found" });

            // Step 2: Get all users in the same organization
            const orgUsers = await User.find({
                organizationId: uploader.organizationId,
                _id: { $ne: uploaderId }, // Optional: exclude uploader
            });

            const recipients = orgUsers.map(user => ({
                userId: user._id,
                status: "pending",
            }));

            // Step 3: Save document with org-wide recipients
            const newOrgDocument = await OrgDocument.create({
                title,
                description,
                filePath,
                categoryId,
                uploadedBy: uploaderId,
                organizationId: uploader.organizationId,
                recipients,
                isTemplate,
            });

            res.status(201).json({
                message: "Organization document uploaded successfully.",
                document: newOrgDocument,
            });
        } catch (error) {
            console.error("Upload Org Document Error:", error);
            res.status(500).json({ message: "Server error while uploading document." });
        }
    };


}
module.exports = orgDocumentController