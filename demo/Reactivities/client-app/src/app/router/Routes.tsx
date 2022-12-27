import { createBrowserRouter, RouteObject } from "react-router-dom";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import ActivityForm from "../../features/activities/form/ActivityForm";
import App from "../layout/App";

export const routes: RouteObject[] = [
    {
        path: '/',
        //Route root
        element: <App />,
        //child roots
        children: [
            // {path: '', element: <HomePage />}, has now been implemented in App.tsx
            {path: 'activities', element: <ActivityDashboard />},
            {path: 'activities/:id', element: <ActivityDetails />},
            {path: 'createActivity', element: <ActivityForm key='create' />},
            {path: 'manage/:id', element: <ActivityForm key='manage' />},
        ]
    }
]

export const router = createBrowserRouter(routes);