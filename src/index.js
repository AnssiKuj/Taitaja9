import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "./css/FrontPage.css";
import "./css/containers.css"
import App from './App';
import reportWebVitals from './reportWebVitals';
import AddContestants from './Pages/AddContestants';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import Joukkue1 from './Pages/Joukkue1';
import Joukkue2 from './Pages/Joukkue2';



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
    path: "/Joukkue1",
    element: <Joukkue1/>
  },
  {
    path: "/Joukkue2",
    element: <Joukkue2/>
  },
  ])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);

reportWebVitals();
