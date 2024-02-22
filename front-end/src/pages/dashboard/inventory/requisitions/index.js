import React from 'react'
import { Container } from "@mui/material";
import InventoryNav from '@/components/dashboard/inventory/nav';
import AuthGuard from "@/assets/hoc/auth-guard";
import DashboardLayout from "@/components/layout/dashboard-layout";
import RequisitionDatagrid from '@/components/dashboard/inventory/RequisitionDatagrid'

const RequisitionsPage = () => {
  return (
    <Container maxWidth="xl">
      <InventoryNav />
      <RequisitionDatagrid />
    </Container>
  )
}

RequisitionsPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>;
  </AuthGuard>
);

export default RequisitionsPage