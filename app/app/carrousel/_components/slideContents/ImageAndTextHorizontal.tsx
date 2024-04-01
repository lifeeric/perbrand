import { TBrand } from '@/types/types';
import Image from 'next/image';
import { SlideGradientBlob } from '../slideParts/SlideGradientBlob';
import { ArrowLeftIcon, ArrowRight } from 'lucide-react';
import { useContext } from 'react';
import { CarouselContext } from '../ContextProvider';
import SimpleEditor from '@/components/simple-editor/SimpleEditor';

type ImageAndTextVertical = {
    brand: TBrand;
    title: string;
    description: string;
    image: string;
    imageLocation?: 'left' | 'right';
    imageCaption?: string;
};

export const ImageAndTextHorizontal = ({
    brand,
    title,
    description,
    image,
    imageLocation = 'right',
    imageCaption,
}: ImageAndTextVertical) => {
    const ArrowElement = imageLocation === 'right' ? ArrowRight : ArrowLeftIcon;

    const {
        editTitle,
        carousel: { slides },
        editParagraphN,
    } = useContext(CarouselContext);

    const isTitleShown = slides[0].title?.isShown;
    const isDescriptionShown = slides[0].paragraphs[0]?.isShown;
    const editFirstParagraph = editParagraphN.bind(null, 0);

    return (
        <div className='flex flex-col h-full p-2 py-6 gap-6 isolate z-10'>
            <div>
                <SimpleEditor
                    defaultValue={title}
                    onDebouncedUpdate={editTitle}
                    slideElement='title'
                    isShown={isTitleShown}
                />
                <SimpleEditor
                    defaultValue={description}
                    onDebouncedUpdate={editFirstParagraph}
                    slideElement='paragraph'
                    isShown={isDescriptionShown}
                />
            </div>
            <div
                className='flex items-center'
                style={{
                    flexDirection:
                        imageLocation === 'left' ? 'row' : 'row-reverse',
                }}
            >
                <div className='relative w-fit'>
                    <SlideGradientBlob brand={brand} className='blur-3xl' />
                    <div
                        className='relative h-44 overflow-hidden w-44'
                        style={{
                            borderRadius: '0.5rem',
                        }}
                    >
                        <Image
                            src={image}
                            loader={()=> image + Date.now()}
                            alt='image'
                            fill
                            className='object-cover h-full'
                        />
                    </div>
                </div>
                <ArrowElement
                    size={48}
                    style={{
                        color: brand.colorPalette.accent,
                        marginRight: imageLocation === 'right' ? '-1rem' : 0,
                        marginLeft: imageLocation === 'left' ? '-1rem' : 0,
                        zIndex: 10,
                    }}
                />

                <SimpleEditor
                    defaultValue={imageCaption}
                    // onDebouncedUpdate={editParagraphs}
                    slideElement='imageCaption'
                    isShown={true}
                />
            </div>
        </div>
    );
};
