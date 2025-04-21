import Topic from "../models/Topic.js";
import Brand from "../models/Brand.js"; // make sure Brand model is imported

import Connection from "../models/Connection.js";


export const createTopic = async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const { title, status, imageUrl, brandId, scheduleTime } = req.body;

    if (!brandId) {
      return res.status(400).json({ error: "brandId is required" });
    }

    // Get brand from DB
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    // Extract platform names from brand
    const platformNames = brand.platforms.map((p) => p.platform);

    // Find active connections for each platform
    const platformConnections = [];

    for (const platformName of platformNames) {
      const platformNormalized = platformName.toLowerCase();

      const connection = await Connection.findOne({
        platform: { $regex: new RegExp(`^${platformNormalized}$`, "i") },
        isActive: true,
      });

      if (connection) {
        platformConnections.push({
          platform: connection.platform,
          connectionId: connection._id,
        });
      } else {
        console.warn(`⚠️ No active connection found for platform: ${platformName}`);
      }
    }

    if (platformConnections.length === 0) {
      return res.status(400).json({ error: "No valid platform connections found in this brand." });
    }

    // Create new topic
    const newTopic = new Topic({
      title,
      status,
      imageUrl,
      brandId,
      scheduleTime,
      platforms: platformConnections,
    });

    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    console.error("❌ Error saving topic:", error.message);
    res.status(500).json({ error: error.message });
  }
};





// Get all topics
export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get topics by brand
export const getTopicsByBrand = async (req, res) => {
  const { brandId } = req.params;
  const { platform } = req.query; // Optional query parameter

  if (!brandId) {
    return res.status(400).json({ error: "Brand ID is required" });
  }

  try {
    const query = { brandId };

    // Optional platform filtering (case-insensitive match)
    if (platform) {
      query.platforms = { $elemMatch: { platform: new RegExp(`^${platform}$`, "i") } };
    }

    const topics = await Topic.find(query).populate("brandId", "name description");
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a topic (Partial Update Supported)
export const updateTopic = async (req, res) => {
  try {
    const { title, brandId, status, imageUrl, platforms } = req.body;

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (brandId) updatedFields.brandId = brandId;
    if (status) updatedFields.status = status;
    if (imageUrl) updatedFields.imageUrl = imageUrl;

    // If platforms are provided, process them
    if (platforms) {
      if (!Array.isArray(platforms)) {
        return res.status(400).json({ error: "Platforms must be an array" });
      }

      const populatedPlatforms = [];

      for (const platformName of platforms) {
        // Normalize platform name to match case-insensitive database values
        const platformNormalized = platformName.toLowerCase();

        // Validate platform
        if (!allowedPlatforms.includes(platformNormalized)) {
          return res.status(400).json({ error: "Invalid platform selected" });
        }

        // Fetch connectionId for the platform and brandId (case insensitive)
        const connection = await Connection.findOne({
          brandId,
          platform: { $regex: new RegExp(`^${platformNormalized}$`, "i") }, // Case-insensitive match
          isActive: true,
        });

        if (!connection) {
          return res.status(400).json({ error: `No active connection found for platform: ${platformName}` });
        }

        // Add the connectionId to the platform object
        populatedPlatforms.push({
          platform: platformName,
          connectionId: connection._id,  // Dynamically populate connectionId
        });
      }

      updatedFields.platforms = populatedPlatforms;
    }

    const updatedTopic = await Topic.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updatedTopic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    res.json(updatedTopic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a topic (Enhanced Error Handling)
export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    await topic.deleteOne();
    res.json({ message: "Topic deleted successfully", deletedTopic: topic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



