import { NextRequest, NextResponse } from "next/server";

const ALOC_API_KEY = "ALOC-f1d0d4d421f7047b63b3";
const ALOC_BASE_URL = "https://questions.aloc.com.ng/api/v2";

// Map exam types to ALOC exam types
const EXAM_TYPE_MAP: Record<string, string> = {
    wassce: "wassce",
    neco: "wassce", // NECO uses similar format
    jamb: "utme",
    jupeb: "utme", // Use UTME questions for JUPEB
    ielts: "wassce", // Fallback to WASSCE English for IELTS
};

// Common subjects
const SUBJECTS = [
    "english",
    "mathematics",
    "physics",
    "chemistry",
    "biology",
    "commerce",
    "accounting",
    "government",
    "literature",
    "economics",
    "crk",
    "geography",
];

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const examType = searchParams.get("exam") || "jamb";
    const count = parseInt(searchParams.get("count") || "20");
    const year = searchParams.get("year");
    const subject = searchParams.get("subject") || "english";

    const alocExamType = EXAM_TYPE_MAP[examType] || "utme";

    try {
        const questions = [];

        // Fetch multiple questions
        for (let i = 0; i < count; i++) {
            let url = `${ALOC_BASE_URL}/q?subject=${subject}&type=${alocExamType}`;

            // Add year if specified and not random
            if (year && !isNaN(parseInt(year))) {
                url += `&year=${year}`;
            }

            const response = await fetch(url, {
                headers: {
                    "Accept": "application/json",
                    "AccessToken": ALOC_API_KEY,
                },
                cache: "no-store",
            });

            if (!response.ok) {
                continue;
            }

            const data = await response.json();

            if (data.status === 200 && data.data) {
                const q = data.data;

                // Strict Year Check: skip if year is requested but doesn't match
                // We use loose equality for string/number match (e.g. "2010" == 2010)
                if (year && !isNaN(parseInt(year))) {
                    if (q.examyear && q.examyear != year) {
                        continue;
                    }
                }

                // Clean up HTML tags but preserve formatting
                const cleanQuestion = q.question
                    // Protect standard formatting tags
                    .replace(/<u>/g, '[[U_START]]')
                    .replace(/<\/u>/g, '[[U_END]]')
                    .replace(/<i>/g, '[[I_START]]')
                    .replace(/<\/i>/g, '[[I_END]]')
                    .replace(/<em>/g, '[[I_START]]')
                    .replace(/<\/em>/g, '[[I_END]]')
                    .replace(/<b>/g, '[[B_START]]')
                    .replace(/<\/b>/g, '[[B_END]]')
                    .replace(/<strong>/g, '[[B_START]]')
                    .replace(/<\/strong>/g, '[[B_END]]')
                    // Remove all other tags
                    .replace(/<[^>]*>/g, '')
                    // Restore protected tags
                    .replace(/\[\[U_START\]\]/g, '<u>')
                    .replace(/\[\[U_END\]\]/g, '</u>')
                    .replace(/\[\[I_START\]\]/g, '<i class="italic">')
                    .replace(/\[\[I_END\]\]/g, '</i>')
                    .replace(/\[\[B_START\]\]/g, '<b class="font-bold">')
                    .replace(/\[\[B_END\]\]/g, '</b>')
                    .replace(/&nbsp;/g, ' ')
                    .trim();

                // Build options array
                const options = [];
                if (q.option.a) options.push({ key: "a", text: q.option.a });
                if (q.option.b) options.push({ key: "b", text: q.option.b });
                if (q.option.c) options.push({ key: "c", text: q.option.c });
                if (q.option.d) options.push({ key: "d", text: q.option.d });
                if (q.option.e) options.push({ key: "e", text: q.option.e });

                questions.push({
                    id: q.id,
                    question: cleanQuestion,
                    section: q.section?.replace(/<[^>]*>/g, '').trim() || "",
                    options: options,
                    answer: q.answer,
                    solution: q.solution?.replace(/<[^>]*>/g, '').trim() || "",
                    year: q.examyear,
                    examType: q.examtype?.toUpperCase(),
                    questionNumber: q.questionNub,
                });
            }
        }

        return NextResponse.json({
            success: true,
            count: questions.length,
            questions,
        });
    } catch (error) {
        console.error("ALOC API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch questions" },
            { status: 500 }
        );
    }
}
