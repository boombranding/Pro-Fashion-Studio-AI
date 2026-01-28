
import { GalleryItem, Project } from "../types";

const DB_NAME = 'pro_fashion_db';
const STORE_GALLERY = 'gallery';
const STORE_PROJECTS = 'projects';
const DB_VERSION = 2;

/**
 * Open (and create if needed) the IndexedDB database.
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_GALLERY)) {
        db.createObjectStore(STORE_GALLERY, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// --- PROJECTS ---

export const saveProject = async (project: Project): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_PROJECTS], 'readwrite');
    const store = transaction.objectStore(STORE_PROJECTS);
    const request = store.put(project); // put allows updating

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getProjects = async (): Promise<Project[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_PROJECTS], 'readonly');
    const store = transaction.objectStore(STORE_PROJECTS);
    const request = store.getAll();

    request.onsuccess = () => {
      const items = request.result as Project[];
      items.sort((a, b) => b.timestamp - a.timestamp);
      resolve(items);
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteProject = async (projectId: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_PROJECTS, STORE_GALLERY], 'readwrite');
    
    // 1. Delete the Project
    const projectStore = transaction.objectStore(STORE_PROJECTS);
    projectStore.delete(projectId);

    // 2. Delete all items belonging to this project
    const galleryStore = transaction.objectStore(STORE_GALLERY);
    // Since we don't have an index on projectId in this simple setup, we iterate.
    // In a larger app, we'd use an index.
    const cursorRequest = galleryStore.openCursor();
    
    cursorRequest.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
            const item = cursor.value as GalleryItem;
            if (item.projectId === projectId) {
                cursor.delete();
            }
            cursor.continue();
        }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

// --- GALLERY ITEMS ---

export const saveToGallery = async (item: GalleryItem): Promise<void> => {
  const db = await openDB();
  
  // We need to save the item AND update the Project's thumbnail/count
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_GALLERY, STORE_PROJECTS], 'readwrite');
    
    // 1. Save Item
    const galleryStore = transaction.objectStore(STORE_GALLERY);
    galleryStore.add(item);

    // 2. Update Project
    const projectStore = transaction.objectStore(STORE_PROJECTS);
    const projectReq = projectStore.get(item.projectId);
    
    projectReq.onsuccess = () => {
        const project = projectReq.result as Project;
        if (project) {
            project.itemCount += 1;
            // Set thumbnail if it's the first one
            if (!project.thumbnailUrl) {
                project.thumbnailUrl = item.imageUrl;
            }
            projectStore.put(project);
        }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_GALLERY], 'readonly');
    const store = transaction.objectStore(STORE_GALLERY);
    const request = store.getAll();

    request.onsuccess = () => {
      const items = request.result as GalleryItem[];
      items.sort((a, b) => b.timestamp - a.timestamp);
      resolve(items);
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Delete a single gallery item. 
 * If it's the last item in a project, delete the project too.
 */
export const deleteGalleryItem = async (id: string): Promise<void> => {
  const db = await openDB();
  
  // First, get the item to know its projectId
  return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_GALLERY, STORE_PROJECTS], 'readwrite');
      const galleryStore = transaction.objectStore(STORE_GALLERY);
      const projectStore = transaction.objectStore(STORE_PROJECTS);

      const itemReq = galleryStore.get(id);

      itemReq.onsuccess = () => {
          const item = itemReq.result as GalleryItem;
          if (!item) {
              resolve(); // Item not found, treat as success
              return;
          }

          // Delete Item
          galleryStore.delete(id);

          // Update Project
          const projReq = projectStore.get(item.projectId);
          projReq.onsuccess = () => {
              const project = projReq.result as Project;
              if (project) {
                  if (project.itemCount <= 1) {
                      // It was the last item, delete project
                      projectStore.delete(item.projectId);
                  } else {
                      // Decrement count
                      project.itemCount -= 1;
                      // If deleted item was thumbnail (unlikely to track perfectly without index, but keep simple)
                      // We won't re-scan for new thumbnail for simplicity, just keep old url or it might break if strictly linked
                      projectStore.put(project);
                  }
              }
          };
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
  });
};
