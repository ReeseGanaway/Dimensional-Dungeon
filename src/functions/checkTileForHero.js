export const checkTileForHero = (x, y, playerTeam) => {
  for (const [key, value] of Object.entries(playerTeam)) {
    const { id, position } = value;
    //console.log(value);
    //if the coordinates of the click are on the same 48 x 48 tile as one of the ally characters
    if (
      x >= position.x &&
      x <= position.x + 47 &&
      y >= position.y &&
      y <= position.y + 47
    ) {
      return id;
    }
  }
  return null;
};

export const checkTileForEnemy = (x, y, enemyTeam) => {
  for (const [key, value] of Object.entries(enemyTeam)) {
    const { id, position } = value;
    //console.log(value);
    //if the coordinates of the click are on the same 48 x 48 tile as one of the ally characters
    if (
      x >= position.x &&
      x <= position.x + 47 &&
      y >= position.y &&
      y <= position.y + 47
    ) {
      return id;
    }
  }

  return null;
};
