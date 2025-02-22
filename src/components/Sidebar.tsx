
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Clock, Loader2 } from "lucide-react";
import { YouTubeVideo } from "@/utils/youtube";

interface SidebarProps {
  playlist: YouTubeVideo[];
  activeVideoId: string | null;
  onVideoSelect: (videoId: string) => void;
  onPlaylistSubmit: (url: string) => void;
  isLoading?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  playlist,
  activeVideoId,
  onVideoSelect,
  onPlaylistSubmit,
  isLoading = false,
}) => {
  const [url, setUrl] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaylistSubmit(url);
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            placeholder="Enter YouTube playlist URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load Playlist"
            )}
          </Button>
        </form>
      </div>
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-learning-100 rounded mb-2" />
                <div className="h-4 bg-learning-100 rounded w-3/4" />
                <div className="h-3 bg-learning-100 rounded w-1/4 mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.map((video) => (
              <button
                key={video.id}
                onClick={() => onVideoSelect(video.id)}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  activeVideoId === video.id
                    ? "bg-learning-100"
                    : "hover:bg-learning-50"
                }`}
              >
                <div className="relative aspect-video mb-2">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="rounded object-cover w-full h-full"
                  />
                  {activeVideoId === video.id && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                <div className="flex items-center text-xs text-learning-500 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {video.duration}
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
