import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Scrolling } from "devextreme-react/data-grid";
import Link from 'next/link'
import { Grid } from "@mui/material";
import { months } from "@/assets/dummy-data/laboratory";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";
import { getAllRequisitions, getAllSuppliers, getAllItems } from "@/redux/features/inventory";
import { getAllDoctors } from "@/redux/features/doctors";
import { getAllTheUsers } from "@/redux/features/users";
import { downloadPDF } from '@/redux/service/pdfs';
import { MdLocalPrintshop } from 'react-icons/md'
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { LuMoreHorizontal } from "react-icons/lu";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const getActions = () => {
  let actions = [
    {
      action: "print",
      label: "Print",
      icon: <MdLocalPrintshop className="text-success text-xl mx-2" />,
    },
  ];

  return actions;
};

const RequisitionDatagrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const userActions = getActions();
  const { requisitions } = useSelector(({ inventory }) => inventory);
  const usersData = useSelector((store)=>store.user.users);
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);

  const dispatch = useDispatch()
  const auth = useAuth();

  const onMenuClick = async (menu, data) => {
    if (menu.action === "dispense") {
      dispatch(getAllPrescriptionsPrescribedDrugs(data.id, auth))
      setSelectedRowData(data);
      setOpen(true);
    }else if (menu.action === "print"){
      handlePrint(data);
    }
  };

  const actionsFunc = ({ data }) => {
    return (
        <CmtDropdownMenu
          sx={{ cursor: "pointer" }}
          items={userActions}
          onItemClick={(menu) => onMenuClick(menu, data)}
          TriggerComponent={
            <LuMoreHorizontal className="cursor-pointer text-xl" />
          }
        />
    );
  };

  const handlePrint = async (data) => {
      try{
          const response = await downloadPDF(data.id, "_requisition_pdf", auth)
          window.open(response.link, '_blank');
          toast.success("got pdf successfully")

      }catch(error){
          console.log(error)
          toast.error(error)
      }
      
  };

  useEffect(() => {
    if (auth) {
      dispatch(getAllRequisitions(auth));
      dispatch(getAllSuppliers());
      dispatch(getAllItems());
      dispatch(getAllDoctors(auth))
      dispatch(getAllTheUsers(auth))
    }
  }, [auth]);

  return (
    <section className=" my-8">
      <h3 className="text-xl mb-8"> Requisitions</h3>
      <Grid className="my-2 flex justify-between gap-4">
        <Grid className="w-full flex justify-between gap-8 rounded-lg">
            <select className="px-4 w-full py-2 border broder-gray rounded-lg focus:outline-none" name="" id="">
              <option value="" selected>                
              </option>
              {months.map((month, index) => (
                <option key={index} value="">
                  {month.name}
                </option>
              ))}
            </select>
        </Grid>
        <Grid className="w-full bg-white px-2 flex items-center rounded-lg" item md={4} xs={4}>
          <img className="h-4 w-4" src='/images/svgs/search.svg'/>
          <input
            className="py-2 w-full px-4 bg-transparent rounded-lg focus:outline-none placeholder-font font-thin text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            fullWidth
            placeholder="Search referrals by facility"
          />
        </Grid>
        <Grid className="w-full bg-primary rounded-md flex items-center text-white" item md={4} xs={4}>
          <Link className="mx-4 w-full text-center" href='/dashboard/inventory/create-requisition'>
            Create Requisition
          </Link>
        </Grid>
      </Grid>
      <DataGrid
        dataSource={requisitions}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        className="shadow-xl"
        // height={"70vh"}
      >
        <Scrolling rowRenderingMode='virtual'></Scrolling>
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={showPageSizeSelector}
          showInfo={showInfo}
          showNavigationButtons={showNavButtons}
        />
        <Column 
          dataField="requested_by"
          caption="Requested By" 
          cellRender={(cellData) => {
            const user = usersData.find(user => user.id === cellData.data.requested_by);
            return user ? `${user.first_name} ${user.last_name}` : 'user not found';
          }}
          />
        <Column 
          dataField="status"
          caption="Status"
        />
        <Column dataField="date_created" caption="Requested Date" />
        <Column 
          dataField="" 
          caption=""
          cellRender={actionsFunc}
        />
      </DataGrid>
    </section>
  );
};

export default RequisitionDatagrid;
