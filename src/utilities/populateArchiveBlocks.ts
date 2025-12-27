import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Payload, Where } from 'payload'

/**
 * Recursively traverses Lexical content and populates archive blocks with posts
 */
export async function populateArchiveBlocks(
  content: DefaultTypedEditorState,
  payload: Payload,
): Promise<DefaultTypedEditorState> {
  if (!content || !content.root || !content.root.children) {
    return content
  }

  const populatedChildren = await populateArchiveBlocksRecursive(content.root.children, payload)

  return {
    ...content,
    root: {
      ...content.root,
      children: populatedChildren as typeof content.root.children,
    },
  }
}

async function populateArchiveBlocksRecursive(
  children: unknown[],
  payload: Payload,
): Promise<unknown[]> {
  const promises = children.map(async (node: unknown) => {
    const typedNode = node as Record<string, unknown>

    // Check if this is an archive block node
    if (
      typedNode.type === 'block' &&
      (typedNode.fields as Record<string, unknown>)?.blockType === 'archive'
    ) {
      const blockFields = typedNode.fields as Record<string, unknown>

      // Only populate if populateBy is 'collection'
      if (blockFields.populateBy === 'collection') {
        const relationTo = (blockFields.relationTo as string) || 'posts'
        const categories = blockFields.categories as unknown[] | undefined
        const limit = (blockFields.limit as number) || 10

        // Build the query
        const query: Where = {
          _status: { equals: 'published' },
        }

        // Filter by categories if specified
        if (categories && categories.length > 0) {
          const categoryIds = categories.map((cat) =>
            typeof cat === 'object' && cat !== null ? (cat as { id: string }).id : cat,
          )

          query.categories = {
            in: categoryIds,
          }
        }

        try {
          // Fetch posts based on the archive block settings
          const posts = await payload.find({
            collection: relationTo as 'posts',
            where: query,
            limit,
            depth: 1,
            overrideAccess: false,
            select: {
              title: true,
              slug: true,
              categories: true,
              meta: true,
            },
          })

          // Add the populated posts to the node fields
          return {
            ...typedNode,
            fields: {
              ...blockFields,
              populatedDocs: posts.docs,
            },
          }
        } catch (error) {
          console.error('Error populating archive block:', error)
        }
      }
    }

    // Recursively process children if they exist
    if (typedNode.children && Array.isArray(typedNode.children)) {
      return {
        ...typedNode,
        children: await populateArchiveBlocksRecursive(typedNode.children, payload),
      }
    }

    return node
  })

  return Promise.all(promises)
}
