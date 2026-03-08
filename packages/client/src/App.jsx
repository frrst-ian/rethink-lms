import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import Sidebar from "./components/Sidebar/Sidebar";
import "./styles/app.css";

const App = () => {
    const [open, setOpen] = useState(false);

    return (
        <BrowserRouter>
            <div className="app">
                <Sidebar open={open} setOpen={setOpen} />
                <div className="main" style={{ paddingLeft: open ? "200px" : "60px"}}>
                    <AppRoutes />
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;