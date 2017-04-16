// @flow
import { Record, Map } from 'immutable'
import Contact from './Contact'

export const writable = {
  contacts: 'contacts',
}

export const ShareListRecord = Record({
  contacts: Map(),
}, 'ContactList')

export default class ContactList extends ShareListRecord {
  contacts: Map<Contact>
}
