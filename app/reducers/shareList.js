// @flow
import * as sharelist from '../actions/shareList'
import * as share from '../actions/share'
import * as ipfs from '../actions/ipfs'
import ShareList, { writable } from '../models/ShareList'
import type { ShareListFilterType } from '../models/ShareList'
import Share from '../models/Share'
import { handleActions, combineActions } from 'redux-actions'
import { Action } from '../utils/types'
import shareReducer from './share'
import { List } from "immutable"

import shareFxt from '../models/fixtures/share'
let initialState = new ShareList()
shareFxt.forEach((share) => {
  initialState = initialState.set(writable.list, initialState.list.push(share))
})

export default handleActions({

  [sharelist.addShare]: (state: ShareList, action: Action<Share>) => (
    state.set(writable.list, state.list.push(action.payload))
  ),

  [sharelist.setFilter]: (state: ShareList, action: Action<ShareListFilterType>) => (
    state.set(writable.filter, action.payload)
  ),

  [sharelist.setSelected]: (state: ShareList, action: Action<number>) => (
    state.set(writable.selectedId, action.payload)
  ),

  [sharelist.setSearch]: (state: ShareList, action: Action<string>) => (
    state.set(writable.search, action.payload)
  ),

  [combineActions(
    share.setTitle,
    share.toggleFavorite
  )] : (state: ShareList, action: Action) => shareById(state, action),

  [combineActions(
    ipfs.receivedFileMetadata,
    ipfs.receivedDirMetadata
  )] : (state: ShareList, action: Action) => allShares(state, action),

}, initialState )

// Relay to the Share reducer of a specific Share identified by
// the property 'id' found in the action payload
function shareById(state: ShareList, action: Action) {
  const id = action.payload.id
  return state.update(writable.list,
    (list: List) => list.update(
      list.findIndex((x: Share) => x.id === id),
      (share: Share) => shareReducer(share, action)
    )
  )
}

// Relay to the Share reducer of every child Share
function allShares(state: ShareList, action: Action) {
  return state.update(writable.list,
    (list: List) => list.map(
      (share: Share) => shareReducer(share, action)
    )
  )
}