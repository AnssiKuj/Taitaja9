import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "./css/FrontPage.css";
import "./css/containers.css"
import App from './App';
import reportWebVitals from './reportWebVitals';
import Timing from './Pages/Timing';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/Timing",
    element: <Timing/>
  },
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);

reportWebVitals();
