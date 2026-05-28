import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from '../../context/LocationContext';
import { hospitalService } from '../../services/hospitalService';
import { policeService } from '../../services/policeService';
import { towingService } from '../../services/towingService';
import { Hospital, PoliceStation, TowingService } from '../../types';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { MapPin, Navigation, Shield, Compass, Search } from 'lucide-react-native';

export default function MapScreenWeb() {
  const { theme } = useTheme();
  const { location, refreshLocation, loading: locLoading } = useLocation();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [policeStations, setPoliceStations] = useState<PoliceStation[]>([]);
  const [towingServices, setTowingServices] = useState<TowingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHub, setSelectedHub] = useState<any>(null);

  const fetchMarkers = async () => {
    if (!location) return;
    setLoading(true);
    const lat = location.coords.latitude;
    const lng = location.coords.longitude;
    try {
      const [h, p, t] = await Promise.all([
        hospitalService.getHospitals(lat, lng).catch(() => []),
        policeService.getPoliceStations(lat, lng).catch(() => []),
        towingService.getTowingServices(lat, lng).catch(() => []),
      ]);
      setHospitals(h);
      setPoliceStations(p);
      setTowingServices(t);
      if (h.length > 0) setSelectedHub({ ...h[0], type: 'hospital' });
    } catch (e) {
      console.log('Error fetching map data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) fetchMarkers();
  }, [location]);

  if (locLoading || !location) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <LoadingSpinner message="Locating tracking grid..." fullScreen />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Header Overlay */}
      <View style={styles.topBar}>
        <Card style={styles.searchBar}>
          <Search size={16} color={theme.mutedForeground} style={styles.searchIcon} />
          <Text style={[styles.searchText, { color: theme.mutedForeground }]}>
            Scanning Sector Bangalore Central GPS Coordinates...
          </Text>
        </Card>
      </View>

      <View style={styles.contentLayout}>
        {/* Left Side: Stunning Simulated High-Tech Tactical Radar Map */}
        <View style={[styles.radarMap, { borderColor: theme.border, backgroundColor: '#0A0908' }]}>
          {/* Radar Sweep Effect (Pure CSS simulation via visual grids) */}
          <View style={[styles.gridLine, styles.gridH, { borderBottomColor: `${theme.border}40` }]} />
          <View style={[styles.gridLine, styles.gridV, { borderRightColor: `${theme.border}40` }]} />
          <View style={[styles.radarCircle, { borderColor: `${theme.secondary}20` }]} />
          <View style={[styles.radarCircleInner, { borderColor: `${theme.secondary}10` }]} />

          {/* User Location Radar Marker */}
          <View style={[styles.radarMarker, { left: '50%', top: '50%', transform: [{ translateX: -10 }, { translateY: -10 }] }]}>
            <View style={[styles.markerPulse, { backgroundColor: theme.secondary }]} />
            <View style={[styles.markerDot, { backgroundColor: theme.secondary }]} />
            <Text style={[styles.markerLabel, { color: theme.primary }]}>Your GPS Position</Text>
          </View>

          {/* Simulated Hospitals markers */}
          {hospitals.map((h, i) => (
            <TouchableOpacity
              key={`h-${h.id}`}
              style={[
                styles.radarMarker,
                {
                  left: `${45 + (h.longitude - location.coords.longitude) * 250}%`,
                  top: `${48 - (h.latitude - location.coords.latitude) * 250}%`,
                }
              ]}
              onPress={() => setSelectedHub({ ...h, type: 'hospital' })}
            >
              <View style={[styles.markerDot, { backgroundColor: theme.destructive }]} />
              <Text style={[styles.markerLabelMin, { color: theme.destructive }]}>🏥 {h.name.split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}

          {/* Simulated Police markers */}
          {policeStations.map((p, i) => (
            <TouchableOpacity
              key={`p-${p.id}`}
              style={[
                styles.radarMarker,
                {
                  left: `${52 + (p.longitude - location.coords.longitude) * 250}%`,
                  top: `${55 - (p.latitude - location.coords.latitude) * 250}%`,
                }
              ]}
              onPress={() => setSelectedHub({ ...p, type: 'police' })}
            >
              <View style={[styles.markerDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={[styles.markerLabelMin, { color: '#3B82F6' }]}>🛡️ {p.name.split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}

          {/* Radar Legend Overlay */}
          <Card style={styles.legend}>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.legendText, { color: theme.primary }]}>Active GPS Beacon</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.legendText, { color: theme.primary }]}>Trauma Centres ({hospitals.length})</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={[styles.legendText, { color: theme.primary }]}>Police Support ({policeStations.length})</Text>
            </View>
          </Card>
        </View>

        {/* Right Side: Selected Details & Coordinates Feed */}
        <View style={styles.detailsSide}>
          {selectedHub ? (
            <Card style={styles.selectedCard}>
              <View style={styles.detailHeader}>
                <View style={[styles.iconBox, { backgroundColor: selectedHub.type === 'hospital' ? `${theme.destructive}15` : '#3b82f615' }]}>
                  <Compass size={24} color={selectedHub.type === 'hospital' ? theme.destructive : '#3B82F6'} />
                </View>
                <View style={styles.detailTitleCol}>
                  <Text style={[styles.detailTitle, { color: theme.primary }]}>{selectedHub.name}</Text>
                  <Text style={[styles.detailType, { color: theme.secondary }]}>{selectedHub.type.toUpperCase()}</Text>
                </View>
              </View>
              
              <Text style={[styles.detailAddress, { color: theme.mutedForeground }]}>{selectedHub.address}</Text>
              
              <View style={[styles.infoGrid, { borderTopColor: theme.border }]}>
                <View style={styles.infoCol}>
                  <Text style={{ fontSize: 9, color: theme.mutedForeground, fontWeight: 'bold' }}>COORDINATES</Text>
                  <Text style={[styles.infoVal, { color: theme.primary }]}>{selectedHub.latitude.toFixed(4)}, {selectedHub.longitude.toFixed(4)}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={{ fontSize: 9, color: theme.mutedForeground, fontWeight: 'bold' }}>RATING</Text>
                  <Text style={[styles.infoVal, { color: theme.secondary }]}>⭐ {selectedHub.rating}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Button
                  title="INITIATE EMERGENCY TRANSIT"
                  onPress={refreshLocation}
                  variant="primary"
                  style={styles.dispatchBtn}
                />
              </View>
            </Card>
          ) : (
            <Card style={styles.emptyCard}>
              <Compass size={32} color={theme.mutedForeground} />
              <Text style={[styles.emptyText, { color: theme.mutedForeground }]}>
                Select a tactical marker node on the radar grid to overlay transit vectors.
              </Text>
            </Card>
          )}

          {/* Quick Stats Panel */}
          <Card style={[styles.statsCard, { borderColor: theme.border }]}>
            <Text style={[styles.statsTitle, { color: theme.primary }]}>OPERATIONAL TELEMETRY</Text>
            <View style={styles.statRow}>
              <Text style={{ color: theme.mutedForeground, fontSize: 12 }}>Your Latitude</Text>
              <Text style={{ color: theme.primary, fontFamily: 'monospace', fontSize: 12 }}>{location.coords.latitude.toFixed(6)}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={{ color: theme.mutedForeground, fontSize: 12 }}>Your Longitude</Text>
              <Text style={{ color: theme.primary, fontFamily: 'monospace', fontSize: 12 }}>{location.coords.longitude.toFixed(6)}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={{ color: theme.mutedForeground, fontSize: 12 }}>Network Link</Text>
              <Text style={{ color: theme.success, fontWeight: 'bold', fontSize: 12 }}>SECURED CLOUD ATLAS</Text>
            </View>
          </Card>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
  },
  contentLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radarMap: {
    width: '64%',
    borderRadius: 20,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
  },
  gridH: {
    top: '50%',
    left: 0,
    right: 0,
    borderBottomWidth: 1,
  },
  gridV: {
    left: '50%',
    top: 0,
    bottom: 0,
    borderRightWidth: 1,
  },
  radarCircle: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    top: '10%',
    bottom: '10%',
    borderRadius: 500,
    borderWidth: 1,
  },
  radarCircleInner: {
    position: 'absolute',
    left: '25%',
    right: '25%',
    top: '25%',
    bottom: '25%',
    borderRadius: 500,
    borderWidth: 1,
  },
  radarMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  markerPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.25,
  },
  markerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
    backgroundColor: '#1C1917',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  markerLabelMin: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
    backgroundColor: '#1C191795',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  legend: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    padding: 12,
    zIndex: 20,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsSide: {
    width: '33%',
    justifyContent: 'space-between',
  },
  selectedCard: {
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailTitleCol: {
    flex: 1,
  },
  detailTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: 'bold',
  },
  detailType: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  detailAddress: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 14,
    marginBottom: 20,
  },
  infoCol: {
    flex: 0.5,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  actions: {
    width: '100%',
  },
  dispatchBtn: {
    width: '100%',
  },
  emptyCard: {
    flex: 0.65,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  statsCard: {
    padding: 16,
    flex: 0.32,
    justifyContent: 'center',
  },
  statsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});
