import { useState, useRef, useEffect } from "react";
import Icon from "@/components/Icon";
import Image from "@/components/Image";

const Audio = ({ }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.onstop = () => {
                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
                setRecordingTime(0);
                if (timerInterval.current) clearInterval(timerInterval.current);
            };

            mediaRecorder.current.start();
            setIsRecording(true);

            timerInterval.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied or not available.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        return () => {
            if (timerInterval.current) clearInterval(timerInterval.current);
        };
    }, []);

    return (
        <div className="flex gap-3 items-center">
            {isRecording && (
                <>
                    <div className="flex items-center gap-3 max-w-106 px-3 border-x border-gray-300 overflow-hidden max-3xl:max-w-100 max-xl:max-w-80 max-lg:hidden">
                        <div className="text-body-sm font-bold text-primary-200 min-w-[40px]">
                            {formatTime(recordingTime)}
                        </div>
                        <Image
                            className="w-114.5 h-8 opacity-100 animate-pulse"
                            src="/images/audio-recording.svg"
                            width={458}
                            height={33}
                            alt="Audio Recording"
                        />
                    </div>
                    <button
                        className="size-8 text-0 max-lg:hidden"
                        onClick={stopRecording}
                    >
                        <Icon name="close" />
                    </button>
                </>
            )}
            <div className="relative">
                <button
                    className={`relative z-2 flex justify-center items-center size-8 outline-0 transition-colors ${isRecording
                            ? "bg-primary-200 rounded-full fill-gray-0 shadow-[inset_0_-0.125rem_0_0_#722BDD,inset_0_0.125rem_0_0_#9C60F6] hover:bg-primary-300 hover:shadow-[inset_0_-0.125rem_0_0_#3A186F,inset_0_0.125rem_0_0_#623A9E]"
                            : "border border-gray-100 rounded-lg fill-gray-900 shadow-[0_0.0625rem_0.125rem_0_rgba(0,0,0,0.08)] hover:bg-gray-25"
                        }`}
                    onClick={isRecording ? stopRecording : startRecording}
                >
                    <Icon
                        className="relative z-2 fill-inherit"
                        name={isRecording ? "close" : "microphone"}
                    />
                </button>
                {isRecording && (
                    <div className="absolute inset-0 rounded-full bg-primary-50 animate-ping"></div>
                )}
            </div>
        </div>
    );
};

export default Audio;
