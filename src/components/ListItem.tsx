import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';

export interface Props {
  onPress(): void;
  thumbnailUrl?: string;
  title: string;
  subtitle: string;
}

export class ListItem extends React.PureComponent<Props> {
  public static defaultProps = {
    thumbnailUrl: '',
  };
  render() {
    const { onPress, thumbnailUrl, title, subtitle } = this.props;
    console.log(subtitle);
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        {thumbnailUrl ? (
          <View style={styles.thumbnail}>
            <Image style={styles.thumbnailImage} source={{ uri: thumbnailUrl }} />
          </View>
        ) : null}
        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  thumbnail: {
    paddingHorizontal: 15,
  },
  thumbnailImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  text: {
    paddingRight: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    color: '#4C5666',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: '#9DA9BD',
  },
});
