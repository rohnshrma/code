// src/pages/UserList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ReactDataTable from "react-data-table-component";
import UserListOffCanvasFilter from "../../components/filters/UserListOffCanvasFilter"; // Adjust path
import NewUser from "./NewUser";
import EditUserInfo from "./EditUser";
import DeleteUsers from "./DeleteUser";
import axios from "axios";
import { useUserInfoStore } from "../../stateStore/userInfoStore";
import IsLoadingModal from "../../components/modals/IsLoadingModal";
import InfoMessage from "../../envisantComponent/info/InfoMessage";

const UserList = () => {
  const [userListData, setUserListData] = useState([]);
  const [userListToFilter, setUserListToFilter] = useState([]);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const { ppaCuID, cuUserName, ssoCuID } = useUserInfoStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showResposeMsg, setShowResponseMsg] = useState(false);
  const [responseMsg, setResponseMsg] = useState();
  const [firstLoad, setFirstLoad] = useState(true);
  const [rowCount, setRowCount] = useState(0);

  const userListColumns = [
    {
      name: "First Name",
      class: "table-col-card",
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: "Last Name",
      class: "table-col-card",
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: "Account Id",
      class: "table-col-card",
      selector: (row) => row.loginID,
      sortable: true,
    },
    {
      name: "Status",
      class: "table-col-card",
      selector: (row) =>
        row.appUserActive === "true"
          ? getStatusDiv("Active")
          : getStatusDiv("InActive"),
      sortable: true,
    },
    {
      name: "Role",
      class: "table-col-card",
      selector: (row) =>
        row.roleDesc === "Non Admin" ? "Operational" : row.roleDesc,
      sortable: true,
    },
    {
      name: "Action",
      class: "table-col-card",
      selector: (row) => (
        <div className="actionbuttons">
          <button
            onClick={(e) => handleEditUserInfo(e, row.userID)}
            id={row.userID}
            className="edit-icons"
          ></button>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Deactivate",
      class: "table-col-card",
      selector: (row) =>
        row.appUserActive === "true" ? (
          <div className="actionbuttons">
            <button
              className="deletebtn"
              onClick={(e) => handleDeleteUsers(e, row.userID)}
              id={row.ID}
            ></button>
          </div>
        ) : (
          <div className="actionbuttons">
            <button className="deletebtn" id={row.ID}></button>
          </div>
        ),
    },
  ];

  const getStatusDiv = (status) => {
    if (status === "Active") {
      return (
        <div className="activeCard">
          <span>Active</span>
        </div>
      );
    } else if (status === "InActive") {
      return (
        <div className="issuedCard">
          <span>Inactive</span>
        </div>
      );
    } else {
      return <span>{status}</span>;
    }
  };

  const handleEditUserInfo = (e, cuUserId) => {
    setSelectedUser(
      Array.isArray(userListData)
        ? userListData.find((x) => x.userID === cuUserId)
        : []
    );
    setEditUserModal(!editUserModal);
  };

  const handleEditedUserInfo = (data, newUser) => {
    const newUserData = data;
    setIsLoading(true);
    setEditUserModal(false);
    const cuID = ssoCuID;
    const getCUUsers = {
      CUID: cuID,
      RequestedBy: cuUserName,
    };
    axios
      .post("/cuusers", getCUUsers)
      .then((res) => {
        if (res.data) {
          const myObject = res.data;
          setUserListData(myObject);
          setUserListToFilter(myObject);
          setResponseMsg(
            `User ${newUser ? "created" : "updated"} successfully: ${
              newUserData.firstName
            } ${newUserData.lastName}`
          );
          setShowResponseMsg(true);
          setTimeout(() => setShowResponseMsg(false), 5000);
        }
      })
      .catch((error) => {
        console.error("Error fetching CU users:", error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteUsers = (e, cuUserId) => {
    setShowResponseMsg(false);
    setSelectedUser(
      Array.isArray(userListData)
        ? userListData.find((x) => x.userID === cuUserId)
        : []
    );
    setShowDeleteModal(true);
  };

  const handleDeletedUsers = (respObject) => {
    const cuID = ssoCuID;
    const getCUUsers = {
      CUID: cuID,
      RequestedBy: cuUserName,
    };
    setIsLoading(true);
    axios
      .post("/cuusers", getCUUsers)
      .then((res) => {
        if (res.data) {
          const myObject = res.data;
          setUserListData(myObject);
          setUserListToFilter(myObject);
          if (respObject) {
            setResponseMsg(
              respObject.SSOResults.SSOUsers?.AppMsg ||
                respObject.SSOResults.SSOCreditUnionUserDelete?.AppMsg
            );
            setShowResponseMsg(true);
            setTimeout(() => setShowResponseMsg(false), 5000);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching CU users:", error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal((prev) => !prev);
  };

  const handleAddNewUserModal = () => {
    setShowResponseMsg(false);
    setShowNewUserModal((prev) => !prev);
  };

  useEffect(() => {
    if (!firstLoad) {
      setRowCount(userListData?.length || 0);
    } else {
      setRowCount(
        userListData?.filter((item) => item.appUserActive === "true").length || 0
      );
    }
  }, [userListData, firstLoad]);

  useEffect(() => {
    const cuID = ssoCuID;
    const getCUUsers = {
      CUID: cuID,
      RequestedBy: cuUserName,
    };
    setIsLoading(true);
    axios
      .post("/cuusers", getCUUsers)
      .then((res) => {
        if (res.data) {
          const myObject = res.data;
          setUserListData(myObject);
          setUserListToFilter(myObject);
        }
      })
      .catch((error) => {
        console.error("Error fetching CU users:", error);
      })
      .finally(() => setIsLoading(false));
  }, [ssoCuID, cuUserName]);

  return (
    <div>
      <div className="allHeading flexbox-alignIcon">
        <h2>Admin / User List</h2>
        <Button
          variant="outlined"
          className="back-arrow-btn"
          onClick={handleAddNewUserModal}
        >
          Add New User
        </Button>
      </div>
      <div className="mtop10">
        {showResposeMsg && <InfoMessage info={responseMsg} />}
      </div>
      <div className="mtop30">
        <h3>User List ({rowCount})</h3>
        <UserListOffCanvasFilter
          data={userListToFilter}
          isFirstLoad={firstLoad}
          calledFrom="UserList"
          onFilter={(filteredData) => {
            setUserListData(filteredData);
            setFirstLoad(false);
          }}
          filterColumns={[
            "loginID",
            "firstName",
            "lastName",
            "appUserActive",
            "roleDesc",
            "Action",
          ]}
          onClearFilters={() => {
            setUserListData(userListToFilter);
            setFirstLoad(false);
          }}
        />
      </div>
      <div className="card-search-alternate-table">
        <ReactDataTable
          columns={userListColumns}
          data={
            firstLoad
              ? userListData.filter((item) => item.appUserActive === "true")
              : userListData
          }
          selectableRows={false}
          pagination
          onChangePage={(_, totalRows) => setRowCount(totalRows)}
          onChangeRowsPerPage={(currentRowsPerPage, currentPage) =>
            setRowCount(currentRowsPerPage * currentPage)
          }
        />
      </div>
      <NewUser
        id="md-popup-form"
        show={showNewUserModal}
        newUser={true}
        onHide={handleAddNewUserModal}
        onUserAdd={handleEditedUserInfo}
      />
      {selectedUser && showDeleteModal && (
        <DeleteUsers
          id="md-popup-form"
          show={showDeleteModal}
          onHide={handleShowDeleteModal}
          onDeleteUsers={handleDeletedUsers}
          data={selectedUser}
        />
      )}
      {selectedUser && editUserModal && (
        <EditUserInfo
          id="md-popup-form"
          data={selectedUser}
          newUser={false}
          show={editUserModal}
          onHide={handleEditUserInfo}
          onEditUserInfo={handleEditedUserInfo}
        />
      )}
      <IsLoadingModal id="md-popup-form" show={isLoading} />
    </div>
  );
};

export default UserList;