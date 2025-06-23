import Event from "../models/EventModel.js";
import catchAsync from "../utils/catchAsync.js";

// export async function fetchMediumArticles(username) {
//     console.log("request!");

//   try {

//     const response = await fetch(
//       `https://medium.com/@saleemjibril?format=json`
//     );
//     return response;
//     // const feed = await parser.parseURL(`https://medium.com/feed/@saleemjibril`);

//     // return feed.items.map(item => ({
//     //   title: item.title,
//     //   link: item.link,
//     //   pubDate: item.pubDate,
//     //   author: item['dc:creator'] || item.creator,
//     //   categories: item.categories || [],
//     //   contentSnippet: item.contentSnippet,
//     //   content: item['content:encoded'] || item.content,
//     //   guid: item.guid
//     // }));
//   } catch (error) {
//     console.error('Error fetching Medium posts:', error);
//     return [];
//   }
// }

export const fetchMediumArticles = catchAsync(async (req, res) => {
  try {
    const response = await fetch(
            `https://medium.com/@saleemjibril?format=json`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.text();
        const jsonData = data.replace('])}while(1);</x>', '');
        
        // Parse the JSON string into an actual object
        const parsedData = JSON.parse(jsonData);
        
        // Return the actual data structure, not wrapped in another object
    res.status(200).json({ status: "success", parsedData });
  } catch (err) {
    console.log("EVENT FETCH ERROR ----> ", err);
    res.status(400).json({
      err: err.message,
    });
  }
});
