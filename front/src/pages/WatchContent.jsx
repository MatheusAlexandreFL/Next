import ReactPlayer from "react-player";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";

import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { listarConteudos } from "../store/contentSlice";

function WatchContent() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const contents = useSelector(state => state.content.items);
  const status = useSelector(state => state.content.status);
  
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (contents.length === 0 && status === 'idle') {
      dispatch(listarConteudos());
    } else {
      let foundUrl = '';
      for (const content of contents) {
        if (content.tipo_midia === 'filme' && content._id === id) {
          foundUrl = content.filme?.url_filme;
          break;
        } else if (content.tipo_midia === 'serie' && content.temporadas) {
          for (const temporada of content.temporadas) {
            const ep = temporada.episodios?.find(e => e._id === id);
            if (ep) {
              foundUrl = ep.url_ep;
              break;
            }
          }
          if (foundUrl) break;
        }
      }
      
      // Fallback url se não encontrar (ou para testes se o BD não tiver urls válidas)
      setSrc(foundUrl || 'https://www.youtube.com/watch?v=C5tn1MvXsLw');
    }
  }, [id, contents, status, dispatch]);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center font-sans">
      
      <MediaController 
        className="w-full max-w-5xl aspect-video relative group"
        style={{
          "--media-primary-color": "#ffffff",
          "--media-secondary-color": "rgba(255, 255, 255, 0.7)",
          "--media-range-track-background": "rgba(255, 255, 255, 0.3)",
          "--media-range-bar-color": "#B30FAB", 
          "--media-range-thumb-background": "#F32DAE",
          "--media-control-background": "transparent",
          "--media-control-hover-background": "rgba(255, 255, 255, 0.1)",
        }}
      >
        <ReactPlayer
          slot="media"
          src={src}
          width="100%"
          height="100%"
          controls={false}
          playing={true}
          config={{
            youtube: {
              playerVars: { modestbranding: 1, showinfo: 0, rel: 0 }
            }
          }}
        />

        {}
        <MediaControlBar 
          className="absolute bottom-0 w-full flex items-center px-4 pt-12 pb-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <MediaPlayButton className="mr-2" />
          
          <MediaTimeRange className="flex-grow mx-3" />
          
          <MediaTimeDisplay className="text-sm font-medium mr-4" />
          <MediaMuteButton />
          <MediaVolumeRange className="w-24 mr-2" />
          <MediaPlaybackRateButton className="mr-2" />
          <MediaFullscreenButton />
        </MediaControlBar>

      </MediaController>
    </div>
  );
}

export default WatchContent;