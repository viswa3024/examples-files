import { useState } from "react";

const ChatImage = ({
  src,
  handleDownload,
}: {
  src: string;
  handleDownload: (url: string, fileName?: string) => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`relative w-[200px] h-[150px] overflow-hidden rounded group
        ${!loaded && !error ? "bg-gray-100 animate-pulse" : ""} 
        ${error ? "bg-red-100 flex items-center justify-center" : ""}
      `}
    >
      {!error ? (
        <img
          src={src}
          alt="chat-img"
          className={`w-full h-full object-cover rounded transform-gpu transition-transform duration-300
            ${loaded ? "group-hover:scale-[1.02] group-hover:brightness-102" : "opacity-0"}
          `}
          style={{
            transformOrigin: "center",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-sm text-red-600">Image failed</span>
      )}

      {/* ✅ Show download only if image is loaded */}
      {loaded && !error && (
        <button
          onClick={() => handleDownload(src, "test-image.jpg")}
          className="absolute bottom-1 right-1 text-gray-600 hover:text-gray-900 bg-white/70 rounded-full p-1"
          title="Download"
        >
          ⬇️
        </button>
      )}
    </div>
  );
};



==================


  const ChatImage = ({ src, handleDownload }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If image is cached, mark loaded immediately
    const img = imageRef.current;
    if (img?.complete && img.naturalWidth) setLoaded(true);
  }, [src]);

  return (
    <div className="...">
      <img ref={imageRef} src={src} onLoad={() => setLoaded(true)} onError={() => setError(true)} />
      {loaded && !error && <button onClick={() => handleDownload(src)}>⬇️</button>}
    </div>
  );
};

