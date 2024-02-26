type BackgroundProps = {
    imageUrl: string;
    opacity?: number;
};
export function Background({ imageUrl, opacity }: BackgroundProps) {
    return (
        <div
            className='w-full h-full absolute top-0 left-0 opacity-60'
            style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity,
            }}
        />
    );
}
