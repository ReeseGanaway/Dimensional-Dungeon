const checkTileForHero = (x, y, activeRoster) => {
  for (const [key, value] of Object.entries(activeRoster)) {
    //if the coordinates of the click are on the same 48 x 48 tile as one of the ally characters
    if (
      x >= value.x &&
      x <= value.x + 47 &&
      y >= value.y &&
      y <= value.y + 47
    ) {
      return value.name;
    }
  }
  return null;
};

export default checkTileForHero;
