"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";

const Slider = dynamic(() => import("@/components/ui/slider").then(mod => mod.Slider), {
  ssr: false
});

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PlaybackControllerProps {
  messages: Message[];
  onPlayMessage: (message: Message) => void;
  onAddMessage: () => void;
  darkMode?: boolean;
}

export default function PlaybackController({
  messages,
  onPlayMessage,
  onAddMessage,
  darkMode = false
}: PlaybackControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [hasAddedMessages, setHasAddedMessages] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && currentIndex < messages.length) {
      onPlayMessage(messages[currentIndex]);
      timer = setTimeout(() => {
        if (currentIndex < messages.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setIsPlaying(false);
          setCurrentIndex(0);
        }
      }, 2000 / playbackSpeed);
    }

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, messages, playbackSpeed]);

  // 重置消息添加状态
  useEffect(() => {
    if (messages.length === 0) {
      setHasAddedMessages(false);
    }
  }, [messages]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      // 只有在当前没有播放且消息列表为空且尚未添加过消息时才添加新消息
      // 这样可以避免重复添加消息和创建多个预览窗口
      if (messages.length === 0 && !hasAddedMessages) {
        onAddMessage();
        setHasAddedMessages(true);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlayPause}
            className={darkMode ? 'text-white hover:bg-gray-700' : ''}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className={darkMode ? 'text-white hover:bg-gray-700' : ''}
          >
            <RotateCcw size={20} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <FastForward size={16} className={darkMode ? 'text-white' : ''} />
          <Slider
            value={[playbackSpeed]}
            min={0.5}
            max={2}
            step={0.5}
            onValueChange={(value) => setPlaybackSpeed(value[0])}
            className="w-32"
          />
          <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-600'}`}>
            {playbackSpeed}x
          </span>
        </div>
      </div>

      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{
            width: `${messages.length === 0 ? 0 : (currentIndex / Math.max(messages.length - 1, 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}