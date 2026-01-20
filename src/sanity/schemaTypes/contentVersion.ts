import { defineField, defineType } from 'sanity'

export const contentVersion = defineType({
  name: 'contentVersion',
  title: 'Content Version',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'object',
      fields: [
        defineField({
          name: 'accentColor',
          title: 'Accent Color (Hex)',
          type: 'string',
          description: 'e.g. #FF0055',
        }),
        defineField({
          name: 'backgroundVariant',
          title: 'Background Variant',
          type: 'string',
          options: {
            list: [
              { title: 'Dark', value: 'dark' },
              { title: 'Light', value: 'light' },
              { title: 'Neon', value: 'neon' },
            ],
            layout: 'radio',
          },
        }),
      ],
    }),
    defineField({
      name: 'covers',
      title: 'Covers (4 Images)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }] }],
      validation: (rule) => rule.required().min(4).max(4).error('Exactly 4 cover images are required.'),
      description: 'First image will be the Hero image.',
    }),
    defineField({
      name: 'lyrics',
      title: 'Lyrics',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'epubFile',
      title: 'EPUB File',
      type: 'file',
      options: {
        accept: '.epub,application/epub+zip',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'audioFile',
      title: 'Legacy Audio File',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
      hidden: true, // Hide legacy field
      description: 'Deprecated. Use Tracks instead.',
    }),
    defineField({
      name: 'tracks',
      title: 'Tracks',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Track',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Track Title', validation: rule => rule.required() }),
            defineField({ name: 'audioFile', type: 'file', title: 'Audio File', options: { accept: 'audio/*' }, validation: rule => rule.required() }),
            defineField({
              name: 'lrc',
              title: 'LRC Lyrics',
              type: 'text',
              rows: 10,
              description: 'Paste .lrc content here. Format: [mm:ss.xx] Lyric text',
            }),
          ]
        }
      ]
    }),
  ],
})
