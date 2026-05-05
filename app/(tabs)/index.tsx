import * as Location from "expo-location";
import React, { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region, UrlTile, MapPressEvent } from "react-native-maps";

/**
 * Tipe data koordinat
 */
type Coordinates = {
  latitude: number;
  longitude: number;
};

const { height } = Dimensions.get("window");

export default function HomeScreen() {
  const [location, setLocation] = useState<Coordinates | null>(null);

  /**
   * Mengambil lokasi GPS
   */
  const getLocation = async (): Promise<void> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied! Please allow location access.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  /**
   * Fitur: Ubah posisi saat peta ditekan (Tap)
   */
  const handleMapPress = (e: MapPressEvent) => {
    setLocation(e.nativeEvent.coordinate);
  };

  /**
   * Fitur: Ubah posisi saat marker digeser (Drag)
   */
  const handleMarkerDragEnd = (e: any) => {
    setLocation(e.nativeEvent.coordinate);
  };

  const region: Region | undefined = location
    ? {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
    : undefined;

  return (
    <View style={styles.container}>
      {!location ? (
        <View style={styles.center}>
          <Button title="Get Geo Location" onPress={getLocation} />
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={handleMapPress} /* Menangani Tap */
          >
            <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker
              coordinate={location}
              title="Lokasi Saya"
              draggable /* Fitur geser */
              onDragEnd={handleMarkerDragEnd} /* Update setelah geser */
            />
          </MapView>

          <View style={styles.info}>
            <Text style={styles.label}>Latitude: {location.latitude}</Text>
            <Text style={styles.label}>Longitude: {location.longitude}</Text>
            <View style={{ marginTop: 15 }}>
              <Button title="Refresh Lokasi" onPress={getLocation} />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  map: { height: height * 0.6, width: "100%" }, 
  info: { flex: 1, padding: 20 }, 
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 }
});