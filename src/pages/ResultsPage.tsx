import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface CareerScore {
  career: string;
  A: number;
  B: number;
  S: number;
  S_final: number;
  ci?: number[];
}

interface CounterfactualSuggestion {
  career: string;
  current_score: number;
  suggestions: string[];
}

interface PredictionData {
  topCareer: {
    main: string;
    sub: string;
  };
  topN: CareerScore[];
  reasons: string[];
  lowConfidence: boolean;
  counterfactuals?: CounterfactualSuggestion[];
}

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get("assessmentId");
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!assessmentId) {
        setError("Assessment ID not provided in URL.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/ml/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ assessmentId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch prediction.");
        }

        const result = await response.json();
        if (result.success && result.data) {
          setPrediction(result.data);
        } else {
          setError("Invalid response from prediction service.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Analyzing your assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Link to="/">
              <Button className="w-full">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">No prediction data available.</p>
            <Link to="/questionnaire">
              <Button className="w-full">Start New Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { topCareer, topN, reasons, lowConfidence, counterfactuals } = prediction;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle blob background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <svg
          className="absolute top-20 left-10 w-96 h-96 opacity-5 animate-float"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            className="text-primary"
            d="M47.1,-57.9C59.9,-49.1,68.4,-33.3,71.6,-16.2C74.8,0.9,72.7,19.3,64.3,35.1C55.9,50.9,41.2,64.1,24.3,69.8C7.4,75.5,-11.7,73.7,-28.4,66.4C-45.1,59.1,-59.4,46.3,-66.8,30.2C-74.2,14.1,-74.7,-5.3,-69.3,-22.4C-63.9,-39.5,-52.6,-54.3,-38.5,-62.7C-24.4,-71.1,-8.1,-73.1,6.5,-71.4C21.1,-69.7,34.3,-66.7,47.1,-57.9Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute bottom-20 right-10 w-80 h-80 opacity-5 animate-float"
          style={{ animationDelay: "1.6s" }}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            className="text-accent"
            d="M41.3,-54.4C53.4,-45.7,62.7,-33.1,67.5,-18.8C72.3,-4.5,72.6,11.5,67.1,25.7C61.6,39.9,50.3,52.3,36.6,59.4C22.9,66.5,6.8,68.3,-9.7,66.1C-26.2,63.9,-43.1,57.7,-54.8,47.1C-66.5,36.5,-73,21.5,-73.9,6.1C-74.8,-9.3,-70.1,-25.1,-60.5,-37.4C-50.9,-49.7,-36.4,-58.5,-21.8,-65.1C-7.2,-71.7,7.5,-76.1,21.3,-73.1C35.1,-70.1,48,-59.7,41.3,-54.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Ethical Disclaimer Banner */}
        <Card className="rounded-2xl border-2 border-primary/20 bg-primary/5 shadow-md mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-lg">Important: This is Guidance, Not Destiny</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These results are <strong>one perspective</strong> based on your current responses, not a definitive answer about your future.
                  Career success depends on <strong>passion, effort, and continuous learning</strong> — not just initial scores.
                  Many people thrive in careers they weren't "predicted" for. <strong>Explore freely</strong> and don't let these results limit your ambitions.
                  Consider consulting with career counselors and professionals for personalized advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Winner Card */}
        <Card className="rounded-2xl border bg-background shadow-md mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                    {topCareer.main} — {topCareer.sub}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Recommended Career Path
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Confidence:</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      lowConfidence
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {lowConfidence ? "Moderate" : "High"}
                  </span>
                </div>
              </div>

              {/* A/B/S Scores */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 rounded-lg border bg-card">
                  <div className="text-2xl font-bold text-primary">
                    {topN[0]?.A.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Academic</div>
                </div>
                <div className="text-center p-3 rounded-lg border bg-card">
                  <div className="text-2xl font-bold text-primary">
                    {topN[0]?.B.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Behavioral</div>
                </div>
                <div className="text-center p-3 rounded-lg border bg-card">
                  <div className="text-2xl font-bold text-primary">
                    {topN[0]?.S_final.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Overall</div>
                </div>
              </div>

              {topN[0]?.ci && (
                <div className="text-xs text-muted-foreground text-center">
                  Confidence interval: {topN[0].ci[0].toFixed(0)}–{topN[0].ci[1].toFixed(0)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Why Paragraph */}
        <Card className="rounded-2xl border bg-background shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Why This Match?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {reasons.length > 0
                ? reasons.join(". ") + "."
                : "Your profile aligns well with this career path based on your responses."}
            </p>
          </CardContent>
        </Card>

        {/* Counterfactual Explanations - How to improve alignment with other careers */}
        {counterfactuals && counterfactuals.length > 0 && (
          <Card className="rounded-2xl border bg-background shadow-md mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Interested in Other Careers?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Here's what you could focus on to strengthen your profile for alternative career paths:
              </p>
              <div className="space-y-4">
                {counterfactuals.map((cf, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{cf.career}</h4>
                      <span className="text-sm text-muted-foreground">
                        Current score: {cf.current_score}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {cf.suggestions.map((suggestion, sIdx) => (
                        <li key={sIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">→</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top-N Careers */}
        <Card className="rounded-2xl border bg-background shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Top Career Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topN.slice(0, 5).map((career, idx) => {
                const isTop = idx === 0;
                const barWidth = (career.S_final / topN[0].S_final) * 100;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border transition-all ${
                      isTop ? "bg-primary/5 border-primary/20" : "bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{idx + 1}
                        </span>
                        <span className="font-medium">{career.career}</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {career.S_final.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Academic: {career.A.toFixed(0)}</span>
                      <span>Behavioral: {career.B.toFixed(0)}</span>
                      <span>Combined: {career.S.toFixed(0)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Low Confidence Notice */}
        {lowConfidence && (
          <Card className="rounded-2xl border border-muted bg-muted/5 shadow-md mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="text-muted-foreground">ℹ️</div>
                <div>
                  <h3 className="font-medium mb-1">Multiple Strong Matches</h3>
                  <p className="text-sm text-muted-foreground">
                    Your profile shows alignment with several career paths. Consider exploring
                    the top alternatives listed above to find the best fit for your goals and
                    interests.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Growth Mindset & Exploration Card */}
        <Card className="rounded-2xl border bg-background shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Remember: Skills Are Learnable 🌱</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="leading-relaxed">
                <strong>Don't see your dream career ranked highly?</strong> That's okay! Research shows that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Most career-relevant skills can be learned with dedicated practice</li>
                <li>Passion and persistence often matter more than initial aptitude</li>
                <li>Many successful professionals started with lower scores in their field</li>
                <li>Career paths are rarely linear — people change careers 5-7 times on average</li>
              </ul>
              <p className="leading-relaxed pt-2">
                <strong>Next Steps:</strong> Research the career that excites you most, talk to professionals in that field,
                take online courses, and gain practical experience. Your future is shaped by your choices and effort,
                not by today's assessment scores.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link to="/questionnaire">
            <Button variant="outline" className="min-w-[150px]">
              Retake Assessment
            </Button>
          </Link>
          <Button disabled className="min-w-[150px]" variant="secondary">
            View Skill Roadmap
          </Button>
          <a
            href="https://www.mynextmove.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[150px]"
          >
            <Button variant="outline" className="w-full">
              Explore All Careers
            </Button>
          </a>
        </div>

        {/* Data Privacy & Ethics Notice */}
        <div className="mt-12 text-center text-xs text-muted-foreground">
          <p>
            Your responses are used only to generate recommendations. We do not share or sell your data.
            Model accuracy: ~82% for main careers. Results may contain biases from training data.
          </p>
        </div>
      </div>
    </div>
  );
}
