import Connection from "../models/Connection.js";

export const getConnectionByPlatform = async (platform) => {
  const conn = await Connection.findOne({ platform: "WooCommerce" });
  return conn?.toObject();
};

export default getConnectionByPlatform;


