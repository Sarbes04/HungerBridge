import Donor from "../models/donorModel.js";
import Request from "../models/requestModel.js";
import bcrypt from "bcryptjs";
import axios from "axios";
import Receiver from "../models/receiverModel.js";
import dotenv from "dotenv";
dotenv.config();

export const donorRequest = async (req, res) => {
  console.log("Donor request function called");
  
  try {
    const {
      foodType,
      approxPeople,
      location,
      expiryTime,
      imageUrl,
    } = req.body;

    console.log("Request data:", { foodType, approxPeople, location, expiryTime });

    // Validate required fields
    if (!foodType || !approxPeople || !location || !expiryTime) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["foodType", "approxPeople", "location", "expiryTime"]
      });
    }

    let lat = "0";
    let lon = "0";

    // Simple geocoding - handle string location
    try {
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const geoData = geoRes.data;
      
      if (geoData && geoData.length > 0) {
        lat = geoData[0].lat;
        lon = geoData[0].lon;
        console.log("Coordinates found:", { lat, lon });
      }
    } catch (geoError) {
      console.log("Geocoding failed, using default coordinates");
    }

    // Create request without ML service for now
    const newRequest = new Request({
      donor: req.user.id,
      foodType,
      approxPeople: parseInt(approxPeople),
      location: {
        address: location,
        latitude: lat,
        longitude: lon,
      },
      expiryTime,
      imageUrl: imageUrl || " ",
      status: "pending",
    });

    await newRequest.save();
    console.log("Request saved successfully");

    res.status(201).json({
      message: "Request created successfully",
      request: newRequest,
    });

  } catch (error) {
    console.error("Error in donorRequest:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const editDonorProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const donor = await Donor.findById(id);

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    if (req.body.name) donor.name = req.body.name;
    if (req.body.phoneNumber) donor.phoneNumber = req.body.phoneNumber;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      donor.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedDonor = await donor.save();

    res.status(200).json({
      message: "Donor profile updated successfully",
      donor: updatedDonor,
    });
  } catch (error) {
    console.error("Error updating donor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDonorRequests = async (req, res) => {
  const { id } = req.user;
  try {
    const requests = await Request.find({ donor: id }).populate(
      "donor",
      "name phoneNumber email"
    );
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDonorProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const donor = await Donor.findById(id).select("-password");

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json({ donor });
  } catch (error) {
    console.error("Error fetching donor profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};