
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import LaunchPage from './LaunchPage.jsx';
import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";


const router = createBrowserRouter([
  {
    path: "/wings-mag",
    element: <App />,
  },
  {
    path: "/wings-mag/launch-page",
    element: <LaunchPage />,
  }
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);