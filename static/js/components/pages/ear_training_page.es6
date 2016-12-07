let {Link} = ReactRouter

class EarTrainingPage extends React.Component {
  componentDidMount() {
    N.setTitle("Register Account")
  }

  constructor(props) {
    super(props)

    this.state = {
      midiChannel: null,
      touchedNotes: {},
    }
  }

  midiOutputs() {
    if (!this.props.midi) return []
    return [...this.props.midi.outputs.values()]
  }

  onMidiMessage(message) {
    console.warn("got message", parseMidiMessage(message))
  }

  // see if the pressed notes buffer matches the melody
  checkForMatch() {
    console.log("todo")
  }

  pushMelody() {
    let generator = new RandomNotes(new MajorScale("C").getRange(5), {
      smoothness: 3
    })

    // create a test melody
    let list = new NoteList([], { generator })
    list.fillBuffer(8)
    console.log("Playing", list.map((n) => n.join(" ")).join(", "))
    this.state.midiChannel.playNoteList(list)

    this.setState({
      currentNotes: list
    })
  }

  render() {
    let contents
    if (this.state.midiChannel) {
      contents = this.renderMeldoyGenerator()
    } else {
      contents = this.renderMidiPicker()
    }

    return <div className="ear_training_page">
      {contents}
    </div>
  }

  renderMeldoyGenerator() {
    let repeatButton
    if (this.state.currentNotes) {
      repeatButton = <button onClick={(e) => {
        e.preventDefault()
        this.state.midiChannel.playNoteList(this.state.currentNotes)
      }}>Repeat melody</button>
    }

    return <div>
      <button onClick={(e) => {
        e.preventDefault()
        this.pushMelody()
      }}>New melody</button>
      {" "}
      {repeatButton}
    </div>
  }

  renderMidiPicker() {
    if (!this.props.midi) {
      return
    }

    return <div className="choose_device">
      <h3>Choose a MIDI output device</h3>
      <p>This tool requires a MIDI device to play notes to.</p>
      <MidiSelector
        selectedInput={(idx) => {
          let output = this.midiOutputs()[idx]
          let channel = new MidiChannel(output, 0)
          channel.setInstrument(0)
          channel.testNote()
          // channel.setInstrument(56) // trumpet
          this.setState({
            midiChannel: channel
          })
        }}
        midiOptions={this.midiOutputs()} />
    </div>
  }
}
