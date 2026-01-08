// /src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { LoadingProvider, LoadingContext } from './contexts/LoadingContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

axios.defaults.baseURL = 'http://localhost:5000/api';

const AxiosInterceptor = ({ children }) => {
    const { startLoading, stopLoading } = React.useContext(LoadingContext);

    React.useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                startLoading();
                return config;
            },
            (error) => {
                stopLoading();
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                stopLoading();
                return response;
            },
            (error) => {
                stopLoading();
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [startLoading, stopLoading]);

    return children;
};

/*
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
            <LoadingProvider>
                <AxiosInterceptor>
                    <App />
                </AxiosInterceptor>
            </LoadingProvider>
    </React.StrictMode>
);
*/

ReactDOM.createRoot(document.getElementById("root")).render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
);

// Optional: reportWebVitals can be removed if not used
reportWebVitals();
