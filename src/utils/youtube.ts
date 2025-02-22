
import { supabase } from "@/integrations/supabase/client";

export interface YouTubeVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

export const extractPlaylistId = (url: string) => {
  const regex = /[?&]list=([^#\&\?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const fetchPlaylistVideos = async (url: string): Promise<YouTubeVideo[]> => {
  const playlistId = extractPlaylistId(url);
  if (!playlistId) {
    throw new Error('Invalid YouTube playlist URL');
  }

  const response = await supabase.functions.invoke('fetch-youtube-playlist', {
    body: { playlistId },
  });

  if (response.error) {
    throw new Error(response.error.message || 'Failed to fetch playlist');
  }

  return response.data;
};
