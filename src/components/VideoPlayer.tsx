
import React from 'react';
import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  videoId: string | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  if (!videoId) {
    return (
      <Card className="w-full aspect-video bg-learning-100 flex items-center justify-center">
        <p className="text-learning-500">Select a video to start learning</p>
      </Card>
    );
  }

  return (
    <div className="w-full aspect-video">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
