import React, { useEffect, useState, useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/assets/hooks/use-auth";
import { useRouter } from 'next/navigation'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from "next/link";
import dynamic from "next/dynamic";
import { Column, Paging, Pager } from "devextreme-react/data-grid";
import { Grid } from "@mui/material";
import { addPurchaseOrder, addPurchaseOrdersItem } from "@/redux/service/inventory";
import { useSelector, useDispatch } from "react-redux";
import { getAllDoctors } from "@/redux/features/doctors";
import { removeItemToPurchaseOrderPdf, clearItemsToPurchaseOrderPdf  } from "@/redux/features/inventory";
import { toast } from "react-toastify";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { SlMinus } from "react-icons/sl";
import { LuMoreHorizontal } from "react-icons/lu";
import AddPurchaseOrderItemModal from "./create-purchase-order-dialog";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const getActions = () => {
  let actions = [
    {
      action: "remove",
      label: "Remove",
      icon: <SlMinus className="text-success text-xl mx-2" />,
    },
  ];
  
  return actions;
};

const AddProductPurchase = () => {

  const [requestedBy, setRequestedBy] = useState(null);
  const pdfRef = useRef();
  const router = useRouter()
  const userActions = getActions();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { item, suppliers, purchaseOrderItems } = useSelector(({ inventory }) => inventory);
  const doctorsData = useSelector((store)=>store.doctor.doctors)
  const auth = useAuth();

  const initialValues = {
    status: "COMPLETED",
    quantity_purchased: purchaseOrderItems,

  };

  useEffect(() => {
    if (auth) {
      dispatch(getAllDoctors(auth));
    }
  }, [auth]);

  const onMenuClick = async (menu, data) => {
    console.log(data)
    if (menu.action === "remove") {
      dispatch(removeItemToPurchaseOrderPdf(data))
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

  const generatePdf = () => {
    return new Promise((resolve) => {
      const input = pdfRef.current;  
      const table = input.children[2].children[0].children[5];
      const pdfWidth = 210; 
      const pdfHeight = 297;
      const scale = 1; 
  
      html2canvas(table, { scale: scale }).then((canvas) => {
        const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
  
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
  
        resolve(pdf);
      });
    });
  };

  const savePurchaseOrderItem = async (item, payload) => {

    const payloadData = {
      ...item,
      purchase_order: payload.id,
      item: item.item,
      supplier: parseInt(item.supplier),
      quantity_purchased: item.quantity_purchased
    }

    try {
      await addPurchaseOrdersItem(payloadData).then(()=>{
        toast.success("Purchase Order Item Added Successfully!");
      })

    } catch(err) {
      toast.error(err);
      setLoading(false);
    } 
  }

  const sendEachItemToDb = (payload) => {
    purchaseOrderItems.forEach(item => savePurchaseOrderItem(item, payload))
  }

  const savePurchaseOrderPdf = async (formValue, helpers) => {
    // generatePdf().then( async (pdf) => {
    //   try {

    //     const payload = {
    //       status: "COMPLETED",
    //       requested_by: 1,
    //       date_created:5
    //     }
    //     await addRequisition(payload).then(() => {
    //       toast.success("Inventory Added Successfully!");
    //       setLoading(false);
    //       router.push('/dashboard/inventory')
    //     });
    //   }catch (err) {
    //     toast.error(err);
    //     setLoading(false);
    //   }
      
    // });

    try {
      if (purchaseOrderItems.length <= 0) {
        toast.error("No purchase order items");
        return;
      }      
    
      setLoading(true);
    
      const payload = {
        status: formValue.status,
        requested_by: auth.user_id,
        date_created: 5
      }
    
      await addPurchaseOrder(payload).then((res) => {
        sendEachItemToDb(res)
        toast.success("Purchase Order Added Successfully!");
        setLoading(false);
        dispatch(clearItemsToPurchaseOrderPdf())
        
        router.push('/dashboard/inventory/purchase-orders')
      });
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };
  return (
    <section ref={pdfRef}>
      <div className="flex gap-4 mb-8 items-center">
          <Link href='/dashboard/inventory/purchase-orders'><img className="h-3 w-3" src="/images/svgs/back_arrow.svg" alt="return to inventory"/></Link>
          <h3 className="text-xl"> Purchase Product </h3>
      </div>
      <div className="flex items-center justify-end">
          <AddPurchaseOrderItemModal/>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={savePurchaseOrderPdf}
      >
      <Form className="">
      <DataGrid
        dataSource={purchaseOrderItems}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        className="shadow-xl"
      >
        <Pager
          visible={false}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
        <Column 
          dataField="item" 
          caption="Item Name" 
          cellRender={(cellData) => {
            const productItem = item.find(item => item.id === cellData.data.item);
            return productItem ? `${productItem.name}` : 'null';
          }}
        />
        <Column 
          dataField="supplier" 
          caption="Supplier Name"
          cellRender={(cellData) => {
            const supplier = suppliers.find(supplier => supplier.id === parseInt(cellData.data.supplier));
            return supplier ? `${supplier.name}` : 'null';
          }}        
        />
        <Column 
          dataField="quantity_purchased" 
          caption="Quantity"
        />
        <Column 
          dataField="date_created" 
          caption="Created" 
        />
        <Column 
          dataField="" 
          caption=""
          cellRender={actionsFunc}
        />
      </DataGrid>

      <Grid className="mt-8" item md={12} xs={12}>
        <div className="flex items-center justify-start">
          <button
            type="submit"
            className="bg-primary rounded-xl text-sm px-8 py-4 text-white"
          >
            {loading && (
              <svg
                aria-hidden="true"
                role="status"
                className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#1C64F2"
                ></path>
              </svg>
            )}
            Save Purchase Order Pdf
          </button>
        </div>
      </Grid>
      </Form>
      </Formik>
    </section>
  )
}

export default AddProductPurchase