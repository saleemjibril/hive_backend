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
      `https://medium.com/feed/@insidethehivepod`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xmlData = await response.text();
    
    // Parse XML to extract article data
    const articles = parseRSSFeed(xmlData);
    
    res.status(200).json({ 
      status: "success", 
      count: articles.length,
      data: articles 
    });
  } catch (err) {
    console.log("MEDIUM RSS FETCH ERROR ----> ", err);
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
});

// Helper function to parse RSS XML
function parseRSSFeed(xmlString) {
  try {
    // Remove any XML declaration and CDATA sections that might cause issues
    const cleanXml = xmlString.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
    
    // Create a simple parser for RSS items
    const items = [];
    const itemRegex = /<item>(.*?)<\/item>/gs;
    let match;
    
    while ((match = itemRegex.exec(cleanXml)) !== null) {
      const itemContent = match[1];
      
      const article = {
        title: extractTag(itemContent, 'title'),
        link: extractTag(itemContent, 'link'),
        pubDate: extractTag(itemContent, 'pubDate'),
        creator: extractTag(itemContent, 'dc:creator'),
        description: extractTag(itemContent, 'description'),
        content: extractTag(itemContent, 'content:encoded'),
        guid: extractTag(itemContent, 'guid'),
        categories: extractMultipleTags(itemContent, 'category')
      };
      
      // Extract images from content
      const images = extractImages(article.content || article.description);
      
      // Clean up and format the article data
      article.publishedAt = article.pubDate ? new Date(article.pubDate).toISOString() : null;
      
      // Improved description extraction - use content if description is empty
      if (!article.description || article.description.trim() === '') {
        article.description = extractDescriptionFromContent(article.content);
      } else {
        article.description = cleanHtml(article.description);
      }
      
      article.excerpt = createExcerpt(article.description, 200);
      article.featuredImage = images.length > 0 ? images[0] : null;
      article.images = images;
      
      items.push(article);
    }
    
    return items;
  } catch (error) {
    console.error('RSS parsing error:', error);
    return [];
  }
}

// New function to extract meaningful description from content
function extractDescriptionFromContent(content) {
  if (!content) return '';
  
  // Remove figure tags and images first to avoid them in description
  let cleanContent = content.replace(/<figure[^>]*>.*?<\/figure>/gs, '');
  cleanContent = cleanContent.replace(/<img[^>]*>/gs, '');
  
  // Extract all paragraph content
  const paragraphs = [];
  const pRegex = /<p[^>]*>(.*?)<\/p>/gs;
  let match;
  
  while ((match = pRegex.exec(cleanContent)) !== null) {
    const paragraphContent = match[1];
    const cleanParagraph = cleanHtml(paragraphContent);
    
    // Skip empty paragraphs, social media handles, and very short paragraphs
    if (cleanParagraph.length > 20 && 
        !cleanParagraph.match(/^(IG:|X:|Medium:|Twitter:|@|Follow|For more)/i) &&
        !cleanParagraph.match(/^https?:\/\//)) {
      paragraphs.push(cleanParagraph);
    }
  }
  
  // If we have paragraphs, use the first 2-3 for description
  if (paragraphs.length > 0) {
    let description = paragraphs[0];
    
    // If first paragraph is short, add the second one
    if (description.length < 100 && paragraphs.length > 1) {
      description += ' ' + paragraphs[1];
    }
    
    // If still short and we have a third paragraph, add it
    if (description.length < 150 && paragraphs.length > 2) {
      description += ' ' + paragraphs[2];
    }
    
    return description.trim();
  }
  
  // Fallback: try to extract from any text content
  const textContent = cleanHtml(content);
  if (textContent.length > 50) {
    return createExcerpt(textContent, 300);
  }
  
  return '';
}

// Helper function to extract content between XML tags
function extractTag(content, tag) {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'is');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

// Helper function to extract multiple tags (like categories)
function extractMultipleTags(content, tag) {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'gis');
  const matches = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1].trim());
  }
  
  return matches;
}

// Helper function to clean HTML tags from text
function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&')   // Replace &amp; with &
    .replace(/&lt;/g, '<')    // Replace &lt; with <
    .replace(/&gt;/g, '>')    // Replace &gt; with >
    .replace(/&quot;/g, '"')  // Replace &quot; with "
    .replace(/&#39;/g, "'")   // Replace &#39; with '
    .replace(/\s+/g, ' ')     // Replace multiple whitespace with single space
    .trim();
}

// Helper function to create excerpt
function createExcerpt(text, maxLength = 200) {
  if (!text) return '';
  
  const cleaned = cleanHtml(text);
  if (cleaned.length <= maxLength) return cleaned;
  
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}

// Helper function to extract images from content
function extractImages(content) {
  if (!content) return [];
  
  const images = [];
  
  // Extract img tags with src attributes
  const imgRegex = /<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let match;
  
  while ((match = imgRegex.exec(content)) !== null) {
    const imageUrl = match[1];
    
    // Extract additional attributes
    const imgTag = match[0];
    const alt = extractAttribute(imgTag, 'alt') || '';
    const width = extractAttribute(imgTag, 'width') || null;
    const height = extractAttribute(imgTag, 'height') || null;
    
    images.push({
      url: imageUrl,
      alt: alt,
      width: width ? parseInt(width) : null,
      height: height ? parseInt(height) : null
    });
  }
  
  // Also look for Medium-specific image patterns
  const mediumImgRegex = /https:\/\/cdn-images-\d+\.medium\.com\/[^"\s]+/gi;
  const mediumMatches = content.match(mediumImgRegex);
  
  if (mediumMatches) {
    mediumMatches.forEach(url => {
      // Avoid duplicates
      if (!images.find(img => img.url === url)) {
        images.push({
          url: url,
          alt: '',
          width: null,
          height: null
        });
      }
    });
  }
  
  return images;
}

// Helper function to extract attributes from HTML tags
function extractAttribute(htmlTag, attribute) {
  const regex = new RegExp(`${attribute}\\s*=\\s*["']([^"']+)["']`, 'i');
  const match = htmlTag.match(regex);
  return match ? match[1] : null;
}