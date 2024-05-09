import { uuid } from './chat'

export interface metadata {
  chat_preferences: {
    muted: Array<uuid>
    deleted: Array<uuid>
    archived: Array<uuid>
    pinned: Array<uuid>
    cleaned: { [key: uuid]: string }
  }
}
