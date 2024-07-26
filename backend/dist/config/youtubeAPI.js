import fetch from 'node-fetch';
// Function to search YouTube for videos based on a query
export const searchYouTube = async (query) => {
    // Append additional fitness-related keywords to the search query
    const refinedQuery = `${query} exercise OR workout OR fitness OR Can OR Can't OR Calisthenics`;
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(refinedQuery)}&key=${process.env.YOUTUBE_API_KEY}`);
    const data = await response.json();
    return data.items;
};
//# sourceMappingURL=youtubeAPI.js.map