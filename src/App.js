import React, { Fragment } from "react";
import "./App.css";
import GrassCanvas from "./components/GrassCanvas";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RosterCreation from "./components/RosterCreation";
import Interface from "./components/Interface";
import Canvas2 from "./components/Canvas2";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route path="/" element={<GrassCanvas />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/rostercreator" element={<RosterCreation />}></Route>
          <Route path="/game" element={<GrassCanvas />}></Route>
          <Route path="/game2" element={<Canvas2 />}></Route>
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default App;
