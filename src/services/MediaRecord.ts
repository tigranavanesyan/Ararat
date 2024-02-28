export let recorder: MediaRecorder | undefined;
let gumStream: MediaStream;

export const toggleRecording = () => {

    if (recorder && recorder.state == "recording") {
        recorder.stop();
        gumStream.getAudioTracks()[0].stop();
    } else {
        void navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(function(stream) {
            gumStream = stream;
            recorder = new MediaRecorder(stream);
            recorder.start();
        });
    }
}