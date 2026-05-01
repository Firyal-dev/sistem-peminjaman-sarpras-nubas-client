import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface imagePhotoViewProps {
    src: string
    alt: string
    className: string
}

export const ImagePhotoView = ({src, alt, className}: imagePhotoViewProps) => {
    return (
        <PhotoProvider>
            <PhotoView src={src}>
                <img src={src} alt={alt} className={className} />
            </PhotoView>
        </PhotoProvider>
    )
}