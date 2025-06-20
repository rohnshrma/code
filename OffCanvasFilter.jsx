// src/components/filters/OffCanvasFilter.jsx
import React, { useEffect, useRef } from "react";
import FilterComponent from "./FilterComponent";
import { Button, Typography } from "@mui/material";

const OffCanvasFilter = ({ filters, triggerOpen, onClose, onApply, onClear, onToggle, userName }) => {
  const offcanvasRef = useRef(null);

  useEffect(() => {
    let offcanvas;
    if (triggerOpen && offcanvasRef.current) {
      import("bootstrap").then((bootstrap) => {
        offcanvas = new bootstrap.Offcanvas(offcanvasRef.current);
        offcanvas.show();
      });
    }

    const handleOutsideClick = (event) => {
      if (offcanvasRef.current && !offcanvasRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (triggerOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (offcanvas) offcanvas?.hide();
    };
  }, [triggerOpen, onClose]);

  return (
    <div className="tableFilterButton">
      <div className="actionbuttons">
        <button onClick={onToggle} className="btn btn-primary">
          Show Filter
        </button>
      </div>
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
        ref={offcanvasRef}
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel">Filters</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={onClose}
          />
        </div>
        <div className="offcanvas-body" style={{ backgroundColor: "#f5f5f5" }}>
          {userName && (
            <Typography variant="subtitle1" style={{ marginBottom: "10px" }}>
              Filtering for: {userName}
            </Typography>
          )}
          <FilterComponent filters={filters} />
          <div className="filter-box-action" style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={onClear}
              style={{ marginRight: "10px" }}
            >
              Clear
            </Button>
            <Button variant="contained" onClick={onApply}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffCanvasFilter;