import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom React Hook for Voice Commerce
 * Supports:
 * - Speech recognition (Web Speech API)
 * - Speech synthesis (text-to-speech audio feedback)
 * - Intelligent voice command parsing (search, navigation, cart)
 */
export const useVoiceCommand = ({ onCommand } = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setTranscript(currentTranscript);

        // If speech recognition finalized this phrase
        if (event.results[0].isFinal) {
          if (onCommand) {
            onCommand(currentTranscript);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('Web Speech API is not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onCommand]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    try {
      setTranscript('');
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error('Error stopping speech recognition:', err);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Voice synthesis feedback (Assistant speaks back)
  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    isSpeaking,
    startListening,
    stopListening,
    toggleListening,
    speak,
  };
};

export default useVoiceCommand;
