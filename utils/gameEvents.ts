// Simple event system for game completions
// This allows games to notify other parts of the app when they complete

type GameCompletionEvent = {
  type: 'game_completed';
  gameId: string;
  score: number;
  duration: number;
  timestamp: string;
};

type EventCallback = (event: GameCompletionEvent) => void;

class GameEventManager {
  private listeners: EventCallback[] = [];

  subscribe(callback: EventCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  dispatch(event: GameCompletionEvent) {
    this.listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in game event callback:', error);
      }
    });
  }

  notifyGameCompletion(gameId: string, score: number, duration: number) {
    this.dispatch({
      type: 'game_completed',
      gameId,
      score,
      duration,
      timestamp: new Date().toISOString()
    });
  }
}

export const gameEventManager = new GameEventManager();
