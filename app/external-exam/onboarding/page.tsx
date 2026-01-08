import { Suspense } from "react";
import ExamOnboarding from "@/templates/ExamOnboarding";

export default function ExamOnboardingPage() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
                <div className="animate-pulse text-[#717784]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Loading...
                </div>
            </div>
        }>
            <ExamOnboarding />
        </Suspense>
    );
}
