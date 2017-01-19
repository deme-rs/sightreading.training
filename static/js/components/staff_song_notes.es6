
import * as React from "react"
import {classNames} from "lib"

import StaffNotes from "st/components/staff_notes"
import {parseNote, letterOffset, MIDDLE_C_PITCH} from "st/music"

export default class StaffSongNotes extends StaffNotes {
  classNames()  {
    return "staff_notes staff_song_notes"
  }

  renderNote(songNote, opts) {
    const key = this.props.keySignature

    let pitch = parseNote(songNote.note)

    let pixelsPerBpm = 100

    let row = letterOffset(pitch, !key.isFlat())
    let fromTop = letterOffset(this.props.upperLine) - row;
    let fromLeft = songNote.start * pixelsPerBpm
    let width = songNote.duration * pixelsPerBpm

    let style = {
      top: `${Math.floor(fromTop * 25/2)}%`,
      left: `${fromLeft}px`,
      width: `${width}px`
    }

    return <div
      className="note_bar"
      style={style}
      key={opts.key}>{songNote.toString()}</div>
  }
}