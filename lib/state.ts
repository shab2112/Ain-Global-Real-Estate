/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { itineraryPlannerTools } from './tools/itinerary-planner';

export type Template = 'itinerary-planner';

const toolsets: Record<Template, FunctionCall[]> = {
  'itinerary-planner': itineraryPlannerTools,
};

import {
  SYSTEM_INSTRUCTIONS,
  SCAVENGER_HUNT_PROMPT,
  DEFAULT_LIVE_API_MODEL,
  DEFAULT_VOICE,
} from './constants';

const systemPrompts: Record<Template, string> = {
  'itinerary-planner': SYSTEM_INSTRUCTIONS,
};

import {
  GenerateContentResponse,
  FunctionResponse,
  FunctionResponseScheduling,
  LiveServerToolCall,
  GroundingChunk,
} from '@google/genai';
import { Map3DCameraProps } from '@/components/map-3d';

/**
 * Personas
 */
export const SCAVENGER_HUNT_PERSONA =
  'ClueMaster Cory, the Scavenger Hunt Creator';

export const personas: Record<string, { prompt: string; voice: string }> = {
  [SCAVENGER_HUNT_PERSONA]: {
    prompt: SCAVENGER_HUNT_PROMPT,
    voice: 'Puck',
  },
};

/**
 * Settings
 */
export const useSettings = create<{
  systemPrompt: string;
  model: string;
  voice: string;
  isEasterEggMode: boolean;
  activePersona: string;
  setSystemPrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setVoice: (voice: string) => void;
  setPersona: (persona: string) => void;
  activateEasterEggMode: () => void;
}>(set => ({
  systemPrompt: systemPrompts['itinerary-planner'],
  model: DEFAULT_LIVE_API_MODEL,
  voice: DEFAULT_VOICE,
  isEasterEggMode: false,
  activePersona: SCAVENGER_HUNT_PERSONA,
  setSystemPrompt: prompt => set({ systemPrompt: prompt }),
  setModel: model => set({ model }),
  setVoice: voice => set({ voice }),
  setPersona: (persona: string) => {
    if (personas[persona]) {
      set({
        activePersona: persona,
        systemPrompt: personas[persona].prompt,
        voice: personas[persona].voice,
      });
    }
  },
  activateEasterEggMode: () => {
    set(state => {
      if (!state.isEasterEggMode) {
        const persona = SCAVENGER_HUNT_PERSONA;
        return {
          isEasterEggMode: true,
          activePersona: persona,
          systemPrompt: personas[persona].prompt,
          voice: personas[persona].voice,
          model: 'gemini-live-2.5-flash-preview',
        };
      }
      return {};
    });
  },
}));

/**
 * UI
 */
export const useUI = create<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  showSystemMessages: boolean;
  toggleShowSystemMessages: () => void;
}>(set => ({
  isSidebarOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  showSystemMessages: false,
  toggleShowSystemMessages: () =>
    set(state => ({ showSystemMessages: !state.showSystemMessages })),
}));

/**
 * Tools
 */
export interface FunctionCall {
  name: string;
  description?: string;
  parameters?: any;
  isEnabled: boolean;
  scheduling?: FunctionResponseScheduling;
}

export const useTools = create<{
  tools: FunctionCall[];
  template: Template;
  setTemplate: (template: Template) => void;
  toggleTool: (toolName: string) => void;
}>(set => ({
  template: 'itinerary-planner',
  tools: toolsets['itinerary-planner'],
  setTemplate: template => {
    set({ template, tools: toolsets[template] });
  },
  toggleTool: (toolName: string) =>
    set(state => ({
      tools: state.tools.map(tool =>
        tool.name === toolName ? { ...tool, isEnabled: !tool.isEnabled } : tool,
      ),
    })),
}));

/**
 * Log
 */
export interface ConversationTurn {
  role: 'user' | 'agent' | 'system';
  text: string;
  timestamp: number;
  isFinal: boolean;
  groundingChunks?: GroundingChunk[];
  toolResponse?: GenerateContentResponse;
}

export const useLogStore = create<{
  turns: ConversationTurn[];
  isAwaitingFunctionResponse: boolean;
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) => void;
  updateLastTurn: (updates: Partial<Omit<ConversationTurn, 'timestamp' | 'role'>>) => void;
  mergeIntoLastAgentTurn: (updates: Partial<Omit<ConversationTurn, 'timestamp' | 'role'>>) => void;
  clearTurns: () => void;
  setIsAwaitingFunctionResponse: (isAwaiting: boolean) => void;
}>(set => ({
  turns: [],
  isAwaitingFunctionResponse: false,
  addTurn: turn =>
    set(state => ({
      turns: [...state.turns, { ...turn, timestamp: Date.now() }],
    })),
  updateLastTurn: updates =>
    set(state => {
      const newTurns = [...state.turns];
      const lastIndex = newTurns.length - 1;
      if (lastIndex >= 0) {
        newTurns[lastIndex] = { ...newTurns[lastIndex], ...updates };
      }
      return { turns: newTurns };
    }),
  mergeIntoLastAgentTurn: updates => {
    set(state => {
      const turns = state.turns;
      const lastAgentTurnIndex = turns.map(t => t.role).lastIndexOf('agent');
      
      if (lastAgentTurnIndex === -1) {
        return state;
      }

      const mergedTurn: ConversationTurn = {
        ...turns[lastAgentTurnIndex],
        text: turns[lastAgentTurnIndex].text + (updates.text || ''),
        isFinal: updates.isFinal ?? turns[lastAgentTurnIndex].isFinal,
        groundingChunks: updates.groundingChunks || turns[lastAgentTurnIndex].groundingChunks,
        toolResponse: updates.toolResponse || turns[lastAgentTurnIndex].toolResponse,
      };

      const newTurns = [...turns];
      newTurns[lastAgentTurnIndex] = mergedTurn;

      return { turns: newTurns };
    });
  },
  clearTurns: () => set({ turns: [] }),
  setIsAwaitingFunctionResponse: isAwaiting =>
    set({ isAwaitingFunctionResponse: isAwaiting }),
}));

/**
 * Map Entities
 */
export interface MapMarker {
  position: {
    lat: number;
    lng: number;
    altitude: number;
  };
  label: string;
  showLabel: boolean;
}

export const useMapStore = create<{
  markers: MapMarker[];
  cameraTarget: Map3DCameraProps | null;
  preventAutoFrame: boolean;
  setMarkers: (markers: MapMarker[]) => void;
  clearMarkers: () => void;
  setCameraTarget: (target: Map3DCameraProps | null) => void;
  setPreventAutoFrame: (prevent: boolean) => void;
}>(set => ({
  markers: [],
  cameraTarget: null,
  preventAutoFrame: false,
  setMarkers: markers => set({ markers }),
  clearMarkers: () => set({ markers: [] }),
  setCameraTarget: target => set({ cameraTarget: target }),
  setPreventAutoFrame: prevent => set({ preventAutoFrame: prevent }),
}));
