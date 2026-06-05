/* Whiteboard cloud adapter.
 *
 * Exposes window.WB_CLOUD with:
 *   - auth: {signedIn, email}                — populated by bootstrap()
 *   - bootstrap(): Promise<void>             — call once on load
 *   - boards: {list, create, get, save, rename, delete}
 *   - uploadImage(file): {storage_path, src}
 *   - aiFormat(text): sections[]
 *
 * Save/rename/delete throw on HTTP error so the whiteboard can surface a toast.
 */
(function () {
  const api = {
    auth: { signedIn: false, email: null },

    bootstrap: async function () {
      try {
        const r = await fetch('/api/whiteboard/me', { cache: 'no-store', credentials: 'same-origin' });
        if (r.ok) {
          const d = await r.json();
          api.auth.signedIn = !!d.signedIn;
          api.auth.email = d.email || null;
        }
      } catch (e) {
        // Treat as anonymous if the bootstrap fails.
        api.auth.signedIn = false;
      }
    },

    boards: {
      list: async function () {
        const r = await fetch('/api/whiteboard/boards', { cache: 'no-store', credentials: 'same-origin' });
        if (!r.ok) throw new Error('Failed to list boards (' + r.status + ')');
        const d = await r.json();
        return Array.isArray(d.boards) ? d.boards : [];
      },

      create: async function (name, state) {
        const r = await fetch('/api/whiteboard/boards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ name: name || null, state: state || null }),
        });
        if (!r.ok) throw new Error('Failed to create board (' + r.status + ')');
        const d = await r.json();
        return d.board;
      },

      get: async function (id) {
        const r = await fetch('/api/whiteboard/boards/' + encodeURIComponent(id), {
          cache: 'no-store',
          credentials: 'same-origin',
        });
        if (!r.ok) throw new Error('Failed to load board (' + r.status + ')');
        const d = await r.json();
        return d.board;
      },

      save: async function (id, state) {
        const r = await fetch('/api/whiteboard/boards/' + encodeURIComponent(id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ state: state }),
        });
        if (!r.ok) {
          let msg = 'Save failed (' + r.status + ')';
          try { const j = await r.json(); if (j && j.error) msg = j.error; } catch (e) {}
          throw new Error(msg);
        }
      },

      rename: async function (id, name) {
        const r = await fetch('/api/whiteboard/boards/' + encodeURIComponent(id), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ name: name }),
        });
        if (!r.ok) throw new Error('Rename failed (' + r.status + ')');
      },

      'delete': async function (id) {
        const r = await fetch('/api/whiteboard/boards/' + encodeURIComponent(id), {
          method: 'DELETE',
          credentials: 'same-origin',
        });
        if (!r.ok) throw new Error('Delete failed (' + r.status + ')');
      },
    },

    uploadImage: async function (file) {
      if (!file) throw new Error('No file');
      const fd = new FormData();
      fd.append('file', file, file.name || 'image');
      const r = await fetch('/api/whiteboard/upload', {
        method: 'POST',
        credentials: 'same-origin',
        body: fd,
      });
      if (!r.ok) {
        let msg = 'Upload failed (' + r.status + ')';
        try { const j = await r.json(); if (j && j.error) msg = j.error; } catch (e) {}
        throw new Error(msg);
      }
      const d = await r.json();
      return { storage_path: d.storage_path, src: d.src };
    },

    aiFormat: async function (text) {
      const r = await fetch('/api/whiteboard/ai-format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ text: text }),
      });
      if (!r.ok) {
        let msg = 'AI format failed (' + r.status + ')';
        try { const j = await r.json(); if (j && j.error) msg = j.error; } catch (e) {}
        const err = new Error(msg);
        if (r.status === 429) err.rateLimited = true;
        throw err;
      }
      const d = await r.json();
      return Array.isArray(d.sections) ? d.sections : [];
    },
  };

  window.WB_CLOUD = api;
})();
