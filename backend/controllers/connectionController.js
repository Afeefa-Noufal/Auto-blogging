import Connection from "../models/Connection.js";

// Add a new connection
export const addConnection = async (req, res) => {
  try {
    const { platform, siteUrl, consumerKey, consumerSecret, isActive } = req.body;

    const connection = new Connection({
      platform,
      siteUrl,
      consumerKey,
      consumerSecret,
      isActive,
    });

    await connection.save();
    res.status(201).json({ message: "Connection added successfully", connection });
  } catch (error) {
    res.status(500).json({ error: "Failed to add connection" });
  }
};

// Get all connections
export const getConnections = async (req, res) => {
  try {
    const connections = await Connection.find();
    res.status(200).json(connections);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch connections" });
  }
};

// Update a connection
export const updateConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedConnection = await Connection.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json({ message: "Connection updated successfully", updatedConnection });
  } catch (error) {
    res.status(500).json({ error: "Failed to update connection" });
  }
};

// Delete a connection
export const deleteConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedConnection = await Connection.findByIdAndDelete(id);

    if (!deletedConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json({ message: "Connection deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete connection" });
  }
};
