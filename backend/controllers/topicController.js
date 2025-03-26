import Topic from "../models/Topic.js";

// Create a new topic
export const createTopic = async (req, res) => {
  try {
    console.log("Received data:", req.body); // Debugging log

    const { title, status, imageUrl, brandId } = req.body;

    if (!brandId) {
      return res.status(400).json({ error: "brandId is required" });
    }

    const newTopic = new Topic({ title, status, imageUrl, brandId });
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
    const topics = await Topic.find({ brandId });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a topic
export const updateTopic = async (req, res) => {
  try {
    const { title, brandId, status, imageUrl } = req.body;
    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      { title, brandId, status, imageUrl },
      { new: true }
    );

    if (!updatedTopic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    res.json(updatedTopic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a topic
export const deleteTopic = async (req, res) => {
  try {
    const deletedTopic = await Topic.findByIdAndDelete(req.params.id);

    if (!deletedTopic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// import Topic from "../models/Topic.js";

// // Add a new topic
// export const createTopic = async (req, res) => {
//   try {
//     const { title, status, scheduled, image } = req.body;

//     // Check if topic already exists
//     const existingTopic = await Topic.findOne({ title });
//     if (existingTopic) {
//       return res.status(400).json({ message: "Topic already exists" });
//     }

//     const newTopic = new Topic({ title, status, scheduled, image });
//     await newTopic.save();

//     res.status(201).json(newTopic);
//   } catch (error) {
//     console.error("Error creating topic:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Get all topics
// export const getTopics = async (req, res) => {
//   try {
//     const topics = await Topic.find();
//     res.json(topics);
//   } catch (error) {
//     console.error("Error fetching topics:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Update topic status/scheduling
// export const updateTopic = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, scheduled, image } = req.body;

//     const updatedTopic = await Topic.findByIdAndUpdate(
//       id,
//       { status, scheduled, image },
//       { new: true }
//     );

//     if (!updatedTopic) {
//       return res.status(404).json({ message: "Topic not found" });
//     }

//     res.json(updatedTopic);
//   } catch (error) {
//     console.error("Error updating topic:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Delete a topic
// export const deleteTopic = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Topic.findByIdAndDelete(id);
//     res.json({ message: "Topic deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting topic:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };