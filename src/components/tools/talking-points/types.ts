export type Bullet = {
  id: string;
  text: string;
};

export type Section = {
  id: string;
  heading: string;
  bullets: Bullet[];
  editor_notes: string;
  /** Chunk 2 will populate this — reserved for storage refs. */
  photos: Photo[];
};

export type Photo = {
  id: string;
  storage_path: string;
  filename: string;
};

export type Board = {
  sections: Section[];
};

export const EMPTY_BOARD: Board = { sections: [] };
