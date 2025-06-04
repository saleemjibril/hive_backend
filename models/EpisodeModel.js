import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Provide episode title"],
  },  
  season: {
    type: String,
    required: [true, "Indicate season for episode"],
  },  
  categories: {
    type: Array,
    required: [true, "Provide episode category"],
  },
  description: {
    type: String,
    required: [true, "Provide episode description"],
  },
  image: {
    type: Object,
    required: [true, "Provide episode image"],
  },
  links: {
    type: Array,
    required: [true, "Provide episode links"],
  },
},
{
    timestamps: true,
  }
);

const Episode = mongoose.model('Episode', episodeSchema)

export default Episode;
