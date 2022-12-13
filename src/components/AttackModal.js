import React, { useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import _ from "lodash";

export const AttackModal = (props) => {
  const canvasRef = useRef();

  const {
    currentEnemy,
    currentChar,
    selectedEnemies,
    showAttackModal,
    setShowAttackModal,
  } = props;
  let attacker = null;
  let victims = _.cloneDeep(selectedEnemies);
  for (const [key, value] of Object.entries(victims)) {
    victims[key].setDirection("left");
    victims[key].updatePos(96, 48);
  }
  if (Object.keys(currentChar).length !== 0) {
    //attacker = { [currentChar.id]: { ...currentChar } };
    attacker = _.cloneDeep(currentChar);
    attacker.updatePos(0, 48);
    attacker.setDirection("right");
  } else if (Object.keys(currentEnemy).length !== 0) {
    attacker = _.cloneDeep(currentEnemy);
    attacker.updatePos(0, 48);
  }

  const request = requestAnimationFrame(function draw() {
    console.log("hello");

    if (showAttackModal) {
      const context = canvasRef.current.getContext("2d");

      console.log("drawing");

      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      attacker.draw2();
      for (const [key, value] of Object.entries(victims)) {
        console.log(victims[key]);
        victims[key].draw2();
      }

      requestAnimationFrame(draw);
    }
  });

  useEffect(() => {
    //console.log("running");
    if (showAttackModal) {
      setTimeout(() => {
        if (Object.keys(selectedEnemies).length === 1) {
          let countTo48 = 0;
          while (attacker.position.x + countTo48 < 48) {
            setTimeout(() => {
              attacker.updatePos(attacker.position.x + 1, attacker.position.y);
            }, 10 * countTo48);

            countTo48++;
          }
          setTimeout(() => {
            countTo48 = 0;
            const victimsLen = Object.keys(victims).length;
            const lastVic = Object.keys(victims)[victimsLen - 1];
            while (victims[lastVic].position.x + countTo48 < 144) {
              setTimeout(() => {
                for (const [key, value] of Object.entries(victims)) {
                  victims[key].updatePos(
                    victims[key].position.x + 1,
                    victims[key].position.y
                  );
                }
              }, 10 * countTo48);
              countTo48++;
            }
          }, 480);
        }
      }, 1000);
    } else {
      cancelAnimationFrame(request);
    }
  }, [showAttackModal]);

  return (
    <Modal show={showAttackModal}>
      <Modal.Header
        closeButton
        onClick={() => {
          setShowAttackModal(false);
        }}
      >
        <Modal.Title>Fight!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="row  justify-content-center text-center">
        <div className="col-md-auto">
          <canvas
            id="attack-canvas"
            className="attack-canvas"
            ref={canvasRef}
            width="192"
            height="144"
          ></canvas>
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
