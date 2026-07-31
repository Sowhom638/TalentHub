// src/components/AIHiringAssistant.jsx
import { useState, useEffect } from "react";
import {
  Send,
  Loader2,
  Sparkles,
  AlertCircle,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAIHistory,
  analyzeJobPrompt,
  clearAIError,
  setActiveResponse,
} from "../redux/slices/aiSlice";
import { toast } from "react-toastify";

export default function AIHiringAssistant({ jobId }) {
  const [prompt, setPrompt] = useState("");
  const dispatch = useDispatch();

  const {
    history,
    currentResponse: response,
    isLoading,
    error,
  } = useSelector((state) => state.ai);

  const examplePrompts = [
    "Suggest the top 2 candidates based on required skills.",
    "Are there any red flags or missing requirements in this applicant pool?",
    "Who should I prioritize for a technical screening and why?",
    "Summarize the overall experience level of all applicants.",
  ];

  useEffect(() => {
    if (jobId) {
      dispatch(fetchAIHistory(jobId));
      dispatch(setActiveResponse(null));
      dispatch(clearAIError());
    }
  }, [jobId, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      await dispatch(analyzeJobPrompt({ jobId, prompt })).unwrap();
      toast.success("Analysis complete");
      setPrompt("");
    } catch (err) {
      toast.error("AI Analysis failed:");
      toast.info(`${err}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b-4 border-black bg-linear-to-r from-purple-300 via-pink-300 to-yellow-300">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-black text-black">
              AI Hiring Assistant
            </h2>
            <p className="text-sm text-black font-bold">
              Ask questions about your applicant pool
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Example Prompts */}
        <div>
          <p className="text-xs font-black text-black uppercase tracking-wider mb-3 bg-gray-100 inline-block px-3 py-1.5 rounded-lg border-2 border-black">
            Try asking:
          </p>
          <div className="flex flex-wrap gap-3">
            {examplePrompts.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(example)}
                disabled={isLoading}
                className="text-xs px-4 py-2.5 bg-cyan-200 hover:bg-cyan-300 text-black font-bold border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-400 border-4 border-black rounded-2xl flex items-start gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <AlertCircle className="w-6 h-6 text-black shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-black text-black">
                AI Service Unavailable
              </p>
              <p className="text-sm text-black font-medium mt-1">{error}</p>
              <button
                onClick={() => dispatch(clearAIError())}
                className="text-xs font-bold text-black underline mt-2 hover:text-gray-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Which candidate has the strongest React experience?'"
              className="w-full px-4 py-3 pr-14 border-2 border-black rounded-xl focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] resize-none disabled:bg-gray-100 text-sm font-bold text-black bg-gray-50"
              rows={3}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="absolute right-2 bottom-2 p-3 bg-purple-500 text-black border-2 border-black rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : (
                <Send className="w-5 h-5 text-black" />
              )}
            </button>
          </div>
        </form>

        {/* Response Display */}
        {response && !error && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Summary */}
            {response.summary && (
              <div className="p-5 bg-purple-200 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-white rounded-lg border-2 border-black">
                    <MessageSquare className="w-4 h-4 text-black" />
                  </div>
                  <h3 className="font-black text-black text-sm uppercase">
                    AI Summary
                  </h3>
                </div>
                <p
                  className="text-sm text-black font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: response.summary.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="text-black font-black">$1</strong>',
                    ),
                  }}
                />
              </div>
            )}

            {/* 2. Top Candidates */}
            {response.topCandidates?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-green-400 rounded-lg border-2 border-black">
                    <Users className="w-4 h-4 text-black" />
                  </div>
                  <h3 className="font-black text-black text-sm uppercase">
                    Top Candidates
                  </h3>
                </div>
                <div className="space-y-3">
                  {response.topCandidates.map((candidate, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-300 flex items-center justify-center text-black font-black text-sm shrink-0 border-2 border-black">
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-black text-sm">
                            {candidate.name}
                          </h4>
                          <p
                            className="text-sm text-gray-700 font-medium mt-1 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: candidate.highlight.replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong class="text-black font-black">$1</strong>',
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Concerns / Red Flags */}
            {response.concerns?.length > 0 && (
              <div className="p-5 bg-orange-200 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-white rounded-lg border-2 border-black">
                    <AlertTriangle className="w-4 h-4 text-black" />
                  </div>
                  <h3 className="font-black text-black text-sm uppercase">
                    Potential Concerns
                  </h3>
                </div>
                <ul className="space-y-2">
                  {response.concerns.map((concern, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-black font-medium leading-relaxed"
                    >
                      <span className="text-black mt-1 font-black">•</span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: concern.replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong class="text-black font-black">$1</strong>',
                          ),
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Next Steps */}
            {response.nextSteps?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-cyan-300 rounded-lg border-2 border-black">
                    <CheckCircle2 className="w-4 h-4 text-black" />
                  </div>
                  <h3 className="font-black text-black text-sm uppercase">
                    Recommended Next Steps
                  </h3>
                </div>
                <div className="space-y-2">
                  {response.nextSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-cyan-100 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <ArrowRight className="w-4 h-4 text-black mt-0.5 shrink-0" />
                      <p
                        className="text-sm text-black font-medium leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: step.replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong class="text-black font-black">$1</strong>',
                          ),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && !error && (
          <div className="pt-6 border-t-4 border-black">
            <p className="text-xs font-black text-black uppercase tracking-wider mb-3 bg-gray-100 inline-block px-3 py-1.5 rounded-lg border-2 border-black">
              Previous Questions
            </p>
            <div className="space-y-3">
              {history.slice(0, 5).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(item.prompt);
                    dispatch(setActiveResponse(item.response));
                    dispatch(clearAIError());
                  }}
                  className="w-full text-left p-4 bg-yellow-200 hover:bg-yellow-300 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group"
                >
                  <p className="text-sm font-black text-black group-hover:text-purple-700 transition-colors">
                    {item.prompt}
                  </p>
                  <p className="text-xs text-black font-medium mt-1 line-clamp-1">
                    {item.response?.summary || "View analysis"}
                  </p>
                  <p className="text-[10px] text-black/70 font-bold mt-1">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}