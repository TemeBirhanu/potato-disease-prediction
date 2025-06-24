import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useState } from 'react';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const UploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [leafImage, setLeafImage] = useState(null);
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: async (acceptedImage) => {
      setResult(null);
      setError(null);
      setLeafImage(null);
      if (!acceptedImage || acceptedImage.length === 0) return;
      const formData = new FormData();
      formData.append('file', acceptedImage[0]);
      setLoading(true);
      try {
        const { data } = await axios.post('http://localhost:8000/predict', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setResult(data);
        setLeafImage(acceptedImage[0]);
      } catch {
        setError('Prediction failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onDropRejected: () => {
      setLoading(false);
      setError('Invalid file. Please upload a valid image.');
    },
  });

  return (
    <>
      {loading && <Loader />}
      {/* Back Button at the top right */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 right-8 z-50 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-150"
      >
        &#8592; Back
      </button>
      <div className="bg-white pb-6 sm:pb-8 lg:pb-12 min-h-screen">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <section className="flex justify-center">
            <div
              className={`flex items-center justify-center flex-col border-2 border-dashed px-14 lg:px-20 py-28 w-11/12 lg:w-8/12 rounded-2xl mt-4 lg:mt-2 hover:cursor-pointer  ${
                isDragActive ? 'bg-gray-100' : 'bg-gray-50'
              } ${isDragActive ? 'border-indigo-700' : 'border-indigo-500'}`}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <p className="text-5xl lg:text-7xl text-indigo-600 mb-4">
                <i className="fa-solid fa-folder-open"></i>
              </p>
              <p className="text-2xl lg:text-3xl font-semibold text-center">
                Drag and Drop
              </p>
              <p className="text-xl lg:text-2xl font-semibold text-center">
                or{' '}
                <span className="text-indigo-500 text-center">
                  browse image
                </span>{' '}
              </p>
            </div>
          </section>
          {/* Show uploaded image preview */}
          {leafImage && (
            <div className="flex justify-center mt-8">
              <img
                src={URL.createObjectURL(leafImage)}
                alt="uploaded leaf"
                className="rounded-lg max-h-64 shadow-md"
              />
            </div>
          )}
          {/* Show result */}
          {result && (
            <div className="flex justify-center mt-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-md text-center">
                <h2 className="text-2xl font-bold mb-2">Prediction Result</h2>
                <p className="text-lg">Class: <span className="font-semibold">{result.class}</span></p>
                <p className="text-lg">Confidence: <span className="font-semibold">{result.confidence}</span></p>
              </div>
            </div>
          )}
          {/* Show error */}
          {error && (
            <div className="flex justify-center mt-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-md text-center text-red-700">
                {error}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadImage;