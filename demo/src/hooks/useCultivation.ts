import { useEffect, useRef } from 'react';
import { useCharacter } from '../contexts/CharacterContext';

export const useCultivation = () => {
  const { data: state, updateAttributes } = useCharacter();
  const cultivationInterval = useRef<NodeJS.Timeout | null>(null);

  const startCultivation = () => {
    if (!state || state.cultivationState.isCultivating) return;

    updateAttributes({
      cultivationState: {
        ...state.cultivationState,
        isCultivating: true,
        startTime: new Date().getTime()
      }
    });
    
    cultivationInterval.current = setInterval(() => {
      if (!state) return;

      const cultivationGain = state.character.cultivationSpeed * 10; // 每秒获得修为
      const newCultivationValue = Math.min(
        state.character.cultivationValue + cultivationGain,
        state.character.maxCultivationValue
      );
      
      updateAttributes({
        character: {
          ...state.character,
          cultivationValue: newCultivationValue
        }
      });

      // 检查是否可以突破
      if (newCultivationValue >= state.character.maxCultivationValue) {
        updateAttributes({
          character: {
            ...state.character,
            cultivationValue: 0,
            level: state.character.level + 1
          },
          cultivationState: {
            ...state.cultivationState,
            isCultivating: false
          }
        });
        stopCultivation();
      }
    }, 1000);
  };

  const stopCultivation = () => {
    if (cultivationInterval.current) {
      clearInterval(cultivationInterval.current);
      cultivationInterval.current = null;
    }
    if (state) {
      updateAttributes({
        cultivationState: {
          ...state.cultivationState,
          isCultivating: false
        }
      });
    }
  };

  useEffect(() => {
    return () => {
      if (cultivationInterval.current) {
        clearInterval(cultivationInterval.current);
      }
    };
  }, []);

  return {
    startCultivation,
    stopCultivation,
    isCultivating: state.cultivationState.isCultivating,
    cultivationProgress: (state.character.cultivationValue / state.character.maxCultivationValue) * 100,
    cultivationValue: state.character.cultivationValue,
    maxCultivationValue: state.character.maxCultivationValue,
    breakthroughReady: state.character.cultivationValue >= state.character.maxCultivationValue,
  };
};