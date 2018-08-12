import * as React from 'react';
import { Image as ImageView, ImageStyle } from 'react-native';
import { Image } from '../enums/image';

export interface Props {
  icon: Image;
  width?: number;
  height?: number;
  style?: ImageStyle;
}

export class Icon extends React.PureComponent<Props> {
  public static defaultProps = {
    width: 0,
    height: 0,
    style: {},
  };

  constructor(props: Props) {
    super(props);
  }
  render() {
    const { icon, width, height, style } = this.props;
    let [iconWidth, iconHeight] = Image.getSize(icon);

    if (width) {
      iconWidth = width;
    }
    if (height) {
      iconHeight = height;
    }

    return (
      <ImageView
        style={[{ width: iconWidth, height: iconHeight }, style]}
        source={Image.getImage(icon)}
      />
    );
  }
}
