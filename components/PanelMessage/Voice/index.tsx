import { useState, useRef, useEffect } from "react";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import Image from "@/components/Image";
import Slider from "./Slider";

const Voice = ({ }) => {
    const [open, setOpen] = useState(false);
    const [visibleSlider, setVisibleSlider] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    // In a real app, you'd handle the audio blob here
                    console.log("Audio data available:", event.data);
                }
            };

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
        <>
            <button
                className="relative z-2 flex justify-center items-center size-8 text-gray-500 outline-0 transition-colors hover:text-gray-900"
                onClick={() => setOpen(true)}
                title="Voice message"
            >
                <Icon className="relative z-2 !size-5 fill-current" name="microphone" />
            </button>
            <Modal
                classWrapper="max-w-188 max-md:!w-[calc(100%+2rem)] max-md:max-w-[calc(100%+2rem)] max-md:-mx-4"
                open={open}
                onClose={() => {
                    stopRecording();
                    setOpen(false);
                }}
            >
                <div className="relative w-60 mx-auto before:absolute before:-inset-10 before:bg-[#9150F5]/10 before:rounded-full before:blur-[2.25rem] max-md:w-45">
                    <Image
                        className={`w-full opacity-100 transition-transform duration-500 ${isRecording ? "scale-110" : "scale-100"}`}
                        src="/images/voice-recording.png"
                        width={240}
                        height={240}
                        alt="Voice Recording"
                    />
                    {isRecording && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-h4 text-gray-900 font-bold bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm">
                            {formatTime(recordingTime)}
                        </div>
                    )}
                </div>
                {visibleSlider && (
                    <div className="mt-20 overflow-hidden max-md:mt-5">
                        <Slider onClose={() => setVisibleSlider(false)} />
                    </div>
                )}
                <div className="flex justify-center gap-5 mt-30 max-md:mt-20">
                    <button
                        className={`group size-16 rounded-full text-0 transition-all ${isRecording ? "bg-red-500 scale-110" : "bg-gray-0 hover:bg-gray-25"}`}
                        onClick={isRecording ? stopRecording : startRecording}
                    >
                        <Icon
                            className={`!size-7 transition-colors ${isRecording ? "fill-white" : "fill-gray-500 group-hover:fill-gray-900"}`}
                            name={isRecording ? "close" : "microphone"}
                        />
                    </button>
                    <button
                        className={`group size-16 rounded-full text-0 transition-colors hover:bg-gray-25 ${visibleSlider ? "!bg-gray-700 " : "bg-gray-0"
                            }`}
                        onClick={() => setVisibleSlider(!visibleSlider)}
                    >
                        <Icon
                            className={`!size-7 transition-colors group-hover:fill-gray-900 ${visibleSlider ? "!fill-gray-0" : "fill-gray-500"
                                }`}
                            name="message-ai"
                        />
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default Voice;
