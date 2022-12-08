import React, { useState } from "react";
import { manhattanDistBool } from "../functions/manhattanDist";

function attackAvailable(currentChar, enemyTeam) {
  for (const [key, value] of Object.entries(enemyTeam)) {
    if (
      manhattanDistBool(
        currentChar.position.x,
        currentChar.position.y,
        value.position.x,
        value.position.y,

        currentChar.currentStats.attackRange
      )
    ) {
      return true;
    }
  }
  return false;
}

function getEnemiesInRange(currentChar, enemyTeam) {
  const attackableEnemies = {};
  for (const [key, value] of Object.entries(enemyTeam)) {
    if (
      manhattanDistBool(
        currentChar.position.x,
        currentChar.position.y,
        value.position.x,
        value.position.y,
        currentChar.currentStats.attackRange
      )
    ) {
      attackableEnemies[value.id] = { ...value };
    }
  }
  return attackableEnemies;
}

function displaySelectedEnemies(selectedEnemies) {
  return Object.keys(selectedEnemies).length != 0
    ? Object.keys(selectedEnemies).map((key) => {
        return (
          <div
            key={selectedEnemies[key].id}
            id={selectedEnemies[key].id + "-ally-sidebar"}
            className="col text-center sidebar-char ally"
            onClick={() => {}}
          >
            <div className={"row " + selectedEnemies[key].id + "-ally-id"}>
              <h5>{selectedEnemies[key].name}</h5>
            </div>
            <div className={selectedEnemies[key].id + "-ally-icon"}>
              <img className="icon" src={selectedEnemies[key].icon} />
            </div>
          </div>
        );
      })
    : null;
}

export const AttackPanel = (props) => {
  const {
    currentChar,
    enemyTeam,
    playerTeam,
    attack,
    setAttack,
    attackType,
    setAttackType,
    enemiesInRange,
    setEnemiesInRange,
    incrementTurn,
    endCharTurn,
    selectedEnemies,
  } = props;
  const { heal, buff } = false;

  if (!attack && !heal && !buff) {
    return (
      <div>
        <div className="row justify-content-center">
          <div>
            <button
              onClick={() => {
                setAttack(true);
                setEnemiesInRange(getEnemiesInRange(currentChar, enemyTeam));
              }}
              disabled={attackAvailable(currentChar, enemyTeam) ? false : true}
            >
              Attack
            </button>
            :
            <button
              onClick={() => {
                console.log("End turn");
                endCharTurn();
              }}
            >
              End Turn
            </button>
          </div>
        </div>
      </div>
    );
  } else if (attack) {
    return serveAttackPanel(currentChar.id);
  }

  function serveAttackPanel(id) {
    switch (id) {
      case "batman":
        return (
          <BatmanAttack
            currentChar={currentChar}
            setAttackType={setAttackType}
            attackType={attackType}
            selectedEnemies={selectedEnemies}
            endCharTurn={endCharTurn}
            enemyTeam={enemyTeam}
          />
        );
      case "nightwing":
        return (
          <NightwingAttack
            currentChar={currentChar}
            setAttackType={setAttackType}
            attackType={attackType}
            selectedEnemies={selectedEnemies}
            endCharTurn={endCharTurn}
            enemyTeam={enemyTeam}
          />
        );
      case "robin":
        return (
          <RobinAttack
            currentChar={currentChar}
            setAttackType={setAttackType}
            attackType={attackType}
            selectedEnemies={selectedEnemies}
            endCharTurn={endCharTurn}
            enemyTeam={enemyTeam}
          />
        );
      case "superman":
        return (
          <SupermanAttack
            currentChar={currentChar}
            setAttackType={setAttackType}
            attackType={attackType}
            selectedEnemies={selectedEnemies}
            endCharTurn={endCharTurn}
            enemyTeam={enemyTeam}
          />
        );
      case "twoFace":
        return (
          <TwoFaceAttack
            currentChar={currentChar}
            setAttackType={setAttackType}
            attackType={attackType}
            selectedEnemies={selectedEnemies}
            endCharTurn={endCharTurn}
            enemyTeam={enemyTeam}
          />
        );
      case "penguin":
        return (
          <PenguinAttack
            currentChar={currentChar}
            setAttackType={setAttackType}
            attackType={attackType}
            selectedEnemies={selectedEnemies}
            endCharTurn={endCharTurn}
            enemyTeam={enemyTeam}
          />
        );
      case "drMultiverse":
        return (
          <DrMultiverseAttack
            currentChar={currentChar}
            setAttackType={setAttackType}
            attackType={attackType}
            selectedEnemies={selectedEnemies}
            endCharTurn={endCharTurn}
            enemyTeam={enemyTeam}
          />
        );
    }
  }
};

const BatmanAttack = (props) => {
  const {
    currentChar,
    attackType,
    setAttackType,
    selectedEnemies,
    endCharTurn,
    enemyTeam,
  } = props;

  if (attackType === null) {
    return (
      <div>
        <button
          onClick={() => {
            setAttackType("basic");
          }}
        >
          Basic Attack
        </button>
        : {currentChar.basicAttackDescription}
      </div>
    );
  } else if (attackType === "basic") {
    return (
      <div>
        <div className="row justify-content-center">
          {currentChar.basicAttackDescription}
        </div>
        {displaySelectedEnemies(selectedEnemies)}
        {Object.keys(selectedEnemies).length === 1 ? (
          <button
            onClick={() => {
              for (const [key, value] of Object.entries(selectedEnemies)) {
                currentChar.basic(selectedEnemies[key]);
                if (selectedEnemies[key].currentStats.hp <= 0) {
                  delete enemyTeam[key];
                }
              }
              endCharTurn();
            }}
          >
            Execute Attack
          </button>
        ) : (
          <div className="row justify-content-center">
            Select 1 enemy in range to attack
          </div>
        )}
      </div>
    );
  }
};
const NightwingAttack = (props) => {
  const {
    currentChar,
    attackType,
    setAttackType,
    selectedEnemies,
    endCharTurn,
    enemyTeam,
  } = props;

  if (attackType === null) {
    return (
      <div>
        <button
          onClick={() => {
            setAttackType("basic");
          }}
        >
          Basic Attack
        </button>
        : {currentChar.basicAttackDescription}
      </div>
    );
  } else if (attackType === "basic") {
    return (
      <div>
        <div className="row justify-content-center">
          {currentChar.basicAttackDescription}
        </div>
        {displaySelectedEnemies(selectedEnemies)}
        {Object.keys(selectedEnemies).length === 1 ? (
          <button
            onClick={() => {
              for (const [key, value] of Object.entries(selectedEnemies)) {
                currentChar.basic(selectedEnemies[key]);
                if (selectedEnemies[key].currentStats.hp <= 0) {
                  delete enemyTeam[key];
                }
              }
              endCharTurn();
            }}
          >
            Execute Attack
          </button>
        ) : (
          <div className="row justify-content-center">
            Select 1 enemy in range to attack
          </div>
        )}
      </div>
    );
  }
};

const SupermanAttack = (props) => {
  const {
    currentChar,
    attackType,
    setAttackType,
    selectedEnemies,
    endCharTurn,
    enemyTeam,
  } = props;

  if (attackType === null) {
    return (
      <div>
        <button
          onClick={() => {
            setAttackType("basic");
          }}
        >
          Basic Attack
        </button>
        : {currentChar.basicAttackDescription}
      </div>
    );
  } else if (attackType === "basic") {
    return (
      <div>
        <div className="row justify-content-center">
          {currentChar.basicAttackDescription}
        </div>
        {displaySelectedEnemies(selectedEnemies)}
        {Object.keys(selectedEnemies).length === 1 ? (
          <button
            onClick={() => {
              for (const [key, value] of Object.entries(selectedEnemies)) {
                currentChar.basic(selectedEnemies[key]);
                if (selectedEnemies[key].currentStats.hp <= 0) {
                  delete enemyTeam[key];
                }
              }
              endCharTurn();
            }}
          >
            Execute Attack
          </button>
        ) : (
          <div className="row justify-content-center">
            Select 1 enemy in range to attack
          </div>
        )}
      </div>
    );
  }
};

const DrMultiverseAttack = (props) => {
  const {
    currentChar,
    attackType,
    setAttackType,
    selectedEnemies,
    endCharTurn,
    enemyTeam,
  } = props;

  if (attackType === null) {
    return (
      <div>
        <button
          onClick={() => {
            setAttackType("basic");
          }}
        >
          Basic Attack
        </button>
        : {currentChar.basicAttackDescription}
      </div>
    );
  } else if (attackType === "basic") {
    return (
      <div>
        <div className="row justify-content-center">
          {currentChar.basicAttackDescription}
        </div>
        {displaySelectedEnemies(selectedEnemies)}
        {Object.keys(selectedEnemies).length === 1 ? (
          <button
            onClick={() => {
              for (const [key, value] of Object.entries(selectedEnemies)) {
                currentChar.basic(selectedEnemies[key]);
                if (selectedEnemies[key].currentStats.hp <= 0) {
                  delete enemyTeam[key];
                }
              }
              endCharTurn();
            }}
          >
            Execute Attack
          </button>
        ) : (
          <div className="row justify-content-center">
            Select 1 enemy in range to attack
          </div>
        )}
      </div>
    );
  }
};

const RobinAttack = (props) => {
  const {
    currentChar,
    attackType,
    setAttackType,
    selectedEnemies,
    endCharTurn,
    enemyTeam,
  } = props;

  if (attackType === null) {
    return (
      <div>
        <button
          onClick={() => {
            setAttackType("basic");
          }}
        >
          Basic Attack
        </button>
        : {currentChar.basicAttackDescription}
      </div>
    );
  } else if (attackType === "basic") {
    return (
      <div>
        <div className="row justify-content-center">
          {currentChar.basicAttackDescription}
        </div>
        {displaySelectedEnemies(selectedEnemies)}
        {Object.keys(selectedEnemies).length === 1 ? (
          <button
            onClick={() => {
              for (const [key, value] of Object.entries(selectedEnemies)) {
                currentChar.basic(selectedEnemies[key]);
                if (selectedEnemies[key].currentStats.hp <= 0) {
                  delete enemyTeam[key];
                }
              }
              endCharTurn();
            }}
          >
            Execute Attack
          </button>
        ) : (
          <div className="row justify-content-center">
            Select 1 enemy in range to attack
          </div>
        )}
      </div>
    );
  }
};

const TwoFaceAttack = (props) => {
  const {
    currentChar,
    attackType,
    setAttackType,
    selectedEnemies,
    endCharTurn,
    enemyTeam,
  } = props;

  if (attackType === null) {
    return (
      <div>
        <button
          onClick={() => {
            setAttackType("basic");
          }}
        >
          Basic Attack
        </button>
        : {currentChar.basicAttackDescription}
      </div>
    );
  } else if (attackType === "basic") {
    return (
      <div>
        <div className="row justify-content-center">
          {currentChar.basicAttackDescription}
        </div>
        {displaySelectedEnemies(selectedEnemies)}
        {Object.keys(selectedEnemies).length === 1 ? (
          <button
            onClick={() => {
              for (const [key, value] of Object.entries(selectedEnemies)) {
                currentChar.basic(selectedEnemies[key]);
                if (selectedEnemies[key].currentStats.hp <= 0) {
                  delete enemyTeam[key];
                }
              }
              endCharTurn();
            }}
          >
            Execute Attack
          </button>
        ) : (
          <div className="row justify-content-center">
            Select 1 enemy in range to attack
          </div>
        )}
      </div>
    );
  }
};

const PenguinAttack = (props) => {
  const {
    currentChar,
    attackType,
    setAttackType,
    selectedEnemies,
    endCharTurn,
    enemyTeam,
  } = props;

  if (attackType === null) {
    return (
      <div>
        <button
          onClick={() => {
            setAttackType("basic");
          }}
        >
          Basic Attack
        </button>
        : {currentChar.basicAttackDescription}
      </div>
    );
  } else if (attackType === "basic") {
    return (
      <div>
        <div className="row justify-content-center">
          {currentChar.basicAttackDescription}
        </div>
        {displaySelectedEnemies(selectedEnemies)}
        {Object.keys(selectedEnemies).length === 1 ? (
          <button
            onClick={() => {
              for (const [key, value] of Object.entries(selectedEnemies)) {
                currentChar.basic(selectedEnemies[key]);
                if (selectedEnemies[key].currentStats.hp <= 0) {
                  delete enemyTeam[key];
                }
              }
              endCharTurn();
            }}
          >
            Execute Attack
          </button>
        ) : (
          <div className="row justify-content-center">
            Select 1 enemy in range to attack
          </div>
        )}
      </div>
    );
  }
};
