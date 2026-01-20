import { groq } from "next-sanity";

export const VERSIONS_QUERY = groq`
  *[_type == "contentVersion" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    theme,
    covers,
    publishedAt
  }
`;

export const VERSION_BY_SLUG_QUERY = groq`
  *[_type == "contentVersion" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    theme,
    covers,
    lyrics,
    "epubURL": epubFile.asset->url,
    "audioURL": audioFile.asset->url,
    tracks[] {
      title,
      "audioURL": audioFile.asset->url,
      lrc
    },
    publishedAt
  }
`;
