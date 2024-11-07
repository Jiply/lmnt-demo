"use client";
import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const lmnt = require("lmnt-node");
const speech = new lmnt.Speech("af1fb0f85cb548d59c97066b0c8128ac");

const api = {
  textToSpeech: async (text: string, voiceName: string) => {
    const audio = await speech.synthesize(text, voiceName);
    return audio;
  },

  getVoices: async () => {
    const voices = await speech.fetchVoices();
    return voices;
  },
};

export default function Page() {
  const [input, setInput] = useState<string>("");
  const [voice, setVoice] = useState<string>("");
  const [voices, setVoices] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  async function handleSynthesizeSpeech() {
    const text = "This is a test text for LMNT TTS API"; // Sample text

    try {
      const speech = await api.textToSpeech(text, voice);
      console.log(speech);
    } catch (error) {
      console.error("Error fetching speech:", error);
      if (error instanceof Error) setError(error.message);
      setAudioUrl(null);
    }
  }

  async function getVoices() {
    try {
      const v = await api.getVoices();
      setVoices(v);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getVoices();
  }, []);

  return (
    <div className="h-dvh flex flex-col divide-y w-full">
      <main className="grow">
        <div className="h-0 min-h-full flex divide-x">
          <div className="w-[32rem] flex flex-col overflow-y-auto p-8 space-y-8">
            {voices.map((v) => (
              <Card key={v.id} onClick={() => setVoice(v.id)}>
                <CardHeader>
                  <CardTitle>{v.name}</CardTitle>
                  <CardDescription>Gender: {v.gender}</CardDescription>
                </CardHeader>
                <CardContent>{v.description}</CardContent>
              </Card>
            ))}
          </div>
          <div className="grow">
            <div className="h-0 min-h-full flex flex-col">
              <div className="grow">
                <div className="p-4 border-b">Selected: {voice}</div>
                <div className="h-0 min-h-full">
                  <div>
                    {error && (
                      <p className="text-destructive">Error: {error}</p>
                    )}
                    {audioUrl && (
                      <div>
                        <p>Speech synthesized successfully!</p>
                        <audio controls src={audioUrl}>
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 p-8">
                <Textarea
                  value={input}
                  className="grow"
                  placeholder="Get a voice clone"
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button
                  size="icon"
                  className="shrink-0"
                  onClick={handleSynthesizeSpeech}
                >
                  <Send />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center py-8">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/jiply"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://jeremysoo.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Website
        </a>
      </footer>
    </div>
  );
}
