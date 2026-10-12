import { ReviewData } from './clientScraper';
import { AspectRatio, ColorTheme, FontType, QuoteStyle, TemplateType, TextAlign } from '@/components/StoryTemplates';

export const SAVED_PROJECTS_SCHEMA_VERSION = 1;
const DB_NAME = 'storyboxd';
const STORE_NAME = 'saved-projects';
const DB_VERSION = 1;

export interface CustomStoryFields {
  title: string;
  year: string;
  director: string;
  rating: number;
  review: string;
  username: string;
  poster: string;
}

export interface SavedProjectDesign {
  selectedTemplate: TemplateType;
  aspectRatio: AspectRatio;
  fontSizeMultiplier: number;
  fontType: FontType;
  colorTheme: ColorTheme;
  isBold: boolean;
  isItalic: boolean;
  letterSpacing: number;
  lineHeight: number;
  showPoster: boolean;
  backdropPositionPercent: number;
  backdropPositionYPercent: number;
  customBackdrop: string | null;
  availableBackdrops: { url: string; thumbnail: string }[];
  backdropBlur: number;
  backdropBrightness: number;
  backdropSaturation: number;
  accentColor: string;
  textAlign: TextAlign;
  quoteStyle: QuoteStyle;
}

export interface SavedProject {
  id: string;
  schemaVersion: number;
  name: string;
  createdAt: number;
  updatedAt: number;
  sourceMode: 'import' | 'custom';
  sourceUrl: string;
  reviewData: ReviewData;
  customFields: CustomStoryFields;
  design: SavedProjectDesign;
}

function openDatabase(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.reject(new Error('Saved projects are unavailable in this browser.'));
  }
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open saved projects.'));
  });
}

async function transaction<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    let result: T;
    let finished = false;
    const tx = db.transaction(STORE_NAME, mode);

    const cleanup = () => {
      try {
        db.close();
      } catch {
        // ignore
      }
    };

    tx.oncomplete = () => {
      cleanup();
      if (!finished) {
        finished = true;
        resolve(result);
      }
    };

    tx.onabort = () => {
      cleanup();
      if (!finished) {
        finished = true;
        reject(tx.error || new Error('Saved project operation was cancelled.'));
      }
    };

    tx.onerror = () => {
      cleanup();
      if (!finished) {
        finished = true;
        reject(tx.error || new Error('Saved project operation failed.'));
      }
    };

    try {
      const request = action(tx.objectStore(STORE_NAME));
      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () => {
        cleanup();
        if (!finished) {
          finished = true;
          reject(request.error || new Error('Saved project operation failed.'));
        }
      };
    } catch (err) {
      cleanup();
      if (!finished) {
        finished = true;
        reject(err);
      }
    }
  });
}

function isProject(value: unknown): value is SavedProject {
  const project = value as Partial<SavedProject> | null;
  return !!project && typeof project.id === 'string' && typeof project.name === 'string' &&
    !!project.reviewData && !!project.design && (project.sourceMode === 'import' || project.sourceMode === 'custom');
}

export async function listSavedProjects(): Promise<SavedProject[]> {
  const records = await transaction('readonly', store => store.getAll());
  return (records as unknown[]).filter(isProject).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function getSavedProject(id: string): Promise<SavedProject | null> {
  const record = await transaction('readonly', store => store.get(id));
  return isProject(record) ? record : null;
}

export async function putSavedProject(project: SavedProject): Promise<void> {
  await transaction('readwrite', store => store.put({ ...project, schemaVersion: SAVED_PROJECTS_SCHEMA_VERSION }));
}

export async function deleteSavedProject(id: string): Promise<void> {
  await transaction('readwrite', store => store.delete(id));
}

export function newProjectId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
