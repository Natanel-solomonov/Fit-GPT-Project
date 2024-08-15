import fetch from 'node-fetch';
// Function to search YouTube for videos based on a query
export const searchYouTube = async (ExtractedKeyword) => {
    // Refine the query to include specific keywords and ensure accuracy
    const refinedQuery = `${ExtractedKeyword} tutorial/explantion`;
    console.log("refinedQuery", refinedQuery);
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(refinedQuery)}&key=${process.env.YOUTUBE_API_KEY}&maxResults=20&order=relevance`);
    const data = await response.json();
    // Filter the results to ensure they match the intended query more accurately
    const filteredResults = data.items.filter(item => {
        const title = item.snippet.title.toLowerCase();
        const description = item.snippet.description.toLowerCase();
        return title.includes(ExtractedKeyword.toLowerCase());
    });
    return filteredResults.length > 0 ? filteredResults : data.items;
};
//# sourceMappingURL=youtubeAPI.js.map