import React from "react";
import dynamic from "next/dynamic";
import { Column, Pager } from "devextreme-react/data-grid";
import Link from 'next/link'
import { Grid } from "@mui/material";
import { months } from "@/assets/dummy-data/laboratory";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const PurchaseOrdersDatagrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const users = [
    {
      number: "1",
      id_number: "1234821",
      name: "Marcos Ochieng",
      country: "Kenya",
      gender: "Male",
      age: "34",
      status: "Active",
    },
    {
      number: "2",
      id_number: "70081234",
      name: "Derrick Kimani",
      country: "Uganda",
      gender: "Male",
      age: "23",
      status: "Active",
    },
    {
      number: "3",
      id_number: "1234821",
      name: "Jane Munyua",
      country: "Tanzania",
      gender: "Female",
      age: "70",
      status: "Active",
    },
    {
      number: "3",
      id_number: "70081234",
      name: "Ann Kibet",
      country: "Burundi",
      gender: "Male",
      age: "49",
      status: "Active",
    },
  ];

  return (
    <section className=" my-8">
      <h3 className="text-xl mb-8"> Purchase Orders </h3>
      <Grid className="my-2 flex justify-between">
        <Grid className="flex justify-between gap-8 rounded-lg">
          <Grid item md={4} xs={4}>
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
          <Grid>
          <select className="px-4 w-full py-2 border broder-gray rounded-lg focus:outline-none" name="" id="">
              <option value="" selected>
                All the Items
              </option>
            </select>
          </Grid>        
        </Grid>
        <Grid className="flex items-center rounded-lg" item md={4} xs={4}>
          <img className="h-4 w-4" src='/images/svgs/search.svg'/>
          <input
            className="py-2 w-full px-4 bg-transparent rounded-lg focus:outline-none placeholder-font font-thin text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            fullWidth
            placeholder="Search referrals by facility"
          />
        </Grid>
        <Grid className="bg-primary rounded-md flex items-center text-white" item md={4} xs={4}>
          <Link className="mx-4" href='/dashboard/inventory/add-purchase'>
            Purchase Product
          </Link>
        </Grid>
      </Grid>
      <DataGrid
        dataSource={users}
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
        <Pager
          visible={false}
          // allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
        <Column dataField="number" caption="Product Name" width={200} />
        <Column dataField="id_number" caption="Category" width={140} />
        <Column
          dataField="name"
          caption="Description"
          width={200}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column dataField="age" caption="Price" width={140} />
        <Column dataField="country" caption="Quantity" width={200} />
        <Column dataField="gender" caption="Unit Price" width={200} />
        <Column dataField="country" caption="Buying Price" width={200} />
      </DataGrid>
    </section>
  );
};

export default PurchaseOrdersDatagrid;
