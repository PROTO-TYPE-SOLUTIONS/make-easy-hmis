import React from 'react'
import { Container } from "@mui/material";
import InventoryNav from '@/components/dashboard/inventory/nav';
import AuthGuard from "@/assets/hoc/auth-guard";
import DashboardLayout from "@/components/layout/dashboard-layout";

const ReportsPage = () => {
  return (
    <Container maxWidth="xl">
      <InventoryNav />
      <div>ReportsPage</div>
    </Container>
    
  )
}

ReportsPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>;
  </AuthGuard>
);

export default ReportsPage