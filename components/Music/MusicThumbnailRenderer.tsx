import { useLayoutEffect, useState } from "react";
function imageExists(url: string) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      if (img.height === 90 && img.width === 120) resolve(false);
      resolve(true);
    };
    img.onloadedmetadata = (ev) => {
      console.log(ev);
    };
    img.onerror = () => resolve(false);
    img.onabort = () => resolve(false);
    img.oncancel = () => resolve(false);
    img.src = url;
  });
}
export const MusicThumbnailRenderer = (props: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { src, className, style } = props;
  const [thumbnail, setThumbnail] = useState(src);
  useLayoutEffect(() => {
    setThumbnail(src);
    imageExists(src).then((exists) => {
      if (!exists) {
        setThumbnail(src.replace("maxresdefault", "hqdefault"));
        return;
      }
    });
  }, [src]);

  return <img className={className} src={thumbnail} />;
};
