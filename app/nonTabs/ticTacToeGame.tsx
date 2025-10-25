import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Pause, Play, RotateCcw, Bot, User, Users } from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';
import { saveExerciseCompletion } from '../../utils/offlineStorage';
import { awardExperience, checkAchievements, saveAchievement } from '../../utils/gamification';
import { gameEventManager } from '../../utils/gameEvents';
import { NotificationBanner } from '../../components/NotificationBanner';

const { width, height } = Dimensions.get('window');

type Player = 'X' | 'O' | null;
type GameMode = 'vs-robot' | 'vs-player' | null;
type GameState = 'selecting' | 'playing' | 'finished';
type Winner = Player | 'draw';

interface GameBoard {
  squares: Player[];
  currentPlayer: Player;
  winner: Winner;
  gameMode: GameMode;
  player1Symbol: Player;
  player2Symbol: Player;
  isPlayer1Turn: boolean;
  moves: number;
}

export default function TicTacToeGame() {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>('selecting');
  const [gameBoard, setGameBoard] = useState<GameBoard>({
    squares: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    gameMode: null,
    player1Symbol: 'X',
    player2Symbol: 'O',
    isPlayer1Turn: true,
    moves: 0
  });
  const [score, setScore] = useState({ player1: 0, player2: 0, draws: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [notification, setNotification] = useState<any>(null);
  const [isRobotThinking, setIsRobotThinking] = useState(false);
  
  const boardAnimations = useRef<Animated.Value[]>(
    Array.from({ length: 9 }, () => new Animated.Value(0))
  ).current;

  const selectGameMode = (mode: GameMode) => {
    setGameBoard({
      squares: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      gameMode: mode,
      player1Symbol: 'X',
      player2Symbol: 'O',
      isPlayer1Turn: true,
      moves: 0
    });
    setGameState('playing');
    
    // Animate board appearance
    boardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    });
  };

  const resetGame = () => {
    setGameBoard({
      squares: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      gameMode: null,
      player1Symbol: 'X',
      player2Symbol: 'O',
      isPlayer1Turn: true,
      moves: 0
    });
    setGameState('selecting');
    setIsPaused(false);
    setIsRobotThinking(false);
    
    // Reset animations
    boardAnimations.forEach(anim => {
      anim.setValue(0);
    });
  };

  const checkWinner = (squares: Player[]): Player => {
    const winningLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let line of winningLines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares: Player[]): boolean => {
    return squares.every(square => square !== null);
  };

  const getBestMove = (squares: Player[], playerSymbol: Player, opponentSymbol: Player): number => {
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        const newSquares = [...squares];
        newSquares[i] = playerSymbol;
        if (checkWinner(newSquares) === playerSymbol) {
          return i;
        }
      }
    }

    // Try to block opponent
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        const newSquares = [...squares];
        newSquares[i] = opponentSymbol;
        if (checkWinner(newSquares) === opponentSymbol) {
          return i;
        }
      }
    }

    // Take center if available
    if (squares[4] === null) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => squares[corner] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take edges
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(edge => squares[edge] === null);
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    return -1; // No moves available
  };

  // Robot move effect - triggered when it's robot's turn
  useEffect(() => {
    if (
      gameBoard.gameMode === 'vs-robot' &&
      !gameBoard.isPlayer1Turn &&
      !gameBoard.winner &&
      !isPaused &&
      !isRobotThinking
    ) {
      setIsRobotThinking(true);
      const timer = setTimeout(() => {
        const robotMove = getBestMove(
          gameBoard.squares,
          gameBoard.player2Symbol,
          gameBoard.player1Symbol
        );
        if (robotMove !== -1) {
          makeMove(robotMove);
        }
        setIsRobotThinking(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [gameBoard.isPlayer1Turn, gameBoard.winner, isPaused, gameBoard.gameMode]);

  const makeMove = (index: number) => {
    // Prevent move if square is occupied, game is over, paused, or robot is thinking
    if (
      gameBoard.squares[index] !== null ||
      gameBoard.winner !== null ||
      isPaused ||
      isRobotThinking
    ) {
      return;
    }

    // In vs-robot mode, prevent player from moving during robot's turn
    if (gameBoard.gameMode === 'vs-robot' && !gameBoard.isPlayer1Turn) {
      return;
    }

    const newSquares = [...gameBoard.squares];
    newSquares[index] = gameBoard.currentPlayer;

    // Animate the move
    Animated.sequence([
      Animated.timing(boardAnimations[index], {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(boardAnimations[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    const winner = checkWinner(newSquares);
    const moves = gameBoard.moves + 1;
    const isDraw = !winner && isBoardFull(newSquares);

    if (winner || isDraw) {
      // Game ended
      setGameBoard(prev => ({
        ...prev,
        squares: newSquares,
        moves,
        winner: winner || 'draw'
      }));

      setTimeout(() => {
        handleGameEnd(winner, isDraw, newSquares);
      }, 500);
    } else {
      // Switch turns
      const nextPlayer = gameBoard.currentPlayer === 'X' ? 'O' : 'X';
      const isPlayer1Turn = nextPlayer === gameBoard.player1Symbol;
      
      setGameBoard(prev => ({
        ...prev,
        squares: newSquares,
        moves,
        currentPlayer: nextPlayer,
        isPlayer1Turn
      }));
    }
  };

  const handleGameEnd = async (winner: Winner, isDraw: boolean, finalSquares: Player[]) => {
    let newScore = { ...score };
    
    if (isDraw) {
      newScore.draws += 1;
    } else if (winner === gameBoard.player1Symbol) {
      newScore.player1 += 1;
    } else {
      newScore.player2 += 1;
    }
    
    setScore(newScore);

    // Show result notification
    let message = '';
    if (isDraw) {
      message = "It's a draw! Great game!";
    } else if (winner === gameBoard.player1Symbol) {
      message = gameBoard.gameMode === 'vs-robot' ? "You won! 🎉" : "Player 1 wins! 🎉";
    } else {
      message = gameBoard.gameMode === 'vs-robot' ? "Robot wins! 🤖" : "Player 2 wins! 🎉";
    }

    setNotification({
      visible: true,
      type: 'success',
      title: 'Game Complete!',
      message: message,
      onDismiss: () => setNotification(null)
    });

    // Save game completion
    try {
      const userId = user?.id || 'anonymous_user';
      const gameDuration = gameBoard.moves * 2; // Rough estimate
      
      const completionData = {
        user_id: userId,
        activity_type: 'game_session' as const,
        activity_details: {
          exerciseId: 'tic-tac-toe',
          exerciseTitle: 'Tic-Tac-Toe',
          exerciseType: 'strategy_game',
          duration: gameDuration,
          gameScore: newScore.player1 * 100 + newScore.player2 * 50,
          gameLevel: 1,
          notes: `Game mode: ${gameBoard.gameMode}, Winner: ${isDraw ? 'draw' : winner}, Moves: ${gameBoard.moves}`
        },
        completed_at: new Date().toISOString(),
        streak_count: 1
      };

      await saveExerciseCompletion(completionData as any);
      console.log('Tic-Tac-Toe game completion saved:', completionData);

      // Award experience points
      const expAwarded = awardExperience('game_session', gameDuration);
      console.log(`Awarded ${expAwarded} XP for tic-tac-toe game`);

      // Check for achievements
      const completions = await import('../../utils/offlineStorage').then(m => m.getExerciseCompletions());
      console.log('Total completions for achievement check:', completions.length);
      const newAchievements = await checkAchievements(userId, completions);
      console.log('New achievements found:', newAchievements.length);
      
      // Save new achievements
      for (const achievement of newAchievements) {
        await saveAchievement(achievement as any);
      }

      // Show achievement notifications
      if (newAchievements.length > 0) {
        setTimeout(() => {
          newAchievements.forEach((achievement, index) => {
            setTimeout(() => {
              setNotification({
                visible: true,
                type: 'achievement',
                title: 'Achievement Unlocked! 🏆',
                message: `${achievement.badge_name}: ${achievement.badge_description}`,
                onDismiss: () => setNotification(null)
              });
            }, index * 2000);
          });
        }, 2000);
      }

      // Notify other parts of the app about game completion
      gameEventManager.notifyGameCompletion('tic-tac-toe', newScore.player1 * 100 + newScore.player2 * 50, gameDuration);

    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const renderSquare = (index: number) => {
    const square = gameBoard.squares[index];
    const isWinningSquare = gameBoard.winner && 
      (gameBoard.winner === square || gameBoard.winner === 'draw');

    return (
      <Animated.View
        key={index}
        style={[
          styles.square,
          {
            opacity: boardAnimations[index],
            transform: [
              {
                scale: boardAnimations[index],
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.squareButton,
            isWinningSquare && styles.winningSquare,
          ]}
          onPress={() => makeMove(index)}
          disabled={!!square || !!gameBoard.winner || isPaused}
        >
          <Text style={[
            styles.squareText,
            square === 'X' && styles.xText,
            square === 'O' && styles.oText,
          ]}>
            {square}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderGameModeSelection = () => (
    <View style={styles.selectionContainer}>
      <Text style={styles.selectionTitle}>Choose Game Mode</Text>
      <Text style={styles.selectionSubtitle}>Select how you want to play</Text>
      
      <View style={styles.modeCards}>
        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => selectGameMode('vs-robot')}
        >
          <View style={styles.modeIconContainer}>
            <Bot size={40} color="#4ECDC4" />
            <User size={40} color="#FF6B9D" />
          </View>
          <Text style={styles.modeTitle}>vs Robot</Text>
          <Text style={styles.modeDescription}>Challenge the AI opponent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => selectGameMode('vs-player')}
        >
          <View style={styles.modeIconContainer}>
            <User size={40} color="#4ECDC4" />
            <Users size={40} color="#FF6B9D" />
          </View>
          <Text style={styles.modeTitle}>vs Player</Text>
          <Text style={styles.modeDescription}>Play with a friend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGameBoard = () => (
    <View style={styles.gameContainer}>
      {/* Game Info */}
      <View style={styles.gameInfo}>
        <Text style={styles.gameModeText}>
          {gameBoard.gameMode === 'vs-robot' ? 'vs Robot' : 'vs Player'}
        </Text>
        <Text style={styles.currentPlayerText}>
          {gameBoard.winner ? 
            (gameBoard.winner === 'draw' ? "It's a draw!" : 
             gameBoard.winner === gameBoard.player1Symbol ? 
             (gameBoard.gameMode === 'vs-robot' ? 'You won!' : 'Player 1 wins!') :
             (gameBoard.gameMode === 'vs-robot' ? 'Robot wins!' : 'Player 2 wins!')) :
            (gameBoard.isPlayer1Turn ? 
             (gameBoard.gameMode === 'vs-robot' ? 'Your turn' : 'Player 1 turn') :
             (gameBoard.gameMode === 'vs-robot' ? 'Robot thinking...' : 'Player 2 turn'))
          }
        </Text>
      </View>

      {/* Score Board */}
      <View style={styles.scoreBoard}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>
            {gameBoard.gameMode === 'vs-robot' ? 'You' : 'P1'}
          </Text>
          <Text style={styles.scoreValue}>{score.player1}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Draws</Text>
          <Text style={styles.scoreValue}>{score.draws}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>
            {gameBoard.gameMode === 'vs-robot' ? 'Robot' : 'P2'}
          </Text>
          <Text style={styles.scoreValue}>{score.player2}</Text>
        </View>
      </View>

      {/* Game Board */}
      <View style={styles.board}>
        {Array.from({ length: 9 }, (_, index) => renderSquare(index))}
      </View>

      {/* Game Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={pauseGame}>
          {isPaused ? <Play size={24} color="white" /> : <Pause size={24} color="white" />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={resetGame}>
          <RotateCcw size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Tic-Tac-Toe</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Game Content */}
      <View style={styles.content}>
        {gameState === 'selecting' ? renderGameModeSelection() : renderGameBoard()}
      </View>

      {/* Notification Banner */}
      {notification && (
        <NotificationBanner
          visible={notification.visible}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onDismiss={notification.onDismiss}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionTitle: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  selectionSubtitle: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  modeCards: {
    gap: theme.spacing.lg,
  },
  modeCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minWidth: 140,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeIconContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  modeTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    marginBottom: theme.spacing.sm,
  },
  modeDescription: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  gameModeText: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    marginBottom: theme.spacing.sm,
  },
  currentPlayerText: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255,255,255,0.8)',
  },
  scoreBoard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  scoreItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  scoreLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: theme.spacing.xs,
  },
  scoreValue: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  square: {
    width: '33.33%',
    height: '33.33%',
    padding: theme.spacing.xs,
  },
  squareButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  winningSquare: {
    backgroundColor: 'rgba(78, 205, 196, 0.3)',
    borderColor: '#4ECDC4',
  },
  squareText: {
    fontSize: 36,
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  xText: {
    color: '#FF6B9D',
  },
  oText: {
    color: '#4ECDC4',
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
});