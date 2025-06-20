// src/components/filters/UserListOffCanvasFilter.jsx
import React, { useState, useEffect } from "react";
import { Buttons } from "../buttons/buttons"; // Adjust path as needed
import { TextField } from "@mui/material";
import OffCanvasFilter from "./OffCanvasFilter"; // Adjust path as needed
import { useUserInfoStore } from "../../stateStore/userInfoStore"; // Adjust path

const UserListOffCanvasFilter = ({
  data,
  isFirstLoad,
  calledFrom,
  filterColumns,
  onFilter,
  onClearFilters,
}) => {
  const [filterValues, setFilterValues] = useState(
    filterColumns.reduce((acc, column) => ({ ...acc, [column]: "" }), {})
  );
  const [accountOrName, setAccountOrName] = useState("");
  const [selectedCBRoleValues, setSelectedCBRoleValues] = useState([]);
  const [selectedCBStatusValues, setSelectedCBStatusValues] = useState(
    isFirstLoad ? ["Active"] : []
  );
  const [filterTrigger, setFilterTrigger] = useState(false);
  const { cuUserName } = useUserInfoStore();

  const filterStatus = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const filterRoles = [
    { value: "Operational", label: "Operational" },
    { value: "Reports", label: "Reports" },
    { value: "Non Admin", label: "Non Admin" },
    { value: "Admin", label: "Admin" },
  ];

  const handleFilter = () => {
    let filteredData = [...data];
    if (accountOrName) {
      if (accountOrName.includes(" ")) {
        const [firstName, lastName] = accountOrName.split(" ");
        filteredData = filteredData.filter(
          (item) =>
            item.firstName?.toLowerCase().includes(firstName.toLowerCase()) &&
            item.lastName?.toLowerCase().includes(lastName.toLowerCase())
        );
      } else {
        filteredData = filteredData.filter(
          (item) =>
            item.firstName?.toLowerCase().includes(accountOrName.toLowerCase()) ||
            item.lastName?.toLowerCase().includes(accountOrName.toLowerCase()) ||
            item.loginID?.toLowerCase().includes(accountOrName.toLowerCase())
        );
      }
    }

    if (filterValues.Status?.length) {
      if (
        filterValues.Status.includes("Active") &&
        filterValues.Status.includes("Inactive")
      ) {
        // No filtering if both are selected
      } else if (filterValues.Status.includes("Active")) {
        filteredData = filteredData.filter(
          (item) => item.appUserActive === "true" || item.appUserActive === true
        );
      } else if (filterValues.Status.includes("Inactive")) {
        filteredData = filteredData.filter(
          (item) => item.appUserActive === "false" || item.appUserActive === false
        );
      }
    }

    if (filterValues.Role?.length) {
      if (
        filterValues.Role.includes("Operational") &&
        filterValues.Role.includes("Reports") &&
        filterValues.Role.includes("Non Admin") &&
        filterValues.Role.includes("Admin")
      ) {
        // No filtering if all roles are selected
      } else {
        filteredData = filteredData.filter((item) =>
          filterValues.Role.includes(item.roleDesc)
        );
      }
    }

    if (filterValues.Status?.length || filterValues.Role?.length || accountOrName) {
      onFilter(filteredData);
    }
    setFilterTrigger(false);
  };

  const handleClearFilters = () => {
    setAccountOrName("");
    setSelectedCBStatusValues([]);
    setSelectedCBRoleValues([]);
    setFilterValues(
      filterColumns.reduce((acc, column) => ({ ...acc, [column]: "" }), {})
    );
    onClearFilters();
    setFilterTrigger(false);
  };

  const handleStatusCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCBStatusValues((prev) =>
      checked ? [...prev, value] : prev.filter((val) => val !== value)
    );
    setFilterValues((prev) => ({
      ...prev,
      Status: checked
        ? [...(prev.Status || []), value]
        : (prev.Status || []).filter((val) => val !== value),
    }));
  };

  const handleRoleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCBRoleValues((prev) =>
      checked ? [...prev, value] : prev.filter((val) => val !== value)
    );
    setFilterValues((prev) => ({
      ...prev,
      Role: checked
        ? [...(prev.Role || []), value]
        : (prev.Role || []).filter((val) => val !== value),
    }));
  };

  const filters = [
    {
      label: "Account ID or Name",
      type: "text",
      component: (
        <TextField
          style={{ width: "100%", backgroundColor: "#fff", marginBottom: "10px" }}
          id="accountOrName"
          type="text"
          placeholder="Enter account ID or name"
          value={accountOrName}
          onChange={(e) => { e.stopPropagation(); setAccountOrName(e.target.value); }}
          autoFocus
          inputProps={{ "data-testid": "accountOrName-input" }}
          onFocus={(e) => console.log("Input focused:", e.target.value)}
          onBlur={(e) => console.log("Input blurred by:", document.activeElement)}
        />
      ),
    },
    {
      label: "Status",
      options: filterStatus,
      selectedOptions: selectedCBStatusValues,
      handleCheckboxChange: handleStatusCheckboxChange,
      type: "checkbox",
    },
    {
      label: "Roles",
      options: filterRoles,
      selectedOptions: selectedCBRoleValues,
      handleCheckboxChange: handleRoleCheckboxChange,
      type: "checkbox",
    },
  ];

  return (
    <OffCanvasFilter
      filters={filters}
      triggerOpen={filterTrigger}
      onClose={() => setFilterTrigger(false)}
      onApply={handleFilter}
      onClear={handleClearFilters}
      onToggle={() => setFilterTrigger((prev) => !prev)}
      userName={cuUserName}
      renderButtons={(onApply, onClear) => (
        <>
          <Buttons
            id="btnClear"
            type="secondary"
            value="Clear"
            isDisabled={false}
            clickHandler={onClear}
          />
          <Buttons
            id="btnApply"
            type="primary"
            value="Apply"
            isDisabled={false}
            clickHandler={onApply}
          />
        </>
      )}
    />
  );
};

export default UserListOffCanvasFilter;