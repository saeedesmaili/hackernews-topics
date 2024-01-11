import React, { useState } from "react";

const HighlightInput = ({ setHighlights, options }) => {
  const [selectedValues, setSelectedValues] = useState([
    options[0],
    options[1],
    options[2],
  ]);

  const handleChange = (index, event) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = event.target.value;
    setSelectedValues(newSelectedValues);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setHighlights(selectedValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      {selectedValues.map((value, index) => (
        <label key={index}>
          Word {index + 1}:
          <select
            value={value}
            onChange={(event) => handleChange(index, event)}
          >
            {options.map((option, optionIndex) => (
              <option key={optionIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button type="submit">Update Highlights</button>
    </form>
  );
};

export default HighlightInput;
