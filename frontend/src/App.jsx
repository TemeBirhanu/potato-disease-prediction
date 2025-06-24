import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Welcome from './pages/get-started';
import UploadImage from './pages/upload-image';


const App = () => {
  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route path="/" element={<Welcome />} />
          <Route path="/upload-image-and-pred" element={<UploadImage />} />
          
        </Routes>

        <ToastContainer />

      </BrowserRouter>
    </>
  )
}

export default App;