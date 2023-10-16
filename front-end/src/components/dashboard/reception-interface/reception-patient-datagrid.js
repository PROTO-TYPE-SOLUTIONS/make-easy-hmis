import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Selection } from "devextreme-react/data-grid";
import AddPatientModal from "../patient/add-patient-modal";
import AssignDoctorModal from './assign-doctor-modal'
import DischargePatientModal from "./discharge-patient-modal";
import { Chip } from "@mui/material";


const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});



const ReceptionPatientsDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [open, setOpen] = useState(false);



  const users = [
    {
      id_number: "1234821",
      name: "Marcos Ochieng",
      country: "Kenya",
      progress: "In Progress",
      gender: "Male",
      age: "34",
      status: "Active",
    },
    {
      id_number: "70081234",
      name: "Derrick Kimani",
      progress: "Progress",
      country: "Uganda",
      gender: "Male",
      age: "23",
      status: "Active",
    },
    {
      id_number: "1234821",
      name: "Jane Munyua",
      progress: "In Progress",
      country: "Tanzania",
      gender: "Female",
      age: "70",
      status: "Active",
    },
    {
      id_number: "70081234",
      name: "Ann Kibet",
      progress: "Progress",
      country: "Burundi",
      gender: "Male",
      age: "49",
      status: "Active",
    },
    {
      id_number: "1234221",
      name: "Ann Ochieng",
      progress: "In Progress",
      country: "Rwanda",
      gender: "Female",
      age: "88",
      status: "Active",
    },
  ];

  //   filter users based on search query
  const filteredUser = users.filter((user) => {
    return user.name.toLocaleLowerCase().includes(searchQuery.toLowerCase());
  });

  const onSelectionChanged = (props) => {
    const { selectedRowKeys, selectedRowsData } = props;
    setSelectedRecords(selectedRowKeys);
  };

  const nameFunc = ({ data }) => {
    console.log("DATA_DATA ",data);
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

  return (
    <section>
      <div className="flex items-center gap-2 justify-between">
        <div>
          <AddPatientModal />
        </div>
        <div className="flex items-center gap-2">
          {selectedRecords.length > 0 && <DischargePatientModal {...{selectedRecords}} /> }
          {selectedRecords.length > 0 && <AssignDoctorModal {...{selectedRecords}} /> }
          <input
            className="shadow-xl py-3 px-2 focus:outline-none mb-2"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            placeholder="Search..."
          />
        </div>
      </div>
      <DataGrid
        dataSource={filteredUser}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        onSelectionChanged={onSelectionChanged}
        selectedRowKeys={selectedRecords}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        className="shadow-xl w-full"
        height={"70vh"}
      >
        <Selection
          mode="multiple"
          selectAllMode={"allMode"}
          //showCheckBoxesMode={checkBoxesMode}
        />
        <Pager
          visible={true}
          // allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
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
      </DataGrid>
    </section>
  );
};

export default ReceptionPatientsDataGrid;
