import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import {
  Column,
  Paging,
  Pager,
  HeaderFilter,
  Scrolling,
} from "devextreme-react/data-grid";
import AddPatientModal from "./add-patient-modal";
import { Chip } from "@mui/material";
import { getAllPatients } from "@/redux/features/patients";
import { useSelector, useDispatch } from "react-redux";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { MdAddCircle } from "react-icons/md";
import { LuMoreHorizontal } from "react-icons/lu";
import { BiEdit } from "react-icons/bi";
import CreateAppointmentModal from "./create-appointment-modal";
import EditPatientDetails from "../admin-interface/edit-patient-details-modal";


const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const getActions = () => {
  let actions = [
    {
      action: "add",
      label: "Create Appointment",
      icon: <MdAddCircle className="text-success text-xl mx-2" />,
    },
    {
      action: "update",
      label: "Update Patient",
      icon: <BiEdit className="text-success text-xl mx-2" />,
    },
  ];

  return actions;
};

const PatientsDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { patients } = useSelector((store) => store.patient);
  const dispatch = useDispatch();
  const userActions = getActions();
  const [open,setOpen] = useState(false)
  const [editOpen,setEditOpen] = useState(false)
  const [selectedRowData,setSelectedRowData] = useState({});
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);
  const [showInfo, setShowInfo] = useState(true);


  const onMenuClick = async (menu, data) => {
    if (menu.action === "add") {
      setSelectedRowData(data);
      setOpen(true);
    }else if(menu.action === "update"){
      setSelectedRowData(data);
      setEditOpen(true);      
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

  const statusFunc = ({ data }) => {
    if (data?.progress_status === "In Treatment") {
      return (
        <Chip
          variant="contained"
          size="small"
          className="bg-primary text-white"
          label={data.progress_status}
        />
      );
    } else if (data?.progress_status === "Discharged") {
      return (
        <Chip
          variant="contained"
          size="small"
          className="bg-success text-white"
          label={data.progress_status}
        />
      );
    } else if (data?.progress_status === "New Patient") {
      return (
        <Chip
          variant="contained"
          size="small"
          className="bg-card text-white"
          label={data.progress_status}
        />
      );
    }
  };

  const patientFullName = (rowData) => {
    return rowData.first_name + " " + rowData.second_name;
  }

  useEffect(() => {
    dispatch(getAllPatients());
  }, []);

  return (
    <>
    <section className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <AddPatientModal />
      </div>
      <DataGrid
        dataSource={patients}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={false}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={false}
        className="shadow-xl w-full"
        // height={"60vh"}
      >
        <HeaderFilter visible={true} />
        <Scrolling rowRenderingMode='virtual'></Scrolling>
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          showInfo={showInfo}
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={showPageSizeSelector}
          showNavigationButtons={showNavButtons}
        />
        <Column 
          dataField="" 
          caption="Patient Name" 
          width={180}
          calculateCellValue={patientFullName}
        />
        <Column
          dataField="age"
          caption="Age"
          width={100}
          // calculateCellValue={(data) => calculateAge(data.date_of_birth)}
        />
        <Column dataField="gender" caption="Gender" width={100} />
        <Column dataField="insurance" caption="Insurance" width={150} />
        <Column
          dataField=""
          caption="Status"
          width={150}
          cellRender={statusFunc}
        />
        <Column
          dataField=""
          caption=""
          width={100}
          cellRender={actionsFunc}
        />
      </DataGrid>
    </section>

    {open && <CreateAppointmentModal {...{setOpen,open,selectedRowData}} />}
    <EditPatientDetails open={editOpen} setOpen={setEditOpen} selectedRowData={selectedRowData}  />

    </>
  );
};

export default PatientsDataGrid;
