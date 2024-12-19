import { LightningElement, track } from 'lwc';

export default class VoiceRecorderApp extends LightningElement {
    @track isRecording = false;
    @track recordingAvailable = false;
    @track audioURL = null;
    @track transcribedText = '';

    mediaRecorder = null;
    audioChunks = [];
     speechRecognition = null; 

    get isStopButtonDisabled() {
        return !this.isRecording; 
    }

    get isDownloadButtonDisabled() {
        return !this.recordingAvailable; 
    }

    startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                this.mediaRecorder = new MediaRecorder(stream);
                this.audioChunks = [];
                this.transcribedText = ''; 

               
                this.mediaRecorder.ondataavailable = (event) => {
                    this.audioChunks.push(event.data);
                };

                
                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                    this.audioURL = URL.createObjectURL(audioBlob);
                    this.recordingAvailable = true;
                };

                
                this.mediaRecorder.start();
                this.isRecording = true;

                this.startSpeechRecognition();
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
            });
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            this.isRecording = false;

            if (this.speechRecognition) {
                this.speechRecognition.stop();
            }
        }
        
    }

    downloadRecording() {
        if (this.audioURL) {
            const anchor = document.createElement('a');
            anchor.href = this.audioURL;
            anchor.download = 'recording.wav';
            anchor.click();
        }
    }

    startSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error('Speech Recognition not supported in this browser.');
            return;
        }

        this.speechRecognition = new SpeechRecognition();
        this.speechRecognition.lang = 'en-US'; 
        this.speechRecognition.interimResults = true;

        this.speechRecognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join('');
            this.transcribedText = transcript;
        };

        this.speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        this.speechRecognition.onend = () => {
            console.log('Speech recognition stopped.');
        };

        this.speechRecognition.start();
    }
}
