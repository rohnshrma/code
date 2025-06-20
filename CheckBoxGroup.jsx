// src/components/filters/CheckboxGroup.jsx
import React from "react";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

const CheckboxGroup = ({ options, selectedOptions, handleCheckboxChange }) => {
  return (
    <div style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "4px" }}>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={selectedOptions.includes(option.value)}
                onChange={handleCheckboxChange}
                value={option.value}
                className="small-checkbox"
              />
            }
            label={option.label}
            className="small-font-label"
            style={{ display: "block" }}
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default CheckboxGroup;