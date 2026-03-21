import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────
export type CharType = "select" | "text" | "number";

export interface MultiLangValue {
  uz: string;
  ru: string;
  en: string;
  kz: string;
}

export interface CharacteristicDetail {
  id: number;
  name: MultiLangValue;
  type: CharType;
  values: MultiLangValue[];
}

interface CharacteristicsEditStore {
  selectedCharId: number | null;
  selectedChar: CharacteristicDetail | null;
  setSelectedChar: (char: CharacteristicDetail) => void;
  clearSelectedChar: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useCharacteristicsEditStore = create<CharacteristicsEditStore>((set) => ({
  selectedCharId: null,
  selectedChar: null,

  setSelectedChar: (char) =>
    set({ selectedCharId: char.id, selectedChar: char }),

  clearSelectedChar: () =>
    set({ selectedCharId: null, selectedChar: null }),
}));