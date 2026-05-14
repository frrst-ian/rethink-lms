import Sidebar from "../Sidebar/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import styles from "./layout.module.css";

export default function Layout() {
    const [open, setOpen] = useState(false);
    return (
        <div className="app">
            <Sidebar open={open} setOpen={setOpen} />
            <div
                className={`main ${styles.content}`}
                style={{ paddingLeft: open ? "200px" : "60px" }}
            >
                <Outlet />
            </div>
        </div>
    );
}