function transformData(apiResponse) {
  // Create a set of all dates and all unigrams
  let allDates = new Set(Object.keys(apiResponse));
  let allUnigrams = new Set();

  // Create an initial map of all series with each series having a data array filled with null values
  let seriesMap = {};
  for (let date of allDates) {
    for (let unigramObj of apiResponse[date]) {
      allUnigrams.add(unigramObj.unigram);
    }
  }

  // Initialize the seriesMap with all unigrams and null data
  allUnigrams.forEach((unigram) => {
    seriesMap[unigram] = {
      id: unigram,
      data: Array.from(allDates, (date) => ({ x: date, y: null })),
    };
  });

  // Iterate over each key-value pair in the API response
  for (let [date, unigrams] of Object.entries(apiResponse)) {
    // For each unigram in the array...
    unigrams.forEach((unigramObj, index) => {
      // Replace the null data point for this date with the real data
      let dataPointIndex = seriesMap[unigramObj.unigram].data.findIndex(
        (datum) => datum.x === date
      );
      seriesMap[unigramObj.unigram].data[dataPointIndex] = {
        x: date,
        y: index < 45 ? index + 1 : null, // assuming ranking starts from 1 for the first item and more than 5 ranks are not allowed
      };
    });
  }

  // Finally, convert the series map to an array and return it
  return Object.values(seriesMap);
}

export default transformData;
