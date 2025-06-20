// src/components/filters/OffCanvasFilter.jsx
import React, { useEffect, useRef } from "react";
import FilterComponent from "./FilterComponent";
import { Typography } from "@mui/material";

const OffCanvasFilter = ({ filters, triggerOpen, onClose, onApply, onClear, onToggle, userName, renderButtons }) => {
  const offcanvasRef = useRef(null);

  useEffect(() => {
    let offcanvas;
    if (triggerOpen && offcanvasRef.current) {
      import("bootstrap").then((bootstrap) => {
        offcanvas = new bootstrap.Offcanvas(offcanvasRef.current);
        offcanvas.show();
        // Set focus to the first input and prevent focus trap interference
        const firstInput = offcanvasRef.current.querySelector("input");
        if (firstInput) {
          firstInput.focus();
          setTimeout(() => firstInput.focus(), 100); // Ensure focus after render
        }
      }).catch((err) => console.error("Bootstrap load error:", err));
    }

    const handleOutsideClick = (event) => {
      if (offcanvasRef.current) {
        const isOutside = !offcanvasRef.current.contains(event.target);
        const isCloseButton = event.target.classList.contains("btn-close");
        const isInteractive = event.target.tagName === "INPUT" || event.target.tagName === "BUTTON";
        console.log("Click - Outside:", isOutside, "Target:", event.target.tagName, "Interactive:", isInteractive);
        if (isOutside && !isInteractive && !isCloseButton) {
          console.log("Closing off-canvas due to outside click");
          onClose();
        }
      }
    };

    const handleFocusTrap = (event) => {
      if (triggerOpen && offcanvasRef.current) {
        const firstInput = offcanvasRef.current.querySelector("input");
        if (firstInput && !offcanvasRef.current.contains(document.activeElement)) {
          event.preventDefault();
          firstInput.focus();
          console.log("Focus trapped back to input");
        }
      }
    };

    if (triggerOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("focusin", handleFocusTrap);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("focusin", handleFocusTrap);
      if (offcanvas) offcanvas.hide();
    };
  }, [triggerOpen, onClose]);

  const handleCloseClick = () => {
    console.log("Close button clicked");
    onClose();
  };

  return (
    <>
      <div className="tableFilterButton">
        <div className="actionbuttons">
          <button onClick={onToggle} className="btn btn-primary">
            Show Filter
          </button>
        </div>
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
            onClick={handleCloseClick}
          />
        </div>
        <div className="offcanvas-body" style={{ backgroundColor: "#fff", padding: "20px" }}>
          {userName && (
            <Typography variant="subtitle1" style={{ marginBottom: "10px" }}>
              Filtering for: {userName}
            </Typography>
          )}
          <FilterComponent filters={filters} />
          <div className="filter-box-action" style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
            {renderButtons ? renderButtons(onApply, onClear) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default OffCanvasFilter;