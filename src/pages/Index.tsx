import React, { useState } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ContentPanel } from '@/components/ContentPanel';
import { InteractiveNotes } from '@/components/InteractiveNotes';
import { Sidebar } from '@/components/Sidebar';
import { useToast } from '@/hooks/use-toast';
import { YouTubeVideo, fetchPlaylistVideos } from '@/utils/youtube';
import { supabase } from '@/integrations/supabase/client';
import { InteractiveNotes as InteractiveNotesType } from '@/types/notes';
import { BookOpen } from 'lucide-react';

const Index = () => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [notesData, setNotesData] = useState<InteractiveNotesType | null>(null);
  const [playlist, setPlaylist] = useState<YouTubeVideo[]>([]);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const { toast } = useToast();

  const handlePlaylistSubmit = async (url: string) => {
    setIsLoadingPlaylist(true);
    try {
      const videos = await fetchPlaylistVideos(url);
      setPlaylist(videos);
      toast({
        title: "Success",
        description: `Loaded ${videos.length} videos from playlist`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load playlist",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPlaylist(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!activeVideoId) {
      toast({
        title: "Error",
        description: "Please select a video first",
        variant: "destructive",
      });
      return;
    }

    setNotesData(null); // Clear any existing notes
    const activeVideo = playlist.find(video => video.id === activeVideoId);
    if (!activeVideo) {
      toast({
        title: "Error",
        description: "Video not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('generate-summary', {
        body: {
          videoTitle: activeVideo.title,
          videoId: activeVideo.id,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setContent(response.data.summary);
      toast({
        title: "Success",
        description: "Summary generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNotes = async () => {
    if (!activeVideoId) {
      toast({
        title: "Error",
        description: "Please select a video first",
        variant: "destructive",
      });
      return;
    }

    setContent(null); // Clear any existing summary
    const activeVideo = playlist.find(video => video.id === activeVideoId);
    if (!activeVideo) {
      toast({
        title: "Error",
        description: "Video not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('generate-notes', {
        body: {
          videoTitle: activeVideo.title,
          videoId: activeVideo.id,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setNotesData(response.data.notes);
      toast({
        title: "Success",
        description: "Interactive notes generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate notes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section - Only show when no playlist */}
      {playlist.length === 0 && (
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-learning-800">
            Transform YouTube Learning
          </h1>
          <p className="text-lg text-learning-600 max-w-2xl mx-auto">
            Convert any educational YouTube video into interactive study materials. Get summaries, notes, and quizzes instantly.
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <Sidebar
            playlist={playlist}
            activeVideoId={activeVideoId}
            onVideoSelect={setActiveVideoId}
            onPlaylistSubmit={handlePlaylistSubmit}
            isLoading={isLoadingPlaylist}
          />
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9">
          {activeVideoId ? (
            <div className="space-y-8">
              <div className="w-full h-[600px] bg-black rounded-xl shadow-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <ContentPanel
                isLoading={isLoading}
                content={content}
                onGenerateSummary={handleGenerateSummary}
                onCreateNotes={handleCreateNotes}
                showSummary={!notesData}
              />
              {notesData && <InteractiveNotes notes={notesData} />}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-learning-200">
              <BookOpen className="h-12 w-12 text-learning-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-learning-800 mb-2">
                Start Your Learning Journey
              </h3>
              <p className="text-learning-600 max-w-md mx-auto">
                Enter a YouTube playlist URL in the sidebar to begin. We'll help you learn more effectively with summaries and interactive notes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
