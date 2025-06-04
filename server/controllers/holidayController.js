const Holiday = require("../models/holidaySchema");

// Create a new holiday
exports.createHoliday = async (req, res) => {
  try {
    const { name, date, description, isRecurring } = req.body;
    const organizationId = req.user.organizationId;
    const createdBy = req.user._id;

    const holiday = new Holiday({
      name,
      date,
      description,
      isRecurring,
      organizationId,
      createdBy
    });

    await holiday.save();

    res.status(201).json({
      message: "Holiday created successfully",
      holiday
    });
  } catch (error) {
    console.error("Error creating holiday:", error);
    res.status(500).json({ error: "Error creating holiday" });
  }
};

// Get all holidays for an organization
exports.getHolidays = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    
    const holidays = await Holiday.find({ organizationId })
      .sort({ date: 1 })
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName');

    res.status(200).json({
      message: "Holidays retrieved successfully",
      holidays
    });
  } catch (error) {
    console.error("Error fetching holidays:", error);
    res.status(500).json({ error: "Error fetching holidays" });
  }
};

// Update a holiday
exports.updateHoliday = async (req, res) => {
  try {
    const { holidayId } = req.params;
    const { name, date, description, isRecurring } = req.body;
    const updatedBy = req.user._id;

    const holiday = await Holiday.findById(holidayId);

    if (!holiday) {
      return res.status(404).json({ error: "Holiday not found" });
    }

    // Check if user belongs to the same organization
    if (holiday.organizationId.toString() !== req.user.organizationId.toString()) {
      return res.status(403).json({ error: "Not authorized to update this holiday" });
    }

    const updatedHoliday = await Holiday.findByIdAndUpdate(
      holidayId,
      {
        name,
        date,
        description,
        isRecurring,
        updatedBy
      },
      { new: true }
    );

    res.status(200).json({
      message: "Holiday updated successfully",
      holiday: updatedHoliday
    });
  } catch (error) {
    console.error("Error updating holiday:", error);
    res.status(500).json({ error: "Error updating holiday" });
  }
};

// Delete a holiday
exports.deleteHoliday = async (req, res) => {
  try {
    const { holidayId } = req.params;

    const holiday = await Holiday.findById(holidayId);

    if (!holiday) {
      return res.status(404).json({ error: "Holiday not found" });
    }

    // Check if user belongs to the same organization
    if (holiday.organizationId.toString() !== req.user.organizationId.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this holiday" });
    }

    await Holiday.findByIdAndDelete(holidayId);

    res.status(200).json({
      message: "Holiday deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting holiday:", error);
    res.status(500).json({ error: "Error deleting holiday" });
  }
}; 