// src/components/filters/FilterComponent.jsx
import React from "react";
import { Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckboxGroup from "./CheckboxGroup"; // Adjust path if needed
import DateRangeFilter from "./DateRangeFilter"; // Adjust path if needed

const FilterComponent = ({ filters }) => {
  return (
    <div>
      {filters.map(
        ({
          label,
          options,
          selectedOptions,
          handleCheckboxChange,
          handleDateChange,
          component,
          type,
        }) => (
          <Accordion key={label} defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${label}-content`}
              id={`${label}-header`}
            >
              <Typography>{label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ maxWidth: "350px", marginBottom: "10px" }}>
                {type === "checkbox" && (
                  <CheckboxGroup
                    options={options}
                    selectedOptions={selectedOptions}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                )}
                {type === "daterange" && (
                  <DateRangeFilter
                    options={options}
                    label={label}
                    handleDateChange={handleDateChange}
                  />
                )}
                {type === "text" && component}
              </div>
            </AccordionDetails>
          </Accordion>
        )
      )}
    </div>
  );
};

export default FilterComponent;