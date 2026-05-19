import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "@/layouts/AppLayout"
import { Dashboard } from "@/pages/Dashboard"
import { NotFound } from "@/pages/NotFound"
import { LeadsPage } from "@/features/leads/pages/LeadsPage"
import { LeadDetailPage } from "@/features/leads/pages/LeadDetailPage"
import { CreateLeadPage } from "@/features/leads/pages/CreateLeadPage"
import { EditLeadPage } from "@/features/leads/pages/EditLeadPage"
import { BoardPage } from "@/features/leads/pages/BoardPage"
import { AnalyticsPage } from "@/pages/AnalyticsPage"
import { SettingsPage } from "@/pages/SettingsPage"


export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "leads",
        element: <LeadsPage />,
      },
      {
        path: "leads/new",
        element: <CreateLeadPage />,
      },
      {
        path: "leads/:id",
        element: <LeadDetailPage />,
      },
      {
        path: "leads/:id/edit",
        element: <EditLeadPage />,
      },
      {
        path: "board",
        element: <BoardPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])
