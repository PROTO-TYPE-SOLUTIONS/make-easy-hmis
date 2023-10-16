import React from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager } from "devextreme-react/data-grid";
import EditPatientDetails from "./edit-patient-details-modal";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { LuMoreHorizontal } from "react-icons/lu";
import DeletePatientModal from "./delete-patient-modal";
import { Chip } from "@mui/material";


const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const getActions = () => {
  let actions = [
    {
      action: "delete",
      label: "Delete",
      icon: <AiFillDelete className="text-warning text-xl mx-2" />,
    },
    {
      action: "edit",
      label: "Edit",
      icon: <BiEdit className="text-xl text-success  mx-2" />,
    },
  ];

  return actions;
};

const AdminPatientsDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const userActions = getActions();
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState({});

  const users = [
    {
      number: "1",
      id_number: "1234821",
      name: "Marcos Ochieng",
      progress: "In Progress",
      country: "Kenya",
      gender: "Male",
      age: "34",
      status: "Active",
    },
    {
      number: "2",
      id_number: "70081234",
      name: "Derrick Kimani",
      progress: "Progress",
      country: "Uganda",
      gender: "Male",
      age: "23",
      status: "Active",
    },
    {
      number: "3",
      id_number: "1234821",
      name: "Jane Munyua",
      progress: "In Progress",
      country: "Tanzania",
      gender: "Female",
      age: "70",
      status: "Active",
    },
    {
      number: "3",
      id_number: "70081234",
      progress: "In Progress",
      name: "Ann Kibet",
      country: "Burundi",
      gender: "Male",
      age: "49",
      status: "Active",
    },
    {
      number: "4",
      id_number: "1234821",
      name: "Ann Ochieng",
      progress: "Progress",
      country: "Rwanda",
      gender: "Female",
      age: "88",
      status: "Active",
    },
    {
      number: "5",
      id_number: "1234821",
      name: "Marcos Ochieng",
      progress: "In Progress",
      country: "Kenya",
      gender: "Male",
      age: "34",
      status: "Active",
    },
    {
      number: "6",
      id_number: "70081234",
      name: "Derrick Kimani",
      progress: "Progress",
      country: "Uganda",
      gender: "Male",
      age: "23",
      status: "Active",
    },
    {
      number: "7",
      id_number: "1234821",
      progress: "In Progress",
      name: "Jane Munyua",
      country: "Tanzania",
      gender: "Female",
      age: "70",
      status: "Active",
    },
  ];

  const onMenuClick = async (menu, data) => {
    if (menu.action === "delete") {
      setSelectedRowData(data);
      setDeleteOpen(true);
    } else if (menu.action === "edit") {
      setSelectedRowData(data);
      setOpen(true);
    }
  };

  const actionsFunc = ({ data }) => {
    return (
      <>
        <CmtDropdownMenu
          sx={{ cursor: "pointer" }}
          items={userActions}
          onItemClick={(menu) => onMenuClick(menu, data)}
          TriggerComponent={
            <LuMoreHorizontal className="cursor-pointer text-xl" />
          }
        />
      </>
    );
  };

  const nameFunc = ({ data }) => {
    if (data?.progress === "In Progress") {
      return (
        <div className="flex items-center gap-2">
          <Chip variant="contained" size="small" className="bg-card text-white" label={data?.progress} />
          <p>{data?.name}</p>
        </div>
      );
    }else if(data?.progress === "Progress"){
        return (
          <div className="flex items-center gap-2">
          <Chip variant="contained" size="small" className="bg-success text-white" label={data?.progress} />
          <p>{data?.name}</p>
          </div>
        )
    }
  };

  //   filter users based on search query
  const filteredUser = users.filter((user) => {
    return user.name.toLocaleLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <section>
      {/* <div className="flex items-center justify-start mb-3 mt-4 w-5/12">
        <input
          className="rounded-3xl shadow-xl py-3 px-4 focus:outline-none w-full"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          placeholder="Search..."
        />
      </div> */}
      <DataGrid
        dataSource={filteredUser}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        className="shadow-xl"
        height={"70vh"}
      >
        <Pager
          visible={true}
          // allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
        <Column dataField="number" caption="NO" width={80} />
        <Column dataField="id_number" caption="ID" width={140} />
        <Column
          dataField="name"
          caption="Name"
          width={240}
          allowFiltering={true}
          allowSearch={true}
          cellRender={nameFunc}
        />
        <Column dataField="age" caption="Age" width={140} />
        <Column dataField="country" caption="Country" width={200} />
        <Column dataField="gender" caption="Gender" width={200} />
        <Column
          dataField="country"
          caption="Action"
          width={140}
          cellRender={actionsFunc}
        />
      </DataGrid>
      <EditPatientDetails {...{ open, setOpen, selectedRowData }} />
      <DeletePatientModal {...{deleteOpen,setDeleteOpen,selectedRowData}} />
    </section>
  );
};

export default AdminPatientsDataGrid;
