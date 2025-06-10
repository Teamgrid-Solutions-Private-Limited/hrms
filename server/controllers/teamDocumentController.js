const User = require("../models/userSchema");
const TeamDocument = require("../models/teamDocumentSchema");

class teamDocumentController {

    static uploadTeamDocument = async (req, res) => {
        try {
            const { title, description, file, categoryId, team } = req.body;
            // console.log("uploadedBy", req.user)
            const uploadedBy = req.user.id; // from auth
            const uploader = await User.findById(uploadedBy);
            // console.log("uploadedBy", uploadedBy)

            // Fetch all users in same org and selected team
            const teamUsers = await User.find({
                organizationId: uploader.organizationId,
                team: team,
            });
            // console.log("teamUsers", teamUsers)

            const recipients = teamUsers.map((user) => ({
                userId: user._id,
                status: "pending",
            }));
            // console.log("file path", file)
            console.log("file path in req", req.file)

            const filePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

            const newDoc = await TeamDocument.create({
                title,
                description,
                filePath,
                categoryId,
                uploadedBy,
                organizationId: uploader.organizationId,
                team,
                recipients,
            });

            res.status(201).json(newDoc);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static viewAllTeamDocuments = async (req, res) => {
        try {
            const { id: userId, organizationId } = req.user;
            console.log("user req in team", req.user)

            // Get the user info to determine team
            const user = await User.findById(userId);
            console.log("user in team", user)
            if (!user) {
                return res.status(404).json({ error: "User or team not found." });
            }

            // Find documents for  org
            const documents = await TeamDocument.find({
                organizationId,
            })
                .populate("uploadedBy", "firstName lastName email")
                .populate("categoryId", "name")
                .sort({ createdAt: -1 });

            res.status(200).json(documents);
        } catch (error) {
            console.error("Error fetching team documents:", error);
            res.status(500).json({ error: error.message });
        }
    };
    // Controller to get team documents for a specific user (logged-in user)
    static getTeamDocumentsForUser = async (req, res) => {
        try {
            const userId = req.user.id;  // or req.params.userId or wherever you get the logged in user's id

            // Find all documents where recipients.userId matches logged-in userId
            const docs = await TeamDocument.find({
                'recipients.userId': userId
            }).populate('categoryId uploadedBy team'); // populate other refs if needed

            res.status(200).json(docs);
        } catch (error) {
            console.error('Error fetching team documents:', error);
            res.status(500).json({ message: 'Server error fetching team documents' });
        }
    };
    static updateTeamDocumentStatus = async (req, res) => {
        try {
            const { documentId, userId, status } = req.body;

            const teamDoc = await TeamDocument.findById(documentId);
            if (!teamDoc) {
                return res.status(404).json({ message: "Document not found" });
            }

            let recipientUpdated = false;

            teamDoc.recipients = teamDoc.recipients.map((recipient) => {
                if (
                    recipient.userId?.toString() === userId ||
                    recipient?.toString() === userId
                ) {
                    recipient.status = status;
                    recipientUpdated = true;
                }
                return recipient;
            });

            if (!recipientUpdated) {
                return res.status(403).json({ message: "Recipient user not found or not authorized to update" });
            }

            await teamDoc.save();

            res.status(200).json({ message: "Recipient status updated", teamDoc });
        } catch (error) {
            console.error("Error updating team document status:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };


}

module.exports = teamDocumentController