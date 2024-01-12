import React, { useState, useEffect } from "react";

import HighlightPicker from "./components/HighlightPicker.jsx";
import BumpChart from "./components/BumpChart.jsx";

import { yearlyDataFromURL, monthlyDataFromURL } from "./utils/SQL.jsx";

function App() {
  const [serverData, setServerData] = useState(null);
  useEffect(() => {
    yearlyDataFromURL().then((data) => setServerData(data));
  }, []);

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

  if (serverData === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <HighlightPicker setHighlights={setSeletedHighlights} options={options} />
      <div style={{ height: "1200px" }}>
        <BumpChart
          data={serverData}
          highlights={selectedHighlights}
          onClick={(data, event) => {
            // get the closes vertical point clicked (since the library returns all values)
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
            monthlyDataFromURL({
              year: data.points[closestPointIndex].data.x,
            }).then((data) => setSelectedData(data));
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
