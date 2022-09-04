import React, { Fragment } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RosterCreation from "./components/RosterCreation";
import Interface from "./components/Interface";

const App = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route path="/" element={<Interface />}></Route>
          <Route path="/rostercreator" element={<RosterCreation />}></Route>
          <Route path="/game" element={<Canvas />}></Route>
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default App;
