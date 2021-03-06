
import * as React from "react"
import {classNames} from "lib"

import StaffNotes from "st/components/staff_notes"
import {parseNote, noteName, noteStaffOffset, MIDDLE_C_PITCH} from "st/music"
import * as types from "prop-types"

export default class StaffSongNotes extends StaffNotes {
  static propTypes = {
    loopLeft: types.number,
    loopRight: types.number,
  }

  classNames()  {
    return "staff_notes staff_song_notes"
  }

  static defaultPixelsPerBeat = 100

  renderNotes() {
    return [
      this.renderMeasureLines(),
      super.renderNotes()
    ]
  }

  renderHeldNotes() {
    // song staff doesn't have ghost held notes
  }

  renderMeasureLines() {
    let beatsPerMeasure = 4

    if (this.props.notes.metadata) {
      beatsPerMeasure = this.props.notes.metadata.beatsPerMeasure || beatsPerMeasure
    }

    let stop = this.props.notes.getStopInBeats()
    let measures = Math.ceil(stop / beatsPerMeasure)

    let lines = []

    let pixelsPerBeat = this.props.pixelsPerBeat || this.constructor.defaultPixelsPerBeat

    for (let m = 0; m <= measures; m++) {
      let fromLeft = m * beatsPerMeasure * pixelsPerBeat

      lines.push(<div
        style={{ left: `${fromLeft - 2}px`}}
        data-label={m + 1}
        key={`measure-${m}`}
        className="measure_line"></div>)
    }

    return lines
  }

  renderNote(songNote, opts) {
    const key = this.props.keySignature
    let note = songNote.note
    let pitch = parseNote(note)

    if (!this.shouldRenderPitch(pitch)) {
      return
    }

    let pixelsPerBeat = this.props.pixelsPerBeat || this.constructor.defaultPixelsPerBeat

    let row = noteStaffOffset(note)

    let fromTop = this.props.upperRow - row
    let fromLeft = songNote.start * pixelsPerBeat + 2
    let width = songNote.getRenderStop() * pixelsPerBeat - fromLeft - 4

    let accidentals = key.accidentalsForNote(note)

    let style = {
      top: `${Math.floor(fromTop * 25/2)}%`,
      left: `${fromLeft}px`,
      width: `${width}px`
    }

    let outside = row > this.props.upperRow || row < this.props.lowerRow

    let outsideLoop = false

    if (this.props.loopLeft != null && this.props.loopRight != null) {
      outsideLoop = songNote.start < this.props.loopLeft || songNote.start >= this.props.loopRight
    }

    let held = this.props.heldNotes[songNote.note]

    let noteEl = <div
      className={classNames("note_bar", {
        is_flat: accidentals == -1,
        is_sharp: accidentals == 1,
        is_natural: accidentals == 0,
        held: held && held.songNoteIdx == opts.idx,
        outside_loop: outsideLoop,
      })}
      title={songNote.note}
      style={style}
      key={opts.key}></div>

    if (outside) {
      return [
        this.renderLedgerLines(note, {
          offset: fromLeft,
          width: width,
        }),
        noteEl,
      ]
    } else {
      return noteEl
    }

  }
}
