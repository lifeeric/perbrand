'use client';

import { FontSelector } from '@/components/shared/FontSelector';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { fontsMap } from '@/config/fonts';
import { brandKitsSettingsSchema } from '@/types/schemas';
import { Pure, TFont, TFontName, TFontPalette, TStatus } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brand } from '@prisma/client';
import { ChevronsUpDown, ThumbsUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ColorPalette } from '../../carrousel/_components/sidebar/ColorPalette';
import { ColorPaletteSelect } from '../../carrousel/_components/sidebar/ColorPaletteSelector';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { saveBrandKit } from '@/app/_actions/settings-actions';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Dropzone } from '@/components/shared/dropzone/Dropzone';
import {
    TExtendedFile,
    Thumbnails,
} from '@/components/shared/dropzone/Thumbnails';
import { uploadFileToCloudinary } from '@/app/_actions/shared-actions';
import { FontPaletteSelector } from '../../carrousel/_components/sidebar/Sidebar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
// import { uploadFileToCloudinary } from '@/lib/utils';

type BrandKitEditFormProps = {
    defaultValues: Omit<Pure<Brand>, 'author' | 'authorId'>;
    onSave: () => void;
};
export function BrandKitEditForm({
    defaultValues,
    onSave,
}: BrandKitEditFormProps) {
    const form = useForm({
        resolver: zodResolver(brandKitsSettingsSchema),
        defaultValues,
    });

    const { data: session } = useSession();
    const router = useRouter();
    const formattedPicture: TExtendedFile[] = defaultValues.imageUrl
        ? ([{ preview: defaultValues.imageUrl }] as TExtendedFile[])
        : [];
    const [pictures, setPictures] = useState<TExtendedFile[]>(formattedPicture);
    const [colorsPopOverisOpen, setColorsPopOverisOpen] = useState(false);
    const [fontsPopOverisOpen, setFontsPopOverisOpen] = useState(false);
    const [isNewPicture, setIsNewPicture] = useState(false);
    const [status, setStatus] = useState<TStatus>('idle');

    const onDrop = (acceptedFiles: File[]) => {
        const fileWithPreview = acceptedFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
        )[0];
        setPictures(() => [fileWithPreview]);
        form.setValue('imageUrl', fileWithPreview.preview);
        setIsNewPicture(true);
    };

    const onSubmit = async (data: Omit<Pure<Brand>, 'author' | 'authorId'>) => {
        setStatus('loading');
        console.log(data);

        const formData = new FormData();
        formData.append('file', pictures[0]);

        if (isNewPicture) {
            const cloudinaryResponse = await uploadFileToCloudinary(formData);
            console.log('cld response!', cloudinaryResponse);
            data.imageUrl = cloudinaryResponse.url as string;
        }
        await saveBrandKit(
            { ...data, id: form.getValues('id') },
            session!.user.id
        );
        setStatus('success');
        router.refresh();
        toast.success('Marca guardada');
        setStatus('idle');
        setIsNewPicture(false);
        onSave();
    };
    const onError = (error: any) => {};

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                                <Input placeholder='Ricardo Sala' {...field} />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='handle'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Handle</FormLabel>
                            <FormControl>
                                <Input placeholder='@ric_sala' {...field} />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='imageUrl'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Foto de perfil</FormLabel>
                            <FormControl>
                                <div className='flex gap-4 justify-stretch items-center'>
                                    <Thumbnails
                                        files={pictures}
                                        classNamesThumbnails='h-24 w-24 rounded-full'
                                    />
                                    <Dropzone
                                        onDrop={onDrop}
                                        className='h-28 py-2 flex flex-col items-center justify-center flex-grow'
                                    ></Dropzone>
                                </div>
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='colorPalette'
                    render={({ field }) => (
                        <FormItem className='flex gap-2 justify-start items-center'>
                            <FormLabel>Colores</FormLabel>
                            <FormControl>
                                <Popover
                                    open={colorsPopOverisOpen}
                                    onOpenChange={setColorsPopOverisOpen}
                                >
                                    <PopoverTrigger
                                        className='w-full flex items-center justify-between !mt-0'
                                        asChild
                                    >
                                        <div className='cursor-pointer flex items-center'>
                                            {/* Colores */}
                                            <ColorPalette
                                                colors={form.getValues(
                                                    'colorPalette'
                                                )}
                                                onClick={() => {}}
                                                className='ml-2 flex justify-center'
                                            />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <>
                                            <ColorPaletteSelect
                                                colorPalette={form.getValues(
                                                    'colorPalette'
                                                )}
                                                onChange={(colorPalette) => {
                                                    setColorsPopOverisOpen(
                                                        false
                                                    );
                                                    form.setValue(
                                                        'colorPalette',
                                                        colorPalette
                                                    );
                                                }}
                                            />
                                        </>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='fontPalette'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fuente (Letra)</FormLabel>
                            <FormControl>
                                <FontPaletteSelector
                                    fontPalette={form.watch('fontPalette')}
                                    setFontByType={(
                                        type: TFont,
                                        font: TFontName
                                    ) => {
                                        console.log('type', type);
                                        form.setValue(
                                            `fontPalette.${type}`,
                                            font
                                        );
                                    }}
                                />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type='submit'
                    className='mt-4'
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Guardando...' : 'Guardar'}
                </Button>
            </form>
        </Form>
    );
}
