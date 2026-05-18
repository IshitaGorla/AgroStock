import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { colors, pineHeaderImage } from '@/constants/agro-stock';

export function BrandHeader() {
  return (
    <ImageBackground source={{ uri: pineHeaderImage }} style={styles.header} resizeMode="cover">
      <View style={styles.scrim}>
        <View style={styles.logo}>
          <Text selectable={false} style={styles.logoLeaf}>AS</Text>
        </View>
        <Text selectable={false} style={styles.brand}>AgroStocks</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: colors.paper,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.28)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  header: {
    height: 156,
    overflow: 'hidden',
    width: '100%',
  },
  logo: {
    alignItems: 'center',
    backgroundColor: '#fff6d7',
    borderColor: colors.paper,
    borderRadius: 36,
    borderWidth: 3,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  logoLeaf: {
    color: colors.greenDark,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  scrim: {
    alignItems: 'center',
    backgroundColor: 'rgba(28, 91, 18, 0.32)',
    flex: 1,
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
  },
});
