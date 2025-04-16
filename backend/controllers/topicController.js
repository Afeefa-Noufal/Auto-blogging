import Topic from "../models/Topic.js";

// Create a new topic
export const createTopic = async (req, res) => {
  try {
    console.log("Received data:", req.body); // Debugging log

    const { title, status, imageUrl, brandId, scheduleTime } = req.body; // ✅ include scheduleTime

    if (!brandId) {
      return res.status(400).json({ error: "brandId is required" });
    }

    const newTopic = new Topic({
      title,
      status,
      imageUrl,
      brandId,
      scheduleTime, // ✅ save it
    });

    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
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

  if (!brandId) {
    return res.status(400).json({ error: "Brand ID is required" });
  }

  try {
    const topics = await Topic.find({ brandId }).populate("brandId", "name description");
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a topic (Partial Update Supported)
export const updateTopic = async (req, res) => {
  try {
    const { title, brandId, status, imageUrl } = req.body;

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (brandId) updatedFields.brandId = brandId;
    if (status) updatedFields.status = status;
    if (imageUrl) updatedFields.imageUrl = imageUrl;

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
