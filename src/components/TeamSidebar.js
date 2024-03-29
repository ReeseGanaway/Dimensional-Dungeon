import React from "react";

const TeamSidebar = (props) => {
  const playerTeam = props.playerTeam;
  const enemyTeam = props.enemyTeam;
  const currentChar = props.currentChar;
  const collection = props.collection;
  const sideBarChar = props.sideBarChar;
  const setSideBarChar = props.setSideBarChar;
  const turnInfo = props.turnInfo;

  const displayEnemyTeam = () => {
    if (Object.keys(sideBarChar).length === 0) {
      return Object.keys(enemyTeam).map((key) => {
        return (
          <div
            key={enemyTeam[key].id}
            id={enemyTeam[key].id + "-enemy-sidebar"}
            className="col text-center sidebar-char enemy"
            onClick={() => {
              setSideBarChar({ [key]: enemyTeam[key] });
            }}
          >
            <div className={"row " + enemyTeam[key].id + "-enemy-id"}>
              <h5>{enemyTeam[key].name}</h5>
            </div>
            <div className={enemyTeam[key].id + "-enemy-icon"}>
              <img src={enemyTeam[key].icon} />
            </div>
          </div>
        );
      });
    }
  };

  const displayAllyTeam = () => {
    if (Object.keys(sideBarChar).length === 0) {
      return Object.keys(playerTeam).map((key) => {
        return (
          <div
            key={playerTeam[key].id}
            id={playerTeam[key].id + "-ally-sidebar"}
            className="col text-center sidebar-char ally"
            onClick={() => {
              setSideBarChar({ [key]: playerTeam[key] });
            }}
          >
            <div className={"row " + playerTeam[key].id + "-ally-id"}>
              <h5>{playerTeam[key].name}</h5>
            </div>
            <div className={playerTeam[key].id + "-ally-icon"}>
              <img className="icon" src={playerTeam[key].icon} />
            </div>
          </div>
        );
      });
    }
  };

  return Object.keys(sideBarChar).length === 0 ? (
    <div id="char-info" className="sidebar col-md-auto">
      <div className=" ally-chars row justify-content-center shadow-lg text-center">
        <div className="row justify-content-center">
          <h5> Ally Team </h5>
        </div>
        <div className="row ally-chars-row justify-content-center">
          {displayAllyTeam()}
        </div>
      </div>
      <div
        className="enemy-chars row justify-content-center shadow-lg text-center"
        style={{ borderBottomRightRadius: props.roundCorner }}
      >
        <div className="row justify-content-center">
          <h5> Enemy Team </h5>
        </div>
        <div className="row ally-chars-row justify-content-center">
          {displayEnemyTeam()}
        </div>
      </div>
    </div>
  ) : (
    Object.keys(sideBarChar).map((key) => {
      return (
        <div key={key} className="col-md-auto">
          <div className="row">
            <div
              id="char-info"
              className="sidebar col-md-auto"
              style={
                sideBarChar[key] === playerTeam[key]
                  ? {
                      backgroundColor: "rgb(255, 255, 111)",
                      borderBottomRightRadius: props.roundCorner,
                    }
                  : {
                      backgroundColor: "rgb(0, 0, 235",
                      borderBottomRightRadius: props.roundCorner,
                    }
              }
            >
              <div className="selected-char col-md-auto justify-content-center text-center">
                <div className="row justify-content-center">
                  <button
                    className="col-md-auto"
                    onClick={() => {
                      setSideBarChar({});
                    }}
                  >
                    {"<- Teams"}
                  </button>
                </div>
                <div className="row justify-content-center">
                  <img
                    className="current-icon"
                    src={collection[sideBarChar[key].id].displayImg}
                  ></img>
                </div>
                <div className="row">
                  <h4>{sideBarChar[key].name}</h4>
                </div>
                <div className="row curr-stats text-center justify-content-center">
                  <h4>Current Stats</h4>
                  <h5 className="row align-items-center">
                    Health :
                    <div className="bar">
                      <div
                        id="red-health"
                        className="red-health"
                        style={{
                          width:
                            (sideBarChar[key].currentStats.hp /
                              sideBarChar[key].maxStats.hp) *
                              100 +
                            "%",
                          fontSize: "15px",
                        }}
                      >
                        {sideBarChar[key].currentStats.hp}/
                        {sideBarChar[key].maxStats.hp}
                      </div>
                    </div>
                  </h5>
                  <h5 className="row">
                    {" "}
                    Dmg : {sideBarChar[key].currentStats.dmg}
                  </h5>
                  <h5 className="row">
                    X : {sideBarChar[key].position.x} Y:{" "}
                    {sideBarChar[key].position.y}
                  </h5>
                </div>
                <div className="row">
                  <button className="btn ">More info</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })
  );
};

export default TeamSidebar;
