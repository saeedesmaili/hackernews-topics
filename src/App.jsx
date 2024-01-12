import React, { useState, useEffect } from "react";

import HighlightPicker from "./components/HighlightPicker.jsx";
import BumpChart from "./components/BumpChart.jsx";
import transformData from "./utils/Utils.jsx";
import yearlyLocalData from "./data/results_formatted_yearly.json";
import monthlyLocalData from "./data/results_formatted_all.json";

import initSqlJs from "sql.js";

const WASMConfig = {
  locateFile: (filename) => `./src/assets/${filename}`,
};

async function dummySQLFromURL() {
  const sqlPromise = initSqlJs(WASMConfig);
  const dbUrl =
    "https://raw.githubusercontent.com/saeedesmaili/hackernews-topics/master/src/data/my_database.db";
  const dataPromise = fetch(dbUrl).then((res) => res.arrayBuffer());
  const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
  const db = new SQL.Database(new Uint8Array(buf));

  // const stmt = db.prepare("SELECT * FROM ngrams limit 10;");
  // while (stmt.step()) {
  //   const row = stmt.getAsObject();
  //   console.log("Here is a row: " + JSON.stringify(row));
  // }

  const res = db.exec(`
  WITH tempTable AS (
    SELECT 
        SUBSTR(month, 1, 4) as year, 
        month,
        unigram, 
        MIN(unigram_score) as min_unigram_score
    FROM 
        ngrams 
    GROUP BY 
        month, unigram
)

SELECT 
    year, 
    unigram,
    SUM(min_unigram_score) as sum_unigram_score
FROM 
    tempTable
GROUP BY 
    year, unigram;
`);
  console.log(res[0]);
}

function filterData({ aggregation, year }) {
  console.log(aggregation, year);
  if (aggregation === "Y") {
    return transformData(yearlyLocalData);
  } else if (aggregation === "M") {
    let allData = monthlyLocalData;
    const monthlyData = {};
    const keys = Object.keys(allData).filter((key) => key.startsWith(year));

    keys.forEach((key) => {
      monthlyData[key] = allData[key];
    });
    return transformData(monthlyData);
  }
}

function App() {
  dummySQLFromURL();
  let serverData = filterData({ aggregation: "Y" });

  const [selectedData, setSelectedData] = useState(null);

  const options = [
    "google",
    "apple",
    "facebook",
    "amazon",
    "twitter",
    "microsoft",
    "netflix",
  ];
  const [selectedHighlights, setSeletedHighlights] = useState([
    "google",
    "amazon",
    "twitter",
  ]);

  return (
    <div>
      <HighlightPicker setHighlights={setSeletedHighlights} options={options} />
      <div style={{ height: "1200px" }}>
        <BumpChart
          data={serverData}
          highlights={selectedHighlights}
          onClick={(data, event) => {
            const closestPointIndex = data.points.reduce(
              (closestIndex, currentPoint, currentIndex) => {
                const currentDistance = Math.abs(
                  currentPoint.x - event.clientX
                );
                const closestDistance = Math.abs(
                  data.points[closestIndex].x - event.clientX
                );

                return currentDistance < closestDistance
                  ? currentIndex
                  : closestIndex;
              },
              0
            );
            setSelectedData(
              filterData({
                aggregation: "M",
                year: data.points[closestPointIndex].data.x,
              })
            );
          }}
        />
      </div>
      {selectedData && (
        <div style={{ height: "1200px" }}>
          <BumpChart data={selectedData} highlights={selectedHighlights} />
        </div>
      )}
    </div>
  );
}

export default App;
