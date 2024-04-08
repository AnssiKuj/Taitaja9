import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "./css/FrontPage.css";
import "./css/containers.css"
import App from './App';
import reportWebVitals from './reportWebVitals';
import AddContestants from './Pages/AddContestants';
import { createBrowserRouter, RouterProvider, BrowserRouter} from 'react-router-dom';
import Ajanotto from './Pages/Ajanotto';
import Tulospalvelu from './Pages/Tulospalvelu';




const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/AddContestants",
    element: <AddContestants/>
  },
  {
    path: "/Ajanotto",
    element: <Ajanotto/>
  },
  {
    path: "/Tulospalvelu",
    element: <Tulospalvelu/>
  },
  ])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);

reportWebVitals();
