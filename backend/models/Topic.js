import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["active", "scheduled", "completed"], // Add "completed" here
    default: "active",
  },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  imageUrl: String,
});


export default mongoose.model("Topic", topicSchema);



// import mongoose from "mongoose";

// const topicSchema = new mongoose.Schema({
//     title: { type: String, required: true, unique: true },
//     status: { type: String, enum: ["pending", "active", "scheduled", "completed"], required: true },
//     imageUrl: { type: String }
//   });
  

// export default mongoose.model("Topic", topicSchema);