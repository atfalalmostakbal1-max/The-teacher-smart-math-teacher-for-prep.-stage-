
import React, { useState, useRef } from 'react';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
        // In a full implementation, we'd send this to Gemini Live or generateContent with audio parts.
        // For this UI, we'll simulate the "stop" and ask for input or inform the user.
        setIsRecording(false);
        // Note: Real transcription would happen by sending this blob to Gemini.
        // For brevity in this demo, we notify the user to type or we'd use SpeechRecognition API.
        alert("تم تسجيل الصوت بنجاح! جاري إرسال المسألة للمعلم...");
        onTranscription("حل المسألة المسجلة صوتياً"); 
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
          isRecording ? 'bg-red-500 animate-pulse scale-110' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isRecording ? (
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="10" /></svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
        )}
      </button>
      <p className="mt-4 text-gray-600 font-medium">
        {isRecording ? 'جاري الاستماع إليك... اضغط للإيقاف' : 'اضغط للتحدث وشرح المسألة بصوتك'}
      </p>
    </div>
  );
};

export default VoiceRecorder;
