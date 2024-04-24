import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "./css/FrontPage.css";
import "./css/containers.css"
import App from './App';
import reportWebVitals from './reportWebVitals';
import AdminPage from './Pages/AdminPage';
import { createBrowserRouter, RouterProvider, BrowserRouter} from 'react-router-dom';
import Ajanotto from './Pages/Ajanotto';
import Tulospalvelu from './Pages/Tulospalvelu';
import KerailyErat from './Pages/KerailyErat';
import ValiEra from './Pages/ValiEra';
import Finaali from './Pages/Finaali';
import TulospalveluKeraily from './Pages/TulospalveluKeraily';
import TulospalveluVali from './Pages/TulospalveluVali';
import TulospalveluFinaali from './Pages/TulospalveluFinaali';





const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/AdminPage",
    element: <AdminPage/>
  },
  {
    path: "/Ajanotto",
    element: <Ajanotto/>
  },
  {
    path: "/Tulospalvelu",
    element: <Tulospalvelu/>
  },
  {
    path: "/KerailyErat",
    element: <KerailyErat/>
  },
  {
    path: "/ValiEra",
    element: <ValiEra/>
  },
  {
    path: "/Finaali",
    element: <Finaali/>
  },
  {
    path: "/TulospalveluKeraily",
    element: <TulospalveluKeraily/>
  },
  {
    path: "/TulospalveluVali",
    element: <TulospalveluVali/>
  },
  {
    path: "/TulospalveluFinaali",
    element: <TulospalveluFinaali/>
  },
  ])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);

reportWebVitals();
