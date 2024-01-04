import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Grid } from "@mui/material";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { getAllSearchedPatients } from "@/redux/features/patients";
import {
  getAllPatientBillingAppointments,
  getAllPatientBillingLabRequest,
  getAllPatientBillingPrescribedDrug,
} from "@/redux/features/billing";
import PatientCheckServices from "./checkServices";
import { billingInvoiceItems } from "@/redux/service/billing";
import { useAuth } from "@/assets/hooks/use-auth";

const AddInvoiceModal = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { searchedPatients } = useSelector((store) => store.patient);
  const {
    patientAppointment,
    patientLabRequest,
    patientPrescribedDrug,
    selectedAppointments,
    selectedLabRequests,
    selectedPrescribedDrugs,
  } = useSelector((store) => store.billing);
  const [inputValue, setInputValue] = useState("");
  const auth = useAuth();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initialValues = {
    first_name: "",
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("This field is required!"),
  });

  const handleInputChange = async (event) => {
    const { value } = event.target;
    setInputValue(value);

    try {
      setLoading(true);

      if (value.trim() === "" || value.length < 2) {
      } else {
        await dispatch(getAllSearchedPatients(inputValue));
        await dispatch(
          getAllPatientBillingAppointments(searchedPatients[0]?.id)
        );
        await dispatch(getAllPatientBillingLabRequest(searchedPatients[0]?.id));
        await dispatch(
          getAllPatientBillingPrescribedDrug(searchedPatients[0]?.id)
        );
      }

      setLoading(false);
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    try {
      setLoading(true);
      for (const [index, appointment] of selectedAppointments.entries()) {
        const appointmentPayload = {
          item_name: appointment?.item_name,
          item_price: appointment?.fee,
          invoice: 1,
          service: appointment?.id,
        };
        await billingInvoiceItems(auth, appointmentPayload);
        toast.success("Appointment Invoice generated successfully!");
        setLoading(false);
      }

      for (const [index, labRequest] of selectedLabRequests.entries()) {
        const labRequestPayload = {
          item_name: "item one",
          item_price: "200",
          invoice_id: 1,
          service_id: 1,
        };
        await billingInvoiceItems(auth, labRequestPayload);
      }

      for (const [index, prescribedDrug] of selectedPrescribedDrugs.entries()) {
        const prescribedDrugsPayload = {
          item_name: "item one",
          item_price: "300",
          invoice_id: 1,
          service_id: 1,
        };
        await billingInvoiceItems(auth, prescribedDrugsPayload);
      }
      toast.success("Invoice generated successfully!");
      setLoading(false);
      console.log("All payloads submitted successfully");
    } catch (error) {
      console.error("Error submitting payloads: ", error);
    }
  };

  return (
    <section>
      <button
        onClick={handleClickOpen}
        className="bg-primary text-white text-sm rounded px-3 py-2 mb-1"
      >
        Add Invoice
      </button>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {currentStep === 0 && (
            <>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                <Form className="">
                  <Grid container spacing={2}>
                    <Grid item md={12} xs={12}>
                      <input
                        className="block border rounded-xl text-sm border-gray py-2 px-4 focus:outline-card w-full"
                        placeholder="Search Patient"
                        // type="search"
                        name="first_name"
                        onChange={handleInputChange}
                        value={inputValue}
                      />
                      <ErrorMessage
                        name="first_name"
                        component="div"
                        className="text-warning text-xs"
                      />
                      <div>
                        {inputValue !== "" &&
                          searchedPatients
                            .filter((patient) =>
                              `${patient.first_name} ${patient.second_name}`
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                            )
                            .map((patient, index) => (
                              <span
                                onClick={() =>
                                  setInputValue(
                                    `${patient.first_name} ${patient.second_name}`
                                  )
                                }
                                className="text-xs px-4 cursor-pointer hover:bg-background rounded p-1 flex flex-col"
                                key={index}
                              >{`${patient.first_name} ${patient.second_name}`}</span>
                            ))}
                      </div>
                    </Grid>
                  </Grid>
                </Form>
              </Formik>
            </>
          )}
          {currentStep === 1 && (
            <section className="">
              <PatientCheckServices {...{ patientAppointment }} />
            </section>
          )}
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="border border-primary rounded-xl px-4 py-2 text-sm"
            >
              Prev
            </button>
            {currentStep === 0 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-primary text-white rounded-xl px-4 py-2 text-sm"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleGenerateInvoice}
                className="bg-primary text-white rounded-xl px-4 py-2 text-sm"
              >
                {loading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
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
                Generate Invoice
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AddInvoiceModal;
