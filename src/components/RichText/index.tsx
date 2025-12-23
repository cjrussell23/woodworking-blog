import { ImageBlock } from '@/blocks/ImageBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  RichText as ConvertRichText,
  JSXConvertersFunction,
  LinkJSXConverter,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ImageGalleryBlock } from '@/blocks/ImageGallery/Component'
import { LayoutBlock } from '@/blocks/Layout/Component'
import { VideoBlock } from '@/blocks/VideoBlock/Component'
import { YouTubeEmbedBlock } from '@/blocks/YouTubeEmbed/Component'
import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  ImageBlock as ImageBlockProps,
  ImageGallery as ImageGalleryProps,
  LayoutBlock as LayoutBlockProps,
  VideoBlock as VideoBlockProps,
  YouTubeEmbedBlock as YouTubeEmbedBlockProps,
} from '@/payload-types'
import { cn } from '@/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | CTABlockProps
      | ImageBlockProps
      | BannerBlockProps
      | CodeBlockProps
      | ImageGalleryProps
      | LayoutBlockProps
      | VideoBlockProps
      | YouTubeEmbedBlockProps
    >

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    imageBlock: ({ node }) => (
      <ImageBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    imageGallery: ({ node }) => <ImageGalleryBlock className="col-start-2 mb-4" {...node.fields} />,
    layout: ({ node }) => <LayoutBlock {...node.fields} />,
    videoBlock: ({ node }) => (
      <VideoBlock
        className="col-start-1 col-span-3"
        videoClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    youtubeEmbed: ({ node }) => <YouTubeEmbedBlock className="col-start-2" {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
