import Episode from "../models/EpisodeModel.js";
import catchAsync from "../utils/catchAsync.js";


export const createEpisode = catchAsync(async (req, res, next) => {

  const newEpisode = await Episode.create(req.body);

  res.status(200).json({
    status: "success",
    message:
      "Episode created successfully",
  });
});

// export const updateEpisode = catchAsync(async (req, res) => {
//   try {
//     const updated = await Episode.findByIdAndUpdate(req.params.id, req.body);
//     res.status(200).json({
//       message:
//         "Episode updated successfully",
//     });
//   } catch (err) {
//     console.log("Episode UPDATE ERROR ----> ", err);
//     res.status(400).json({
//       err: err.message,
//     });
//   }
// });


// export const getEpisode = catchAsync(async (req, res) => {
//   try {
//     const Episode = await Episode.findById(req.params.id);
//     res.status(200).json(Episode);
//   } catch (err) {
//     console.log("Episode FETCH ERROR ----> ", err);
//     res.status(400).json({
//       err: err.message,
//     });
//   }
// });

// export const getAllEpisodes = catchAsync(async (req, res) => {
//   try {
//     let Episodes = await Episode.find({})
//     res.status(200).json([...Episodes]);
//   } catch (err) {
//     console.log("Episode FETCH ERROR ----> ", err);
//     res.status(400).json({
//       err: err.message,
//     });
//   }
// });

// export const deleteEpisode = catchAsync(async (req, res) => {
//   try {
//     const deleted = await Episode.findByIdAndDelete(req.params.id)
  
//     if (!deleted) {
//       return next(new AppError('No document found with that ID', 404))
//     }
  
  
  
//     res.status(200).json({
//       status: 'success',
//       message:
//       "Episode deleted successfully",
//     })
//   } catch (err) {
//     console.log("Episode DELETE ERROR ----> ", err);
//     res.status(400).json({
//       err: err.message,
//     });
//   }
// });
