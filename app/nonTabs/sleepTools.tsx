import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Play, Pause, Timer, Shuffle, Volume2, X, SkipBack, SkipForward, RotateCcw, Music } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, Modal, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { theme } from '../../theme/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SleepToolsScreen() {
  const [selectedSound, setSelectedSound] = useState('');
  const [selectedTimer, setSelectedTimer] = useState('');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState('');
  const [currentSoundIndex, setCurrentSoundIndex] = useState(-1);
  const [showPlayer, setShowPlayer] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState<typeof sounds[0] | null>(null);
  const [audioMetadata, setAudioMetadata] = useState<{[key: string]: any}>({});
  const [metadataLoaded, setMetadataLoaded] = useState(false);

  const sounds = [
    { 
      id: 'rain', 
      name: 'Rain Sounds', 
      file: require('../../assets/audio/rain-sounds.mp3'),
      artist: 'Nature Sounds',
      album: 'Sleep & Relaxation',
      duration: 600
    },
    { 
      id: 'rain-sleep', 
      name: 'Rain for Sleep', 
      file: require('../../assets/audio/rain-for-relaxation-and-sleep.mp3'),
      artist: 'Nature Sounds',
      album: 'Sleep & Relaxation',
      duration: 600
    },
    { 
      id: 'flowing-water', 
      name: 'Flowing Water', 
      file: require('../../assets/audio/flowing-water.mp3'),
      artist: 'Nature Sounds',
      album: 'Sleep & Relaxation',
      duration: 600
    },
    { 
      id: 'stream-water', 
      name: 'Stream Water', 
      file: require('../../assets/audio/stream-water.mp3'),
      artist: 'Nature Sounds',
      album: 'Sleep & Relaxation',
      duration: 600
    },
    { 
      id: 'wind', 
      name: 'Wind', 
      file: require('../../assets/audio/wind.mp3'),
      artist: 'Nature Sounds',
      album: 'Sleep & Relaxation',
      duration: 600
    },
    { 
      id: 'wind-trees', 
      name: 'Wind in Trees', 
      file: require('../../assets/audio/wind-in-trees.mp3'),
      artist: 'Nature Sounds',
      album: 'Sleep & Relaxation',
      duration: 600
    },
    { 
      id: 'birds', 
      name: 'Birds', 
      file: require('../../assets/audio/birds.mp3'),
      artist: 'Nature Sounds',
      album: 'Sleep & Relaxation',
      duration: 600
    },
    { 
      id: 'forest', 
      name: 'Forest Nature', 
      file: require('../../assets/audio/forest-nature.mp3'),
      artist: 'Nature Sounds',
      album: 'Sleep & Relaxation',
      duration: 600
    },
    { 
      id: 'nature-mixed', 
      name: 'Nature Mix', 
      file: require('../../assets/audio/nature_wind_trees_birds.mp3'),
      artist: 'Nature Sounds',
      album: 'Sleep & Relaxation',
      duration: 600
    },
    { 
      id: 'calm-music', 
      name: 'Calm Music', 
      file: require('../../assets/audio/calm-music.mp3'),
      artist: 'Relaxation Music',
      album: 'Sleep & Relaxation',
      duration: 600
    },
    { 
      id: 'tranquility', 
      name: 'A Moment of Tranquility', 
      file: require('../../assets/audio/A_Moment_of_Tranquility.mp3'),
      artist: 'Ambient Music',
      album: 'Sleep & Relaxation',
      duration: 600
    },
    { 
      id: 'desert', 
      name: 'An Endless Desert', 
      file: require('../../assets/audio/An_Endless_Desert.mp3'),
      artist: 'Ambient Music',
      album: 'Sleep & Relaxation',
      duration: 600
    },
    { 
      id: 'white-noise', 
      name: 'White Noise', 
      file: require('../../assets/audio/white-noise.wav'),
      artist: 'White Noise',
      album: 'Sleep & Relaxation',
      duration: 600
    },
  ];

  const timers = ['30m', '1h', 'Until Morning'];

  useEffect(() => {
    // Cleanup function to stop all audio when component unmounts
    return () => {
      if (sound) {
        sound.stopAsync().then(() => {
          sound.unloadAsync();
        }).catch(console.error);
      }
    };
  }, [sound]);

  // Additional cleanup on component mount to ensure no lingering audio
  useEffect(() => {
    // Stop any audio that might be playing from previous sessions
    const cleanupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log('Audio setup error:', error);
      }
    };
    
    cleanupAudio();
  }, []);

  // Load metadata when component mounts
  useEffect(() => {
    loadAllMetadata();
  }, []);

  // Setup audio session for background playback
  useEffect(() => {
    const setupAudioSession = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log('Audio session setup error:', error);
      }
    };
    
    setupAudioSession();
  }, []);

  // Function to get duration from audio files using Expo AV
  const extractAudioMetadata = async (audioFile: any, soundId: string, soundItem: typeof sounds[0]) => {
    try {
      console.log(`Extracting duration for: ${soundId}`);
      
      // Get duration from Expo AV
      const { sound: tempSound } = await Audio.Sound.createAsync(audioFile, {
        shouldPlay: false,
      });
      
      const status = await tempSound.getStatusAsync();
      await tempSound.unloadAsync();
      
      const duration = status.isLoaded && 'durationMillis' in status && status.durationMillis ? Math.floor(status.durationMillis / 1000) : soundItem.duration;
      
      const extractedMetadata = {
        duration: duration,
        durationMillis: ('durationMillis' in status && status.durationMillis) || (soundItem.duration * 1000),
        albumArt: null,
        title: soundItem.name,
        artist: soundItem.artist,
        album: soundItem.album,
        genre: 'Sleep & Relaxation',
        year: null,
        track: null,
      };
      
      console.log(`Final metadata for ${soundId}:`, extractedMetadata);
      return extractedMetadata;
      
    } catch (error) {
      console.error(`Could not extract metadata for ${soundId}:`, error);
      return {
        duration: soundItem.duration,
        durationMillis: soundItem.duration * 1000,
        albumArt: null,
        title: soundItem.name,
        artist: soundItem.artist,
        album: soundItem.album,
        genre: 'Sleep & Relaxation',
        year: null,
        track: null,
      };
    }
  };

  // Load all audio metadata on component mount
  const loadAllMetadata = async () => {
    if (metadataLoaded) return;
    
    console.log('Loading metadata for all audio files...');
    const metadataMap: {[key: string]: any} = {};
    
    for (const sound of sounds) {
      try {
        const metadata = await extractAudioMetadata(sound.file, sound.id, sound);
        metadataMap[sound.id] = metadata;
      } catch (error) {
        console.error(`Failed to load metadata for ${sound.id}:`, error);
        metadataMap[sound.id] = { 
          duration: sound.duration, 
          durationMillis: sound.duration * 1000,
          artist: sound.artist,
          album: sound.album,
          title: sound.name,
          albumArt: null
        };
      }
    }
    
    setAudioMetadata(metadataMap);
    setMetadataLoaded(true);
    console.log('All metadata loaded:', metadataMap);
  };

  // Function to get album art (real metadata or fallback to music icon)
  const getAlbumArt = (soundId: string) => {
    const metadata = audioMetadata[soundId];
    
    // Check if there's real album art in metadata
    if (metadata && metadata.albumArt) {
      console.log(`Found album art for ${soundId}: ${metadata.albumArt.substring(0, 50)}...`);
      
      // Handle base64 data URI
      if (metadata.albumArt.startsWith('data:')) {
        return { uri: metadata.albumArt };
      }
      
      // Handle file URI
      if (metadata.albumArt.startsWith('file://') || metadata.albumArt.startsWith('http')) {
        return { uri: metadata.albumArt };
      }
    }
    
    // No album art found - will use Lucide Music icon as fallback
    console.log(`No album art found for ${soundId}, using music icon fallback`);
    return null;
  };

  // Function to check if album art exists
  const hasAlbumArt = (soundId: string) => {
    const metadata = audioMetadata[soundId];
    return metadata && metadata.albumArt;
  };

  // Function to get artist from metadata
  const getRealArtist = (soundId: string) => {
    const metadata = audioMetadata[soundId];
    const sound = sounds.find(s => s.id === soundId);
    return metadata?.artist || sound?.artist || 'Sleep & Relaxation';
  };

  // Function to get title from metadata
  const getRealTitle = (soundId: string, fallbackName: string) => {
    const metadata = audioMetadata[soundId];
    const sound = sounds.find(s => s.id === soundId);
    return metadata?.title || sound?.name || fallbackName;
  };

  // Function to get album from metadata
  const getRealAlbum = (soundId: string) => {
    const metadata = audioMetadata[soundId];
    const sound = sounds.find(s => s.id === soundId);
    return metadata?.album || sound?.album || 'Sleep & Relaxation';
  };


  // Function to get track duration (real or fallback)
  const getTrackDuration = (soundId: string) => {
    const metadata = audioMetadata[soundId];
    
    if (metadata && metadata.duration > 0) {
      const minutes = Math.floor(metadata.duration / 60);
      const seconds = metadata.duration % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return '∞'; // For looping tracks
  };

  const playSound = async (soundItem: typeof sounds[0], index: number) => {
    try {
      // CRITICAL: Always stop and unload any existing sound first
      if (sound) {
        console.log('Stopping previous sound before playing new one');
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      // Reset all audio states
      setIsPlaying(false);
      setCurrentlyPlaying('');
      setSelectedSound('');
      setCurrentSoundIndex(-1);
      setCurrentTrack(null);

      // Create and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(soundItem.file, {
        shouldPlay: true,
        isLooping: true,
        volume: volume,
      });

      // Update states only after successful creation
      setSound(newSound);
      setIsPlaying(true);
      setCurrentlyPlaying(soundItem.name);
      setSelectedSound(soundItem.id);
      setCurrentSoundIndex(index);
      setCurrentTrack(soundItem);
      setShowPlayer(true);
      
      console.log(`Now playing: ${soundItem.name}`);
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio');
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setCurrentlyPlaying('');
      setSelectedSound('');
      setCurrentSoundIndex(-1);
      setCurrentTrack(null);
      setShowPlayer(false);
    }
  };

  const togglePlayPause = async () => {
    if (sound && currentTrack) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const nextTrack = async () => {
    if (currentSoundIndex === -1) return;
    const nextIndex = (currentSoundIndex + 1) % sounds.length;
    await playSound(sounds[nextIndex], nextIndex);
  };

  const previousTrack = async () => {
    if (currentSoundIndex === -1) return;
    const prevIndex = currentSoundIndex === 0 ? sounds.length - 1 : currentSoundIndex - 1;
    await playSound(sounds[prevIndex], prevIndex);
  };

  const shuffleAndPlay = async () => {
    const randomIndex = Math.floor(Math.random() * sounds.length);
    const randomSound = sounds[randomIndex];
    await playSound(randomSound, randomIndex);
  };

  const closePlayer = () => {
    setShowPlayer(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Sleep Tools</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Currently Playing Mini Player */}
        {currentlyPlaying && (
          <TouchableOpacity 
            style={styles.miniPlayer}
            onPress={() => setShowPlayer(true)}
          >
            <View style={styles.miniPlayerInfo}>
              <View style={styles.miniPlayerIconContainer}>
                {currentTrack && hasAlbumArt(currentTrack.id) ? (
                  <Image 
                    source={getAlbumArt(currentTrack.id)!} 
                    style={styles.miniPlayerIcon}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.miniPlayerIconFallback}>
                    <Music size={20} color="white" />
                  </View>
                )}
              </View>
              <View style={styles.miniPlayerTextContainer}>
                <Text style={styles.miniPlayerTitle}>{currentTrack?.name}</Text>
                <Text style={styles.miniPlayerSubtitle}>
                  {currentTrack ? getRealArtist(currentTrack.id) : 'Sleep & Relaxation'} • {currentTrack ? getTrackDuration(currentTrack.id) : '∞'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.miniPlayerButton} onPress={togglePlayPause}>
              {isPlaying ? <Pause size={20} color="white" /> : <Play size={20} color="white" />}
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {/* Sound List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Relaxing Sounds</Text>
            {!metadataLoaded && (
              <Text style={styles.loadingText}>Loading metadata...</Text>
            )}
          </View>
          <View style={styles.soundList}>
            {sounds.map((soundItem, index) => (
              <TouchableOpacity
                key={soundItem.id}
                style={[
                  styles.soundListItem,
                  selectedSound === soundItem.id && styles.soundListItemSelected
                ]}
                onPress={() => playSound(soundItem, index)}
              >
                <View style={styles.soundItemInfo}>
                  <View style={styles.soundItemIconContainer}>
                    {hasAlbumArt(soundItem.id) ? (
                      <Image 
                        source={getAlbumArt(soundItem.id)!} 
                        style={styles.soundItemIcon}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.soundItemIconFallback}>
                        <Music size={16} color={theme.colors.textSecondary} />
                      </View>
                    )}
                  </View>
                  <View style={styles.soundItemTextContainer}>
                    <Text style={[
                      styles.soundItemName,
                      selectedSound === soundItem.id && styles.soundItemNameSelected
                    ]}>
                      {soundItem.name}
                    </Text>
                    <Text style={[
                      styles.soundItemDuration,
                      selectedSound === soundItem.id && styles.soundItemDurationSelected
                    ]}>
                      {getRealArtist(soundItem.id)} • {getTrackDuration(soundItem.id)}
                    </Text>
                  </View>
                </View>
                <View style={styles.soundItemActions}>
                  {selectedSound === soundItem.id && isPlaying ? (
                    <View style={styles.playingIndicator}>
                      <Volume2 size={16} color={theme.colors.primary} />
                    </View>
                  ) : (
                    <Play size={20} color={theme.colors.textSecondary} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Timer Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timer</Text>
          <View style={styles.timerContainer}>
            {timers.map((timer) => (
              <TouchableOpacity
                key={timer}
                style={[
                  styles.timerButton,
                  selectedTimer === timer && styles.timerButtonSelected
                ]}
                onPress={() => setSelectedTimer(timer)}
              >
                <Timer size={20} color={selectedTimer === timer ? 'white' : theme.colors.text} />
                <Text style={[
                  styles.timerText,
                  selectedTimer === timer && styles.timerTextSelected
                ]}>
                  {timer}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bedtime Meditation */}
        <TouchableOpacity 
          style={styles.meditationButton}
          onPress={async () => {
            // Stop any playing audio before navigating
            if (sound) {
              await stopSound();
            }
            router.push('/nonTabs/exerciseDetails');
          }}
        >
          <Play size={20} color="white" />
          <Text style={styles.meditationButtonText}>Bedtime Meditation ▶</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Shuffle Button */}
      <TouchableOpacity 
        style={styles.shuffleFab}
        onPress={shuffleAndPlay}
      >
        <Shuffle size={24} color="white" />
      </TouchableOpacity>

      {/* Compact Music Player Modal */}
      <Modal
        visible={showPlayer}
        animationType="slide"
        transparent={true}
        onRequestClose={closePlayer}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.compactPlayerContainer}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={closePlayer}>
              <X size={20} color={theme.colors.text} />
            </TouchableOpacity>

            {/* Track Icon */}
            <View style={styles.trackIconContainer}>
              {currentTrack && hasAlbumArt(currentTrack.id) ? (
                <Image 
                  source={getAlbumArt(currentTrack.id)!} 
                  style={styles.trackIcon}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.trackIconFallback}>
                  <Music size={30} color={theme.colors.textSecondary} />
                </View>
              )}
            </View>

            {/* Track Info */}
            <View style={styles.trackInfoContainer}>
              <Text style={styles.trackTitle}>
                {currentTrack ? getRealTitle(currentTrack.id, currentTrack.name) : 'Unknown Track'}
              </Text>
              <Text style={styles.trackSubtitle}>
                {currentTrack ? getRealArtist(currentTrack.id) : 'Sleep & Relaxation'}
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainerCompact}>
              <View style={styles.progressBarCompact}>
                <View style={[styles.progressFillCompact, { width: '30%' }]} />
              </View>
            </View>

            {/* Control Tools */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity style={styles.controlButtonCompact} onPress={previousTrack}>
                <SkipBack size={20} color={theme.colors.text} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.mainPlayButton} onPress={togglePlayPause}>
                {isPlaying ? <Pause size={24} color="white" /> : <Play size={24} color="white" />}
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButtonCompact} onPress={nextTrack}>
                <SkipForward size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Volume Control */}
            <View style={styles.volumeContainerCompact}>
              <Volume2 size={16} color={theme.colors.textSecondary} />
              <View style={styles.volumeSliderCompact}>
                <View style={[styles.volumeFillCompact, { width: `${volume * 100}%` }]} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  // Mini Player Styles
  miniPlayer: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniPlayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniPlayerIconContainer: {
    marginRight: theme.spacing.md,
  },
  miniPlayerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  miniPlayerIconFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPlayerTextContainer: {
    flex: 1,
  },
  miniPlayerTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  miniPlayerSubtitle: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  miniPlayerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Sound List Styles
  soundList: {
    gap: theme.spacing.sm,
  },
  soundListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  soundListItemSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  soundItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  soundItemIconContainer: {
    marginRight: theme.spacing.md,
  },
  soundItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  soundItemIconFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  soundItemTextContainer: {
    flex: 1,
  },
  soundItemName: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text,
  },
  soundItemNameSelected: {
    color: 'white',
  },
  soundItemDuration: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  soundItemDurationSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  soundItemActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playingIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  // Timer Styles
  timerContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  timerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timerButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  timerText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium as any,
    marginLeft: theme.spacing.sm,
  },
  timerTextSelected: {
    color: 'white',
  },
  // Meditation Button
  meditationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  meditationButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
    marginLeft: theme.spacing.sm,
  },
  // Shuffle FAB
  shuffleFab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
    elevation: 8,
  },
  // Compact Music Player Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  compactPlayerContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: screenHeight * 0.3,
    minHeight: 350,
    ...theme.shadows.lg,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  trackIconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  trackIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  trackIconFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  trackInfoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  trackTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  trackSubtitle: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  progressContainerCompact: {
    marginBottom: theme.spacing.md,
  },
  progressBarCompact: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
  },
  progressFillCompact: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  controlButtonCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mainPlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  volumeContainerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  volumeSliderCompact: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
  },
  volumeFillCompact: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
});
