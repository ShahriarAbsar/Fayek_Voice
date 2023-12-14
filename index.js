// index.js

let currentButton = 1;
let mediaRecorder;
let audioChunks = [];

function showButton(nextButton) {
  document.getElementById(`button${currentButton}`).style.display = 'none';

  // Hide the form if it exists
  const form = document.querySelector('.form-container');
  if (form) {
    form.style.display = 'none';
  }

  // Hide the previous text if it exists
  const previousText = document.getElementById(`text${currentButton}`);
  if (previousText) {
    previousText.style.display = 'none';
  }

  if (nextButton === 4) {
    // If Button 3 is clicked, show Button 4 and Button 5 together
    document.getElementById('button4').style.display = 'inline-block';
    document.getElementById('button5').style.display = 'inline-block';
  } else {
    document.getElementById(`button${nextButton}`).style.display = 'inline-block';
    document.getElementById('button4').style.display = 'none';
    document.getElementById('button5').style.display = 'none';
    document.getElementById('downloadButton').style.display = 'none';
    document.getElementById('audioPlayer').style.display = 'none'; // Hide the audio player

    // Show the form if going back to Button 1
    if (nextButton === 1) {
      const form = document.querySelector('.form-container');
      if (form) {
        form.style.display = 'block';
      }
    }

    // Show the corresponding text for the current button
    const currentText = document.getElementById(`text${nextButton}`);
    if (currentText) {
      currentText.style.display = 'block';
    }
  }

  currentButton = nextButton;
}

function showText() {
  document.getElementById('hiddenText').style.display = 'block';
  document.querySelector('.button-container').style.display = 'none';
}

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Set the audio player source
        document.getElementById('audioPlayer').src = audioUrl;

        // Show the "Playback Recording" button and audio player
        document.getElementById('button5').style.display = 'inline-block';
        document.getElementById('audioPlayer').style.display = 'block';

        // Clear the chunks for the next recording
        audioChunks = [];
      };

      mediaRecorder.start();
      showButton(3); // Show "Stop Recording" button
    })
    .catch(error => console.error('Error accessing microphone:', error));
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    showButton(4); // Show "Button 4" after recording stops
  }
}

function showPlayback() {
  showButton(5); // Show "Playback Recording" button
}

function downloadRecording() {
  if (audioChunks.length > 0) {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(audioBlob);
    downloadLink.download = 'recorded_audio.wav';

    // Append the download link to the body and trigger the click
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Remove the download link from the body
    document.body.removeChild(downloadLink);
  }
}
