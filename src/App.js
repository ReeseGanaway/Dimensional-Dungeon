import React, { Fragment } from "react";
import "./App.css";
import GrassCanvas from "./components/GrassCanvas";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RosterCreation from "./components/RosterCreation";
import Canvas2 from "./components/Canvas2";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import Login2 from "./components/auth/Login2";

const App = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route path="/" element={<GrassCanvas />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/login2" element={<Login />}></Route>
          <Route path="/rostercreator" element={<RosterCreation />}></Route>
          <Route path="/game" element={<GrassCanvas />}></Route>
          <Route path="/game2" element={<Canvas2 />}></Route>
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default App;
