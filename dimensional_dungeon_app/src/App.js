import React, { Fragment } from "react";
import "./App.css";
import GrassCanvas from "./components/GrassCanvas";
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
          <Route path="/game" element={<GrassCanvas />}></Route>
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default App;
