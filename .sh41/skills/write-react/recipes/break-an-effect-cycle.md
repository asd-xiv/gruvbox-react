# Break an effect cycle

A component whose effects set each other's state, so the same request repeats
forever. The fix merges the two copies of one entity into one state. Only event
handlers change that state.

## Steps

1. Trace the effects step by step, until a request repeats
2. Merge the states that copy one entity into one state, plus a flag for the one
   fact that told the copies apart
3. Keep an effect only to sync with an outside system. Change the state for each
   event in its event handler

## Example: a profile editor

The brief: a user edits their profile, and the app saves the changes to the
backend.

### The cycle

```tsx
// src/features/profile/profile-editor.tsx, before
const ProfileEditor: FC<ProfileEditorProps> = ({ userId }) => {
  const [draftProfile, setDraftProfile] = useState<Profile>()
  const [backendProfile, setBackendProfile] = useState<Profile>()

  // 1. Load from the backend, on mount and for another user
  useEffect(() => {
    void findProfile(userId).then(setBackendProfile)
  }, [userId])

  // 2. Copy the backend profile into the draft
  useEffect(() => {
    if (backendProfile) {
      setDraftProfile(backendProfile)
    }
  }, [backendProfile])

  // 3. Save each change of the draft
  useEffect(() => {
    if (draftProfile) {
      void saveProfile(draftProfile).then(setBackendProfile)
    }
  }, [draftProfile])

  // …
}
```

Each effect makes sense alone. Run them in order:

| Step          | `backendProfile` | `draftProfile` | Effect that fires                 |
| ------------- | ---------------- | -------------- | --------------------------------- |
| Mount         | `undefined`      | `undefined`    | 1 calls `findProfile`             |
| Find resolves | `Profile A`      | `undefined`    | 2 sets the draft to `Profile A`   |
| Draft set     | `Profile A`      | `Profile A`    | 3 calls `saveProfile(Profile A)`  |
| Save resolves | `Profile A′`     | `Profile A`    | 2 sets the draft to `Profile A′`  |
| Draft set     | `Profile A′`     | `Profile A′`   | 3 calls `saveProfile(Profile A′)` |
| …             | …                | …              | the same request, forever         |

### The fix

The two states are two copies of one entity, the profile. One state stores the
profile. `isDirty` stores the one fact that told the copies apart: the user
changed the profile since the last save.

- To save as the user types, call `saveProfile` from `handleEdit`, with a
  debounce. Never call it from an effect on the profile

```tsx
// src/features/profile/profile-editor.tsx, after
import { Button } from "@asd14/gruvbox-react/ui"
import { useEffect, useState } from "react"
import type { FC } from "react"

import { findProfile, saveProfile } from "./utils/api.js"
import type { Profile } from "./utils/api.js"

type ProfileEditorProps = {
  userId: string
}

/**
 * Edit one profile and save it.
 */
const ProfileEditor: FC<ProfileEditorProps> = ({ userId }) => {
  const [editor, setEditor] = useState<{
    profile: Profile
    isDirty: boolean
  }>()

  // Load from the backend, on mount and for another user
  useEffect(() => {
    void findProfile(userId).then(profile => {
      setEditor({ profile, isDirty: false })
    })
  }, [userId])

  // An event handler: the user typed
  const handleEdit = <K extends keyof Profile>(field: K, value: Profile[K]) => {
    setEditor(
      current =>
        current && {
          profile: { ...current.profile, [field]: value },
          isDirty: true,
        }
    )
  }

  // An event handler: the user saved
  const handleSave = async () => {
    if (!editor?.isDirty) {
      return
    }

    setEditor({ profile: await saveProfile(editor.profile), isDirty: false })
  }

  if (!editor) {
    return <p>Loading the profile…</p>
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        void handleSave()
      }}>
      <label>
        Name
        <input
          value={editor.profile.name}
          onChange={event => {
            handleEdit("name", event.target.value)
          }}
        />
      </label>
      <Button type="submit" disabled={!editor.isDirty}>
        Save
      </Button>
    </form>
  )
}

export { ProfileEditor }
```
