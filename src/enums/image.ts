export enum Image {
  Grid,
  Search,
  LeftArrow,
  Refresh,
}

export namespace Image {
  export function getImage(t: Image): number {
    switch (t) {
      case Image.Grid:
        return require('../assets/grid.png');
      case Image.Search:
        return require('../assets/search.png');
      case Image.LeftArrow:
        return require('../assets/left-arrow.png');
      case Image.Refresh:
        return require('../assets/refresh.png');
      default:
        return require('../assets/grid.png');
    }
  }

  export function getSize(t: Image): number[] {
    switch (t) {
      default:
        return [14, 14];
    }
  }
}
