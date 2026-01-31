import axios from "axios";

import URL from './serverURL_link';

async function getEvent() {
  try {
    const response = await axios.get(`${URL}events`);
    return response.data; // ✅ Return the fetched data
  } catch (error) {
    console.error("Error fetching events:", error);
    return []; // ✅ Return an empty array in case of an error
  }
}

async function getEventCategory(category) {
  try {
    const categories = ['technical', 'gaming', 'cultural'];

    if (!categories.includes(category.toLowerCase())) {
      return "No Events Found";
    }

    const cacheKey = category;
    const cachedData = localStorage.getItem(cacheKey);
    const now = new Date();

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);

      // Check if the cache is still valid
      if (new Date(parsedData.expireAt) > now) {
        console.log('Using cache data');
        return parsedData.data;
      }

      // Cache expired: Remove it
      localStorage.removeItem(cacheKey);
    }

    // Fetch new data from the server
    const categorisedEvents = await axios.get(`${URL}events/${category}`);


    console.log("Categorised Events: ", categorisedEvents);
    // Store the new data in cache with an expiry time of 15 minutes
    console.log("Storing the data in the cache");
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data: categorisedEvents.data,
        expireAt: new Date(now.getTime() + 15 * 60 * 1000), // 15 min expiry
      })
    );

    return categorisedEvents.data;
  } catch (err) {
    console.error("Error getting data: ", err);
    return [];
  }
}

export {
  getEvent,
  getEventCategory,
};
