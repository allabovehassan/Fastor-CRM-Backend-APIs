const express = require("express");
require("dotenv").config();
const Crouter = express.Router();
const { ClientModel } = require("../Model/Client_Student_Modal");
const { authenticator } = require("../MiddleWare/Authentication");

// Adding a Query By Customer/Client
Crouter.post("/", async (req, res) => {
  const { name, email, courseInterest, phone } = req.body;
  try {
    let data = new ClientModel({
      name,
      email,
      courseInterest,
      phone,
    });

    await data.save();

    res.status(200).json({ message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Error submitting enquiry:", error.message);
    res.status(500).json({ Error: error.message });
  }
});

// Public Enquiries
Crouter.get("/public", authenticator, async (req, res) => {
  try {
    const enquiries = await ClientModel.find({ claimedBy: null });

    res.status(200).json(enquiries);
  } catch (error) {
    console.error("Error fetching public enquiries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Claiming
Crouter.post("/:enquiryId/claim", authenticator, async (req, res) => {
  const { enquiryId } = req.params;
  const employeeId = req.employeeId;
  try {
    const updatedEnquiry = await ClientModel.findByIdAndUpdate(
      enquiryId,
      { $set: { claimedBy: employeeId } },
      { new: true }
    );

    if (!updatedEnquiry) {
      res.status(404).json({ error: "Enquiry not found or already claimed" });
      return;
    }

    res.status(200).json({ message: "Enquiry claimed successfully" });
  } catch (error) {
    console.error("Error claiming enquiry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Claimed
Crouter.get("/claimed", authenticator, async (req, res) => {
  try {
    const employeeId = req.employeeId;

    // Fetch all leads claimed by the logged-in user
    const claimedLeads = await ClientModel.find({ claimedBy: employeeId });

    res.status(200).json(claimedLeads);
  } catch (error) {
    console.error("Error fetching claimed leads:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { Crouter };
